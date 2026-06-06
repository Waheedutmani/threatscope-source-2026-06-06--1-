'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Bug,
  AlertOctagon,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Zap,
  FileSearch,
  Globe,
  BrainCircuit,
  Shield,
  Terminal,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { useVulnGuardStore } from '@/store/vulnguard-store';

// ─── Dynamic 3D Component Imports (SSR disabled) ─────────────────────
const CyberGlobe = dynamic(
  () => import('@/components/vulnguard/3d/cyber-globe').then((mod) => mod.CyberGlobe),
  { ssr: false }
);

const ParticleField = dynamic(
  () => import('@/components/vulnguard/3d/particle-field').then((mod) => mod.ParticleField),
  { ssr: false }
);

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

// ─── Typing Animation Hook ────────────────────────────────────────────
type TypingState = {
  displayText: string;
  textIndex: number;
  charIndex: number;
  isDeleting: boolean;
};

type TypingAction =
  | { type: 'TYPE_CHAR'; text: string; charIndex: number }
  | { type: 'DELETE_CHAR'; text: string; charIndex: number }
  | { type: 'START_DELETING' }
  | { type: 'NEXT_TEXT'; textIndex: number };

function typingReducer(state: TypingState, action: TypingAction): TypingState {
  switch (action.type) {
    case 'TYPE_CHAR':
      return { ...state, displayText: action.text.slice(0, action.charIndex + 1), charIndex: action.charIndex + 1 };
    case 'DELETE_CHAR':
      return { ...state, displayText: action.text.slice(0, action.charIndex - 1), charIndex: action.charIndex - 1 };
    case 'START_DELETING':
      return { ...state, isDeleting: true };
    case 'NEXT_TEXT':
      return { ...state, isDeleting: false, textIndex: action.textIndex, charIndex: 0 };
    default:
      return state;
  }
}

function useTypingEffect(texts: string[], typingSpeed = 50, pauseDuration = 2000) {
  const [state, dispatch] = React.useReducer(typingReducer, {
    displayText: '',
    textIndex: 0,
    charIndex: 0,
    isDeleting: false,
  });

  useEffect(() => {
    const currentText = texts[state.textIndex];

    if (!state.isDeleting && state.charIndex < currentText.length) {
      const timer = setTimeout(() => {
        dispatch({ type: 'TYPE_CHAR', text: currentText, charIndex: state.charIndex });
      }, typingSpeed);
      return () => clearTimeout(timer);
    }

    if (!state.isDeleting && state.charIndex === currentText.length) {
      const timer = setTimeout(() => {
        dispatch({ type: 'START_DELETING' });
      }, pauseDuration);
      return () => clearTimeout(timer);
    }

    if (state.isDeleting && state.charIndex > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'DELETE_CHAR', text: currentText, charIndex: state.charIndex });
      }, typingSpeed / 2);
      return () => clearTimeout(timer);
    }

    if (state.isDeleting && state.charIndex === 0) {
      const nextIndex = (state.textIndex + 1) % texts.length;
      dispatch({ type: 'NEXT_TEXT', textIndex: nextIndex });
    }
  }, [state.charIndex, state.isDeleting, state.textIndex, texts, typingSpeed, pauseDuration]);

  return state.displayText;
}

