'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Globe,
  ExternalLink,
  Shield,
  AlertTriangle,
  Bug,
  Link2,
  Hash,
  MapPin,
  Clock,
  Newspaper,
  ChevronRight,
  Crosshair,
  Activity,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// ─── Dynamic 3D Imports (SSR disabled) ──────────────────────────────

const ThreatMap = dynamic(
  () => import('@/components/vulnguard/3d/threat-map').then((mod) => mod.ThreatMap),
  { ssr: false, loading: () => <ThreatMapSkeleton /> }
);

function ThreatMapSkeleton() {
  return (
    <div className="w-full h-[480px] rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-cyan-500/10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <span className="text-xs text-cyan-400/60 font-mono">INITIALIZING THREAT MAP...</span>
      </div>
    </div>
  );
}

// ─── Threat Locations for 3D Globe ─────────────────────────────────

const THREAT_LOCATIONS = [
  { position: [1.5, 1.2, 1.8] as [number, number, number], severity: 'critical' as const, label: 'RCE - New York (Spring)', color: '#ef4444' },
  { position: [-1.8, 0.5, 2.0] as [number, number, number], severity: 'critical' as const, label: 'RCE - London (TeamCity)', color: '#ef4444' },
  { position: [0.3, -1.5, 2.5] as [number, number, number], severity: 'high' as const, label: 'Path Traversal - Tokyo', color: '#f97316' },
  { position: [-2.0, -0.8, -1.5] as [number, number, number], severity: 'high' as const, label: 'RCE - Berlin (FortiOS)', color: '#f97316' },
  { position: [2.2, -0.3, -1.0] as [number, number, number], severity: 'critical' as const, label: 'Backdoor - Sydney (XZ)', color: '#ef4444' },
  { position: [-0.5, 2.0, -1.8] as [number, number, number], severity: 'critical' as const, label: 'Auth Bypass - Toronto (PAN-OS)', color: '#ef4444' },
  { position: [1.0, -2.0, -1.2] as [number, number, number], severity: 'critical' as const, label: 'CGI Injection - Mumbai (PHP)', color: '#ef4444' },
  { position: [-1.2, 1.8, -0.5] as [number, number, number], severity: 'high' as const, label: 'Path Traversal - Moscow', color: '#f97316' },
  { position: [0.8, 0.4, -2.6] as [number, number, number], severity: 'medium' as const, label: 'C2 Server Detected - Singapore', color: '#eab308' },
  { position: [-0.3, -1.0, 2.8] as [number, number, number], severity: 'medium' as const, label: 'Phishing Campaign - São Paulo', color: '#eab308' },
];

// ─── CVE Data ──────────────────────────────────────────────────────

const CVE_DATA = [
  {
    id: 'CVE-2025-31337',
    severity: 'CRITICAL' as const,
    cvss: 9.8,
    description: 'Spring Framework Remote Code Execution via data binding vulnerability',
    products: ['Spring Framework', 'Spring Boot', 'Spring WebMVC'],
    published: '2025-05-28',
  },
  {
    id: 'CVE-2025-29847',
    severity: 'HIGH' as const,
    cvss: 8.6,
    description: 'Jenkins Path Traversal vulnerability allows arbitrary file read',
    products: ['Jenkins', 'Jenkins LTS'],
    published: '2025-05-25',
  },
  {
    id: 'CVE-2025-27198',
    severity: 'CRITICAL' as const,
    cvss: 9.8,
    description: 'TeamCity Authentication Bypass allows unauthenticated admin access',
    products: ['JetBrains TeamCity'],
    published: '2025-05-20',
  },
  {
    id: 'CVE-2025-21762',
    severity: 'HIGH' as const,
    cvss: 9.6,
    description: 'FortiOS SSL VPN Remote Code Execution via crafted HTTP requests',
    products: ['FortiOS', 'FortiGate'],
    published: '2025-05-18',
  },
  {
    id: 'CVE-2025-3094',
    severity: 'CRITICAL' as const,
    cvss: 10.0,
    description: 'XZ Utils Backdoor injected into liblzma enabling remote SSH access',
    products: ['XZ Utils', 'liblzma', 'systemd'],
    published: '2025-05-15',
  },
  {
    id: 'CVE-2025-0012',
    severity: 'CRITICAL' as const,
    cvss: 9.8,
    description: 'PAN-OS Authentication Bypass in management interface',
    products: ['PAN-OS', 'Palo Alto Firewalls'],
    published: '2025-05-12',
  },
  {
    id: 'CVE-2025-4577',
    severity: 'CRITICAL' as const,
    cvss: 9.8,
    description: 'PHP CGI Injection vulnerability enables remote code execution',
    products: ['PHP', 'PHP-CGI', 'Apache'],
    published: '2025-05-10',
  },
  {
    id: 'CVE-2025-23897',
    severity: 'HIGH' as const,
    cvss: 8.6,
    description: 'Jenkins CLI Path Traversal enables arbitrary file read access',
    products: ['Jenkins', 'Jenkins CLI'],
    published: '2025-05-08',
  },
];

