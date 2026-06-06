'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Eye,
  Plus,
  Calendar,
  CheckSquare,
  Square,
  Loader2,
  X,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  BarChart3,
  FileSearch,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';
import { useVulnGuardStore } from '@/store/vulnguard-store';

// ─── Dynamic 3D Component Imports (SSR disabled) ─────────────────────
const MiniGlobe = dynamic(
  () => import('@/components/vulnguard/3d/cyber-globe').then((mod) => mod.MiniGlobe),
  { ssr: false }
);

// ─── Types ────────────────────────────────────────────────────────────
interface Report {
  id: string;
  name: string;
  type: 'executive' | 'technical' | 'compliance';
  generatedAt: string;
  findingsCount: number;
  riskScore: number;
  format: 'PDF' | 'CSV';
}

// ─── Mock Data ────────────────────────────────────────────────────────
const INITIAL_REPORTS: Report[] = [
  {
    id: 'rpt-001',
    name: 'Q1 Security Assessment',
    type: 'executive',
    generatedAt: '2025-03-31T14:30:00Z',
    findingsCount: 45,
    riskScore: 72,
    format: 'PDF',
  },
  {
    id: 'rpt-002',
    name: 'Full Technical Scan - Production',
    type: 'technical',
    generatedAt: '2025-04-15T09:20:00Z',
    findingsCount: 128,
    riskScore: 85,
    format: 'PDF',
  },
  {
    id: 'rpt-003',
    name: 'SOC2 Compliance Audit',
    type: 'compliance',
    generatedAt: '2025-05-01T16:45:00Z',
    findingsCount: 23,
    riskScore: 38,
    format: 'PDF',
  },
  {
    id: 'rpt-004',
    name: 'Monthly Vulnerability Report - May',
    type: 'technical',
    generatedAt: '2025-05-31T11:00:00Z',
    findingsCount: 67,
    riskScore: 64,
    format: 'CSV',
  },
  {
    id: 'rpt-005',
    name: 'Executive Summary - Q2',
    type: 'executive',
    generatedAt: '2025-06-01T08:30:00Z',
    findingsCount: 34,
    riskScore: 58,
    format: 'PDF',
  },
];

