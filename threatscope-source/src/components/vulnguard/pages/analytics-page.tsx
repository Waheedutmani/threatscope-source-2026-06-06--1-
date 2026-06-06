'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  AlertOctagon,
  ShieldAlert,
  AlertTriangle,
  Bug,
  Lock,
  Globe,
  Server,
  Wifi,
  Database,
  Code,
  KeyRound,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// ─── Dynamic 3D Component Imports (SSR disabled) ──────────────────────
const ThreeBarChart = dynamic(
  () => import('@/components/vulnguard/3d/three-bar-chart').then((mod) => ({ default: mod.ThreeBarChart })),
  { ssr: false }
);

const MiniGlobe = dynamic(
  () => import('@/components/vulnguard/3d/cyber-globe').then((mod) => ({ default: mod.MiniGlobe })),
  { ssr: false }
);

// ─── Chart Data ───────────────────────────────────────────────────────

const VULN_DISTRIBUTION = [
  { name: 'Critical', value: 23, color: '#ef4444' },
  { name: 'High', value: 67, color: '#f97316' },
  { name: 'Medium', value: 134, color: '#eab308' },
  { name: 'Low', value: 123, color: '#22c55e' },
  { name: 'Info', value: 45, color: '#64748b' },
];

const RISK_TREND = [
  { month: 'Jul', score: 42 },
  { month: 'Aug', score: 48 },
  { month: 'Sep', score: 55 },
  { month: 'Oct', score: 51 },
  { month: 'Nov', score: 63 },
  { month: 'Dec', score: 58 },
  { month: 'Jan', score: 72 },
  { month: 'Feb', score: 68 },
  { month: 'Mar', score: 75 },
  { month: 'Apr', score: 71 },
  { month: 'May', score: 78 },
  { month: 'Jun', score: 72 },
];

const SEVERITY_BREAKDOWN = [
  { name: 'Critical', count: 23, fill: '#ef4444' },
  { name: 'High', count: 67, fill: '#f97316' },
  { name: 'Medium', count: 134, fill: '#eab308' },
  { name: 'Low', count: 123, fill: '#22c55e' },
  { name: 'Info', count: 45, fill: '#64748b' },
];

// Data for 3D bar chart (mapped from SEVERITY_BREAKDOWN)
const SEVERITY_3D_DATA = SEVERITY_BREAKDOWN.map((s) => ({
  label: s.name,
  value: s.count,
  color: s.fill,
}));

const SCAN_HISTORY = [
  { week: 'W1 Jan', scans: 12, findings: 45 },
  { week: 'W2 Jan', scans: 8, findings: 32 },
  { week: 'W3 Jan', scans: 15, findings: 58 },
  { week: 'W4 Jan', scans: 10, findings: 41 },
  { week: 'W1 Feb', scans: 14, findings: 52 },
  { week: 'W2 Feb', scans: 9, findings: 38 },
  { week: 'W3 Feb', scans: 16, findings: 61 },
  { week: 'W4 Feb', scans: 11, findings: 43 },
  { week: 'W1 Mar', scans: 13, findings: 49 },
  { week: 'W2 Mar', scans: 18, findings: 67 },
  { week: 'W3 Mar', scans: 14, findings: 55 },
  { week: 'W4 Mar', scans: 10, findings: 40 },
];

const TOP_CATEGORIES = [
  { name: 'Web Vulnerabilities', count: 87, fill: '#ef4444' },
  { name: 'Security Misconfigs', count: 64, fill: '#f97316' },
  { name: 'Authentication Issues', count: 52, fill: '#eab308' },
  { name: 'Information Exposure', count: 43, fill: '#22c55e' },
  { name: 'Cryptographic Issues', count: 31, fill: '#06b6d4' },
  { name: 'Injection Flaws', count: 28, fill: '#8b5cf6' },
  { name: 'Access Control', count: 24, fill: '#ec4899' },
];

const ATTACK_SURFACE = [
  { subject: 'Web Apps', A: 72 },
  { subject: 'APIs', A: 85 },
  { subject: 'Network', A: 45 },
  { subject: 'Cloud', A: 63 },
  { subject: 'Endpoints', A: 38 },
  { subject: 'Databases', A: 56 },
];

const AI_RECOMMENDATIONS = [
  {
    severity: 'critical' as const,
    icon: Bug,
    title: 'SQL Injection Risk Detected',
    description: 'High risk SQL Injection detected on /api/auth/login - immediate remediation required',
  },
  {
    severity: 'high' as const,
    icon: ShieldAlert,
    title: 'Missing Security Headers',
    description: 'Missing security headers increase attack surface on nginx-config - configure CSP, X-Frame-Options',
  },
  {
    severity: 'high' as const,
    icon: Lock,
    title: 'Weak TLS Configuration',
    description: 'Weak TLS configuration identified on mail.vulnguard.io - disable TLS 1.0/1.1 immediately',
  },
  {
    severity: 'critical' as const,
    icon: AlertOctagon,
    title: 'Immediate Remediation Required',
    description: 'Immediate remediation recommended for 3 critical findings - risk of active exploitation',
  },
  {
    severity: 'medium' as const,
    icon: KeyRound,
    title: 'Weak Password Policy',
    description: 'Password reset tokens are predictable on /api/auth/reset - use cryptographically secure tokens',
  },
];

// ─── Custom Tooltips ──────────────────────────────────────────────────

