'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Brain,
  Shield,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  TrendingUp,
  TrendingDown,
  Activity,
  Lock,
  Globe,
  Database,
  Users,
  Zap,
  Target,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Cpu,
  BarChart3,
  FileWarning,
  ArrowUpRight,
  CircleDot,
  Network,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useVulnGuardStore } from '@/store/vulnguard-store';

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

const AI_STATUS = {
  status: 'Complete' as const,
  model: 'ThreatScope AI v3.2',
  lastAnalysis: '2025-06-05T14:32:00Z',
  confidence: 94,
};

const EXECUTIVE_SUMMARY = {
  posture: 'Moderate Risk',
  postureColor: '#eab308',
  summary:
    'The AI-driven analysis of your organization\'s security infrastructure reveals a moderate risk posture with several critical vulnerabilities requiring immediate attention. The threat landscape has evolved significantly in the past quarter, with advanced persistent threat (APT) groups increasingly targeting supply chain vulnerabilities and cloud infrastructure misconfigurations. Our analysis identified 23 active vulnerabilities across 156 scanned assets, with 6 classified as critical and 12 as high severity. The attack surface exposure has decreased by 14% compared to the previous quarter, primarily due to the decommissioning of legacy systems and improved network segmentation. However, the remaining critical vulnerabilities present a substantial risk of exploitation, particularly the SQL injection vectors in the authentication layer and the SSRF vulnerabilities in the microservices architecture.',
  insights: [
    'Critical SQL Injection vulnerability in the authentication API provides a direct path to database compromise with an 87% estimated exploitation success rate',
    'SSRF vulnerabilities in microservices enable cloud metadata service access, potentially leading to full cloud infrastructure compromise',
    'Cross-site scripting vectors in 3 customer-facing applications could enable session hijacking and privilege escalation attacks',
    'Network segmentation improvements have reduced lateral movement opportunities by 34% since last quarter',
    'Patch compliance has improved to 78%, but 22% of systems remain unpatched with known CVEs older than 90 days',
  ],
};

const SECURITY_POSTURE = [
  { label: 'Network Security', score: 72, color: '#f59e0b', trend: 5, trendLabel: '+5 from last month' },
  { label: 'Application Security', score: 65, color: '#f97316', trend: -3, trendLabel: '-3 from last month' },
  { label: 'Data Protection', score: 85, color: '#10b981', trend: 8, trendLabel: '+8 from last month' },
  { label: 'Access Control', score: 78, color: '#06b6d4', trend: 2, trendLabel: '+2 from last month' },
];

const RISK_MATRIX = [
  { category: 'Data Breach', critical: 3, high: 5, medium: 2, low: 1 },
  { category: 'Service Disruption', critical: 1, high: 4, medium: 6, low: 3 },
  { category: 'Compliance Violation', critical: 2, high: 3, medium: 5, low: 4 },
  { category: 'Reputation Damage', critical: 1, high: 2, medium: 4, low: 2 },
];

const ATTACK_PATHS = [
  {
    id: 1,
    label: 'Attack Chain Alpha',
    severity: 'Critical' as const,
    successRate: 87,
    color: '#ef4444',
    steps: ['SQL Injection', 'DB Compromise', 'Credential Harvest', 'Lateral Movement'],
  },
  {
    id: 2,
    label: 'Attack Chain Beta',
    severity: 'High' as const,
    successRate: 64,
    color: '#f97316',
    steps: ['SSRF', 'Internal Access', 'Metadata Service', 'Cloud Compromise'],
  },
  {
    id: 3,
    label: 'Attack Chain Gamma',
    severity: 'Medium' as const,
    successRate: 41,
    color: '#eab308',
    steps: ['XSS', 'Session Hijack', 'Privilege Escalation', 'Data Exfiltration'],
  },
];

