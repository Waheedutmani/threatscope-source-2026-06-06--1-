'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// ─── Threat Point ────────────────────────────────────────────────
function ThreatPoint({
  position,
  color,
  severity,
  label,
  pulseSpeed = 1,
}: {
  position: [number, number, number];
  color: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  label: string;
  pulseSpeed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed * 2) * 0.15;
      meshRef.current.scale.setScalar(scale);
    }
    if (ringRef.current) {
      const ringScale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.3;
      ringRef.current.scale.setScalar(ringScale);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.3 - Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.15;
    }
  });

  const pointSize = severity === 'critical' ? 0.08 : severity === 'high' ? 0.06 : 0.04;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[pointSize, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      {/* Pulse ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.15, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* Hover tooltip */}
      {hovered && (
        <Html distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/20 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl">
            <p className="text-slate-200 font-medium">{label}</p>
            <p className={`text-${severity === 'critical' ? 'red' : severity === 'high' ? 'orange' : 'yellow'}-400 uppercase text-[10px]`}>
              {severity}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── Connection Line ─────────────────────────────────────────────
function ThreatConnection({ start, end, color = '#ef4444' }: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}) {
  const lineRef = useRef<THREE.Line>(null);

  const curve = useMemo(() => {
    const mid: [number, number, number] = [
      (start[0] + end[0]) / 2,
      Math.max(start[1], end[1]) + 0.8,
      (start[2] + end[2]) / 2,
    ];
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end)
    );
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(30), [curve]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    // @ts-expect-error - R3F line type mismatch with Three.js Line
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.3} />
    </line>
  );
}

// ─── Globe Wireframe ────────────────────────────────────────────
function GlobeWireframe({ radius = 3 }: { radius?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.1;
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.05;
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[radius, 48, 48]}>
        <meshBasicMaterial wireframe color="#06b6d4" transparent opacity={0.06} />
      </Sphere>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.1, 0.005, 16, 128]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[radius * 1.15, 0.004, 16, 128]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// ─── Main Export: ThreatMap ──────────────────────────────────────
interface ThreatLocation {
  position: [number, number, number];
  severity: 'critical' | 'high' | 'medium' | 'low';
  label: string;
  color: string;
}

interface ThreatMapProps {
  className?: string;
  threats?: ThreatLocation[];
  height?: number;
}

export function ThreatMap({
  className = '',
  height = 400,
  threats,
}: ThreatMapProps) {
  const defaultThreats: ThreatLocation[] = useMemo(() => [
    { position: [1.5, 1.2, 1.8], severity: 'critical', label: 'SQL Injection - NY', color: '#ef4444' },
    { position: [-1.8, 0.5, 2.0], severity: 'critical', label: 'RCE - London', color: '#ef4444' },
    { position: [0.3, -1.5, 2.5], severity: 'high', label: 'XSS - Tokyo', color: '#f97316' },
    { position: [-2.0, -0.8, -1.5], severity: 'high', label: 'CSRF - Berlin', color: '#f97316' },
    { position: [2.2, -0.3, -1.0], severity: 'medium', label: 'Info Leak - Sydney', color: '#eab308' },
    { position: [-0.5, 2.0, -1.8], severity: 'medium', label: 'Misconfig - Toronto', color: '#eab308' },
    { position: [1.0, -2.0, -1.2], severity: 'low', label: 'Version Disc. - Mumbai', color: '#22c55e' },
    { position: [-1.2, 1.8, -0.5], severity: 'critical', label: 'Data Breach - Moscow', color: '#ef4444' },
  ], []);

  const threatData = threats || defaultThreats;

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 2, 6], fov: 45 }}
        style={{ background: 'transparent', height }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[5, 5, 5]} intensity={0.4} color="#06b6d4" />
        <pointLight position={[-3, -3, 3]} intensity={0.2} color="#10b981" />

        <GlobeWireframe />

        {threatData.map((threat, i) => (
          <ThreatPoint
            key={i}
            position={threat.position}
            color={threat.color}
            severity={threat.severity}
            label={threat.label}
            pulseSpeed={1 + i * 0.2}
          />
        ))}

        {/* Connection lines between critical threats */}
        {threatData.filter(t => t.severity === 'critical').length >= 2 && (
          <ThreatConnection
            start={threatData.filter(t => t.severity === 'critical')[0].position}
            end={threatData.filter(t => t.severity === 'critical')[1].position}
          />
        )}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
