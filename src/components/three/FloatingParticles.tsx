'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useMemo } from 'react'
import * as THREE from 'three'

function Particles({ count = 200 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!)

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      sizes[i] = Math.random() * 2
    }
    return { positions, sizes }
  }, [count])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02
      mesh.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#0ea5e9"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export default function FloatingParticles() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
      <Suspense fallback={null}>
        <Particles />
      </Suspense>
    </Canvas>
  )
}
