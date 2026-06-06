'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Send,
  X,
  Minus,
  ShieldAlert,
  AlertTriangle,
  Wrench,
  BookOpen,
  User,
  Bot,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Maximize2,
  Minimize2,
  Code2,
  Activity,
  FileSearch,
  BarChart3,
  Shield,
  Lock,
  Zap,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useVulnGuardStore, type ChatMessage } from '@/store/vulnguard-store';

// ─── Quick Action Chips ─────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: 'Analyze Latest Scan', icon: Activity, color: 'blue' },
  { label: 'Explain Critical Vulnerabilities', icon: ShieldAlert, color: 'red' },
  { label: 'Show Security Recommendations', icon: Shield, color: 'purple' },
  { label: 'Summarize Findings', icon: FileSearch, color: 'cyan' },
  { label: 'Executive Security Summary', icon: BarChart3, color: 'amber' },
  { label: 'Security Best Practices', icon: Lock, color: 'emerald' },
  { label: 'Risk Assessment Overview', icon: AlertTriangle, color: 'red' },
  { label: 'Business Impact Analysis', icon: Wrench, color: 'purple' },
];

const SUGGESTED_PROMPTS = [
  'What is SQL Injection and how do I fix it?',
  'Explain OWASP Top 10 risks',
  'Provide an executive security summary for leadership',
  'What are the most critical CVEs right now?',
  'How to secure SSH on production servers?',
  'Give me a business impact analysis of our vulnerabilities',
  'Explain defense-in-depth strategy',
  'What is our current security posture evaluation?',
];

// ─── ThreatScope AI Status Badge ─────────────────────────────────────

function StatusBadge() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
      </span>
      <p className="text-[11px] text-blue-400/90 font-medium tracking-wide">ONLINE</p>
      <span className="text-[10px] text-slate-500 mx-1">|</span>
      <p className="text-[11px] text-purple-400/80">Security Copilot</p>
    </div>
  );
}

// ─── Typing Indicator (Premium Wave Effect with Blue Glow) ──────────

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 px-4 py-2">
      <div
        className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 neon-glow-blue"
      >
        <Bot className="w-4 h-4 text-blue-400" />
      </div>
      <div
        className="bg-slate-800/90 backdrop-blur-md border border-blue-500/15 rounded-2xl rounded-tl-sm px-5 py-3.5"
        style={{
          boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 15px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
      >
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
              animate={{
                y: [0, -12, 0],
                scale: [1, 1.4, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
              style={{
                boxShadow: '0 0 10px rgba(59,130,246,0.6), 0 0 20px rgba(139,92,246,0.3)',
              }}
            />
          ))}
        </div>
        <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
          <Terminal className="w-3 h-3" />
          ThreatScope AI is analyzing...
        </p>
      </div>
    </div>
  );
}

// ─── Chat Message Bubble (Enhanced with Blue Gradient & Dark Glass) ─

