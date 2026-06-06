"use client";

import { motion } from "framer-motion";
import type { Severity } from "@/store/threatscope-store";
import {
  cveFeedData,
  threatCategories,
  attackVectors,
  iocData,
} from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Radar,
  ExternalLink,
  Globe,
  Server,
  FileCode2,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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

function IocTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "IP Address":
      return <Globe className="h-3.5 w-3.5 text-blue-400" />;
    case "Domain":
      return <Server className="h-3.5 w-3.5 text-purple-400" />;
    case "File Hash":
      return <FileCode2 className="h-3.5 w-3.5 text-amber-400" />;
    default:
      return <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />;
  }
}

export function ThreatIntel() {
  return (
    <div className="space-y-6">
      {/* CVE Feed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Radar className="h-4 w-4 text-primary" />
              CVE Intelligence Feed
            </CardTitle>
            <CardDescription className="text-xs">Latest vulnerability advisories and CVE entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cveFeedData.map((cve, i) => (
                <motion.div
                  key={cve.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="p-3 rounded-lg border border-border/30 bg-background/30 hover:bg-accent/20 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-primary font-bold">{cve.id}</span>
                      <SeverityBadge severity={cve.severity} />
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs text-foreground/80 mt-1.5">{cve.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">CVSS:</span>
                      <span
                        className={cn(
                          "font-mono text-xs font-bold",
                          cve.cvss >= 9 ? "text-red-400" : cve.cvss >= 7 ? "text-orange-400" : "text-yellow-400"
                        )}
                      >
                        {cve.cvss}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{cve.publishedDate}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {cve.affectedProducts.map((product) => (
                      <Badge key={product} variant="outline" className="text-[9px] font-mono text-muted-foreground border-border/30">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Threat Categories */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Threats by Category</CardTitle>
              <CardDescription className="text-xs">Distribution of threat types observed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={threatCategories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.015 260)" />
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 10, fill: "oklch(0.6 0.02 160)" }}
                      angle={-30}
                      textAnchor="end"
                      height={50}
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
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attack Vectors */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Attack Vector Analysis</CardTitle>
              <CardDescription className="text-xs">Distribution of attack vector types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attackVectors}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {attackVectors.map((entry, index) => (
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
              <div className="flex justify-center gap-6 mt-2">
                {attackVectors.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">
                      {item.name}: <span className="font-mono text-foreground">{item.value}%</span>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* IOCs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Indicators of Compromise (IOCs)
            </CardTitle>
            <CardDescription className="text-xs">Known malicious indicators from threat intelligence feeds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Value</th>
                    <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Threat</th>
                    <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Severity</th>
                    <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Source</th>
                    <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">First Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {iocData.map((ioc, i) => (
                    <motion.tr
                      key={ioc.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className="border-b border-border/30 hover:bg-accent/30 transition-colors"
                    >
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-1.5">
                          <IocTypeIcon type={ioc.type} />
                          <span className="text-xs">{ioc.type}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 font-mono text-xs text-primary/80 max-w-[200px] truncate">
                        {ioc.value}
                      </td>
                      <td className="py-2.5 px-2 text-xs">{ioc.threat}</td>
                      <td className="py-2.5 px-2">
                        <SeverityBadge severity={ioc.severity} />
                      </td>
                      <td className="py-2.5 px-2 text-xs text-muted-foreground">{ioc.source}</td>
                      <td className="py-2.5 px-2 text-xs font-mono text-muted-foreground">{ioc.firstSeen}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
