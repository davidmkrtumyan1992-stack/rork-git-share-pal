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
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Users, Activity, Trash2, ArrowLeft, CheckCircle } from 'lucide-react-native';
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

const BREAKPOINTS = {
  sm: 320,
  md: 768,
  lg: 1024,
};

export function AdminPanel({ onClose }: AdminPanelProps) {
  const { language } = useAuth();
  const t = getTranslation(language);
  const queryClient = useQueryClient();
  const { width: screenWidth } = useWindowDimensions();
  
  const [searchQuery, setSearchQuery] = useState('');
  const isSmallScreen = screenWidth < BREAKPOINTS.md;
  const isLargeScreen = screenWidth >= BREAKPOINTS.lg;

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

      const { count: completedAntidotes } = await supabase
        .from('vow_entries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'broken')
        .eq('antidote_completed', true);

      return {
        totalUsers: totalUsers || 0,
        activeToday: activeToday || 0,
        completedAntidotes: completedAntidotes || 0,
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

  const responsiveStyles = {
    content: {
      padding: isSmallScreen ? 16 : isLargeScreen ? 32 : 24,
      maxWidth: isLargeScreen ? 900 : undefined,
    },
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[darkTheme.colors.background, darkTheme.colors.backgroundSecondary, darkTheme.colors.backgroundTertiary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={[styles.header, isLargeScreen && styles.headerLarge]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <ArrowLeft size={24} color={darkTheme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.admin.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { padding: responsiveStyles.content.padding },
          isLargeScreen && styles.contentLarge
        ]}
      >
        <View style={[
          styles.statsContainer,
          { maxWidth: responsiveStyles.content.maxWidth },
          isLargeScreen && styles.statsContainerLarge
        ]}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: darkTheme.colors.primary + '20' }]}>
              <Users size={24} color={darkTheme.colors.primary} />
            </View>
            <Text style={styles.statValue}>
              {formatNumber(stats?.totalUsers || 0)}
            </Text>
            <Text style={styles.statLabel}>{t.admin.totalUsers}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: darkTheme.colors.success + '20' }]}>
              <Activity size={24} color={darkTheme.colors.success} />
            </View>
            <Text style={styles.statValue}>
              {formatNumber(stats?.activeToday || 0)}
            </Text>
            <Text style={styles.statLabel}>{t.admin.activeToday}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: darkTheme.colors.accent + '20' }]}>
              <CheckCircle size={24} color={darkTheme.colors.accent} />
            </View>
            <Text style={styles.statValue}>
              {formatNumber(stats?.completedAntidotes || 0)}
            </Text>
            <Text style={styles.statLabel}>{t.admin.completedAntidotes}</Text>
          </View>
        </View>

        <View style={[
          styles.card,
          { maxWidth: responsiveStyles.content.maxWidth },
          isLargeScreen && styles.cardLarge
        ]}>
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
        </View>

        <View style={[
          styles.card,
          { maxWidth: responsiveStyles.content.maxWidth },
          isLargeScreen && styles.cardLarge
        ]}>
          <Text style={styles.sectionTitle}>{t.admin.users}</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={darkTheme.colors.primary} size="large" />
            </View>
          ) : (
            <View style={styles.usersList}>
              {filteredUsers?.map((user) => (
                <View key={user.id} style={styles.userCard}>
                  <View style={styles.userHeader}>
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
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteUser(user)}
                      disabled={deleteUserMutation.isPending}
                    >
                      <Trash2 size={18} color={darkTheme.colors.error} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.userFooter}>
                    {user.lastEntry && (
                      <Text style={styles.lastActive}>
                        {t.admin.lastActive}: {user.lastEntry}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: darkTheme.spacing.lg,
    paddingVertical: darkTheme.spacing.lg,
  },
  headerLarge: {
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 32,
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
  },
  contentLarge: {
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: darkTheme.spacing.md,
    marginBottom: darkTheme.spacing.lg,
    width: '100%',
  },
  statsContainerLarge: {
    alignSelf: 'center',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: darkTheme.borderRadius.xl,
    padding: darkTheme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: darkTheme.spacing.sm,
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
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: darkTheme.borderRadius.xl,
    marginBottom: darkTheme.spacing.lg,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
  },
  cardLarge: {
    alignSelf: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: darkTheme.spacing.md,
    paddingHorizontal: darkTheme.spacing.sm,
    color: darkTheme.colors.text,
    fontSize: darkTheme.fontSize.md,
  },
  sectionTitle: {
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.semibold,
    color: darkTheme.colors.text,
    padding: darkTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border,
  },
  loadingContainer: {
    padding: darkTheme.spacing.xl,
    alignItems: 'center',
  },
  usersList: {
    padding: darkTheme.spacing.md,
    gap: darkTheme.spacing.md,
  },
  userCard: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.lg,
    padding: darkTheme.spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: darkTheme.spacing.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: darkTheme.spacing.md,
    flex: 1,
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
    color: '#FFFFFF',
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
    marginTop: 2,
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
  userFooter: {
    paddingTop: darkTheme.spacing.sm,
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
