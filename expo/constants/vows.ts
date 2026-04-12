// constants/vows.ts
// Единственный источник истины для типов обетов требующих разблокировки администратором.
// Импортируйте LOCKED_VOW_TYPES вместо дублирования этого массива.

export const LOCKED_VOW_TYPES = ['tantric', 'nuns', 'monks'] as const;

export type LockedVowKey = typeof LOCKED_VOW_TYPES[number];

export const LOCKED_VOW_TYPE_LABELS: Record<LockedVowKey, { ru: string; en: string }> = {
  tantric: { ru: 'Тантрические обеты', en: 'Tantric Vows' },
  nuns:    { ru: 'Обеты монахинь',     en: 'Nun Vows' },
  monks:   { ru: 'Обеты монахов',      en: 'Monk Vows' },
};
