'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  Play,
  RotateCcw,
  Download,
  Eye,
  Zap,
  Shield,
  Radar,
  Clock,
  ChevronRight,
  AlertTriangle,
  Activity,
  Globe2,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useVulnGuardStore, type Vulnerability, type ScanResult } from '@/store/vulnguard-store';

// ─── Dynamic 3D Component Imports (SSR disabled) ────────────────────
const CyberGlobe = dynamic(
  () => import('@/components/vulnguard/3d/cyber-globe').then((mod) => mod.CyberGlobe),
  { ssr: false }
);

const ParticleField = dynamic(
  () => import('@/components/vulnguard/3d/particle-field').then((mod) => mod.ParticleField),
  { ssr: false }
);

// ─── Simulated Vulnerabilities Pool ───────────────────────────────────
const SIMULATED_VULNS: Array<Omit<Vulnerability, 'id' | 'discoveredAt' | 'status'>> = [
  {
    name: 'SQL Injection',
    category: 'Web Vulnerability',
    severity: 'critical',
    cvssScore: 9.8,
    affectedAsset: '/api/users/login',
    description: 'User-supplied input is not properly sanitized before being used in SQL queries, allowing attackers to execute arbitrary SQL commands.',
    recommendation: 'Use parameterized queries or prepared statements. Implement input validation and use an ORM layer.',
    riskLevel: 'Critical',
    cwe: 'CWE-89',
  },
  {
    name: 'Cross-Site Scripting (XSS)',
    category: 'Web Vulnerability',
    severity: 'high',
    cvssScore: 7.5,
    affectedAsset: '/dashboard/comments',
    description: 'Reflected XSS vulnerability found in the search parameter allowing execution of malicious scripts in the context of the user browser.',
    recommendation: 'Implement output encoding and Content Security Policy headers. Use frameworks that auto-escape output.',
    riskLevel: 'High',
    cwe: 'CWE-79',
  },
  {
    name: 'CSRF Token Missing',
    category: 'Web Vulnerability',
    severity: 'high',
    cvssScore: 6.8,
    affectedAsset: '/api/settings/update',
    description: 'Critical state-changing operations lack CSRF token validation, allowing cross-site request forgery attacks.',
    recommendation: 'Implement anti-CSRF tokens for all state-changing requests. Use SameSite cookie attribute.',
    riskLevel: 'High',
    cwe: 'CWE-352',
  },
  {
    name: 'Insecure Direct Object Reference',
    category: 'Web Vulnerability',
    severity: 'high',
    cvssScore: 7.1,
    affectedAsset: '/api/users/profile',
    description: 'User profile endpoint allows accessing other users data by modifying the ID parameter without authorization checks.',
    recommendation: 'Implement proper authorization checks. Use indirect reference maps and validate user permissions.',
    riskLevel: 'High',
    cwe: 'CWE-639',
  },
  {
    name: 'Missing Security Headers',
    category: 'Security Misconfiguration',
    severity: 'medium',
    cvssScore: 5.3,
    affectedAsset: 'nginx-config',
    description: 'Several important security headers are missing including X-Content-Type-Options, X-Frame-Options, and Content-Security-Policy.',
    recommendation: 'Configure all recommended security headers in the web server configuration.',
    riskLevel: 'Medium',
    cwe: 'CWE-693',
  },
  {
    name: 'Weak TLS Configuration',
    category: 'Security Misconfiguration',
    severity: 'medium',
    cvssScore: 4.7,
    affectedAsset: 'mail.vulnguard.io',
    description: 'TLS 1.0 and 1.1 are still enabled, and weak cipher suites are permitted on the mail server.',
    recommendation: 'Disable TLS 1.0 and 1.1. Remove weak cipher suites and enforce TLS 1.2+ only.',
    riskLevel: 'Medium',
    cwe: 'CWE-326',
  },
  {
    name: 'Outdated OpenSSL Version',
    category: 'Security Misconfiguration',
    severity: 'low',
    cvssScore: 3.2,
    affectedAsset: 'db-server-02',
    description: 'OpenSSL version 1.1.1 is running which has reached end of life and may contain unpatched vulnerabilities.',
    recommendation: 'Upgrade OpenSSL to the latest LTS version (3.x series).',
    riskLevel: 'Low',
    cwe: 'CWE-1104',
  },
  {
    name: 'Information Disclosure in Error Page',
    category: 'Information Exposure',
    severity: 'low',
    cvssScore: 2.1,
    affectedAsset: '/debug/status',
    description: 'Error pages expose detailed stack traces and server version information to end users.',
    recommendation: 'Implement custom error pages. Disable detailed error messages in production.',
    riskLevel: 'Low',
    cwe: 'CWE-209',
  },
  {
    name: 'Remote Code Execution (RCE)',
    category: 'Web Vulnerability',
    severity: 'critical',
    cvssScore: 10.0,
    affectedAsset: '/api/admin/exec',
    description: 'Unauthenticated remote code execution vulnerability found in the admin execution endpoint.',
    recommendation: 'Remove the endpoint immediately. Implement strict input validation and sandboxed execution.',
    riskLevel: 'Critical',
    cwe: 'CWE-94',
  },
  {
    name: 'Server-Side Request Forgery (SSRF)',
    category: 'Web Vulnerability',
    severity: 'critical',
    cvssScore: 9.1,
    affectedAsset: '/api/fetch-url',
    description: 'The URL fetch endpoint allows making requests to internal services without validation.',
    recommendation: 'Implement URL allowlisting. Block requests to internal IP ranges and metadata endpoints.',
    riskLevel: 'Critical',
    cwe: 'CWE-918',
  },
  {
    name: 'Broken Authentication',
    category: 'Authentication',
    severity: 'high',
    cvssScore: 8.1,
    affectedAsset: '/api/auth/reset',
    description: 'Password reset mechanism uses weak tokens that can be predicted, allowing account takeover.',
    recommendation: 'Use cryptographically secure random tokens. Implement rate limiting and token expiration.',
    riskLevel: 'High',
    cwe: 'CWE-287',
  },
  {
    name: 'Sensitive Data Exposure',
    category: 'Information Exposure',
    severity: 'high',
    cvssScore: 7.5,
    affectedAsset: '/api/users/export',
    description: 'User export endpoint returns PII data including passwords hashes without proper access controls.',
    recommendation: 'Implement field-level access controls. Never expose password hashes. Apply data minimization.',
    riskLevel: 'High',
    cwe: 'CWE-200',
  },
  {
    name: 'XML External Entity (XXE)',
    category: 'Web Vulnerability',
    severity: 'medium',
    cvssScore: 5.5,
    affectedAsset: '/api/import/xml',
    description: 'XML parser is configured to process external entities, allowing file disclosure and SSRF attacks.',
    recommendation: 'Disable external entity processing. Use JSON instead of XML where possible.',
    riskLevel: 'Medium',
    cwe: 'CWE-611',
  },
  {
    name: 'Unrestricted File Upload',
    category: 'Web Vulnerability',
    severity: 'medium',
    cvssScore: 6.1,
    affectedAsset: '/api/upload/avatar',
    description: 'File upload endpoint does not validate file types, allowing upload of malicious executables.',
    recommendation: 'Implement file type validation on both client and server. Use content-type verification.',
    riskLevel: 'Medium',
    cwe: 'CWE-434',
  },
  {
    name: 'Directory Traversal',
    category: 'Web Vulnerability',
    severity: 'medium',
    cvssScore: 5.0,
    affectedAsset: '/api/files/download',
    description: 'Path traversal vulnerability allows reading arbitrary files on the server through the download endpoint.',
    recommendation: 'Validate and sanitize file paths. Use chroot jails and restrict file system access.',
    riskLevel: 'Medium',
    cwe: 'CWE-22',
  },
];

