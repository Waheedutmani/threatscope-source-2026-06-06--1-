'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Particle Network ───────────────────────────────────────────
function ParticleNetwork({ count = 150, spread = 8, color1 = '#06b6d4', color2 = '#10b981' }: {
  count?: number;
  spread?: number;
  color1?: string;
  color2?: string;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return pos;
  }, [count, spread]);

  // Store velocities in a ref to avoid the immutability lint rule
  const velocitiesRef = useRef<Float32Array | null>(null);
  if (!velocitiesRef.current) {
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    velocitiesRef.current = vel;
  }

  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const vel = velocitiesRef.current!;
    for (let i = 0; i < count; i++) {
      posArr[i * 3] += vel[i * 3];
      posArr[i * 3 + 1] += vel[i * 3 + 1];
      posArr[i * 3 + 2] += vel[i * 3 + 2];
      // Bounce
      for (let j = 0; j < 3; j++) {
        if (Math.abs(posArr[i * 3 + j]) > spread / 2) {
          vel[i * 3 + j] *= -1;
        }
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Update connection lines
    if (linesRef.current) {
      const linePositions: number[] = [];
      const maxDist = 1.8;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = posArr[i * 3] - posArr[j * 3];
          const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
          const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < maxDist) {
            linePositions.push(
              posArr[i * 3], posArr[i * 3 + 1], posArr[i * 3 + 2],
              posArr[j * 3], posArr[j * 3 + 1], posArr[j * 3 + 2]
            );
          }
        }
      }
      const lineGeometry = new THREE.BufferGeometry();
      if (linePositions.length > 0) {
        lineGeometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(linePositions, 3)
        );
      }
      linesRef.current.geometry = lineGeometry;
    }
  });

  return (
    <>
      <points ref={pointsRef} geometry={pointsGeometry}>
        <pointsMaterial
          size={0.04}
          color={color1}
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color={color2} transparent opacity={0.12} />
      </lineSegments>
    </>
  );
}

// ─── Floating Hexagon ────────────────────────────────────────────
function FloatingHex({ position, scale = 1, color = '#06b6d4', speed = 1 }: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const hexShape = useMemo(() => {
    const shape = new THREE.Shape();
    const size = 0.3 * scale;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, [scale]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z += 0.003 * speed;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <shapeGeometry args={[hexShape]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Main Export: ParticleField ──────────────────────────────────
interface ParticleFieldProps {
  className?: string;
  count?: number;
  showHexagons?: boolean;
  color1?: string;
  color2?: string;
}

export function ParticleField({
  className = '',
  count = 120,
  showHexagons = true,
  color1 = '#06b6d4',
  color2 = '#10b981',
}: ParticleFieldProps) {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.1} />
        <ParticleNetwork count={count} color1={color1} color2={color2} />
        {showHexagons && (
          <>
            <FloatingHex position={[-3, 2, -2]} scale={1.2} speed={0.8} />
            <FloatingHex position={[3, -1.5, -1]} scale={0.8} color="#10b981" speed={1.2} />
            <FloatingHex position={[-2, -2, -3]} scale={1} color="#10b981" speed={0.6} />
            <FloatingHex position={[2.5, 1.5, -2.5]} scale={0.6} speed={1.5} />
          </>
        )}
      </Canvas>
    </div>
  );
}
