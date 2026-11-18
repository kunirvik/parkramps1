import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Фон из частиц, которые "пересобираются" из одной модели в другую.
 *
 * Props:
 *  - index    — номер активного слова (0..models.length-1)
 *  - models   — массив путей к .glb (по одному на слово)
 *  - colors   — массив цветов частиц (по одному на слово)
 *  - onReady  — вызывается, когда все модели загружены
 */

const COUNT = 28000; // количество частиц
const MORPH_TIME = 1.8; // секунды на перестроение

// Если какой-то .glb не загрузился — рисуем процедурную фигуру вместо него
const FALLBACKS = [
  () => new THREE.TorusKnotGeometry(0.9, 0.3, 200, 32),
  () => new THREE.IcosahedronGeometry(1.3, 3),
  () => new THREE.TorusGeometry(1.1, 0.4, 32, 100),
  () => new THREE.BoxGeometry(1.8, 1.8, 1.8, 8, 8, 8),
];

/* ---------- Подготовка геометрии ---------- */

// оставляем только position и делаем non-indexed, чтобы геометрии можно было склеить
function cleanGeometry(geometry) {
  let g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  for (const name of Object.keys(g.attributes)) {
    if (name !== "position") g.deleteAttribute(name);
  }
  return g;
}

// собираем все меши glb-сцены в одну геометрию (с учётом их трансформаций)
function geometryFromObject(object) {
  object.updateMatrixWorld(true);
  const parts = [];
  object.traverse((child) => {
    if (child.isMesh && child.geometry) {
      const g = cleanGeometry(child.geometry);
      g.applyMatrix4(child.matrixWorld);
      parts.push(g);
    }
  });
  return parts.length ? mergeGeometries(parts, false) : null;
}

// центрируем и приводим к одному размеру, затем равномерно сэмплим точки по поверхности
function sampleGeometry(geometry, count) {
  const g = cleanGeometry(geometry);
  g.computeBoundingBox();
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  g.boundingBox.getCenter(center);
  g.boundingBox.getSize(size);
  g.translate(-center.x, -center.y, -center.z);
  const s = 2.8 / Math.max(size.x, size.y, size.z);
  g.scale(s, s, s);

  const sampler = new MeshSurfaceSampler(new THREE.Mesh(g)).build();
  const out = new Float32Array(count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(v);
    out.set([v.x, v.y, v.z], i * 3);
  }
  return out;
}

function loadModel(url, fallbackIndex) {
  return new Promise((resolve) => {
    new GLTFLoader().load(
      url,
      (gltf) => {
        const geo = geometryFromObject(gltf.scene);
        resolve(sampleGeometry(geo ?? FALLBACKS[fallbackIndex % FALLBACKS.length](), COUNT));
      },
      undefined,
      () => {
        console.warn(`[ModelBackground] не удалось загрузить ${url}, используется запасная фигура`);
        resolve(sampleGeometry(FALLBACKS[fallbackIndex % FALLBACKS.length](), COUNT));
      }
    );
  });
}

/* ---------- Шейдеры ---------- */

const vertexShader = /* glsl */ `
  attribute vec3 aTarget;
  attribute float aRand;
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;

  void main() {
    // у каждой частицы своя задержка — получается "волна" перестроения
    float t = clamp((uProgress - aRand * 0.45) / 0.55, 0.0, 1.0);
    float e = t * t * (3.0 - 2.0 * t);

    // position = откуда летим, aTarget = куда
    vec3 pos = mix(position, aTarget, e);

    // в середине перехода частицы разлетаются и закручиваются
    float burst = sin(e * 3.14159265);
    vec3 dir = vec3(sin(aRand * 40.0), cos(aRand * 70.0), sin(aRand * 90.0));
    pos += dir * burst * 1.4;

    float a = burst * (aRand - 0.5) * 3.0;
    float c = cos(a), s = sin(a);
    pos.xz = mat2(c, -s, s, c) * pos.xz;

    // лёгкое "дыхание" в покое
    pos += dir * sin(uTime * 1.2 + aRand * 30.0) * 0.012;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * uPixelRatio * (1.0 + burst * 0.8) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.2, d));
  }
`;

/* ---------- Компонент ---------- */

export default function ModelBackground({
  index = 0,
  models = [
    "/models/skatepark.glb",
    "/models/ramp.glb",
    "/models/events.glb",
    "/models/parkramp.glb",
  ],
  colors = ["#111111", "#111111", "#111111", "#f9a8d4"],
  onReady,
}) {
  const mountRef = useRef(null);
  const apiRef = useRef(null);
  const pendingIndex = useRef(index);

  // --- сцена: создаётся один раз ---
  useEffect(() => {
    const mount = mountRef.current;
    let disposed = false;
    let raf;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.z = 5;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    geometry.setAttribute("aTarget", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    const rand = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) rand[i] = Math.random();
    geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uProgress: { value: 1 },
        uTime: { value: 0 },
        uSize: { value: 3.2 },
        uPixelRatio: { value: pixelRatio },
        uColor: { value: new THREE.Color(colors[0]) },
      },
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      // на узких экранах (телефон) отодвигаем камеру, чтобы модель целиком влезала
      camera.position.z = w / h < 1 ? 5 / Math.max(w / h, 0.55) : 5;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // лёгкий параллакс от мыши
    const pointer = { x: 0, y: 0 };
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    // --- состояние морфинга ---
    let samples = null; // Float32Array[] — точки каждой модели
    let current = -1;
    let morphing = false;
    const targetColor = new THREE.Color(colors[0]);

    const morphTo = (i) => {
      if (!samples || i === current || !samples[i]) return;
      const pos = geometry.attributes.position;
      const tgt = geometry.attributes.aTarget;

      if (current === -1) {
        // первый показ: сразу строим модель из "облака"
        pos.array.set(samples[i].map((v) => v * 3 * Math.random()));
      } else {
        // стартуем из того, где частицы находятся сейчас (= прошлая цель)
        pos.array.set(tgt.array);
      }
      tgt.array.set(samples[i]);
      pos.needsUpdate = true;
      tgt.needsUpdate = true;

      material.uniforms.uProgress.value = 0;
      targetColor.set(colors[i] ?? colors[0]);
      current = i;
      morphing = true;
    };

    apiRef.current = { morphTo };

    // грузим все модели заранее, чтобы переключение было мгновенным
    Promise.all(models.map((url, i) => loadModel(url, i))).then((result) => {
      if (disposed) return;
      samples = result;
      morphTo(pendingIndex.current);
      onReady?.();
    });

    // --- цикл отрисовки ---
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      material.uniforms.uTime.value += dt;

      if (morphing) {
        const p = Math.min(material.uniforms.uProgress.value + dt / MORPH_TIME, 1);
        material.uniforms.uProgress.value = p;
        if (p >= 1) morphing = false;
      }
      material.uniforms.uColor.value.lerp(targetColor, 0.06);

      points.rotation.y += dt * 0.15;
      camera.position.x += (pointer.x * 0.4 - camera.position.x) * 0.04;
      camera.position.y += (-pointer.y * 0.25 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- смена слова -> смена модели ---
  useEffect(() => {
    pendingIndex.current = index;
    apiRef.current?.morphTo(index);
  }, [index]);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
}