/* eslint-disable @tanstack/query/exhaustive-deps */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { VowEntry, VowStatus, VowCyclePosition } from '@/types/database';

export const useVowEntries = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['vow-entries', user?.id] as const,
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching vow entries for user:', user.id);
      const { data, error } = await supabase
        .from('vow_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) {
        console.log('Vow entries fetch error:', error.message);
        throw error;
      }

      return data as VowEntry[];
    },
    enabled: !!user,
  });
};

export const useTodayEntry = (vowType: string | null) => {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['today-entry', user?.id, vowType, today] as const,
    queryFn: async () => {
      if (!user || !vowType) return null;
      
      console.log('Fetching today entry:', vowType, today);
      const { data, error } = await supabase
        .from('vow_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('vow_type', vowType)
        .eq('entry_date', today)
        .maybeSingle();

      if (error) {
        console.log('Today entry fetch error:', error.message);
        throw error;
      }

      return data as VowEntry | null;
    },
    enabled: !!user && !!vowType,
  });
};

export const useTodayEntries = () => {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['today-entries', user?.id, today] as const,
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching all today entries for user:', user.id, today);
      const { data, error } = await supabase
        .from('vow_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', today);

      if (error) {
        console.log('Today entries fetch error:', error.message);
        throw error;
      }

      return data as VowEntry[];
    },
    enabled: !!user,
  });
};

interface CreateVowEntryParams {
  vowType: string;
  status: VowStatus;
  noteText?: string;
  antidoteText?: string;
}

export const useCreateVowEntry = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];

  return useMutation({
    mutationFn: async ({
      vowType,
      status,
      noteText,
      antidoteText,
    }: CreateVowEntryParams) => {
      if (!user) throw new Error('Not authenticated');
      
      console.log('Creating vow entry:', vowType, status, today);

      const { data: existing, error: existingError } = await supabase
        .from('vow_entries')
        .select('id')
        .eq('user_id', user.id)
        .eq('vow_type', vowType)
        .eq('entry_date', today)
        .maybeSingle();

      if (existingError) {
        console.log('Error checking existing entry:', existingError.message);
      }

      if (existing) {
        const { data, error } = await supabase
          .from('vow_entries')
          .update({
            status,
            note_text: noteText,
            antidote_text: antidoteText,
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from('vow_entries')
        .insert({
          user_id: user.id,
          vow_type: vowType,
          entry_date: today,
          status,
          note_text: noteText,
          antidote_text: antidoteText,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newEntry: CreateVowEntryParams) => {
      await queryClient.cancelQueries({ queryKey: ['today-entries'] });
      
      const previousEntries = queryClient.getQueryData<VowEntry[]>(['today-entries', user?.id, today]);
      
      const optimisticEntry: VowEntry = {
        id: `temp-${Date.now()}`,
        user_id: user?.id || '',
        vow_type: newEntry.vowType,
        entry_date: today,
        status: newEntry.status,
        note_text: newEntry.noteText || null,
        antidote_text: newEntry.antidoteText || null,
        antidote_completed: false,
        postponed_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      queryClient.setQueryData<VowEntry[]>(
        ['today-entries', user?.id, today],
        (old = []) => {
          const existingIndex = old.findIndex(e => e.vow_type === newEntry.vowType);
          if (existingIndex >= 0) {
            const updated = [...old];
            updated[existingIndex] = { ...old[existingIndex], ...optimisticEntry, id: old[existingIndex].id };
            return updated;
          }
          return [...old, optimisticEntry];
        }
      );
      
      console.log('Optimistic update applied for:', newEntry.vowType);
      
      return { previousEntries };
    },
    onError: (err, newEntry, context) => {
      console.log('Mutation error, rolling back:', err.message);
      if (context?.previousEntries) {
        queryClient.setQueryData(
          ['today-entries', user?.id, today],
          context.previousEntries
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vow-entries'] });
      queryClient.invalidateQueries({ queryKey: ['today-entry'] });
      queryClient.invalidateQueries({ queryKey: ['today-entries'] });
      queryClient.invalidateQueries({ queryKey: ['vow-stats'] });
    },
  });
};

export const useVowStats = (vowType: string | null) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['vow-stats', user?.id, vowType] as const,
    queryFn: async () => {
      if (!user || !vowType) {
        return { streak: 0, totalKept: 0, totalBroken: 0, totalDays: 0 };
      }

      console.log('Calculating vow stats for:', vowType);
      const { data, error } = await supabase
        .from('vow_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('vow_type', vowType)
        .order('entry_date', { ascending: false });

      if (error) throw error;

      const entries = data as VowEntry[];
      const totalKept = entries.filter((e) => e.status === 'kept').length;
      const totalBroken = entries.filter((e) => e.status === 'broken').length;
      const totalDays = entries.length;

      let streak = 0;
      for (const entry of entries) {
        if (entry.status === 'kept') {
          streak++;
        } else {
          break;
        }
      }

      return { streak, totalKept, totalBroken, totalDays };
    },
    enabled: !!user && !!vowType,
  });
};

export const useCyclePosition = (vowType: string | null) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['cycle-position', user?.id, vowType] as const,
    queryFn: async () => {
      if (!user || !vowType) return null;

      const { data, error } = await supabase
        .from('vow_cycle_positions')
        .select('*')
        .eq('user_id', user.id)
        .eq('vow_type', vowType)
        .maybeSingle();

      if (error) throw error;
      return data as VowCyclePosition | null;
    },
    enabled: !!user && !!vowType,
  });
};

export const useHistoryEntries = () => {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['history-entries', user?.id, today] as const,
    queryFn: async () => {
      if (!user) return [];

      console.log('Fetching history entries for user:', user.id);
      
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('vow_entries')
        .select('*')
        .eq('user_id', user.id)
        .neq('entry_date', today)
        .or(`entry_date.gte.${twoDaysAgoStr},and(status.eq.broken,antidote_completed.eq.false)`)
        .order('entry_date', { ascending: false });

      if (error) {
        console.log('History entries fetch error:', error.message);
        throw error;
      }

      return data as VowEntry[];
    },
    enabled: !!user,
  });
};

