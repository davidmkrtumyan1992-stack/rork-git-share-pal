import React, { useState, useCallback } from 'react';
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
import { 
  Search, 
  Users, 
  Activity, 
  Trash2, 
  ArrowLeft, 
  CheckCircle, 
  Lock, 
  Unlock,
  Mail,
  Shield,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getTranslation, formatNumber } from '@/data/translations';
import { darkTheme } from '@/constants/theme';
import { Profile, AppRole, UserUnlockedVow } from '@/types/database';

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

const LOCKED_VOW_TYPES = [
  { key: 'tantric', labelRu: 'Тантрические обеты', labelEn: 'Tantric Vows' },
  { key: 'nuns', labelRu: 'Обеты монахинь', labelEn: 'Nun Vows' },
  { key: 'monks', labelRu: 'Обеты монахов', labelEn: 'Monk Vows' },
  { key: 'pratimoksha', labelRu: 'Пратимокша', labelEn: 'Pratimoksha' },
];

const BREAKPOINTS = {
  sm: 320,
  md: 768,
  lg: 1024,
};

export function AdminPanel({ onClose }: AdminPanelProps) {
  const { language, user: currentUser, isAdmin, isOwner } = useAuth();
  const t = getTranslation(language);
  const queryClient = useQueryClient();
  const { width: screenWidth } = useWindowDimensions();
  const isAdminOrOwner = isAdmin || isOwner;

  const [searchQuery, setSearchQuery] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const isSmallScreen = screenWidth < BREAKPOINTS.md;
  const isLargeScreen = screenWidth >= BREAKPOINTS.lg;

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'] as const,
    queryFn: async () => {
      if (!isAdminOrOwner) return [];
      console.log('[AdminPanel] Fetching admin users list...');
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) return [];

      const userIds = profiles.map(p => p.user_id);

      const { data: allRoles } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      const { data: allLastEntries } = await supabase
        .from('vow_entries')
        .select('user_id, entry_date')
        .in('user_id', userIds)
        .order('entry_date', { ascending: false });

      const rolesMap = new Map<string, { role: string }[]>();
      for (const r of allRoles || []) {
        if (!rolesMap.has(r.user_id)) rolesMap.set(r.user_id, []);
        rolesMap.get(r.user_id)!.push({ role: r.role });
      }

      const lastEntryMap = new Map<string, string>();
      for (const e of allLastEntries || []) {
        if (!lastEntryMap.has(e.user_id)) {
          lastEntryMap.set(e.user_id, e.entry_date);
        }
      }

      return profiles.map(profile => ({
        id: profile.user_id,
        email: '',
        profile,
        roles: rolesMap.get(profile.user_id) || [],
        lastEntry: lastEntryMap.get(profile.user_id) || null,
      }));
    },
    enabled: isAdminOrOwner,
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

  const { data: userUnlockedVows, refetch: refetchUnlockedVows } = useQuery({
    queryKey: ['admin-user-unlocked-vows', selectedUserId] as const,
    queryFn: async () => {
      if (!selectedUserId) return [];
      
      console.log('[AdminPanel] Fetching unlocked vows for user:', selectedUserId);
      
      const { data, error } = await supabase
        .from('user_unlocked_vows')
        .select('*')
        .eq('user_id', selectedUserId);

      if (error) {
        console.error('[AdminPanel] Error fetching unlocked vows:', error);
        return [];
      }

      return data as UserUnlockedVow[];
    },
    enabled: !!selectedUserId,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('[AdminPanel] Deleting user:', userId);
      
      await supabase.from('user_unlocked_vows').delete().eq('user_id', userId);
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

  const { mutate: unlockVow, isPending: isUnlockPending } = useMutation({
    mutationFn: async ({ userId, vowType }: { userId: string; vowType: string }) => {
      console.log('[AdminPanel] Unlocking vow:', vowType, 'for user:', userId);
      
      const { data, error } = await supabase
        .from('user_unlocked_vows')
        .insert({
          user_id: userId,
          vow_type: vowType,
          unlocked_by: currentUser?.id,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          console.log('[AdminPanel] Vow already unlocked');
          return null;
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      refetchUnlockedVows();
      queryClient.invalidateQueries({ queryKey: ['unlocked-vows', selectedUserId] });
    },
    onError: (error) => {
      console.error('[AdminPanel] Error unlocking vow:', error);
      Alert.alert(t.common.error, language === 'ru' ? 'Не удалось разблокировать обет' : 'Failed to unlock vow');
    },
  });

  const { mutate: revokeVow, isPending: isRevokePending } = useMutation({
    mutationFn: async ({ userId, vowType }: { userId: string; vowType: string }) => {
      console.log('[AdminPanel] Revoking vow:', vowType, 'from user:', userId);
      
      const { error } = await supabase
        .from('user_unlocked_vows')
        .delete()
        .eq('user_id', userId)
        .eq('vow_type', vowType);

      if (error) throw error;
    },
    onSuccess: () => {
      refetchUnlockedVows();
      queryClient.invalidateQueries({ queryKey: ['unlocked-vows', selectedUserId] });
    },
    onError: (error) => {
      console.error('[AdminPanel] Error revoking vow:', error);
      Alert.alert(t.common.error, language === 'ru' ? 'Не удалось закрыть доступ' : 'Failed to revoke access');
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

  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUserId(userId);
    setExpandedUserId(userId);
  }, []);

  const handleToggleVowAccess = useCallback((userId: string, vowType: string, isUnlocked: boolean) => {
    if (isUnlocked) {
      Alert.alert(
        language === 'ru' ? 'Закрыть доступ' : 'Revoke Access',
        language === 'ru' ? 'Вы уверены, что хотите закрыть доступ к этому обету?' : 'Are you sure you want to revoke access to this vow?',
        [
          { text: t.common.cancel, style: 'cancel' },
          {
            text: t.common.confirm,
            style: 'destructive',
            onPress: () => revokeVow({ userId, vowType }),
          },
        ]
      );
    } else {
      unlockVow({ userId, vowType });
    }
  }, [language, t, unlockVow, revokeVow]);

  const isVowUnlocked = useCallback((vowType: string): boolean => {
    return userUnlockedVows?.some((uv) => uv.vow_type === vowType) || false;
  }, [userUnlockedVows]);

  const filteredUsers = users?.filter((user) => {
    const query = searchQuery.toLowerCase();
    const emailQuery = emailSearch.toLowerCase();
    
    const matchesSearch = !searchQuery || 
      user.profile?.username?.toLowerCase().includes(query) ||
      user.profile?.full_name?.toLowerCase().includes(query);
    
    const matchesEmail = !emailSearch ||
      user.profile?.username?.toLowerCase().includes(emailQuery);
    
    return matchesSearch && matchesEmail;
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
          <View style={styles.cardHeader}>
            <View style={[styles.cardHeaderIcon, { backgroundColor: darkTheme.colors.warning + '20' }]}>
              <Shield size={20} color={darkTheme.colors.warning} />
            </View>
            <Text style={styles.cardTitle}>
              {language === 'ru' ? 'Управление доступом к обетам' : 'Vow Access Management'}
            </Text>
          </View>
          
          <View style={styles.emailSearchContainer}>
            <Mail size={20} color={darkTheme.colors.textMuted} />
            <TextInput
              style={styles.emailSearchInput}
              placeholder={language === 'ru' ? 'Введите email или имя пользователя...' : 'Enter email or username...'}
              placeholderTextColor={darkTheme.colors.textMuted}
              value={emailSearch}
              onChangeText={setEmailSearch}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {emailSearch.length > 0 && (
              <TouchableOpacity onPress={() => setEmailSearch('')}>
                <X size={20} color={darkTheme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {emailSearch.length > 0 && filteredUsers && filteredUsers.length > 0 && (
            <View style={styles.userSearchResults}>
              {filteredUsers.slice(0, 5).map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={[
                    styles.userSearchItem,
                    selectedUserId === user.id && styles.userSearchItemSelected,
                  ]}
                  onPress={() => handleSelectUser(user.id)}
                >
                  <View style={styles.userSearchAvatar}>
                    <Text style={styles.userSearchAvatarText}>
                      {user.profile?.username?.charAt(0).toUpperCase() || '?'}
                    </Text>
                  </View>
                  <View style={styles.userSearchInfo}>
                    <Text style={styles.userSearchName}>{user.profile?.username || 'Unknown'}</Text>
                    {user.profile?.full_name && (
                      <Text style={styles.userSearchFullName}>{user.profile.full_name}</Text>
                    )}
                  </View>
                  {selectedUserId === user.id && (
                    <CheckCircle size={20} color={darkTheme.colors.success} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selectedUserId && (
            <View style={styles.vowAccessSection}>
              <Text style={styles.vowAccessTitle}>
                {language === 'ru' ? 'Секретные обеты' : 'Secret Vows'}
              </Text>
              <Text style={styles.vowAccessDesc}>
                {language === 'ru' 
                  ? 'Выберите обеты для разблокировки пользователю' 
                  : 'Select vows to unlock for this user'}
              </Text>
              
              {LOCKED_VOW_TYPES.map((vow) => {
                const isUnlocked = isVowUnlocked(vow.key);
                return (
                  <TouchableOpacity
                    key={vow.key}
                    style={[
                      styles.vowAccessItem,
                      isUnlocked && styles.vowAccessItemUnlocked,
                    ]}
                    onPress={() => handleToggleVowAccess(selectedUserId, vow.key, isUnlocked)}
                    disabled={isUnlockPending || isRevokePending}
                  >
                    <View style={styles.vowAccessItemContent}>
                      {isUnlocked ? (
                        <Unlock size={20} color={darkTheme.colors.success} />
                      ) : (
                        <Lock size={20} color={darkTheme.colors.textMuted} />
                      )}
                      <Text style={[
                        styles.vowAccessItemLabel,
                        isUnlocked && styles.vowAccessItemLabelUnlocked,
                      ]}>
                        {language === 'ru' ? vow.labelRu : vow.labelEn}
                      </Text>
                    </View>
                    <View style={[
                      styles.vowAccessToggle,
                      isUnlocked && styles.vowAccessToggleActive,
                    ]}>
                      <Text style={[
                        styles.vowAccessToggleText,
                        isUnlocked && styles.vowAccessToggleTextActive,
                      ]}>
                        {isUnlocked 
                          ? (language === 'ru' ? 'Открыт' : 'Unlocked')
                          : (language === 'ru' ? 'Закрыт' : 'Locked')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
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
              {filteredUsers?.map((user) => {
                const isExpanded = expandedUserId === user.id;
                return (
                  <View key={user.id} style={styles.userCard}>
                    <TouchableOpacity 
                      style={styles.userHeader}
                      onPress={() => setExpandedUserId(isExpanded ? null : user.id)}
                    >
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
                        {isExpanded ? (
                          <ChevronUp size={20} color={darkTheme.colors.textMuted} />
                        ) : (
                          <ChevronDown size={20} color={darkTheme.colors.textMuted} />
                        )}
                      </View>
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.userExpandedContent}>
                        <View style={styles.userFooter}>
                          {user.lastEntry && (
                            <Text style={styles.lastActive}>
                              {t.admin.lastActive}: {user.lastEntry}
                            </Text>
                          )}
                        </View>
                        
                        <View style={styles.userActionsRow}>
                          <TouchableOpacity
                            style={styles.manageAccessButton}
                            onPress={() => handleSelectUser(user.id)}
                          >
                            <Shield size={16} color={darkTheme.colors.warning} />
                            <Text style={styles.manageAccessButtonText}>
                              {language === 'ru' ? 'Управление доступом' : 'Manage Access'}
                            </Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteUser(user)}
                            disabled={deleteUserMutation.isPending}
                          >
                            <Trash2 size={18} color={darkTheme.colors.error} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
    padding: darkTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border,
  },
  cardHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.semibold,
    color: darkTheme.colors.text,
    flex: 1,
  },
  emailSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.sm,
    gap: darkTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border,
  },
  emailSearchInput: {
    flex: 1,
    paddingVertical: darkTheme.spacing.md,
    color: darkTheme.colors.text,
    fontSize: darkTheme.fontSize.md,
  },
  userSearchResults: {
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border,
  },
  userSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: darkTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.colors.border,
    gap: darkTheme.spacing.md,
  },
  userSearchItemSelected: {
    backgroundColor: darkTheme.colors.success + '10',
  },
  userSearchAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: darkTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userSearchAvatarText: {
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.bold,
    color: '#FFFFFF',
  },
  userSearchInfo: {
    flex: 1,
  },
  userSearchName: {
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.medium,
    color: darkTheme.colors.text,
  },
  userSearchFullName: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.textSecondary,
    marginTop: 2,
  },
  vowAccessSection: {
    padding: darkTheme.spacing.md,
  },
  vowAccessTitle: {
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.semibold,
    color: darkTheme.colors.text,
    marginBottom: darkTheme.spacing.xs,
  },
  vowAccessDesc: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.textSecondary,
    marginBottom: darkTheme.spacing.md,
  },
  vowAccessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: darkTheme.spacing.md,
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.md,
    marginBottom: darkTheme.spacing.sm,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  vowAccessItemUnlocked: {
    backgroundColor: darkTheme.colors.success + '10',
    borderColor: darkTheme.colors.success + '30',
  },
  vowAccessItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
    flex: 1,
  },
  vowAccessItemLabel: {
    fontSize: darkTheme.fontSize.md,
    color: darkTheme.colors.text,
  },
  vowAccessItemLabelUnlocked: {
    color: darkTheme.colors.success,
    fontWeight: darkTheme.fontWeight.medium,
  },
  vowAccessToggle: {
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.xs,
    borderRadius: darkTheme.borderRadius.sm,
    backgroundColor: darkTheme.colors.textMuted + '20',
  },
  vowAccessToggleActive: {
    backgroundColor: darkTheme.colors.success + '20',
  },
  vowAccessToggleText: {
    fontSize: darkTheme.fontSize.xs,
    color: darkTheme.colors.textMuted,
    fontWeight: darkTheme.fontWeight.semibold,
  },
  vowAccessToggleTextActive: {
    color: darkTheme.colors.success,
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
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
    overflow: 'hidden',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: darkTheme.spacing.md,
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
  userActions: {
    padding: darkTheme.spacing.sm,
  },
  userExpandedContent: {
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border,
    padding: darkTheme.spacing.md,
  },
  userFooter: {
    marginBottom: darkTheme.spacing.md,
  },
  lastActive: {
    fontSize: darkTheme.fontSize.xs,
    color: darkTheme.colors.textMuted,
  },
  userActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  manageAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.sm,
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.sm,
    backgroundColor: darkTheme.colors.warning + '20',
    borderRadius: darkTheme.borderRadius.md,
    flex: 1,
  },
  manageAccessButtonText: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.warning,
    fontWeight: darkTheme.fontWeight.medium,
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
