export type AppRole = 'admin' | 'owner' | 'user';

export type Language = 'en' | 'ru' | 'es' | 'zh' | 'de' | 'fr' | 'hy' | 'it';

export type VowStatus = 'kept' | 'broken' | 'postponed';

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  language: 'en' | 'ru' | 'es' | 'zh' | 'de' | 'fr' | 'hy' | 'it';
  notifications_enabled: boolean;
  notification_timezone: string;
  selected_vow: string | null;
  selected_vow_types: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface VowEntry {
  id: string;
  user_id: string;
  vow_type: string;
  entry_date: string;
  status: VowStatus;
  antidote_text: string | null;
  antidote_completed: boolean;
  note_text: string | null;
  postponed_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface VowCyclePosition {
  id: string;
  user_id: string;
  vow_type: string;
  current_position: number;
  last_updated: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  profile?: Profile;
  roles?: UserRole[];
}
