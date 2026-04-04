/* eslint-disable @tanstack/query/exhaustive-deps */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { VowCyclePosition } from '@/types/database';
import { vowsData, VowItem } from '@/data/vows';

const TOTAL_REMINDERS_PER_DAY = 6;


export interface DailyVowItem {
  vowType: string;
  vowIndex: number;
  vowItem: VowItem;
  categoryName: string;
  globalIndex: number;
}

export const calculateDistribution = (selectedTypes: string[]): Map<string, number> => {
  const distribution = new Map<string, number>();
  
  if (selectedTypes.length === 0) return distribution;
  
  const baseReminders = Math.floor(TOTAL_REMINDERS_PER_DAY / selectedTypes.length);
  const extraReminders = TOTAL_REMINDERS_PER_DAY % selectedTypes.length;
  
  selectedTypes.forEach((type, index) => {
    const count = baseReminders + (index < extraReminders ? 1 : 0);
    distribution.set(type, count);
  });
  
  return distribution;
};

export const useCyclePositions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['cycle-positions', user?.id] as const,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('vow_cycle_positions')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      return data as VowCyclePosition[];
    },
    enabled: !!user,
  });
};

export const useUpdateCyclePosition = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vowType, newPosition }: { vowType: string; newPosition: number }) => {
      if (!user) throw new Error('Not authenticated');

      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('vow_cycle_positions')
        .upsert(
          {
            user_id: user.id,
            vow_type: vowType,
            current_position: newPosition,
            last_updated: today,
          },
          {
            onConflict: 'user_id,vow_type',
            ignoreDuplicates: false,
          }
        )
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error upserting cycle position:', error);
        throw error;
      }
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cycle-positions'] });
    },
  });
};

export const useInitializeCyclePositions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (selectedVowTypes: string[]) => {
      if (!user) throw new Error('Not authenticated');

      const today = new Date().toISOString().split('T')[0];

      const insertData = selectedVowTypes.map(vowType => ({
        user_id: user.id,
        vow_type: vowType,
        current_position: 0,
        last_updated: today,
      }));

      const { data, error } = await supabase
        .from('vow_cycle_positions')
        .upsert(insertData, {
          onConflict: 'user_id,vow_type',
          ignoreDuplicates: true,
        })
        .select();

      if (error && error.code !== '23505') {
        console.error('Error initializing cycle positions:', error);
        throw error;
      }
      
      return data || [];
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cycle-positions'] });
    },
  });
};

