"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useThreatScopeStore, type Severity } from "@/store/threatscope-store";
import { simulatedScanFindings } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ScanSearch,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Bug,
  Shield,
  Zap,
  Terminal,
} from "lucide-react";
import { useCallback, useRef, useEffect } from "react";

function SeverityIcon({ severity }: { severity: Severity }) {
  switch (severity) {
    case "critical":
      return <XCircle className="h-4 w-4 text-red-400" />;
    case "high":
      return <AlertTriangle className="h-4 w-4 text-orange-400" />;
    case "medium":
      return <Info className="h-4 w-4 text-yellow-400" />;
    case "low":
      return <CheckCircle2 className="h-4 w-4 text-green-400" />;
  }
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const config = {
    critical: { className: "bg-red-500/20 text-red-400 border-red-500/30", label: "CRITICAL" },
    high: { className: "bg-orange-500/20 text-orange-400 border-orange-500/30", label: "HIGH" },
    medium: { className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "MEDIUM" },
    low: { className: "bg-green-500/20 text-green-400 border-green-500/30", label: "LOW" },
  };
  const c = config[severity];
  return (
    <Badge variant="outline" className={cn("font-mono text-[10px] font-bold", c.className)}>
      {c.label}
    </Badge>
  );
}

export function Scanner() {
  const {
    scanState,
    scanProgress,
    scanTarget,
    scanType,
    scanFindings,
    setScanState,
    setScanProgress,
    setScanTarget,
    setScanType,
    addScanFinding,
    resetScan,
  } = useThreatScopeStore();

  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const findingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const findingsIndexRef = useRef(0);

  const startScan = useCallback(() => {
    if (!scanTarget.trim()) return;

    resetScan();
    setScanState("scanning");
    findingsIndexRef.current = 0;

    let progress = 0;
    const totalDuration = scanType === "quick" ? 8000 : scanType === "full" ? 15000 : 12000;
    const interval = 200;
    const increment = (100 * interval) / totalDuration;

    scanIntervalRef.current = setInterval(() => {
      progress += increment + Math.random() * 0.5;
      if (progress >= 100) {
        progress = 100;
        setScanProgress(100);
        setScanState("complete");
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        if (findingIntervalRef.current) clearInterval(findingIntervalRef.current);
        // Add remaining findings
        while (findingsIndexRef.current < simulatedScanFindings.length) {
          const f = simulatedScanFindings[findingsIndexRef.current];
          addScanFinding({
            id: `finding-${Date.now()}-${findingsIndexRef.current}`,
            title: f.title,
            severity: f.severity,
            description: f.description,
            port: f.port,
            service: f.service,
            timestamp: new Date().toISOString(),
          });
          findingsIndexRef.current++;
        }
        return;
      }
      setScanProgress(Math.min(Math.floor(progress), 99));
    }, interval);

    // Add findings periodically
    const findingDelay = totalDuration / simulatedScanFindings.length;
    findingIntervalRef.current = setInterval(() => {
      if (findingsIndexRef.current < simulatedScanFindings.length) {
        const f = simulatedScanFindings[findingsIndexRef.current];
        addScanFinding({
          id: `finding-${Date.now()}-${findingsIndexRef.current}`,
          title: f.title,
          severity: f.severity,
          description: f.description,
          port: f.port,
          service: f.service,
          timestamp: new Date().toISOString(),
        });
        findingsIndexRef.current++;
      }
    }, findingDelay);
  }, [scanTarget, scanType, resetScan, setScanState, setScanProgress, addScanFinding]);

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      if (findingIntervalRef.current) clearInterval(findingIntervalRef.current);
    };
  }, []);

  const criticalCount = scanFindings.filter((f) => f.severity === "critical").length;
  const highCount = scanFindings.filter((f) => f.severity === "high").length;
  const mediumCount = scanFindings.filter((f) => f.severity === "medium").length;
  const lowCount = scanFindings.filter((f) => f.severity === "low").length;

  return (
    <div className="space-y-6">
      {/* Scan Configuration */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ScanSearch className="h-4 w-4 text-primary" />
              Vulnerability Scanner
            </CardTitle>
            <CardDescription className="text-xs">Configure and launch a vulnerability scan against your target</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter target URL or IP address (e.g., 192.168.1.0/24)"
                  value={scanTarget}
                  onChange={(e) => setScanTarget(e.target.value)}
                  disabled={scanState === "scanning"}
                  className="font-mono text-sm bg-background/50 border-border/50 focus:border-primary/50"
                />
              </div>
              <div className="flex gap-2">
                {(["quick", "full", "custom"] as const).map((type) => (
                  <Button
                    key={type}
                    variant={scanType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setScanType(type)}
                    disabled={scanState === "scanning"}
                    className={cn(
                      "capitalize text-xs",
                      scanType === type && "bg-primary text-primary-foreground"
                    )}
                  >
                    {type === "quick" && <Zap className="h-3 w-3 mr-1" />}
                    {type === "full" && <Shield className="h-3 w-3 mr-1" />}
                    {type === "custom" && <Bug className="h-3 w-3 mr-1" />}
                    {type}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={startScan}
                  disabled={scanState === "scanning" || !scanTarget.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  size="sm"
                >
                  <Play className="h-3 w-3 mr-1" />
                  {scanState === "idle" ? "Start Scan" : "Scanning..."}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetScan}
                  className="border-border/50"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Scan Type Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className={cn("p-2 rounded-lg border text-xs", scanType === "quick" ? "border-primary/30 bg-primary/5" : "border-border/30")}>
                <span className="font-medium">Quick Scan</span>
                <p className="text-muted-foreground mt-0.5">~8 min • Top 100 ports, common vulnerabilities</p>
              </div>
              <div className={cn("p-2 rounded-lg border text-xs", scanType === "full" ? "border-primary/30 bg-primary/5" : "border-border/30")}>
                <span className="font-medium">Full Scan</span>
                <p className="text-muted-foreground mt-0.5">~15 min • All 65535 ports, deep analysis</p>
              </div>
              <div className={cn("p-2 rounded-lg border text-xs", scanType === "custom" ? "border-primary/30 bg-primary/5" : "border-border/30")}>
                <span className="font-medium">Custom Scan</span>
                <p className="text-muted-foreground mt-0.5">~12 min • Selected ports, custom checks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Scan Progress */}
      {scanState !== "idle" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {scanState === "scanning" ? "Scan in Progress" : "Scan Complete"}
                  </span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                {scanState === "scanning" ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
                    <span>
                      {scanProgress < 20
                        ? "Initializing scan modules..."
                        : scanProgress < 40
                        ? "Enumerating ports and services..."
                        : scanProgress < 60
                        ? "Running vulnerability checks..."
                        : scanProgress < 80
                        ? "Performing deep analysis..."
                        : "Generating report..."}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-400" />
                    <span>Scan completed • {scanFindings.length} findings</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Scan Results Summary */}
      {scanState === "complete" && scanFindings.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Scan Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                  <p className="text-2xl font-bold font-mono text-red-400">{criticalCount}</p>
                  <p className="text-[10px] text-red-400/70 font-medium uppercase">Critical</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                  <p className="text-2xl font-bold font-mono text-orange-400">{highCount}</p>
                  <p className="text-[10px] text-orange-400/70 font-medium uppercase">High</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
                  <p className="text-2xl font-bold font-mono text-yellow-400">{mediumCount}</p>
                  <p className="text-[10px] text-yellow-400/70 font-medium uppercase">Medium</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                  <p className="text-2xl font-bold font-mono text-green-400">{lowCount}</p>
                  <p className="text-[10px] text-green-400/70 font-medium uppercase">Low</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Live Findings Feed */}
      {scanFindings.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Bug className="h-4 w-4 text-primary" />
                Live Findings
                <Badge variant="outline" className="font-mono text-[10px] ml-auto">
                  {scanFindings.length} discovered
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                <AnimatePresence>
                  {scanFindings.map((finding, i) => (
                    <motion.div
                      key={finding.id}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border/30 bg-background/30 hover:bg-accent/20 transition-colors"
                    >
                      <SeverityIcon severity={finding.severity} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{finding.title}</span>
                          <SeverityBadge severity={finding.severity} />
                          {finding.port && (
                            <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
                              Port {finding.port}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{finding.description}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">
                        {new Date(finding.timestamp).toLocaleTimeString()}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {scanState === "idle" && scanFindings.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <ScanSearch className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-muted-foreground">No scan results yet</h3>
              <p className="text-xs text-muted-foreground/60 mt-1">Enter a target and start a scan to discover vulnerabilities</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
