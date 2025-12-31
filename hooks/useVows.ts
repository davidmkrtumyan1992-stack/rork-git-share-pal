import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { VowEntry, VowStatus, VowCyclePosition } from '@/types/database';

export const useVowEntries = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['vow-entries', user?.id, user] as const,
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
    queryKey: ['today-entry', user?.id, vowType, today, user] as const,
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
    queryKey: ['today-entries', user?.id, today, user] as const,
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

export const useCreateVowEntry = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      vowType,
      status,
      noteText,
      antidoteText,
    }: {
      vowType: string;
      status: VowStatus;
      noteText?: string;
      antidoteText?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const today = new Date().toISOString().split('T')[0];
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
    onSuccess: () => {
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
    queryKey: ['vow-stats', user?.id, vowType, user] as const,
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
    queryKey: ['cycle-position', user?.id, vowType, user] as const,
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
