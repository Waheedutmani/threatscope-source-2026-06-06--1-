'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  AlertOctagon,
  Lock,
  Globe,
  Settings,
  Wrench,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  Target,
  Zap,
  FileWarning,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

// ─── Data Constants ───────────────────────────────────────────────────
const SECURITY_SCORE = 82;

const SCORING_FACTORS = [
  { label: 'Critical Vulnerabilities', points: -15, detail: '6 critical found', icon: AlertOctagon, color: '#ef4444', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20', textColor: 'text-red-400' },
  { label: 'High Vulnerabilities', points: -12, detail: '12 high found', icon: AlertTriangle, color: '#f97316', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20', textColor: 'text-orange-400' },
  { label: 'Open Ports', points: -8, detail: '8 unnecessary ports', icon: Globe, color: '#eab308', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20', textColor: 'text-yellow-400' },
  { label: 'SSL/TLS Configuration', points: -5, detail: 'Weak ciphers', icon: Lock, color: '#f59e0b', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20', textColor: 'text-amber-400' },
  { label: 'Missing Security Headers', points: -7, detail: '5 headers missing', icon: ShieldAlert, color: '#f97316', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20', textColor: 'text-orange-400' },
  { label: 'Misconfigurations', points: -6, detail: '4 misconfigs', icon: Settings, color: '#eab308', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20', textColor: 'text-yellow-400' },
];

const CIRCULAR_METRICS = [
  { label: 'Patch Compliance', value: 78, color: '#f59e0b' },
  { label: 'Config Compliance', value: 85, color: '#10b981' },
  { label: 'Access Control', value: 92, color: '#06b6d4' },
  { label: 'Encryption Score', value: 88, color: '#10b981' },
];

const TREND_DATA = [
  { month: 'Jan', score: 65, previous: 58 },
  { month: 'Feb', score: 68, previous: 60 },
  { month: 'Mar', score: 72, previous: 63 },
  { month: 'Apr', score: 75, previous: 66 },
  { month: 'May', score: 79, previous: 70 },
  { month: 'Jun', score: 82, previous: 74 },
];

const REMEDIATION_ITEMS = [
  { id: 1, title: 'Patch Critical SQL Injection in Login API', severity: 'critical', impact: '+8 pts', icon: AlertOctagon, description: 'CVE-2025-31337 on /api/auth/login — immediate remediation required' },
  { id: 2, title: 'Close Unnecessary Open Ports (8 ports)', severity: 'high', impact: '+5 pts', icon: Globe, description: 'Ports 21, 23, 445, 3389 and 4 others are exposed unnecessarily' },
  { id: 3, title: 'Add Missing Security Headers', severity: 'high', impact: '+4 pts', icon: ShieldAlert, description: 'CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy' },
  { id: 4, title: 'Upgrade SSL/TLS Cipher Suites', severity: 'medium', impact: '+3 pts', icon: Lock, description: 'Remove support for TLS 1.0/1.1 and weak CBC cipher suites' },
  { id: 5, title: 'Fix Server Misconfigurations', severity: 'medium', impact: '+3 pts', icon: Wrench, description: 'Directory listing enabled, verbose error messages, default credentials' },
];

// ─── Helper Functions ─────────────────────────────────────────────────
function getScoreColor(score: number): string {
  if (score >= 90) return '#22c55e';
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function getScoreGrade(score: number): { grade: string; color: string; description: string } {
  if (score >= 90) return { grade: 'A+', color: '#22c55e', description: 'Excellent security posture with minimal areas for improvement' };
  if (score >= 85) return { grade: 'A', color: '#22c55e', description: 'Strong security posture with minor improvements recommended' };
  if (score >= 80) return { grade: 'B+', color: '#10b981', description: 'Your security posture is above average but has notable areas for improvement' };
  if (score >= 75) return { grade: 'B', color: '#10b981', description: 'Good security posture with several areas requiring attention' };
  if (score >= 70) return { grade: 'B-', color: '#eab308', description: 'Adequate security posture with important areas to address' };
  if (score >= 60) return { grade: 'C', color: '#eab308', description: 'Below average security posture — multiple issues need attention' };
  if (score >= 50) return { grade: 'D', color: '#f97316', description: 'Poor security posture — significant vulnerabilities detected' };
  return { grade: 'F', color: '#ef4444', description: 'Critical security failures — immediate remediation required' };
}

function getPostureLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excellent', color: '#22c55e' };
  if (score >= 80) return { label: 'Moderate', color: '#10b981' };
  if (score >= 60) return { label: 'Fair', color: '#eab308' };
  if (score >= 40) return { label: 'Poor', color: '#f97316' };
  return { label: 'Critical', color: '#ef4444' };
}

// ─── Security Score Gauge Component ───────────────────────────────────
function SecurityScoreGauge({ score }: { score: number }) {
  const animatedScore = useCountUp(score, 2000);
  const [dashOffset, setDashOffset] = useState(0);

  const radius = 90;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const scoreColor = getScoreColor(score);

  useEffect(() => {
    const targetOffset = circumference - (score / 100) * circumference;
    const timer = setTimeout(() => setDashOffset(targetOffset), 100);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  const grade = getScoreGrade(score);
  const posture = getPostureLabel(score);
  const riskPercentage = 100 - score;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card-float breathe-glow analytics-panel-elevated rounded-xl p-8 relative scan-line-vertical flex flex-col items-center"
    >
      {/* Cyber corner accents */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />
      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 rounded-tr-xl pointer-events-none z-20 border-cyan-500/20" />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 rounded-bl-xl pointer-events-none z-20 border-cyan-500/20" />

      {/* Pulsing glow behind gauge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '10%' }}>
        <div
          className="w-48 h-48 rounded-full neon-glow-blue"
          style={{
            background: `radial-gradient(ellipse, ${scoreColor}15 0%, transparent 70%)`,
            animation: 'gaugeGlowPulse 3s ease-in-out infinite',
          }}
        />
      </div>

      <h3 className="text-sm font-medium text-slate-400 mb-4 relative z-10 uppercase tracking-wider">
        <Shield className="w-4 h-4 inline-block mr-1.5 text-cyan-400" />
        Security Score
      </h3>

      {/* Circular SVG Gauge */}
      <div className="relative z-10">
        <svg width="220" height="220" viewBox="0 0 220 220" className="transform -rotate-90">
          <defs>
            <filter id="scoreGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={scoreColor} stopOpacity="1" />
              <stop offset="100%" stopColor={scoreColor} stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* Background track */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Score arc */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            filter="url(#scoreGlow)"
            style={{
              transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 12px ${scoreColor}80)`,
            }}
          />
          {/* Tick marks */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * 360;
            const rad = (angle * Math.PI) / 180;
            const innerR = radius - strokeWidth - 6;
            const outerR = radius - strokeWidth - 2;
            const x1 = 110 + innerR * Math.cos(rad);
            const y1 = 110 + innerR * Math.sin(rad);
            const x2 = 110 + outerR * Math.cos(rad);
            const y2 = 110 + outerR * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#334155"
                strokeWidth={1}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl font-bold"
            style={{
              color: scoreColor,
              textShadow: `0 0 20px ${scoreColor}40, 0 0 40px ${scoreColor}20`,
            }}
          >
            {animatedScore}
          </span>
          <span className="text-sm text-slate-400 mt-1">out of 100</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-6 mt-6 relative z-10">
        {/* Grade Badge */}
        <div className="flex flex-col items-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border badge-3d"
            style={{
              background: `linear-gradient(135deg, ${grade.color}20, ${grade.color}05)`,
              borderColor: `${grade.color}30`,
              color: grade.color,
              textShadow: `0 0 10px ${grade.color}40`,
            }}
          >
            {grade.grade}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Grade</span>
        </div>

        {/* Risk Percentage */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span
              className="text-2xl font-bold"
              style={{ color: getScoreColor(riskPercentage * 5) }}
            >
              {riskPercentage}%
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Risk</span>
        </div>

        {/* Security Posture */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: posture.color }}
            />
            <span className="text-sm font-semibold" style={{ color: posture.color }}>
              {posture.label}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Posture</span>
        </div>
      </div>

      <style>{`
        @keyframes gaugeGlowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </motion.div>
  );
}

// ─── Circular Progress Indicator Component ────────────────────────────
function CircularProgress({ label, value, color }: { label: string; value: number; color: string }) {
  const animatedValue = useCountUp(value, 1800);
  const radius = 38;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const targetOffset = circumference - (value / 100) * circumference;
    const timer = setTimeout(() => setOffset(targetOffset), 200);
    return () => clearTimeout(timer);
  }, [value, circumference]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="90" height="90" viewBox="0 0 90 90" className="transform -rotate-90">
          <circle
            cx="45"
            cy="45"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="45"
            cy="45"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 6px ${color}60)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color }}>
            {animatedValue}%
          </span>
        </div>
      </div>
      <span className="text-xs text-slate-400 mt-2 text-center">{label}</span>
    </div>
  );
}

// ─── Scoring Factor Row Component ─────────────────────────────────────
function ScoringFactorRow({ factor, index }: { factor: typeof SCORING_FACTORS[number]; index: number }) {
  const maxImpact = 15;
  const impactPercentage = Math.min(Math.abs(factor.points) / maxImpact * 100, 100);
  const Icon = factor.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
      className="group"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-7 h-7 rounded-lg ${factor.bgColor} border ${factor.borderColor} flex items-center justify-center shrink-0`}>
          <Icon className={`w-3.5 h-3.5 ${factor.textColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-200 truncate">{factor.label}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-500">{factor.detail}</span>
              <span className="text-sm font-bold" style={{ color: factor.color }}>
                {factor.points}
              </span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: factor.color }}
              initial={{ width: 0 }}
              animate={{ width: `${impactPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Security Grade Badge Component ───────────────────────────────────
function SecurityGradeBadge({ score }: { score: number }) {
  const grade = getScoreGrade(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card-float rounded-xl p-6 relative"
    >
      {/* Cyber corner accents */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

      <h3 className="text-sm font-medium text-slate-400 mb-4 relative z-10 uppercase tracking-wider">
        <Target className="w-4 h-4 inline-block mr-1.5 text-cyan-400" />
        Security Grade
      </h3>

      <div className="flex flex-col items-center relative z-10">
        {/* Grade Display */}
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center mb-4 border relative overflow-hidden badge-3d"
          style={{
            background: `linear-gradient(135deg, ${grade.color}25, ${grade.color}05, transparent)`,
            borderColor: `${grade.color}40`,
            boxShadow: `0 0 30px ${grade.color}15, inset 0 0 20px ${grade.color}05`,
          }}
        >
          {/* Animated background shimmer */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `linear-gradient(135deg, transparent 0%, ${grade.color}15 50%, transparent 100%)`,
              backgroundSize: '200% 200%',
              animation: 'holo-shimmer 3s ease-in-out infinite',
            }}
          />
          <span
            className="text-4xl font-bold relative z-10"
            style={{
              color: grade.color,
              textShadow: `0 0 20px ${grade.color}50, 0 0 40px ${grade.color}20`,
            }}
          >
            {grade.grade}
          </span>
        </div>

        {/* Score to next grade */}
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-2">
            {score < 90 ? `${90 - score} points to next grade (A+)` : 'Maximum grade achieved'}
          </p>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min((score / 100) * 100, 100)}%`,
                backgroundColor: grade.color,
                boxShadow: `0 0 8px ${grade.color}60`,
              }}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 text-center mt-4 leading-relaxed">
          {grade.description}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Custom Tooltip for Trend Chart ───────────────────────────────────
function CustomTrendTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
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
            <span className="text-xs text-emerald-400">
              +{payload[0].value - payload[1].value} improvement
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

// ─── Remediation Priority Item ────────────────────────────────────────
function RemediationItem({ item, index }: { item: typeof REMEDIATION_ITEMS[number]; index: number }) {
  const Icon = item.icon;
  const severityStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400' },
    high: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-400' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', dot: 'bg-yellow-400' },
    low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  };
  const styles = severityStyles[item.severity] || severityStyles.medium;

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
      className={`group flex items-start gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 ${
        item.severity === 'critical' ? 'threat-pulse-critical' : item.severity === 'high' ? 'threat-pulse-high' : ''
      }`}
    >
      {/* Rank */}
      <div className="w-6 h-6 rounded-md bg-slate-700/50 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-xs font-bold text-slate-300">{index + 1}</span>
      </div>

      {/* Icon */}
      <div className={`w-8 h-8 rounded-lg ${styles.bg} border ${styles.border} flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 ${styles.text}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-slate-200 truncate">{item.title}</p>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${styles.bg} ${styles.text} ${styles.border} badge-3d`}>
            {item.severity.toUpperCase()}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
      </div>

      {/* Impact Badge */}
      <div className="flex items-center gap-1 shrink-0 mt-1">
        <ArrowUpRight className="w-3 h-3 text-emerald-400" />
        <span className="text-xs font-bold text-emerald-400">{item.impact}</span>
      </div>
    </motion.div>
  );
}

// ─── Main Security Score Page ─────────────────────────────────────────
export function SecurityScorePage() {
  const totalDeduction = SCORING_FACTORS.reduce((sum, f) => sum + Math.abs(f.points), 0);

  return (
    <div className="space-y-6 relative mesh-gradient-bg">
      {/* Ambient orbs for atmospheric depth */}
      <div className="ambient-orb w-[500px] h-[500px] top-[-10%] left-[-5%] opacity-30" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="ambient-orb w-[600px] h-[600px] bottom-[-15%] right-[-8%] opacity-25" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(90px)' }} />
      <div className="ambient-orb w-[400px] h-[400px] top-[40%] left-[50%] opacity-20" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      {/* ─── Header ────────────────────────────────────────────────── */}
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
            className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold threatscope-ai-title inline-block">Security Score</h2>
            <motion.div
              className="h-0.5 bg-gradient-to-r from-emerald-500/60 via-cyan-500/60 to-transparent rounded-full mt-1"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
          </div>
        </div>
        <p className="text-sm text-slate-400">
          Comprehensive security posture assessment based on vulnerability analysis, compliance checks, and configuration audits
        </p>
      </motion.div>

      {/* ─── Row 1: Security Score Gauge + Scoring Factors ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 stagger-3d">
        {/* Security Score Gauge — Hero */}
        <div className="lg:col-span-2">
          <SecurityScoreGauge score={SECURITY_SCORE} />
        </div>

        {/* Scoring Factors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-3 glass-card-float rounded-xl p-6 relative"
        >
          {/* Cyber corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                <FileWarning className="w-4 h-4 inline-block mr-1.5 text-amber-400" />
                Scoring Factors
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Total Deduction:</span>
                <span className="text-sm font-bold text-red-400">-{totalDeduction} pts</span>
              </div>
            </div>

            {/* Score calculation summary */}
            <div className="flex items-center gap-3 mb-5 p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-slate-300">Base Score:</span>
                <span className="text-sm font-bold text-emerald-400">100</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-slate-300">Deductions:</span>
                <span className="text-sm font-bold text-red-400">-{totalDeduction}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-slate-300">Final:</span>
                <span className="text-sm font-bold text-emerald-400">{SECURITY_SCORE}</span>
              </div>
            </div>

            <div className="space-y-3">
              {SCORING_FACTORS.map((factor, i) => (
                <ScoringFactorRow key={factor.label} factor={factor} index={i} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Row 2: Circular Progress Indicators ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card-float analytics-panel-elevated rounded-xl p-6 relative"
      >
        {/* Cyber corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

        <h3 className="text-sm font-medium text-slate-400 mb-6 relative z-10 uppercase tracking-wider">
          <Zap className="w-4 h-4 inline-block mr-1.5 text-cyan-400" />
          Compliance Metrics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10 stagger-3d">
          {CIRCULAR_METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              className="flex flex-col items-center"
            >
              <CircularProgress label={metric.label} value={metric.value} color={metric.color} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Row 3: Trend Chart + Security Grade ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 stagger-3d">
        {/* Trend Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 glass-card-float analytics-panel-elevated rounded-xl p-6 relative scan-line-vertical"
        >
          {/* Cyber corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 inline-block mr-1.5 text-emerald-400" />
              Score Evolution
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-emerald-400 inline-block" />
                <span className="text-xs text-slate-500">Current Scan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-slate-500 inline-block" style={{ borderStyle: 'dashed' }} />
                <span className="text-xs text-slate-500">Previous Scan</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260} className="relative z-10">
            <LineChart data={TREND_DATA}>
              <defs>
                <linearGradient id="currentScoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
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
              <Tooltip content={<CustomTrendTooltip />} />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#475569"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={{ fill: '#475569', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#475569', stroke: '#1e293b', strokeWidth: 2 }}
                name="Previous Scan"
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#10b981', stroke: '#1e293b', strokeWidth: 2 }}
                name="Current Scan"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))',
                }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Improvement Callout */}
          <div className="flex items-center justify-center gap-2 mt-3 relative z-10">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">
                +17 points improvement over 6 months
              </span>
            </div>
          </div>
        </motion.div>

        {/* Security Grade Badge */}
        <SecurityGradeBadge score={SECURITY_SCORE} />
      </div>

      {/* ─── Row 4: Remediation Priority List ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass-card-float rounded-xl p-6 relative"
      >
        {/* Cyber corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

        {/* Beam sweep effect */}
        <div className="absolute inset-0 beam-sweep rounded-xl pointer-events-none z-0" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 inline-block mr-1.5 text-red-400" />
              Remediation Priority
            </h3>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs text-emerald-400 font-medium">Potential +23 pts</span>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}>
            {REMEDIATION_ITEMS.map((item, i) => (
              <RemediationItem key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
