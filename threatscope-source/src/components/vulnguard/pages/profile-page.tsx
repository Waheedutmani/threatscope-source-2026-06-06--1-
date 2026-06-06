'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircle,
  Edit,
  Save,
  X,
  Shield,
  Activity,
  FileText,
  Scan,
  Clock,
  Monitor,
  Globe,
  Lock,
  LogOut,
  ChevronDown,
  ChevronUp,
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
import { useVulnGuardStore } from '@/store/vulnguard-store';

// ─── Mock Data ─────────────────────────────────────────────────────

const LOGIN_HISTORY = [
  { ip: '192.168.1.105', browser: 'Chrome 126', date: '2025-06-05 09:15 AM', location: 'San Francisco, US' },
  { ip: '10.0.0.42', browser: 'Firefox 127', date: '2025-06-04 02:30 PM', location: 'New York, US' },
  { ip: '172.16.0.88', browser: 'Chrome 126', date: '2025-06-03 11:45 AM', location: 'San Francisco, US' },
  { ip: '192.168.1.105', browser: 'Safari 17', date: '2025-06-02 08:20 AM', location: 'San Francisco, US' },
  { ip: '10.0.0.42', browser: 'Chrome 125', date: '2025-05-30 04:10 PM', location: 'New York, US' },
];

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

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
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

export function ProfilePage() {
  const { user, updateUser, logout, scans } = useVulnGuardStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editEmail, setEditEmail] = useState(user?.email ?? '');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = () => {
    if (!user || !editName.trim() || !editEmail.trim()) return;
    updateUser(user.id, { name: editName.trim(), email: editEmail.trim() });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(user?.name ?? '');
    setEditEmail(user?.email ?? '');
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    // Demo - just reset the form
    setShowPasswordForm(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const totalScans = scans.length;
  const lastScanDate = scans.length > 0
    ? formatDate(scans[0].completedAt ?? scans[0].startedAt)
    : 'No scans yet';

  if (!user) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Profile Header */}
      <motion.div
        variants={itemVariants}
        className="glass-card-float rounded-xl p-6 depth-shadow-md"
      >
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <span className="text-3xl font-bold text-emerald-400">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl font-bold threatscope-ai-title">{user.name}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadgeColor(user.role)}`}>
                {user.role.toUpperCase()}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadgeColor(user.status)}`}>
                {user.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Member since {formatDate(user.createdAt)}
            </p>
          </div>

          {/* Edit Button */}
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </motion.div>

      {/* Profile Information Card */}
      <motion.div
        variants={itemVariants}
        className="glass-card-float rounded-xl p-6 depth-shadow-md"
      >
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <UserCircle className="w-4 h-4 text-cyan-400" />
          Profile Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label className="text-slate-400 text-xs">Full Name</Label>
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-200"
              />
            ) : (
              <p className="text-sm text-slate-200 bg-slate-800/40 rounded-md px-3 py-2">{user.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-slate-400 text-xs">Email</Label>
            {isEditing ? (
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-200"
              />
            ) : (
              <p className="text-sm text-slate-200 bg-slate-800/40 rounded-md px-3 py-2">{user.email}</p>
            )}
          </div>

          {/* Role (read-only) */}
          <div className="space-y-2">
            <Label className="text-slate-400 text-xs">Role</Label>
            <p className="text-sm text-slate-200 bg-slate-800/40 rounded-md px-3 py-2 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              <span className="text-[10px] text-slate-600">(read-only)</span>
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-slate-400 text-xs">Status</Label>
            <p className="text-sm text-slate-200 bg-slate-800/40 rounded-md px-3 py-2 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </p>
          </div>

          {/* Created Date (read-only) */}
          <div className="space-y-2">
            <Label className="text-slate-400 text-xs">Account Created</Label>
            <p className="text-sm text-slate-200 bg-slate-800/40 rounded-md px-3 py-2 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-800">
            <Button
              onClick={handleSaveProfile}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button
              onClick={handleCancelEdit}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        )}
      </motion.div>

      {/* Activity Section */}
      <motion.div
        variants={itemVariants}
        className="glass-card-float rounded-xl p-6 depth-shadow-md"
      >
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          Activity Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg depth-shadow-sm bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Scan className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-400">Scan History</span>
            </div>
            <p className="text-lg font-bold text-slate-100">{totalScans}</p>
            <p className="text-[10px] text-slate-500 mt-1">Last: {lastScanDate}</p>
          </div>
          <div className="p-4 rounded-lg depth-shadow-sm bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">Reports Generated</span>
            </div>
            <p className="text-lg font-bold text-slate-100">14</p>
            <p className="text-[10px] text-slate-500 mt-1">Last: Jun 4, 2025</p>
          </div>
          <div className="p-4 rounded-lg depth-shadow-sm bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-slate-400">Recent Findings</span>
            </div>
            <p className="text-lg font-bold text-slate-100">89</p>
            <p className="text-[10px] text-slate-500 mt-1">12 critical, 23 high</p>
          </div>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        variants={itemVariants}
        className="glass-card-float rounded-xl p-6 depth-shadow-md"
      >
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-red-400" />
          Security
        </h3>

        {/* Login History Table */}
        <div className="mb-5">
          <p className="text-xs text-slate-400 mb-3">Login History</p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-500 text-xs">IP Address</TableHead>
                  <TableHead className="text-slate-500 text-xs">Browser</TableHead>
                  <TableHead className="text-slate-500 text-xs">Location</TableHead>
                  <TableHead className="text-slate-500 text-xs">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LOGIN_HISTORY.map((entry, idx) => (
                  <TableRow key={idx} className="border-slate-800/50 hover:bg-slate-800/30">
                    <TableCell>
                      <span className="font-mono text-xs text-slate-300">{entry.ip}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Monitor className="w-3 h-3 text-slate-500" />
                        {entry.browser}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Globe className="w-3 h-3 text-slate-500" />
                        {entry.location}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-500">{entry.date}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="flex items-center justify-between p-4 rounded-lg depth-shadow-sm bg-slate-800/40 border border-slate-700/50 mb-4">
          <div>
            <p className="text-sm text-slate-200">Active Sessions</p>
            <p className="text-xs text-slate-500">2 devices currently logged in</p>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            2 Active
          </Badge>
        </div>

        {/* Change Password */}
        <div className="space-y-3">
          <Button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            variant="outline"
            className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 gap-2 w-full sm:w-auto"
          >
            <Lock className="w-4 h-4" />
            Change Password
            {showPasswordForm ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>

          {showPasswordForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 p-4 rounded-lg depth-shadow-sm bg-slate-800/40 border border-slate-700/50"
            >
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs">Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs">New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs">Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-600"
                />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Button
                  onClick={handleChangePassword}
                  disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Update Password
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowPasswordForm(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Logout All Sessions */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <Button
            onClick={() => logout()}
            variant="outline"
            className="border-red-500/20 text-red-400 hover:bg-red-500/10 gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout All Sessions
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
