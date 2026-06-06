"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Severity } from "@/store/threatscope-store";
import { kpiData, threatDistribution, vulnerabilityTrend, attackSurfaceData, vulnerabilities } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Bug,
  AlertTriangle,
  Gauge,
  Monitor,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

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

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string; label: string }> = {
    open: { className: "bg-red-500/15 text-red-400 border-red-500/20", label: "Open" },
    "in-progress": { className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20", label: "In Progress" },
    resolved: { className: "bg-green-500/15 text-green-400 border-green-500/20", label: "Resolved" },
  };
  const c = config[status] || config.open;
  return (
    <Badge variant="outline" className={cn("text-[10px]", c.className)}>
      {c.label}
    </Badge>
  );
}

function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  accentColor,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: number;
  trendLabel: string;
  accentColor: string;
}) {
  const isPositive = trend > 0;
  // For vulnerabilities and critical issues, negative trend is good
  const isGood = (title.includes("Vulnerability") || title.includes("Critical")) ? !isPositive : isPositive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
        <div className={cn("absolute top-0 left-0 w-full h-0.5", accentColor)} />
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={cn("h-4 w-4", accentColor.replace("bg-", "text-"))} />
              <span className="text-xs text-muted-foreground font-medium">{title}</span>
            </div>
            <div className={cn("flex items-center gap-1 text-xs font-mono", isGood ? "text-green-400" : "text-red-400")}>
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              <span>{Math.abs(trend)}</span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold font-mono">{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{trendLabel}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Dashboard() {
  const recentVulns = vulnerabilities.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Vulnerabilities"
          value={kpiData.totalVulnerabilities}
          icon={Bug}
          trend={kpiData.totalTrend}
          trendLabel="vs last month"
          accentColor="bg-emerald-500"
        />
        <KPICard
          title="Critical Issues"
          value={kpiData.criticalIssues}
          icon={AlertTriangle}
          trend={kpiData.criticalTrend}
          trendLabel="vs last month"
          accentColor="bg-red-500"
        />
        <KPICard
          title="Risk Score"
          value={kpiData.riskScore}
          icon={Gauge}
          trend={-5}
          trendLabel="vs last scan"
          accentColor="bg-amber-500"
        />
        <KPICard
          title="Systems Scanned"
          value={kpiData.systemsScanned}
          icon={Monitor}
          trend={kpiData.systemsTrend}
          trendLabel="new this week"
          accentColor="bg-emerald-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Threat Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Threat Level Distribution</CardTitle>
              <CardDescription className="text-xs">Current vulnerability severity breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={threatDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {threatDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.17 0.008 260)",
                        border: "1px solid oklch(0.28 0.015 260)",
                        borderRadius: "8px",
                        color: "oklch(0.93 0.01 160)",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {threatDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vulnerability Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vulnerability Trend (30 Days)</CardTitle>
              <CardDescription className="text-xs">Discovered vulnerabilities over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vulnerabilityTrend}>
                    <defs>
                      <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.015 260)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "oklch(0.6 0.02 160)" }}
                      interval={6}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "oklch(0.6 0.02 160)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.17 0.008 260)",
                        border: "1px solid oklch(0.28 0.015 260)",
                        borderRadius: "8px",
                        color: "oklch(0.93 0.01 160)",
                        fontSize: "12px",
                      }}
                    />
                    <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="url(#colorCritical)" strokeWidth={2} />
                    <Area type="monotone" dataKey="high" stroke="#f97316" fill="url(#colorHigh)" strokeWidth={2} />
                    <Area type="monotone" dataKey="medium" stroke="#eab308" fill="url(#colorMedium)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Attack Surface + Recent Vulnerabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attack Surface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Attack Surface</CardTitle>
              <CardDescription className="text-xs">Top affected categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attackSurfaceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.015 260)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "oklch(0.6 0.02 160)" }} />
                    <YAxis
                      dataKey="category"
                      type="category"
                      tick={{ fontSize: 10, fill: "oklch(0.6 0.02 160)" }}
                      width={70}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.17 0.008 260)",
                        border: "1px solid oklch(0.28 0.015 260)",
                        borderRadius: "8px",
                        color: "oklch(0.93 0.01 160)",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Vulnerabilities Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recent Vulnerabilities</CardTitle>
              <CardDescription className="text-xs">Latest findings from vulnerability scans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Severity</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">CVE ID</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Title</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">CVSS</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVulns.map((vuln, i) => (
                      <motion.tr
                        key={vuln.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="border-b border-border/30 hover:bg-accent/30 transition-colors"
                      >
                        <td className="py-2.5 px-2"><SeverityBadge severity={vuln.severity} /></td>
                        <td className="py-2.5 px-2 font-mono text-xs text-primary">{vuln.cveId}</td>
                        <td className="py-2.5 px-2 text-xs max-w-[200px] truncate">{vuln.title}</td>
                        <td className="py-2.5 px-2 font-mono text-xs">{vuln.cvss}</td>
                        <td className="py-2.5 px-2"><StatusBadge status={vuln.status} /></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
