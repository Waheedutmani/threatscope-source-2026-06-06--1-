'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  LayoutDashboard,
  Scan,
  FileSearch,
  BarChart3,
  FileText,
  Globe,
  Monitor,
  Users,
  UserCircle,
  Settings,
  LogOut,
  ChevronLeft,
  X,
  ShieldCheck,
  Crosshair,
  Clock,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { useVulnGuardStore, type PageName } from '@/store/vulnguard-store';

interface NavItem {
  id: PageName;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'scanner', label: 'Scanner', icon: Scan },
  { id: 'results', label: 'Results', icon: FileSearch },
  { id: 'security-score', label: 'Security Score', icon: ShieldCheck },
  { id: 'attack-surface', label: 'Attack Surface', icon: Crosshair },
  { id: 'scan-history', label: 'Scan History', icon: Clock },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'threat-intel', label: 'Threat Intel', icon: Globe },
  { id: 'executive-dashboard', label: 'Executive', icon: Briefcase },
  { id: 'ai-analysis', label: 'AI Analysis', icon: Sparkles },
  { id: 'security-ops', label: 'Security Ops', icon: Monitor },
  { id: 'user-management', label: 'User Management', icon: Users, adminOnly: true },
];

const bottomNavItems: NavItem[] = [
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const { currentPage, setCurrentPage, user, logout } = useVulnGuardStore();

  const isAdmin = user?.role === 'admin';

  const handleNavClick = (page: PageName) => {
    setCurrentPage(page);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar — 3D depth enhanced background */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed top-0 left-0 h-full z-50 ${sidebarWidth} sidebar-3d flex flex-col
          transition-all duration-300`}
      >
        {/* Header with Logo — blue-purple gradient glow */}
        <div className="flex items-center justify-between p-4 relative">
          {/* Gradient divider line at bottom */}
          <div
            className="absolute bottom-0 left-4 right-4 h-px pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2), rgba(139,92,246,0.2), transparent)',
            }}
          />
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
              className="shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center group/logo
                bg-gradient-to-br from-blue-500/15 to-purple-500/15 border-blue-500/20
                hover:neon-glow-blue
                transition-all duration-300"
              style={{
                boxShadow: '0 0 15px rgba(59,130,246,0.2), 0 0 30px rgba(139,92,246,0.1)',
                animation: 'pulse-glow-anim 3s ease-in-out infinite',
              }}
            >
              <Shield
                className="w-5 h-5 text-blue-400"
                style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.5))' }}
              />
            </motion.div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden"
              >
                <h1 className="text-lg font-bold text-slate-100 whitespace-nowrap">ThreatScope</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider whitespace-nowrap">Vulnerability Scanner</p>
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Collapse button (desktop only) */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all duration-200"
              style={{ transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
                <ChevronLeft className="w-4 h-4" />
              </motion.div>
            </button>

            {/* Close button (mobile only) */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all duration-200"
              style={{ transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Navigation — nav-item-3d on all items, nav-active on active */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;

            const isActive = currentPage === item.id;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  nav-item-3d relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'nav-active text-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }
                `}
                style={{ transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                {/* Active indicator with blue-purple pulsing glow */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-blue-500"
                    style={{
                      boxShadow: '0 0 10px rgba(59,130,246,0.5), 0 0 20px rgba(59,130,246,0.3), 0 0 30px rgba(139,92,246,0.15)',
                      animation: 'sidebarActivePulse 2s ease-in-out infinite',
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  />
                )}
                {/* Active background glow — blue-purple radial */}
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'radial-gradient(ellipse at left center, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}
                  style={isActive ? { filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.4))' } : undefined}
                />

                {!isCollapsed && (
                  <span className="whitespace-nowrap overflow-hidden truncate">{item.label}</span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                    style={{ transition: 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                    {item.label}
                  </div>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar animations style */}
        <style>{`
          @keyframes sidebarActivePulse {
            0%, 100% { box-shadow: 0 0 10px rgba(59,130,246,0.5), 0 0 20px rgba(59,130,246,0.3), 0 0 30px rgba(139,92,246,0.15); }
            50% { box-shadow: 0 0 15px rgba(59,130,246,0.7), 0 0 30px rgba(59,130,246,0.4), 0 0 40px rgba(139,92,246,0.2); }
          }
        `}</style>

        {/* Bottom Navigation — gradient divider, nav-item-3d on items */}
        <div className="relative py-2 px-3 space-y-1">
          {/* Gradient divider line at top */}
          <div
            className="absolute top-0 left-4 right-4 h-px pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.15), rgba(139,92,246,0.15), transparent)',
            }}
          />
          {bottomNavItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  nav-item-3d relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'nav-active text-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }
                `}
                style={{ transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicatorBottom"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-blue-500"
                    style={{
                      boxShadow: '0 0 10px rgba(59,130,246,0.5), 0 0 20px rgba(59,130,246,0.3), 0 0 30px rgba(139,92,246,0.15)',
                      animation: 'sidebarActivePulse 2s ease-in-out infinite',
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  />
                )}
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'radial-gradient(ellipse at left center, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}
                  style={isActive ? { filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.4))' } : undefined}
                />

                {!isCollapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}

                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                    style={{ transition: 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                    {item.label}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* User Section — blue-purple gradient avatar ring, glass-inner-light */}
        <div className="relative p-3 glass-inner-light">
          {/* Gradient divider line at top */}
          <div
            className="absolute top-0 left-4 right-4 h-px pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2), rgba(139,92,246,0.2), transparent)',
            }}
          />
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            {/* User Avatar with blue-purple rotating ring */}
            <div className="shrink-0 w-9 h-9 rounded-lg relative">
              <div
                className="absolute -inset-[2px] rounded-lg"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5), rgba(59,130,246,0.15), rgba(139,92,246,0.5), rgba(59,130,246,0.5))',
                  animation: 'rotate-ring 6s linear infinite',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  padding: '2px',
                  borderRadius: '0.5rem',
                }}
              />
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-400">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            )}

            {!isCollapsed && (
              <motion.button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="cyber-btn-3d shrink-0 w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                style={{
                  padding: 0,
                  fontSize: '0.875rem',
                  color: undefined,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