const REMEDIATION_PRIORITIES = {
  immediate: [
    { id: 1, title: 'Patch SQL Injection in Authentication API', impact: 9.2, effort: '4 hours', riskReduction: 15 },
    { id: 2, title: 'Remediate SSRF in Microservices Metadata Endpoints', impact: 8.7, effort: '8 hours', riskReduction: 12 },
    { id: 3, title: 'Deploy Virtual Patches for Internet-Facing XSS Vectors', impact: 7.8, effort: '6 hours', riskReduction: 10 },
  ],
  shortTerm: [
    { id: 4, title: 'Implement CSP Headers Across All Web Applications', impact: 7.1, effort: '2 weeks', riskReduction: 8 },
    { id: 5, title: 'Upgrade TLS Configuration to 1.3-Only', impact: 6.5, effort: '1 week', riskReduction: 7 },
    { id: 6, title: 'Close Unnecessary Open Ports on DMZ Servers', impact: 6.8, effort: '3 days', riskReduction: 9 },
    { id: 7, title: 'Implement Rate Limiting on Authentication Endpoints', impact: 5.9, effort: '1 week', riskReduction: 6 },
  ],
  longTerm: [
    { id: 8, title: 'Deploy Zero Trust Network Architecture', impact: 8.5, effort: '3 months', riskReduction: 25 },
    { id: 9, title: 'Implement Automated Patch Management System', impact: 7.2, effort: '2 months', riskReduction: 18 },
    { id: 10, title: 'Establish Continuous Security Monitoring Pipeline', impact: 6.8, effort: '2 months', riskReduction: 15 },
  ],
};

const AI_RECOMMENDATIONS = [
  {
    id: 1,
    priority: 1,
    title: 'Immediate Authentication Layer Hardening',
    description:
      'The authentication layer contains multiple critical injection vulnerabilities that form the highest-risk attack chain identified. Implement parameterized queries across all database interactions in the auth service, deploy input validation middleware, and enable Web Application Firewall (WAF) rules specifically targeting SQL injection patterns. Additionally, implement account lockout mechanisms after failed attempts and migrate to bcrypt/argon2 password hashing if not already in place.',
    impact: 'Critical — Eliminates the primary attack vector with 87% exploitation probability',
    complexity: 'Medium' as const,
  },
  {
    id: 2,
    priority: 2,
    title: 'Microservices Network Policy Enforcement',
    description:
      'Deploy strict network policies between microservices to prevent Server-Side Request Forgery propagation. Implement allow-list based outbound request filtering, block access to cloud metadata endpoints (169.254.169.254), and enforce mutual TLS between all internal services. Consider adopting a service mesh like Istio for granular traffic control and observability.',
    impact: 'High — Reduces cloud compromise risk by an estimated 72%',
    complexity: 'Hard' as const,
  },
  {
    id: 3,
    priority: 3,
    title: 'Content Security Policy Deployment',
    description:
      'Deploy comprehensive Content Security Policy headers across all customer-facing applications to mitigate cross-site scripting attacks. Start with report-only mode to identify legitimate resource requirements, then transition to enforcement mode. Include strict directives for script-src, object-src, and frame-ancestors. Implement nonce-based CSP for dynamic content requirements.',
    impact: 'Medium — Reduces XSS-based session hijack risk by approximately 65%',
    complexity: 'Easy' as const,
  },
  {
    id: 4,
    priority: 4,
    title: 'Credential Rotation and Secrets Management',
    description:
      'Implement automated credential rotation using a centralized secrets management solution such as HashiCorp Vault or AWS Secrets Manager. All service accounts, API keys, and database credentials should rotate on a 90-day maximum cycle. Deploy just-in-time access provisioning for privileged operations and implement credential scanning in CI/CD pipelines to prevent accidental exposure.',
    impact: 'High — Limits blast radius of any successful credential harvest by 80%',
    complexity: 'Medium' as const,
  },
  {
    id: 5,
    priority: 5,
    title: 'Continuous Attack Surface Monitoring',
    description:
      'Deploy automated attack surface management tools to continuously discover and inventory external-facing assets. Integrate with threat intelligence feeds for proactive vulnerability identification. Implement automated alerting for newly exposed services, certificate expiration, and DNS record changes. Establish a weekly attack surface review process with the security operations team.',
    impact: 'Medium — Reduces mean time to detection of new exposures by 60%',
    complexity: 'Easy' as const,
  },
];