export const useUncompletedAntidotes = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['uncompleted-antidotes', user?.id] as const,
    queryFn: async () => {
      if (!user) return [];

      console.log('Fetching uncompleted antidotes for user:', user.id);

      const { data, error } = await supabase
        .from('vow_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'broken')
        .eq('antidote_completed', false)
        .order('entry_date', { ascending: false });

      if (error) {
        console.log('Uncompleted antidotes fetch error:', error.message);
        throw error;
      }

      return data as VowEntry[];
    },
    enabled: !!user,
  });
};

export const useMarkAntidoteCompleted = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: string) => {
      if (!user) throw new Error('Not authenticated');

      console.log('Marking antidote as completed:', entryId);

      const { data, error } = await supabase
        .from('vow_entries')
        .update({ antidote_completed: true })
        .eq('id', entryId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (entryId: string) => {
      await queryClient.cancelQueries({ queryKey: ['history-entries'] });
      await queryClient.cancelQueries({ queryKey: ['uncompleted-antidotes'] });

      const previousHistory = queryClient.getQueryData<VowEntry[]>(['history-entries', user?.id, new Date().toISOString().split('T')[0]]);
      const previousUncompleted = queryClient.getQueryData<VowEntry[]>(['uncompleted-antidotes', user?.id]);

      queryClient.setQueryData<VowEntry[]>(
        ['history-entries', user?.id, new Date().toISOString().split('T')[0]],
        (old = []) => old.map(e => e.id === entryId ? { ...e, antidote_completed: true } : e)
      );

      queryClient.setQueryData<VowEntry[]>(
        ['uncompleted-antidotes', user?.id],
        (old = []) => old.filter(e => e.id !== entryId)
      );

      return { previousHistory, previousUncompleted };
    },
    onError: (err, entryId, context) => {
      console.log('Mark antidote completed error:', err.message);
      if (context?.previousHistory) {
        queryClient.setQueryData(['history-entries', user?.id, new Date().toISOString().split('T')[0]], context.previousHistory);
      }
      if (context?.previousUncompleted) {
        queryClient.setQueryData(['uncompleted-antidotes', user?.id], context.previousUncompleted);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['history-entries'] });
      queryClient.invalidateQueries({ queryKey: ['uncompleted-antidotes'] });
      queryClient.invalidateQueries({ queryKey: ['vow-entries'] });
    },
  });
};

export const usePostponeAntidote = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return useMutation({
    mutationFn: async (entryId: string) => {
      if (!user) throw new Error('Not authenticated');

      console.log('Postponing antidote to:', tomorrowStr);

      const { data: entry, error: fetchError } = await supabase
        .from('vow_entries')
        .select('*')
        .eq('id', entryId)
        .single();

      if (fetchError) throw fetchError;

      const { data, error } = await supabase
        .from('vow_entries')
        .update({
          entry_date: tomorrowStr,
          postponed_count: (entry.postponed_count || 0) + 1,
        })
        .eq('id', entryId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['history-entries'] });
      queryClient.invalidateQueries({ queryKey: ['uncompleted-antidotes'] });
      queryClient.invalidateQueries({ queryKey: ['vow-entries'] });
      queryClient.invalidateQueries({ queryKey: ['today-entries'] });
    },
  });
};
