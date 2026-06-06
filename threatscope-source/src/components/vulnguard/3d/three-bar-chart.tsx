'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// ─── Single 3D Bar ──────────────────────────────────────────────
function Bar3D({
  position,
  height,
  color,
  targetHeight,
  label,
  value,
}: {
  position: [number, number, number];
  height: number;
  color: string;
  targetHeight: number;
  label: string;
  value: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentHeight = useRef(0.01);

  useFrame(() => {
    if (!meshRef.current) return;
    currentHeight.current += (targetHeight - currentHeight.current) * 0.05;
    meshRef.current.scale.y = currentHeight.current;
    meshRef.current.position.y = (currentHeight.current * 0.5) + position[1];
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[0.6, 1, 0.6]}
        radius={0.05}
        smoothness={4}
        scale={[1, 0.01, 1]}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.85}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </RoundedBox>
      {/* Label */}
      <Text
        position={[0, -0.4, 0]}
        fontSize={0.2}
        color="#94a3b8"
        anchorX="center"
        anchorY="top"
      >
        {label}
      </Text>
      {/* Value */}
      <Text
        position={[0, targetHeight + 0.3, 0]}
        fontSize={0.22}
        color={color}
        anchorX="center"
        anchorY="bottom"
        font={undefined}
      >
        {value}
      </Text>
    </group>
  );
}

// ─── Ground Grid ─────────────────────────────────────────────────
function GroundGrid({ size = 10, divisions = 20, color = '#06b6d4' }: {
  size?: number;
  divisions?: number;
  color?: string;
}) {
  return (
    <gridHelper args={[size, divisions, color, color]} position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
      <lineBasicMaterial color={color} transparent opacity={0.08} />
    </gridHelper>
  );
}

// ─── Main Export: ThreeBarChart ──────────────────────────────────
interface ThreeBarChartData {
  label: string;
  value: number;
  color: string;
}

interface ThreeBarChartProps {
  data: ThreeBarChartData[];
  maxHeight?: number;
  className?: string;
  title?: string;
}

export function ThreeBarChart({
  data,
  maxHeight = 4,
  className = '',
  title,
}: ThreeBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      {/* Title overlay */}
      {title && (
        <div className="absolute top-3 left-4 z-10 text-sm font-medium text-slate-400">
          {title}
        </div>
      )}
      <Canvas
        camera={{ position: [0, 3, 8], fov: 50 }}
        style={{ background: 'transparent', height: 280 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 8, 5]} intensity={0.6} color="#06b6d4" />
        <pointLight position={[-5, 4, -5]} intensity={0.3} color="#10b981" />
        <GroundGrid />

        {data.map((item, i) => {
          const spacing = 1.2;
          const offset = (data.length - 1) * spacing * 0.5;
          const normalizedHeight = (item.value / maxValue) * maxHeight;
          return (
            <Bar3D
              key={i}
              position={[(i * spacing) - offset, 0, 0]}
              height={0.01}
              targetHeight={normalizedHeight}
              color={item.color}
              label={item.label}
              value={item.value}
            />
          );
        })}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}

// Need OrbitControls import
import { OrbitControls } from '@react-three/drei';
