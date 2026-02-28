'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float, Sphere, RoundedBox, Torus } from '@react-three/drei'
import { Suspense } from 'react'

interface ProductViewer3DProps {
  category?: string
}

function GenericProduct({ category }: { category?: string }) {
  // Different geometries based on product category
  switch (category) {
    case 'electronica':
      return (
        <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group>
            <RoundedBox args={[2, 1.2, 0.1]} radius={0.08}>
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
            </RoundedBox>
            <RoundedBox args={[1.8, 1, 0.05]} position={[0, 0, 0.08]} radius={0.02}>
              <meshStandardMaterial color="#0ea5e9" metalness={0.3} roughness={0.1} emissive="#0ea5e9" emissiveIntensity={0.1} />
            </RoundedBox>
          </group>
        </Float>
      )
    case 'moda':
      return (
        <Float speed={1.0} rotationIntensity={0.3} floatIntensity={0.4}>
          <group>
            <Torus args={[0.8, 0.3, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
            </Torus>
          </group>
        </Float>
      )
    case 'hogar':
      return (
        <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.3}>
          <group>
            <mesh>
              <cylinderGeometry args={[0.5, 0.7, 1.5, 32]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.1} roughness={0.6} />
            </mesh>
          </group>
        </Float>
      )
    default:
      return (
        <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.5}>
          <Sphere args={[1, 64, 64]}>
            <meshStandardMaterial color="#0ea5e9" metalness={0.7} roughness={0.2} />
          </Sphere>
        </Float>
      )
  }
}

export default function ProductViewer3D({ category }: ProductViewer3DProps) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ antialias: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Environment preset="warehouse" />
        <GenericProduct category={category} />
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={5}
          blur={2.5}
        />
        <OrbitControls
          enableZoom={true}
          autoRotate
          autoRotateSpeed={2}
          enablePan={false}
          minDistance={2}
          maxDistance={8}
        />
      </Suspense>
    </Canvas>
  )
}
