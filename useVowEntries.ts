import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VowType } from '@/App';

export interface VowEntry {
  id?: string;
  user_id?: string;
  vow_type: VowType;
  vow_index?: number;
  entry_date: string; // Date string in YYYY-MM-DD format
  status: 'kept' | 'broken' | 'postponed';
  antidote_text?: string | null;
  antidote_completed?: boolean;
  note_text?: string | null;
  postponed_count?: number;
  created_at?: string;
  updated_at?: string;
}

export function useVowEntries(userId: string | undefined, vowTypes: VowType[] | null) {
  const [entries, setEntries] = useState<VowEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && vowTypes && vowTypes.length > 0) {
      fetchEntries();
    } else {
      setEntries([]);
      setLoading(false);
    }
  }, [userId, vowTypes]);

  const fetchEntries = async () => {
    if (!userId || !vowTypes || vowTypes.length === 0) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vow_entries')
        .select('*')
        .eq('user_id', userId)
        .in('vow_type', vowTypes)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setEntries((data || []) as VowEntry[]);
    } catch (error) {
      console.error('Error fetching vow entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEntriesForType = (vowType: VowType) => {
    return entries.filter(e => e.vow_type === vowType);
  };

  const addEntry = async (entry: Omit<VowEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return { error: new Error('No user ID') };

    try {
      // Небольшая задержка для предотвращения спама
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data, error } = await supabase
        .from('vow_entries')
        .insert({
          user_id: userId,
          ...entry
        })
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => [data as VowEntry, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding vow entry:', error);
      return { data: null, error };
    }
  };

  const updateEntry = async (id: string, updates: Partial<VowEntry>) => {
    try {
      const { data, error } = await supabase
        .from('vow_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => prev.map(e => e.id === id ? (data as VowEntry) : e));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating vow entry:', error);
      return { data: null, error };
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vow_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(prev => prev.filter(e => e.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Error deleting vow entry:', error);
      return { error };
    }
  };

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    refreshEntries: fetchEntries,
    getEntriesForType
  };
}