export const useDailyVows = (selectedVowTypes: string[]) => {
  const { data: cyclePositions = [], isLoading: positionsLoading } = useCyclePositions();
  const initializePositions = useInitializeCyclePositions();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const needsUpdate = useMemo(() => {
    if (selectedVowTypes.length === 0) return false;
    
    return selectedVowTypes.some(type => {
      const position = cyclePositions.find(p => p.vow_type === type);
      if (!position) return true;
      return position.last_updated !== today;
    });
  }, [cyclePositions, selectedVowTypes, today]);

  const dailyVows = useMemo((): DailyVowItem[] => {
    if (selectedVowTypes.length === 0 || positionsLoading) return [];

    const distribution = calculateDistribution(selectedVowTypes);
    const vowsByType: Map<string, DailyVowItem[]> = new Map();

    selectedVowTypes.forEach(vowType => {
      const category = vowsData.find(cat => cat.key === vowType);
      if (!category || category.vows.length === 0) return;

      const position = cyclePositions.find(p => p.vow_type === vowType);
      const currentPos = position?.current_position || 0;
      const count = distribution.get(vowType) || 0;
      const vowItems: DailyVowItem[] = [];

      for (let i = 0; i < count; i++) {
        const vowIndex = (currentPos + i) % category.vows.length;
        const vowItem = category.vows[vowIndex];
        
        vowItems.push({
          vowType,
          vowIndex,
          vowItem,
          categoryName: vowType,
          globalIndex: i,
        });
      }

      vowsByType.set(vowType, vowItems);
    });

    const result: DailyVowItem[] = [];
    let maxLength = 0;
    
    vowsByType.forEach(items => {
      maxLength = Math.max(maxLength, items.length);
    });

    for (let i = 0; i < maxLength; i++) {
      selectedVowTypes.forEach(type => {
        const items = vowsByType.get(type);
        if (items && items[i]) {
          result.push({
            ...items[i],
            globalIndex: result.length,
          });
        }
      });
    }

    return result;
  }, [selectedVowTypes, cyclePositions, positionsLoading]);

  const advanceCyclePositions = useCallback(async () => {
    if (!user || selectedVowTypes.length === 0) return;

    const distribution = calculateDistribution(selectedVowTypes);
    const today = new Date().toISOString().split('T')[0];

    const updates = selectedVowTypes.map(vowType => {
      const category = vowsData.find(cat => cat.key === vowType);
      if (!category || category.vows.length === 0) return null;

      const position = cyclePositions.find(p => p.vow_type === vowType);
      const currentPos = position?.current_position || 0;
      const advance = distribution.get(vowType) || 0;
      const newPosition = (currentPos + advance) % category.vows.length;

      return {
        user_id: user.id,
        vow_type: vowType,
        current_position: newPosition,
        last_updated: today,
      };
    }).filter(Boolean);

    if (updates.length === 0) return;

    const { error } = await supabase
      .from('vow_cycle_positions')
      .upsert(updates, {
        onConflict: 'user_id,vow_type',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error('Error advancing cycle positions:', error);
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: ['cycle-positions'] });
  }, [user, selectedVowTypes, cyclePositions, queryClient]);

  const initializeIfNeeded = useCallback(async () => {
    if (!user || selectedVowTypes.length === 0) return;
    
    const existingTypes = new Set(cyclePositions.map(p => p.vow_type));
    const missingTypes = selectedVowTypes.filter(type => !existingTypes.has(type));
    
    if (missingTypes.length > 0) {
      await initializePositions.mutateAsync(selectedVowTypes);
    }
  }, [user, selectedVowTypes, cyclePositions, initializePositions]);

  return {
    dailyVows,
    isLoading: positionsLoading,
    needsUpdate,
    advanceCyclePositions,
    initializeIfNeeded,
    distribution: calculateDistribution(selectedVowTypes),
  };
};

export const getNextVowForNotification = (
  selectedVowTypes: string[],
  cyclePositions: VowCyclePosition[],
  currentNotificationIndex: number
): DailyVowItem | null => {
  if (selectedVowTypes.length === 0) return null;

  const distribution = calculateDistribution(selectedVowTypes);
  const allDailyVows: DailyVowItem[] = [];

  selectedVowTypes.forEach(vowType => {
    const category = vowsData.find(cat => cat.key === vowType);
    if (!category || category.vows.length === 0) return;

    const position = cyclePositions.find(p => p.vow_type === vowType);
    const currentPos = position?.current_position || 0;
    const count = distribution.get(vowType) || 0;

    for (let i = 0; i < count; i++) {
      const vowIndex = (currentPos + i) % category.vows.length;
      const vowItem = category.vows[vowIndex];
      
      allDailyVows.push({
        vowType,
        vowIndex,
        vowItem,
        categoryName: vowType,
        globalIndex: allDailyVows.length,
      });
    }
  });

  const interleavedVows: DailyVowItem[] = [];
  const vowsByType: Map<string, DailyVowItem[]> = new Map();
  
  allDailyVows.forEach(vow => {
    const existing = vowsByType.get(vow.vowType) || [];
    existing.push(vow);
    vowsByType.set(vow.vowType, existing);
  });

  let maxLength = 0;
  vowsByType.forEach(items => {
    maxLength = Math.max(maxLength, items.length);
  });

  for (let i = 0; i < maxLength; i++) {
    selectedVowTypes.forEach(type => {
      const items = vowsByType.get(type);
      if (items && items[i]) {
        interleavedVows.push({
          ...items[i],
          globalIndex: interleavedVows.length,
        });
      }
    });
  }

  if (interleavedVows.length === 0) return null;

  const index = currentNotificationIndex % interleavedVows.length;
  return interleavedVows[index];
};
