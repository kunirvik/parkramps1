import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { LOOKS, makeMaterial, applyLook } from './GlitchMaterial';

/*
  Ряд танцующих человечков из Mixamo (FBX) в том же глитч-стиле.
  Появляются (перерисовываются снизу вверх) когда visible=true,
  стираются когда visible=false.

  url        — FBX с mixamo.com: Format = FBX Binary, Skin = With Skin,
               желательно включить «In Place»
  count      — сколько человечков
  height     — высота одного человечка в единицах сцены (модели ~2 высотой)
  spacing    — расстояние между ними по X
  y, z       — положение ряда
  clipIndex  — какой клип проигрывать (в файле с Mixamo он один)
*/

// границы по Y в локальных координатах геометрии (в них считает шейдер)
function localBounds(scene) {
  let minY = Infinity;
  let maxY = -Infinity;
  scene.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.computeBoundingBox();
    minY = Math.min(minY, o.geometry.boundingBox.min.y);
    maxY = Math.max(maxY, o.geometry.boundingBox.max.y);
  });
  const h = maxY - minY || 1;
  return { minY, height: h, size: h };
}

export default function Dancers({
  visible,
  url,
  count = 5,
  height = 0.7,
  spacing = 0.55,
  y = -0.95,
  z = 0.8,
  clipIndex = 0,
  look = LOOKS.hologram,
  reduced = false,
}) {
  // useFBX возвращает THREE.Group; клипы лежат в .animations
  const fbx = useFBX(url);
  const groups = useRef([]);
  const state = useRef({ m: 0 });

  const rig = useMemo(() => {
    fbx.updateMatrixWorld(true);
    // Mixamo в сантиметрах (и armature с масштабом) — нормализуем по реальной высоте
    const box = new THREE.Box3().setFromObject(fbx);
    const dim = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const k = height / (dim.y || 1);
    const bounds = localBounds(fbx);
    const clip = fbx.animations[clipIndex] ?? fbx.animations[0];

    const dancers = Array.from({ length: count }, (_, i) => {
      const mats = [makeMaterial(false, bounds), makeMaterial(true, bounds)];
      const mixers = mats.map((mat) => {
        const root = cloneSkinned(fbx);
        root.traverse((o) => {
          if (o.isMesh) {
            o.material = mat; // родные FBX-материалы (в т.ч. массивы) заменяем нашим
            o.frustumCulled = false; // skinned-меши иначе могут пропадать
          }
        });
        const mixer = new THREE.AnimationMixer(root);
        if (clip) {
          const a = mixer.clipAction(clip);
          a.play();
          a.time = i * 0.43; // чтобы не танцевали синхронно
          a.timeScale = 0.9 + 0.08 * (i % 4);
        }
        return { root, mixer };
      });
      return { mats, mixers };
    });

    return { dancers, k, offset: [-center.x * k, -box.min.y * k, -center.z * k] };
  }, [fbx, count, height, clipIndex]);

  useEffect(() => {
    rig.dancers.forEach((d) => applyLook(d.mats, look));
  }, [rig, look]);

  useFrame(({ clock }, delta) => {
    const s = state.current;
    const dir = visible ? 1 : -1;
    s.m = THREE.MathUtils.clamp(s.m + dir * delta * (visible ? 1 / 1.5 : 1 / 0.55), 0, 1);
    if (reduced) s.m = visible ? 1 : 0;

    const moving = s.m > 0 && s.m < 1;
    const glitch = !reduced && moving && Math.random() < 0.45 ? 1 : 0;
    const S = 0.5; // «волна» появления: человечки возникают один за другим

    rig.dancers.forEach((d, i) => {
      const lin = THREE.MathUtils.clamp(
        s.m * (1 + S) - (i / Math.max(count - 1, 1)) * S,
        0,
        1
      );
      const r = 1 - Math.pow(1 - lin, 3);
      d.mats.forEach((m) => {
        m.uniforms.uTime.value = clock.elapsedTime;
        m.uniforms.uGlitch.value = glitch;
        m.uniforms.uReveal.value = r;
      });
      if (groups.current[i]) groups.current[i].visible = r > 0.001;
      if (s.m > 0) d.mixers.forEach((x) => x.mixer.update(delta));
    });
  });

  const mid = (count - 1) / 2;
  return (
    <group position={[0, y, z]}>
      {rig.dancers.map((d, i) => (
        <group
          key={i}
          ref={(g) => (groups.current[i] = g)}
          position={[(i - mid) * spacing, 0, -Math.abs(i - mid) * 0.12]}
        >
          <group position={rig.offset} scale={rig.k}>
            {d.mixers.map((x, j) => (
              <primitive key={j} object={x.root} />
            ))}
          </group>
        </group>
      ))}
    </group>
  );
}