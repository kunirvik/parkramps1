import * as THREE from 'three';

/*
  Общий материал для всех эффектов + пресеты внешнего вида.

  Почему раньше было пересвечено:
   1) additive-смешивание СУММИРУЕТ цвета: solid + wire + линия-фронт
      накладываются друг на друга и на светлый фон;
   2) цвет #e5e5e5 почти белый — после суммирования слоёв уходит в 1.0;
   3) яркость слоёв была зашита в шейдер (0.85 / 0.32 / 0.7).
  Теперь яркость каждого слоя — отдельный параметр (fill / lines / edge).
*/

const base = {
  color: '#d8dde2',
  color2: '#d8dde2', // цвет верха модели (градиент по высоте)
  blending: 'additive', // 'additive' (тёмный фон) | 'normal' (светлый)
  fill: 0.35, // яркость заливки (френель)
  lines: 0.22, // яркость сетки (wireframe)
  fresnel: 2.2, // насколько заливка уходит к краям силуэта
  scan: 0.35, // сила горизонтальных линий-сканов
  edge: 0.6, // яркость светлой линии при перерисовке
  ca: 0.3, // хроматическая аберрация (пост-эффект)
  dots: 0.7, // прозрачность точек (режим morph)
  point: 2.2, // размер точек (режим morph)
  scatter: 0.6, // разлёт точек при превращении (режим morph)
};

export const LOOKS = {
  hologram: { ...base, color: '#cfe3ff', color2: '#8fb4ff' },
  wireframe: { ...base, fill: 0, lines: 0.5, scan: 0.5, edge: 0.5, ca: 0.25 },
  xray: { ...base, fill: 0.7, lines: 0, fresnel: 3.5, scan: 0.15, edge: 0.8, ca: 0.2 },
  neon: {
    ...base,
    color: '#ff4fa3',
    color2: '#4ff0ff',
    fill: 0.2,
    lines: 0.4,
    fresnel: 2.8,
    scan: 0.6,
    edge: 1,
    ca: 0.7,
  },
  // для светлого фона
  ink: {
    ...base,
    color: '#111111',
    color2: '#111111',
    blending: 'normal',
    fill: 0.12,
    lines: 0.7,
    fresnel: 2,
    scan: 0.1,
    edge: 0.9,
    ca: 0,
    dots: 0.9,
  },
};

// Вершинный шейдер подключает чанки skinning, поэтому работает и
// для анимированных (skinned) моделей — танцующих человечков.
const vertex = /* glsl */ `
  #include <common>
  #include <skinning_pars_vertex>
  uniform float uTime;
  uniform float uGlitch;
  uniform float uSize;
  uniform float uMinY;
  uniform float uHeight;
  uniform float uReveal;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vYn;

  float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

  void main() {
    #include <beginnormal_vertex>
    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <begin_vertex>
    #include <skinning_vertex>

    vec3 pos = transformed;
    float yn = (position.y - uMinY) / uHeight;

    float band = floor(yn * 14.0);
    float tick = floor(uTime * 14.0);

    float tear = step(0.75, hash(band + tick)) * uGlitch;
    pos.x += tear * (hash(band * 3.1 + tick) - 0.5) * uSize * 0.22;
    pos.z += tear * (hash(band * 7.7 + tick) - 0.5) * uSize * 0.08;

    float front = 1.0 - smoothstep(0.0, 0.1, abs(yn - uReveal));
    float inside = step(0.001, uReveal) * step(uReveal, 0.999);
    pos.x += front * inside * (hash(band + tick * 1.3) - 0.5) * uSize * 0.05;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vNormal = normalize(normalMatrix * objectNormal);
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
  uniform float uOpacity;
  uniform float uFresnel;
  uniform float uScan;
  uniform float uEdge;
  uniform vec3 uColor;
  uniform vec3 uColor2;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vYn;

  void main() {
    if (vYn > uReveal) discard;

    float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), uFresnel);
    float scan = 0.5 + 0.5 * sin(vYn * 220.0 - uTime * 2.5);
    float flick = step(0.96, fract(sin(floor(uTime * 18.0) * 91.7) * 43758.5)) * uGlitch;

    float a = uWire > 0.5 ? (0.6 + scan * uScan) : (fres + scan * uScan * 0.3);
    a *= uOpacity;
    a *= 1.0 - flick * 0.8;

    float edge = 1.0 - smoothstep(0.0, 0.05, uReveal - vYn);
    a += edge * uEdge * step(uReveal, 0.999);

    vec3 col = mix(uColor, uColor2, clamp(vYn, 0.0, 1.0));
    gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
  }
`;

// bounds: { minY, height, size } — в локальных координатах геометрии
export function makeMaterial(wire, bounds) {
  const m = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    wireframe: wire,
    uniforms: {
      uTime: { value: 0 },
      uGlitch: { value: 0 },
      uSize: { value: bounds.size },
      uMinY: { value: bounds.minY },
      uHeight: { value: bounds.height },
      uReveal: { value: 0 },
      uWire: { value: wire ? 1 : 0 },
      uOpacity: { value: 0.3 },
      uFresnel: { value: 2.2 },
      uScan: { value: 0.3 },
      uEdge: { value: 0.6 },
      uColor: { value: new THREE.Color('#ffffff') },
      uColor2: { value: new THREE.Color('#ffffff') },
    },
  });
  m.userData.wire = wire;
  return m;
}

export function applyLook(mats, look) {
  mats.forEach((m) => {
    const u = m.uniforms;
    const opacity = m.userData.wire ? look.lines : look.fill;
    u.uColor.value.set(look.color);
    u.uColor2.value.set(look.color2);
    u.uOpacity.value = opacity;
    u.uFresnel.value = look.fresnel;
    u.uScan.value = look.scan;
    u.uEdge.value = look.edge;
    m.blending = look.blending === 'normal' ? THREE.NormalBlending : THREE.AdditiveBlending;
    m.visible = opacity > 0.001;
  });
}

export function applyMaterial(root, material) {
  root.traverse((o) => {
    if (o.isMesh) o.material = material;
  });
  return root;
}