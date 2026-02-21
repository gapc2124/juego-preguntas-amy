// src/components/Dice3D.tsx
import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface Dice3DProps {
  isRolling: boolean;
  onRoll: () => void;
  resultIcon?: string;
  resultColor?: string;
}

export default function Dice3D({ isRolling, onRoll, resultIcon, resultColor }: Dice3DProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // Pequeño truco para forzar el re-render cuando la fuente cargue y evitar que diga "bolt" en texto
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    document.fonts.ready.then(() => setFontLoaded(true));
  }, []);

  const iconTexture = useMemo(() => {
    const iconToShow = isRolling ? 'question_mark' : (resultIcon || 'all_inclusive');
    const colorToShow = isRolling ? '#aaaaaa' : (resultColor || '#333');

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // 1. SOLUCIÓN A LA INVISIBILIDAD: Fondo blanco sólido, nada de transparencias.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1024, 1024);
      
      ctx.fillStyle = colorToShow;
      
      // 2. ICONOS GIGANTES Y CENTRADOS
      ctx.font = '850px "Material Symbols Outlined"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle'; 
      
      // Dependemos de fontLoaded para asegurar que dibuje el icono y no la palabra
      if (fontLoaded || !fontLoaded) {
        ctx.fillText(iconToShow, 512, 512);
      }
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    return tex;
  }, [resultIcon, resultColor, isRolling, fontLoaded]);

  useFrame((_state, delta) => {
    if (isRolling) {
      meshRef.current.rotation.x += delta * 20;
      meshRef.current.rotation.y += delta * 25;
      meshRef.current.rotation.z += delta * 10;
    } else {
      const targetRotation = Math.PI * 8; // Aterriza derecho siempre
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotation, 0.15);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotation, 0.15);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.15);
    }
  });

  const handleDiceClick = (e: any) => {
    e.stopPropagation();
    if (!isRolling) {
      meshRef.current.rotation.set(0, 0, 0);
      onRoll();
    }
  };

  return (
    <group>
      {/* 3. SOLUCIÓN A LA OPACIDAD: Luces frontales potentes */}
      <ambientLight intensity={2.5} /> {/* Luz base más fuerte */}
      <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
      
      {/* ESTA ES LA LUZ MÁGICA: Apunta directo a la cara del dado para que el color del icono explote */}
      <directionalLight position={[0, 0, 10]} intensity={3} color="#ffffff" /> 
      
      <Environment preset="city" />
      
      <RoundedBox 
        ref={meshRef}
        args={[1.8, 1.8, 1.8]} 
        radius={0.25} 
        smoothness={8}
        onClick={handleDiceClick}
      >
        {[...Array(6)].map((_, i) => (
          <meshStandardMaterial 
            key={i}
            attach={`material-${i}`}
            map={iconTexture} 
            color="#ffffff"
            roughness={0.15} // Plástico liso
            metalness={0.05} // Un poco de reflejo
            // Eliminamos toda la lógica de transparencia y emissiveMap que rompía el modelo
          />
        ))}
      </RoundedBox>
      
      <ContactShadows position={[0, -1.6, 0]} opacity={0.4} scale={7} blur={3} />
    </group>
  );
}