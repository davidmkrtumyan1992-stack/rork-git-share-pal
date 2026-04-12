/* eslint-disable @tanstack/query/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { UserUnlockedVow } from '@/types/database';
import { LOCKED_VOW_TYPES } from '@/constants/vows';

export const useUnlockedVows = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);

  const { data: unlockedVows = [], isLoading, refetch } = useQuery({
    queryKey: ['unlocked-vows', user?.id] as const,
    queryFn: async () => {
      if (!user) return [];

      console.log('[useUnlockedVows] Fetching unlocked vows for user:', user.id);

      const { data, error } = await supabase
        .from('user_unlocked_vows')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('[useUnlockedVows] Error fetching unlocked vows:', error);
        return [];
      }

      console.log('[useUnlockedVows] Fetched unlocked vows:', data);
      return data as UserUnlockedVow[];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user || realtimeEnabled) return;

    console.log('[useUnlockedVows] Setting up realtime subscription');

    const channel = supabase
      .channel(`unlocked-vows-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_unlocked_vows',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('[useUnlockedVows] Realtime update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['unlocked-vows', user.id] });
        }
      )
      .subscribe((status) => {
        console.log('[useUnlockedVows] Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          setRealtimeEnabled(true);
        }
      });

    return () => {
      console.log('[useUnlockedVows] Cleaning up realtime subscription');
      supabase.removeChannel(channel);
      setRealtimeEnabled(false);
    };
  }, [user, queryClient, realtimeEnabled]);

  const isVowUnlocked = useCallback(
    (vowType: string): boolean => {
      if (!(LOCKED_VOW_TYPES as readonly string[]).includes(vowType)) {
        return true;
      }
      return unlockedVows.some((uv) => uv.vow_type === vowType);
    },
    [unlockedVows]
  );

  const isVowLocked = useCallback(
    (vowType: string): boolean => {
      return !isVowUnlocked(vowType);
    },
    [isVowUnlocked]
  );

  const getUnlockedVowTypes = useCallback((): string[] => {
    return unlockedVows.map((uv) => uv.vow_type);
  }, [unlockedVows]);

  return {
    unlockedVows,
    isLoading,
    isVowUnlocked,
    isVowLocked,
    getUnlockedVowTypes,
    refetch,
    LOCKED_VOW_TYPES,
  };
};

export const useAdminUnlockedVows = () => {
  const { isOwner, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const searchUserByEmail = useMutation({
    mutationFn: async (email: string) => {
      console.log('[useAdminUnlockedVows] Searching user by email:', email);

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', `%${email}%`);

      if (error) {
        console.error('[useAdminUnlockedVows] Error searching user:', error);
        throw error;
      }

      return profiles;
    },
  });

  const getUserUnlockedVows = useMutation({
    mutationFn: async (userId: string) => {
      if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized');
      }

      console.log('[useAdminUnlockedVows] Fetching unlocked vows for user:', userId);

      const { data, error } = await supabase
        .from('user_unlocked_vows')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('[useAdminUnlockedVows] Error fetching unlocked vows:', error);
        throw error;
      }

      return data as UserUnlockedVow[];
    },
  });

  const unlockVowForUser = useMutation({
    mutationFn: async ({ userId, vowType }: { userId: string; vowType: string }) => {
      if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized');
      }

      console.log('[useAdminUnlockedVows] Unlocking vow for user:', userId, vowType);

      const { data, error } = await supabase
        .from('user_unlocked_vows')
        .insert({
          user_id: userId,
          vow_type: vowType,
        })
        .select()
        .single();

      if (error) {
        console.error('[useAdminUnlockedVows] Error unlocking vow:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['unlocked-vows', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-unlocked-vows', userId] });
    },
  });

  const revokeVowFromUser = useMutation({
    mutationFn: async ({ userId, vowType }: { userId: string; vowType: string }) => {
      if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized');
      }

      console.log('[useAdminUnlockedVows] Revoking vow from user:', userId, vowType);

      const { error } = await supabase
        .from('user_unlocked_vows')
        .delete()
        .eq('user_id', userId)
        .eq('vow_type', vowType);

      if (error) {
        console.error('[useAdminUnlockedVows] Error revoking vow:', error);
        throw error;
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['unlocked-vows', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-unlocked-vows', userId] });
    },
  });

  const bulkUnlockVows = useMutation({
    mutationFn: async ({ userId, vowTypes }: { userId: string; vowTypes: string[] }) => {
      if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized');
      }

      console.log('[useAdminUnlockedVows] Bulk unlocking vows:', userId, vowTypes);

      const inserts = vowTypes.map((vowType) => ({
        user_id: userId,
        vow_type: vowType,
      }));

      const { data, error } = await supabase
        .from('user_unlocked_vows')
        .upsert(inserts, { onConflict: 'user_id,vow_type' })
        .select();

      if (error) {
        console.error('[useAdminUnlockedVows] Error bulk unlocking vows:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['unlocked-vows', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-unlocked-vows', userId] });
    },
  });

  return {
    searchUserByEmail,
    getUserUnlockedVows,
    unlockVowForUser,
    revokeVowFromUser,
    bulkUnlockVows,
    LOCKED_VOW_TYPES,
  };
};
