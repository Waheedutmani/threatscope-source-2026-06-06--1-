import { create } from "zustand";

// ─── Type Definitions ───────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "analyst" | "user";
  avatar?: string;
  status: "active" | "inactive";
  lastLogin: string;
  createdAt: string;
}

export interface Vulnerability {
  id: string;
  name: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  description: string;
  riskLevel: string;
  affectedAsset: string;
  recommendation: string;
  status: "open" | "in_progress" | "resolved" | "accepted";
  cvssScore: number;
  category: string;
  discoveredAt: string;
  cwe?: string;
}

export interface ScanResult {
  id: string;
  target: string;
  type: "quick" | "full" | "custom";
  status: "idle" | "scanning" | "completed" | "failed";
  progress: number;
  startedAt: string;
  completedAt?: string;
  vulnerabilities: Vulnerability[];
  riskScore: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: "scan_complete" | "critical_finding" | "report_ready" | "user_activity";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export type PageName =
  | "login"
  | "register"
  | "forgot-password"
  | "dashboard"
  | "scanner"
  | "results"
  | "analytics"
  | "reports"
  | "threat-intel"
  | "user-management"
  | "profile"
  | "settings"
  | "security-ops"
  | "security-score"
  | "attack-surface"
  | "scan-history"
  | "executive-dashboard"
  | "ai-analysis";

// ─── Default Users ──────────────────────────────────────────────────

const DEFAULT_USERS: User[] = [
  {
    id: "usr-001",
    name: "Alex Chen",
    email: "admin@vulnguard.com",
    role: "admin",
    avatar: "",
    status: "active",
    lastLogin: "2025-06-05T09:15:00Z",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "usr-002",
    name: "Sarah Mitchell",
    email: "analyst@vulnguard.com",
    role: "analyst",
    avatar: "",
    status: "active",
    lastLogin: "2025-06-05T08:30:00Z",
    createdAt: "2024-03-20T10:00:00Z",
  },
  {
    id: "usr-003",
    name: "James Rodriguez",
    email: "user@vulnguard.com",
    role: "user",
    avatar: "",
    status: "active",
    lastLogin: "2025-06-04T16:45:00Z",
    createdAt: "2024-06-10T14:00:00Z",
  },
  {
    id: "usr-004",
    name: "Priya Sharma",
    email: "priya.sharma@vulnguard.com",
    role: "analyst",
    avatar: "",
    status: "active",
    lastLogin: "2025-06-05T07:00:00Z",
    createdAt: "2024-02-28T09:30:00Z",
  },
  {
    id: "usr-005",
    name: "Michael Torres",
    email: "michael.t@vulnguard.com",
    role: "user",
    avatar: "",
    status: "inactive",
    lastLogin: "2025-05-20T11:00:00Z",
    createdAt: "2024-04-12T12:00:00Z",
  },
  {
    id: "usr-006",
    name: "Emily Watson",
    email: "emily.w@vulnguard.com",
    role: "analyst",
    avatar: "",
    status: "active",
    lastLogin: "2025-06-04T14:20:00Z",
    createdAt: "2024-07-05T08:45:00Z",
  },
  {
    id: "usr-007",
    name: "David Kim",
    email: "david.kim@vulnguard.com",
    role: "user",
    avatar: "",
    status: "active",
    lastLogin: "2025-06-03T10:30:00Z",
    createdAt: "2024-08-18T15:00:00Z",
  },
  {
    id: "usr-008",
    name: "Lisa Nguyen",
    email: "lisa.n@vulnguard.com",
    role: "admin",
    avatar: "",
    status: "active",
    lastLogin: "2025-06-05T06:45:00Z",
    createdAt: "2024-01-15T08:30:00Z",
  },
];

// Credentials for simulated auth (email -> password)
const CREDENTIALS: Record<string, string> = {
  "admin@vulnguard.com": "admin123",
  "analyst@vulnguard.com": "analyst123",
  "user@vulnguard.com": "user123",
};

// ─── Store Interface ────────────────────────────────────────────────

interface VulnGuardState {
  // Auth
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  forgotPassword: (email: string) => boolean;