// ─── Threat Category Data ──────────────────────────────────────────

const THREAT_CATEGORIES = [
  { name: 'Malware', count: 142, color: '#ef4444' },
  { name: 'Phishing', count: 98, color: '#f97316' },
  { name: 'RCE', count: 87, color: '#eab308' },
  { name: 'XSS', count: 65, color: '#22c55e' },
  { name: 'CSRF', count: 43, color: '#06b6d4' },
  { name: 'DoS', count: 56, color: '#8b5cf6' },
  { name: 'Supply Chain', count: 34, color: '#ec4899' },
  { name: 'Crypto', count: 28, color: '#64748b' },
];

// ─── Attack Vector Data ────────────────────────────────────────────

const ATTACK_VECTORS = [
  { name: 'Network', value: 45, color: '#06b6d4' },
  { name: 'Local', value: 30, color: '#10b981' },
  { name: 'Physical', value: 10, color: '#f97316' },
  { name: 'Social', value: 15, color: '#8b5cf6' },
];

// ─── IOC Data ──────────────────────────────────────────────────────

const IOCS = [
  { type: 'IP', value: '185.220.101.34', threat: 'C2 Server', confidence: 'high' as const, firstSeen: '2025-06-01', lastSeen: '2025-06-05' },
  { type: 'Domain', value: 'malware-dist.example.com', threat: 'Phishing', confidence: 'high' as const, firstSeen: '2025-05-28', lastSeen: '2025-06-04' },
  { type: 'Hash', value: 'a1b2c3d4e5f6a7b8c9d0e1f2', threat: 'Trojan', confidence: 'medium' as const, firstSeen: '2025-05-15', lastSeen: '2025-06-03' },
  { type: 'URL', value: 'https://evil.example.com/payload', threat: 'Malware Drop', confidence: 'high' as const, firstSeen: '2025-06-02', lastSeen: '2025-06-05' },
  { type: 'IP', value: '103.224.182.250', threat: 'Botnet', confidence: 'high' as const, firstSeen: '2025-05-20', lastSeen: '2025-06-04' },
  { type: 'Domain', value: 'secure-login.evil-corp.net', threat: 'Phishing', confidence: 'high' as const, firstSeen: '2025-05-30', lastSeen: '2025-06-05' },
  { type: 'Hash', value: 'd4e5f6a7b8c9d0e1f2a3b4c5', threat: 'Ransomware', confidence: 'low' as const, firstSeen: '2025-04-10', lastSeen: '2025-05-25' },
  { type: 'IP', value: '45.33.32.156', threat: 'Scanner', confidence: 'medium' as const, firstSeen: '2025-05-22', lastSeen: '2025-06-01' },
  { type: 'URL', value: 'https://cdn.malware-site.xyz/stealer', threat: 'Info Stealer', confidence: 'high' as const, firstSeen: '2025-05-29', lastSeen: '2025-06-05' },
];

// ─── Security News ─────────────────────────────────────────────────