// ─── Scan Phases ──────────────────────────────────────────────────────
const SCAN_PHASES = [
  'Initializing scan engine...',
  'Port scanning...',
  'Service detection...',
  'Vulnerability testing...',
  'Generating report...',
];

// ─── Severity Badge (Enhanced with pulse) ────────────────────────────
function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/30 threat-pulse-critical',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20 threat-pulse-high',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 threat-pulse-medium',
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    info: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${styles[severity] || styles.info}`}>
      {severity === 'critical' && <AlertTriangle className="w-3 h-3" />}
      {severity.toUpperCase()}
    </span>
  );
}

// ─── Risk Score Gauge (Enhanced with 3D effects) ─────────────────────
function RiskScoreGauge({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 70;
  const strokeWidth = 14;
  const cx = 100;
  const cy = 90;
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
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className="absolute -inset-4 rounded-full"
          style={{
            background: `radial-gradient(circle, ${getScoreColor(animatedScore)}10 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
        />
        <svg width="200" height="120" viewBox="0 0 200 120" className="relative">
          <defs>
            <linearGradient id="scanGaugeGrad3D" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Background track with inner shadow */}
          <path d={backgroundPath} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d={backgroundPath} fill="none" stroke="#0f172a" strokeWidth={strokeWidth - 4} strokeLinecap="round" />
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
          <text x={cx} y={cy - 15} textAnchor="middle" fill="#f1f5f9" style={{ fontSize: '32px', fontWeight: 800 }}>
            {animatedScore}
          </text>
          <text x={cx} y={cy + 5} textAnchor="middle" fill="#64748b" style={{ fontSize: '11px' }}>
            out of 100
          </text>
        </svg>
      </div>
      <div
        className="mt-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest"
        style={{
          backgroundColor: `${getScoreColor(animatedScore)}15`,
          color: getScoreColor(animatedScore),
          border: `1px solid ${getScoreColor(animatedScore)}30`,
          boxShadow: `0 0 12px ${getScoreColor(animatedScore)}20`,
        }}
      >
        {getRiskLabel(animatedScore)}
      </div>
    </div>
  );
}

