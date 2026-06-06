'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  Filter,
  Search,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// ─── Counting Animation Hook ──────────────────────────────────────────
function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return count;
}

// ─── Mock Data Constants ──────────────────────────────────────────────

const SCAN_HISTORY_DATA = [
  { month: 'Jan', score: 65, previous: 58, critical: 8, high: 18, medium: 24, low: 20 },
  { month: 'Feb', score: 68, previous: 60, critical: 7, high: 16, medium: 22, low: 19 },
  { month: 'Mar', score: 72, previous: 63, critical: 6, high: 14, medium: 20, low: 18 },
  { month: 'Apr', score: 70, previous: 65, critical: 7, high: 15, medium: 21, low: 17 },
  { month: 'May', score: 75, previous: 66, critical: 5, high: 13, medium: 19, low: 16 },
  { month: 'Jun', score: 79, previous: 70, critical: 4, high: 12, medium: 17, low: 15 },
  { month: 'Jul', score: 77, previous: 68, critical: 5, high: 13, medium: 18, low: 14 },
  { month: 'Aug', score: 82, previous: 72, critical: 3, high: 10, medium: 16, low: 13 },
  { month: 'Sep', score: 80, previous: 74, critical: 4, high: 11, medium: 15, low: 12 },
  { month: 'Oct', score: 85, previous: 76, critical: 2, high: 9, medium: 14, low: 11 },
  { month: 'Nov', score: 83, previous: 75, critical: 3, high: 10, medium: 15, low: 10 },
  { month: 'Dec', score: 82, previous: 74, critical: 3, high: 9, medium: 14, low: 10 },
];

const TIMELINE_ENTRIES = [
  {
    id: 'scan-001',
    date: '2025-12-15',
    target: 'prod-api.vulnguard.io',
    type: 'Full' as const,
    critical: 2,
    high: 5,
    medium: 8,
    low: 6,
    score: 85,
    status: 'Completed' as const,
    duration: '4h 23m',
  },
  {
    id: 'scan-002',
    date: '2025-12-08',
    target: 'staging-web.vulnguard.io',
    type: 'Quick' as const,
    critical: 1,
    high: 3,
    medium: 6,
    low: 4,
    score: 88,
    status: 'Completed' as const,
    duration: '1h 12m',
  },
  {
    id: 'scan-003',
    date: '2025-12-01',
    target: 'db-cluster.internal.vulnguard.io',
    type: 'Full' as const,
    critical: 4,
    high: 8,
    medium: 12,
    low: 9,
    score: 72,
    status: 'Completed' as const,
    duration: '6h 45m',
  },
  {
    id: 'scan-004',
    date: '2025-11-24',
    target: 'cdn-edge.vulnguard.io',
    type: 'Custom' as const,
    critical: 0,
    high: 2,
    medium: 5,
    low: 3,
    score: 91,
    status: 'Completed' as const,
    duration: '2h 08m',
  },
  {
    id: 'scan-005',
    date: '2025-11-17',
    target: 'auth-service.vulnguard.io',
    type: 'Full' as const,
    critical: 3,
    high: 7,
    medium: 10,
    low: 8,
    score: 76,
    status: 'Completed' as const,
    duration: '5h 30m',
  },
  {
    id: 'scan-006',
    date: '2025-11-10',
    target: 'mail-server.vulnguard.io',
    type: 'Quick' as const,
    critical: 1,
    high: 4,
    medium: 7,
    low: 5,
    score: 80,
    status: 'Failed' as const,
    duration: '0h 47m',
  },
  {
    id: 'scan-007',
    date: '2025-11-03',
    target: 'k8s-cluster.vulnguard.io',
    type: 'Full' as const,
    critical: 2,
    high: 6,
    medium: 9,
    low: 7,
    score: 78,
    status: 'Completed' as const,
    duration: '3h 55m',
  },
  {
    id: 'scan-008',
    date: '2025-10-27',
    target: 'legacy-app.internal.vulnguard.io',
    type: 'Custom' as const,
    critical: 5,
    high: 10,
    medium: 14,
    low: 11,
    score: 62,
    status: 'Completed' as const,
    duration: '7h 20m',
  },
  {
    id: 'scan-009',
    date: '2025-10-20',
    target: 'dev-api.vulnguard.io',
    type: 'Quick' as const,
    critical: 0,
    high: 1,
    medium: 3,
    low: 2,
    score: 93,
    status: 'Completed' as const,
    duration: '0h 52m',
  },
  {
    id: 'scan-010',
    date: '2025-10-13',
    target: 'firewall-edge.vulnguard.io',
    type: 'Full' as const,
    critical: 1,
    high: 4,
    medium: 6,
    low: 5,
    score: 84,
    status: 'In Progress' as const,
    duration: '—',
  },
];

