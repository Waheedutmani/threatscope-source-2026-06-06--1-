'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Moon,
  Sun,
  Globe,
  Clock,
  RefreshCw,
  Bell,
  BellRing,
  Shield,
  Key,
  Scan,
  Database,
  Trash2,
  Download,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─── Container/Item Animations ─────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ─── Component ─────────────────────────────────────────────────────

export function SettingsPage() {
  // General Settings
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('utc');
  const [autoRefresh, setAutoRefresh] = useState(30);

  // Notification Settings
  const [scanCompletion, setScanCompletion] = useState(true);
  const [criticalFinding, setCriticalFinding] = useState(true);
  const [reportReady, setReportReady] = useState(true);
  const [userActivity, setUserActivity] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Security Settings
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState([30]);
  const [apiKey] = useState('vg_sk_••••••••••••••••••••••••a7f3');

  // Scan Settings
  const [defaultScanType, setDefaultScanType] = useState('quick');
  const [maxConcurrent, setMaxConcurrent] = useState([3]);
  const [scanTimeout, setScanTimeout] = useState('60');
  const [autoScan, setAutoScan] = useState(false);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <Settings className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold threatscope-ai-title">Settings</h1>
          <p className="text-sm text-slate-400">Configure application preferences and security settings</p>
        </div>
      </motion.div>

      {/* General Settings */}
      <motion.div
        variants={itemVariants}
        className="glass-card-float rounded-xl p-6 depth-shadow-md"
      >
        <h3 className="text-sm font-semibold text-slate-200 mb-5 flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-400" />
          General Settings
        </h3>
        <div className="space-y-5">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-yellow-400" />}
              <div>
                <Label className="text-sm text-slate-200">Theme</Label>
                <p className="text-xs text-slate-500">Toggle between dark and light mode</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`px-3 py-1.5 text-xs rounded-l-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Moon className="w-3 h-3 inline mr-1" />
                Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`px-3 py-1.5 text-xs rounded-r-lg border transition-colors ${
                  theme === 'light'
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Sun className="w-3 h-3 inline mr-1" />
                Light
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-slate-400" />
              <div>
                <Label className="text-sm text-slate-200">Language</Label>
                <p className="text-xs text-slate-500">Select your preferred language</p>
              </div>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-36 bg-slate-800 border-slate-700 text-slate-200 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timezone */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <div>
                <Label className="text-sm text-slate-200">Timezone</Label>
                <p className="text-xs text-slate-500">Set your local timezone</p>
              </div>
            </div>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-slate-200 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="utc">UTC (±0:00)</SelectItem>
                <SelectItem value="est">EST (UTC-5)</SelectItem>
                <SelectItem value="pst">PST (UTC-8)</SelectItem>
                <SelectItem value="cet">CET (UTC+1)</SelectItem>
                <SelectItem value="jst">JST (UTC+9)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Auto-refresh Interval */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-slate-400" />
              <div>
                <Label className="text-sm text-slate-200">Auto-Refresh Interval</Label>
                <p className="text-xs text-slate-500">How often data refreshes automatically</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-40">
              <Slider
                value={[autoRefresh]}
                onValueChange={(v) => setAutoRefresh(v[0])}
                min={5}
                max={120}
                step={5}
                className="flex-1"
              />
              <span className="text-xs text-slate-400 w-10 text-right">{autoRefresh}s</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        variants={itemVariants}
        className="glass-card-float rounded-xl p-6 depth-shadow-md"
      >
        <h3 className="text-sm font-semibold text-slate-200 mb-5 flex items-center gap-2">
          <Bell className="w-4 h-4 text-yellow-400" />
          Notification Settings
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Scan Completion', desc: 'Get notified when scans finish', icon: Scan, checked: scanCompletion, onChange: setScanCompletion },
            { label: 'Critical Finding Alerts', desc: 'Immediate alerts for critical vulnerabilities', icon: Shield, checked: criticalFinding, onChange: setCriticalFinding },
            { label: 'Report Ready', desc: 'Notification when reports are generated', icon: Database, checked: reportReady, onChange: setReportReady },
            { label: 'User Activity', desc: 'Updates on user login and activity', icon: BellRing, checked: userActivity, onChange: setUserActivity },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <div>
                    <Label className="text-sm text-slate-200">{item.label}</Label>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <Switch
                  checked={item.checked}
                  onCheckedChange={item.onChange}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            );
          })}

          {/* Email Notifications */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-slate-500" />
              <div>
                <Label className="text-sm text-slate-200">Email Notifications</Label>
                <p className="text-xs text-slate-500">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        variants={itemVariants}
        className="glass-card-float rounded-xl p-6 depth-shadow-md"
      >
        <h3 className="text-sm font-semibold text-slate-200 mb-5 flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-400" />
          Security Settings
        </h3>
        <div className="space-y-5">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-slate-500" />
              <div>
                <Label className="text-sm text-slate-200">Two-Factor Authentication</Label>
                <p className="text-xs text-slate-500">Add an extra layer of security to your account</p>
              </div>
            </div>
            <Switch
              checked={twoFactor}
              onCheckedChange={setTwoFactor}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          {/* Session Timeout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <div>
                <Label className="text-sm text-slate-200">Session Timeout</Label>
                <p className="text-xs text-slate-500">Auto-logout after inactivity</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-48">
              <Slider
                value={sessionTimeout}
                onValueChange={setSessionTimeout}
                min={5}
                max={120}
                step={5}
                className="flex-1"
              />
              <span className="text-xs text-slate-400 w-14 text-right">{sessionTimeout[0]} min</span>
            </div>
          </div>

          {/* API Key */}
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-slate-500" />
              <div>
                <Label className="text-sm text-slate-200">API Key</Label>
                <p className="text-xs text-slate-500 font-mono">{apiKey}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-orange-500/20 text-orange-400 hover:bg-orange-500/10 text-xs gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              Regenerate
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Scan Settings */}
      <motion.div
        variants={itemVariants}
        className="glass-card-float rounded-xl p-6 depth-shadow-md"
      >
        <h3 className="text-sm font-semibold text-slate-200 mb-5 flex items-center gap-2">
          <Scan className="w-4 h-4 text-cyan-400" />
          Scan Settings
        </h3>
        <div className="space-y-5">
          {/* Default Scan Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scan className="w-4 h-4 text-slate-400" />
              <div>
                <Label className="text-sm text-slate-200">Default Scan Type</Label>
                <p className="text-xs text-slate-500">Pre-selected scan type when starting new scans</p>
              </div>
            </div>
            <Select value={defaultScanType} onValueChange={setDefaultScanType}>
              <SelectTrigger className="w-36 bg-slate-800 border-slate-700 text-slate-200 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="quick">Quick Scan</SelectItem>
                <SelectItem value="full">Full Scan</SelectItem>
                <SelectItem value="custom">Custom Scan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Max Concurrent Scans */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-slate-400" />
              <div>
                <Label className="text-sm text-slate-200">Max Concurrent Scans</Label>
                <p className="text-xs text-slate-500">Maximum number of scans running simultaneously</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-40">
              <Slider
                value={maxConcurrent}
                onValueChange={setMaxConcurrent}
                min={1}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-slate-400 w-6 text-right">{maxConcurrent[0]}</span>
            </div>
          </div>

          {/* Scan Timeout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <div>
                <Label className="text-sm text-slate-200">Scan Timeout</Label>
                <p className="text-xs text-slate-500">Maximum duration before a scan is terminated</p>
              </div>
            </div>
            <Select value={scanTimeout} onValueChange={setScanTimeout}>
              <SelectTrigger className="w-36 bg-slate-800 border-slate-700 text-slate-200 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
                <SelectItem value="0">No limit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Auto-Scan Schedule */}
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-500" />
              <div>
                <Label className="text-sm text-slate-200">Auto-Scan Schedule</Label>
                <p className="text-xs text-slate-500">Automatically run scans on a schedule</p>
              </div>
            </div>
            <Switch
              checked={autoScan}
              onCheckedChange={setAutoScan}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Data & Privacy */}
      <motion.div
        variants={itemVariants}
        className="glass-card-float rounded-xl p-6 depth-shadow-md"
      >
        <h3 className="text-sm font-semibold text-slate-200 mb-5 flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          Data & Privacy
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-slate-500" />
              <div>
                <Label className="text-sm text-slate-200">Export All Data</Label>
                <p className="text-xs text-slate-500">Download all your data in JSON format</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 text-xs gap-1.5"
            >
              <Download className="w-3 h-3" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-red-500/70" />
              <div>
                <Label className="text-sm text-slate-200">Clear Scan History</Label>
                <p className="text-xs text-slate-500">Permanently delete all scan history data</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs gap-1.5"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-slate-500" />
              <div>
                <Label className="text-sm text-slate-200">Privacy Policy</Label>
                <p className="text-xs text-slate-500">View our data handling and privacy practices</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-400 hover:bg-slate-800 text-xs gap-1.5"
            >
              <ExternalLink className="w-3 h-3" />
              View
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
