'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, AlertCircle, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVulnGuardStore } from '@/store/vulnguard-store';

export function LoginPage() {
  const { login, setCurrentPage } = useVulnGuardStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Generate particle data client-side only to avoid hydration mismatch
  const particles = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: 12 }, (_, i) => ({
      width: 2 + Math.random() * 3,
      height: 2 + Math.random() * 3,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 8 + Math.random() * 8,
      delay: Math.random() * 5,
      isCyan: i % 2 === 0,
    }));
  }, [mounted]);

  const handleDownloadSource = async () => {
    setIsDownloading(true);
    try {
      // Try POST first, then GET as fallback
      let res = await fetch('/api/download-source', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'zip' }),
      });

      if (!res.ok) {
        // Fallback to GET
        res = await fetch('/api/download-source', { method: 'GET' });
      }

      if (!res.ok) {
        let errMsg = 'Download failed';
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch {
          // Use default error message
        }
        throw new Error(errMsg);
      }

      const blob = await res.blob();

      if (blob.size < 100) {
        throw new Error('Downloaded file is too small, possibly corrupted');
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `threatscope-source-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Download error:', err);
      setError(err.message || 'Failed to download source code. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const success = login(email, password);
    if (success) {
      setCurrentPage('dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
            top: '10%',
            left: '5%',
            animation: 'loginOrb1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            bottom: '10%',
            right: '10%',
            animation: 'loginOrb2 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)',
            top: '60%',
            left: '50%',
            animation: 'loginOrb3 18s ease-in-out infinite',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
        style={{ perspective: '1200px' }}
      >
        {/* Glassmorphism Card with 3D perspective */}
        <div
          className="relative bg-slate-900/60 backdrop-blur-xl border border-cyan-500/10 rounded-2xl p-8 shadow-2xl overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Holographic border shimmer on hover */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 hover-target-border"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, rgba(6,182,212,0.1) 25%, rgba(16,185,129,0.1) 50%, rgba(6,182,212,0.1) 75%, transparent 100%)',
              backgroundSize: '200% 200%',
              animation: 'holoCardShimmer 4s ease-in-out infinite',
            }}
          />

          {/* Floating particles behind card */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${p.width}px`,
                  height: `${p.height}px`,
                  background: p.isCyan ? 'rgba(6, 182, 212, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  animation: `loginParticle ${p.duration}s ease-in-out infinite`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}
          </div>

          {/* Logo & Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8 relative z-10"
          >
            {/* 3D Rotating Shield */}
            <div className="inline-flex items-center justify-center mb-4">
              <div
                className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center pulse-glow"
                style={{
                  animation: 'shieldRotate3D 6s ease-in-out infinite, pulse-glow-anim 2.5s ease-in-out infinite',
                  transformStyle: 'preserve-3d',
                }}
              >
                <Shield className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">
              ThreatScope
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              AI-Powered Vulnerability Scanner
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm relative z-10"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-slate-300 text-sm">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 h-11 transition-all duration-300"
                  style={{
                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 16px rgba(16, 185, 129, 0.3), inset 0 0 4px rgba(16, 185, 129, 0.05)';
                    e.target.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = '';
                  }}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="password" className="text-slate-300 text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 h-11 transition-all duration-300"
                  style={{
                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 16px rgba(16, 185, 129, 0.3), inset 0 0 4px rgba(16, 185, 129, 0.05)';
                    e.target.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = '';
                  }}
                  required
                />
              </div>
            </motion.div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentPage('forgot-password')}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-50 relative overflow-hidden press-3d"
              >
                {/* Scanning line animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div
                    className="absolute top-0 h-full w-1/3"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                      animation: 'btnScanLine 3s ease-in-out infinite',
                    }}
                  />
                </div>
                {isLoading ? (
                  <div className="flex items-center gap-2 relative z-10">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  <span className="relative z-10">Sign In</span>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Default Credentials Helper */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-5 p-3 rounded-lg bg-slate-800/40 border border-slate-700/30 relative z-10"
          >
            <p className="text-xs text-slate-500 text-center">
              Demo credentials:
            </p>
            <p className="text-xs text-slate-400 text-center mt-1">
              <span className="text-cyan-400">admin@vulnguard.com</span> / <span className="text-cyan-400">admin123</span>
            </p>
          </motion.div>

          {/* Register Link & Download Source */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="mt-6 text-center relative z-10"
          >
            <p className="text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setCurrentPage('register')}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Register
              </button>
            </p>
          </motion.div>

          {/* Download Source Code Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="mt-4 relative z-10"
          >
            <button
              type="button"
              onClick={handleDownloadSource}
              disabled={isDownloading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium
                bg-slate-800/50 border border-cyan-500/20 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/40
                hover:bg-cyan-500/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                relative overflow-hidden group/dl"
            >
              {/* Scanning line animation */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute top-0 h-full w-1/3"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.08), transparent)',
                    animation: 'btnScanLine 4s ease-in-out infinite',
                  }}
                />
              </div>
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                  <span className="relative z-10">Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 relative z-10 group-hover/dl:text-cyan-300 transition-colors" />
                  <span className="relative z-10">Download Source Code</span>
                </>
              )}
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Login page specific animations */}
      <style>{`
        @keyframes loginOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes loginOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 40px) scale(1.05); }
          66% { transform: translate(20px, -20px) scale(0.9); }
        }
        @keyframes loginOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 30px) scale(1.1); }
        }
        @keyframes loginParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
          50% { transform: translateY(-10px) translateX(-5px); opacity: 0.2; }
          75% { transform: translateY(-25px) translateX(15px); opacity: 0.5; }
        }
        @keyframes shieldRotate3D {
          0%, 100% { transform: perspective(400px) rotateY(0deg); }
          25% { transform: perspective(400px) rotateY(15deg); }
          50% { transform: perspective(400px) rotateY(0deg); }
          75% { transform: perspective(400px) rotateY(-15deg); }
        }
        @keyframes holoCardShimmer {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes btnScanLine {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
