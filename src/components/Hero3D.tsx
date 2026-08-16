import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function SkullCore(){
  const skull = useRef<any>(null)
  const particles = useMemo(
    () => Array.from({ length: 18 }, (_, index) => ({
      position: [
        (Math.sin(index * 1.7) * 2.4),
        (Math.cos(index * 1.3) * 1.3),
        (Math.cos(index * 1.1) * 1.8)
      ] as [number, number, number],
      scale: 0.06 + (index % 5) * 0.02,
      color: index % 2 === 0 ? '#ff8a5b' : '#f5e7dc'
    })),
    []
  )

  useFrame((state, delta) => {
    if (!skull.current) return
    skull.current.rotation.y += delta * 0.5
    skull.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.35
    skull.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.2
  })

  return (
    <group ref={skull}>
      <mesh position={[0, 0.1, 0]} scale={[1.3, 1.5, 1.2]}>
        <sphereGeometry args={[0.9, 24, 24]} />
        <meshStandardMaterial color={'#f5e7dc' as any} metalness={0.15} roughness={0.55} emissive={'#321612' as any} emissiveIntensity={0.35} />
      </mesh>

      <mesh position={[0, -0.75, 0.2]} scale={[1.1, 0.75, 1.1]}>
        <sphereGeometry args={[0.62, 20, 18]} />
        <meshStandardMaterial color={'#f1d9c2' as any} metalness={0.12} roughness={0.7} emissive={'#2b110f' as any} emissiveIntensity={0.18} />
      </mesh>

      <mesh position={[-0.26, 0.18, 0.82]} scale={[0.22, 0.24, 0.1]}>
        <sphereGeometry args={[1, 20, 18]} />
        <meshStandardMaterial color={'#111827' as any} emissive={'#ef4444' as any} emissiveIntensity={2.2} roughness={0.2} metalness={0.35} />
      </mesh>
      <mesh position={[0.26, 0.18, 0.82]} scale={[0.22, 0.24, 0.1]}>
        <sphereGeometry args={[1, 20, 18]} />
        <meshStandardMaterial color={'#111827' as any} emissive={'#ef4444' as any} emissiveIntensity={2.2} roughness={0.2} metalness={0.35} />
      </mesh>

      <mesh position={[0, -0.05, 0.86]} scale={[0.12, 0.14, 0.08]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={'#f4c9b6' as any} emissive={'#f97316' as any} emissiveIntensity={0.9} roughness={0.45} />
      </mesh>

      <mesh position={[0, -0.62, 0.62]} rotation={[0.6, 0, 0]} scale={[0.55, 0.35, 0.25]}>
        <torusGeometry args={[0.7, 0.1, 12, 30]} />
        <meshStandardMaterial color={'#f5e7dc' as any} emissive={'#ef4444' as any} emissiveIntensity={0.8} roughness={0.25} />
      </mesh>

      {particles.map((item, index) => (
        <mesh key={index} position={item.position} scale={item.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={item.color as any} emissive={item.color as any} emissiveIntensity={0.8} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

export default function Hero3D(){
  if (typeof window === 'undefined') return <div className="h-full w-full" />
  if (!(window as any).WebGLRenderingContext) return <div className="flex h-full items-center justify-center text-sm text-slate-300">3D browser fallback</div>

  return (
    <Canvas camera={{ position: [0, 0.3, 4.8], fov: 42 }} style={{ width: '100%', height: '100%' }}>
      <color attach="background" args={['#090b10']} />
      <ambientLight intensity={1.1} />
      <pointLight position={[3, 3, 5]} intensity={24} color="#ff6b57" />
      <pointLight position={[-3, -2, 4]} intensity={12} color="#f7d3c2" />
      <directionalLight position={[0, 4, 6]} intensity={2} color="#fff2eb" />
      <SkullCore />
    </Canvas>
  )
}
