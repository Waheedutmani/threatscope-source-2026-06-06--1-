'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  TrendingDown,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Activity,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Globe,
  Lock,
  Eye,
  Zap,
  PieChart,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';

// ─── CountUp Animation Hook ─────────────────────────────────────────
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
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);
  return count;
}

// ─── Mock Data Constants ─────────────────────────────────────────────

const VULNERABILITY_TREND_DATA = [
  { month: 'Oct', critical: 14, high: 32, medium: 58, low: 41 },
  { month: 'Nov', critical: 12, high: 28, medium: 52, low: 38 },
  { month: 'Dec', critical: 10, high: 25, medium: 48, low: 35 },
  { month: 'Jan', critical: 9, high: 22, medium: 44, low: 33 },
  { month: 'Feb', critical: 7, high: 18, medium: 39, low: 30 },
  { month: 'Mar', critical: 6, high: 15, medium: 35, low: 28 },
];

const IMPROVEMENT_TREND_DATA = [
  { month: 'Oct', securityScore: 62, riskLevel: 78 },
  { month: 'Nov', securityScore: 66, riskLevel: 74 },
  { month: 'Dec', securityScore: 70, riskLevel: 68 },
  { month: 'Jan', securityScore: 74, riskLevel: 62 },
  { month: 'Feb', securityScore: 78, riskLevel: 55 },
  { month: 'Mar', securityScore: 82, riskLevel: 48 },
];

const OPERATIONAL_METRICS = [
  { label: 'Scans Completed', value: 47, total: 50, color: '#06b6d4' },
  { label: 'Vulnerabilities Fixed', value: 89, total: 156, color: '#10b981' },
  { label: 'Active Risks', value: 67, total: null, color: '#f97316', trend: -8 },
  { label: 'Compliance Percentage', value: 78, total: 100, color: '#8b5cf6' },
];

const PRIORITY_ACTIONS = [
  {
    id: 1,
    title: 'Patch SQL Injection in Login API',
    impact: 'Critical' as const,
    effort: 4,
    riskReduction: 15,
  },
  {
    id: 2,
    title: 'Close unnecessary open ports on DMZ servers',
    impact: 'Critical' as const,
    effort: 8,
    riskReduction: 12,
  },
  {
    id: 3,
    title: 'Update TLS configuration to 1.3 only',
    impact: 'High' as const,
    effort: 16,
    riskReduction: 10,
  },
  {
    id: 4,
    title: 'Implement CSP headers on all web applications',
    impact: 'High' as const,
    effort: 12,
    riskReduction: 8,
  },
  {
    id: 5,
    title: 'Deploy automated patch management for endpoints',
    impact: 'Medium' as const,
    effort: 24,
    riskReduction: 6,
  },
];

const EXECUTIVE_KPIS = [
  {
    icon: Building2,
    label: 'Total Assets Scanned',
    value: 156,
    color: 'cyan',
    trend: 12,
    trendLabel: '+12 this month',
    sparkData: [120, 128, 132, 138, 144, 149, 153, 156],
  },
  {
    icon: Shield,
    label: 'Security Score Average',
    value: 82,
    color: 'emerald',
    trend: 5,
    trendLabel: 'B+ Grade',
    sparkData: [68, 71, 73, 75, 77, 79, 80, 82],
  },
  {
    icon: AlertTriangle,
    label: 'Critical Findings',
    value: 6,
    color: 'red',
    trend: -14,
    trendLabel: 'Pulsing threat',
    sparkData: [14, 12, 11, 10, 9, 8, 7, 6],
  },
  {
    icon: Target,
    label: 'High-Risk Assets',
    value: 12,
    color: 'orange',
    trend: -3,
    trendLabel: 'Down from 15',
    sparkData: [18, 17, 16, 15, 14, 13, 12, 12],
  },
];

