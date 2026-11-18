import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

/*
  Хроматическая аберрация (RGB-расслоение), как в примере three.js
  webgpu_postprocessing_ca. Усиливается во время глитча.

  amount    — 0…1 (0 = эффект полностью выключен и не стоит ресурсов)
  glitchRef — ref с текущей силой глитча (его пишет сцена)
*/
export default function Effects({ amount = 0.3, glitchRef }) {
  const offset = useMemo(() => new THREE.Vector2(0, 0), []);

  useFrame(() => {
    const g = glitchRef?.current ?? 0;
    const a = amount * 0.004 * (1 + g * 4);
    offset.set(a, a * 0.6);
  });

  if (amount <= 0.001) return null;

  return (
    <EffectComposer multisampling={0}>
      <ChromaticAberration offset={offset} radialModulation={false} modulationOffset={0} />
    </EffectComposer>
  );
}