// ─── Color Map ────────────────────────────────────────────────────────
const colorMap: Record<string, { bg: string; text: string; glow: string; border: string; shadow: string; hoverBorder: string; gradientFrom: string; gradientTo: string }> = {
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
    border: 'border-cyan-500/20',
    shadow: '0 0 20px rgba(6,182,212,0.15)',
    hoverBorder: 'hover:border-cyan-500/40',
    gradientFrom: 'from-cyan-500/20',
    gradientTo: 'to-cyan-500/5',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    border: 'border-amber-500/20',
    shadow: '0 0 20px rgba(245,158,11,0.15)',
    hoverBorder: 'hover:border-amber-500/40',
    gradientFrom: 'from-amber-500/20',
    gradientTo: 'to-amber-500/5',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]',
    border: 'border-red-500/20',
    shadow: '0 0 20px rgba(239,68,68,0.15)',
    hoverBorder: 'hover:border-red-500/40',
    gradientFrom: 'from-red-500/20',
    gradientTo: 'to-red-500/5',
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]',
    border: 'border-orange-500/20',
    shadow: '0 0 20px rgba(249,115,22,0.15)',
    hoverBorder: 'hover:border-orange-500/40',
    gradientFrom: 'from-orange-500/20',
    gradientTo: 'to-orange-500/5',
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]',
    border: 'border-yellow-500/20',
    shadow: '0 0 20px rgba(234,179,8,0.15)',
    hoverBorder: 'hover:border-yellow-500/40',
    gradientFrom: 'from-yellow-500/20',
    gradientTo: 'to-yellow-500/5',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    border: 'border-emerald-500/20',
    shadow: '0 0 20px rgba(16,185,129,0.15)',
    hoverBorder: 'hover:border-emerald-500/40',
    gradientFrom: 'from-emerald-500/20',
    gradientTo: 'to-emerald-500/5',
  },
};

// ─── Mini Sparkline Data Generator ────────────────────────────────────
function generateSparkline(base: number, variance: number, points: number = 10) {
  const data = [];
  let current = base;
  for (let i = 0; i < points; i++) {
    current = current + (Math.random() - 0.5) * variance;
    data.push({ v: Math.max(0, Math.round(current)) });
  }
  return data;
}

const sparklineDataMap: Record<string, Array<{ v: number }>> = {
  'Total Scans': generateSparkline(120, 20),
  'Vulnerabilities Found': generateSparkline(30, 8),
  'Critical': generateSparkline(5, 3),
  'High Risk': generateSparkline(12, 4),
  'Medium Risk': generateSparkline(20, 5),
  'Low Risk': generateSparkline(18, 6),
};

// ─── KPI Card Component ───────────────────────────────────────────────
interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  trend: number;
  color: string;
  delay: number;
}

