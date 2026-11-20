import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { LOOKS } from './GlitchMaterial';

/*
  Режим morph: каждая модель превращается в облако точек, а при смене слова
  точки перелетают с поверхности одной модели на поверхность другой.
  Первая модель «собирается» из случайного облака.

  Props: models, activeIndex, look, count (число точек), glitchRef, reduced
*/

const vertex = /* glsl */ `
  attribute vec3 aTo;
  attribute float aRand;
  uniform float uTime;
  uniform float uProgress;
  uniform float uGlitch;
  uniform float uScatter;
  uniform float uPoint;
  uniform float uPx;
  varying float vY;

  float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

  void main() {
    // у каждой точки своя задержка → превращение идёт «волной»
    float p = clamp(uProgress * 1.7 - aRand * 0.7, 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p);
    vec3 pos = mix(position, aTo, p);

    float swirl = sin(p * 3.14159265);
    vec3 dir = vec3(hash(aRand * 91.3), hash(aRand * 17.7), hash(aRand * 53.1)) - 0.5;
    pos += dir * swirl * uScatter * 2.0;

    float band = floor((pos.y * 0.5 + 0.5) * 14.0);
    float tick = floor(uTime * 14.0);
    float tear = step(0.75, hash(band + tick)) * uGlitch;
    pos.x += tear * (hash(band * 3.1 + tick) - 0.5) * 0.4;

    vY = clamp(pos.y * 0.5 + 0.5, 0.0, 1.0);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uPoint * uPx * (1.0 + swirl * 0.6) * (4.2 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uColor2;
  uniform float uOpacity;
  varying float vY;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * uOpacity;
    gl_FragColor = vec4(mix(uColor, uColor2, vY), a);
  }
`;

function sampleModel(scene, model, count) {
  scene.updateMatrixWorld(true);
  const parts = [];
  scene.traverse((o) => {
    if (!o.isMesh) return;
    const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    Object.keys(g.attributes).forEach((n) => n !== 'position' && g.deleteAttribute(n));
    g.applyMatrix4(o.matrixWorld);
    parts.push(g);
  });
  const merged = mergeGeometries(parts);
  merged.computeBoundingBox();
  const box = merged.boundingBox;
  const dim = box.getSize(new THREE.Vector3());
  const c = box.getCenter(new THREE.Vector3());
  const k = (2 / (Math.max(dim.x, dim.y, dim.z) || 1)) * (model.scale ?? 1);

  const sampler = new MeshSurfaceSampler(new THREE.Mesh(merged)).build();
  const out = new Float32Array(count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(v);
    out[i * 3] = (v.x - c.x) * k;
    out[i * 3 + 1] = (v.y - c.y) * k;
    out[i * 3 + 2] = (v.z - c.z) * k;
  }
  return out;
}

export default function MorphPoints({
  models,
  activeIndex = 0,
  look = LOOKS.hologram,
  zoom = 1,
  count = 24000,
  speed = 0.35,
  readoutRef,
  glitchRef,
  reduced = false,
}) {
  const urls = models.map((m) => m.url);
  const gltfs = useGLTF(urls);
  const { size, camera, gl } = useThree();

  const target = useRef(activeIndex);
  target.current = activeIndex;
  const spin = useRef();
  const fx = useRef({ index: 0, t0: -1, lastDeg: -1 });

  const samples = useMemo(
    () => gltfs.map((g, i) => sampleModel(g.scene, models[i], count)),
    [urls.join('|'), count] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const { geometry, material } = useMemo(() => {
    const from = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 2.5 * Math.cbrt(Math.random());
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      from[i * 3] = r * Math.sin(ph) * Math.cos(th);
      from[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      from[i * 3 + 2] = r * Math.cos(ph);
      rnd[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(from, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aTo', new THREE.BufferAttribute(samples[0].slice(), 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uGlitch: { value: 0 },
        uScatter: { value: 0.6 },
        uPoint: { value: 2 },
        uPx: { value: gl.getPixelRatio() },
        uOpacity: { value: 0.7 },
        uColor: { value: new THREE.Color('#fff') },
        uColor2: { value: new THREE.Color('#fff') },
      },
    });
    fx.current = { index: 0, t0: -1, lastDeg: -1 };
    return { geometry: g, material: m };
  }, [samples, count, gl]);

  useEffect(() => {
    const aspect = size.width / size.height;
    camera.position.set(0, 1.4, 4.2 * Math.max(1, 1.15 / aspect));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [size, camera]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const f = fx.current;
    if (f.t0 < 0) f.t0 = t;

    if (target.current !== f.index) {
      const pos = geometry.attributes.position;
      const to = geometry.attributes.aTo;
      pos.array.set(samples[f.index]); // старт — с предыдущей модели
      to.array.set(samples[target.current]);
      pos.needsUpdate = true;
      to.needsUpdate = true;
      f.index = target.current;
      f.t0 = t;
    }

    const k = Math.min((t - f.t0) / 1.8, 1);
    const u = material.uniforms;
    u.uTime.value = t;
    u.uProgress.value = reduced ? 1 : k;
    const glitch = !reduced && k < 0.25 && Math.random() < 0.5 ? 1 : 0;
    u.uGlitch.value = glitch;
    u.uScatter.value = look.scatter;
    u.uPoint.value = look.point;
    u.uOpacity.value = look.dots;
    u.uColor.value.set(look.color);
    u.uColor2.value.set(look.color2);
    material.blending = look.blending === 'normal' ? THREE.NormalBlending : THREE.AdditiveBlending;
    if (glitchRef) glitchRef.current = glitch;

    if (spin.current) {
      spin.current.rotation.y += reduced ? 0 : delta * speed;
      const deg = Math.round((((spin.current.rotation.y * 180) / Math.PI) % 360 + 360) % 360);
      if (readoutRef?.current && deg !== f.lastDeg) {
        f.lastDeg = deg;
        readoutRef.current.textContent = `rot ${String(deg).padStart(3, '0')}°`;
      }
    }
  });

  return (
    <group ref={spin} scale={zoom}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}