const SECURITY_NEWS = [
  {
    headline: 'Critical Spring Framework RCE Actively Exploited in the Wild',
    source: 'ThreatScope Intel',
    date: '2025-06-05',
    summary: 'Threat actors are actively exploiting CVE-2025-31337 targeting Spring Framework applications. Organizations urged to patch immediately.',
  },
  {
    headline: 'XZ Utils Backdoor: Supply Chain Attack Analysis Update',
    source: 'Security Weekly',
    date: '2025-06-04',
    summary: 'New findings reveal the XZ Utils backdoor was planted over two years. Detailed analysis of the attack chain and detection methods.',
  },
  {
    headline: 'Rise in AI-Powered Phishing Campaigns Detected',
    source: 'ThreatPost',
    date: '2025-06-03',
    summary: 'Researchers report a 300% increase in sophisticated phishing campaigns using AI-generated content targeting enterprise environments.',
  },
  {
    headline: 'New FortiOS VPN Vulnerability Under Active Exploitation',
    source: 'BleepingComputer',
    date: '2025-06-02',
    summary: 'Multiple threat groups exploiting FortiOS SSL VPN vulnerability CVE-2025-21762. Emergency patching recommended for all exposed instances.',
  },
];

// ─── Helpers ───────────────────────────────────────────────────────

const severityColor = (severity: string) => {
  switch (severity) {
    case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

const severityCardClass = (severity: string) => {
  switch (severity) {
    case 'CRITICAL': return 'severity-card-critical';
    case 'HIGH': return 'severity-card-high';
    case 'MEDIUM': return 'severity-card-medium';
    default: return 'severity-card-low';
  }
};

const severityPulseClass = (severity: string) => {
  switch (severity) {
    case 'CRITICAL': return 'threat-pulse-critical';
    case 'HIGH': return 'threat-pulse-high';
    default: return '';
  }
};

const cvssColor = (score: number) => {
  if (score >= 9.0) return 'bg-red-500';
  if (score >= 7.0) return 'bg-orange-500';
  if (score >= 4.0) return 'bg-yellow-500';
  return 'bg-green-500';
};

const cvssGlow = (score: number) => {
  if (score >= 9.0) return 'shadow-red-500/50';
  if (score >= 7.0) return 'shadow-orange-500/50';
  return '';
};

const confidenceColor = (conf: string) => {
  switch (conf) {
    case 'high': return 'bg-emerald-500/20 text-emerald-400';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400';
    case 'low': return 'bg-slate-500/20 text-slate-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
};

const typeIcon = (type: string) => {
  switch (type) {
    case 'IP': return <MapPin className="w-3.5 h-3.5" />;
    case 'Domain': return <Globe className="w-3.5 h-3.5" />;
    case 'Hash': return <Hash className="w-3.5 h-3.5" />;
    case 'URL': return <Link2 className="w-3.5 h-3.5" />;
    default: return <Bug className="w-3.5 h-3.5" />;
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ─── Custom Tooltip for Recharts ───────────────────────────────────

function CustomBarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs" style={{ position: 'relative', zIndex: 50 }}>
      <p className="text-slate-300 font-medium">{label}</p>
      <p className="text-cyan-300 font-bold">{payload[0].value} incidents</p>
    </div>
  );
}

function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs" style={{ position: 'relative', zIndex: 50 }}>
      <p className="text-slate-300 font-medium">{payload[0].name}</p>
      <p className="text-cyan-300 font-bold">{payload[0].value}%</p>
    </div>
  );
}

// ─── Section Header Component ──────────────────────────────────────

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 relative">
      <div className="relative">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-cyan-400" />
        </div>
        <div className="absolute -inset-1 rounded-lg bg-cyan-400/5 blur-sm" />
      </div>
      <div>
        <h2 className="text-lg font-bold holo-text">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {/* Cyber corner accent line */}
      <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 via-cyan-500/10 to-transparent" />
    </div>
  );
}

// ─── Cyber Corner Accent Wrapper ───────────────────────────────────

function CyberCornerCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Top-left corner accent */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg pointer-events-none" />
      {/* Bottom-right corner accent */}
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-500/30 rounded-br-lg pointer-events-none" />
      {children}
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────

