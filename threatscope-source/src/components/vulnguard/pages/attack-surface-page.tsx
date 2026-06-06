'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Globe,
  Network,
  Server,
  Lock,
  AlertTriangle,
  Wifi,
  Database,
  Monitor,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// ─── Mock Data Constants ─────────────────────────────────────────────

const SUMMARY_STATS = [
  { label: 'Exposed Assets', value: 24, icon: Monitor, color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20', trend: '+3', trendUp: true },
  { label: 'Open Ports', value: 18, icon: Wifi, color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20', trend: '+2', trendUp: true },
  { label: 'Running Services', value: 12, icon: Server, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/20', trend: '-1', trendUp: false },
  { label: 'Risk Exposures', value: 8, icon: AlertTriangle, color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20', trend: '+2', trendUp: true },
];

const NETWORK_PORTS = [
  { port: 21, service: 'FTP', version: 'vsftpd 3.0.3', protocol: 'TCP', status: 'Open' as const, risk: 'high' as const },
  { port: 22, service: 'SSH', version: 'OpenSSH 8.9', protocol: 'TCP', status: 'Open' as const, risk: 'medium' as const },
  { port: 80, service: 'HTTP', version: 'nginx 1.24.0', protocol: 'TCP', status: 'Open' as const, risk: 'low' as const },
  { port: 443, service: 'HTTPS', version: 'nginx 1.24.0', protocol: 'TCP', status: 'Open' as const, risk: 'secure' as const },
  { port: 3306, service: 'MySQL', version: 'MySQL 8.0.35', protocol: 'TCP', status: 'Open' as const, risk: 'critical' as const },
  { port: 5432, service: 'PostgreSQL', version: 'PostgreSQL 15.4', protocol: 'TCP', status: 'Filtered' as const, risk: 'high' as const },
  { port: 6379, service: 'Redis', version: 'Redis 7.2.3', protocol: 'TCP', status: 'Open' as const, risk: 'critical' as const },
  { port: 8080, service: 'Tomcat', version: 'Apache Tomcat 9.0', protocol: 'TCP', status: 'Open' as const, risk: 'high' as const },
  { port: 9200, service: 'Elasticsearch', version: 'ES 8.11.0', protocol: 'TCP', status: 'Open' as const, risk: 'critical' as const },
  { port: 27017, service: 'MongoDB', version: 'MongoDB 7.0.4', protocol: 'TCP', status: 'Open' as const, risk: 'critical' as const },
];

const SECURITY_HEADERS = [
  { name: 'Content-Security-Policy', status: 'Missing' as const },
  { name: 'X-Frame-Options', status: 'Present' as const },
  { name: 'X-Content-Type-Options', status: 'Missing' as const },
  { name: 'Strict-Transport-Security', status: 'Present' as const },
  { name: 'X-XSS-Protection', status: 'Missing' as const },
  { name: 'Referrer-Policy', status: 'Missing' as const },
];

const RADAR_DATA = [
  { subject: 'Network Exposure', A: 75 },
  { subject: 'Web Security', A: 45 },
  { subject: 'Authentication', A: 55 },
  { subject: 'Data Protection', A: 60 },
  { subject: 'Compliance', A: 70 },
  { subject: 'Monitoring', A: 40 },
];

const DOMAIN_DATA = [
  { domain: 'corp.local', subdomains: 5, risk: 'medium' as const },
  { domain: 'api.corp.local', subdomains: 2, risk: 'high' as const },
  { domain: 'admin.corp.local', subdomains: 1, risk: 'critical' as const },
  { domain: 'portal.corp.local', subdomains: 3, risk: 'low' as const },
  { domain: 'dev.corp.local', subdomains: 4, risk: 'high' as const },
];

const IP_DATA = [
  { ip: '192.168.1.10', label: 'Web Server', risk: 'medium' as const },
  { ip: '192.168.1.30', label: 'Database', risk: 'critical' as const },
  { ip: '10.0.1.2', label: 'Admin', risk: 'high' as const },
  { ip: '10.0.1.5', label: 'API Gateway', risk: 'medium' as const },
  { ip: '192.168.1.50', label: 'File Server', risk: 'low' as const },
  { ip: '10.0.2.1', label: 'DNS Server', risk: 'low' as const },
];

interface SecurityNode {
  id: string;
  label: string;
  risk: 'critical' | 'high' | 'medium' | 'low' | 'secure';
  x: number;
  y: number;
}

const SECURITY_NODES: SecurityNode[] = [
  { id: 'corp', label: 'Corporate Network', risk: 'secure', x: 400, y: 200 },
  { id: 'web', label: 'Web Server', risk: 'medium', x: 200, y: 80 },
  { id: 'api', label: 'API Gateway', risk: 'high', x: 600, y: 80 },
  { id: 'db', label: 'Database', risk: 'critical', x: 150, y: 320 },
  { id: 'auth', label: 'Auth Service', risk: 'medium', x: 400, y: 360 },
  { id: 'file', label: 'File Server', risk: 'high', x: 650, y: 320 },
  { id: 'dns', label: 'DNS Server', risk: 'low', x: 600, y: 200 },
];

const SECURITY_CONNECTIONS = [
  { from: 'corp', to: 'web' },
  { from: 'corp', to: 'api' },
  { from: 'corp', to: 'db' },
  { from: 'corp', to: 'auth' },
  { from: 'corp', to: 'file' },
  { from: 'corp', to: 'dns' },
  { from: 'web', to: 'api' },
  { from: 'api', to: 'db' },
  { from: 'api', to: 'auth' },
  { from: 'file', to: 'db' },
];

// ─── Helper Functions ────────────────────────────────────────────────

const riskColor = (risk: string) => {
  switch (risk) {
    case 'critical': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', fill: '#ef4444', stroke: '#ef4444' };
    case 'high': return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', fill: '#f97316', stroke: '#f97316' };
    case 'medium': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', fill: '#eab308', stroke: '#eab308' };
    case 'low': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', fill: '#10b981', stroke: '#10b981' };
    case 'secure': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', fill: '#10b981', stroke: '#10b981' };
    default: return { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30', fill: '#64748b', stroke: '#64748b' };
  }
};

const riskPulseClass = (risk: string) => {
  switch (risk) {
    case 'critical': return 'threat-pulse-critical';
    case 'high': return 'threat-pulse-high';
    case 'medium': return 'threat-pulse-medium';
    default: return '';
  }
};

const statusColor = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Filtered': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Closed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

const nodeRadius = (id: string) => (id === 'corp' ? 38 : 28);
const nodeFontSize = (id: string) => (id === 'corp' ? 11 : 9);

// ─── Animation Variants ──────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

// ─── Custom Radar Tooltip ────────────────────────────────────────────

function CustomRadarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800/95 backdrop-blur-xl border border-cyan-500/20 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-300 font-medium">{label}</p>
      <p className="text-sm text-cyan-400 font-bold">{payload[0].value}%</p>
    </div>
  );
}

// ─── Cyber Corner Accent Wrapper ─────────────────────────────────────

function CyberCornerCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-xl pointer-events-none z-20" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-500/30 rounded-br-xl pointer-events-none z-20" />
      {children}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export function AttackSurfacePage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 mesh-gradient-bg"
    >
      {/* Ambient orbs for atmospheric depth */}
      <div className="ambient-orb w-[500px] h-[500px] top-[-5%] left-[-5%] opacity-25" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="ambient-orb w-[600px] h-[600px] bottom-[-10%] right-[-8%] opacity-20" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', filter: 'blur(90px)' }} />
      <div className="ambient-orb w-[400px] h-[400px] top-[30%] left-[40%] opacity-20" style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      {/* ═══ Page Header ═══ */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="absolute -inset-1 rounded-xl bg-cyan-400/10 blur-md animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl font-bold threatscope-ai-title">Attack Surface</h1>
          <motion.div
            className="h-0.5 bg-gradient-to-r from-cyan-500/60 via-cyan-500/30 to-transparent rounded-full mt-1"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
          <p className="text-sm text-slate-400 mt-1">
            Comprehensive visualization of all exposed security elements and network topology
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="w-2 h-2 rounded-full bg-red-400 threat-pulse-critical" />
            <span className="text-xs text-red-400 font-medium">HIGH EXPOSURE</span>
          </div>
        </div>
      </motion.div>

      {/* ═══ Summary Stats Row ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-3d">
        {SUMMARY_STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass-card-float group"
            >
              <div className="relative z-10 p-4">
                {/* Cyber corner accents */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />

                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    stat.trendUp
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {stat.trendUp ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.trend}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ═══ Network Exposure Section ═══ */}
      <motion.div variants={itemVariants}>
        <CyberCornerCard>
          <div className="glass-card-float scan-line-vertical p-6">
            <div className="relative z-10">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Globe className="w-4.5 h-4.5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold threatscope-ai-title">Network Exposure</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Open ports and running services detected</p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 via-cyan-500/10 to-transparent" />
                <Badge variant="outline" className="text-[10px] border-red-500/20 text-red-400/80">
                  {NETWORK_PORTS.filter(p => p.risk === 'critical').length} Critical
                </Badge>
              </div>

              {/* Table */}
              <div className="overflow-x-auto custom-scrollbar max-h-[420px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800/60 hover:bg-transparent">
                      <TableHead className="text-cyan-400/70 text-[11px] font-bold uppercase tracking-wider">Port</TableHead>
                      <TableHead className="text-cyan-400/70 text-[11px] font-bold uppercase tracking-wider">Service</TableHead>
                      <TableHead className="text-cyan-400/70 text-[11px] font-bold uppercase tracking-wider">Version</TableHead>
                      <TableHead className="text-cyan-400/70 text-[11px] font-bold uppercase tracking-wider">Protocol</TableHead>
                      <TableHead className="text-cyan-400/70 text-[11px] font-bold uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-cyan-400/70 text-[11px] font-bold uppercase tracking-wider">Risk Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {NETWORK_PORTS.map((port, idx) => {
                      const rc = riskColor(port.risk);
                      return (
                        <motion.tr
                          key={port.port}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04, duration: 0.4 }}
                          className="border-slate-800/40 hover:bg-cyan-500/5 hover:border-cyan-500/10 transition-all duration-300 group"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${rc.bg} ${riskPulseClass(port.risk)}`} style={{ backgroundColor: rc.fill }} />
                              <span className="font-mono text-sm text-cyan-400 group-hover:text-cyan-300 transition-colors">
                                {port.port}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-slate-200 group-hover:text-slate-100 transition-colors font-medium">
                              {port.service}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-slate-400 font-mono">{port.version}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-slate-400">{port.protocol}</span>
                          </TableCell>
                          <TableCell>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor(port.status)}`}>
                              {port.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${rc.bg} ${rc.text} ${rc.border} uppercase`}>
                              {port.risk}
                            </span>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CyberCornerCard>
      </motion.div>

      {/* ═══ Web Security Exposure Section ═══ */}
      <motion.div variants={itemVariants}>
        <CyberCornerCard>
          <div className="glass-card-float beam-sweep p-6">
            <div className="relative z-10">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Shield className="w-4.5 h-4.5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold threatscope-ai-title">Web Security Exposure</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Security header analysis and TLS configuration</p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 via-cyan-500/10 to-transparent" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Security Headers Grid */}
                <div className="lg:col-span-2">
                  <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    Security Headers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SECURITY_HEADERS.map((header, idx) => (
                      <motion.div
                        key={header.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 0.08, duration: 0.4 }}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 group ${
                          header.status === 'Present'
                            ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                            : 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                        }`}
                      >
                        {header.status === 'Present' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-200 font-mono truncate">{header.name}</p>
                          <p className={`text-[10px] font-semibold uppercase ${
                            header.status === 'Present' ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {header.status}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* SSL/TLS & Auth Status */}
                <div className="space-y-4">
                  {/* SSL/TLS Status */}
                  <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 alert-card-medium">
                    <div className="flex items-center gap-2 mb-3">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-medium text-slate-200">SSL/TLS Status</h4>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-amber-500/20 text-amber-400 border-amber-500/30 uppercase">
                        Weak
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 threat-pulse-medium" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Supports deprecated TLS 1.0 and TLS 1.1 protocols. Vulnerable to POODLE and BEAST attacks.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {['TLS 1.0', 'TLS 1.1', 'TLS 1.2', 'TLS 1.3'].map((v) => (
                        <span
                          key={v}
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            v === 'TLS 1.0' || v === 'TLS 1.1'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Authentication Status */}
                  <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 alert-card-critical">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <h4 className="text-sm font-medium text-slate-200">Authentication</h4>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-red-500/20 text-red-400 border-red-500/30 uppercase">
                        Weak
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 threat-pulse-critical" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Weak password policy detected. No MFA enforcement. Passwords accept &lt;8 chars without complexity requirements.
                    </p>
                    <div className="mt-2 space-y-1">
                      {[
                        { label: 'Password Policy', ok: false },
                        { label: 'MFA Enforcement', ok: false },
                        { label: 'Account Lockout', ok: true },
                        { label: 'Session Timeout', ok: false },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                          {item.ok ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-400" />
                          )}
                          <span className={`text-[10px] ${item.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CyberCornerCard>
      </motion.div>

      {/* ═══ Interactive Security Map ═══ */}
      <motion.div variants={itemVariants}>
        <CyberCornerCard>
          <div className="glass-card-float breathe-glow p-6">
            <div className="relative z-10">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Network className="w-4.5 h-4.5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold threatscope-ai-title">Interactive Security Map</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Network topology with risk-level visualization</p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 via-cyan-500/10 to-transparent" />
              </div>

              {/* SVG Network Map */}
              <div className="relative w-full overflow-hidden rounded-xl bg-slate-900/40 border border-slate-800/50 depth-shadow-lg">
                {/* Scan line overlay */}
                <div className="absolute inset-0 scan-line-vertical pointer-events-none z-10" />

                <svg
                  viewBox="0 0 800 440"
                  className="w-full h-auto"
                  style={{ minHeight: '320px' }}
                >
                  <defs>
                    {/* Glow filters */}
                    <filter id="nodeGlowCritical" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="nodeGlowHigh" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="nodeGlowSecure" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>

                    {/* Grid pattern */}
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.5" />
                    </pattern>
                  </defs>

                  {/* Background grid */}
                  <rect width="800" height="440" fill="url(#grid)" />

                  {/* Connection lines */}
                  {SECURITY_CONNECTIONS.map((conn, idx) => {
                    const fromNode = SECURITY_NODES.find(n => n.id === conn.from)!;
                    const toNode = SECURITY_NODES.find(n => n.id === conn.to)!;
                    const maxRisk = [fromNode.risk, toNode.risk].includes('critical')
                      ? '#ef4444'
                      : [fromNode.risk, toNode.risk].includes('high')
                      ? '#f97316'
                      : [fromNode.risk, toNode.risk].includes('medium')
                      ? '#eab308'
                      : '#10b981';

                    return (
                      <g key={`conn-${idx}`} className="connection-line-3d">
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={maxRisk}
                          strokeWidth={1.5}
                          strokeOpacity={0.2}
                          filter="url(#lineGlow)"
                        />
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={maxRisk}
                          strokeWidth={0.8}
                          strokeOpacity={0.5}
                          strokeDasharray="6 4"
                        >
                          <animate
                            attributeName="stroke-dashoffset"
                            from="0"
                            to="20"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </line>
                      </g>
                    );
                  })}

                  {/* Nodes */}
                  {SECURITY_NODES.map((node) => {
                    const rc = riskColor(node.risk);
                    const r = nodeRadius(node.id);
                    const fs = nodeFontSize(node.id);
                    const isCritical = node.risk === 'critical';
                    const isHigh = node.risk === 'high';

                    return (
                      <g key={node.id} className="node-3d">
                        {/* Pulse ring for critical/high */}
                        {(isCritical || isHigh) && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={r + 8}
                            fill="none"
                            stroke={rc.fill}
                            strokeWidth={1}
                            strokeOpacity={0.3}
                          >
                            <animate
                              attributeName="r"
                              values={`${r + 8};${r + 20};${r + 8}`}
                              dur={isCritical ? '2s' : '3s'}
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="stroke-opacity"
                              values="0.4;0;0.4"
                              dur={isCritical ? '2s' : '3s'}
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}

                        {/* Outer glow */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={r + 4}
                          fill={rc.fill}
                          fillOpacity={0.08}
                          filter={isCritical ? 'url(#nodeGlowCritical)' : isHigh ? 'url(#nodeGlowHigh)' : 'url(#nodeGlowSecure)'}
                        />

                        {/* Main node circle */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={r}
                          fill={`${rc.fill}15`}
                          stroke={rc.fill}
                          strokeWidth={2}
                          strokeOpacity={0.6}
                        />

                        {/* Inner circle */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={r - 6}
                          fill={`${rc.fill}10`}
                          stroke={rc.fill}
                          strokeWidth={1}
                          strokeOpacity={0.3}
                        />

                        {/* Node label */}
                        <text
                          x={node.x}
                          y={node.y - 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#e2e8f0"
                          fontSize={fs}
                          fontWeight="bold"
                          fontFamily="ui-monospace, monospace"
                        >
                          {node.label}
                        </text>

                        {/* Risk badge below */}
                        <rect
                          x={node.x - 22}
                          y={node.y + r + 6}
                          width={44}
                          height={14}
                          rx={4}
                          fill={`${rc.fill}25`}
                          stroke={rc.fill}
                          strokeWidth={0.8}
                          strokeOpacity={0.4}
                        />
                        <text
                          x={node.x}
                          y={node.y + r + 14}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={rc.fill}
                          fontSize={8}
                          fontWeight="bold"
                          fontFamily="ui-monospace, monospace"

                        >
                          {node.risk === 'low' ? 'SECURE' : node.risk.toUpperCase()}
                        </text>

                        {/* Icon indicator for critical nodes */}
                        {isCritical && (
                          <>
                            <circle
                              cx={node.x + r - 4}
                              cy={node.y - r + 4}
                              r={5}
                              fill="#ef4444"
                              fillOpacity={0.9}
                            />
                            <text
                              x={node.x + r - 4}
                              y={node.y - r + 5}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill="white"
                              fontSize={7}
                              fontWeight="bold"
                            >
                              !
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-3 right-3 flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 z-20">
                  {[
                    { color: 'bg-red-500', label: 'Critical' },
                    { color: 'bg-orange-500', label: 'High' },
                    { color: 'bg-yellow-500', label: 'Medium' },
                    { color: 'bg-emerald-500', label: 'Secure' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-[10px] text-slate-400">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Stats overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 z-20">
                  <div className="flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs text-slate-300">
                      <span className="text-cyan-400 font-bold">{SECURITY_NODES.length}</span> Nodes
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-xs text-slate-300">
                      <span className="text-red-400 font-bold">{SECURITY_NODES.filter(n => n.risk === 'critical').length}</span> Critical
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CyberCornerCard>
      </motion.div>

      {/* ═══ Asset Overview Section ═══ */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-3d">
          {/* Domains & Subdomains */}
          <CyberCornerCard>
            <div className="glass-card-float p-6">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold threatscope-ai-title">Domains & Subdomains</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Discovered domain assets</p>
                  </div>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                  {DOMAIN_DATA.map((domain, idx) => {
                    const rc = riskColor(domain.risk);
                    return (
                      <motion.div
                        key={domain.domain}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.08, duration: 0.4 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 group"
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${riskPulseClass(domain.risk)}`}
                          style={{ backgroundColor: rc.fill }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-mono text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                            {domain.domain}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-slate-500">{domain.subdomains} subdomains</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${rc.bg} ${rc.text} ${rc.border} uppercase`}>
                            {domain.risk}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CyberCornerCard>

          {/* IP Addresses */}
          <CyberCornerCard>
            <div className="glass-card-float p-6">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Server className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold threatscope-ai-title">IP Addresses</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Discovered host assets</p>
                  </div>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                  {IP_DATA.map((ip, idx) => {
                    const rc = riskColor(ip.risk);
                    return (
                      <motion.div
                        key={ip.ip}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.08, duration: 0.4 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 group"
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${riskPulseClass(ip.risk)}`}
                          style={{ backgroundColor: rc.fill }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-mono text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                            {ip.ip}
                          </p>
                          <p className="text-[10px] text-slate-500">{ip.label}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${rc.bg} ${rc.text} ${rc.border} uppercase shrink-0`}>
                          {ip.risk}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CyberCornerCard>
        </div>
      </motion.div>

      {/* ═══ Risk Summary Radar Chart ═══ */}
      <motion.div variants={itemVariants}>
        <CyberCornerCard>
          <div className="glass-card-float p-6">
            <div className="relative z-10">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-4.5 h-4.5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold threatscope-ai-title">Risk Summary</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Multi-dimensional risk assessment radar</p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 via-cyan-500/10 to-transparent" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Radar Chart */}
                <div className="lg:col-span-2">
                  <ResponsiveContainer width="100%" height={340}>
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
                      <PolarGrid
                        stroke="#1e293b"
                        strokeOpacity={0.6}
                        strokeWidth={1}
                      />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        axisLine={{ stroke: '#334155' }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: '#475569', fontSize: 9 }}
                        axisLine={{ stroke: '#1e293b' }}
                        tickCount={5}
                      />
                      <Radar
                        name="Risk Level"
                        dataKey="A"
                        stroke="#10b981"
                        fill="#06b6d4"
                        fillOpacity={0.15}
                        strokeWidth={2}
                        style={{
                          filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.3))',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Risk Breakdown Cards */}
                <div className="space-y-3">
                  {RADAR_DATA.map((item, idx) => {
                    const riskLabel = item.A >= 70 ? 'Critical' : item.A >= 55 ? 'High' : item.A >= 40 ? 'Medium' : 'Low';
                    const rc = riskColor(riskLabel.toLowerCase());
                    return (
                      <motion.div
                        key={item.subject}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.08, duration: 0.4 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-300 font-medium truncate">{item.subject}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${rc.bg} ${rc.text} ${rc.border} uppercase`}>
                              {riskLabel}
                            </span>
                          </div>
                          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: rc.fill }}
                              initial={{ width: 0 }}
                              animate={{ width: `${item.A}%` }}
                              transition={{ duration: 1, delay: 0.6 + idx * 0.1, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-bold text-slate-200 shrink-0 w-10 text-right">{item.A}%</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CyberCornerCard>
      </motion.div>
    </motion.div>
  );
}
