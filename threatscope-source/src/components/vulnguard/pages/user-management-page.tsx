'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  Search,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useVulnGuardStore, type User } from '@/store/vulnguard-store';

// ─── Helpers ───────────────────────────────────────────────────────

const roleBadgeColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'analyst': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    case 'user': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

const statusBadgeColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-emerald-500/20 text-emerald-400';
    case 'inactive': return 'bg-slate-500/20 text-slate-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
};

const avatarColor = (role: string) => {
  switch (role) {
    case 'admin': return 'from-red-500/20 to-red-600/10 border-red-500/30';
    case 'analyst': return 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30';
    case 'user': return 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30';
    default: return 'from-slate-500/20 to-slate-600/10 border-slate-500/30';
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ─── Component ─────────────────────────────────────────────────────

export function UserManagementPage() {
  const { user, users, addUser, updateUser, deleteUser } = useVulnGuardStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'admin' | 'analyst' | 'user'>('user');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');

  const isAdmin = user?.role === 'admin';

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('user');
    setFormStatus('active');
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (targetUser: User) => {
    setFormName(targetUser.name);
    setFormEmail(targetUser.email);
    setFormRole(targetUser.role);
    setFormStatus(targetUser.status);
    setEditingUser(targetUser);
  };

  const handleSaveAdd = () => {
    if (!formName.trim() || !formEmail.trim()) return;
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: formName.trim(),
      email: formEmail.trim(),
      role: formRole,
      avatar: '',
      status: formStatus,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    addUser(newUser);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleSaveEdit = () => {
    if (!editingUser || !formName.trim() || !formEmail.trim()) return;
    updateUser(editingUser.id, {
      name: formName.trim(),
      email: formEmail.trim(),
      role: formRole,
      status: formStatus,
    });
    setEditingUser(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteUser(deleteTarget.id);
    setDeleteTarget(null);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh]"
      >
        <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/10 rounded-2xl p-12 text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Access Denied</h2>
          <p className="text-slate-400 text-sm">
            You need administrator privileges to access User Management.
          </p>
          <p className="text-slate-500 text-xs mt-2">
            Contact your organization admin for access.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">User Management</h1>
            <p className="text-sm text-slate-400">{users.length} users registered</p>
          </div>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-900/60 border-cyan-500/10 text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/30"
        />
      </motion.div>

      {/* Users Table */}
      <motion.div
        variants={itemVariants}
        className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/10 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs">User</TableHead>
                <TableHead className="text-slate-400 text-xs">Email</TableHead>
                <TableHead className="text-slate-400 text-xs">Role</TableHead>
                <TableHead className="text-slate-400 text-xs">Status</TableHead>
                <TableHead className="text-slate-400 text-xs">Last Login</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id} className="border-slate-800/50 hover:bg-slate-800/30">
                  {/* Avatar + Name */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarColor(u.role)} flex items-center justify-center`}>
                        <span className="text-xs font-bold text-slate-200">{u.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-200 max-w-[150px] truncate block">{u.name}</span>
                    </div>
                  </TableCell>
                  {/* Email */}
                  <TableCell>
                    <span className="text-sm text-slate-400 max-w-[200px] truncate block">{u.email}</span>
                  </TableCell>
                  {/* Role */}
                  <TableCell>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadgeColor(u.role)}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </TableCell>
                  {/* Status */}
                  <TableCell>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadgeColor(u.status)}`}>
                      {u.status.toUpperCase()}
                    </span>
                  </TableCell>
                  {/* Last Login */}
                  <TableCell>
                    <span className="text-xs text-slate-500">{formatDate(u.lastLogin)}</span>
                  </TableCell>
                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10"
                        onClick={() => openEditDialog(u)}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => setDeleteTarget(u)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500 text-sm">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-400" />
              Add New User
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Create a new user account with role and permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="add-name" className="text-slate-300 text-xs">Full Name</Label>
              <Input
                id="add-name"
                placeholder="Enter full name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-email" className="text-slate-300 text-xs">Email</Label>
              <Input
                id="add-email"
                type="email"
                placeholder="Enter email address"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs">Role</Label>
              <Select value={formRole} onValueChange={(v: 'admin' | 'analyst' | 'user') => setFormRole(v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-slate-300 text-xs">Active Status</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formStatus === 'active'}
                  onCheckedChange={(checked) => setFormStatus(checked ? 'active' : 'inactive')}
                  className="data-[state=checked]:bg-emerald-500"
                />
                <span className="text-xs text-slate-400">{formStatus === 'active' ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setIsAddDialogOpen(false); resetForm(); }}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAdd}
              disabled={!formName.trim() || !formEmail.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => { if (!open) { setEditingUser(null); resetForm(); } }}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-cyan-400" />
              Edit User
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-slate-300 text-xs">Full Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-slate-300 text-xs">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter email address"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs">Role</Label>
              <Select value={formRole} onValueChange={(v: 'admin' | 'analyst' | 'user') => setFormRole(v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-slate-300 text-xs">Active Status</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formStatus === 'active'}
                  onCheckedChange={(checked) => setFormStatus(checked ? 'active' : 'inactive')}
                  className="data-[state=checked]:bg-emerald-500"
                />
                <span className="text-xs text-slate-400">{formStatus === 'active' ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setEditingUser(null); resetForm(); }}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!formName.trim() || !formEmail.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete <span className="text-slate-200 font-medium">{deleteTarget?.name}</span>?
              This action cannot be undone. All associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
