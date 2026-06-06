'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Monitor,
  Play,
  FileText,
  Globe,
  Brain,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  Activity,
  Clock,
  Target,
  ChevronRight,
  Radio,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useVulnGuardStore } from '@/store/vulnguard-store';

// ─── Dynamic 3D Component Imports (SSR disabled) ──────────────────────
const CyberGlobe = dynamic(
  () => import('@/components/vulnguard/3d/cyber-globe').then((mod) => ({ default: mod.CyberGlobe })),
  { ssr: false }
);

const ParticleField = dynamic(
  () => import('@/components/vulnguard/3d/particle-field').then((mod) => ({ default: mod.ParticleField })),
  { ssr: false }
);

// ─── Mock Vuln Timeline Data ───────────────────────────────────────

const VULN_TIMELINE = [
  { date: 'May 23', critical: 3, high: 8, medium: 15 },
  { date: 'May 24', critical: 5, high: 12, medium: 18 },
  { date: 'May 25', critical: 2, high: 6, medium: 10 },
  { date: 'May 26', critical: 7, high: 14, medium: 22 },
  { date: 'May 27', critical: 4, high: 9, medium: 16 },
  { date: 'May 28', critical: 6, high: 11, medium: 20 },
  { date: 'May 29', critical: 8, high: 15, medium: 25 },
  { date: 'May 30', critical: 3, high: 7, medium: 12 },
  { date: 'May 31', critical: 5, high: 10, medium: 17 },
  { date: 'Jun 1', critical: 9, high: 18, medium: 28 },
  { date: 'Jun 2', critical: 6, high: 13, medium: 21 },
  { date: 'Jun 3', critical: 4, high: 8, medium: 14 },
  { date: 'Jun 4', critical: 7, high: 16, medium: 24 },
  { date: 'Jun 5', critical: 5, high: 11, medium: 19 },
];

// ─── Mock Recent Scans (when store is empty) ───────────────────────

const MOCK_RECENT_SCANS = [
  { id: 'ms-1', target: '192.168.1.0/24', findings: 23, riskScore: 78, time: '2 hours ago', status: 'completed' as const },
  { id: 'ms-2', target: 'api.vulnguard.io', findings: 8, riskScore: 45, time: '5 hours ago', status: 'completed' as const },
  { id: 'ms-3', target: '10.0.0.0/16', findings: 56, riskScore: 92, time: '1 day ago', status: 'completed' as const },
  { id: 'ms-4', target: 'webapp.example.com', findings: 12, riskScore: 61, time: '2 days ago', status: 'completed' as const },
  { id: 'ms-5', target: 'db.internal.corp', findings: 34, riskScore: 85, time: '3 days ago', status: 'completed' as const },
];

// ─── Helpers ───────────────────────────────────────────────────────