// ─── Report Type Badge with Glow ──────────────────────────────────────
function ReportTypeBadge({ type }: { type: Report['type'] }) {
  const typeLabels: Record<string, string> = {
    executive: 'Executive Summary',
    technical: 'Full Technical Report',
    compliance: 'Compliance Report',
  };

  const config: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    executive: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      border: 'border-cyan-500/20',
      glow: 'shadow-[0_0_8px_rgba(6,182,212,0.2)]',
    },
    technical: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/20',
      glow: 'shadow-[0_0_8px_rgba(249,115,22,0.2)]',
    },
    compliance: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      glow: 'shadow-[0_0_8px_rgba(16,185,129,0.2)]',
    },
  };

  const c = config[type] || config.executive;

  return (
    <span className={`badge-3d inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap ${c.bg} ${c.text} ${c.border} ${c.glow}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" />
      {typeLabels[type]}
    </span>
  );
}

// ─── Report Preview Content ──────────────────────────────────────────
function ReportPreviewContent({ report }: { report: Report }) {
  const typeLabels = {
    executive: 'Executive Summary',
    technical: 'Full Technical Report',
    compliance: 'Compliance Report',
  };

  return (
    <div className="space-y-6 relative z-10">
      {/* Report Header */}
      <div className="border-b border-slate-700 pb-4">
        <h3 className="text-lg font-bold text-slate-100">{report.name}</h3>
        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
          <span>{typeLabels[report.type]}</span>
          <span>·</span>
          <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
          <span>·</span>
          <span>{report.format}</span>
        </div>
      </div>

      {/* Executive Summary */}
      <div>
        <h4 className="text-sm font-semibold holo-text mb-2">Executive Summary</h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          This security assessment identified {report.findingsCount} vulnerabilities across the scanned infrastructure.
          The overall risk score is {report.riskScore}/100, indicating a{' '}
          {report.riskScore >= 70 ? 'high' : report.riskScore >= 40 ? 'moderate' : 'low'}{' '}
          risk posture. Critical findings require immediate attention to prevent potential exploitation.
          Our analysis reveals that the primary attack vectors are web application vulnerabilities and security misconfigurations.
        </p>
      </div>

      {/* Key Findings */}
      <div>
        <h4 className="text-sm font-semibold holo-text mb-2">Key Findings</h4>
        <div className="space-y-2">
          {[
            { severity: 'critical', text: 'SQL Injection vulnerability in authentication endpoint' },
            { severity: 'critical', text: 'Remote Code Execution risk in admin panel' },
            { severity: 'high', text: 'Cross-Site Scripting (XSS) in user input fields' },
            { severity: 'high', text: 'Missing CSRF tokens on state-changing operations' },
            { severity: 'medium', text: 'Weak TLS configuration on mail server' },
          ].map((finding, i) => (
            <div key={i} className="flex items-start gap-2">
              {finding.severity === 'critical' ? (
                <AlertOctagon className="w-4 h-4 text-red-400 mt-0.5 shrink-0 threat-pulse-critical" />
              ) : finding.severity === 'high' ? (
                <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 shrink-0 threat-pulse-high" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0 threat-pulse-medium" />
              )}
              <p className="text-xs text-slate-300">{finding.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      <div>
        <h4 className="text-sm font-semibold holo-text mb-2">Risk Assessment</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400">Overall Risk Score</p>
            <p className={`text-xl font-bold ${
              report.riskScore >= 70 ? 'text-red-400' : report.riskScore >= 40 ? 'text-yellow-400' : 'text-emerald-400'
            }`}>
              {report.riskScore}/100
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400">Total Findings</p>
            <p className="text-xl font-bold text-slate-200">{report.findingsCount}</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="text-sm font-semibold holo-text mb-2">Recommendations</h4>
        <div className="space-y-1.5">
          {[
            'Implement parameterized queries for all database operations',
            'Deploy Content Security Policy headers across all web applications',
            'Enforce TLS 1.2+ and disable legacy protocol support',
            'Implement CSRF protection tokens for all state-changing requests',
            'Conduct regular penetration testing on a quarterly basis',
          ].map((rec, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs text-emerald-400 mt-0.5">{i + 1}.</span>
              <p className="text-xs text-slate-300">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Table */}
      <div>
        <h4 className="text-sm font-semibold holo-text mb-2">Statistics</h4>
        <div className="bg-slate-800/30 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-xs font-medium text-slate-500 px-3 py-2">Severity</th>
                <th className="text-right text-xs font-medium text-slate-500 px-3 py-2">Count</th>
                <th className="text-right text-xs font-medium text-slate-500 px-3 py-2">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {[
                { severity: 'Critical', count: Math.round(report.findingsCount * 0.12), color: 'text-red-400' },
                { severity: 'High', count: Math.round(report.findingsCount * 0.25), color: 'text-orange-400' },
                { severity: 'Medium', count: Math.round(report.findingsCount * 0.35), color: 'text-yellow-400' },
                { severity: 'Low', count: Math.round(report.findingsCount * 0.28), color: 'text-emerald-400' },
              ].map((row) => (
                <tr key={row.severity} className="border-b border-slate-700/30 last:border-0">
                  <td className={`px-3 py-2 text-xs font-medium ${row.color}`}>{row.severity}</td>
                  <td className="px-3 py-2 text-xs text-slate-200 text-right">{row.count}</td>
                  <td className="px-3 py-2 text-xs text-slate-400 text-right">
                    {Math.round((row.count / report.findingsCount) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main Reports Page ────────────────────────────────────────────────
export function ReportsPage() {
  const { addNotification } = useVulnGuardStore();

  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewReport, setPreviewReport] = useState<Report | null>(null);

  // Report generator form state
  const [reportType, setReportType] = useState<'executive' | 'technical' | 'compliance'>('executive');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sections, setSections] = useState({
    executive: true,
    findings: true,
    risk: true,
    recommendations: true,
    statistics: false,
  });

  const typeLabels: Record<string, string> = {
    executive: 'Executive Summary',
    technical: 'Full Technical Report',
    compliance: 'Compliance Report',
  };

  const toggleSection = useCallback((key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);

    // Simulate generation
    setTimeout(() => {
      const newReport: Report = {
        id: `rpt-${Date.now()}`,
        name: `${typeLabels[reportType]} - ${new Date().toLocaleDateString()}`,
        type: reportType,
        generatedAt: new Date().toISOString(),
        findingsCount: Math.floor(Math.random() * 80) + 20,
        riskScore: Math.floor(Math.random() * 60) + 30,
        format: Math.random() > 0.5 ? 'PDF' : 'CSV',
      };

      setReports((prev) => [newReport, ...prev]);
      setIsGenerating(false);

      addNotification({
        id: `notif-report-${Date.now()}`,
        type: 'report_ready',
        title: 'Report Generated',
        message: `${newReport.name} has been generated and is ready for download`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }, 2500);
  }, [reportType, addNotification]);

  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);

  const handleDownload = useCallback((report: Report) => {
    if (report.format === 'PDF') {
      handleExportPDF(report);
    } else {
      handleExportCSV(report);
    }
  }, []);

  const handleExportPDF = useCallback(async (report?: Report) => {
    setIsExportingPDF(true);
    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType: report?.type || reportType,
          target: 'Corporate Infrastructure',
          dateRange: {
            from: dateFrom || '2025-01-01',
            to: dateTo || new Date().toISOString().split('T')[0],
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate report');
      }

      const html = await res.text();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }

      addNotification({
        id: `notif-pdf-${Date.now()}`,
        type: 'report_ready',
        title: 'PDF Report Generated',
        message: 'Professional PDF report opened in new tab. Use Print > Save as PDF to download.',
        timestamp: new Date().toISOString(),
        read: false,
      });
    } catch (err: any) {
      addNotification({
        id: `notif-err-${Date.now()}`,
        type: 'critical_finding',
        title: 'Export Failed',
        message: err.message || 'Failed to generate PDF report',
        timestamp: new Date().toISOString(),
        read: false,
      });
    } finally {
      setIsExportingPDF(false);
    }
  }, [reportType, dateFrom, dateTo, addNotification]);

  const handleExportCSV = useCallback((report?: Report) => {
    setIsExportingCSV(true);
    try {
      const csvHeaders = 'ID,Name,Severity,CVSS,Status,Category,Affected Asset,Discovered\n';
      const csvRows = [
        '"VULN-001","SQL Injection - Login Endpoint","Critical",9.8,"Open","Injection","webapp-prod.corp.local","2025-05-28"',
        '"VULN-002","Reflected XSS - Search Parameter","High",7.5,"In Progress","XSS","portal.corp.local","2025-05-27"',
        '"VULN-003","Stored XSS - User Profile","High",8.2,"Open","XSS","portal.corp.local","2025-05-26"',
        '"VULN-004","CSRF - Password Change","High",8.0,"In Progress","CSRF","api.corp.local","2025-05-24"',
        '"VULN-005","Directory Traversal - File API","Critical",9.1,"Open","Path Traversal","fileserver.corp.local","2025-05-21"',
        '"VULN-006","Weak SSL/TLS - External API","High",8.1,"Open","Weak TLS","api.corp.local","2025-05-17"',
        '"VULN-007","Exposed Admin Panel","Critical",9.8,"Open","Exposed Service","admin.corp.local","2025-05-15"',
        '"VULN-008","Unnecessary Open Ports","High",8.6,"Open","Open Ports","dbserver.corp.local","2025-05-12"',
        '"VULN-009","Outdated Apache - RCE","Critical",9.8,"Open","Outdated","www.corp.local","2025-05-10"',
        '"VULN-010","Hardcoded Crypto Keys","Critical",9.1,"Open","Cryptography","git.corp.local","2025-04-29"',
      ].join('\n');
      const csvContent = csvHeaders + csvRows;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `threatscope-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addNotification({
        id: `notif-csv-${Date.now()}`,
        type: 'report_ready',
        title: 'CSV Exported',
        message: 'Vulnerability data exported as CSV file',
        timestamp: new Date().toISOString(),
        read: false,
      });
    } catch (err: any) {
      addNotification({
        id: `notif-err-${Date.now()}`,
        type: 'critical_finding',
        title: 'Export Failed',
        message: err.message || 'Failed to export CSV',
        timestamp: new Date().toISOString(),
        read: false,
      });
    } finally {
      setIsExportingCSV(false);
    }
  }, [addNotification]);

  const sectionOptions = [
    { key: 'executive' as const, label: 'Executive Summary' },
    { key: 'findings' as const, label: 'Vulnerability Findings' },
    { key: 'risk' as const, label: 'Risk Assessment' },
    { key: 'recommendations' as const, label: 'Recommendations' },
    { key: 'statistics' as const, label: 'Scan Statistics' },
  ];

  return (
    <div className="space-y-6 mesh-gradient-bg relative">
      {/* Ambient orbs for atmospheric depth */}
      <div className="ambient-orb" style={{ width: 450, height: 450, top: '5%', left: '-3%', background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)', animationDelay: '0s' }} />
      <div className="ambient-orb" style={{ width: 500, height: 500, bottom: '15%', right: '-6%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', animationDelay: '3s' }} />
      <div className="ambient-orb" style={{ width: 350, height: 350, top: '60%', left: '30%', background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)', animationDelay: '7s' }} />
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4"
      >
        <div className="flex-1">
          <h2 className="text-2xl font-bold threatscope-ai-title">Security Reports</h2>
          <p className="text-sm text-slate-400 mt-1">Generate and download comprehensive security reports</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            type="button"
            onClick={() => handleExportPDF()}
            disabled={isExportingPDF}
            whileHover={{ scale: isExportingPDF ? 1 : 1.05 }}
            whileTap={{ scale: isExportingPDF ? 1 : 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50 breathe-glow cyber-btn-3d"
          >
            {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            {isExportingPDF ? 'Generating...' : 'Export PDF'}
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleExportCSV()}
            disabled={isExportingCSV}
            whileHover={{ scale: isExportingCSV ? 1 : 1.05 }}
            whileTap={{ scale: isExportingCSV ? 1 : 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-50 cyber-btn-3d"
          >
            {isExportingCSV ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            {isExportingCSV ? 'Exporting...' : 'Export CSV'}
          </motion.button>
          <MiniGlobe size={90} className="shrink-0 hidden md:block" />
        </div>
      </motion.div>

      {/* Report Generator Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-card-float analytics-panel-elevated animated-gradient-border rounded-xl p-6 relative"
      >
        <div className="flex items-center gap-2 mb-5 relative z-10">
          <Plus className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-medium holo-text">Generate New Report</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 stagger-3d">
          {/* Report Type */}
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Report Type</label>
            <div className="space-y-2">
              {(['executive', 'technical', 'compliance'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setReportType(type)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                    reportType === type
                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                      : 'bg-slate-800/30 border border-slate-700/30 text-slate-400 hover:border-slate-600/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    reportType === type ? 'bg-cyan-500/20' : 'bg-slate-700/50'
                  }`}>
                    {type === 'executive' ? (
                      <FileText className="w-4 h-4" />
                    ) : type === 'technical' ? (
                      <FileSearch className="w-4 h-4" />
                    ) : (
                      <BarChart3 className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{typeLabels[type]}</p>
                    <p className="text-xs opacity-60">
                      {type === 'executive'
                        ? 'High-level summary for stakeholders'
                        : type === 'technical'
                          ? 'Detailed technical findings'
                          : 'Compliance audit results'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Date Range</label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">From</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">To</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Include Sections */}
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Include Sections</label>
            <div className="space-y-2">
              {sectionOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => toggleSection(opt.key)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left hover:bg-slate-800/30 transition-colors"
                >
                  {sections[opt.key] ? (
                    <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <span className={`text-sm ${sections[opt.key] ? 'text-slate-200' : 'text-slate-500'}`}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <motion.button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              whileHover={{ scale: isGenerating ? 1 : 1.02 }}
              whileTap={{ scale: isGenerating ? 1 : 0.98 }}
              className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed breathe-glow cyber-btn-3d"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Generate Report
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Generated Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass-card-float analytics-panel-elevated rounded-xl p-6 relative"
      >
        <h3 className="text-sm font-medium holo-text mb-4 relative z-10">Generated Reports</h3>

        {reports.length === 0 ? (
          <div className="text-center py-8 relative z-10">
            <FileText className="w-10 h-10 text-slate-700 mx-auto mb-3 float-animation" />
            <p className="text-sm text-slate-500">No reports generated yet. Create your first report above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto relative z-10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Report Name</th>
                  <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Type</th>
                  <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Generated</th>
                  <th className="text-right text-xs font-medium text-slate-500 pb-3 pr-4">Findings</th>
                  <th className="text-right text-xs font-medium text-slate-500 pb-3 pr-4">Risk</th>
                  <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Format</th>
                  <th className="text-right text-xs font-medium text-slate-500 pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="stagger-entrance">
                {reports.map((report) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="notification-card-3d border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="text-sm text-slate-200 font-medium truncate max-w-[200px]">{report.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <ReportTypeBadge type={report.type} />
                    </td>
                    <td className="py-3 pr-4 text-sm text-slate-400">
                      {new Date(report.generatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 text-sm text-slate-200 text-right font-medium">
                      {report.findingsCount}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className={`text-sm font-bold ${
                        report.riskScore >= 70 ? 'text-red-400'
                        : report.riskScore >= 40 ? 'text-yellow-400'
                        : 'text-emerald-400'
                      }`}>
                        {report.riskScore}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="badge-3d inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800/50 text-slate-400 border border-slate-700/30">
                        {report.format}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button
                          type="button"
                          onClick={() => setPreviewReport(report)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                          title="View Report"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => handleDownload(report)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Report Preview Modal */}
      <AnimatePresence>
        {previewReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setPreviewReport(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="glass-card-float neon-border-blue animated-gradient-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto data-stream"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-800 relative z-10">
                <h3 className="text-sm font-semibold holo-text">Report Preview</h3>
                <button
                  type="button"
                  onClick={() => setPreviewReport(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-60px)]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}>
                <ReportPreviewContent report={previewReport} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