function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs font-medium text-slate-200">
          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: payload[0].payload.color }} />
          {payload[0].name}
        </p>
        <p className="text-sm font-bold text-slate-100">{payload[0].value}</p>
      </div>
    );
  }
  return null;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        {payload.map((entry, idx: number) => (
          <p key={idx} className="text-xs font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function CustomBarTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; count: number; fill: string } }> }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs font-medium" style={{ color: data.fill }}>{data.name}</p>
        <p className="text-sm font-bold text-slate-100">{data.count} findings</p>
      </div>
    );
  }
  return null;
}

// ─── Chart Card Wrapper (Enhanced with glass-card-3d) ──────────────────
function ChartCard({
  title,
  subtitle,
  children,
  delay = 0,
  className = '',
  extraClass = '',
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
  extraClass?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card-float analytics-panel-elevated p-5 ${extraClass} ${className}`}
    >
      <h3 className="text-sm font-medium text-slate-400 mb-1 holo-text relative z-10">{title}</h3>
      {subtitle && <p className="text-xs text-slate-600 mb-4 relative z-10">{subtitle}</p>}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ─── Main Analytics Page ──────────────────────────────────────────────
export function AnalyticsPage() {
  const severityColors = useMemo(() => ({
    critical: 'text-red-400 bg-red-500/10 border-red-500/20',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  }), []);

  return (
    <div className="space-y-6 mesh-gradient-bg relative">
      {/* Ambient orbs for atmospheric depth */}
      <div className="ambient-orb w-[500px] h-[500px] top-[-10%] left-[-5%]" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="ambient-orb w-[600px] h-[600px] bottom-[-15%] right-[-8%]" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", filter: "blur(90px)" }} />
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold threatscope-ai-title">Security Analytics</h2>
        <p className="text-sm text-slate-400 mt-1">Advanced analytics and insights on vulnerability trends</p>
      </motion.div>

      {/* Top Row: PieChart + LineChart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Vulnerability Distribution PieChart */}
        <ChartCard title="Vulnerability Distribution" subtitle="Breakdown by severity level" delay={0.1} extraClass="animated-gradient-border">
          <div className="relative">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={VULN_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {VULN_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-3xl font-bold text-slate-100">392</p>
              <p className="text-xs text-slate-400">Total</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {VULN_DISTRIBUTION.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-slate-400">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Risk Trend LineChart */}
        <ChartCard title="Risk Trend" subtitle="Risk score over the last 12 months" delay={0.15} extraClass="animated-gradient-border">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={RISK_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ fill: '#ef4444', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#ef4444', stroke: '#1e293b', strokeWidth: 2 }}
                name="Risk Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Second Row: 3D BarChart + AreaChart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Severity Breakdown - 3D ThreeBarChart */}
        <ChartCard title="Severity Breakdown" subtitle="3D vulnerability counts by severity level" delay={0.2} extraClass="animated-gradient-border holo-shimmer">
          <ThreeBarChart
            data={SEVERITY_3D_DATA}
            maxHeight={4}
            className="w-full"
          />
        </ChartCard>

        {/* Scan History TimelineChart */}
        <ChartCard title="Scan History" subtitle="Scans and findings over time" delay={0.25} extraClass="animated-gradient-border">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={SCAN_HISTORY}>
              <defs>
                <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="findingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={{ stroke: '#1e293b' }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="findings" stroke="#f97316" fill="url(#findingsGrad)" name="Findings" />
              <Area type="monotone" dataKey="scans" stroke="#06b6d4" fill="url(#scansGrad)" name="Scans" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Third Row: Categories + Radar + Globe + AI Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Vulnerability Categories */}
        <ChartCard title="Top Vulnerability Categories" subtitle="Most common vulnerability types" delay={0.3} extraClass="animated-gradient-border">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={TOP_CATEGORIES} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#1e293b' }} width={110} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                {TOP_CATEGORIES.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Attack Surface Analysis - Radar + MiniGlobe */}
        <ChartCard title="Attack Surface Analysis" subtitle="Exposure across different areas" delay={0.35} extraClass="animated-gradient-border">
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={ATTACK_SURFACE} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar
                  name="Exposure"
                  dataKey="A"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
            {/* MiniGlobe overlay in bottom-right corner */}
            <div className="absolute bottom-0 right-0 z-10 opacity-80 hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
              <MiniGlobe size={100} />
            </div>
          </div>
        </ChartCard>

        {/* AI Risk Analysis Panel with scan-line-vertical */}
        <ChartCard title="AI Risk Analysis" subtitle="Intelligent recommendations" delay={0.4} extraClass="animated-gradient-border scan-line-vertical relative overflow-hidden">
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 relative z-10" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}>
            {AI_RECOMMENDATIONS.map((rec, i) => {
              const RecIcon = rec.icon;
              const colorClass = severityColors[rec.severity] || severityColors.medium;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                  className={`flex items-start gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-colors ${
                    rec.severity === 'critical' ? 'threat-pulse-critical' : rec.severity === 'high' ? 'threat-pulse-high' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${colorClass}`}>
                    <RecIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate min-w-0">{rec.title}</p>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${colorClass}`}>
                        {rec.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Summary Stats Row with stagger-3d */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-3d">
        {[
          { icon: Globe, label: 'Web App Risks', value: 72, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
          { icon: Server, label: 'API Exposure', value: 85, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
          { icon: Database, label: 'Database Risk', value: 56, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
          { icon: Wifi, label: 'Network Exposure', value: 45, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
            className="glass-card-float depth-shadow-md p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-xs text-slate-400">{stat.label}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-xs text-slate-500 mb-1">/100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${stat.value}%`,
                  backgroundColor: stat.value >= 70 ? '#ef4444' : stat.value >= 50 ? '#f97316' : '#22c55e',
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
