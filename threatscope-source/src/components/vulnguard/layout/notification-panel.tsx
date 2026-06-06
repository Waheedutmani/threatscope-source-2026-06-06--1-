'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bell,
  CheckCircle,
  AlertTriangle,
  FileText,
  Activity,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVulnGuardStore, type Notification } from '@/store/vulnguard-store';

const notificationConfig: Record<Notification['type'], { icon: React.ElementType; color: string; bgColor: string }> = {
  scan_complete: { icon: CheckCircle, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  critical_finding: { icon: AlertTriangle, color: 'text-red-400', bgColor: 'bg-red-500/10' },
  report_ready: { icon: FileText, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
  user_activity: { icon: Activity, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
};

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useVulnGuardStore();
  const unread = unreadCount();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50
              bg-slate-900/95 backdrop-blur-xl border-l border-cyan-500/10
              flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-cyan-500/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100">Notifications</h3>
                  <p className="text-xs text-slate-500">
                    {unread > 0 ? `${unread} unread` : 'All caught up'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllNotificationsRead}
                    className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">No notifications yet</p>
                  <p className="text-slate-500 text-xs mt-1 text-center">
                    Notifications will appear here when scans complete or threats are detected
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {notifications.map((notification, index) => {
                    const config = notificationConfig[notification.type];
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={() => markNotificationRead(notification.id)}
                        className={`
                          relative p-3 rounded-lg cursor-pointer transition-all duration-200
                          ${notification.read
                            ? 'bg-transparent hover:bg-slate-800/30'
                            : 'bg-slate-800/40 hover:bg-slate-800/50 border-l-2 border-l-emerald-500'
                          }
                        `}
                      >
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div className={`shrink-0 w-9 h-9 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${config.color}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-medium ${notification.read ? 'text-slate-400' : 'text-slate-200'}`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="shrink-0 w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                              )}
                            </div>
                            <p className={`text-xs mt-0.5 ${notification.read ? 'text-slate-500' : 'text-slate-400'}`}>
                              {notification.message}
                            </p>
                            <p className="text-[10px] text-slate-600 mt-1">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
