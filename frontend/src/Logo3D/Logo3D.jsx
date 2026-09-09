
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function Model({ hovered }) {
  const group = useRef();
  const { scene } = useGLTF("https://res.cloudinary.com/dbx6muxub/image/upload/v1786869663/logo_alatkf.glb");

  useFrame((state) => {
    if (!group.current) return;

    const time = state.clock.getElapsedTime();

    // Обычное состояние — практически неподвижное
    const targetRotationY = hovered
      ? Math.sin(time * 2.2) * 0.18
      : 0;

    const targetRotationX = hovered
      ? Math.cos(time * 1.8) * 0.08
      : 0;

    // Плавное движение к нужному положению
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotationY,
      0.08
    );

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetRotationX,
      0.08
    );

    // Небольшое "дыхание" при наведении
    const targetScale = hovered
      ? 1.08 + Math.sin(time * 3) * 0.015
      : 1;

    group.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );
  });

  return (
    <group
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation();
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
      }}
    >
      <primitive object={scene} />
    </group>
  );
}

function LogoScene() {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Model hovered={hovered} />
    </group>
  );
}

export default function Logo3D() {
  return (
    <div
      className="w-16 h-12 cursor-pointer"
      title="Logo"
    >
      <Canvas
    camera={{ position: [0, 0, 0]
       
        }}
        gl={{
          alpha: true,
          antialias: true,
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[2, 3, 4]}
          intensity={2}
        />

        <directionalLight
          position={[-2, -1, 2]}
          intensity={0.8}
        />

        <LogoScene />
      </Canvas>
    </div>
  );
}