const SUMMARY_CARDS = [
  {
    title: 'Overall Risk Posture',
    status: 'Moderate',
    statusColor: '#eab308',
    bgColor: 'from-yellow-500/8 to-yellow-500/3',
    borderColor: 'border-yellow-500/20',
    description:
      'Current risk posture is moderate with active threats being monitored. Critical vulnerability count is declining but requires continued attention to maintain downward trend.',
    icon: Shield,
  },
  {
    title: 'Threat Exposure Level',
    status: 'High',
    statusColor: '#f97316',
    bgColor: 'from-orange-500/8 to-orange-500/3',
    borderColor: 'border-orange-500/20',
    description:
      '14 active threats detected across the infrastructure. External-facing attack surface remains elevated with 3 unpatched internet-facing assets.',
    icon: Eye,
  },
  {
    title: 'Security Maturity Score',
    status: '72%',
    statusColor: '#06b6d4',
    bgColor: 'from-cyan-500/8 to-cyan-500/3',
    borderColor: 'border-cyan-500/20',
    description:
      'Organization security maturity is at Level 3 (Defined). Process standardization improving, but automated response capabilities need enhancement.',
    icon: BarChart3,
  },
  {
    title: 'Remediation Progress',
    status: '64%',
    statusColor: '#10b981',
    bgColor: 'from-emerald-500/8 to-emerald-500/3',
    borderColor: 'border-emerald-500/20',
    description:
      '89 of 156 vulnerabilities remediated. 42 in progress, 25 pending review. Critical remediation SLA compliance at 92%.',
    icon: CheckCircle2,
  },
];

const BUSINESS_IMPACT = [
  {
    title: 'Financial Risk',
    value: '$2.4M potential exposure',
    color: 'red',
    accentColor: '#ef4444',
    icon: TrendingDown,
    description:
      'Estimated financial exposure from unresolved critical and high-severity vulnerabilities based on industry breach cost analysis.',
    recommendation:
      'Prioritize patching of internet-facing assets to reduce potential breach costs by an estimated 60%.',
  },
  {
    title: 'Compliance Risk',
    value: '3 compliance gaps',
    color: 'orange',
    accentColor: '#f97316',
    icon: Lock,
    description:
      'Gaps identified in SOC 2, PCI-DSS, and ISO 27001 compliance frameworks. Audit scheduled for Q2.',
    recommendation:
      'Address security header misconfigurations and access control issues to close compliance gaps before audit.',
  },
  {
    title: 'Reputation Risk',
    value: 'Medium — 2 public-facing vulns',
    color: 'yellow',
    accentColor: '#eab308',
    icon: Globe,
    description:
      'Two medium-severity vulnerabilities on public-facing assets could be exploited, potentially leading to data exposure and brand damage.',
    recommendation:
      'Implement WAF rules and deploy virtual patches within 48 hours while permanent fixes are developed.',
  },
];

// ─── Color Utilities ────────────────────────────────────────────────
const sparkColorMap: Record<string, string> = {
  cyan: '#06b6d4',
  emerald: '#10b981',
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  purple: '#8b5cf6',
};

const bgColorMap: Record<string, string> = {
  cyan: 'bg-cyan-500/10',
  emerald: 'bg-emerald-500/10',
  red: 'bg-red-500/10',
  orange: 'bg-orange-500/10',
  yellow: 'bg-yellow-500/10',
  purple: 'bg-purple-500/10',
};

const textColorMap: Record<string, string> = {
  cyan: 'text-cyan-400',
  emerald: 'text-emerald-400',
  red: 'text-red-400',
  orange: 'text-orange-400',
  yellow: 'text-yellow-400',
  purple: 'text-purple-400',
};

const borderColorMap: Record<string, string> = {
  cyan: 'border-cyan-500/20',
  emerald: 'border-emerald-500/20',
  red: 'border-red-500/20',
  orange: 'border-orange-500/20',
  yellow: 'border-yellow-500/20',
  purple: 'border-purple-500/20',
};

// ─── Custom Tooltips ────────────────────────────────────────────────
function CustomStackedTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-cyan-500/20 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-xs font-medium text-slate-400 mb-2">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-xs font-medium flex items-center gap-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
            {entry.name}: {entry.value}
          </p>
        ))}
        <div className="border-t border-slate-700 mt-2 pt-1">
          <p className="text-xs text-slate-300 font-semibold">
            Total: {payload.reduce((sum, entry) => sum + entry.value, 0)}
          </p>
        </div>
      </div>
    );
  }
  return null;
}

function CustomImprovementTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-cyan-500/20 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-xs font-medium text-slate-400 mb-2">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-xs font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// ─── Circular Progress Component ────────────────────────────────────
function CircularProgress({
  value,
  size = 100,
  strokeWidth = 8,
  color,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          filter: `drop-shadow(0 0 8px ${color}60)`,
          transition: 'stroke-dashoffset 1.5s ease-out',
        }}
      />
    </svg>
  );
}

