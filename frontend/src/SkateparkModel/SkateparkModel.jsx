import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/*
  Прозора "глітч"-модель скейтпарку.
  - Модель автоматично центрується і масштабується до розміру ~2 одиниці,
    тому не треба підбирати camera.position під кожен .glb
  - Матеріал: fresnel (світяться краї) + сканлайни + wireframe-шар зверху
  - Раз на 2-5 секунд відбувається "збій": горизонтальні зсуви смуг + мерехтіння
*/

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uGlitch;
  uniform float uSize;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vY;

  float rand(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

  void main() {
    vec3 pos = position;

    // смуги по висоті, які зсуваються по X під час збою
    float band = floor(pos.y / uSize * 14.0);
    float tick = floor(uTime * 14.0);
    float tear = step(0.75, rand(band + tick)) * uGlitch;
    pos.x += tear * (rand(band * 3.1 + tick) - 0.5) * uSize * 0.22;
    pos.z += tear * (rand(band * 7.7 + tick) - 0.5) * uSize * 0.08;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = -mv.xyz;
    vY = pos.y / uSize;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uGlitch;
  uniform float uWire;
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vY;

  void main() {
    float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.2);
   float scan = 0.5 + 0.5 * sin(vY * 160.0 - uTime * 2.0);
    float flick = step(0.96, fract(sin(floor(uTime * 18.0) * 91.7) * 43758.5)) * uGlitch;

float solid = fres * 0.38 + scan * 0.025;
float wire = 0.12 + scan * 0.035;
  float a = mix(solid, wire, uWire);
a = clamp(a, 0.0, 0.42);
a *= 1.0 - flick * 0.8;
    gl_FragColor = vec4(uColor, a);
  }
`;

function makeMaterial(color, size, wire) {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending,
    wireframe: wire,
    uniforms: {
      uTime: { value: 0 },
      uGlitch: { value: 0 },
      uSize: { value: size },
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

export default function SkateparkModel({
  url = 'https://res.cloudinary.com/dbx6muxub/image/upload/v1793542923/sp1_f0qnhd.glb',
  color = '#b8b8b8',
  speed = 0.35,
}) {
  const { scene } = useGLTF(url);
  const spin = useRef();
  const glitch = useRef({ end: 0, next: 1.5 });

  const { solid, wire, mats, scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const dim = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(dim.x, dim.y, dim.z) || 1;

    const solidMat = makeMaterial(color, maxDim, false);
    const wireMat = makeMaterial(color, maxDim, true);

    return {
      solid: applyMaterial(scene.clone(true), solidMat),
      wire: applyMaterial(scene.clone(true), wireMat),
      mats: [solidMat, wireMat],
      scale: 2 / maxDim,
      offset: center.multiplyScalar(-2 / maxDim),
    };
  }, [scene, color]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const g = glitch.current;

    // запуск короткого "збою"
    if (t > g.next && t > g.end) {
      g.end = t + 0.15 + Math.random() * 0.25;
      g.next = g.end + 2 + Math.random() * 3;
    }
    const active = t < g.end ? 1 : 0;

    mats.forEach((m) => {
      m.uniforms.uTime.value = t;
      m.uniforms.uGlitch.value = active;
    });

    if (spin.current) {
      spin.current.rotation.y += delta * speed;
      spin.current.position.x = active ? (Math.random() - 0.5) * 0.08 : 0;
    }
  });

  return (
    <group ref={spin}>
      <group position={offset} scale={scale}>
        <primitive object={solid} />
        <primitive object={wire} />
      </group>
    </group>
  );
}

useGLTF.preload('https://res.cloudinary.com/dbx6muxub/image/upload/v1793542923/sp1_f0qnhd.glb');