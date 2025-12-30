import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Users, Activity, Trash2, ArrowLeft } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getTranslation, formatNumber } from '@/data/translations';
import { darkTheme } from '@/constants/theme';
import { Profile, AppRole } from '@/types/database';

interface AdminUser {
  id: string;
  email: string;
  profile: Profile | null;
  roles: { role: AppRole }[];
  lastEntry: string | null;
}

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const { language } = useAuth();
  const t = getTranslation(language);
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'] as const,
    queryFn: async () => {
      console.log('Fetching admin users list...');
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const usersData: AdminUser[] = [];

      for (const profile of profiles || []) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', profile.user_id);

        const { data: lastEntry } = await supabase
          .from('vow_entries')
          .select('entry_date')
          .eq('user_id', profile.user_id)
          .order('entry_date', { ascending: false })
          .limit(1)
          .single();

        usersData.push({
          id: profile.user_id,
          email: '',
          profile,
          roles: roles || [],
          lastEntry: lastEntry?.entry_date || null,
        });
      }

      return usersData;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'] as const,
    queryFn: async () => {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const today = new Date().toISOString().split('T')[0];
      const { count: activeToday } = await supabase
        .from('vow_entries')
        .select('*', { count: 'exact', head: true })
        .eq('entry_date', today);

      return {
        totalUsers: totalUsers || 0,
        activeToday: activeToday || 0,
      };
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Deleting user:', userId);
      
      await supabase.from('vow_entries').delete().eq('user_id', userId);
      await supabase.from('vow_cycle_positions').delete().eq('user_id', userId);
      await supabase.from('user_roles').delete().eq('user_id', userId);
      await supabase.from('profiles').delete().eq('user_id', userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const handleDeleteUser = (user: AdminUser) => {
    Alert.alert(
      t.admin.deleteUser,
      t.admin.confirmDelete,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: () => deleteUserMutation.mutate(user.id),
        },
      ]
    );
  };

  const filteredUsers = users?.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.profile?.username?.toLowerCase().includes(query) ||
      user.profile?.full_name?.toLowerCase().includes(query)
    );
  });

  const getRoleBadgeColor = (role: AppRole) => {
    switch (role) {
      case 'admin': return darkTheme.colors.error;
      case 'owner': return darkTheme.colors.warning;
      default: return darkTheme.colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <ArrowLeft size={24} color={darkTheme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.admin.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Users size={24} color={darkTheme.colors.primary} />
            <Text style={styles.statValue}>
              {formatNumber(stats?.totalUsers || 0)}
            </Text>
            <Text style={styles.statLabel}>{t.admin.totalUsers}</Text>
          </View>

          <View style={styles.statCard}>
            <Activity size={24} color={darkTheme.colors.success} />
            <Text style={styles.statValue}>
              {formatNumber(stats?.activeToday || 0)}
            </Text>
            <Text style={styles.statLabel}>{t.admin.activeToday}</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={darkTheme.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.admin.searchUsers}
            placeholderTextColor={darkTheme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.sectionTitle}>{t.admin.users}</Text>

        {isLoading ? (
          <ActivityIndicator color={darkTheme.colors.primary} size="large" />
        ) : (
          <View style={styles.usersList}>
            {filteredUsers?.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {user.profile?.username?.charAt(0).toUpperCase() || '?'}
                    </Text>
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>
                      {user.profile?.username || 'Unknown'}
                    </Text>
                    {user.profile?.full_name && (
                      <Text style={styles.userFullName}>
                        {user.profile.full_name}
                      </Text>
                    )}
                    <View style={styles.rolesContainer}>
                      {user.roles.map((r, index) => (
                        <View
                          key={index}
                          style={[
                            styles.roleBadge,
                            { backgroundColor: getRoleBadgeColor(r.role) + '30' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.roleText,
                              { color: getRoleBadgeColor(r.role) },
                            ]}
                          >
                            {r.role}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
                <View style={styles.userActions}>
                  {user.lastEntry && (
                    <Text style={styles.lastActive}>
                      {t.admin.lastActive}: {user.lastEntry}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteUser(user)}
                    disabled={deleteUserMutation.isPending}
                  >
                    <Trash2 size={18} color={darkTheme.colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: darkTheme.fontSize.xl,
    fontWeight: darkTheme.fontWeight.bold,
    color: darkTheme.colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: darkTheme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: darkTheme.spacing.md,
    marginBottom: darkTheme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.lg,
    padding: darkTheme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  statValue: {
    fontSize: darkTheme.fontSize.xxl,
    fontWeight: darkTheme.fontWeight.bold,
    color: darkTheme.colors.text,
    marginTop: darkTheme.spacing.sm,
  },
  statLabel: {
    fontSize: darkTheme.fontSize.xs,
    color: darkTheme.colors.textSecondary,
    marginTop: darkTheme.spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.md,
    paddingHorizontal: darkTheme.spacing.md,
    marginBottom: darkTheme.spacing.lg,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: darkTheme.spacing.md,
    paddingHorizontal: darkTheme.spacing.sm,
    color: darkTheme.colors.text,
    fontSize: darkTheme.fontSize.md,
  },
  sectionTitle: {
    fontSize: darkTheme.fontSize.lg,
    fontWeight: darkTheme.fontWeight.semibold,
    color: darkTheme.colors.text,
    marginBottom: darkTheme.spacing.md,
  },
  usersList: {
    gap: darkTheme.spacing.md,
  },
  userCard: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.lg,
    padding: darkTheme.spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: darkTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: darkTheme.fontSize.lg,
    fontWeight: darkTheme.fontWeight.bold,
    color: darkTheme.colors.text,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.semibold,
    color: darkTheme.colors.text,
  },
  userFullName: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.textSecondary,
  },
  rolesContainer: {
    flexDirection: 'row',
    gap: darkTheme.spacing.xs,
    marginTop: darkTheme.spacing.xs,
  },
  roleBadge: {
    paddingHorizontal: darkTheme.spacing.sm,
    paddingVertical: 2,
    borderRadius: darkTheme.borderRadius.sm,
  },
  roleText: {
    fontSize: darkTheme.fontSize.xs,
    fontWeight: darkTheme.fontWeight.semibold,
    textTransform: 'uppercase',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: darkTheme.spacing.md,
    paddingTop: darkTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border,
  },
  lastActive: {
    fontSize: darkTheme.fontSize.xs,
    color: darkTheme.colors.textMuted,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: darkTheme.colors.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
