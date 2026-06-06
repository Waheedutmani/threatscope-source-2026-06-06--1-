"use client";

import { motion } from "framer-motion";
import type { Severity } from "@/store/threatscope-store";
import {
  complianceData,
  remediationMatrix,
  riskTrend,
} from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function RiskGauge({ score }: { score: number }) {
  // Determine color based on score
  const getColor = (s: number) => {
    if (s >= 80) return "#22c55e";
    if (s >= 60) return "#eab308";
    if (s >= 40) return "#f97316";
    return "#ef4444";
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 80;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        {/* Background arc */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="oklch(0.22 0.01 260)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circumference / 2} ${circumference / 2}`}
          transform="rotate(180, 100, 100)"
        />
        {/* Score arc */}
        <motion.circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          transform="rotate(180, 100, 100)"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
        {/* Score text */}
        <text
          x="100"
          y="95"
          textAnchor="middle"
          className="fill-foreground text-3xl font-bold"
          style={{ fontSize: "2rem", fontFamily: "monospace" }}
        >
          {score}
        </text>
        <text
          x="100"
          y="115"
          textAnchor="middle"
          className="fill-muted-foreground text-xs"
          style={{ fontSize: "0.65rem" }}
        >
          RISK SCORE
        </text>
      </svg>
    </div>
  );
}

function ComplianceCard({
  framework,
  score,
  totalChecks,
  passedChecks,
  status,
}: {
  framework: string;
  score: number;
  totalChecks: number;
  passedChecks: number;
  status: "good" | "warning";
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">{framework}</span>
            {status === "good" ? (
              <ShieldCheck className="h-4 w-4 text-green-400" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-yellow-400" />
            )}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold font-mono">{score}%</span>
            <span className="text-[10px] text-muted-foreground mb-1">
              {passedChecks}/{totalChecks} checks
            </span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-background/50 overflow-hidden">
            <motion.div
              className={cn(
                "h-full rounded-full",
                score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RemediationMatrix() {
  const severityColors: Record<Severity, string> = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Remediation Priority Matrix</CardTitle>
        <CardDescription className="text-xs">Impact vs Likelihood — prioritize upper-right items</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Axes labels */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-muted-foreground font-medium whitespace-nowrap">
            IMPACT →
          </div>
          <div className="text-center text-[10px] text-muted-foreground font-medium mb-1">
            LIKELIHOOD →
          </div>

          {/* Matrix grid */}
          <div className="relative ml-4 border border-border/30 rounded-lg overflow-hidden" style={{ aspectRatio: "1" }}>
            {/* Grid lines */}
            {[1, 2, 3, 4].map((i) => (
              <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-border/20" style={{ top: `${i * 20}%` }} />
            ))}
            {[1, 2, 3, 4].map((i) => (
              <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-border/20" style={{ left: `${i * 20}%` }} />
            ))}

            {/* Risk zones background */}
            <div className="absolute top-0 right-0 w-3/5 h-3/5 bg-red-500/5" />
            <div className="absolute top-0 left-0 w-2/5 h-3/5 bg-yellow-500/5" />
            <div className="absolute bottom-0 right-0 w-3/5 h-2/5 bg-orange-500/5" />
            <div className="absolute bottom-0 left-0 w-2/5 h-2/5 bg-green-500/5" />

            {/* Vulnerability dots */}
            {remediationMatrix.map((item, i) => {
              const left = ((item.likelihood - 0.5) / 5) * 100;
              const top = (100 - ((item.impact - 0.5) / 5) * 100);
              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute w-3 h-3 rounded-full cursor-pointer group",
                    severityColors[item.severity]
                  )}
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    transform: "translate(-50%, -50%)",
                    filter: `drop-shadow(0 0 4px ${severityColors[item.severity]}60)`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                  whileHover={{ scale: 1.8 }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-popover border border-border rounded text-[9px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {item.title}
                  </div>
                </motion.div>
              );
            })}

            {/* Axis labels */}
            <span className="absolute bottom-1 left-1 text-[8px] text-muted-foreground/50">Low</span>
            <span className="absolute bottom-1 right-1 text-[8px] text-muted-foreground/50">High</span>
            <span className="absolute top-1 left-1 text-[8px] text-muted-foreground/50">High</span>
            <span className="absolute bottom-6 left-1 text-[8px] text-muted-foreground/50 -rotate-90 origin-left">Impact</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RiskAssessment() {
  return (
    <div className="space-y-6">
      {/* Risk Score + Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Risk Score Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Overall Risk Score
              </CardTitle>
              <CardDescription className="text-xs">Composite risk assessment across all systems</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <RiskGauge score={72} />
              <div className="grid grid-cols-3 gap-4 mt-2 w-full text-center">
                <div>
                  <p className="text-lg font-bold font-mono text-red-400">18</p>
                  <p className="text-[9px] text-muted-foreground uppercase">Critical</p>
                </div>
                <div>
                  <p className="text-lg font-bold font-mono text-orange-400">45</p>
                  <p className="text-[9px] text-muted-foreground uppercase">High</p>
                </div>
                <div>
                  <p className="text-lg font-bold font-mono text-yellow-400">89</p>
                  <p className="text-[9px] text-muted-foreground uppercase">Medium</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
              <CardDescription className="text-xs">Framework compliance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {complianceData.map((item, i) => (
                  <motion.div
                    key={item.framework}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <ComplianceCard {...item} />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Risk Trend + Remediation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Risk Score Trend
              </CardTitle>
              <CardDescription className="text-xs">Monthly risk score changes over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={riskTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.015 260)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "oklch(0.6 0.02 160)" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "oklch(0.6 0.02 160)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.17 0.008 260)",
                        border: "1px solid oklch(0.28 0.015 260)",
                        borderRadius: "8px",
                        color: "oklch(0.93 0.01 160)",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981", r: 3 }}
                      activeDot={{ r: 5, fill: "#10b981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Remediation Matrix */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RemediationMatrix />
        </motion.div>
      </div>
    </div>
  );
}
