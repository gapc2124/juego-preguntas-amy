// src/components/Dice3D.tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface Dice3DProps {
  isRolling: boolean;
  onRoll: () => void;
  resultIcon?: string;
  resultColor?: string;
}

export default function Dice3D({ isRolling, onRoll, resultIcon, resultColor }: Dice3DProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const iconTexture = useMemo(() => {
    if (!resultIcon) return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff'; // Color de fondo blanco puro
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = resultColor || '#333';
      // Aumentamos significativamente el tamaño de la fuente para que el icono sea grande y centrado
      ctx.font = '400px "Material Symbols Outlined"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Dibujamos el icono en el centro exacto del canvas
      ctx.fillText(resultIcon, 256, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    // Ajustamos el repeat y offset para que la textura cubra cada cara correctamente
    tex.repeat.set(1, 1);
    tex.offset.set(0, 0);
    return tex;
  }, [resultIcon, resultColor]);

  useFrame((state, delta) => {
    if (isRolling) {
      meshRef.current.rotation.x += delta * 25;
      meshRef.current.rotation.y += delta * 30;
    } else {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0.45, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0.45, 0.1);
    }
  });

  return (
    <group>
      {/* Aumentamos la intensidad de la luz para que el dado se vea más brillante y blanco */}
      <ambientLight intensity={1.2} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      
      <RoundedBox 
        ref={meshRef}
        args={[1.8, 1.8, 1.8]} 
        radius={0.25} 
        smoothness={4}
        onClick={(e) => {
          e.stopPropagation();
          if (!isRolling) onRoll();
        }}
      >
        <meshStandardMaterial 
          map={!isRolling ? iconTexture : null} 
          // Cambiamos el color base a blanco puro para quitar la opacidad
          color="#ffffff"
          roughness={0.8} // Mantenemos un acabado mate
          metalness={0}
        />
      </RoundedBox>
      <ContactShadows position={[0, -1.6, 0]} opacity={0.3} scale={6} blur={2.5} />
    </group>
  );
}