export function ThreatIntelPage() {
  const [selectedCve, setSelectedCve] = useState<string | null>(null);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* ═══ Page Header ═══ */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Globe className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="absolute -inset-1 rounded-xl bg-cyan-400/10 blur-md animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl font-bold holo-text">Threat Intelligence</h1>
          <p className="text-sm text-slate-400 mt-0.5">Real-time CVEs, threat feeds, and indicators of compromise</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">LIVE FEED</span>
          </div>
        </div>
      </motion.div>

      {/* ═══ 3D Threat Map ═══ */}
      <motion.div variants={itemVariants}>
        <CyberCornerCard>
          <div className="glass-card-3d animated-gradient-border p-1">
            <div className="relative rounded-xl overflow-hidden">
              {/* Threat Map Header Overlay */}
              <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto">
                  <Crosshair className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold holo-text">Global Threat Landscape</span>
                </div>
                <div className="flex items-center gap-3 pointer-events-auto">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500 threat-pulse-critical" />
                    <span className="text-[10px] text-slate-400">Critical</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-orange-500 threat-pulse-high" />
                    <span className="text-[10px] text-slate-400">High</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 threat-pulse-medium" />
                    <span className="text-[10px] text-slate-400">Medium</span>
                  </div>
                </div>
              </div>
              {/* Bottom Stats Overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-4 flex items-center gap-6 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs text-slate-300"><span className="text-cyan-400 font-bold">{THREAT_LOCATIONS.filter(t => t.severity === 'critical').length}</span> Active Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-xs text-slate-300"><span className="text-orange-400 font-bold">{THREAT_LOCATIONS.filter(t => t.severity === 'high').length}</span> Active High</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-slate-300"><span className="text-emerald-400 font-bold">{THREAT_LOCATIONS.length}</span> Total Points</span>
                </div>
              </div>
              <ThreatMap
                threats={THREAT_LOCATIONS}
                height={480}
              />
            </div>
          </div>
        </CyberCornerCard>
      </motion.div>

      {/* ═══ CVE Intelligence Feed ═══ */}
      <motion.div variants={itemVariants}>
        <SectionHeader
          icon={Shield}
          title="CVE Intelligence Feed"
          subtitle="Latest vulnerabilities and exposure entries"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 stagger-entrance">
          {CVE_DATA.map((cve, idx) => (
            <motion.div
              key={cve.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`glass-card-3d ${severityCardClass(cve.severity)} beam-sweep group cursor-pointer`}
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              <div className="relative z-10 p-4">
                {/* CVE ID + Severity + Pulse */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {cve.severity === 'CRITICAL' && (
                      <div className={`w-2 h-2 rounded-full ${severityPulseClass(cve.severity)}`} />
                    )}
                    <span className="font-mono text-sm text-cyan-400 font-bold group-hover:text-cyan-300 transition-colors">
                      {cve.id}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityColor(cve.severity)}`}>
                    {cve.severity}
                  </span>
                </div>

                {/* CVSS Score Bar */}
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-[10px] text-slate-500 font-mono">CVSS</span>
                  <div className="flex-1 h-2 bg-slate-800/80 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${cvssColor(cve.cvss)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(cve.cvss / 10) * 100}%` }}
                      transition={{ delay: 0.3 + idx * 0.06, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${cve.cvss >= 9.0 ? 'text-red-400' : cve.cvss >= 7.0 ? 'text-orange-400' : 'text-yellow-400'}`}>
                    {cve.cvss}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">{cve.description}</p>

                {/* Affected Products */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {cve.products.slice(0, 2).map((product) => (
                    <span key={product} className="text-[10px] px-1.5 py-0.5 bg-slate-800/80 text-slate-400 rounded border border-slate-700/50 whitespace-nowrap max-w-[120px] truncate inline-block">
                      {product}
                    </span>
                  ))}
                  {cve.products.length > 2 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-800/80 text-slate-500 rounded border border-slate-700/50">
                      +{cve.products.length - 2}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {cve.published}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] text-cyan-400 hover:text-cyan-300 px-2 hover:bg-cyan-500/10"
                    onClick={() => setSelectedCve(selectedCve === cve.id ? null : cve.id)}
                  >
                    View Details
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══ Charts Row ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Categories Bar Chart */}
        <motion.div variants={itemVariants}>
          <CyberCornerCard>
            <div className="glass-card-3d holo-shimmer p-6">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <h3 className="text-sm font-bold holo-text">Threat Categories</h3>
                  <div className="ml-auto">
                    <Badge variant="outline" className="text-[10px] border-cyan-500/20 text-cyan-400/70">
                      {THREAT_CATEGORIES.reduce((s, c) => s + c.count, 0)} total
                    </Badge>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={THREAT_CATEGORIES} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" strokeOpacity={0.5} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={{ stroke: '#334155' }}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {THREAT_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CyberCornerCard>
        </motion.div>

        {/* Attack Vector Donut Chart */}
        <motion.div variants={itemVariants}>
          <CyberCornerCard>
            <div className="glass-card-3d holo-shimmer p-6">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Bug className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold holo-text">Attack Vector Analysis</h3>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={ATTACK_VECTORS}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {ATTACK_VECTORS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value: string) => (
                        <span className="text-slate-400 text-xs">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CyberCornerCard>
        </motion.div>
      </div>

      {/* ═══ IOCs Table ═══ */}
      <motion.div variants={itemVariants}>
        <SectionHeader
          icon={Crosshair}
          title="Indicators of Compromise (IOCs)"
          subtitle="Tracked threat indicators and malicious infrastructure"
        />
        <CyberCornerCard>
          <div className="glass-card-3d data-stream p-6">
            <div className="relative z-10">
              <div className="overflow-x-auto custom-scrollbar max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800/60 hover:bg-transparent">
                      <TableHead className="text-cyan-400/70 text-[11px] font-bold uppercase tracking-wider">Type</TableHead>
                      <TableHead className="text-cyan-400/70 text-[11px] font-bold uppercase tracking-wider">Value</TableHead>
                      <TableHead className="text-cyan-400/70 text-[11px] font-bold uppercase tracking-wider">Threat Type</TableHead>
                      <TableHead className="text-cyan-400/70 text-[11px] font-bold uppercase tracking-wider">Confidence</TableHead>
                      <TableHead className="text-cyan-400/70 text-[11px] font-bold uppercase tracking-wider">First Seen</TableHead>
                      <TableHead className="text-cyan-400/70 text-[11px] font-bold uppercase tracking-wider">Last Seen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {IOCS.map((ioc, idx) => (
                      <TableRow
                        key={`${ioc.type}-${ioc.value}`}
                        className="border-slate-800/40 hover:bg-cyan-500/5 hover:border-cyan-500/10 transition-all duration-300 group"
                      >
                        <TableCell>
                          <span className="flex items-center gap-1.5 text-xs text-slate-300">
                            <span className="text-cyan-400/60 group-hover:text-cyan-400 transition-colors">
                              {typeIcon(ioc.type)}
                            </span>
                            {ioc.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {ioc.confidence === 'high' && (
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 threat-pulse-critical" />
                            )}
                            <span className="font-mono text-xs text-cyan-400 group-hover:text-cyan-300 transition-colors max-w-[200px] truncate block">
                              {ioc.value}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-slate-300 group-hover:text-slate-200 transition-colors">{ioc.threat}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${confidenceColor(ioc.confidence)}`}>
                            {ioc.confidence.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-slate-500">{ioc.firstSeen}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-slate-500">{ioc.lastSeen}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CyberCornerCard>
      </motion.div>

      {/* ═══ Security News Feed ═══ */}
      <motion.div variants={itemVariants}>
        <SectionHeader
          icon={Newspaper}
          title="Security News Feed"
          subtitle="Latest cybersecurity headlines and analysis"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECURITY_NEWS.map((news, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass-card-3d group cursor-pointer float-animation"
              style={{ animationDelay: `${idx * 0.5}s` }}
            >
              <div className="relative z-10 p-5">
                {/* Holographic shimmer overlay on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 holo-shimmer pointer-events-none" />

                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                    {news.headline}
                  </h4>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0 mt-0.5 transition-all duration-300 group-hover:translate-x-0.5" />
                </div>
                <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">{news.summary}</p>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-cyan-400/80 font-medium">{news.source}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {news.date}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
