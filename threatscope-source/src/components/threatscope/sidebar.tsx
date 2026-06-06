"use client";

import { cn } from "@/lib/utils";
import type { ActiveSection } from "@/store/threatscope-store";
import { useThreatScopeStore } from "@/store/threatscope-store";
import {
  LayoutDashboard,
  ScanSearch,
  Radar,
  ShieldAlert,
  BrainCircuit,
  Shield,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems: { id: ActiveSection; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "scanner", label: "Vulnerability Scanner", icon: ScanSearch },
  { id: "threat-intel", label: "Threat Intelligence", icon: Radar },
  { id: "risk-assessment", label: "Risk Assessment", icon: ShieldAlert },
  { id: "ai-assistant", label: "AI Assistant", icon: BrainCircuit },
];

function NavContent({ onNavigate }: { onNavigate: () => void }) {
  const { activeSection, setActiveSection } = useThreatScopeStore();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border/50">
        <div className="relative">
          <Shield className="h-8 w-8 text-primary" />
          <div className="absolute inset-0 h-8 w-8 text-primary blur-md opacity-50">
            <Shield className="h-8 w-8" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold text-primary tracking-wide">ThreatScope</h1>
          <p className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">Security Operations</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                onNavigate();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20 glow-emerald"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="px-4 py-3 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="font-mono">SYSTEM ONLINE</span>
        </div>
        <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">
          Last update: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-sidebar h-screen sticky top-0">
        <NavContent onNavigate={() => {}} />
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center h-14 px-4 border-b border-border/50 bg-sidebar/95 backdrop-blur-sm">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar border-border/50">
            <NavContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 ml-3">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-primary tracking-wide">ThreatScope</span>
        </div>
      </div>
    </>
  );
}