const THREAT_PREDICTION_DATA = [
  { day: 'Day 0', current: 72, withoutRemediation: 72, withRemediation: 72 },
  { day: 'Day 15', current: 70, withoutRemediation: 78, withRemediation: 65 },
  { day: 'Day 30', current: 68, withoutRemediation: 85, withRemediation: 55 },
  { day: 'Day 45', current: 66, withoutRemediation: 91, withRemediation: 45 },
  { day: 'Day 60', current: 64, withoutRemediation: 96, withRemediation: 38 },
  { day: 'Day 75', current: 62, withoutRemediation: 98, withRemediation: 32 },
  { day: 'Day 90', current: 60, withoutRemediation: 100, withRemediation: 25 },
];

const PREDICTION_STATS = [
  { label: 'Breach Probability (90d)', value: '34%', trend: 'down', color: '#10b981' },
  { label: 'Est. Time to Compromise', value: '18 days', trend: 'up', color: '#f97316' },
  { label: 'Risk Reduction Potential', value: '75%', trend: 'down', color: '#06b6d4' },
  { label: 'Mean Time to Detect', value: '4.2 hours', trend: 'down', color: '#10b981' },
];

// ─── Circular Progress Component ────────────────────────────────────
function CircularProgress({ value, size = 80, strokeWidth = 6, color }: { value: number; size?: number; strokeWidth?: number; color: string }) {
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

// ─── Custom Tooltip for Threat Prediction Chart ─────────────────────
function PredictionTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-cyan-500/20 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-xs font-medium text-slate-400 mb-2">{label}</p>
        {payload.map((entry, idx: number) => (
          <div key={idx} className="flex items-center gap-2 mb-1 last:mb-0">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}%</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

// ─── Severity Badge ─────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: 'Critical' | 'High' | 'Medium' | 'Low' }) {
  const styles: Record<string, string> = {
    Critical: 'bg-red-500/10 text-red-400 border-red-500/30',
    High: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[severity]}`}>
      {severity.toUpperCase()}
    </span>
  );
}

// ─── Complexity Badge ───────────────────────────────────────────────
function ComplexityBadge({ complexity }: { complexity: 'Easy' | 'Medium' | 'Hard' }) {
  const styles: Record<string, string> = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    Hard: 'bg-red-500/10 text-red-400 border-red-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[complexity]}`}>
      {complexity}
    </span>
  );
}

// ─── Cyber Corner Accents ───────────────────────────────────────────
function CyberCorners({ color = 'cyan' }: { color?: string }) {
  const borderColor = color === 'emerald' ? 'border-emerald-500/30' : 'border-cyan-500/30';
  return (
    <>
      <div className={`absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 ${borderColor}`} />
      <div className={`absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 ${borderColor}`} />
    </>
  );
}

