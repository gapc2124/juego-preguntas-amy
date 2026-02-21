// src/components/ThreeBackground.tsx
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Este sub-componente maneja solo las estrellas
function StarField() {
  const ref = useRef<THREE.Points>(null!)

  // 1. Generamos las posiciones de MUCHAS MÁS estrellas una sola vez
  const [positions] = useMemo(() => {
    // CAMBIO 1: Aumentamos de 5000 a 15000 estrellas
    const count = 15000 
    const positions = new Float32Array(count * 3) // x, y, z por cada estrella
    
    for (let i = 0; i < count; i++) {
      // Distribuimos las estrellas en una esfera alrededor del centro (radio 60 para más amplitud)
      const r = 60 * Math.cbrt(Math.random())
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      
      positions.set([x, y, z], i * 3)
    }
    return [positions]
  }, [])

  // 2. Animación: Rotación orbital compleja
  useFrame((_state, delta) => {
    if (ref.current) {
      // CAMBIO 2: Rotamos en los 3 ejes a diferentes velocidades
      // para un efecto orbital más rico y menos predecible.
      ref.current.rotation.y -= delta / 40  // Rotación principal "horizontal"
      ref.current.rotation.x += delta / 60  // Un ligero "tumbo" vertical
      ref.current.rotation.z += delta / 80  // Un giro sutil de profundidad
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        {/* Usamos la sintaxis 'args' para evitar el error de TypeScript */}
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      {/* Material de puntos brillantes */}
      <pointsMaterial
        size={0.07} // Un poquito más pequeñas para compensar la cantidad
        color="#ffffff"
        sizeAttenuation={true}
        transparent
        opacity={0.8}
        // Truco para que parezcan círculos
        map={useMemo(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 32; canvas.height = 32;
            const context = canvas.getContext('2d');
            if(context) {
                context.beginPath();
                context.arc(16, 16, 14, 0, 2 * Math.PI);
                context.fillStyle = 'white';
                context.fill();
            }
            const texture = new THREE.CanvasTexture(canvas);
            return texture;
        }, [])}
        alphaTest={0.5}
      />
    </points>
  )
}

// Al final de src/components/ThreeBackground.tsx
export default function ThreeBackground() {
  return (
    <div className="three-background-container">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <color attach="background" args={['#050103']} /> 
        <fog attach="fog" args={['#050103', 40, 70]} />
        <StarField />
      </Canvas>
      {/* Esta es la nueva capa rosada transparente */}
      <div className="pink-overlay"></div> 
    </div>
  )
}