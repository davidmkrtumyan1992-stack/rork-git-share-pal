import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VowType } from '../App';
import { getVowData } from '../data/vows';
import { Language } from '../data/translations';

interface CyclePosition {
  vow_type: string;
  current_position: number;
  last_updated: string;
}

interface VowReminder {
  vowType: VowType;
  vowIndex: number;
}

const TOTAL_REMINDERS_PER_DAY = 6;

export function useVowCyclePosition(userId: string | undefined, selectedVows: VowType[], language: Language) {
  const [reminders, setReminders] = useState<VowReminder[]>([]);
  const [loading, setLoading] = useState(true);

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const calculateReminders = useCallback(async () => {
    if (!userId || selectedVows.length === 0) {
      setReminders([]);
      setLoading(false);
      return;
    }

    try {
      const today = getTodayDateString();

      // Fetch current positions for all selected vow types
      const { data: positions, error } = await supabase
        .from('vow_cycle_positions')
        .select('*')
        .eq('user_id', userId)
        .in('vow_type', selectedVows);

      if (error) throw error;

      // Create a map of existing positions
      const positionMap = new Map<string, CyclePosition>();
      positions?.forEach(p => positionMap.set(p.vow_type, p));

      // Calculate reminders per vow type
      const numTypes = selectedVows.length;
      const baseRemindersPerType = Math.floor(TOTAL_REMINDERS_PER_DAY / numTypes);
      const extraReminders = TOTAL_REMINDERS_PER_DAY % numTypes;

      // Distribute reminders (first types get extra if not divisible evenly)
      const remindersPerType: number[] = selectedVows.map((_, idx) => 
        baseRemindersPerType + (idx < extraReminders ? 1 : 0)
      );

      const allReminders: VowReminder[] = [];
      const positionsToUpdate: { vowType: VowType; newPosition: number; isNew: boolean }[] = [];

      // For each selected vow type, get the next N vows in the cycle
      for (let typeIdx = 0; typeIdx < selectedVows.length; typeIdx++) {
        const vowType = selectedVows[typeIdx];
        const vowData = getVowData(vowType, language);
        const totalVows = vowData.vows.length;
        const remindersForThisType = remindersPerType[typeIdx];

        const existingPosition = positionMap.get(vowType);
        let currentPosition = 0;
        let needsUpdate = false;
        let isNew = false;

        if (existingPosition) {
          // Check if we need to advance the position (new day)
          if (existingPosition.last_updated !== today) {
            // Advance position by the number of reminders we showed yesterday
            currentPosition = existingPosition.current_position;
            needsUpdate = true;
          } else {
            // Same day, use current position
            currentPosition = existingPosition.current_position;
          }
        } else {
          // No position exists, start from 0
          currentPosition = 0;
          needsUpdate = true;
          isNew = true;
        }

        // Generate reminders starting from current position
        for (let i = 0; i < remindersForThisType; i++) {
          const vowIndex = (currentPosition + i) % totalVows;
          allReminders.push({
            vowType,
            vowIndex
          });
        }

        if (needsUpdate) {
          // Calculate new position for tomorrow (advance by reminders shown today)
          const newPosition = (currentPosition + remindersForThisType) % totalVows;
          positionsToUpdate.push({ vowType, newPosition, isNew });
        }
      }

      // Update positions in database
      for (const update of positionsToUpdate) {
        if (update.isNew) {
          await supabase
            .from('vow_cycle_positions')
            .insert({
              user_id: userId,
              vow_type: update.vowType,
              current_position: update.newPosition,
              last_updated: today
            });
        } else {
          await supabase
            .from('vow_cycle_positions')
            .update({
              current_position: update.newPosition,
              last_updated: today
            })
            .eq('user_id', userId)
            .eq('vow_type', update.vowType);
        }
      }

      // Interleave reminders from different vow types for better distribution
      const interleavedReminders: VowReminder[] = [];
      const typeReminders: VowReminder[][] = selectedVows.map(() => []);
      
      // Group reminders by type
      let reminderIdx = 0;
      for (let typeIdx = 0; typeIdx < selectedVows.length; typeIdx++) {
        const count = remindersPerType[typeIdx];
        for (let i = 0; i < count; i++) {
          typeReminders[typeIdx].push(allReminders[reminderIdx++]);
        }
      }

      // Interleave: take one from each type in round-robin fashion
      const maxRemindersPerType = Math.max(...remindersPerType);
      for (let i = 0; i < maxRemindersPerType; i++) {
        for (let typeIdx = 0; typeIdx < selectedVows.length; typeIdx++) {
          if (i < typeReminders[typeIdx].length) {
            interleavedReminders.push(typeReminders[typeIdx][i]);
          }
        }
      }

      setReminders(interleavedReminders);
    } catch (error) {
      console.error('Error calculating reminders:', error);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  }, [userId, selectedVows, language]);

  useEffect(() => {
    calculateReminders();
  }, [calculateReminders]);

  return { reminders, loading, refreshReminders: calculateReminders };
}
