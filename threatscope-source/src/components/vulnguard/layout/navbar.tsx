'use client';

import { motion } from 'framer-motion';
import {
  Menu,
  Bell,
  Zap,
  UserCircle,
  Settings,
  LogOut,
  Shield,
  ChevronDown,
  Search,
  Command,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useVulnGuardStore, type PageName } from '@/store/vulnguard-store';

const pageTitles: Record<PageName, string> = {
  login: 'Login',
  register: 'Register',
  'forgot-password': 'Forgot Password',
  dashboard: 'Dashboard',
  scanner: 'Vulnerability Scanner',
  results: 'Scan Results',
  analytics: 'Analytics',
  reports: 'Reports',
  'threat-intel': 'Threat Intelligence',
  'user-management': 'User Management',
  profile: 'Profile',
  settings: 'Settings',
  'security-ops': 'Security Operations',
  'security-score': 'Security Score',
  'attack-surface': 'Attack Surface',
  'scan-history': 'Scan History',
  'executive-dashboard': 'Executive Dashboard',
  'ai-analysis': 'AI Analysis',
};

interface NavbarProps {
  onMenuToggle: () => void;
  onNotificationToggle: () => void;
  isNotificationOpen: boolean;
}

export function Navbar({ onMenuToggle, onNotificationToggle, isNotificationOpen }: NavbarProps) {
  const { currentPage, setCurrentPage, user, logout, unreadCount } = useVulnGuardStore();

  const unread = unreadCount();

  const handleQuickScan = () => {
    setCurrentPage('scanner');
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-6 bg-slate-900/60 backdrop-blur-[32px] saturate-[1.8] border-b border-blue-500/10 glass-inner-light"
      style={{
        boxShadow:
          '0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(59,130,246,0.04), 0 1px 0 rgba(59,130,246,0.06) inset, 0 0 40px rgba(139,92,246,0.03)',
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Page Title with neon glow and animated underline */}
        <div className="flex items-center gap-2 relative group">
          <Shield className="w-5 h-5 text-blue-500 hidden sm:block" />
          <div className="relative">
            <h2 className="text-lg font-semibold text-slate-100 truncate max-w-[200px] sm:max-w-none neon-text-blue">
              {pageTitles[currentPage]}
            </h2>
            {/* Animated gradient underline matching current section */}
            <motion.div
              className="absolute -bottom-1 left-0 h-[2px] rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              key={currentPage}
              style={{
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)',
                backgroundSize: '200% 100%',
                animation: 'title-underline-flow 3s ease-in-out infinite',
                boxShadow: '0 0 8px rgba(59,130,246,0.4), 0 0 16px rgba(139,92,246,0.2)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Search/Command Bar Placeholder with Ctrl+K hint */}
        <button
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/40 backdrop-blur-xl border border-slate-700/30 hover:border-blue-500/20 hover:bg-slate-800/60 transition-all duration-300 cursor-pointer group/search"
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)',
          }}
        >
          <Search className="w-4 h-4 text-slate-500 group-hover/search:text-blue-400 transition-colors" />
          <span className="text-xs text-slate-500 group-hover/search:text-slate-400 transition-colors">
            Search...
          </span>
          <kbd
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-700/50 border border-slate-600/40 text-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </kbd>
        </button>

        {/* Quick Scan Button with cyber-btn-3d styling and blue-purple scheme */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleQuickScan}
            size="sm"
            className="hidden sm:flex items-center gap-2 cyber-btn-3d bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white hover:shadow-[0_0_25px_rgba(59,130,246,0.25),0_0_50px_rgba(139,92,246,0.15)] transition-all duration-300 relative overflow-hidden"
            style={{
              color: 'rgba(59, 130, 246, 0.9)',
            }}
          >
            {/* Scanning light sweep on hover */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                className="absolute top-0 h-full w-1/3"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), rgba(139,92,246,0.08), transparent)',
                  animation: 'btnScanLine 3s ease-in-out infinite',
                }}
              />
            </div>
            <Zap className="w-4 h-4 relative z-10 text-white" />
            <span className="relative z-10 text-white">Quick Scan</span>
          </Button>
        </motion.div>

        {/* Notification Bell with neon-glow-blue when open */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationToggle}
            className={`relative text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all duration-300 ${isNotificationOpen ? 'neon-glow-blue text-blue-400 bg-blue-500/10' : ''} ${unread > 0 && !isNotificationOpen ? 'bell-pulse' : ''}`}
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 bg-red-500 text-white text-[10px] font-bold border-2 border-slate-900">
                {unread > 9 ? '9+' : unread}
              </Badge>
            )}
          </Button>
        </motion.div>

        {/* User Dropdown with glass-card-float and blue-purple gradient borders */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 px-2"
            >
              {/* User avatar with rotating gradient ring */}
              <div className="w-8 h-8 rounded-lg relative">
                <div
                  className="absolute -inset-[2px] rounded-lg"
                  style={{
                    background:
                      'conic-gradient(from 0deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5), rgba(59,130,246,0.15), rgba(139,92,246,0.4), rgba(59,130,246,0.5))',
                    animation: 'rotate-ring 4s linear infinite',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    padding: '2px',
                    borderRadius: '0.5rem',
                  }}
                />
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-400">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <span className="hidden md:block text-sm font-medium max-w-[120px] truncate">
                {user?.name}
              </span>
              <ChevronDown className="w-3 h-3 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-slate-900/90 backdrop-blur-[28px] saturate-[1.8] border border-blue-500/15 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.06),0_2px_8px_rgba(139,92,246,0.04)]"
            style={{
              background: 'rgba(15, 23, 42, 0.92)',
            }}
          >
            {/* Blue-purple gradient border top accent */}
            <div
              className="absolute top-0 left-[10%] right-[10%] h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.4), rgba(139,92,246,0.4), transparent)',
              }}
            />
            <DropdownMenuLabel className="text-slate-400">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator
              className="bg-gradient-to-r from-transparent via-blue-500/15 to-transparent"
            />
            <DropdownMenuItem
              onClick={() => setCurrentPage('profile')}
              className="text-slate-300 focus:bg-blue-500/10 focus:text-slate-100 cursor-pointer hover:shadow-[inset_1px_0_0_rgba(59,130,246,0.3)] transition-all duration-200"
            >
              <UserCircle className="w-4 h-4 mr-2 text-blue-400/60" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setCurrentPage('settings')}
              className="text-slate-300 focus:bg-blue-500/10 focus:text-slate-100 cursor-pointer hover:shadow-[inset_1px_0_0_rgba(59,130,246,0.3)] transition-all duration-200"
            >
              <Settings className="w-4 h-4 mr-2 text-purple-400/60" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator
              className="bg-gradient-to-r from-transparent via-blue-500/15 to-transparent"
            />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer hover:shadow-[inset_1px_0_0_rgba(239,68,68,0.3)] transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Keyframe for title underline flow animation */}
      <style jsx>{`
        @keyframes title-underline-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </header>
  );
}