  // Navigation
  currentPage: PageName;
  setCurrentPage: (page: PageName) => void;

  // Scans
  scans: ScanResult[];
  currentScan: ScanResult | null;
  addScan: (scan: ScanResult) => void;
  updateScan: (id: string, updates: Partial<ScanResult>) => void;
  setCurrentScan: (scan: ScanResult | null) => void;

  // Chat
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  addChatMessage: (message: ChatMessage) => void;
  setIsChatLoading: (loading: boolean) => void;
  clearChat: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: () => number;

  // Users (admin management)
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Vulnerabilities
  vulnerabilities: Vulnerability[];
  setVulnerabilities: (vulns: Vulnerability[]) => void;
  addVulnerability: (vuln: Vulnerability) => void;
  updateVulnerability: (id: string, updates: Partial<Vulnerability>) => void;
}

// ─── Store Implementation ───────────────────────────────────────────

export const useVulnGuardStore = create<VulnGuardState>((set, get) => ({
  // ── Auth ─────────────────────────────────────────────────────────
  isAuthenticated: false,
  user: null,

  login: (email: string, password: string) => {
    // Check predefined credentials first
    if (CREDENTIALS[email] && CREDENTIALS[email] === password) {
      const foundUser = DEFAULT_USERS.find((u) => u.email === email);
      if (foundUser) {
        set({
          isAuthenticated: true,
          user: { ...foundUser, lastLogin: new Date().toISOString() },
        });
        return true;
      }
    }
    // Check registered users (stored in the users list)
    const state = get();
    const registeredUser = state.users.find((u) => u.email === email);
    if (registeredUser) {
      // For registered users, accept any password matching the email pattern (simulated)
      set({
        isAuthenticated: true,
        user: { ...registeredUser, lastLogin: new Date().toISOString() },
      });
      return true;
    }
    return false;
  },

  register: (name: string, email: string, _password: string) => {
    const state = get();
    if (state.users.some((u) => u.email === email)) {
      return false; // Email already exists
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: "user",
      avatar: "",
      status: "active",
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    set({
      users: [...state.users, newUser],
      isAuthenticated: true,
      user: newUser,
    });
    return true;
  },

  logout: () => {
    set({ isAuthenticated: false, user: null, currentPage: "login" });
  },

  forgotPassword: (email: string) => {
    const state = get();
    return state.users.some((u) => u.email === email);
  },

  // ── Navigation ───────────────────────────────────────────────────
  currentPage: "login",
  setCurrentPage: (page) => set({ currentPage: page }),

  // ── Scans ────────────────────────────────────────────────────────
  scans: [],
  currentScan: null,

  addScan: (scan) =>
    set((state) => ({ scans: [scan, ...state.scans] })),

  updateScan: (id, updates) =>
    set((state) => ({
      scans: state.scans.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      currentScan:
        state.currentScan?.id === id
          ? { ...state.currentScan, ...updates }
          : state.currentScan,
    })),

  setCurrentScan: (scan) => set({ currentScan: scan }),

  // ── Chat ─────────────────────────────────────────────────────────
  chatMessages: [],
  isChatLoading: false,

  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),

  setIsChatLoading: (loading) => set({ isChatLoading: loading }),

  clearChat: () => set({ chatMessages: [] }),

  // ── Notifications ────────────────────────────────────────────────
  notifications: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  // ── Users ────────────────────────────────────────────────────────
  users: DEFAULT_USERS,

  addUser: (user) =>
    set((state) => ({ users: [...state.users, user] })),

  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
      user:
        state.user?.id === id ? { ...state.user, ...updates } : state.user,
    })),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),

  // ── Vulnerabilities ──────────────────────────────────────────────
  vulnerabilities: [],

  setVulnerabilities: (vulns) => set({ vulnerabilities: vulns }),

  addVulnerability: (vuln) =>
    set((state) => ({ vulnerabilities: [...state.vulnerabilities, vuln] })),

  updateVulnerability: (id, updates) =>
    set((state) => ({
      vulnerabilities: state.vulnerabilities.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      ),
    })),
}));
