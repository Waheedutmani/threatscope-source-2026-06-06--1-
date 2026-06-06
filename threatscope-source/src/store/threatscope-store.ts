import { create } from "zustand";

export type ActiveSection = "dashboard" | "scanner" | "threat-intel" | "risk-assessment" | "ai-assistant";

export type ScanState = "idle" | "scanning" | "complete";

export type Severity = "critical" | "high" | "medium" | "low";

export interface Vulnerability {
  id: string;
  cveId: string;
  title: string;
  description: string;
  severity: Severity;
  status: "open" | "in-progress" | "resolved";
  cvss: number;
  affectedSystem: string;
  discoveredAt: string;
}

export interface ScanFinding {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  port?: string;
  service?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ThreatScopeState {
  // Navigation
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;

  // Scanner
  scanState: ScanState;
  scanProgress: number;
  scanTarget: string;
  scanType: "quick" | "full" | "custom";
  scanFindings: ScanFinding[];
  setScanState: (state: ScanState) => void;
  setScanProgress: (progress: number) => void;
  setScanTarget: (target: string) => void;
  setScanType: (type: "quick" | "full" | "custom") => void;
  addScanFinding: (finding: ScanFinding) => void;
  resetScan: () => void;

  // Chat
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  addChatMessage: (message: ChatMessage) => void;
  setIsChatLoading: (loading: boolean) => void;
  clearChat: () => void;

  // Vulnerabilities
  vulnerabilities: Vulnerability[];
  setVulnerabilities: (vulns: Vulnerability[]) => void;
}

export const useThreatScopeStore = create<ThreatScopeState>((set) => ({
  // Navigation
  activeSection: "dashboard",
  setActiveSection: (section) => set({ activeSection: section }),

  // Scanner
  scanState: "idle",
  scanProgress: 0,
  scanTarget: "",
  scanType: "quick",
  scanFindings: [],
  setScanState: (state) => set({ scanState: state }),
  setScanProgress: (progress) => set({ scanProgress: progress }),
  setScanTarget: (target) => set({ scanTarget: target }),
  setScanType: (type) => set({ scanType: type }),
  addScanFinding: (finding) =>
    set((state) => ({ scanFindings: [...state.scanFindings, finding] })),
  resetScan: () =>
    set({ scanState: "idle", scanProgress: 0, scanFindings: [] }),

  // Chat
  chatMessages: [],
  isChatLoading: false,
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  setIsChatLoading: (loading) => set({ isChatLoading: loading }),
  clearChat: () => set({ chatMessages: [] }),

  // Vulnerabilities
  vulnerabilities: [],
  setVulnerabilities: (vulns) => set({ vulnerabilities: vulns }),
}));
