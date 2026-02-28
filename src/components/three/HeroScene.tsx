'use client'

import { Canvas } from '@react-three/fiber'
import { Float, Environment, MeshTransmissionMaterial, Torus, Sphere, RoundedBox } from '@react-three/drei'
import { Suspense } from 'react'

function FloatingGeometry() {
  return (
    <group>
      <Float speed={1.4} rotationIntensity={0.8} floatIntensity={1.2}>
        <Torus args={[1, 0.35, 32, 100]} position={[0, 0, 0]}>
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={0.3}
            roughness={0}
            transmission={1}
            ior={1.5}
            chromaticAberration={0.06}
            color="#0ea5e9"
          />
        </Torus>
      </Float>

      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={0.8}>
        <Sphere args={[0.5, 32, 32]} position={[-2, 1, -1]}>
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={0.2}
            roughness={0.1}
            transmission={1}
            ior={1.3}
            chromaticAberration={0.04}
            color="#e0f2fe"
          />
        </Sphere>
      </Float>

      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.0}>
        <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.1} position={[2, -0.5, -0.5]}>
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={0.25}
            roughness={0.05}
            transmission={1}
            ior={1.4}
            chromaticAberration={0.05}
            color="#0284c7"
          />
        </RoundedBox>
      </Float>

      <Float speed={2.0} rotationIntensity={1.5} floatIntensity={0.6}>
        <Sphere args={[0.3, 24, 24]} position={[1.5, 1.5, 0.5]}>
          <meshStandardMaterial color="#0ea5e9" metalness={0.8} roughness={0.2} />
        </Sphere>
      </Float>
    </group>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Environment preset="city" />
        <FloatingGeometry />
      </Suspense>
    </Canvas>
  )
}
