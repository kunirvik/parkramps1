import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/*
  Сцена з кількома прозорими глітч-моделями.

  Цикл переходу:
    out (збій, модель стирається зверху вниз, ~0.55 с)
      → зміна моделі
      → in (перемальовування знизу вгору зі світлою лінією, ~1.5 с)
      → hold (з короткими мікро-збоями)

  Два способи керування:
    1) Керований: передайте activeIndex. Коли він змінюється, сцена сама
       робить out → in на потрібну модель. Автоматичного циклу немає.
       Так модель синхронізується зі зміною тексту.
    2) Автоматичний (activeIndex не передано): збій раз на 4–6 секунд,
       у mode='swap' змінює модель по колу, у mode='cluster'
       перемальовує всі моделі разом.

  Props:
    models      — [{ url, scale, position }]
    mode        — 'swap' | 'cluster'
    activeIndex — номер моделі (керований режим, тільки swap)
    blending    — 'additive' (для темного фону) | 'normal' (для світлого)
    color       — колір ліній
    onIndex     — (i) => void, коли змінилась активна модель (автоматичний режим)
    readoutRef  — ref на DOM-елемент для кута обертання
    triggerRef  — ref, у який кладеться функція "запустити збій зараз"
    reduced     — true: без анімацій
*/

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uGlitch;
  uniform float uSize;
  uniform float uMinY;
  uniform float uHeight;
  uniform float uReveal;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vYn;

  float rand(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

  void main() {
    vec3 pos = position;
    float yn = (pos.y - uMinY) / uHeight;

    float band = floor(yn * 14.0);
    float tick = floor(uTime * 14.0);

    float tear = step(0.75, rand(band + tick)) * uGlitch;
    pos.x += tear * (rand(band * 3.1 + tick) - 0.5) * uSize * 0.22;
    pos.z += tear * (rand(band * 7.7 + tick) - 0.5) * uSize * 0.08;

    float front = 1.0 - smoothstep(0.0, 0.1, abs(yn - uReveal));
    float inside = step(0.001, uReveal) * step(uReveal, 0.999);
    pos.x += front * inside * (rand(band + tick * 1.3) - 0.5) * uSize * 0.05;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = -mv.xyz;
    vYn = yn;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uGlitch;
  uniform float uWire;
  uniform float uReveal;
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vYn;

  void main() {
    if (vYn > uReveal) discard;

    float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.2);
    float scan = 0.5 + 0.5 * sin(vYn * 220.0 - uTime * 2.5);
    float flick = step(0.96, fract(sin(floor(uTime * 18.0) * 91.7) * 43758.5)) * uGlitch;

    float solid = fres * 0.85 + scan * 0.07;
    float wire = 0.32 + scan * 0.1;
    float a = mix(solid, wire, uWire);
    a *= 1.0 - flick * 0.8;

    float edge = 1.0 - smoothstep(0.0, 0.05, uReveal - vYn);
    a += edge * 0.7 * step(uReveal, 0.999);

    gl_FragColor = vec4(uColor, clamp(a, 0.0, 1.0));
  }
`;

function makeMaterial(color, maxDim, minY, height, wire, blending) {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: blending === 'normal' ? THREE.NormalBlending : THREE.AdditiveBlending,
    wireframe: wire,
    uniforms: {
      uTime: { value: 0 },
      uGlitch: { value: 0 },
      uSize: { value: maxDim },
      uMinY: { value: minY },
      uHeight: { value: height },
      uReveal: { value: 0 },
      uWire: { value: wire ? 1 : 0 },
      uColor: { value: new THREE.Color(color) },
    },
  });
}

function applyMaterial(root, material) {
  root.traverse((o) => {
    if (o.isMesh) o.material = material;
  });
  return root;
}

function prepare(scene, color, model, blending) {
  const box = new THREE.Box3().setFromObject(scene);
  const dim = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(dim.x, dim.y, dim.z) || 1;
  const k = (2 / maxDim) * (model.scale ?? 1);

  const solidMat = makeMaterial(color, maxDim, box.min.y, dim.y || 1, false, blending);
  const wireMat = makeMaterial(color, maxDim, box.min.y, dim.y || 1, true, blending);

  return {
    solid: applyMaterial(scene.clone(true), solidMat),
    wire: applyMaterial(scene.clone(true), wireMat),
    mats: [solidMat, wireMat],
    k,
    offset: center.multiplyScalar(-k),
    position: model.position ?? [0, 0, 0],
  };
}

export const preloadModels = (models) => useGLTF.preload(models.map((m) => m.url));

export default function SkateparkStage({
  models,
  mode = 'swap',
  activeIndex,
  blending = 'additive',
  color = '#b8b8b8',
  speed = 0.35,
  onIndex,
  readoutRef,
  triggerRef,
  reduced = false,
}) {
  const urls = models.map((m) => m.url);
  const gltfs = useGLTF(urls);
  const { size, camera } = useThree();

  const controlled = activeIndex !== undefined;
  const target = useRef(activeIndex ?? 0);
  target.current = activeIndex ?? 0;

  const spin = useRef();
  const groups = useRef([]);
  // стартуємо з фази 'in': при появі модель сама перемальовується з нуля
  const fx = useRef({
    phase: 'in',
    t0: -1,
    nextAt: 4,
    nextMicro: 1.2,
    microEnd: 0,
    reveal: 0,
    glitch: 0,
    index: Math.min(activeIndex ?? 0, models.length - 1),
    force: false,
    lastDeg: -1,
  });

  const items = useMemo(
    () => gltfs.map((g, i) => prepare(g.scene, color, models[i], blending)),
    [urls.join('|'), color, blending] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (triggerRef) triggerRef.current = () => (fx.current.force = true);
  }, [triggerRef]);

  // на вузьких екранах відсуваємо камеру, щоб усе влізло
  useEffect(() => {
    const aspect = size.width / size.height;
    camera.position.set(0, 1.4, 4.2 * Math.max(1, 1.15 / aspect));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [size, camera]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const f = fx.current;
    const n = items.length;

    if (reduced) {
      // без анімацій: просто показуємо потрібну модель
      f.reveal = 1;
      f.glitch = 0;
      if (controlled) f.index = target.current;
    } else if (f.phase === 'hold') {
      f.reveal = 1;
      if (t > f.nextMicro) {
        f.microEnd = t + 0.1 + Math.random() * 0.15;
        f.nextMicro = t + 1.5 + Math.random() * 2.5;
      }
      f.glitch = t < f.microEnd ? 1 : 0;

      const needSwap = controlled && target.current !== f.index;
      if (needSwap || f.force || (!controlled && t > f.nextAt)) {
        f.force = false;
        f.phase = 'out';
        f.t0 = t;
      }
    } else if (f.phase === 'out') {
      const k = Math.min((t - f.t0) / 0.55, 1);
      f.glitch = 1;
      f.reveal = 1 - k * k;
      if (k >= 1) {
        if (controlled) {
          // беремо найновіше значення, навіть якщо воно змінилось під час стирання
          f.index = Math.min(target.current, n - 1);
        } else if (mode === 'swap' && n > 1) {
          f.index = (f.index + 1) % n;
          onIndex?.(f.index);
        }
        f.phase = 'in';
        f.t0 = t;
      }
    } else {
      if (f.t0 < 0) f.t0 = t;
      const k = Math.min((t - f.t0) / 1.5, 1);
      f.reveal = 1 - Math.pow(1 - k, 3);
      f.glitch = k > 0 && k < 0.35 && Math.random() < 0.5 ? 1 : 0;
      if (k >= 1) {
        f.phase = 'hold';
        f.nextAt = t + 3.5 + Math.random() * 2.5;
        f.nextMicro = t + 1.2;
      }
    }

    items.forEach((it, i) => {
      let r;
      if (mode === 'swap') {
        r = i === f.index ? f.reveal : 0;
      } else {
        const stagger = 0.35;
        r = THREE.MathUtils.clamp(f.reveal * (1 + stagger) - i * stagger, 0, 1);
      }
      it.mats.forEach((m) => {
        m.uniforms.uTime.value = t;
        m.uniforms.uGlitch.value = f.glitch;
        m.uniforms.uReveal.value = r;
      });
      if (groups.current[i]) groups.current[i].visible = r > 0.001;
    });

    if (spin.current) {
      spin.current.rotation.y += reduced ? 0 : delta * speed;
      spin.current.position.x = f.glitch ? (Math.random() - 0.5) * 0.08 : 0;

      const deg = Math.round((((spin.current.rotation.y * 180) / Math.PI) % 360 + 360) % 360);
      if (readoutRef?.current && deg !== f.lastDeg) {
        f.lastDeg = deg;
        readoutRef.current.textContent = `rot ${String(deg).padStart(3, '0')}°`;
      }
    }
  });

  return (
    <group ref={spin}>
      {items.map((it, i) => (
        <group
          key={i}
          ref={(g) => (groups.current[i] = g)}
          position={mode === 'swap' ? [0, 0, 0] : it.position}
        >
          <group position={it.offset} scale={it.k}>
            <primitive object={it.solid} />
            <primitive object={it.wire} />
          </group>
        </group>
      ))}
    </group>
  );
}