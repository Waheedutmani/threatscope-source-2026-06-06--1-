"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useThreatScopeStore, type ChatMessage } from "@/store/threatscope-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  BrainCircuit,
  Send,
  Sparkles,
  ShieldAlert,
  Bug,
  Terminal,
  User,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";

const suggestedQueries = [
  { icon: Bug, label: "Analyze my top vulnerabilities", query: "Analyze my top vulnerabilities and their potential impact on my infrastructure" },
  { icon: ShieldAlert, label: "What's my risk posture?", query: "What is my current risk posture and what are the main areas of concern?" },
  { icon: Sparkles, label: "Suggest remediation for CVE-2024-3094", query: "Suggest remediation steps for CVE-2024-3094 (XZ Utils Backdoor)" },
  { icon: Terminal, label: "How to fix XSS vulnerabilities?", query: "How can I fix and prevent XSS vulnerabilities in my web applications?" },
];

export function AIAssistant() {
  const { chatMessages, addChatMessage, isChatLoading, setIsChatLoading } = useThreatScopeStore();
  const [input, setInput] = useState("");
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, typingText, scrollToBottom]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isChatLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMessage);
    setInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText.trim() }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const aiContent = data.message || "I'm unable to process your request at this time. Please try again.";

      // Simulate typing effect
      setIsTyping(true);
      let displayedText = "";
      for (let i = 0; i < aiContent.length; i++) {
        displayedText += aiContent[i];
        setTypingText(displayedText);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: aiContent,
        timestamp: new Date().toISOString(),
      };

      addChatMessage(aiMessage);
      setTypingText("");
      setIsTyping(false);
    } catch {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "⚠️ Connection error. I'm experiencing technical difficulties. Please check your configuration and try again.",
        timestamp: new Date().toISOString(),
      };
      addChatMessage(errorMessage);
      setTypingText("");
      setIsTyping(false);
    } finally {
      setIsChatLoading(false);
    }
  }, [addChatMessage, isChatLoading, setIsChatLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm flex-1 flex flex-col">
          <CardHeader className="pb-2 border-b border-border/30">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-primary" />
              ThreatScope AI Security Analyst
              <span className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                ONLINE
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-320px)]">
              {chatMessages.length === 0 && !isTyping && (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="relative">
                    <BrainCircuit className="h-16 w-16 text-primary/30" />
                    <div className="absolute inset-0 blur-xl bg-primary/10" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground mt-4">AI Security Analyst Ready</h3>
                  <p className="text-xs text-muted-foreground/60 mt-1 max-w-sm">
                    Ask me about vulnerabilities, threats, risk assessment, or remediation strategies
                  </p>
                </div>
              )}

              <AnimatePresence>
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === "assistant" && (
                      <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BrainCircuit className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2",
                        msg.role === "user"
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-background/50 border border-border/30 scanline-bg"
                      )}
                    >
                      {msg.role === "assistant" ? (
                        <div className="text-xs prose prose-invert prose-sm max-w-none [&_p]:text-xs [&_p]:leading-relaxed [&_strong]:text-primary [&_code]:text-primary [&_code]:bg-primary/10 [&_code]:px-1 [&_code]:rounded [&_ul]:text-xs [&_ol]:text-xs [&_li]:text-xs">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-xs">{msg.content}</p>
                      )}
                      <span className="text-[9px] text-muted-foreground/50 font-mono mt-1 block">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {msg.role === "user" && (
                      <div className="h-7 w-7 rounded-lg bg-accent border border-border/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isTyping && typingText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BrainCircuit className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="max-w-[80%] rounded-lg px-3 py-2 bg-background/50 border border-border/30 scanline-bg">
                    <div className="text-xs prose prose-invert prose-sm max-w-none [&_p]:text-xs [&_p]:leading-relaxed [&_strong]:text-primary [&_code]:text-primary [&_code]:bg-primary/10 [&_code]:px-1 [&_code]:rounded">
                      <ReactMarkdown>{typingText}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Loading indicator */}
              {isChatLoading && !typingText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <BrainCircuit className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-border/30">
                    <Loader2 className="h-3 w-3 text-primary animate-spin" />
                    <span className="text-xs text-muted-foreground font-mono">Analyzing...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Queries */}
            {chatMessages.length === 0 && (
              <div className="px-4 pb-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedQueries.map((sq) => {
                    const Icon = sq.icon;
                    return (
                      <Button
                        key={sq.label}
                        variant="outline"
                        size="sm"
                        className="justify-start gap-2 h-auto py-2 px-3 border-border/30 hover:border-primary/30 hover:bg-primary/5 text-left"
                        onClick={() => sendMessage(sq.query)}
                        disabled={isChatLoading}
                      >
                        <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span className="text-[11px]">{sq.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border/30">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about vulnerabilities, threats, remediation..."
                  disabled={isChatLoading}
                  className="flex-1 font-mono text-xs bg-background/50 border-border/50 focus:border-primary/50"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || isChatLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
