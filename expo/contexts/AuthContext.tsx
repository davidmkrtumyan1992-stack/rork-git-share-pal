import { useEffect, useState, useCallback } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import createContextHook from '@nkzw/create-context-hook';
import { supabase } from '@/lib/supabase';
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
    console.log('[AuthContext] Fetching profile for user:', userId);
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('[AuthContext] Profile fetch error:', profileError.message);
      console.error('[AuthContext] Profile fetch error details:', JSON.stringify(profileError, null, 2));
    }

    if (profile) {
      console.log('[AuthContext] Profile fetched:', {
        userId: profile.user_id,
        hasSelectedVows: !!profile.selected_vow_types,
        vowsType: typeof profile.selected_vow_types,
        vowsIsArray: Array.isArray(profile.selected_vow_types),
        vowsValue: profile.selected_vow_types
      });

      if (profile.selected_vow_types && !Array.isArray(profile.selected_vow_types)) {
        console.warn('[AuthContext] selected_vow_types is not an array, normalizing:', profile.selected_vow_types);
        profile.selected_vow_types = null;
      }
    }

    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);

    if (rolesError) {
      console.log('Roles fetch error:', rolesError.message);
    }

    const userRoles = roles || [];
    const isAdmin = userRoles.some((r) => r.role === 'admin');
    const isOwner = userRoles.some((r) => r.role === 'owner');

    return {
      profile: profile as Profile | null,
      roles: userRoles as UserRole[],
      isAdmin,
      isOwner,
      language: (profile?.language || 'ru') as Language,
    };
  }, []);

  useEffect(() => {
    console.log('Auth context initializing...');
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email || 'none');
      
      if (session?.user) {
        fetchProfile(session.user.id).then((profileData) => {
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
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
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
    console.log('Signing in:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.log('Sign in error:', error.message);
      throw error;
    }
    
    console.log('Sign in successful');
    return data;
  }, []);

  const signUp = useCallback(async (
    email: string,
    password: string,
    username: string,
    fullName?: string
  ) => {
    console.log('Signing up:', email, 'username:', username);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
          language: 'ru',
        },
        emailRedirectTo: 'rork-app://auth/callback',
      },
    });
    
    if (error) {
      console.log('Sign up error:', error.message);
      throw error;
    }
    
    console.log('Sign up successful, session:', data.session ? 'exists' : 'null');
    console.log('User created:', data.user?.email);
    console.log('Email confirmation required:', !data.session);
    
    if (data.session && data.user) {
      console.log('Auto-login successful, fetching profile...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      const profileData = await fetchProfile(data.user.id);
      console.log('Profile data:', profileData);
      
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
    console.log('Signing out...');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.log('Sign out error:', error.message);
      throw error;
    }
    
    console.log('Sign out successful');
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!state.user) {
      console.log('[AuthContext] updateProfile: No user, returning');
      return;
    }
    
    console.log('[AuthContext] Updating profile for user:', state.user.id);
    console.log('[AuthContext] Updates:', JSON.stringify(updates, null, 2));
    
    const processedUpdates = { ...updates };
    if ('selected_vow_types' in processedUpdates && processedUpdates.selected_vow_types !== null) {
      console.log('[AuthContext] Processing selected_vow_types:', processedUpdates.selected_vow_types);
      console.log('[AuthContext] Is array?:', Array.isArray(processedUpdates.selected_vow_types));
    }
    
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', state.user.id)
      .maybeSingle();
    
    let data;
    let error;
    
    if (existingProfile) {
      console.log('Profile exists, updating...');
      const result = await supabase
        .from('profiles')
        .update(processedUpdates)
        .eq('user_id', state.user.id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      console.log('Profile does not exist, creating...');
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
      console.error('[AuthContext] Profile update/create error:', error.message);
      console.error('[AuthContext] Error code:', error.code);
      console.error('[AuthContext] Error details:', JSON.stringify(error, null, 2));
      console.error('[AuthContext] Attempted updates:', JSON.stringify(processedUpdates, null, 2));
      throw error;
    }
    
    console.log('[AuthContext] Profile saved successfully');
    console.log('[AuthContext] Saved data:', JSON.stringify(data, null, 2));
    
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

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
    setLanguage,
  };
});
