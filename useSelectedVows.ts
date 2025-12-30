import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VowType } from '@/App';

export function useSelectedVows(userId: string | undefined) {
  const [selectedVows, setSelectedVows] = useState<VowType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchSelectedVows();
    } else {
      setSelectedVows([]);
      setLoading(false);
    }
  }, [userId]);

  const fetchSelectedVows = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_selected_vows')
        .select('vow_type')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const vows = (data || []).map(item => item.vow_type as VowType);
      setSelectedVows(vows);
    } catch (error) {
      console.error('Error fetching selected vows:', error);
    } finally {
      setLoading(false);
    }
  };

  const addVow = async (vowType: VowType) => {
    if (!userId) return { error: new Error('No user ID') };

    try {
      const { error } = await supabase
        .from('user_selected_vows')
        .insert({
          user_id: userId,
          vow_type: vowType
        });

      if (error) throw error;

      setSelectedVows(prev => [...prev, vowType]);
      return { error: null };
    } catch (error) {
      console.error('Error adding vow:', error);
      return { error };
    }
  };

  const removeVow = async (vowType: VowType) => {
    if (!userId) return { error: new Error('No user ID') };

    try {
      const { error } = await supabase
        .from('user_selected_vows')
        .delete()
        .eq('user_id', userId)
        .eq('vow_type', vowType);

      if (error) throw error;

      setSelectedVows(prev => prev.filter(v => v !== vowType));
      return { error: null };
    } catch (error) {
      console.error('Error removing vow:', error);
      return { error };
    }
  };

  const toggleVow = async (vowType: VowType) => {
    if (selectedVows.includes(vowType)) {
      return await removeVow(vowType);
    } else {
      return await addVow(vowType);
    }
  };

  const hasVow = (vowType: VowType) => {
    return selectedVows.includes(vowType);
  };

  const clearAll = async () => {
    if (!userId) return { error: new Error('No user ID') };

    try {
      const { error } = await supabase
        .from('user_selected_vows')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setSelectedVows([]);
      return { error: null };
    } catch (error) {
      console.error('Error clearing vows:', error);
      return { error };
    }
  };

  return {
    selectedVows,
    loading,
    addVow,
    removeVow,
    toggleVow,
    hasVow,
    clearAll,
    refreshSelectedVows: fetchSelectedVows
  };
}
