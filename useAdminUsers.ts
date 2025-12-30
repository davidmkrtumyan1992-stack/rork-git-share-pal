import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { VowType, UserRole } from '../App';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  allowedVows: VowType[];
  created_at: string;
}

export function useAdminUsers(currentUserId?: string) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if current user is admin
      const { data: currentUserRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUserId);

      const isAdmin = currentUserRoles?.some(r => r.role === 'admin');
      
      if (!isAdmin) {
        setError('Access denied');
        setLoading(false);
        return;
      }

      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, username, created_at');

      if (profilesError) throw profilesError;

      // Get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get current user session to access user metadata
      const { data: { session } } = await supabase.auth.getSession();

      // Combine data - note: we can't get other users' emails without admin access
      // So we'll show a placeholder or fetch from a dedicated profiles table if needed
      const combinedUsers: AdminUser[] = profiles?.map(profile => {
        const roles = userRoles?.filter(r => r.user_id === profile.user_id) || [];
        const primaryRole = roles.find(r => r.role === 'admin') || roles[0];

        // Only show email for current user for security reasons
        const email = profile.user_id === currentUserId && session?.user?.email 
          ? session.user.email 
          : 'email-hidden@privacy.local';

        return {
          id: profile.user_id,
          username: profile.username,
          email: email,
          role: (primaryRole?.role || 'user') as UserRole,
          allowedVows: ['10-principles', 'freedom'] as VowType[], // Default vows
          created_at: profile.created_at
        };
      }) || [];

      setUsers(combinedUsers);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
    try {
      // Delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (error) throw error;

      await loadUsers();
      return true;
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error('Failed to update user role');
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      // Delete from user_roles first (due to foreign key)
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Delete from vow_entries
      await supabase
        .from('vow_entries')
        .delete()
        .eq('user_id', userId);

      // Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Note: We can't delete from auth.users without service_role access
      // Admin needs to do this manually from the Lovable Cloud dashboard
      
      await loadUsers();
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user profile. Auth account must be deleted from Cloud dashboard.');
      return false;
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentUserId]);

  return {
    users,
    loading,
    error,
    loadUsers,
    updateUserRole,
    deleteUser
  };
}
