'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  colorType: number; // 0 = cyan, 1 = blue, 2 = purple — for fusion palette
}

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  charIndex: number;
  timer: number;
  interval: number;
}

interface Hexagon {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  driftX: number;
  driftY: number;
  opacity: number;
}

export function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const matrixRef = useRef<MatrixColumn[]>([]);
  const hexagonsRef = useRef<Hexagon[]>([]);
  const animFrameRef = useRef<number>(0);
  const lastPulseRef = useRef<number>(0);
  const pulseAlphaRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // ─── Color palette helpers — fusion of cyan/emerald + blue/purple ───
  const CYAN = { r: 6, g: 182, b: 212 };
  const EMERALD = { r: 16, g: 185, b: 129 };
  const BLUE = { r: 59, g: 130, b: 246 };
  const PURPLE = { r: 139, g: 92, b: 246 };

  const colorToRgba = (c: { r: number; g: number; b: number }, a: number) =>
    `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;

  // Mix two colors 50/50
  const mixColor = (
    a: { r: number; g: number; b: number },
    b: { r: number; g: number; b: number },
    t: number
  ) => ({
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  });

  // Pick color based on colorType index
  const getParticleColor = (colorType: number) => {
    switch (colorType % 4) {
      case 0:
        return CYAN;
      case 1:
        return BLUE;
      case 2:
        return PURPLE;
      case 3:
        return EMERALD;
      default:
        return CYAN;
    }
  };

  // ─── Mouse move handler for parallax ───
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Normalize to -1..1 from center
    mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const HEX_CHARS = '0123456789ABCDEF';

    const initMatrix = () => {
      const colWidth = 20;
      const numCols = Math.ceil(canvas.width / colWidth);
      matrixRef.current = Array.from({ length: numCols }, (_, i) => ({
        x: i * colWidth + colWidth / 2,
        y: Math.random() * canvas.height,
        speed: 0.3 + Math.random() * 0.7,
        chars: Array.from({ length: 20 }, () => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]),
        charIndex: 0,
        timer: 0,
        interval: 3 + Math.floor(Math.random() * 5),
      }));
    };

    const initHexagons = () => {
      hexagonsRef.current = Array.from({ length: 4 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 60 + Math.random() * 80,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.002,
        driftX: (Math.random() - 0.5) * 0.15,
        driftY: (Math.random() - 0.5) * 0.1,
        opacity: 0.03 + Math.random() * 0.03,
      }));
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-init matrix columns on resize
      initMatrix();
      initHexagons();
    };

    // Initialize particles with color type for fusion palette
    const particleCount = 60;
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
      colorType: i % 4, // distribute across the 4 fusion colors
    }));

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    const drawPerspectiveGrid = () => {
      if (!ctx || !canvas) return;
      const cx = canvas.width / 2;
      const bottom = canvas.height;
      const gridHeight = canvas.height * 0.45;
      const numLines = 20;
      const numHorizontal = 12;

      ctx.save();
      // Vertical lines converging to vanishing point
      for (let i = -numLines; i <= numLines; i++) {
        const spread = canvas.width * 1.5;
        const bottomX = cx + (i / numLines) * spread;
        const topX = cx + (i / numLines) * 2;
        const topY = bottom - gridHeight;

        // Fusion gradient: cyan → blue → purple along the vertical lines
        const gradient = ctx.createLinearGradient(bottomX, bottom, topX, topY);
        const p = pulseAlphaRef.current;
        gradient.addColorStop(0, `rgba(6, 182, 212, ${0.04 + p * 0.03})`);
        gradient.addColorStop(0.4, `rgba(59, 130, 246, ${0.025 + p * 0.02})`);
        gradient.addColorStop(0.7, `rgba(16, 185, 129, ${0.02 + p * 0.015})`);
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.beginPath();
        ctx.moveTo(bottomX, bottom);
        ctx.lineTo(topX, topY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Horizontal lines — use fusion colors
      for (let i = 0; i < numHorizontal; i++) {
        const t = i / numHorizontal;
        const y = bottom - t * gridHeight;
        const width = (1 - t * 0.85) * canvas.width * 1.5;
        const x1 = cx - width / 2;
        const x2 = cx + width / 2;

        const opacity = (1 - t) * 0.04 + pulseAlphaRef.current * 0.02;
        // Alternate between cyan and blue/purple for horizontal lines
        const color = i % 3 === 0 ? BLUE : i % 3 === 1 ? CYAN : PURPLE;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawMatrixRain = () => {
      if (!ctx || !canvas) return;
      ctx.save();
      for (const col of matrixRef.current) {
        col.timer++;
        if (col.timer >= col.interval) {
          col.timer = 0;
          col.charIndex = (col.charIndex + 1) % col.chars.length;
          // Randomly change a char
          if (Math.random() > 0.7) {
            col.chars[col.charIndex] = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
          }
        }
        col.y += col.speed;
        if (col.y > canvas.height + 300) {
          col.y = -300;
        }

        // Draw column of chars
        for (let j = 0; j < col.chars.length; j++) {
          const charY = col.y - j * 15;
          if (charY < -20 || charY > canvas.height + 20) continue;

          const isHead = j === 0;
          const fadeFactor = Math.max(0, 1 - j / col.chars.length);
          const alpha = isHead
            ? 0.06 + pulseAlphaRef.current * 0.03
            : (0.03 + pulseAlphaRef.current * 0.01) * fadeFactor;

          ctx.font = isHead ? '12px monospace' : '10px monospace';
          // Fusion: heads alternate emerald/blue, tails alternate cyan/purple
          if (isHead) {
            ctx.fillStyle = col.x % 2 === 0
              ? `rgba(16, 185, 129, ${alpha})`
              : `rgba(59, 130, 246, ${alpha})`;
          } else {
            ctx.fillStyle = col.x % 2 === 0
              ? `rgba(6, 182, 212, ${alpha})`
              : `rgba(139, 92, 246, ${alpha * 0.8})`;
          }
          ctx.fillText(col.chars[(col.charIndex + j) % col.chars.length], col.x, charY);
        }
      }
      ctx.restore();
    };

    const drawHexagons = () => {
      if (!ctx || !canvas) return;
      ctx.save();
      for (let hex of hexagonsRef.current) {
        hex.rotation += hex.rotationSpeed;
        hex.x += hex.driftX;
        hex.y += hex.driftY;

        // Wrap around
        if (hex.x < -hex.size * 2) hex.x = canvas.width + hex.size;
        if (hex.x > canvas.width + hex.size * 2) hex.x = -hex.size;
        if (hex.y < -hex.size * 2) hex.y = canvas.height + hex.size;
        if (hex.y > canvas.height + hex.size * 2) hex.y = -hex.size;

        // Outer hexagon — fusion: alternate between cyan/blue
        const outerColor = hex.x % 2 === 0 ? CYAN : BLUE;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = hex.rotation + (Math.PI / 3) * i;
          const px = hex.x + hex.size * Math.cos(angle);
          const py = hex.y + hex.size * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(${outerColor.r}, ${outerColor.g}, ${outerColor.b}, ${hex.opacity + pulseAlphaRef.current * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner hexagon — fusion: alternate between emerald/purple
        const innerColor = hex.y % 2 === 0 ? EMERALD : PURPLE;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = hex.rotation + (Math.PI / 3) * i + Math.PI / 6;
          const px = hex.x + hex.size * 0.6 * Math.cos(angle);
          const py = hex.y + hex.size * 0.6 * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(${innerColor.r}, ${innerColor.g}, ${innerColor.b}, ${hex.opacity * 0.6})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      ctx.restore();
    };

    // ─── Smooth parallax interpolation via rAF ───
    const updateParallax = () => {
      const mouse = mouseRef.current;
      // Smooth lerp toward target
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const container = containerRef.current;
      if (container) {
        container.style.setProperty('--mx', `${mouse.x}`);
        container.style.setProperty('--my', `${mouse.y}`);
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      time += 0.016;

      // Update parallax
      updateParallax();

      // Lightning/energy pulse every 5-10 seconds
      if (time - lastPulseRef.current > 5 + Math.random() * 5) {
        lastPulseRef.current = time;
        pulseAlphaRef.current = 1;
      }
      // Decay pulse
      pulseAlphaRef.current *= 0.97;
      if (pulseAlphaRef.current < 0.01) pulseAlphaRef.current = 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw 3D perspective grid (Tron-like floor)
      drawPerspectiveGrid();

      // Draw matrix rain
      drawMatrixRain();

      // Draw floating hexagons
      drawHexagons();

      // Draw and update particles with depth fog
      const particles = particlesRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Depth fog: fade particles further from center
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);
        const depthFog = 1 - (distFromCenter / maxDist) * 0.5;

        const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse)) * depthFog;
        const color = getParticleColor(p.colorType);
        const pulseExtra = pulseAlphaRef.current * 0.15;

        // Draw particle glow — fusion palette
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${(currentOpacity * 0.5) + pulseExtra})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity + pulseExtra})`;
        ctx.fill();
      }

      // Draw connections between nearby particles — fusion connection colors
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const ddx = particles[i].x - particles[j].x;
          const ddy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < 180) {
            const baseOpacity = 0.08 * (1 - dist / 180);
            const pulseExtra = pulseAlphaRef.current * 0.15 * (1 - dist / 180);
            // Mix colors of the two connected particles
            const cA = getParticleColor(particles[i].colorType);
            const cB = getParticleColor(particles[j].colorType);
            const mixed = mixColor(cA, cB, 0.5);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${mixed.r}, ${mixed.g}, ${mixed.b}, ${baseOpacity + pulseExtra})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw lightning flash overlay — fusion: cyan + blue tint
      if (pulseAlphaRef.current > 0.1) {
        const flashColor = mixColor(CYAN, BLUE, 0.5);
        ctx.fillStyle = `rgba(${flashColor.r}, ${flashColor.g}, ${flashColor.b}, ${pulseAlphaRef.current * 0.03})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ '--mx': 0, '--my': 0 } as React.CSSProperties}
    >
      {/* ═══════ PARALLAX LAYER 1: Background (slowest — 0.02x) ═══════ */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: 'translate(calc(var(--mx) * 8px), calc(var(--my) * 8px))',
          transition: 'transform 0.2s ease-out',
        }}
      >
        {/* Dark gradient base */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #060a12 0%, #0a1020 30%, #0d1525 60%, #0a0e17 100%)',
          }}
        />

        {/* Secondary finer grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Scanline overlay effect (CRT style) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(6, 182, 212, 0.008) 2px,
                rgba(6, 182, 212, 0.008) 4px
              )
            `,
          }}
        />

        {/* Radial gradient overlays — enhanced fusion palette */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 15% 50%, rgba(16, 185, 129, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 85% 20%, rgba(6, 182, 212, 0.05) 0%, transparent 45%),
              radial-gradient(ellipse at 50% 85%, rgba(16, 185, 129, 0.04) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.02) 0%, transparent 70%),
              radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.04) 0%, transparent 45%),
              radial-gradient(ellipse at 70% 70%, rgba(139, 92, 246, 0.03) 0%, transparent 45%)
            `,
          }}
        />

        {/* Vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.4) 100%)',
          }}
        />
      </div>

      {/* ═══════ PARALLAX LAYER 2: Mid (0.04x) — hexagons, scan line ═══════ */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: 'translate(calc(var(--mx) * 16px), calc(var(--my) * 16px))',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Scan line effect - horizontal line moving down */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.3) 20%, rgba(59, 130, 246, 0.35) 50%, rgba(139, 92, 246, 0.3) 80%, transparent 100%)',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.15), 0 0 30px rgba(59, 130, 246, 0.08)',
              animation: 'scanLine 8s linear infinite',
            }}
          />
        </div>
      </div>

      {/* ═══════ AMBIENT ORBS — floating gradient orbs ═══════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blue orb — top left area */}
        <div
          className="ambient-orb absolute will-change-transform"
          style={{
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.04) 40%, transparent 70%)',
            filter: 'blur(80px)',
            top: '5%',
            left: '10%',
            animation: 'ambientOrbDrift1 25s ease-in-out infinite',
          }}
        />
        {/* Purple orb — bottom right area */}
        <div
          className="ambient-orb absolute will-change-transform"
          style={{
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.03) 40%, transparent 70%)',
            filter: 'blur(90px)',
            bottom: '10%',
            right: '5%',
            animation: 'ambientOrbDrift2 30s ease-in-out infinite',
          }}
        />
        {/* Cyan-emerald orb — center area */}
        <div
          className="ambient-orb absolute will-change-transform"
          style={{
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, rgba(16, 185, 129, 0.04) 40%, transparent 70%)',
            filter: 'blur(70px)',
            top: '40%',
            left: '45%',
            animation: 'ambientOrbDrift3 20s ease-in-out infinite',
          }}
        />
      </div>

      {/* ═══════ PARALLAX LAYER 3: Front (0.06x) — particles canvas ═══════ */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: 'translate(calc(var(--mx) * 24px), calc(var(--my) * 24px))',
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Particle canvas (now includes matrix rain, perspective grid, hexagons, depth fog, lightning) */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* ═══════ DEPTH FOG — edge radial gradient overlays ═══════ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top edge fog */}
        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{
            background: 'linear-gradient(to bottom, rgba(6, 10, 18, 0.6) 0%, transparent 100%)',
          }}
        />
        {/* Bottom edge fog */}
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background: 'linear-gradient(to top, rgba(6, 10, 18, 0.6) 0%, transparent 100%)',
          }}
        />
        {/* Left edge fog */}
        <div
          className="absolute inset-y-0 left-0 w-32"
          style={{
            background: 'linear-gradient(to right, rgba(6, 10, 18, 0.5) 0%, transparent 100%)',
          }}
        />
        {/* Right edge fog */}
        <div
          className="absolute inset-y-0 right-0 w-32"
          style={{
            background: 'linear-gradient(to left, rgba(6, 10, 18, 0.5) 0%, transparent 100%)',
          }}
        />
        {/* Corner accent fogs with blue/purple tint */}
        <div
          className="absolute top-0 left-0 w-64 h-64"
          style={{
            background: 'radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.04) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64"
          style={{
            background: 'radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.04) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes scanLine {
          0% {
            top: -2px;
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }

        @keyframes ambientOrbDrift1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(30px, -20px) scale(1.05);
          }
          50% {
            transform: translate(-20px, 30px) scale(0.95);
          }
          75% {
            transform: translate(15px, 15px) scale(1.02);
          }
        }

        @keyframes ambientOrbDrift2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(-25px, 20px) scale(0.97);
          }
          50% {
            transform: translate(20px, -25px) scale(1.04);
          }
          75% {
            transform: translate(-15px, -15px) scale(1);
          }
        }

        @keyframes ambientOrbDrift3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(25px, 25px) scale(1.06);
          }
          66% {
            transform: translate(-20px, -15px) scale(0.96);
          }
        }
      `}</style>
    </div>
  );
}