// ─── KPI Card Component ─────────────────────────────────────────────
function ExecutiveKPICard({
  icon: Icon,
  label,
  value,
  color,
  trend,
  trendLabel,
  sparkData,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  trend: number;
  trendLabel: string;
  sparkData: number[];
  delay: number;
}) {
  const animatedValue = useCountUp(value, 1800);
  const sparkColor = sparkColorMap[color] || '#06b6d4';
  const isCritical = color === 'red' || color === 'orange';
  const isPositiveTrend =
    (color === 'red' || color === 'orange') ? trend < 0 : trend > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`group relative glass-card-float depth-shadow-md rounded-xl p-6 cursor-default ${isCritical ? 'breathe-glow' : ''}`}
    >
      {/* Cyber corner accents */}
      <div
        className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg pointer-events-none z-20"
        style={{ borderColor: `${sparkColor}30` }}
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-lg pointer-events-none z-20"
        style={{ borderColor: `${sparkColor}30` }}
      />

      {/* Beam sweep */}
      <div className="absolute inset-0 beam-sweep rounded-xl pointer-events-none z-0" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-11 h-11 rounded-xl ${bgColorMap[color]} border ${borderColorMap[color]} flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 ${textColorMap[color]}`} />
          </div>
          <div
            className={`badge-3d flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
              isPositiveTrend
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {isPositiveTrend ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-1">{label}</p>
        <div className="flex items-end gap-2 mb-1">
          <p className="text-4xl font-bold text-slate-100">{animatedValue.toLocaleString()}</p>
          {label === 'Security Score Average' && (
            <span className="text-sm font-semibold text-emerald-400 mb-1">/100</span>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-3">{trendLabel}</p>

        {/* Mini Sparkline */}
        <div className="h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData.map((v) => ({ v }))}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={sparkColor}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Summary Card Component ─────────────────────────────────────────
function SummaryCard({
  title,
  status,
  statusColor,
  bgColor,
  borderColor,
  description,
  icon: Icon,
  delay,
  index,
}: {
  title: string;
  status: string;
  statusColor: string;
  bgColor: string;
  borderColor: string;
  description: string;
  icon: React.ElementType;
  delay: number;
  index: number;
}) {
  const isMaturity = title === 'Security Maturity Score';
  const isRemediation = title === 'Remediation Progress';
  const maturityValue = isMaturity ? 72 : 0;
  const remediationValue = isRemediation ? 64 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`group relative glass-card-float depth-shadow-md rounded-xl p-6 cursor-default overflow-hidden`}
    >
      {/* Subtle gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${bgColor} pointer-events-none z-0`}
      />

      {/* Cyber corner accents */}
      <div
        className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg pointer-events-none z-20"
        style={{ borderColor: `${statusColor}30` }}
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-lg pointer-events-none z-20"
        style={{ borderColor: `${statusColor}30` }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" style={{ color: statusColor }} />
            <h4 className="text-sm font-medium text-slate-300">{title}</h4>
          </div>
          <span
            className="badge-3d px-3 py-1 rounded-full text-xs font-bold tracking-wide"
            style={{
              backgroundColor: `${statusColor}15`,
              color: statusColor,
              border: `1px solid ${statusColor}30`,
            }}
          >
            {status}
          </span>
        </div>

        {/* Visual indicator based on card type */}
        {isMaturity && (
          <div className="flex items-center justify-center my-4">
            <div className="relative">
              <CircularProgress value={maturityValue} size={90} strokeWidth={7} color={statusColor} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-slate-100">{maturityValue}%</span>
              </div>
            </div>
          </div>
        )}

        {isRemediation && (
          <div className="my-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                <div className="flex h-full">
                  <div
                    className="bg-emerald-500 h-full rounded-l-full transition-all duration-1000"
                    style={{ width: '57%' }}
                  />
                  <div
                    className="bg-amber-500 h-full transition-all duration-1000"
                    style={{ width: '27%' }}
                  />
                  <div
                    className="bg-slate-600 h-full rounded-r-full transition-all duration-1000"
                    style={{ width: '16%' }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-400">89 Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-slate-400">42 In Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-600" />
                <span className="text-slate-400">25 Pending</span>
              </div>
            </div>
          </div>
        )}

        {!isMaturity && !isRemediation && (
          <div className="my-4">
            <div
              className="w-3 h-3 rounded-full animate-pulse mb-3"
              style={{
                backgroundColor: statusColor,
                boxShadow: `0 0 12px ${statusColor}60`,
              }}
            />
          </div>
        )}

        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// ─── Impact Badge ───────────────────────────────────────────────────
function ImpactBadge({ impact }: { impact: 'Critical' | 'High' | 'Medium' }) {
  const styles: Record<string, string> = {
    Critical: 'bg-red-500/10 text-red-400 border-red-500/30',
    High: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[impact]}`}>
      {impact.toUpperCase()}
    </span>
  );
}

// ─── Main Executive Dashboard Page ──────────────────────────────────
export function ExecutiveDashboardPage() {
  return (
    <div className="space-y-6 mesh-gradient-bg relative">
      {/* Ambient orbs for atmospheric depth */}
      <div className="ambient-orb" style={{ width: 500, height: 500, top: '5%', left: '-5%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', animationDelay: '0s' }} />
      <div className="ambient-orb" style={{ width: 600, height: 600, bottom: '10%', right: '-8%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', animationDelay: '4s' }} />
      <div className="ambient-orb" style={{ width: 400, height: 400, top: '50%', left: '40%', background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)', animationDelay: '8s' }} />
      {/* ─── 1. Header Section ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
          >
            <Briefcase className="w-5 h-5 text-cyan-400" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold threatscope-ai-title inline-block">Executive Dashboard</h2>
            <motion.div
              className="h-0.5 bg-gradient-to-r from-cyan-500/60 via-emerald-500/60 to-transparent rounded-full mt-1"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-2 ml-[52px]">
          High-level security overview for leadership — key metrics, risk posture, and strategic priorities at a glance.
        </p>
      </motion.div>

      {/* ─── 2. Executive KPI Row ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger-3d">
        {EXECUTIVE_KPIS.map((kpi, i) => (
          <ExecutiveKPICard
            key={kpi.label}
            {...kpi}
            delay={0.1 + i * 0.08}
          />
        ))}
      </div>

      {/* ─── 3. Executive Summary Cards ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-3d">
        {SUMMARY_CARDS.map((card, i) => (
          <SummaryCard
            key={card.title}
            {...card}
            delay={0.3 + i * 0.08}
            index={i}
          />
        ))}
      </div>

      {/* ─── 4 & 5. Security Overview Chart + Operational Metrics ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger-3d">
        {/* Security Overview - Stacked Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative glass-card-float analytics-panel-elevated neon-border-blue rounded-xl p-6 scan-line-vertical"
        >
          {/* Cyber corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-medium text-slate-300">Vulnerability Trends (6 Months)</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Critical vulnerabilities declining — overall improvement trajectory
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={VULNERABILITY_TREND_DATA}>
                <defs>
                  <linearGradient id="execCriticalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="execHighGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="execMediumGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#eab308" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#eab308" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="execLowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
                <Tooltip content={<CustomStackedTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px' }}
                  iconType="circle"
                  iconSize={8}
                />
                <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="url(#execCriticalGrad)" name="Critical" />
                <Area type="monotone" dataKey="high" stackId="1" stroke="#f97316" fill="url(#execHighGrad)" name="High" />
                <Area type="monotone" dataKey="medium" stackId="1" stroke="#eab308" fill="url(#execMediumGrad)" name="Medium" />
                <Area type="monotone" dataKey="low" stackId="1" stroke="#22c55e" fill="url(#execLowGrad)" name="Low" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Operational Metrics Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative glass-card-float analytics-panel-elevated rounded-xl p-6"
        >
          {/* Cyber corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

          {/* Beam sweep */}
          <div className="absolute inset-0 beam-sweep rounded-xl pointer-events-none z-0" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-medium text-slate-300">Operational Metrics</h3>
            </div>

            <div className="space-y-6">
              {OPERATIONAL_METRICS.map((metric, i) => {
                const percentage = metric.total
                  ? Math.round((metric.value / metric.total) * 100)
                  : null;
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-100">
                          {metric.value}
                          {metric.total ? `/${metric.total}` : ''}
                        </span>
                        {metric.trend !== undefined && (
                          <span
                            className={`flex items-center gap-0.5 text-xs font-medium ${
                              metric.trend < 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {metric.trend < 0 ? (
                              <TrendingDown className="w-3 h-3" />
                            ) : (
                              <TrendingUp className="w-3 h-3" />
                            )}
                            {Math.abs(metric.trend)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: metric.color,
                          boxShadow: `0 0 8px ${metric.color}40`,
                        }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${percentage ?? Math.min(metric.value, 100)}%`,
                        }}
                        transition={{ duration: 1, delay: 0.8 + i * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                    {percentage !== null && (
                      <p className="text-[10px] text-slate-500 mt-1 text-right">{percentage}%</p>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Stats Footer */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-800/50">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] text-slate-400">Last scan: 2h ago</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] text-slate-400">8 active analysts</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── 6. Business Impact Section ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="relative glass-card-float analytics-panel-elevated rounded-xl p-6"
      >
        {/* Cyber corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-medium text-slate-300">Business Impact Analysis</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BUSINESS_IMPACT.map((item, i) => {
              const ImpactIcon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                  className="relative rounded-xl p-5 border border-slate-800/60 bg-slate-900/40 overflow-hidden"
                >
                  {/* Accent gradient top bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{
                      background: `linear-gradient(to right, ${item.accentColor}, transparent)`,
                    }}
                  />

                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${item.accentColor}15`,
                        border: `1px solid ${item.accentColor}30`,
                      }}
                    >
                      <ImpactIcon className="w-4 h-4" style={{ color: item.accentColor }} />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200">{item.title}</h4>
                  </div>

                  <p
                    className="text-lg font-bold mb-3"
                    style={{ color: item.accentColor }}
                  >
                    {item.value}
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
                    <div className="flex items-start gap-1.5">
                      <Zap className="w-3 h-3 mt-0.5 shrink-0" style={{ color: item.accentColor }} />
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        <span className="font-semibold" style={{ color: item.accentColor }}>
                          Recommendation:
                        </span>{' '}
                        {item.recommendation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ─── 7 & 8. Security Improvement Trends + Priority Actions ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger-3d">
        {/* Security Improvement Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="relative glass-card-float analytics-panel-elevated neon-border-blue rounded-xl p-6 breathe-glow"
        >
          {/* Cyber corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-emerald-500/30" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-emerald-500/30" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-medium text-slate-300">Security Improvement Trends</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Security score rising while risk level declining — positive trajectory
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={IMPROVEMENT_TREND_DATA}>
                <defs>
                  <linearGradient id="securityScoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="riskLevelGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} />
                <Tooltip content={<CustomImprovementTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px' }}
                  iconType="circle"
                  iconSize={8}
                />
                <Line
                  type="monotone"
                  dataKey="securityScore"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }}
                  name="Security Score"
                />
                <Line
                  type="monotone"
                  dataKey="riskLevel"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ fill: '#ef4444', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#ef4444', stroke: '#0f172a', strokeWidth: 2 }}
                  name="Risk Level"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Priority Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="relative glass-card-float analytics-panel-elevated rounded-xl p-6"
        >
          {/* Cyber corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

          {/* Scan line */}
          <div className="absolute inset-0 scan-line-vertical rounded-xl pointer-events-none z-0" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-medium text-slate-300">Priority Actions</h3>
              <span className="ml-auto px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
                5 ACTIONS
              </span>
            </div>

            <div className="space-y-3 max-h-[310px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}>
              {PRIORITY_ACTIONS.map((action, i) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 1.0 + i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-800/50 bg-slate-900/30 hover:border-slate-700/50 hover:bg-slate-800/30 transition-all group/action"
                >
                  {/* Priority Number */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold ${
                      action.impact === 'Critical'
                        ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                        : action.impact === 'High'
                          ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                          : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                    }`}
                  >
                    {action.id}
                  </div>

                  {/* Action Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate min-w-0 group-hover/action:text-cyan-300 transition-colors">
                        {action.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <ImpactBadge impact={action.impact} />
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] text-slate-500">{action.effort}h effort</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] text-emerald-400">
                          -{action.riskReduction} pts risk
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/50">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-slate-400">
                  Total risk reduction: <span className="text-emerald-400 font-semibold">51 points</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] text-slate-400">
                  Est. <span className="text-slate-300 font-semibold">64h</span> total effort
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
