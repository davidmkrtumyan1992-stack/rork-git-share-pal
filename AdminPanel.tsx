import { useState } from 'react';
import { User, VowType, UserRole } from '../App';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ArrowLeft, Shield, Users, Trash2, Check, Loader2 } from 'lucide-react';
import { Language, t } from '../data/translations';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { toast } from 'sonner';
import { safeDisplay } from '../utils/sanitize';

interface AdminPanelProps {
  currentUser: User;
  currentUserId: string;
  language: Language;
  onBack: () => void;
}

export function AdminPanel({
  currentUser,
  currentUserId,
  language,
  onBack
}: AdminPanelProps) {
  const { users, loading, updateUserRole, deleteUser } = useAdminUsers(currentUserId);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [selectedVows, setSelectedVows] = useState<VowType[]>([]);

  const handleStartEdit = (userId: string, role: UserRole, allowedVows: VowType[]) => {
    setEditingUserId(userId);
    setSelectedRole(role);
    setSelectedVows([...allowedVows]);
  };

  const handleSaveEdit = async (userId: string) => {
    const success = await updateUserRole(userId, selectedRole);
    if (success) {
      toast.success(t('changesSaved', language));
      setEditingUserId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setSelectedRole('user');
    setSelectedVows([]);
  };

  const toggleVow = (vow: VowType) => {
    setSelectedVows(prev =>
      prev.includes(vow)
        ? prev.filter(v => v !== vow)
        : [...prev, vow]
    );
  };

  const handleDelete = async (userId: string, username: string) => {
    const success = await deleteUser(userId);
    if (success) {
      toast.success(t('userDeleted', language).replace('{username}', username));
    }
  };

  const vowOptions: { type: VowType; label: string }[] = [
    { type: '10-principles', label: t('10-principles', language) },
    { type: 'freedom', label: t('freedom', language) },
    { type: 'bodhisattva', label: t('bodhisattva', language) },
    { type: 'secret', label: t('secret', language) },
    { type: 'nuns', label: t('nuns', language) },
    { type: 'monks', label: t('monks', language) },
  ];

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return 'bg-gradient-to-r from-[#C5A572] to-[#A67C5C] text-white';
      case 'admin':
        return 'bg-gradient-to-r from-[#6B8E7F] to-[#5A7A6D] text-white';
      default:
        return 'bg-[#E8E1D5] text-[#2C3E3A]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F2ED] via-[#E8E1D5] to-[#D4C5B0] p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#6B8E7F]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F2ED] via-[#E8E1D5] to-[#D4C5B0] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="rounded-2xl border-[#4A6B5E]/30 hover:bg-[#4A6B5E]/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back', language)}
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl text-[#2C3E3A] mb-2">
              <Shield className="w-8 h-8 inline-block mr-3" />
              {t('adminPanel', language)}
            </h1>
            <p className="text-[#5A6A66]">{t('adminPanelSubtitle', language)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="rounded-3xl border-0 bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#5A6A66] text-sm mb-1">{t('totalUsers', language)}</p>
                  <p className="text-3xl text-[#2C3E3A]">{users.length}</p>
                </div>
                <Users className="w-10 h-10 text-[#6B8E7F]" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#5A6A66] text-sm mb-1">{t('admins', language)}</p>
                  <p className="text-3xl text-[#2C3E3A]">
                    {users.filter(u => u.role === 'admin' || u.role === 'owner').length}
                  </p>
                </div>
                <Shield className="w-10 h-10 text-[#A67C5C]" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#5A6A66] text-sm mb-1">{t('regularUsers', language)}</p>
                  <p className="text-3xl text-[#2C3E3A]">
                    {users.filter(u => u.role === 'user').length}
                  </p>
                </div>
                <Users className="w-10 h-10 text-[#4A6B5E]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-[#2C3E3A]">{t('userManagement', language)}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-6 bg-gradient-to-r from-[#F5F2ED] to-[#E8E1D5] rounded-2xl border border-[#4A6B5E]/10"
                >
                  {editingUserId === user.id ? (
                    <div className="space-y-4">
                       <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg text-[#2C3E3A]">{safeDisplay(user.username)}</h3>
                          <p className="text-sm text-[#5A6A66]">{t('editingUser', language)}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label className="text-[#2C3E3A]">{t('role', language)}</Label>
                          <Select
                            value={selectedRole}
                            onValueChange={(value: UserRole) => setSelectedRole(value)}
                            disabled={user.role === 'owner' && currentUser.role !== 'owner'}
                          >
                            <SelectTrigger className="h-12 rounded-2xl bg-white border-[#4A6B5E]/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">{t('userRole', language)}</SelectItem>
                              <SelectItem value="admin">{t('adminRole', language)}</SelectItem>
                              {currentUser.role === 'owner' && (
                                <SelectItem value="owner">{t('ownerRole', language)}</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[#2C3E3A]">{t('allowedVows', language)}</Label>
                          <div className="space-y-2 p-4 bg-white rounded-2xl border border-[#4A6B5E]/10">
                            {vowOptions.map((vow) => (
                              <div key={vow.type} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${user.username}-${vow.type}`}
                                  checked={selectedVows.includes(vow.type)}
                                  onCheckedChange={() => toggleVow(vow.type)}
                                />
                                <label
                                  htmlFor={`${user.username}-${vow.type}`}
                                  className="text-sm text-[#2C3E3A] cursor-pointer"
                                >
                                  {vow.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end pt-4">
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="rounded-2xl border-[#4A6B5E]/30 hover:bg-[#4A6B5E]/10"
                        >
                          {t('cancel', language)}
                        </Button>
                        <Button
                          onClick={() => handleSaveEdit(user.id)}
                          className="rounded-2xl bg-gradient-to-r from-[#6B8E7F] to-[#5A7A6D] hover:from-[#5A7A6D] hover:to-[#4A6B5E]"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          {t('saveChanges', language)}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg text-[#2C3E3A]">{safeDisplay(user.username)}</h3>
                          <Badge className={`${getRoleBadgeColor(user.role)} rounded-xl px-3`}>
                            {t(`${user.role}Role`, language)}
                          </Badge>
                          {user.id === currentUserId && (
                            <Badge className="bg-[#C5A572]/20 text-[#C5A572] rounded-xl px-3">
                              {t('you', language)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-[#5A6A66] mb-2">{safeDisplay(user.email)}</p>
                        <div className="flex flex-wrap gap-2">
                          {user.allowedVows.map((vow) => (
                            <Badge
                              key={vow}
                              variant="outline"
                              className="rounded-xl border-[#6B8E7F]/30 text-[#4A6B5E]"
                            >
                              {t(vow, language)}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {((currentUser.role === 'owner') ||
                          (currentUser.role === 'admin' && user.role === 'user')) && (
                          <Button
                            variant="outline"
                            onClick={() => handleStartEdit(user.id, user.role, user.allowedVows)}
                            className="rounded-2xl border-[#4A6B5E]/30 hover:bg-[#4A6B5E]/10"
                          >
                            {t('edit', language)}
                          </Button>
                        )}

                        {user.id !== currentUserId &&
                         (user.role !== 'owner' || currentUser.role === 'owner') && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="rounded-2xl border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('deleteUser', language)}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('deleteUserConfirm', language).replace('{username}', safeDisplay(user.username))}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-2xl">
                                  {t('cancel', language)}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(user.id, user.username)}
                                  className="rounded-2xl bg-red-600 hover:bg-red-700"
                                >
                                  {t('delete', language)}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
