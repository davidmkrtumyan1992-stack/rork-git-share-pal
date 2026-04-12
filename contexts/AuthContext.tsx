import { useEffect, useState, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import createContextHook from '@nkzw/create-context-hook';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { Profile, UserRole, Language } from '@/types/database';

interface AuthState {
  session: Session | null;
  user: SupabaseUser | null;
  profile: Profile | null;
  roles: UserRole[];
  isLoading: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  language: Language;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    roles: [],
    isLoading: true,
    isAdmin: false,
    isOwner: false,
    language: 'ru',
  });

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) {
        if (__DEV__) console.error('[AuthContext] Profile fetch error:', profileError.message);
      }

      if (profile) {
        if (profile.selected_vow_types && !Array.isArray(profile.selected_vow_types)) {
          profile.selected_vow_types = null;
        }
      }

      let userRoles: UserRole[] = [];
      try {
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId);

        if (rolesError && __DEV__) {
          console.log('[AuthContext] Roles fetch error:', rolesError.message);
        }
        userRoles = (roles || []) as UserRole[];
      } catch (rolesErr) {
        if (__DEV__) console.warn('[AuthContext] Failed to fetch roles:', rolesErr);
      }

      const isAdmin = userRoles.some((r) => r.role === 'admin');
      const isOwner = userRoles.some((r) => r.role === 'owner');

      return {
        profile: profile as Profile | null,
        roles: userRoles,
        isAdmin,
        isOwner,
        language: (profile?.language || 'ru') as Language,
      };
    } catch (error) {
      if (__DEV__) console.error('[AuthContext] Failed to fetch profile (network error):', error);
      return {
        profile: null,
        roles: [] as UserRole[],
        isAdmin: false,
        isOwner: false,
        language: 'ru' as Language,
      };
    }
  }, []);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session }, error }) => {
      // Invalid or expired refresh token — wipe stored session and show login screen
      if (error) {
        const msg = error.message || '';
        if (msg.includes('Refresh Token') || msg.includes('refresh_token') || msg.includes('Invalid')) {
          void supabase.auth.signOut();
        }
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      if (session?.user) {
        void fetchProfile(session.user.id).then((profileData) => {
          setState({
            session,
            user: session.user,
            ...profileData,
            isLoading: false,
          });
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }).catch(() => {
      // Any unexpected error during session load → treat as logged out
      void supabase.auth.signOut().catch(() => {});
      setState((prev) => ({ ...prev, isLoading: false }));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setState({
            session,
            user: session.user,
            ...profileData,
            isLoading: false,
          });
        } else {
          setState({
            session: null,
            user: null,
            profile: null,
            roles: [],
            isLoading: false,
            isAdmin: false,
            isOwner: false,
            language: 'ru',
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }, []);

  const signUp = useCallback(async (
    email: string,
    password: string,
    username: string,
    fullName?: string
  ) => {
    const redirectTo = Platform.OS === 'web'
      ? (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined)
      : 'rork-app://auth/callback';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
          language: 'ru',
        },
        ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
      },
    });

    if (error) throw error;

    if (data.session && data.user) {
      // Poll for profile creation by the DB trigger (max 5s, 500ms intervals)
      let profileData = await fetchProfile(data.user.id);
      if (!profileData.profile) {
        for (let attempt = 0; attempt < 9; attempt++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          profileData = await fetchProfile(data.user.id);
          if (profileData.profile) break;
        }
      }

      setState({
        session: data.session,
        user: data.user,
        ...profileData,
        isLoading: false,
      });
    }

    return data;
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    queryClient.clear();
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!state.user) return;

    const processedUpdates = { ...updates };

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', state.user.id)
      .maybeSingle();

    let data;
    let error;

    if (existingProfile) {
      const result = await supabase
        .from('profiles')
        .update(processedUpdates)
        .eq('user_id', state.user.id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from('profiles')
        .insert({
          user_id: state.user.id,
          username: state.user.email?.split('@')[0] || 'user',
          language: 'ru',
          ...processedUpdates,
        })
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) {
      if (__DEV__) console.error('[AuthContext] Profile update/create error:', error.message);
      throw error;
    }
    
    setState((prev) => ({
      ...prev,
      profile: data as Profile,
      language: (data.language || 'ru') as Language,
    }));
    
    return data;
  }, [state.user]);

  const setLanguage = useCallback(async (language: Language) => {
    if (state.user) {
      await updateProfile({ language });
    } else {
      setState((prev) => ({ ...prev, language }));
    }
  }, [state.user, updateProfile]);

  return useMemo(() => ({
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
    setLanguage,
  }), [state, signIn, signUp, signOut, updateProfile, setLanguage]);
});