function ChatMessageBubble({ message, onCopy }: { message: ChatMessage; onCopy: (text: string) => void }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const formattedTime = (() => {
    try {
      return new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  })();

  const handleCopy = () => {
    onCopy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20, y: 5, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex items-start gap-2.5 px-4 py-1.5 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <motion.div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
          isUser
            ? 'bg-gradient-to-br from-blue-500/25 to-purple-500/20 border border-blue-500/30 neon-glow-blue'
            : 'bg-gradient-to-br from-blue-500/20 to-purple-500/10 border border-blue-500/30'
        }`}
        style={{
          boxShadow: isUser
            ? '0 0 12px rgba(59,130,246,0.3)'
            : '0 0 10px rgba(59,130,246,0.2)',
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        {isUser ? (
          <User className="w-4 h-4 text-blue-400" />
        ) : (
          <Bot className="w-4 h-4 text-blue-400" />
        )}
      </motion.div>

      {/* Message Content */}
      <div className={`relative max-w-[80%] group/msg`}>
        <div
          className={`rounded-2xl px-4 py-2.5 transition-all duration-200 ${
            isUser
              ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/20 border border-blue-500/25 rounded-tr-sm text-slate-100'
              : 'bg-slate-800/80 backdrop-blur-md border border-blue-500/10 rounded-tl-sm text-slate-200 hover:border-blue-500/20'
          }`}
          style={{
            transform: isUser
              ? 'perspective(600px) translateZ(8px)'
              : 'perspective(600px) translateZ(4px)',
            boxShadow: isUser
              ? '0 4px 20px rgba(0,0,0,0.3), 0 0 20px rgba(59,130,246,0.12), 0 0 40px rgba(139,92,246,0.06), inset 0 1px 0 rgba(255,255,255,0.06)'
              : '0 4px 16px rgba(0,0,0,0.25), 0 0 15px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="text-sm prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-slate-100 prose-headings:mb-1 prose-headings:mt-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-code:text-blue-300 prose-code:bg-slate-700/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-[''] prose-code:after:content-[''] prose-strong:text-slate-100 prose-a:text-blue-400">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
          <div className={`flex items-center gap-2 mt-1.5 ${isUser ? 'justify-end' : 'justify-between'}`}>
            <p
              className={`text-[10px] ${
                isUser ? 'text-blue-400/50' : 'text-slate-500'
              }`}
            >
              {formattedTime}
            </p>
            {/* Copy button for AI messages */}
            {!isUser && (
              <motion.button
                onClick={handleCopy}
                className="opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200
                  flex items-center gap-1 text-[10px] text-slate-500 hover:text-blue-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Quick Actions Row ──────────────────────────────────────────────

function QuickActions({ onAction }: { onAction: (text: string) => void }) {
  const colorClasses: Record<string, string> = {
    red: 'border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 text-red-300 hover:shadow-[0_0_10px_rgba(239,68,68,0.15)]',
    amber: 'border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/10 text-amber-300 hover:shadow-[0_0_10px_rgba(245,158,11,0.15)]',
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/10 text-cyan-300 hover:shadow-[0_0_10px_rgba(6,182,212,0.15)]',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-300 hover:shadow-[0_0_10px_rgba(16,185,129,0.15)]',
    purple: 'border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/10 text-purple-300 hover:shadow-[0_0_10px_rgba(168,85,247,0.15)]',
    blue: 'border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/10 text-blue-300 hover:shadow-[0_0_10px_rgba(59,130,246,0.15)]',
  };

  return (
    <div className="px-4 pb-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center">
          <Zap className="w-3 h-3 text-blue-400" />
        </div>
        <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
          Quick Actions
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.button
            key={action.label}
            onClick={() => onAction(action.label)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
              bg-slate-800/60 border transition-all duration-200 cursor-pointer
              ${colorClasses[action.color] || colorClasses.blue}`}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <action.icon className="w-3.5 h-3.5" />
            {action.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Suggested Prompts ──────────────────────────────────────────────

function SuggestedPrompts({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className="px-4 pb-3">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
          Try Asking
        </p>
      </div>
      <div className="space-y-1.5">
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <motion.button
            key={prompt}
            onClick={() => onPrompt(prompt)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs
              bg-slate-800/40 border border-slate-700/30 text-slate-400
              hover:bg-slate-800/70 hover:border-blue-500/20 hover:text-slate-200
              transition-all duration-200 group/prompt cursor-pointer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <ChevronRight className="w-3 h-3 text-blue-500/60 group-hover/prompt:text-blue-400 transition-colors shrink-0" />
            <span className="truncate">{prompt}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Scan Awareness Banner ──────────────────────────────────────────

function ScanAwarenessBanner({ onClick }: { onClick: () => void }) {
  const { currentScan, scans } = useVulnGuardStore();

  if (!currentScan && scans.length === 0) return null;

  const latestScan = currentScan || scans[0];
  if (!latestScan) return null;

  const criticalCount = (latestScan.vulnerabilities || []).filter(
    (v) => v.severity === 'critical'
  ).length;
  const highCount = (latestScan.vulnerabilities || []).filter(
    (v) => v.severity === 'high'
  ).length;
  const totalVulns = (latestScan.vulnerabilities || []).length;

  if (totalVulns === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/15 cursor-pointer hover:border-blue-500/30 transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Activity className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-[11px] text-blue-400 font-semibold uppercase tracking-wider">Scan Awareness</span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        {criticalCount > 0 && <span className="text-red-400 font-medium">{criticalCount} critical</span>}
        {criticalCount > 0 && highCount > 0 && <span className="text-slate-500">, </span>}
        {highCount > 0 && <span className="text-orange-400 font-medium">{highCount} high</span>}
        {(criticalCount > 0 || highCount > 0) && <span className="text-slate-500"> — </span>}
        <span>{totalVulns} vulnerabilities detected on {latestScan.target}</span>
      </p>
      <p className="text-[10px] text-blue-400/60 mt-1 flex items-center gap-1">
        Click to analyze <ChevronRight className="w-3 h-3" />
      </p>
    </motion.div>
  );
}

// ─── Main AI Assistant Component ────────────────────────────────────

export function AIAssistant() {
  const {
    chatMessages,
    isChatLoading,
    addChatMessage,
    setIsChatLoading,
    clearChat,
    isAuthenticated,
    currentScan,
    scans,
    user,
    vulnerabilities,
  } = useVulnGuardStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [hasUnread, setHasUnread] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [wasPanelSeen, setWasPanelSeen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitializedRef = useRef(false);

  // Get role-based welcome message
  const getWelcomeMessage = useCallback(() => {
    const role = user?.role || 'user';
    const roleLabel = role === 'admin' ? 'Administrator' : role === 'analyst' ? 'Security Analyst' : 'User';

    const capabilities = role === 'admin'
      ? `- **System-wide Analysis** — Full vulnerability assessment across all assets
- **Report Generation** — AI-assisted security report drafting
- **User & Access Management** — Role-based security guidance
- **Threat Intelligence** — Real-time threat landscape briefings
- **Compliance Auditing** — NIST, OWASP, CIS, ISO 27001 checks
- **Remediation Planning** — Prioritized fix recommendations`
      : role === 'analyst'
      ? `- **Vulnerability Analysis** — Deep-dive into scan findings and CVEs
- **Threat Interpretation** — Attack vector and impact analysis
- **Remediation Guidance** — Step-by-step fix instructions
- **Risk Scoring** — CVSS and risk assessment explanations
- **Threat Intelligence** — CVE research and threat feeds
- **Scan Interpretation** — Convert raw scan data into insights`
      : `- **Scan Explanations** — Understand your personal scan results
- **Basic Security Guidance** — Security best practices
- **Vulnerability Basics** — Learn about common security issues
- **Safe Browsing Tips** — Stay safe online
- **Password Security** — Strengthen your authentication`;

    // Build scan context summary
    const latestScan = currentScan || scans[0];
    let scanContext = '';
    if (latestScan && latestScan.vulnerabilities?.length > 0) {
      const crit = latestScan.vulnerabilities.filter(v => v.severity === 'critical').length;
      const high = latestScan.vulnerabilities.filter(v => v.severity === 'high').length;
      const med = latestScan.vulnerabilities.filter(v => v.severity === 'medium').length;
      const low = latestScan.vulnerabilities.filter(v => v.severity === 'low').length;
      scanContext = `

**Current Scan Context:**
Target: \`${latestScan.target}\` | Risk Score: **${latestScan.riskScore}/100**
${crit > 0 ? `🔴 ${crit} Critical` : ''}${high > 0 ? ` 🟠 ${high} High` : ''}${med > 0 ? ` 🟡 ${med} Medium` : ''}${low > 0 ? ` 🟢 ${low} Low` : ''}
Use "Analyze Latest Scan" to get detailed insights.`;
    }

    return `# ThreatScope AI — Security Copilot

Welcome, **${roleLabel}**! I'm your AI-powered cybersecurity analyst. I specialize in vulnerability assessment, threat intelligence, and security remediation.

**What I can help with:**
${capabilities}
${scanContext}

How can I help secure your environment today?`;
  }, [user, currentScan, scans]);

  // Add welcome message when chat is first opened
  useEffect(() => {
    if (isOpen && chatMessages.length === 0 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      addChatMessage({
        id: `msg-welcome-${Date.now()}`,
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date().toISOString(),
      });
    }
  }, [isOpen, chatMessages.length, addChatMessage, getWelcomeMessage]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  // Track unread messages when panel is closed
  useEffect(() => {
    if (!isOpen && chatMessages.length > 0 && wasPanelSeen) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg.role === 'assistant') {
        setHasUnread(true);
      }
    }
  }, [chatMessages, isOpen, wasPanelSeen]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    });
  }, []);

  const buildScanContext = useCallback(() => {
    const latestScan = currentScan || scans[0];
    if (!latestScan) return '';

    const vulns = latestScan.vulnerabilities || [];
    const critVulns = vulns.filter(v => v.severity === 'critical');
    const highVulns = vulns.filter(v => v.severity === 'high');

    let context = `\n\n[SCAN CONTEXT - Available to AI for analysis]\n`;
    context += `Target: ${latestScan.target}\n`;
    context += `Scan Type: ${latestScan.type}\n`;
    context += `Status: ${latestScan.status}\n`;
    context += `Risk Score: ${latestScan.riskScore}/100\n`;
    context += `Total Vulnerabilities: ${vulns.length}\n`;
    context += `Critical: ${critVulns.length}, High: ${highVulns.length}\n`;

    if (critVulns.length > 0) {
      context += `\nCritical Vulnerabilities:\n`;
      critVulns.slice(0, 5).forEach(v => {
        context += `- ${v.name} (CVSS: ${v.cvssScore}) on ${v.affectedAsset} [${v.status}]\n`;
      });
    }
    if (highVulns.length > 0) {
      context += `\nHigh Severity Vulnerabilities:\n`;
      highVulns.slice(0, 5).forEach(v => {
        context += `- ${v.name} (CVSS: ${v.cvssScore}) on ${v.affectedAsset} [${v.status}]\n`;
      });
    }

    // Add general vulnerability data
    if (vulnerabilities.length > 0) {
      const openVulns = vulnerabilities.filter(v => v.status === 'open');
      const inProgressVulns = vulnerabilities.filter(v => v.status === 'in_progress');
      context += `\nGlobal Vulnerability Stats:\n`;
      context += `Total: ${vulnerabilities.length}, Open: ${openVulns.length}, In Progress: ${inProgressVulns.length}\n`;
    }

    return context;
  }, [currentScan, scans, vulnerabilities]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isChatLoading) return;

      // Add user message
      const userMessage: ChatMessage = {
        id: `msg-user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(userMessage);
      setInput('');
      setIsChatLoading(true);

      try {
        const allMessages = [
          ...chatMessages.filter((_, i) => i > 0 || chatMessages[0]?.role !== 'assistant' || chatMessages.length === 0),
          userMessage,
        ].map((m) => ({ role: m.role, content: m.content }));

        // Include scan context for scan-aware intelligence
        const scanContext = buildScanContext();

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: allMessages,
            scanContext,
            userRole: user?.role || 'user',
          }),
        });

        const data = await res.json();

        const assistantMessage: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          role: 'assistant',
          content: data.content || data.message || 'I apologize, I could not process your security query. Please try again.',
          timestamp: new Date().toISOString(),
        };
        addChatMessage(assistantMessage);
      } catch {
        const errorMessage: ChatMessage = {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: `## Connection Error\n\nI'm unable to connect to the ThreatScope AI engine. This could be due to:\n\n- **Network connectivity issues** — Check your internet connection\n- **AI service temporarily unavailable** — Try again in a moment\n- **Firewall restrictions** — Ensure API endpoints are accessible\n\nFor urgent security matters, contact your Security Operations team directly.`,
          timestamp: new Date().toISOString(),
        };
        addChatMessage(errorMessage);
      } finally {
        setIsChatLoading(false);
      }
    },
    [chatMessages, isChatLoading, addChatMessage, setIsChatLoading, buildScanContext, user]
  );

  const handleAnalyzeScan = useCallback(() => {
    const latestScan = currentScan || scans[0];
    if (latestScan && latestScan.vulnerabilities?.length > 0) {
      const crit = latestScan.vulnerabilities.filter(v => v.severity === 'critical').length;
      const high = latestScan.vulnerabilities.filter(v => v.severity === 'high').length;
      sendMessage(`Analyze the latest scan of ${latestScan.target} with ${latestScan.vulnerabilities.length} vulnerabilities (${crit} critical, ${high} high). Risk score is ${latestScan.riskScore}/100. Provide a detailed security assessment.`);
    } else {
      sendMessage('Analyze the latest scan results and provide a security assessment.');
    }
  }, [currentScan, scans, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnread(false);
    setWasPanelSeen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setIsExpanded(false);
    setHasUnread(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
    setHasUnread(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Only render when authenticated
  if (!isAuthenticated) return null;

  const panelWidth = isExpanded ? 'w-[620px]' : 'w-[420px]';
  const panelHeight = isExpanded ? 'h-[750px]' : 'h-[620px]';

  return (
    <>
      {/* ── Floating Action Button (Enhanced with Neon Glow & Pulse Ring) ── */}
      <AnimatePresence>
        {!isOpen || isMinimized ? (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
            }}
            onClick={isMinimized ? handleRestore : handleOpen}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full
              bg-gradient-to-br from-blue-600 to-purple-700
              flex items-center justify-center text-white transition-all duration-300
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
              neon-glow-blue group/fab"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Open ThreatScope AI Assistant"
            style={{
              boxShadow: '0 0 8px rgba(59,130,246,0.4), 0 0 20px rgba(59,130,246,0.2), 0 0 40px rgba(59,130,246,0.1), 0 0 80px rgba(59,130,246,0.05)',
            }}
          >
            {/* Pulsing ring using ::before pseudo-element via CSS class */}
            <span
              className="absolute -inset-2 rounded-full"
              style={{
                animation: 'threatscope-pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                pointerEvents: 'none',
              }}
            />

            {/* Rotating gradient ring */}
            <div
              className="absolute -inset-1.5 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5), rgba(59,130,246,0.1), rgba(139,92,246,0.3), rgba(59,130,246,0.5))',
                animation: 'rotate-ring 4s linear infinite',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                padding: '2px',
                borderRadius: '50%',
              }}
            />
            <Brain className="w-6 h-6 relative z-10" />

            {/* Pulse ring effect (additional layer) */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-400/40"
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />

            {/* Unread indicator */}
            <AnimatePresence>
              {hasUnread && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-slate-900
                    flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                >
                  !
                </motion.span>
              )}
            </AnimatePresence>

            {/* Minimized active indicator */}
            {isMinimized && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-slate-900
                  flex items-center justify-center shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </motion.span>
            )}

            {/* Tooltip */}
            <div className="absolute right-full mr-3 px-3 py-1.5 bg-slate-800/95 border border-blue-500/20 rounded-lg text-xs text-slate-200 whitespace-nowrap opacity-0 group-hover/fab:opacity-100 transition-opacity duration-200 pointer-events-none"
              style={{ boxShadow: '0 0 15px rgba(59,130,246,0.15)' }}
            >
              ThreatScope AI
            </div>
          </motion.button>
        ) : null}
      </AnimatePresence>

      {/* ── Chat Panel (Enhanced with ai-panel-float & 3D Perspective) ── */}
      <AnimatePresence>
        {isOpen && !isMinimized ? (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.8, rotateX: 8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-8 right-8 z-50 ${panelWidth} max-w-[calc(100vw-4rem)]
              ${panelHeight} max-h-[calc(100vh-6rem)]
              ai-panel-float
              flex flex-col overflow-hidden transition-all duration-300`}
            style={{
              perspective: '1200px',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* ── Animated gradient top border ── */}
            <div className="h-[2px] w-full shrink-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), rgba(139,92,246,0.6), rgba(59,130,246,0.6), transparent)',
                backgroundSize: '200% 100%',
                animation: 'holo-shimmer 3s ease-in-out infinite',
              }}
            />

            {/* ── Header (Blue-Purple Gradient with glass-inner-light) ── */}
            <div className="glass-inner-light flex items-center gap-3 px-4 py-3 border-b border-blue-500/10 bg-gradient-to-r from-blue-950/60 via-slate-900/90 to-purple-950/60 relative overflow-hidden shrink-0">
              {/* Holographic shimmer background */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, transparent 40%, rgba(139,92,246,0.05) 100%)',
                }}
              />

              {/* AI Avatar */}
              <div className="relative z-10">
                <motion.div
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/25 to-purple-500/20 border border-blue-500/30
                    flex items-center justify-center neon-glow-blue"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Brain className="w-5 h-5 text-blue-400" />
                </motion.div>
                {/* Online status dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-400 border-2 border-slate-900">
                  <motion.span
                    className="absolute inset-0 rounded-full bg-blue-400"
                    animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </span>
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0 relative z-10">
                <h3 className="text-sm font-bold text-slate-100 leading-tight">
                  <span className="threatscope-ai-title">ThreatScope AI</span>
                </h3>
                <StatusBadge />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 relative z-10">
                <motion.button
                  onClick={toggleExpand}
                  className="w-7 h-7 rounded-lg flex items-center justify-center
                    text-slate-400 hover:text-blue-400 hover:bg-blue-500/10
                    transition-colors duration-200 focus:outline-none"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isExpanded ? 'Shrink panel' : 'Expand panel'}
                  title={isExpanded ? 'Shrink' : 'Expand'}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </motion.button>
                <motion.button
                  onClick={() => {
                    clearChat();
                    hasInitializedRef.current = false;
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center
                    text-slate-400 hover:text-amber-400 hover:bg-amber-500/10
                    transition-colors duration-200 focus:outline-none"
                  whileHover={{ scale: 1.1, rotate: -180 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </motion.button>
                <button
                  onClick={handleMinimize}
                  className="w-7 h-7 rounded-lg flex items-center justify-center
                    text-slate-400 hover:text-slate-200 hover:bg-slate-700/50
                    transition-colors duration-200 focus:outline-none"
                  aria-label="Minimize chat"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center
                    text-slate-400 hover:text-red-400 hover:bg-red-500/10
                    transition-colors duration-200 focus:outline-none"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Messages Area ── */}
            <div className="flex-1 overflow-y-auto py-3 custom-scrollbar relative">
              {/* Subtle grid overlay */}
              <div className="absolute inset-0 cyber-grid-overlay opacity-20 pointer-events-none" />

              {/* Scan Awareness Banner */}
              {chatMessages.length <= 1 && (
                <ScanAwarenessBanner onClick={handleAnalyzeScan} />
              )}

              {/* Quick Actions (shown when there are minimal messages) */}
              {chatMessages.length <= 1 && (
                <QuickActions onAction={sendMessage} />
              )}

              {/* Suggested Prompts (shown on welcome) */}
              {chatMessages.length <= 1 && (
                <SuggestedPrompts onPrompt={sendMessage} />
              )}

              {/* Messages */}
              {chatMessages.map((msg) => (
                <ChatMessageBubble key={msg.id} message={msg} onCopy={copyToClipboard} />
              ))}

              {/* Typing Indicator */}
              <AnimatePresence>
                {isChatLoading && <TypingIndicator />}
              </AnimatePresence>

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Input Area (Enhanced with neon-border-blue on focus) ── */}
            <div className="px-3 py-3 border-t border-blue-500/10 bg-slate-900/80 backdrop-blur-sm shrink-0">
              {/* Quick actions shortcut row when chat has history */}
              {chatMessages.length > 1 && (
                <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1 custom-scrollbar">
                  {QUICK_ACTIONS.slice(0, 6).map((action) => (
                    <motion.button
                      key={action.label}
                      onClick={() => {
                        if (action.label === 'Analyze Latest Scan') {
                          handleAnalyzeScan();
                        } else {
                          sendMessage(action.label);
                        }
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap
                        bg-slate-800/60 border border-slate-700/50 text-slate-400
                        hover:border-blue-500/30 hover:text-blue-300 transition-all duration-200 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <action.icon className="w-3 h-3" />
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="Ask about vulnerabilities, threats, remediation..."
                    disabled={isChatLoading}
                    className={`w-full h-10 px-4 pr-10 rounded-xl
                      bg-slate-800/80 border text-sm text-slate-100 placeholder:text-slate-500
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200
                      ${inputFocused ? 'neon-border-blue border-blue-500/30' : 'border-blue-500/10'}`}
                    maxLength={500}
                    aria-label="Chat message input"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500/40" />
                  </div>
                </div>
                <motion.button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isChatLoading}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-700
                    flex items-center justify-center text-white
                    hover:from-blue-500 hover:to-purple-600
                    disabled:opacity-30 disabled:cursor-not-allowed
                    transition-all duration-200 press-3d
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  style={{
                    boxShadow: input.trim() && !isChatLoading
                      ? '0 0 15px rgba(59,130,246,0.4), 0 0 30px rgba(139,92,246,0.2), 0 0 50px rgba(59,130,246,0.1)'
                      : 'none',
                  }}
                  whileHover={input.trim() && !isChatLoading ? { scale: 1.08 } : {}}
                  whileTap={input.trim() && !isChatLoading ? { scale: 0.92 } : {}}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              {/* Character count */}
              {input.length > 400 && (
                <p className="text-[10px] text-slate-600 mt-1 text-right">
                  {input.length}/500
                </p>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