// ─── Posture Card Component (extracted to avoid hooks-in-callback) ──
function PostureCard({ item, delay }: { item: typeof SECURITY_POSTURE[number]; delay: number }) {
  const animatedScore = useCountUp(item.score, 1800);
  const isPositive = item.trend > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative glass-card-float rounded-xl p-6 cursor-default ${item.score < 70 ? 'breathe-glow' : ''}`}
    >
      <CyberCorners color={item.score >= 80 ? 'emerald' : 'cyan'} />
      <div className="absolute inset-0 beam-sweep rounded-xl pointer-events-none z-0" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.label}</h4>
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(item.trend)}%
          </div>
        </div>
        <div className="flex items-center justify-center mb-3">
          <div className="relative">
            <CircularProgress value={item.score} size={80} strokeWidth={6} color={item.color} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-slate-100">{animatedScore}</span>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 text-center">{item.trendLabel}</p>
      </div>
    </motion.div>
  );
}

// ─── Main AI Analysis Page ──────────────────────────────────────────
export function AIAnalysisPage() {
  const { addNotification } = useVulnGuardStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(true);
  const [expandedRecommendation, setExpandedRecommendation] = useState<number | null>(null);
  const confidenceCount = useCountUp(AI_STATUS.confidence, 1800);

  const handleGenerateAnalysis = useCallback(() => {
    setIsGenerating(true);
    setAnalysisComplete(false);
    setTimeout(() => {
      setIsGenerating(false);
      setAnalysisComplete(true);
      addNotification({
        id: `notif-ai-${Date.now()}`,
        type: 'scan_complete',
        title: 'AI Analysis Complete',
        message: 'Executive AI analysis has been generated successfully with 94% confidence score',
        timestamp: new Date().toISOString(),
        read: false,
      });
    }, 2000);
  }, [addNotification]);

  const statusColor = analysisComplete ? '#10b981' : isGenerating ? '#f59e0b' : '#64748b';
  const statusLabel = isGenerating ? 'Analyzing...' : analysisComplete ? 'Complete' : 'Ready';

  return (
    <div className="space-y-6 mesh-gradient-bg relative">
      {/* Ambient orbs for atmospheric depth */}
      <div className="ambient-orb" style={{ width: 500, height: 500, top: '10%', right: '-5%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', animationDelay: '0s' }} />
      <div className="ambient-orb" style={{ width: 550, height: 550, bottom: '5%', left: '-8%', background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)', animationDelay: '5s' }} />
      {/* ─── 1. Header Section ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center neon-glow-blue"
            >
              <Brain className="w-5 h-5 text-cyan-400" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold threatscope-ai-title inline-block">AI Executive Analysis</h2>
              <motion.div
                className="h-0.5 bg-gradient-to-r from-cyan-500/60 via-emerald-500/60 to-transparent rounded-full mt-1"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
            </div>
          </div>
          <motion.button
            type="button"
            onClick={handleGenerateAnalysis}
            disabled={isGenerating}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-semibold hover:from-cyan-500/30 hover:to-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            style={{ boxShadow: '0 0 15px rgba(6,182,212,0.15)' }}
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Analysis'}
          </motion.button>
        </div>
        <p className="text-sm text-slate-400 ml-[52px]">
          AI-powered security analysis, risk assessment, and remediation recommendations for executive decision-making
        </p>
      </motion.div>

      {/* ─── 2. AI Status Bar ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative glass-card-float ai-panel-float rounded-xl p-4"
      >
        <CyberCorners />
        <div className="relative z-10 flex flex-wrap items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: statusColor, boxShadow: `0 0 10px ${statusColor}60` }}
            />
            <span className="text-xs text-slate-400">Status:</span>
            <span className="text-xs font-semibold" style={{ color: statusColor }}>
              {statusLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-400">Model:</span>
            <span className="text-xs font-semibold text-slate-200">{AI_STATUS.model}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-400">Last Analysis:</span>
            <span className="text-xs font-semibold text-slate-200">
              {new Date(AI_STATUS.lastAnalysis).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-400">Confidence:</span>
            <span className="text-xs font-bold text-emerald-400">{confidenceCount}%</span>
          </div>
        </div>
      </motion.div>

      {/* ─── 3. Executive Summary Card ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative glass-card-float ai-panel-float analytics-panel-elevated rounded-xl p-6 breathe-glow scan-line-vertical"
      >
        <CyberCorners />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 glass-inner-light">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-medium text-slate-300">AI Executive Summary</h3>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold border"
                style={{
                  backgroundColor: `${EXECUTIVE_SUMMARY.postureColor}15`,
                  color: EXECUTIVE_SUMMARY.postureColor,
                  borderColor: `${EXECUTIVE_SUMMARY.postureColor}30`,
                }}
              >
                {EXECUTIVE_SUMMARY.posture}
              </span>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Regenerate
              </motion.button>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-5">
            {EXECUTIVE_SUMMARY.summary}
          </p>
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Insights</h4>
            {EXECUTIVE_SUMMARY.insights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/50"
              >
                <CircleDot className="w-3.5 h-3.5 mt-0.5 shrink-0 text-cyan-500" />
                <p className="text-xs text-slate-300 leading-relaxed">{insight}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── 4. Security Posture Evaluation ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger-3d">
        {SECURITY_POSTURE.map((item, i) => (
          <PostureCard key={item.label} item={item} delay={0.2 + i * 0.08} />
        ))}
      </div>

      {/* ─── 5. Risk Assessment Matrix ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="relative glass-card-float analytics-panel-elevated rounded-xl p-6"
      >
        <CyberCorners />
        <div className="absolute inset-0 scan-line-vertical rounded-xl pointer-events-none z-0" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5 glass-inner-light">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-medium text-slate-300">Risk Assessment Matrix</h3>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
              Vulnerability Count by Risk Level
            </span>
          </div>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">Category</th>
                  <th className="text-center text-xs font-medium text-red-400 uppercase tracking-wider pb-3 px-3">Critical</th>
                  <th className="text-center text-xs font-medium text-orange-400 uppercase tracking-wider pb-3 px-3">High</th>
                  <th className="text-center text-xs font-medium text-yellow-400 uppercase tracking-wider pb-3 px-3">Medium</th>
                  <th className="text-center text-xs font-medium text-emerald-400 uppercase tracking-wider pb-3 px-3">Low</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {RISK_MATRIX.map((row, i) => (
                  <motion.tr
                    key={row.category}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-sm text-slate-300">{row.category}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="alert-card-critical inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-sm font-bold text-red-400">
                        {row.critical}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="alert-card-high inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-sm font-bold text-orange-400">
                        {row.high}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="alert-card-medium inline-flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm font-bold text-yellow-400">
                        {row.medium}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="alert-card-low inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm font-bold text-emerald-400">
                        {row.low}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {RISK_MATRIX.map((row, i) => (
              <motion.div
                key={row.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/50"
              >
                <p className="text-sm font-medium text-slate-300 mb-2">{row.category}</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex flex-col items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-sm font-bold text-red-400">
                      {row.critical}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-1">Critical</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-sm font-bold text-orange-400">
                      {row.high}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-1">High</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm font-bold text-yellow-400">
                      {row.medium}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-1">Medium</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm font-bold text-emerald-400">
                      {row.low}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-1">Low</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── 6. Attack Path Analysis ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="relative glass-card-float analytics-panel-elevated rounded-xl p-6"
      >
        <CyberCorners color="emerald" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5 glass-inner-light">
            <Network className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-medium text-slate-300">Attack Path Analysis</h3>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">
              3 ACTIVE CHAINS
            </span>
          </div>
          <div className="space-y-4">
            {ATTACK_PATHS.map((chain, i) => (
              <motion.div
                key={chain.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={chain.severity} />
                    <span className="text-sm font-semibold text-slate-200">{chain.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">Success Rate:</span>
                    <span className="text-sm font-bold" style={{ color: chain.color }}>
                      {chain.successRate}%
                    </span>
                  </div>
                </div>
                {/* Attack chain visualization */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  {chain.steps.map((step, stepIdx) => (
                    <React.Fragment key={stepIdx}>
                      <div
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border shrink-0"
                        style={{
                          backgroundColor: `${chain.color}10`,
                          borderColor: `${chain.color}25`,
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: chain.color }}
                        />
                        <span className="text-xs font-medium whitespace-nowrap" style={{ color: `${chain.color}` }}>
                          {step}
                        </span>
                      </div>
                      {stepIdx < chain.steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                {/* Progress bar showing success rate */}
                <div className="mt-3">
                  <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: chain.color, boxShadow: `0 0 8px ${chain.color}40` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${chain.successRate}%` }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── 7. Remediation Priorities ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="relative glass-card-float analytics-panel-elevated rounded-xl p-6"
      >
        <CyberCorners />
        <div className="absolute inset-0 beam-sweep rounded-xl pointer-events-none z-0" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5 glass-inner-light">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-medium text-slate-300">Remediation Priorities</h3>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              10 ITEMS
            </span>
          </div>

          {/* Immediate (0-7 days) */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
              <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider">Immediate (0–7 days)</h4>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                {REMEDIATION_PRIORITIES.immediate.length} CRITICAL
              </span>
            </div>
            <div className="space-y-2">
              {REMEDIATION_PRIORITIES.immediate.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-lg border border-red-500/10 bg-red-500/5 hover:border-red-500/20 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center shrink-0 text-xs font-bold text-red-400">
                    {item.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 mb-1.5">{item.title}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3 text-red-400" />
                        <span className="text-[10px] text-red-400">Impact: {item.impact}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] text-slate-500">{item.effort}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">-{item.riskReduction}% risk</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Short-term (1-4 weeks) */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
              <h4 className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Short-term (1–4 weeks)</h4>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {REMEDIATION_PRIORITIES.shortTerm.length} HIGH
              </span>
            </div>
            <div className="space-y-2">
              {REMEDIATION_PRIORITIES.shortTerm.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.75 + i * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-lg border border-orange-500/10 bg-orange-500/5 hover:border-orange-500/20 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/20 flex items-center justify-center shrink-0 text-xs font-bold text-orange-400">
                    {item.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 mb-1.5">{item.title}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3 text-orange-400" />
                        <span className="text-[10px] text-orange-400">Impact: {item.impact}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] text-slate-500">{item.effort}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">-{item.riskReduction}% risk</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Long-term (1-3 months) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileWarning className="w-3.5 h-3.5 text-yellow-400" />
              <h4 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Long-term (1–3 months)</h4>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                {REMEDIATION_PRIORITIES.longTerm.length} MEDIUM
              </span>
            </div>
            <div className="space-y-2">
              {REMEDIATION_PRIORITIES.longTerm.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 + i * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-lg border border-yellow-500/10 bg-yellow-500/5 hover:border-yellow-500/20 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center shrink-0 text-xs font-bold text-yellow-400">
                    {item.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 mb-1.5">{item.title}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3 text-yellow-400" />
                        <span className="text-[10px] text-yellow-400">Impact: {item.impact}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] text-slate-500">{item.effort}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">-{item.riskReduction}% risk</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── 8. AI-Generated Recommendations ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        className="relative glass-card-float analytics-panel-elevated rounded-xl p-6"
      >
        <CyberCorners color="emerald" />
        <div className="absolute inset-0 scan-line-vertical rounded-xl pointer-events-none z-0" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5 glass-inner-light">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-medium text-slate-300">AI-Generated Recommendations</h3>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              5 RECOMMENDATIONS
            </span>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}>
            {AI_RECOMMENDATIONS.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.08 }}
                className="rounded-xl border border-slate-800/50 bg-slate-900/30 hover:border-slate-700/50 transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedRecommendation(expandedRecommendation === rec.id ? null : rec.id)}
                  className="w-full text-left p-4 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/15 to-emerald-500/15 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-cyan-400">{rec.priority}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-200">{rec.title}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <ComplexityBadge complexity={rec.complexity} />
                      <span className="text-[10px] text-slate-500">
                        <ChevronRight className={`w-3 h-3 inline-block transition-transform ${expandedRecommendation === rec.id ? 'rotate-90' : ''}`} />
                        View Details
                      </span>
                    </div>
                  </div>
                </button>
                <AnimatePresence>
                  {expandedRecommendation === rec.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 ml-11 border-t border-slate-800/50">
                        <p className="text-xs text-slate-300 leading-relaxed mt-3 mb-3">
                          {rec.description}
                        </p>
                        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/30">
                          <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />
                          <div>
                            <p className="text-[10px] font-semibold text-amber-400 mb-0.5">Impact Assessment</p>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{rec.impact}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── 9. Threat Prediction ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        className="relative glass-card-float analytics-panel-elevated rounded-xl p-6 breathe-glow"
      >
        <CyberCorners />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 glass-inner-light">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-medium text-slate-300">Threat Prediction (90-Day Forecast)</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Predicted risk trajectory based on current vulnerability landscape, threat intelligence feeds, and remediation scenarios
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={THREAT_PREDICTION_DATA}>
              <defs>
                <linearGradient id="currentRiskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="withoutRemediationGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#1e293b' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#1e293b' }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip content={<PredictionTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px' }}
                iconType="circle"
                iconSize={8}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }}
                name="Current Trajectory"
                style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.4))' }}
              />
              <Line
                type="monotone"
                dataKey="withoutRemediation"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={{ fill: '#ef4444', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#ef4444', stroke: '#0f172a', strokeWidth: 2 }}
                name="Without Remediation"
              />
              <Line
                type="monotone"
                dataKey="withRemediation"
                stroke="#06b6d4"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#06b6d4', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#06b6d4', stroke: '#0f172a', strokeWidth: 2 }}
                name="With Remediation"
                style={{ filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.3))' }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Prediction Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/50">
            {PREDICTION_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.85 + i * 0.06 }}
                className="flex flex-col items-center p-3 rounded-lg bg-slate-900/40 border border-slate-800/50"
              >
                <span className="text-lg font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="text-[10px] text-slate-500 text-center mt-1">{stat.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Risk Delta Callout */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400">
                Remediation reduces 90-day risk by 75%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