const REMEDIATION_PROGRESS = [
  {
    id: 'rem-001',
    title: 'Patch SQL Injection in Login API',
    status: 'Completed' as const,
    progress: 100,
    date: 'Completed Dec 12',
  },
  {
    id: 'rem-002',
    title: 'Update TLS Configuration on Mail Server',
    status: 'In Progress' as const,
    progress: 68,
    date: 'Due Dec 22',
  },
  {
    id: 'rem-003',
    title: 'Add Missing Security Headers (CSP, HSTS)',
    status: 'In Progress' as const,
    progress: 45,
    date: 'Due Dec 28',
  },
  {
    id: 'rem-004',
    title: 'Close Unnecessary Open Ports (8 ports)',
    status: 'Pending' as const,
    progress: 0,
    date: 'Due Jan 05',
  },
  {
    id: 'rem-005',
    title: 'Remediate CSRF Token Vulnerabilities',
    status: 'In Progress' as const,
    progress: 82,
    date: 'Due Dec 20',
  },
  {
    id: 'rem-006',
    title: 'Upgrade OpenSSL on DB Cluster',
    status: 'Pending' as const,
    progress: 0,
    date: 'Due Jan 10',
  },
];

const RISK_REDUCTION_DATA = [
  { category: 'Network', before: 78, after: 32 },
  { category: 'Web', before: 85, after: 41 },
  { category: 'Auth', before: 62, after: 28 },
  { category: 'Data', before: 71, after: 35 },
  { category: 'Compliance', before: 55, after: 22 },
];

// ─── Helper Functions ─────────────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score >= 85) return '#22c55e';
  if (score >= 70) return '#10b981';
  if (score >= 55) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function getScoreColorClass(score: number): string {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-emerald-400';
  if (score >= 55) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

function getTimelineDotColor(score: number): string {
  if (score >= 85) return '#22c55e';
  if (score >= 70) return '#10b981';
  if (score >= 55) return '#eab308';
  return '#ef4444';
}

function formatDate(dateStr: string): { day: string; month: string; year: string } {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: d.toLocaleString('en', { month: 'short' }),
    year: d.getFullYear().toString().slice(-2),
  };
}

// ─── Custom Tooltips ──────────────────────────────────────────────────

function CustomScoreTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (active && payload && payload.length >= 2) {
    const current = payload.find(p => p.name === 'Current Score');
    const previous = payload.find(p => p.name === 'Previous Year');
    const delta = current && previous ? current.value - previous.value : 0;

    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-cyan-500/20 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
        {payload.map((entry, idx: number) => (
          <div key={idx} className="flex items-center gap-2 mb-1 last:mb-0">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-slate-700/50">
          <span className={`text-xs font-medium ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {delta >= 0 ? '+' : ''}{delta} improvement
          </span>
        </div>
      </div>
    );
  }
  return null;
}

function CustomVulnTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-cyan-500/20 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        {payload.map((entry: { name: string; value: number; color: string }, idx: number) => (
          <p key={idx} className="text-xs font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function CustomBarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-cyan-500/20 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
        {payload.map((entry, idx: number) => (
          <div key={idx} className="flex items-center gap-2 mb-1 last:mb-0">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </span>
          </div>
        ))}
        {payload.length >= 2 && (
          <div className="mt-2 pt-2 border-t border-slate-700/50">
            <span className="text-xs text-emerald-400 font-medium">
              -{payload[0].value - payload[1].value} risk reduction
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

// ─── KPI Card Component ───────────────────────────────────────────────

interface KPICardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  trend?: number;
  accentColor: 'cyan' | 'emerald' | 'orange';
  delay: number;
}

function KPICard({ icon: Icon, label, value, suffix = '', trend, accentColor, delay }: KPICardProps) {
  const animatedValue = useCountUp(value, 1800);

  const accentMap = {
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      text: 'text-cyan-400',
      shadow: '0 0 20px rgba(6,182,212,0.15)',
      corner: 'border-cyan-500/30',
      glow: 'rgba(6,182,212,0.15)',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      shadow: '0 0 20px rgba(16,185,129,0.15)',
      corner: 'border-emerald-500/30',
      glow: 'rgba(16,185,129,0.15)',
    },
    orange: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      text: 'text-orange-400',
      shadow: '0 0 20px rgba(249,115,22,0.15)',
      corner: 'border-orange-500/30',
      glow: 'rgba(249,115,22,0.15)',
    },
  };

  const accent = accentMap[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group glass-card-float breathe-glow rounded-xl p-5 relative cursor-default"
      style={{
        boxShadow: accent.shadow,
      }}
    >
      {/* Cyber corner accents */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg pointer-events-none z-20 ${accent.corner}`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-lg pointer-events-none z-20 ${accent.corner}`} />

      {/* Pulsing glow */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${accent.glow} 0%, transparent 70%)`,
          opacity: 0.5,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${accent.text}`} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <p className="text-sm text-slate-400 mb-1 truncate">{label}</p>
        <p className={`text-3xl font-bold ${accent.text}`}>
          {animatedValue}{suffix}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Scan Type Badge ──────────────────────────────────────────────────

function ScanTypeBadge({ type }: { type: 'Quick' | 'Full' | 'Custom' }) {
  const styles: Record<string, string> = {
    Quick: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    Full: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Custom: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[type]}`}>
      {type}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────

function ScanStatusBadge({ status }: { status: 'Completed' | 'Failed' | 'In Progress' }) {
  const config: Record<string, { style: string; icon: React.ElementType }> = {
    'Completed': { style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
    'Failed': { style: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle },
    'In Progress': { style: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', icon: Activity },
  };
  const cfg = config[status];
  const StatusIcon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${cfg.style} badge-3d`}>
      <StatusIcon className="w-3 h-3" />
      {status}
    </span>
  );
}

// ─── Remediation Status Indicator ─────────────────────────────────────

function RemediationStatusIndicator({ status }: { status: 'Completed' | 'In Progress' | 'Pending' }) {
  const config: Record<string, { dot: string; text: string }> = {
    'Completed': { dot: 'bg-emerald-400', text: 'text-emerald-400' },
    'In Progress': { dot: 'bg-cyan-400 animate-pulse', text: 'text-cyan-400' },
    'Pending': { dot: 'bg-slate-400', text: 'text-slate-400' },
  };
  const cfg = config[status];
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      <span className={`text-xs font-medium ${cfg.text}`}>{status}</span>
    </div>
  );
}

// ─── Timeline Entry Component ─────────────────────────────────────────

function TimelineEntry({ entry, index }: { entry: typeof TIMELINE_ENTRIES[number]; index: number }) {
  const dateInfo = formatDate(entry.date);
  const dotColor = getTimelineDotColor(entry.score);
  const totalVulns = entry.critical + entry.high + entry.medium + entry.low;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      className="flex gap-4 relative group"
    >
      {/* Date Badge - Left Side */}
      <div className="flex flex-col items-center shrink-0 w-16 pt-1">
        <div className="glass-card-float rounded-lg px-2 py-1.5 text-center border border-slate-700/30">
          <p className="text-lg font-bold text-slate-200 leading-tight">{dateInfo.day}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">{dateInfo.month}</p>
          <p className="text-[10px] text-slate-500">{dateInfo.year}</p>
        </div>
      </div>

      {/* Timeline Connector + Dot */}
      <div className="flex flex-col items-center shrink-0 relative">
        {/* Dot */}
        <div
          className="w-4 h-4 rounded-full border-2 border-slate-900 z-10 relative shrink-0"
          style={{
            backgroundColor: dotColor,
            boxShadow: `0 0 12px ${dotColor}60, 0 0 24px ${dotColor}30`,
          }}
        />
        {/* Line */}
        {index < TIMELINE_ENTRIES.length - 1 && (
          <div
            className="w-0.5 flex-1 min-h-[40px]"
            style={{
              background: 'linear-gradient(to bottom, #06b6d4, #10b981)',
              opacity: 0.4,
            }}
          />
        )}
      </div>

      {/* Scan Card - Right Side */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex-1 glass-card-float notification-card-3d rounded-xl p-4 mb-4 relative group-hover:border-slate-600/40 transition-colors"
        style={{
          borderLeft: `3px solid ${dotColor}`,
        }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg pointer-events-none z-20 border-slate-600/20" />

        <div className="relative z-10">
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-200 truncate max-w-[200px]">
                {entry.target}
              </h4>
              <ScanTypeBadge type={entry.type} />
            </div>
            <ScanStatusBadge status={entry.status} />
          </div>

          {/* Vuln breakdown */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs text-red-400 font-medium">{entry.critical}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-xs text-orange-400 font-medium">{entry.high}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-xs text-yellow-400 font-medium">{entry.medium}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-emerald-400 font-medium">{entry.low}</span>
            </div>
            <span className="text-xs text-slate-500 ml-auto">
              {totalVulns} total
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span className={`text-sm font-bold ${getScoreColorClass(entry.score)}`}>
                {entry.score}
              </span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              {entry.duration}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Scan History Page ───────────────────────────────────────────

export function ScanHistoryPage() {
  return (
    <div className="space-y-6 relative mesh-gradient-bg">
      {/* Ambient orbs for atmospheric depth */}
      <div className="ambient-orb w-[500px] h-[500px] top-[-10%] left-[-5%] opacity-25" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="ambient-orb w-[600px] h-[600px] bottom-[-15%] right-[-8%] opacity-20" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', filter: 'blur(90px)' }} />
      <div className="ambient-orb w-[400px] h-[400px] top-[35%] left-[45%] opacity-20" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      {/* ═══════════════════════════════════════════════════════════════
          1. HEADER SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
          >
            <Clock className="w-5 h-5 text-cyan-400" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold threatscope-ai-title inline-block">Scan History</h2>
            <motion.div
              className="h-0.5 bg-gradient-to-r from-cyan-500/60 via-emerald-500/60 to-transparent rounded-full mt-1"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
          </div>
        </div>
        <p className="text-sm text-slate-400">
          Track historical vulnerability data and security posture evolution over time
        </p>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          2. SUMMARY STATS ROW (4 KPI Cards)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 stagger-3d">
        <KPICard
          icon={Activity}
          label="Total Scans"
          value={47}
          trend={12}
          accentColor="cyan"
          delay={0.1}
        />
        <KPICard
          icon={Shield}
          label="Avg Security Score"
          value={78}
          trend={8}
          accentColor="emerald"
          delay={0.15}
        />
        <KPICard
          icon={AlertTriangle}
          label="Vulnerabilities Found"
          value={156}
          trend={-5}
          accentColor="orange"
          delay={0.2}
        />
        <KPICard
          icon={TrendingUp}
          label="Remediation Rate"
          value={64}
          suffix="%"
          trend={9}
          accentColor="emerald"
          delay={0.25}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          3. SECURITY SCORE EVOLUTION CHART
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card-float analytics-panel-elevated rounded-xl p-6 relative scan-line-vertical"
      >
        {/* Cyber corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 rounded-tr-xl pointer-events-none z-20 border-emerald-500/20" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 rounded-bl-xl pointer-events-none z-20 border-emerald-500/20" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Security Score Evolution
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-emerald-400 inline-block" />
              <span className="text-xs text-slate-500">Current Year</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-slate-500 inline-block" style={{ borderStyle: 'dashed' }} />
              <span className="text-xs text-slate-500">Previous Year</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280} className="relative z-10">
          <AreaChart data={SCAN_HISTORY_DATA}>
            <defs>
              <linearGradient id="scoreGradientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: '#1e293b' }}
            />
            <YAxis
              domain={[40, 100]}
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: '#1e293b' }}
            />
            <Tooltip content={<CustomScoreTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#scoreGradientFill)"
              name="Current Score"
              dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }}
              style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.4))' }}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="#475569"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              dot={{ fill: '#475569', r: 2, strokeWidth: 0 }}
              activeDot={{ r: 4, fill: '#475569', stroke: '#0f172a', strokeWidth: 2 }}
              name="Previous Year"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Improvement Badge */}
        <div className="flex items-center justify-center mt-3 relative z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">+8 avg improvement</span>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          4. VULNERABILITY TRENDS CHART (Stacked Area)
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card-float analytics-panel-elevated rounded-xl p-6 relative"
      >
        {/* Cyber corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

        <div className="flex items-center gap-2 mb-4 relative z-10">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Vulnerability Trends
          </h3>
        </div>

        <ResponsiveContainer width="100%" height={280} className="relative z-10">
          <AreaChart data={SCAN_HISTORY_DATA}>
            <defs>
              <linearGradient id="criticalVulnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="highVulnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="mediumVulnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eab308" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#eab308" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="lowVulnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
            <Tooltip content={<CustomVulnTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
              formatter={(value: string) => <span style={{ color: '#94a3b8' }}>{value}</span>}
            />
            <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="url(#criticalVulnGrad)" name="Critical" />
            <Area type="monotone" dataKey="high" stackId="1" stroke="#f97316" fill="url(#highVulnGrad)" name="High" />
            <Area type="monotone" dataKey="medium" stackId="1" stroke="#eab308" fill="url(#mediumVulnGrad)" name="Medium" />
            <Area type="monotone" dataKey="low" stackId="1" stroke="#22c55e" fill="url(#lowVulnGrad)" name="Low" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          5. SCAN TIMELINE (Main Feature)
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-card-float analytics-panel-elevated rounded-xl p-6 relative"
      >
        {/* Cyber corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 rounded-tr-xl pointer-events-none z-20 border-emerald-500/20" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 rounded-bl-xl pointer-events-none z-20 border-emerald-500/20" />

        {/* Beam sweep effect */}
        <div className="absolute inset-0 beam-sweep rounded-xl pointer-events-none z-0" />

        <div className="flex items-center gap-2 mb-6 relative z-10">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Scan Timeline
          </h3>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-500">{TIMELINE_ENTRIES.length} scans</span>
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto pr-2 relative z-10 stagger-3d" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}>
          {TIMELINE_ENTRIES.map((entry, i) => (
            <TimelineEntry key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          6. RISK REDUCTION TRENDS (BarChart)
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass-card-float analytics-panel-elevated rounded-xl p-6 relative scan-line-vertical"
      >
        {/* Cyber corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

        <div className="flex items-center gap-2 mb-4 relative z-10">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Risk Reduction Trends
          </h3>
        </div>

        <ResponsiveContainer width="100%" height={300} className="relative z-10">
          <BarChart data={RISK_REDUCTION_DATA} barGap={4} barCategoryGap="20%">
            <defs>
              <linearGradient id="beforeBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="afterBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="category"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#1e293b' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: '#1e293b' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
              formatter={(value: string) => <span style={{ color: '#94a3b8' }}>{value}</span>}
            />
            <Bar dataKey="before" fill="url(#beforeBarGrad)" radius={[4, 4, 0, 0]} name="Before" barSize={20} />
            <Bar dataKey="after" fill="url(#afterBarGrad)" radius={[4, 4, 0, 0]} name="After" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          7. REMEDIATION PROGRESS TRACKER
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="glass-card-float rounded-xl p-6 relative"
      >
        {/* Cyber corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 rounded-tr-xl pointer-events-none z-20 border-emerald-500/20" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 rounded-bl-xl pointer-events-none z-20 border-emerald-500/20" />

        {/* Beam sweep */}
        <div className="absolute inset-0 beam-sweep rounded-xl pointer-events-none z-0" />

        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Remediation Progress
            </h3>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs text-emerald-400 font-medium">2 of 6 completed</span>
          </div>
        </div>

        <div className="space-y-4 relative z-10 stagger-3d">
          {REMEDIATION_PROGRESS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.08 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <RemediationStatusIndicator status={item.status} />
                  <span className="text-sm text-slate-200 font-medium truncate max-w-[280px]">
                    {item.title}
                  </span>
                </div>
                <span className="text-xs text-slate-500 shrink-0 ml-4">{item.date}</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor:
                      item.status === 'Completed'
                        ? '#10b981'
                        : item.status === 'In Progress'
                        ? '#06b6d4'
                        : '#475569',
                    boxShadow:
                      item.status === 'Completed'
                        ? '0 0 8px rgba(16,185,129,0.4)'
                        : item.status === 'In Progress'
                        ? '0 0 8px rgba(6,182,212,0.4)'
                        : 'none',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: 1, delay: 0.9 + i * 0.1, ease: 'easeOut' }}
                />
              </div>
              {item.progress > 0 && item.progress < 100 && (
                <div className="mt-1">
                  <span className="text-[10px] text-slate-500">{item.progress}% complete</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