const riskBadgeColor = (score: number) => {
  if (score >= 80) return 'bg-red-500/20 text-red-400 border-red-500/30';
  if (score >= 60) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
  if (score >= 40) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
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

// ─── Custom Tooltip ────────────────────────────────────────────────

function CustomLineTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; color: string; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-slate-300 text-xs font-medium mb-1">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────

export function SecurityOpsPage() {
  const { scans, setCurrentPage } = useVulnGuardStore();

  // Active scans (scanning status)
  const activeScans = scans.filter((s) => s.status === 'scanning');

  // Recent scans (completed) - use mock data if none in store
  const recentScans = scans.filter((s) => s.status === 'completed').slice(0, 5);
  const displayScans = recentScans.length > 0
    ? recentScans.map((s) => ({
        id: s.id,
        target: s.target,
        findings: s.vulnerabilities?.length ?? 0,
        riskScore: s.riskScore,
        time: new Date(s.completedAt ?? s.startedAt).toLocaleDateString(),
        status: s.status,
      }))
    : MOCK_RECENT_SCANS;

  const quickActions = [
    { label: 'Start Scan', icon: Play, page: 'scanner' as const, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Generate Report', icon: FileText, page: 'reports' as const, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'View Threats', icon: Globe, page: 'threat-intel' as const, color: 'text-orange-400', bgColor: 'bg-orange-500/10 border-orange-500/20' },
    { label: 'AI Analysis', icon: Brain, page: 'analytics' as const, color: 'text-purple-400', bgColor: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header with CyberGlobe */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <div className="shrink-0">
          <CyberGlobe size={250} showParticles showAttacks speed={0.4} intensity="high" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 holo-text">Security Operations</h1>
              <p className="text-sm text-slate-400">Monitor and respond to security incidents in real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SOC Active
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-xs text-cyan-400">
              <Radio className="w-3 h-3" />
              Live Monitoring
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-500">Last sync: 2s ago</span>
          </div>
        </div>
      </motion.div>

      {/* Risk Overview Mini Dashboard */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Current Risk', value: '72', trend: 'up' as const, trendValue: '+5%', icon: Shield, color: 'text-red-400', borderColor: 'border-red-500/20' },
          { label: 'Vulnerabilities', value: '347', trend: 'down' as const, trendValue: '-12%', icon: AlertTriangle, color: 'text-orange-400', borderColor: 'border-orange-500/20' },
          { label: 'Compliance', value: '78%', trend: 'up' as const, trendValue: '+3%', icon: Activity, color: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className={`glass-card-3d animated-gradient-border p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">{metric.label}</span>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-slate-100">{metric.value}</span>
                <span className={`flex items-center gap-1 text-xs font-medium ${metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {metric.trendValue}
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Active Assessments + Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Assessments with breathe-glow */}
        <motion.div
          variants={itemVariants}
          className="glass-card-3d animated-gradient-border p-6"
        >
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2 holo-text">
            <Activity className="w-4 h-4 text-emerald-400" />
            Active Assessments
          </h3>
          {activeScans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mb-3">
                <Target className="w-5 h-5 text-slate-600" />
              </div>
              <p className="text-sm text-slate-500">No active assessments</p>
              <p className="text-xs text-slate-600 mt-1">Start a scan to begin an assessment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeScans.map((scan) => (
                <div key={scan.id} className="p-4 bg-slate-800/40 rounded-lg border border-slate-700/50 breathe-glow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-200 flex items-center gap-2 truncate min-w-0">
                      <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {scan.target}
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                      {scan.type}
                    </Badge>
                  </div>
                  <Progress value={scan.progress} className="h-1.5 mb-2" />
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Started {new Date(scan.startedAt).toLocaleTimeString()}
                    </span>
                    <span>{scan.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Scans Timeline with stagger-entrance */}
        <motion.div
          variants={itemVariants}
          className="glass-card-3d animated-gradient-border p-6"
        >
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2 holo-text">
            <Clock className="w-4 h-4 text-cyan-400" />
            Recent Scans Timeline
          </h3>
          <div className="relative space-y-0 max-h-80 overflow-y-auto stagger-entrance">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-cyan-500/40 via-cyan-500/20 to-transparent" />

            {displayScans.map((scan, idx) => {
              const isCritical = scan.riskScore >= 80;
              return (
                <div key={scan.id} className={`relative flex items-start gap-4 pb-4 ${isCritical ? 'threat-pulse-critical' : ''}`}>
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    idx === 0 ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-slate-800 border border-slate-700'
                  }`}>
                    <Target className={`w-3 h-3 ${idx === 0 ? 'text-cyan-400' : 'text-slate-500'}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-slate-200 font-medium truncate">{scan.target}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${riskBadgeColor(scan.riskScore)}`}>
                        {scan.riskScore}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-500">{scan.findings} findings</span>
                      <span className="text-[10px] text-slate-600">•</span>
                      <span className="text-[10px] text-slate-500">{scan.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Vulnerability Timeline with 3D Particle Background */}
      <motion.div
        variants={itemVariants}
        className="glass-card-3d animated-gradient-border p-6 relative"
      >
        {/* 3D Particle Background */}
        <div className="absolute inset-0 z-0">
          <ParticleField count={60} showHexagons={false} color1="#06b6d4" color2="#10b981" />
        </div>

        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2 holo-text relative z-10">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Vulnerability Timeline (Last 14 Days)
        </h3>
        <div className="relative z-10">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={VULN_TIMELINE} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={{ stroke: '#334155' }}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={{ stroke: '#334155' }}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value: string) => (
                  <span className="text-slate-400 text-xs">{value}</span>
                )}
              />
              <Line type="monotone" dataKey="critical" name="Critical" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="high" name="High" stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: '#f97316' }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="medium" name="Medium" stroke="#eab308" strokeWidth={2} dot={{ r: 3, fill: '#eab308' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quick Actions with data-stream animation */}
      <motion.div variants={itemVariants}>
        <h3 className="text-sm font-semibold text-slate-200 mb-4 holo-text">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 data-stream">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                type="button"
                onClick={() => setCurrentPage(action.page)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`glass-card-3d flex flex-col items-center gap-3 p-5 rounded-xl ${action.bgColor} border hover:border-cyan-500/30 transition-all duration-300 group`}
              >
                <Icon className={`w-6 h-6 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-xs font-medium text-slate-300">{action.label}</span>
                <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