// ─── Custom Tooltip for Bar Chart ─────────────────────────────────────
function CustomBarTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; count: number; fill: string } }> }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card px-4 py-3 shadow-2xl">
        <p className="text-xs font-semibold" style={{ color: data.fill }}>{data.name}</p>
        <p className="text-sm font-bold text-slate-100">{data.count} findings</p>
      </div>
    );
  }
  return null;
}

// ─── Holographic Section Title ────────────────────────────────────────
function HoloSectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      {Icon && (
        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-cyan-400" />
        </div>
      )}
      <h3 className="text-sm font-semibold holo-text tracking-wide">{children}</h3>
    </div>
  );
}

// ─── 3D Severity Bar ─────────────────────────────────────────────────
function SeverityBar3D({ data }: { data: Array<{ name: string; count: number; fill: string }> }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.name} className="group">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold" style={{ color: item.fill }}>{item.name}</span>
            <span className="text-xs font-bold text-slate-300">{item.count}</span>
          </div>
          <div className="relative h-8 bg-slate-800/60 rounded-lg overflow-hidden border border-slate-700/30">
            {/* Background grid lines */}
            <div className="absolute inset-0 flex">
              {[25, 50, 75].map((p) => (
                <div key={p} className="absolute top-0 bottom-0 border-l border-slate-700/20" style={{ left: `${p}%` }} />
              ))}
            </div>
            {/* Fill bar */}
            <motion.div
              className="h-full rounded-lg relative"
              initial={{ width: 0 }}
              animate={{ width: `${(item.count / maxCount) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              style={{
                background: `linear-gradient(135deg, ${item.fill}40, ${item.fill}20)`,
                boxShadow: `0 0 15px ${item.fill}30, inset 0 1px 0 ${item.fill}20`,
                borderRight: `2px solid ${item.fill}60`,
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
              {/* Top highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent rounded-t-lg" />
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Scanner Page ────────────────────────────────────────────────
export function ScannerPage() {
  const { addScan, updateScan, setCurrentScan, addNotification, addVulnerability, scans, setCurrentPage } = useVulnGuardStore();

  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState<'quick' | 'full' | 'custom'>('quick');
  const [portRange, setPortRange] = useState('1-65535');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [liveFindings, setLiveFindings] = useState<Vulnerability[]>([]);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState(0);

  const findingsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const vulnQueueRef = useRef<Vulnerability[]>([]);
  const startTimeRef = useRef<number>(0);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  // Auto-scroll findings
  useEffect(() => {
    if (findingsRef.current) {
      findingsRef.current.scrollTop = findingsRef.current.scrollHeight;
    }
  }, [liveFindings]);

  // Elapsed time counter
  useEffect(() => {
    if (isScanning) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isScanning]);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  // Get severity breakdown for chart
  const getSeverityBreakdown = useCallback(() => {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    liveFindings.forEach((v) => {
      if (v.severity === 'critical') counts.Critical++;
      else if (v.severity === 'high') counts.High++;
      else if (v.severity === 'medium') counts.Medium++;
      else if (v.severity === 'low') counts.Low++;
    });
    return [
      { name: 'Critical', count: counts.Critical, fill: '#ef4444' },
      { name: 'High', count: counts.High, fill: '#f97316' },
      { name: 'Medium', count: counts.Medium, fill: '#eab308' },
      { name: 'Low', count: counts.Low, fill: '#22c55e' },
    ];
  }, [liveFindings]);

  const startScan = useCallback(() => {
    if (!target.trim()) return;

    const scanId = `scan-${Date.now()}`;
    const now = new Date().toISOString();

    // Reset state
    setProgress(0);
    setCurrentPhase(SCAN_PHASES[0]);
    setLiveFindings([]);
    setScanCompleted(false);
    setElapsedTime(0);
    setRiskScore(0);
    setIsScanning(true);
    setCurrentScanId(scanId);
    vulnQueueRef.current = [];

    // Create scan in store
    const newScan: ScanResult = {
      id: scanId,
      target: target.trim(),
      type: scanType,
      status: 'scanning',
      progress: 0,
      startedAt: now,
      vulnerabilities: [],
      riskScore: 0,
    };
    addScan(newScan);
    setCurrentScan(newScan);

    // Prepare vulnerability schedule
    const shuffled = [...SIMULATED_VULNS].sort(() => Math.random() - 0.5);
    const vulnSchedule: Array<{ progressThreshold: number; vuln: typeof shuffled[0] }> = [];
    let idx = 0;

    // 20%: 2-3 medium/low
    for (let i = 0; i < 3 && idx < shuffled.length; i++, idx++) {
      const filtered = shuffled.filter(v => v.severity === 'medium' || v.severity === 'low');
      if (filtered.length > 0) vulnSchedule.push({ progressThreshold: 15 + Math.random() * 8, vuln: filtered[Math.floor(Math.random() * filtered.length)] });
    }
    // 40%: 3-4 medium/high
    for (let i = 0; i < 4 && idx < shuffled.length; i++, idx++) {
      const filtered = shuffled.filter(v => v.severity === 'medium' || v.severity === 'high');
      if (filtered.length > 0) vulnSchedule.push({ progressThreshold: 33 + Math.random() * 10, vuln: filtered[Math.floor(Math.random() * filtered.length)] });
    }
    // 60%: 2-3 high/critical
    for (let i = 0; i < 3 && idx < shuffled.length; i++, idx++) {
      const filtered = shuffled.filter(v => v.severity === 'high' || v.severity === 'critical');
      if (filtered.length > 0) vulnSchedule.push({ progressThreshold: 52 + Math.random() * 12, vuln: filtered[Math.floor(Math.random() * filtered.length)] });
    }
    // 80%: 2 critical
    for (let i = 0; i < 2 && idx < shuffled.length; i++, idx++) {
      const filtered = shuffled.filter(v => v.severity === 'critical');
      if (filtered.length > 0) vulnSchedule.push({ progressThreshold: 72 + Math.random() * 12, vuln: filtered[Math.floor(Math.random() * filtered.length)] });
    }

    // Sort schedule by threshold
    vulnSchedule.sort((a, b) => a.progressThreshold - b.progressThreshold);

    // Progress simulation: ~15 seconds total
    let currentProgress = 0;
    const addedVulns: Vulnerability[] = [];

    progressRef.current = setInterval(() => {
      currentProgress += 100 / 150; // 150 intervals of 100ms = 15 seconds
      const roundedProgress = Math.min(Math.round(currentProgress), 100);
      setProgress(roundedProgress);

      // Update phase
      const phaseIndex = Math.min(Math.floor(roundedProgress / 20), SCAN_PHASES.length - 1);
      setCurrentPhase(SCAN_PHASES[phaseIndex]);

      // Add vulnerabilities at thresholds
      vulnSchedule.forEach((scheduled) => {
        if (roundedProgress >= scheduled.progressThreshold && !addedVulns.find(v => v.name === scheduled.vuln.name)) {
          const newVuln: Vulnerability = {
            ...scheduled.vuln,
            id: `vuln-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            discoveredAt: new Date().toISOString(),
            status: 'open',
          };
          addedVulns.push(newVuln);
          setLiveFindings((prev) => [...prev, newVuln]);
          addVulnerability(newVuln);
        }
      });

      // Update store scan progress
      updateScan(scanId, { progress: roundedProgress, vulnerabilities: [...addedVulns] });

      // Complete scan
      if (roundedProgress >= 100) {
        if (progressRef.current) clearInterval(progressRef.current);

        const completedScan: Partial<ScanResult> = {
          status: 'completed',
          progress: 100,
          completedAt: new Date().toISOString(),
          vulnerabilities: addedVulns,
          riskScore: Math.min(Math.round(addedVulns.reduce((acc, v) => {
            if (v.severity === 'critical') return acc + 15;
            if (v.severity === 'high') return acc + 8;
            if (v.severity === 'medium') return acc + 3;
            return acc + 1;
          }, 0) + Math.random() * 10), 100),
        };

        updateScan(scanId, completedScan);

        const finalRiskScore = completedScan.riskScore || 0;
        setRiskScore(finalRiskScore);
        setCurrentScan((prev) => prev ? { ...prev, ...completedScan } as ScanResult : null);

        addNotification({
          id: `notif-${Date.now()}`,
          type: 'scan_complete',
          title: 'Scan Completed',
          message: `Scan of ${target.trim()} completed with ${addedVulns.length} findings. Risk score: ${finalRiskScore}`,
          timestamp: new Date().toISOString(),
          read: false,
        });

        if (addedVulns.some(v => v.severity === 'critical')) {
          addNotification({
            id: `notif-crit-${Date.now()}`,
            type: 'critical_finding',
            title: 'Critical Vulnerability Detected',
            message: `Critical severity vulnerability found during scan of ${target.trim()}`,
            timestamp: new Date().toISOString(),
            read: false,
          });
        }

        setIsScanning(false);
        setScanCompleted(true);
      }
    }, 100);
  }, [target, scanType, addScan, updateScan, setCurrentScan, addNotification, addVulnerability]);

  const resetScan = useCallback(() => {
    if (progressRef.current) clearInterval(progressRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setTarget('');
    setScanType('quick');
    setPortRange('1-65535');
    setProgress(0);
    setCurrentPhase('');
    setLiveFindings([]);
    setScanCompleted(false);
    setElapsedTime(0);
    setIsScanning(false);
    setCurrentScanId(null);
    setRiskScore(0);
  }, []);

  // Determine globe props based on scan state
  const globeProps = isScanning
    ? { showAttacks: true, speed: 1.2, intensity: 'high' as const, showParticles: true }
    : scanCompleted
    ? { showAttacks: false, speed: 0.5, intensity: 'medium' as const, showParticles: true }
    : { showAttacks: false, speed: 0.3, intensity: 'low' as const, showParticles: true };

  return (
    <div className="relative space-y-6">
      {/* Background Particle Field */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <ParticleField count={60} showHexagons={true} />
      </div>

      {/* Content */}
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Header with holographic title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center gap-4"
        >
          <div className="flex-1">
            <h2 className="text-2xl font-bold holo-text">Vulnerability Scanner</h2>
            <p className="text-sm text-slate-400 mt-1.5 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-500/60" />
              Scan targets for security vulnerabilities and misconfigurations
            </p>
          </div>
          {/* Mini 3D Globe in header when idle */}
          {!isScanning && !scanCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:block float-animation"
            >
              <CyberGlobe
                size={140}
                showParticles={true}
                showAttacks={false}
                speed={0.3}
                intensity="low"
                className="opacity-70"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Target Input Section - Glass Card 3D with animated gradient border */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="animated-gradient-border"
        >
          <div className="glass-card-3d p-6">
            <HoloSectionTitle icon={Globe2}>Scan Target</HoloSectionTitle>

            {/* URL/IP Input with glow */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative group">
                <Scan className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Enter URL, IP address, or domain (e.g., 192.168.1.0/24, example.com)"
                  disabled={isScanning}
                  className="w-full bg-slate-900/60 border border-slate-700/40 rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-[0_0_20px_rgba(6,182,212,0.15)] disabled:opacity-50 transition-all duration-300 font-mono"
                />
                {/* Focus glow effect */}
                <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" style={{ boxShadow: '0 0 20px rgba(6,182,212,0.15), inset 0 0 20px rgba(6,182,212,0.05)' }} />
              </div>
            </div>

            {/* Scan Type Selector with enhanced styling */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex gap-2">
                {(['quick', 'full', 'custom'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setScanType(type)}
                    disabled={isScanning}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50 ${
                      scanType === type
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                        : 'bg-slate-800/40 text-slate-400 border border-slate-700/40 hover:text-slate-300 hover:border-slate-600/60 hover:bg-slate-800/60'
                    }`}
                  >
                    {type === 'quick' && <Zap className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />}
                    {type === 'full' && <Shield className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />}
                    {type === 'custom' && <Scan className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Port Range (Custom only) */}
              {scanType === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs text-slate-500 whitespace-nowrap">Port Range:</span>
                  <input
                    type="text"
                    value={portRange}
                    onChange={(e) => setPortRange(e.target.value)}
                    placeholder="1-65535"
                    disabled={isScanning}
                    className="bg-slate-900/60 border border-slate-700/40 rounded-xl px-3.5 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50 w-36 transition-all duration-300 font-mono"
                  />
                </motion.div>
              )}
            </div>

            {/* Action Buttons with 3D press effect */}
            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={startScan}
                disabled={isScanning || !target.trim()}
                whileHover={{ scale: isScanning ? 1 : 1.02 }}
                whileTap={{ scale: isScanning ? 1 : 0.97 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed press-3d ${
                  isScanning
                    ? 'bg-slate-700/60 text-slate-400 border border-slate-600/30'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:border-emerald-500/50'
                }`}
              >
                {isScanning ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                      <Radar className="w-4 h-4" />
                    </motion.div>
                    Scanning...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Start Scan
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={resetScan}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-slate-800/40 text-slate-400 border border-slate-700/40 hover:text-slate-300 hover:border-slate-600/60 hover:bg-slate-800/60 transition-all duration-300 press-3d"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Scan Progress Section - With 3D Globe */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card-3d animated-gradient-border overflow-hidden"
            >
              <div className="p-6">
                {/* Phase indicator */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
                    >
                      <Radar className="w-4 h-4 text-cyan-400" />
                    </motion.div>
                    <div>
                      <span className="text-sm font-semibold text-cyan-400 block">{currentPhase}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Phase {Math.min(Math.floor(progress / 20) + 1, 5)} of 5</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-mono">{formatTime(elapsedTime)}</span>
                    </div>
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
                      {progress}%
                    </span>
                  </div>
                </div>

                {/* 3D Progress Bar with holographic beam sweep */}
                <div className="relative mb-3">
                  {/* Glow under the bar */}
                  <div
                    className="absolute -inset-1 rounded-full blur-sm"
                    style={{
                      background: `linear-gradient(90deg, rgba(6,182,212,0.15), rgba(16,185,129,0.15))`,
                      opacity: progress / 100,
                    }}
                  />
                  <div className="relative w-full bg-slate-800/80 rounded-full h-4 overflow-hidden beam-sweep border border-slate-700/30">
                    {/* Tick marks */}
                    <div className="absolute inset-0 flex">
                      {[20, 40, 60, 80].map((p) => (
                        <div key={p} className="absolute top-0 bottom-0 w-px bg-slate-600/30" style={{ left: `${p}%` }} />
                      ))}
                    </div>
                    <motion.div
                      className="h-full rounded-full relative overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                      style={{
                        background: 'linear-gradient(90deg, #06b6d4, #10b981)',
                        boxShadow: '0 0 15px rgba(6,182,212,0.4), 0 0 30px rgba(16,185,129,0.2)',
                      }}
                    >
                      {/* Moving shimmer */}
                      <div className="absolute inset-0">
                        <motion.div
                          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{ x: ['-100%', '400%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </div>
                      {/* Top highlight */}
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full" />
                    </motion.div>
                    {/* Scan line vertical effect */}
                    <div className="scan-line-vertical absolute inset-0 pointer-events-none" />
                  </div>
                </div>

                <div className="flex justify-between text-xs text-slate-500 mb-6">
                  <span>Progress: {progress}%</span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-500/60" />
                    {liveFindings.length} findings
                  </span>
                </div>

                {/* 3D CyberGlobe - replaces CSS holographic globe */}
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Ambient glow behind globe */}
                    <div
                      className="absolute inset-0 rounded-full blur-3xl"
                      style={{
                        background: isScanning
                          ? 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(16,185,129,0.1) 40%, transparent 70%)'
                          : 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
                      }}
                    />
                    <CyberGlobe
                      size={260}
                      className="relative"
                      showParticles={true}
                      showAttacks={globeProps.showAttacks}
                      speed={globeProps.speed}
                      intensity={globeProps.intensity}
                    />
                    {/* Scanning pulse rings */}
                    {isScanning && (
                      <>
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                        >
                          <div className="w-48 h-48 rounded-full border border-cyan-500/20" />
                        </motion.div>
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          animate={{ scale: [1, 1.5], opacity: [0.2, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                        >
                          <div className="w-48 h-48 rounded-full border border-emerald-500/15" />
                        </motion.div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completed scan - show globe in results */}
        <AnimatePresence>
          {scanCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="glass-card-3d p-6 flex justify-center"
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-3xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
                  }}
                />
                <CyberGlobe
                  size={200}
                  className="relative"
                  showParticles={true}
                  showAttacks={false}
                  speed={0.5}
                  intensity="medium"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Findings Feed - with data stream & stagger */}
        <AnimatePresence>
          {(isScanning || liveFindings.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="glass-card-3d data-stream"
            >
              <div className="p-6 relative" style={{ zIndex: 1 }}>
                <div className="flex items-center justify-between mb-4">
                  <HoloSectionTitle icon={Activity}>Live Findings</HoloSectionTitle>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                    {liveFindings.length} found
                  </span>
                </div>

                <div
                  ref={findingsRef}
                  className="max-h-96 overflow-y-auto space-y-2 pr-1 custom-scrollbar"
                >
                  {liveFindings.length === 0 && isScanning && (
                    <div className="text-center py-10">
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex flex-col items-center gap-3"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        >
                          <Radar className="w-8 h-8 text-cyan-500/40" />
                        </motion.div>
                        <span className="text-sm text-slate-500">Scanning for vulnerabilities...</span>
                      </motion.div>
                    </div>
                  )}

                  <div className="stagger-entrance">
                    <AnimatePresence>
                      {liveFindings.map((finding, index) => (
                        <motion.div
                          key={finding.id}
                          initial={{ opacity: 0, x: -40, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.03 }}
                          className="flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 group cursor-pointer hover:scale-[1.01]"
                          style={{
                            background: finding.severity === 'critical'
                              ? 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(15,23,42,0.4) 100%)'
                              : finding.severity === 'high'
                              ? 'linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(15,23,42,0.4) 100%)'
                              : 'rgba(15,23,42,0.4)',
                            borderColor: finding.severity === 'critical'
                              ? 'rgba(239,68,68,0.25)'
                              : finding.severity === 'high'
                              ? 'rgba(249,115,22,0.2)'
                              : 'rgba(51,65,85,0.3)',
                          }}
                        >
                          {/* Severity indicator dot */}
                          <div className={`w-2 h-2 rounded-full shrink-0 ${
                            finding.severity === 'critical' ? 'bg-red-500 threat-pulse-critical' :
                            finding.severity === 'high' ? 'bg-orange-500 threat-pulse-high' :
                            finding.severity === 'medium' ? 'bg-yellow-500 threat-pulse-medium' :
                            'bg-emerald-500'
                          }`} />
                          <span className="shrink-0"><SeverityBadge severity={finding.severity} /></span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">{finding.name}</p>
                            <p className="text-xs text-slate-500 font-mono truncate">{finding.affectedAsset}</p>
                          </div>
                          <span className={`text-sm font-bold shrink-0 tabular-nums ${
                            finding.cvssScore >= 9 ? 'text-red-400' :
                            finding.cvssScore >= 7 ? 'text-orange-400' :
                            finding.cvssScore >= 4 ? 'text-yellow-400' :
                            'text-emerald-400'
                          }`}>
                            {finding.cvssScore.toFixed(1)}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan Results Summary - Enhanced 3D visualization */}
        <AnimatePresence>
          {scanCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card-3d animated-gradient-border"
            >
              <div className="p-6">
                <HoloSectionTitle icon={Shield}>Scan Results Summary</HoloSectionTitle>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Risk Score Gauge with enhanced 3D shadow */}
                  <div
                    className="flex flex-col items-center justify-center glass-card p-4 breathe-glow"
                  >
                    <RiskScoreGauge score={riskScore} />
                  </div>

                  {/* Severity Breakdown - 3D Bar Chart */}
                  <div className="glass-card p-4">
                    <h4 className="text-xs font-semibold text-slate-500 mb-4 text-center uppercase tracking-wider">Findings by Severity</h4>
                    <SeverityBar3D data={getSeverityBreakdown()} />
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 stagger-entrance">
                  {[
                    { label: 'Total Findings', value: liveFindings.length, color: '#06b6d4' },
                    { label: 'Critical', value: liveFindings.filter(v => v.severity === 'critical').length, color: '#ef4444' },
                    { label: 'High', value: liveFindings.filter(v => v.severity === 'high').length, color: '#f97316' },
                    { label: 'Medium/Low', value: liveFindings.filter(v => v.severity === 'medium' || v.severity === 'low').length, color: '#eab308' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center p-3 rounded-xl border border-slate-700/30 bg-slate-800/30 transition-all duration-300 hover:border-cyan-500/20 hover:bg-slate-800/50"
                      style={{ boxShadow: `inset 0 1px 0 ${stat.color}10` }}
                    >
                      <p className="text-2xl font-bold tabular-nums" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setCurrentPage('results')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 press-3d"
                  >
                    <Eye className="w-4 h-4" />
                    View Full Results
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => {
                      addNotification({
                        id: `notif-export-${Date.now()}`,
                        type: 'report_ready',
                        title: 'Report Exported',
                        message: `Vulnerability report for ${target} has been exported successfully`,
                        timestamp: new Date().toISOString(),
                        read: false,
                      });
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium bg-slate-800/40 text-slate-400 border border-slate-700/40 hover:text-slate-300 hover:border-slate-600/60 transition-all duration-300 press-3d"
                  >
                    <Download className="w-4 h-4" />
                    Export Report
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={resetScan}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 press-3d"
                  >
                    <Zap className="w-4 h-4" />
                    New Scan
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Scans List - Glass Card 3D with hover 3D effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card-3d"
        >
          <div className="p-6">
            <HoloSectionTitle icon={Clock}>Recent Scans</HoloSectionTitle>

            {scans.length === 0 ? (
              <div className="text-center py-10">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-block"
                >
                  <Scan className="w-12 h-12 text-slate-700/60 mx-auto mb-3" />
                </motion.div>
                <p className="text-sm text-slate-500">No scans yet. Start your first scan above.</p>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2 custom-scrollbar stagger-entrance">
                {scans.map((scan, i) => (
                  <motion.div
                    key={scan.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    onClick={() => {
                      setCurrentScan(scan);
                      setCurrentPage('results');
                    }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-700/20 bg-slate-800/20 hover:border-cyan-500/25 hover:bg-slate-800/40 transition-all duration-300 cursor-pointer group card-3d-flip"
                    style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      scan.status === 'completed' ? 'bg-emerald-500/10 border border-emerald-500/20 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]' :
                      scan.status === 'scanning' ? 'bg-cyan-500/10 border border-cyan-500/20 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.2)]' :
                      scan.status === 'failed' ? 'bg-red-500/10 border border-red-500/20 group-hover:shadow-[0_0_12px_rgba(239,68,68,0.2)]' :
                      'bg-slate-700/50 border border-slate-600/30'
                    }`}>
                      <Scan className={`w-5 h-5 transition-colors ${
                        scan.status === 'completed' ? 'text-emerald-400' :
                        scan.status === 'scanning' ? 'text-cyan-400' :
                        scan.status === 'failed' ? 'text-red-400' :
                        'text-slate-500'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">{scan.target}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="uppercase font-semibold">{scan.type}</span>
                        <span className="text-slate-700">|</span>
                        <span>{new Date(scan.startedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-200">{scan.vulnerabilities.length}</p>
                      <p className="text-[10px] text-slate-500 uppercase">vulns</p>
                    </div>

                    {scan.riskScore > 0 && (
                      <div className="text-right shrink-0 w-12">
                        <p className={`text-sm font-bold ${
                          scan.riskScore >= 80 ? 'text-red-400' :
                          scan.riskScore >= 60 ? 'text-orange-400' :
                          scan.riskScore >= 40 ? 'text-yellow-400' :
                          'text-emerald-400'
                        }`}>
                          {scan.riskScore}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase">risk</p>
                      </div>
                    )}

                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      scan.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      scan.status === 'scanning' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      scan.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                    }`}>
                      {scan.status}
                    </span>

                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0 group-hover:translate-x-0.5 transform" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