function KpiCard({ icon: Icon, label, value, trend, color, delay }: KpiCardProps) {
  const animatedValue = useCountUp(value, 1800);
  const colors = colorMap[color] || colorMap.cyan;
  const isPositive = trend > 0;
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const sparkData = sparklineDataMap[label] || generateSparkline(value / 10, 3);

  const isCritical = color === 'red' || color === 'orange';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = ((centerY - y) / centerY) * 8;
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

  const sparkColor = color === 'red' ? '#ef4444' : color === 'orange' ? '#f97316' : color === 'amber' ? '#f59e0b' : color === 'yellow' ? '#eab308' : color === 'emerald' ? '#10b981' : '#06b6d4';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative glass-card-float rounded-xl p-5 cursor-default ${
        isCritical ? 'breathe-glow' : ''
      }`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transform: isHovered
          ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
          : 'rotateX(0deg) rotateY(0deg) scale(1)',
        boxShadow: isHovered
          ? `${colors.shadow}, 0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(59,130,246,0.08), 0 0 60px rgba(139,92,246,0.04)`
          : undefined,
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
        borderColor: isCritical && isHovered ? undefined : undefined,
      }}
    >
      {/* Animated gradient border for critical cards */}
      {isCritical && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              padding: '1px',
              background: `conic-gradient(from var(--gradient-angle, 0deg), ${color === 'red' ? 'rgba(239,68,68,0.5), rgba(249,115,22,0.5)' : 'rgba(249,115,22,0.5), rgba(234,179,8,0.5)'}, transparent, ${color === 'red' ? 'rgba(239,68,68,0.5)' : 'rgba(249,115,22,0.5)'})`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              animation: 'gradient-border-rotate 4s linear infinite',
            }}
          />
        </div>
      )}

      {/* Shine/glare overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: isHovered
            ? `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`
            : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Cyber corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg pointer-events-none z-20" style={{ borderColor: `${sparkColor}30` }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-lg pointer-events-none z-20" style={{ borderColor: `${sparkColor}30` }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}
            style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)', transition: 'transform 0.15s ease-out' }}
          >
            <Icon className={`w-5 h-5 ${colors.text}`} />
          </div>
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              isPositive
                ? color === 'red' || color === 'orange' || color === 'amber'
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-emerald-500/10 text-emerald-400'
                : color === 'red' || color === 'orange' || color === 'amber'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-red-500/10 text-red-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-1 truncate">{label}</p>
          <p className="text-3xl font-bold text-slate-100">{animatedValue.toLocaleString()}</p>
        </div>

        {/* Mini Sparkline */}
        <div className="mt-3 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
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

// ─── Risk Score Gauge ─────────────────────────────────────────────────
function RiskScoreGauge({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 80;
  const strokeWidth = 14;
  const cx = 120;
  const cy = 110;
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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card-float breathe-glow neon-border-blue rounded-xl p-6 flex flex-col items-center relative scan-line-vertical"
    >
      {/* Cyber corner accents */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

      {/* Pulsing glow behind gauge */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ top: '20%' }}
      >
        <div
          className="w-32 h-16 rounded-full"
          style={{
            background: `radial-gradient(ellipse, ${getScoreColor(animatedScore)}15 0%, transparent 70%)`,
            animation: 'gaugeGlowPulse 3s ease-in-out infinite',
          }}
        />
      </div>

      <h3 className="text-sm font-medium text-slate-400 mb-4 relative z-10">Risk Score</h3>
      <svg width="240" height="140" className="relative z-10">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <filter id="gaugeGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={backgroundPath} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} strokeLinecap="round" />
        {animatedScore > 0 && (
          <path
            d={foregroundPath}
            fill="none"
            stroke={getScoreColor(animatedScore)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
            style={{
              filter: `drop-shadow(0 0 12px ${getScoreColor(animatedScore)}80)`,
              transition: 'all 1.5s ease-out',
            }}
          />
        )}
        <text
          x={cx}
          y={cy - 20}
          textAnchor="middle"
          className="text-4xl font-bold"
          fill="#f1f5f9"
          style={{
            fontSize: '36px',
            fontWeight: 700,
            textShadow: `0 0 20px ${getScoreColor(animatedScore)}40, 0 0 40px ${getScoreColor(animatedScore)}20`,
            transition: 'text-shadow 1.5s ease-out',
          }}
        >
          {animatedScore}
        </text>
        <text x={cx} y={cy + 5} textAnchor="middle" className="text-xs" fill="#64748b" style={{ fontSize: '12px' }}>
          out of 100
        </text>
      </svg>
      <div
        className="mt-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider relative z-10"
        style={{
          backgroundColor: `${getScoreColor(animatedScore)}15`,
          color: getScoreColor(animatedScore),
          border: `1px solid ${getScoreColor(animatedScore)}30`,
        }}
      >
        {getRiskLabel(animatedScore)}
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

// ─── Severity Badge with Pulse ────────────────────────────────────────
function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, { bg: string; text: string; border: string; pulse: string }> = {
    critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', pulse: 'threat-pulse-critical' },
    high: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', pulse: 'threat-pulse-high' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', pulse: 'threat-pulse-medium' },
    low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', pulse: '' },
    info: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', pulse: '' },
  };
  const s = styles[severity] || styles.info;
  return (
    <span className={`badge-3d ${s.bg} ${s.text} ${s.border}`}>
      {(severity === 'critical' || severity === 'high' || severity === 'medium') && (
        <span className={`w-1.5 h-1.5 rounded-full ${s.pulse}`} style={{ backgroundColor: 'currentColor' }} />
      )}
      {severity.toUpperCase()}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: 'bg-red-500/10 text-red-400 border-red-500/30',
    in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    accepted: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  };
  const labels: Record<string, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    accepted: 'Accepted',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[status] || styles.open}`}>
      {labels[status] || status}
    </span>
  );
}

// ─── Chart Data ───────────────────────────────────────────────────────
const PIE_DATA = [
  { name: 'Critical', value: 23, color: '#ef4444' },
  { name: 'High', value: 67, color: '#f97316' },
  { name: 'Medium', value: 134, color: '#eab308' },
  { name: 'Low', value: 123, color: '#22c55e' },
];

