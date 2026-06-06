'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSearch,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Clock,
  Target,
  Scan,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useVulnGuardStore, type Vulnerability } from '@/store/vulnguard-store';

// ─── Dynamic 3D Component Imports (SSR disabled) ─────────────────────
const MiniGlobe = dynamic(
  () => import('@/components/vulnguard/3d/cyber-globe').then((mod) => mod.MiniGlobe),
  { ssr: false }
);

// ─── Severity Badge ───────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    info: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const threatPulse: Record<string, string> = {
    critical: 'threat-pulse-critical',
    high: 'threat-pulse-high',
    medium: 'threat-pulse-medium',
    low: '',
    info: '',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${styles[severity] || styles.info} ${threatPulse[severity] || ''}`}>
      {(severity === 'critical' || severity === 'high' || severity === 'medium') && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {severity.toUpperCase()}
    </span>
  );
}

// ─── Status Badge with Dropdown ───────────────────────────────────────
function StatusDropdown({
  status,
  onChange,
}: {
  status: Vulnerability['status'];
  onChange: (newStatus: Vulnerability['status']) => void;
}) {
  const [open, setOpen] = useState(false);

  const statusConfig: Record<string, { bg: string; text: string; border: string; icon: React.ElementType }> = {
    open: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', icon: XCircle },
    in_progress: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: AlertTriangle },
    resolved: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle2 },
    accepted: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', icon: Eye },
  };

  const labels: Record<string, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    accepted: 'Accepted',
  };

  const config = statusConfig[status] || statusConfig.open;
  const Icon = config.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${config.bg} ${config.text} ${config.border} hover:opacity-80 transition-all cursor-pointer`}
      >
        <Icon className="w-3 h-3" />
        {labels[status] || status}
        <ChevronDown className="w-3 h-3 ml-1" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 z-20 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden min-w-[140px]"
            >
              {(['open', 'in_progress', 'resolved', 'accepted'] as const).map((s) => {
                const sConfig = statusConfig[s];
                const SIcon = sConfig.icon;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { onChange(s); setOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-700/50 transition-colors ${s === status ? sConfig.text : 'text-slate-400'}`}
                  >
                    <SIcon className="w-3 h-3" />
                    {labels[s]}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Risk Score Gauge ─────────────────────────────────────────────────
function RiskScoreGauge({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 60;
  const strokeWidth = 10;
  const cx = 80;
  const cy = 75;
  const startAngle = Math.PI;
  const endAngle = 0;
  const currentAngle = startAngle - (animatedScore / 100) * (startAngle - endAngle);

  const x1 = cx + radius * Math.cos(startAngle);
  const y1 = cy - radius * Math.sin(startAngle);
  const x2 = cx + radius * Math.cos(currentAngle);
  const y2 = cy - radius * Math.sin(currentAngle);

  const largeArcFlag = animatedScore > 50 ? 1 : 0;

  const backgroundPath = `M ${cx + radius * Math.cos(startAngle)} ${cy - radius * Math.sin(startAngle)} A ${radius} ${radius} 0 1 0 ${cx + radius * Math.cos(endAngle)} ${cy - radius * Math.sin(endAngle)}`;

  const foregroundPath =
    animatedScore > 0
      ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${x2} ${y2}`
      : '';

  const getScoreColor = (s: number) => {
    if (s >= 80) return '#ef4444';
    if (s >= 60) return '#f97316';
    if (s >= 40) return '#eab308';
    if (s >= 20) return '#22c55e';
    return '#06b6d4';
  };

  const getRiskLabel = (s: number) => {
    if (s >= 80) return 'CRITICAL';
    if (s >= 60) return 'HIGH RISK';
    if (s >= 40) return 'MEDIUM';
    if (s >= 20) return 'LOW';
    return 'MINIMAL';
  };

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="100" viewBox="0 0 160 100">
        <path d={backgroundPath} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} strokeLinecap="round" />
        {animatedScore > 0 && (
          <path
            d={foregroundPath}
            fill="none"
            stroke={getScoreColor(animatedScore)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${getScoreColor(animatedScore)}60)`,
              transition: 'all 1.5s ease-out',
            }}
          />
        )}
        <text x={cx} y={cy - 10} textAnchor="middle" fill="#f1f5f9" style={{ fontSize: '26px', fontWeight: 700 }}>
          {animatedScore}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#64748b" style={{ fontSize: '10px' }}>
          out of 100
        </text>
      </svg>
      <div
        className="mt-1 px-3 py-1 rounded-full text-xs font-bold tracking-wider"
        style={{
          backgroundColor: `${getScoreColor(animatedScore)}15`,
          color: getScoreColor(animatedScore),
          border: `1px solid ${getScoreColor(animatedScore)}30`,
        }}
      >
        {getRiskLabel(animatedScore)}
      </div>
    </div>
  );
}

// ─── Custom Pie Tooltip ───────────────────────────────────────────────
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

// ─── Vulnerability Card with 3D Tilt ─────────────────────────────────
function VulnerabilityCard({
  vuln,
  onUpdateStatus,
}: {
  vuln: Vulnerability;
  onUpdateStatus: (id: string, status: Vulnerability['status']) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const cvssColor = vuln.cvssScore >= 9
    ? 'text-red-400'
    : vuln.cvssScore >= 7
      ? 'text-orange-400'
      : vuln.cvssScore >= 4
        ? 'text-yellow-400'
        : 'text-emerald-400';

  const severityCardClass: Record<string, string> = {
    critical: 'severity-card-critical',
    high: 'severity-card-high',
    medium: 'severity-card-medium',
    low: 'severity-card-low',
    info: '',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = ((centerY - y) / centerY) * 6;
    setTilt({ x: rotateX, y: rotateY });
    setShinePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });

    // Update CSS custom property for glass-card-3d mouse-follow light
    const pctX = ((x / rect.width) * 100).toFixed(1);
    const pctY = ((y / rect.height) * 100).toFixed(1);
    cardRef.current.style.setProperty('--mouse-x', `${pctX}%`);
    cardRef.current.style.setProperty('--mouse-y', `${pctY}%`);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      layout
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`glass-card-3d ${severityCardClass[vuln.severity] || ''} rounded-xl cursor-default`}
      style={{
        perspective: '800px',
        transformStyle: 'preserve-3d',
        transform: isHovered
          ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.01)`
          : 'rotateX(0deg) rotateY(0deg) scale(1)',
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Shine/glare overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: isHovered
            ? `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, rgba(255,255,255,0.06) 0%, transparent 60%)`
            : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Card Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="relative z-20 w-full text-left p-4 flex items-center gap-3 cursor-pointer"
      >
        <div className="shrink-0"><SeverityBadge severity={vuln.severity} /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{vuln.name}</p>
          <p className="text-xs text-slate-500 font-mono truncate">{vuln.affectedAsset}</p>
        </div>
        <span className={`text-sm font-bold shrink-0 ${cvssColor}`}>
          CVSS {vuln.cvssScore.toFixed(1)}
        </span>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
        </motion.div>
      </button>

      {/* Expandable Detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="relative z-20 px-4 pb-4 space-y-3 border-t border-slate-700/30 pt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{vuln.description}</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Risk Level</p>
                    <p className="text-xs text-slate-300">{vuln.riskLevel}</p>
                  </div>
                  {vuln.cwe && (
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">CWE Reference</p>
                      <a
                        href="#"
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 neon-underline"
                      >
                        {vuln.cwe}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Category</p>
                    <p className="text-xs text-slate-300">{vuln.category}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Recommendation</p>
                <p className="text-xs text-slate-300 leading-relaxed">{vuln.recommendation}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                <div className="text-xs text-slate-500">
                  Discovered: {new Date(vuln.discoveredAt).toLocaleString()}
                </div>
                <StatusDropdown
                  status={vuln.status}
                  onChange={(newStatus) => onUpdateStatus(vuln.id, newStatus)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Results Page ────────────────────────────────────────────────
export function ResultsPage() {
  const { currentScan, vulnerabilities, updateVulnerability, setCurrentPage, addNotification } = useVulnGuardStore();

  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get scan vulnerabilities
  const scanVulns = useMemo(() => {
    if (!currentScan) return [];
    return (currentScan.vulnerabilities && currentScan.vulnerabilities.length > 0)
      ? currentScan.vulnerabilities
      : vulnerabilities;
  }, [currentScan, vulnerabilities]);

  // Filter vulnerabilities
  const filteredVulns = useMemo(() => {
    return scanVulns.filter((v) => {
      if (severityFilter !== 'all' && v.severity !== severityFilter) return false;
      if (statusFilter !== 'all' && v.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return v.name.toLowerCase().includes(q) || v.affectedAsset.toLowerCase().includes(q);
      }
      return true;
    });
  }, [scanVulns, severityFilter, statusFilter, searchQuery]);

  // Severity distribution
  const severityData = useMemo(() => {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0, Info: 0 };
    scanVulns.forEach((v) => {
      const key = v.severity.charAt(0).toUpperCase() + v.severity.slice(1) as keyof typeof counts;
      if (key in counts) counts[key]++;
    });
    return [
      { name: 'Critical', value: counts.Critical, color: '#ef4444' },
      { name: 'High', value: counts.High, color: '#f97316' },
      { name: 'Medium', value: counts.Medium, color: '#eab308' },
      { name: 'Low', value: counts.Low, color: '#22c55e' },
      { name: 'Info', value: counts.Info, color: '#64748b' },
    ].filter((d) => d.value > 0);
  }, [scanVulns]);

  const handleUpdateStatus = (id: string, status: Vulnerability['status']) => {
    updateVulnerability(id, { status });
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    addNotification({
      id: `notif-export-${Date.now()}`,
      type: 'report_ready',
      title: 'Report Exported',
      message: `Scan results exported as ${format.toUpperCase()} successfully`,
      timestamp: new Date().toISOString(),
      read: false,
    });
  };

  // Empty state
  if (!currentScan) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold holo-text">Scan Results</h2>
          <p className="text-sm text-slate-400 mt-1">View detailed results from completed vulnerability scans</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card-3d animated-gradient-border rounded-xl p-12 text-center relative"
        >
          {/* Floating 3D element */}
          <div className="absolute top-4 right-4 opacity-40 float-animation">
            <div className="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-cyan-500/50" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 opacity-30 float-rotate">
            <div className="w-8 h-8 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
              <Scan className="w-4 h-4 text-emerald-500/50" />
            </div>
          </div>

          <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-6 float-animation">
            <FileSearch className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No Scan Results</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            Run a vulnerability scan first to see detailed results here. Your scan findings, risk scores, and vulnerability details will appear on this page.
          </p>
          <motion.button
            type="button"
            onClick={() => setCurrentPage('scanner')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all breathe-glow"
          >
            <Scan className="w-4 h-4" />
            Go to Scanner
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Calculate scan duration
  const scanDuration = currentScan.completedAt
    ? Math.round((new Date(currentScan.completedAt).getTime() - new Date(currentScan.startedAt).getTime()) / 1000)
    : 0;

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold holo-text">Scan Results</h2>
        <p className="text-sm text-slate-400 mt-1">Detailed vulnerability findings and risk assessment</p>
      </motion.div>

      {/* Scan Summary Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-card-3d rounded-xl p-6 relative"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
          {/* Scan Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Target className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Target</span>
            </div>
            <p className="text-lg font-semibold text-slate-100 font-mono truncate min-w-0">{currentScan.target}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 uppercase">{currentScan.type}</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded uppercase">{currentScan.status}</span>
            </div>
          </div>

          {/* Date & Duration */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Scan Details</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-200">Started: {new Date(currentScan.startedAt).toLocaleString()}</p>
              {currentScan.completedAt && (
                <p className="text-sm text-slate-200">Completed: {new Date(currentScan.completedAt).toLocaleString()}</p>
              )}
              <p className="text-sm text-slate-400">Duration: {formatDuration(scanDuration)}</p>
            </div>
          </div>

          {/* Risk Score Gauge + MiniGlobe */}
          <div className="flex items-center gap-2 justify-center">
            <div className="flex flex-col items-center justify-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Risk Score</p>
              <RiskScoreGauge score={currentScan.riskScore} />
            </div>
            <MiniGlobe size={100} className="shrink-0 hidden lg:block" />
          </div>

          {/* Severity Distribution + Total Findings */}
          <div className="flex flex-col items-center justify-center col-span-1 lg:col-span-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Findings Distribution</p>
            {severityData.length > 0 ? (
              <div className="relative">
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-xl font-bold text-slate-100">{scanVulns.length}</p>
                  <p className="text-[10px] text-slate-400">Total</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-lg font-bold text-slate-200">{scanVulns.length}</p>
                <p className="text-xs text-slate-400">Findings</p>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {severityData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full pulse-dot" style={{ backgroundColor: entry.color }} />
                  <span className="text-[10px] text-slate-400">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass-card-3d rounded-xl p-4 relative beam-sweep"
      >
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center relative z-10">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vulnerabilities..."
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <div className="flex gap-1">
              {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
                    severityFilter === sev
                      ? sev === 'all'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : sev === 'critical'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                          : sev === 'high'
                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                            : sev === 'medium'
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-slate-300'
                  }`}
                >
                  {sev === 'all' ? 'All' : sev.charAt(0).toUpperCase() + sev.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-1">
            {['all', 'open', 'in_progress', 'resolved'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-slate-300'
                }`}
              >
                {st === 'all' ? 'All Status' : st === 'in_progress' ? 'In Progress' : st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 text-xs text-slate-500 relative z-10">
          Showing {filteredVulns.length} of {scanVulns.length} vulnerabilities
        </div>
      </motion.div>

      {/* Vulnerability Detail Cards */}
      <div className="space-y-3 stagger-entrance">
        <AnimatePresence>
          {filteredVulns.length > 0 ? (
            filteredVulns.map((vuln) => (
              <VulnerabilityCard
                key={vuln.id}
                vuln={vuln}
                onUpdateStatus={handleUpdateStatus}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card-3d rounded-xl p-8 text-center relative"
            >
              <div className="float-animation inline-block mb-3">
                <ShieldAlert className="w-10 h-10 text-slate-700" />
              </div>
              <p className="text-sm text-slate-500">No vulnerabilities match your filters</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex flex-wrap gap-3"
      >
        <motion.button
          type="button"
          onClick={() => handleExport('pdf')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all breathe-glow"
        >
          <Download className="w-4 h-4" />
          Export as PDF
        </motion.button>
        <motion.button
          type="button"
          onClick={() => handleExport('csv')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-slate-300 hover:border-slate-600 transition-all"
        >
          <Download className="w-4 h-4" />
          Export as CSV
        </motion.button>
      </motion.div>
    </div>
  );
}
