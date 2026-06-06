'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useVulnGuardStore, type PageName } from '@/store/vulnguard-store';
import { CyberBackground } from './cyber-background';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { NotificationPanel } from './notification-panel';
import { LoginPage } from '@/components/vulnguard/auth/login-page';
import { RegisterPage } from '@/components/vulnguard/auth/register-page';
import { ForgotPasswordPage } from '@/components/vulnguard/auth/forgot-password-page';
import { ThreatIntelPage } from '@/components/vulnguard/pages/threat-intel-page';
import { SecurityOpsPage } from '@/components/vulnguard/pages/security-ops-page';
import { UserManagementPage } from '@/components/vulnguard/pages/user-management-page';
import { ProfilePage } from '@/components/vulnguard/pages/profile-page';
import { SettingsPage } from '@/components/vulnguard/pages/settings-page';
import { DashboardPage } from '@/components/vulnguard/pages/dashboard-page';
import { ScannerPage } from '@/components/vulnguard/pages/scanner-page';
import { ResultsPage } from '@/components/vulnguard/pages/results-page';
import { AnalyticsPage } from '@/components/vulnguard/pages/analytics-page';
import { ReportsPage } from '@/components/vulnguard/pages/reports-page';
import { SecurityScorePage } from '@/components/vulnguard/pages/security-score-page';
import { AttackSurfacePage } from '@/components/vulnguard/pages/attack-surface-page';
import { ScanHistoryPage } from '@/components/vulnguard/pages/scan-history-page';
import { ExecutiveDashboardPage } from '@/components/vulnguard/pages/executive-dashboard-page';
import { AIAnalysisPage } from '@/components/vulnguard/pages/ai-analysis-page';
import { AIAssistant } from '@/components/vulnguard/ai/ai-assistant';

// Placeholder page components (to be built later)
function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[60vh] p-8"
    >
      <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/10 rounded-2xl p-12 text-center max-w-lg">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">{title}</h2>
        <p className="text-slate-400 text-sm">{description}</p>
        <p className="text-slate-500 text-xs mt-4">This module is under construction</p>
      </div>
    </motion.div>
  );
}

const pageConfig: Record<PageName, { title: string; description: string }> = {
  login: { title: 'Login', description: '' },
  register: { title: 'Register', description: '' },
  'forgot-password': { title: 'Forgot Password', description: '' },
  dashboard: { title: 'Dashboard', description: 'Overview of your security posture, active threats, and vulnerability metrics' },
  scanner: { title: 'Vulnerability Scanner', description: 'Scan targets for security vulnerabilities and misconfigurations' },
  results: { title: 'Scan Results', description: 'View detailed results from completed vulnerability scans' },
  analytics: { title: 'Analytics', description: 'Advanced analytics and insights on vulnerability trends' },
  reports: { title: 'Reports', description: 'Generate and download comprehensive security reports' },
  'threat-intel': { title: 'Threat Intelligence', description: 'Latest threat feeds, CVEs, and indicators of compromise' },
  'user-management': { title: 'User Management', description: 'Manage users, roles, and access permissions' },
  profile: { title: 'Profile', description: 'View and edit your profile information' },
  settings: { title: 'Settings', description: 'Configure application preferences and security settings' },
  'security-ops': { title: 'Security Operations', description: 'Monitor and respond to security incidents in real-time' },
  'security-score': { title: 'Security Score', description: 'Comprehensive security posture assessment and scoring' },
  'attack-surface': { title: 'Attack Surface', description: 'Map and analyze your external attack surface' },
  'scan-history': { title: 'Scan History', description: 'View past scan results and trends' },
  'executive-dashboard': { title: 'Executive Dashboard', description: 'High-level security overview for leadership' },
  'ai-analysis': { title: 'AI Executive Analysis', description: 'AI-powered security analysis, risk assessment, and remediation recommendations' },
};

function PageContent({ page }: { page: PageName }) {
  const config = pageConfig[page];

  switch (page) {
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'forgot-password':
      return <ForgotPasswordPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'scanner':
      return <ScannerPage />;
    case 'threat-intel':
      return <ThreatIntelPage />;
    case 'security-ops':
      return <SecurityOpsPage />;
    case 'user-management':
      return <UserManagementPage />;
    case 'profile':
      return <ProfilePage />;
    case 'results':
      return <ResultsPage />;
    case 'analytics':
      return <AnalyticsPage />;
    case 'reports':
      return <ReportsPage />;
    case 'settings':
      return <SettingsPage />;
    case 'security-score':
      return <SecurityScorePage />;
    case 'attack-surface':
      return <AttackSurfacePage />;
    case 'scan-history':
      return <ScanHistoryPage />;
    case 'executive-dashboard':
      return <ExecutiveDashboardPage />;
    case 'ai-analysis':
      return <AIAnalysisPage />;
    default:
      return <PlaceholderPage title={config.title} description={config.description} />;
  }
}

export function AppLayout() {
  const { isAuthenticated, currentPage, addNotification, notifications } = useVulnGuardStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationsSeededRef = useRef(false);

  const isAuthPage = currentPage === 'login' || currentPage === 'register' || currentPage === 'forgot-password';

  // Seed demo notifications on first login
  useEffect(() => {
    if (isAuthenticated && !notificationsSeededRef.current && notifications.length === 0) {
      const now = new Date();
      const demoNotifications = [
        {
          id: 'notif-1',
          type: 'critical_finding' as const,
          title: 'Critical Vulnerability Detected',
          message: 'CVE-2025-31337 found on production-server-01 with CVSS score 9.8',
          timestamp: new Date(now.getTime() - 5 * 60000).toISOString(),
          read: false,
        },
        {
          id: 'notif-2',
          type: 'scan_complete' as const,
          title: 'Scan Completed',
          message: 'Full vulnerability scan on 192.168.1.0/24 completed with 23 findings',
          timestamp: new Date(now.getTime() - 30 * 60000).toISOString(),
          read: false,
        },
        {
          id: 'notif-3',
          type: 'report_ready' as const,
          title: 'Report Generated',
          message: 'Monthly security assessment report for June 2025 is ready for download',
          timestamp: new Date(now.getTime() - 2 * 3600000).toISOString(),
          read: false,
        },
        {
          id: 'notif-4',
          type: 'user_activity' as const,
          title: 'New User Registered',
          message: 'A new security analyst account has been created and is pending approval',
          timestamp: new Date(now.getTime() - 5 * 3600000).toISOString(),
          read: true,
        },
        {
          id: 'notif-5',
          type: 'critical_finding' as const,
          title: 'SQL Injection Vulnerability',
          message: 'SQL injection detected on api.vulnguard.io/auth endpoint',
          timestamp: new Date(now.getTime() - 24 * 3600000).toISOString(),
          read: true,
        },
      ];
      demoNotifications.forEach((n) => addNotification(n));
      notificationsSeededRef.current = true;
    }
  }, [isAuthenticated, notifications.length, addNotification]);

  // Handle sidebar responsive state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If not authenticated or on auth page, show auth layout
  if (!isAuthenticated || isAuthPage) {
    return (
      <div className="min-h-screen relative">
        <CyberBackground />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PageContent page={currentPage} />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Authenticated layout with sidebar, navbar, etc.
  return (
    <div className="min-h-screen relative">
      <CyberBackground />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 lg:transition-[margin] ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Navbar */}
        <Navbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onNotificationToggle={() => setNotificationOpen(!notificationOpen)}
          isNotificationOpen={notificationOpen}
        />

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PageContent page={currentPage} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />

      {/* AI Assistant (Floating Chatbot) */}
      <AIAssistant />
    </div>
  );
}
