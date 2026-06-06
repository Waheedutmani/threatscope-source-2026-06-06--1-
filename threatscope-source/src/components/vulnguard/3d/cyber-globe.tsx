'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ─── Wireframe Globe ────────────────────────────────────────────
function WireframeGlobe({ radius = 2, speed = 0.3, color = '#06b6d4' }: {
  radius?: number;
  speed?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const ringRef3 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * speed;
    if (ringRef1.current) ringRef1.current.rotation.z += delta * speed * 0.7;
    if (ringRef2.current) ringRef2.current.rotation.x += delta * speed * 0.5;
    if (ringRef3.current) ringRef3.current.rotation.z -= delta * speed * 0.3;
  });

  return (
    <group>
      {/* Main sphere wireframe */}
      <Sphere ref={meshRef} args={[radius, 32, 32]}>
        <meshBasicMaterial wireframe color={color} transparent opacity={0.15} />
      </Sphere>
      {/* Inner glowing sphere */}
      <Sphere args={[radius * 0.85, 32, 32]}>
        <meshBasicMaterial color={color} transparent opacity={0.03} />
      </Sphere>
      {/* Orbiting ring 1 */}
      <mesh ref={ringRef1} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[radius * 1.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.4} />
      </mesh>
      {/* Orbiting ring 2 */}
      <mesh ref={ringRef2} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[radius * 1.35, 0.008, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      {/* Orbiting ring 3 */}
      <mesh ref={ringRef3} rotation={[0, Math.PI / 6, Math.PI / 3]}>
        <torusGeometry args={[radius * 1.5, 0.006, 16, 100]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// ─── Floating Particles ─────────────────────────────────────────
function FloatingParticles({ count = 200, radius = 4, color = '#06b6d4' }: {
  count?: number;
  radius?: number;
  color?: string;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.5 + Math.random() * 0.8);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count, radius]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Attack Arcs ─────────────────────────────────────────────────
function AttackArc({ start, end, color = '#ef4444' }: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}) {
  const lineRef = useRef<THREE.Line>(null);

  const curve = useMemo(() => {
    const mid = [
      (start[0] + end[0]) / 2,
      Math.max(start[1], end[1]) + 1.5,
      (start[2] + end[2]) / 2,
    ] as [number, number, number];
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end)
    );
  }, [start, end]);

  const initialGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
  }, [curve]);

  useFrame(() => {
    if (lineRef.current) {
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lineRef.current.geometry = geometry;
    }
  });

  return (
    // @ts-expect-error - R3F line type mismatch with Three.js Line
    <line ref={lineRef} geometry={initialGeometry}>
      <lineBasicMaterial color={color} transparent opacity={0.6} />
    </line>
  );
}

// ─── Data Nodes ──────────────────────────────────────────────────
interface NodeData {
  position: [number, number, number];
  scale: number;
  color: string;
}

function DataNodes({ count = 8, radius = 2.5 }: { count?: number; radius?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const nodes: NodeData[] = useMemo(() => {
    const n: NodeData[] = [];
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const phi = Math.PI / 4 + Math.random() * Math.PI / 2;
      n.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
        ] as [number, number, number],
        scale: 0.05 + Math.random() * 0.08,
        color: Math.random() > 0.7 ? '#ef4444' : '#10b981',
      });
    }
    return n;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[node.scale, 16, 16]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Main Export: CyberGlobe ─────────────────────────────────────
interface CyberGlobeProps {
  size?: number;
  className?: string;
  showParticles?: boolean;
  showAttacks?: boolean;
  speed?: number;
  intensity?: 'low' | 'medium' | 'high';
}

export function CyberGlobe({
  size = 300,
  className = '',
  showParticles = true,
  showAttacks = false,
  speed = 0.3,
  intensity = 'medium',
}: CyberGlobeProps) {
  const particleCount = intensity === 'low' ? 80 : intensity === 'medium' ? 200 : 400;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(16,185,129,0.05) 50%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#06b6d4" />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#10b981" />
        <WireframeGlobe speed={speed} />
        {showParticles && <FloatingParticles count={particleCount} />}
        {showAttacks && (
          <>
            <AttackArc start={[2, 0.5, 1]} end={[-1.5, -0.5, 1.5]} />
            <AttackArc start={[-1, 1, 1.5]} end={[1.5, -1, 0.5]} color="#f97316" />
            <AttackArc start={[0.5, 1.5, -1]} end={[-0.5, -1.5, 1]} color="#eab308" />
          </>
        )}
        <DataNodes count={intensity === 'low' ? 5 : 8} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}

// ─── Mini Globe (for cards / small spaces) ───────────────────────
export function MiniGlobe({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 3, 3]} intensity={0.4} color="#06b6d4" />
        <WireframeGlobe radius={1.2} speed={0.5} />
        <FloatingParticles count={60} radius={2.5} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}