const TREND_DATA = [
  { date: 'Jun 01', critical: 2, high: 8, medium: 15, low: 12 },
  { date: 'Jun 04', critical: 3, high: 10, medium: 18, low: 14 },
  { date: 'Jun 07', critical: 1, high: 7, medium: 13, low: 10 },
  { date: 'Jun 10', critical: 4, high: 12, medium: 20, low: 16 },
  { date: 'Jun 13', critical: 2, high: 9, medium: 16, low: 11 },
  { date: 'Jun 16', critical: 5, high: 14, medium: 22, low: 18 },
  { date: 'Jun 19', critical: 3, high: 11, medium: 19, low: 15 },
  { date: 'Jun 22', critical: 4, high: 13, medium: 21, low: 17 },
  { date: 'Jun 25', critical: 2, high: 8, medium: 14, low: 13 },
  { date: 'Jun 28', critical: 3, high: 10, medium: 17, low: 14 },
];

const RECENT_VULNS = [
  { id: 'v1', name: 'SQL Injection in Login API', severity: 'critical' as const, affectedAsset: '/api/auth/login', cvssScore: 9.8, status: 'open' as const, discoveredAt: '5 min ago' },
  { id: 'v2', name: 'Cross-Site Scripting (Stored XSS)', severity: 'high' as const, affectedAsset: '/dashboard/comments', cvssScore: 7.5, status: 'in_progress' as const, discoveredAt: '22 min ago' },
  { id: 'v3', name: 'CSRF Token Missing', severity: 'high' as const, affectedAsset: '/api/settings/update', cvssScore: 6.8, status: 'open' as const, discoveredAt: '1 hr ago' },
  { id: 'v4', name: 'Insecure Direct Object Reference', severity: 'high' as const, affectedAsset: '/api/users/profile', cvssScore: 7.1, status: 'in_progress' as const, discoveredAt: '2 hrs ago' },
  { id: 'v5', name: 'Missing Security Headers', severity: 'medium' as const, affectedAsset: 'nginx-config', cvssScore: 5.3, status: 'resolved' as const, discoveredAt: '3 hrs ago' },
  { id: 'v6', name: 'Weak TLS Configuration', severity: 'medium' as const, affectedAsset: 'mail.vulnguard.io', cvssScore: 4.7, status: 'open' as const, discoveredAt: '5 hrs ago' },
  { id: 'v7', name: 'Outdated OpenSSL Version', severity: 'low' as const, affectedAsset: 'db-server-02', cvssScore: 3.2, status: 'accepted' as const, discoveredAt: '8 hrs ago' },
  { id: 'v8', name: 'Information Disclosure in Error Page', severity: 'low' as const, affectedAsset: '/debug/status', cvssScore: 2.1, status: 'resolved' as const, discoveredAt: '12 hrs ago' },
];

// ─── Custom Tooltip for Charts ────────────────────────────────────────
function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-xl border border-cyan-500/20 rounded-lg px-3 py-2 shadow-xl">
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

function CustomAreaTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }[]>; label?: string }) {
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

// ─── Quick Action Card ────────────────────────────────────────────────
interface QuickActionProps {
  icon: React.ElementType;
  label: string;
  page: 'scanner' | 'reports' | 'threat-intel' | 'analytics';
  delay: number;
}

function QuickActionCard({ icon: Icon, label, page, delay }: QuickActionProps) {
  const { setCurrentPage } = useVulnGuardStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05, rotateY: 3, rotateX: 2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => setCurrentPage(page)}
      className="animated-gradient-border float-animation cursor-pointer"
      style={{
        animationDelay: `${delay * 200}ms`,
        perspective: '800px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="glass-card-float depth-shadow-md rounded-xl p-6 group relative beam-sweep">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition-colors">
          <Icon className="w-6 h-6 text-emerald-400" />
        </div>
        <p className="text-sm font-medium text-slate-200 group-hover:text-emerald-300 transition-colors">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────
export function DashboardPage() {
  const { scans, vulnerabilities } = useVulnGuardStore();

  const totalScans = scans.length > 0 ? scans.length + 1270 : 1284;
  const totalVulns = vulnerabilities.length > 0 ? vulnerabilities.length + 320 : 347;

  const getScansCount = useCallback(() => totalScans, [totalScans]);
  const getVulnsCount = useCallback(() => totalVulns, [totalVulns]);

  const kpiCards: Array<Omit<KpiCardProps, 'delay'>> = [
    { icon: Activity, label: 'Total Scans', value: getScansCount(), trend: 12, color: 'cyan' },
    { icon: Bug, label: 'Vulnerabilities Found', value: getVulnsCount(), trend: 8, color: 'amber' },
    { icon: AlertOctagon, label: 'Critical', value: 23, trend: -5, color: 'red' },
    { icon: AlertTriangle, label: 'High Risk', value: 67, trend: 3, color: 'orange' },
    { icon: ShieldAlert, label: 'Medium Risk', value: 134, trend: -2, color: 'yellow' },
    { icon: ShieldCheck, label: 'Low Risk', value: 123, trend: -15, color: 'emerald' },
  ];

  const typingText = useTypingEffect(
    [
      'Monitoring 1,284 security scans across your infrastructure',
      '23 critical vulnerabilities require immediate attention',
      'Risk score trending downward — 12% improvement this month',
      'Threat intelligence feeds updated in real-time',
    ],
    35,
    3000
  );

  return (
    <div className="space-y-6 relative mesh-gradient-bg">
      {/* Particle Field Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-2xl">
        <ParticleField
          className="opacity-30"
          count={60}
          showHexagons={true}
          color1="#06b6d4"
          color2="#10b981"
        />
      </div>

      {/* Ambient Orbs for atmospheric depth */}
      <div className="ambient-orb w-[500px] h-[500px] top-[-10%] left-[-5%]" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', animationDelay: '0s' }} />
      <div className="ambient-orb w-[600px] h-[600px] bottom-[-15%] right-[-8%]" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', animationDelay: '-7s' }} />
      <div className="ambient-orb w-[400px] h-[400px] top-[40%] left-[50%]" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', animationDelay: '-13s' }} />

      {/* ─── Header ────────────────────────────────────────────────── */}
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
            className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"
          >
            <Shield className="w-5 h-5 text-blue-400" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold threatscope-ai-title inline-block">Security Dashboard</h2>
            <motion.div
              className="h-0.5 bg-gradient-to-r from-blue-500/60 via-purple-500/60 to-transparent rounded-full mt-1"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
          </div>
        </div>

        {/* Animated subtitle with typing indicator */}
        <div className="flex items-center gap-2 mt-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-500/60" />
          <p className="text-sm text-slate-400 font-mono truncate min-w-0 neon-text-blue">
            <span className="text-cyan-400/80">&gt;</span> {typingText}
            <span className="inline-block w-2 h-4 bg-cyan-400/80 ml-0.5 animate-blink-cursor align-middle" />
          </p>
        </div>
      </motion.div>

      {/* ─── KPI Cards Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 relative z-10 stagger-3d">
        {kpiCards.map((card, i) => (
          <KpiCard key={card.label} {...card} delay={0.1 + i * 0.08} />
        ))}
      </div>

      {/* ─── Risk Score + CyberGlobe + Charts Row ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10">
        {/* Risk Score with CyberGlobe - 2 column sub-layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="analytics-panel-elevated rounded-xl p-6 relative"
        >
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

          <div className="grid grid-cols-2 gap-4 items-center">
            {/* Risk Score Gauge */}
            <div className="flex flex-col items-center">
              <RiskScoreGauge score={72} />
            </div>
            {/* CyberGlobe 3D */}
            <div className="flex items-center justify-center">
              <CyberGlobe
                size={220}
                showParticles={true}
                showAttacks={true}
                speed={0.4}
                intensity="medium"
                className="opacity-90"
              />
            </div>
          </div>

          {/* Globe label */}
          <div className="text-center mt-2">
            <p className="text-[10px] text-cyan-500/50 font-mono uppercase tracking-widest">Global Threat Overview</p>
          </div>
        </motion.div>

        {/* Vulnerability Distribution PieChart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="analytics-panel-elevated rounded-xl p-6 relative scan-line-vertical"
        >
          {/* Cyber corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

          {/* Holographic shimmer overlay */}
          <div className="absolute inset-0 holo-shimmer rounded-xl pointer-events-none z-0" />

          <h3 className="text-sm font-medium text-slate-400 mb-4 relative z-10">Vulnerability Distribution</h3>
          <div className="relative z-10">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold text-slate-100">347</p>
              <p className="text-xs text-slate-400">Total</p>
            </div>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-2 relative z-10">
            {PIE_DATA.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-slate-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vulnerability Trend AreaChart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="analytics-panel-elevated rounded-xl p-6 relative scan-line-vertical"
        >
          {/* Cyber corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

          {/* Holographic shimmer overlay */}
          <div className="absolute inset-0 holo-shimmer rounded-xl pointer-events-none z-0" />

          <h3 className="text-sm font-medium text-slate-400 mb-4 relative z-10">Vulnerability Trend (30 days)</h3>
          <ResponsiveContainer width="100%" height={250} className="relative z-10">
            <AreaChart data={TREND_DATA}>
              <defs>
                <linearGradient id="criticalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="mediumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eab308" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#eab308" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e293b' }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e293b' }} />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="url(#criticalGrad)" />
              <Area type="monotone" dataKey="high" stackId="1" stroke="#f97316" fill="url(#highGrad)" />
              <Area type="monotone" dataKey="medium" stackId="1" stroke="#eab308" fill="url(#mediumGrad)" />
              <Area type="monotone" dataKey="low" stackId="1" stroke="#22c55e" fill="url(#lowGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ─── Recent Vulnerabilities Table ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="analytics-panel-elevated rounded-xl p-6 relative"
      >
        {/* Cyber corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-xl pointer-events-none z-20 border-cyan-500/30" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-xl pointer-events-none z-20 border-cyan-500/30" />

        {/* Beam sweep */}
        <div className="absolute inset-0 beam-sweep rounded-xl pointer-events-none z-0" />

        <h3 className="text-sm font-medium text-slate-400 mb-4 relative z-10">
          <span className="text-cyan-400/60 mr-2">&#x2588;</span>
          Recent Vulnerabilities
        </h3>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Severity</th>
                <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Name</th>
                <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Affected Asset</th>
                <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">CVSS</th>
                <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 pb-3">Time</th>
              </tr>
            </thead>
            <tbody className="stagger-entrance">
              {RECENT_VULNS.map((vuln, i) => (
                <motion.tr
                  key={vuln.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + i * 0.05 }}
                  className={`border-b border-slate-800/50 last:border-0 transition-all duration-300 group/row relative ${
                    vuln.severity === 'critical' ? 'alert-card-critical' :
                    vuln.severity === 'high' ? 'alert-card-high' :
                    vuln.severity === 'medium' ? 'alert-card-medium' :
                    vuln.severity === 'low' ? 'alert-card-low' : ''
                  }`}
                >
                  {/* Holographic hover line */}
                  <td className="absolute left-0 top-0 bottom-0 w-0 group-hover/row:w-0.5 transition-all duration-300" style={{ backgroundColor: 'transparent' }} />

                  <td className="py-3 pr-4">
                    <SeverityBadge severity={vuln.severity} />
                  </td>
                  <td className="py-3 pr-4 text-sm text-slate-200 font-medium group-hover/row:text-cyan-300 transition-colors max-w-[200px] truncate">{vuln.name}</td>
                  <td className="py-3 pr-4 text-sm text-slate-400 font-mono max-w-[180px] truncate">{vuln.affectedAsset}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-sm font-bold ${
                      vuln.cvssScore >= 9 ? 'text-red-400' :
                      vuln.cvssScore >= 7 ? 'text-orange-400' :
                      vuln.cvssScore >= 4 ? 'text-yellow-400' :
                      'text-emerald-400'
                    }`}>
                      {vuln.cvssScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 pr-4"><StatusBadge status={vuln.status} /></td>
                  <td className="py-3 text-sm text-slate-500">{vuln.discoveredAt}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ─── Quick Actions Row ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
        <QuickActionCard icon={Zap} label="New Scan" page="scanner" delay={0.9} />
        <QuickActionCard icon={FileSearch} label="View Reports" page="reports" delay={0.95} />
        <QuickActionCard icon={Globe} label="Threat Intel" page="threat-intel" delay={1.0} />
        <QuickActionCard icon={BrainCircuit} label="AI Analysis" page="analytics" delay={1.05} />
      </div>
    </div>
  );
}
