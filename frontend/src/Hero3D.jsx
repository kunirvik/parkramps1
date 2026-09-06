import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";


// ============================================================
// DRACO
// ============================================================

const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
);


// ============================================================
// LOAD MODEL
// ============================================================

function loadMeshWithMaterial({
  url,
  fallbackGeo,
  material,
  onReady,
  label = "model",
}) {
  if (!url) {
    onReady(new THREE.Mesh(fallbackGeo, material));
    return () => {};
  }

  let cancelled = false;

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.load(
    url,

    (gltf) => {
      if (cancelled) return;

      const group = gltf.scene;

      group.traverse((child) => {
        if (!child.isMesh) return;

        if (Array.isArray(child.material)) {
          child.material = child.material.map(() => material);
        } else {
          child.material = material;
        }

        child.material.needsUpdate = true;
      });

      onReady(group);
    },

    undefined,

    (err) => {
      console.error(
        `[Hero3D] Не удалось загрузить ${label} (${url}):`,
        err
      );

      if (cancelled) return;

      onReady(
        new THREE.Mesh(
          fallbackGeo,
          material
        )
      );
    }
  );

  return () => {
    cancelled = true;
  };
}


// ============================================================
// FIT + CENTER
// ============================================================

function fitAndCenter(object, targetSize) {
  const box = new THREE.Box3().setFromObject(object);

  const size = new THREE.Vector3();

  box.getSize(size);

  const maxDim =
    Math.max(
      size.x,
      size.y,
      size.z
    ) || 1;

  object.scale.setScalar(
    targetSize / maxDim
  );

  const box2 =
    new THREE.Box3().setFromObject(object);

  const center =
    new THREE.Vector3();

  box2.getCenter(center);

  object.position.sub(center);
}


// ============================================================
// EXACT BACKGROUND SAMPLING SHADER + ПРОЦЕДУРНЫЙ РЕЛЬЕФ
//
// ДОБАВЛЕНО: раньше нормаль поверхности бралась идеально плоской
// на каждую грань (dFdx/dFdy), из-за чего модель выглядела
// гладкой и "гранёной". Теперь эта плоская нормаль слегка
// возмущается процедурным шумом (по object-space координатам,
// поэтому рисунок неподвижен относительно модели, а не "плывёт"
// при вращении) — получается лёгкий рельеф/шероховатость.
// uReliefStrength / uReliefScale — сила и частота рельефа,
// подбираются под конкретную модель.
// ============================================================

function makeBgSampleMaterial(mediaTexture) {
  return new THREE.ShaderMaterial({

    uniforms: {

      uMediaTex: {
        value: mediaTexture,
      },

      uContainerSize: {
        value: new THREE.Vector2(1, 1),
      },

      uContainerOffset: {
        value: new THREE.Vector2(0, 0),
      },

      uCanvasOffset: {
        value: new THREE.Vector2(0, 0),
      },

      uCanvasSize: {
        value: new THREE.Vector2(1, 1),
      },

      uMediaNative: {
        value: new THREE.Vector2(16, 9),
      },

      uDPR: {
        value: window.devicePixelRatio || 1,
      },

      uDistortion: {
        value: 0.05,
      },

      uFresnelStrength: {
        value: 0.25,
      },

      uChromaShift: {
        value: 0.01,
      },

      // ИЗМЕНЕНО: новые uniform-ы рельефа
      uReliefStrength: {
        value: 0.1, // "небольшой" рельеф — держим слабым
      },

      uReliefScale: {
        value: 6.0, // частота "рябь" по поверхности модели
      },
    },


    // ========================================================
    // VERTEX
    // ========================================================

    vertexShader: `

      varying vec3 vViewPos;
      varying vec3 vViewDir;
      varying vec3 vObjectPos;

      void main() {

        vObjectPos = position;

        vec4 mv =
          modelViewMatrix *
          vec4(position, 1.0);

        vViewPos = mv.xyz;

        vViewDir =
          normalize(-mv.xyz);

        gl_Position =
          projectionMatrix * mv;
      }

    `,


    // ========================================================
    // FRAGMENT
    // ========================================================

    fragmentShader: `

      uniform sampler2D uMediaTex;

      uniform vec2 uContainerSize;
      uniform vec2 uContainerOffset;

      uniform vec2 uCanvasOffset;
      uniform vec2 uCanvasSize;

      uniform vec2 uMediaNative;

      uniform float uDPR;
      uniform float uDistortion;
      uniform float uFresnelStrength;
      uniform float uChromaShift;

      uniform float uReliefStrength;
      uniform float uReliefScale;


      varying vec3 vViewPos;
      varying vec3 vViewDir;
      varying vec3 vObjectPos;


      // ------------------------------------------------------
      // ПРОЦЕДУРНЫЙ ШУМ (value noise) ДЛЯ РЕЛЬЕФА
      // ------------------------------------------------------

      float hash3(vec3 p) {

        p = fract(p * 0.3183099 + 0.1);

        p *= 17.0;

        return fract(
          p.x * p.y * p.z *
          (p.x + p.y + p.z)
        );
      }

      float valueNoise(vec3 p) {

        vec3 i = floor(p);
        vec3 f = fract(p);

        f = f * f * (3.0 - 2.0 * f);

        float n000 = hash3(i + vec3(0.0, 0.0, 0.0));
        float n100 = hash3(i + vec3(1.0, 0.0, 0.0));
        float n010 = hash3(i + vec3(0.0, 1.0, 0.0));
        float n110 = hash3(i + vec3(1.0, 1.0, 0.0));
        float n001 = hash3(i + vec3(0.0, 0.0, 1.0));
        float n101 = hash3(i + vec3(1.0, 0.0, 1.0));
        float n011 = hash3(i + vec3(0.0, 1.0, 1.0));
        float n111 = hash3(i + vec3(1.0, 1.0, 1.0));

        float nx00 = mix(n000, n100, f.x);
        float nx10 = mix(n010, n110, f.x);
        float nx01 = mix(n001, n101, f.x);
        float nx11 = mix(n011, n111, f.x);

        float nxy0 = mix(nx00, nx10, f.y);
        float nxy1 = mix(nx01, nx11, f.y);

        return mix(nxy0, nxy1, f.z);
      }


      // Возмущаем плоскую нормаль небольшим "рельефом",
      // считая градиент шума конечными разностями.
      vec3 applyRelief(vec3 flatNormal) {

        vec3 p = vObjectPos * uReliefScale;

        float eps = 0.05;

        float n  = valueNoise(p);
        float nx = valueNoise(p + vec3(eps, 0.0, 0.0));
        float ny = valueNoise(p + vec3(0.0, eps, 0.0));

        vec2 grad =
          vec2(nx - n, ny - n) / eps;

        vec3 bumped =
          flatNormal +
          vec3(grad * uReliefStrength, 0.0);

        return normalize(bumped);
      }


      // ------------------------------------------------------
      // EXACT "COVER" CALCULATION
      // ------------------------------------------------------

      vec2 coverUV(vec2 screenUV) {

        float containerAspect =
          uContainerSize.x /
          uContainerSize.y;

        float mediaAspect =
          uMediaNative.x /
          uMediaNative.y;

        vec2 uv = screenUV;


        if (
          containerAspect >
          mediaAspect
        ) {

          float scale =
            mediaAspect /
            containerAspect;

          uv.y =
            (uv.y - 0.5) *
            scale +
            0.5;

        } else {

          float scale =
            containerAspect /
            mediaAspect;

          uv.x =
            (uv.x - 0.5) *
            scale +
            0.5;
        }

        return uv;
      }


      // ------------------------------------------------------
      // BACKGROUND SAMPLE
      // ------------------------------------------------------

      vec3 sampleBg(
        vec2 local,
        vec3 flatNormal
      ) {

        vec2 distorted =
          local +
          flatNormal.xy *
          uDistortion;


        vec2 mediaUV =
          coverUV(
            clamp(
              distorted,
              0.0,
              1.0
            )
          );


        vec2 sampleUV =
          vec2(
            mediaUV.x,
            1.0 - mediaUV.y
          );


        return texture2D(
          uMediaTex,
          sampleUV
        ).rgb;
      }


      // ------------------------------------------------------
      // MAIN
      // ------------------------------------------------------

      void main() {

        vec3 fdx = dFdx(vViewPos);
        vec3 fdy = dFdy(vViewPos);


        vec3 flatNormal =
          normalize(
            cross(
              fdx,
              fdy
            )
          );


        // ДОБАВЛЕНО: накладываем рельеф на плоскую нормаль
        vec3 reliefNormal =
          applyRelief(flatNormal);


        vec2 localCanvasPx =
          gl_FragCoord.xy /
          uDPR;


        localCanvasPx.y =
          uCanvasSize.y -
          localCanvasPx.y;


        vec2 windowPx =
          uCanvasOffset +
          localCanvasPx;


        vec2 local =
          (
            windowPx -
            uContainerOffset
          ) /
          uContainerSize;


        // ----------------------------------------------------
        // CHROMATIC SHIFT (теперь использует reliefNormal)
        // ----------------------------------------------------

        float r =
          sampleBg(
            local,
            reliefNormal +
            vec3(
              uChromaShift,
              0.0,
              0.0
            )
          ).r;


        float g =
          sampleBg(
            local,
            reliefNormal
          ).g;


        float b =
          sampleBg(
            local,
            reliefNormal -
            vec3(
              uChromaShift,
              0.0,
              0.0
            )
          ).b;


        vec3 bg =
          vec3(
            r,
            g,
            b
          );


        // ----------------------------------------------------
        // FRESNEL (тоже на reliefNormal — рельеф виден и в бликах)
        // ----------------------------------------------------

        float fresnel =
          pow(
            1.0 -
            max(
              dot(
                normalize(vViewDir),
                reliefNormal
              ),
              0.0
            ),
            1.6
          );


        vec3 color =
          bg +
          fresnel *
          uFresnelStrength;


        gl_FragColor =
          vec4(
            color,
            1.0
          );
      }

    `,
  });
}


// ============================================================
// HERO 3D
// ============================================================

export default function Hero3D({
  modelUrl,
  media, // { type: 'video' | 'image', url: string }
  videoRef,
  restRotationY = Math.PI / 4,
}) {

  const mountRef =
    useRef(null);

  const heroSectionRef =
    useRef(null);


  // ==========================================================
  // ПОСТОЯННОЕ ХРАНИЛИЩЕ THREE.JS-ОБЪЕКТОВ
  //
  // ИЗМЕНЕНО: раньше сцена/рендерер/модель пересоздавались
  // ПОЛНОСТЬЮ при каждой смене media (видео/фото), потому что
  // useEffect был завязан в том числе на media.type/media.url.
  // Это означало повторную загрузку .glb-модели по сети на
  // КАЖДОЕ переключение категории — отсюда и лаги.
  //
  // Теперь сцена/камера/рендерер/модель создаются ОДИН РАЗ
  // (эффект №1, зависит только от modelUrl), а смена медиа
  // (эффект №2) лишь подменяет текстуру уже существующего
  // материала — без пересоздания рендерера и без повторной
  // загрузки модели.
  // ==========================================================

  const threeRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    bgMaterial: null,
    current: null,       // загруженный Object3D модели
    mediaTexture: null,  // текущая текстура (видео или фото)
    mediaReady: false,   // готово ли текущее медиа к показу
    modelRevealedAt: null, // когда модель впервые стала видимой
    tryReveal: () => {},
  });


  // ==========================================================
  // ЭФФЕКТ №1 — СЦЕНА, РЕНДЕРЕР, МОДЕЛЬ (один раз)
  // ==========================================================

  useEffect(() => {

    const mount =
      mountRef.current;

    if (!mount) return;


    const CONFIG = {

      modelSize: 4.5,

      cameraZ: 6,

      dragSensitivity: 0.008,

      inertiaDamping: 0.94,

      minVelocity: 0.00015,

      settleDelay: 500,

      settleSpeed: 0.045,

      scrollPauseMs: 700,

      viewportFraction: 0.82,
      minCanvasPx: 320,
      maxCanvasPx: 1500,

      // ДОБАВЛЕНО: модель не двигается первые N мс после появления
      autoRotateDelayMs: 10000,
    };


    const heroEl =
      mount.closest(".hero3d");

    heroSectionRef.current =
      heroEl;


    const scene =
      new THREE.Scene();


    const camera =
      new THREE.PerspectiveCamera(
        42,
        1,
        0.1,
        100
      );

    camera.position.set(
      0,
      0,
      CONFIG.cameraZ
    );


    const renderer =
      new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference:
          "high-performance",
      });


    const getSize = () => {

      const vw =
        window.innerWidth;

      const vh =
        window.innerHeight;

      const base =
        Math.min(vw, vh) *
        CONFIG.viewportFraction;

      return Math.round(
        Math.max(
          CONFIG.minCanvasPx,
          Math.min(
            base,
            CONFIG.maxCanvasPx
          )
        )
      );
    };


    let size =
      getSize();


    renderer.setSize(
      size,
      size
    );


    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        3
      )
    );


    renderer.outputColorSpace =
      THREE.LinearSRGBColorSpace;


    mount.appendChild(
      renderer.domElement
    );


    // ========================================================
    // МАТЕРИАЛ — создаём один раз, с временной заглушкой-текстурой.
    // Реальная текстура (видео/фото) придёт из эффекта №2.
    // ========================================================

    const bgMaterial =
      makeBgSampleMaterial(
        new THREE.Texture()
      );


    threeRef.current.scene = scene;
    threeRef.current.camera = camera;
    threeRef.current.renderer = renderer;
    threeRef.current.bgMaterial = bgMaterial;
    threeRef.current.current = null;
    threeRef.current.mediaTexture = null;
    threeRef.current.mediaReady = false;
    threeRef.current.modelRevealedAt = null;


    // ========================================================
    // ПОКАЗАТЬ МОДЕЛЬ, КОГДА ГОТОВЫ И МОДЕЛЬ, И МЕДИА
    // ========================================================

    const tryReveal = () => {

      const t = threeRef.current;

      if (
        t.current &&
        t.mediaReady &&
        !t.current.visible
      ) {

        t.current.visible = true;

        if (t.modelRevealedAt === null) {

          t.modelRevealedAt =
            performance.now();
        }
      }
    };

    threeRef.current.tryReveal =
      tryReveal;


    // ========================================================
    // SCREEN UNIFORMS
    // ========================================================

    const updateScreenUniforms =
      () => {

        const dpr =
          Math.min(
            window.devicePixelRatio || 1,
            3
          );


        bgMaterial.uniforms
          .uDPR.value =
          dpr;


        const refEl =
          heroSectionRef.current ||
          mount;


        const rect =
          refEl.getBoundingClientRect();


        bgMaterial.uniforms
          .uContainerSize.value
          .set(
            rect.width,
            rect.height
          );


        bgMaterial.uniforms
          .uContainerOffset.value
          .set(
            rect.left,
            rect.top
          );


        const canvasRect =
          renderer.domElement
            .getBoundingClientRect();


        bgMaterial.uniforms
          .uCanvasOffset.value
          .set(
            canvasRect.left,
            canvasRect.top
          );


        bgMaterial.uniforms
          .uCanvasSize.value
          .set(
            canvasRect.width,
            canvasRect.height
          );
      };


    updateScreenUniforms();


    window.addEventListener(
      "resize",
      updateScreenUniforms
    );


    window.addEventListener(
      "scroll",
      updateScreenUniforms,
      { passive: true }
    );


    const scrollState = {
      lastScrollAt: -Infinity,
    };


    const onPageScroll = () => {

      scrollState.lastScrollAt =
        performance.now();
    };


    window.addEventListener(
      "scroll",
      onPageScroll,
      { passive: true }
    );


    // ========================================================
    // LOAD MODEL (один раз)
    // ========================================================

    const disposeModel =
      loadMeshWithMaterial({

        url: modelUrl,

        fallbackGeo:
          new THREE.IcosahedronGeometry(1, 2),

        material: bgMaterial,

        label: "modelUrl",

        onReady: (object) => {

          fitAndCenter(
            object,
            CONFIG.modelSize
          );

          object.rotation.y =
            restRotationY;

          object.visible = false;

          threeRef.current.current =
            object;

          scene.add(object);

          threeRef.current.tryReveal();
        },
      });


    // ========================================================
    // POINTER CONTROL
    // ========================================================

    const canvas =
      renderer.domElement;


    canvas.style.cursor = "grab";
    canvas.style.touchAction = "pan-y";


    const state = {
      dragging: false,
      lastX: 0,
      velocity: 0,
      releasedAt: 0,
      settling: false,
      hasInteracted: false,
      activePointerId: null,
    };


    const shortestAngle =
      (from, to) =>
        Math.atan2(
          Math.sin(to - from),
          Math.cos(to - from)
        );


    const onPointerDown = (event) => {

      if (!threeRef.current.current) return;
      if (!event.isPrimary) return;

      state.activePointerId = event.pointerId;
      state.dragging = true;
      state.settling = false;
      state.velocity = 0;
      state.hasInteracted = true;
      state.lastX = event.clientX;

      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
      canvas.style.touchAction = "none";
    };


    const onPointerMove = (event) => {

      const current = threeRef.current.current;

      if (
        !state.dragging ||
        !current ||
        event.pointerId !== state.activePointerId
      ) {
        return;
      }

      const dx = event.clientX - state.lastX;
      state.lastX = event.clientX;

      const sensitivity =
        event.pointerType === "touch"
          ? CONFIG.dragSensitivity * 0.6
          : CONFIG.dragSensitivity;

      const rotationDelta = dx * sensitivity;

      current.rotation.y += rotationDelta;
      state.velocity = rotationDelta;
    };


    const onPointerUp = (event) => {

      if (
        !state.dragging ||
        event.pointerId !== state.activePointerId
      ) {
        return;
      }

      state.dragging = false;
      state.activePointerId = null;
      state.releasedAt = performance.now();

      canvas.style.cursor = "grab";
      canvas.style.touchAction = "pan-y";

      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch (_) {}
    };


    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);


    // ========================================================
    // ANIMATION
    // ========================================================

    let raf;

    const animate = () => {

      const current = threeRef.current.current;

      if (current) {

        if (state.dragging) {

          // rotation handled in pointermove

        } else if (!state.hasInteracted) {

          // ------------------------------------------------
          // ДОБАВЛЕНО: пауза N мс после появления модели —
          // до этого момента она вообще не крутится сама.
          // ------------------------------------------------

          const revealedAt =
            threeRef.current.modelRevealedAt;

          const withinInitialPause =
            revealedAt === null ||
            performance.now() - revealedAt <
              CONFIG.autoRotateDelayMs;

          if (!withinInitialPause) {

            const scrolledRecently =
              performance.now() -
                scrollState.lastScrollAt <
              CONFIG.scrollPauseMs;

            if (!scrolledRecently) {
              current.rotation.y += 0.003;
            }
          }

        } else if (!state.settling) {

          if (Math.abs(state.velocity) > CONFIG.minVelocity) {

            current.rotation.y += state.velocity;
            state.velocity *= CONFIG.inertiaDamping;

          } else if (
            performance.now() - state.releasedAt >
            CONFIG.settleDelay
          ) {

            state.settling = true;
          }

        } else {

          const diff = shortestAngle(
            current.rotation.y,
            restRotationY
          );

          if (Math.abs(diff) > 0.002) {

            current.rotation.y += diff * CONFIG.settleSpeed;

          } else {

            current.rotation.y = restRotationY;
            state.settling = false;
            state.velocity = 0;

            // после "успокоения" автовращение возобновляется
            state.hasInteracted = false;
          }
        }
      }

      renderer.render(scene, camera);

      raf = requestAnimationFrame(animate);
    };

    animate();


    // ========================================================
    // RESIZE
    // ========================================================

    const onResize = () => {

      size = getSize();

      camera.aspect = 1;
      camera.updateProjectionMatrix();

      renderer.setSize(size, size);

      updateScreenUniforms();
    };


    window.addEventListener("resize", onResize);


    // ========================================================
    // CLEANUP (полный — вызывается только при размонтировании
    // компонента или смене modelUrl, НЕ при смене media)
    // ========================================================

    return () => {

      cancelAnimationFrame(raf);

      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", updateScreenUniforms);
      window.removeEventListener("scroll", updateScreenUniforms);
      window.removeEventListener("scroll", onPageScroll);

      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);

      disposeModel();

      const current = threeRef.current.current;

      if (current) {
        current.traverse((child) => {
          if (child.isMesh && child.geometry) {
            child.geometry.dispose();
          }
        });
      }

      bgMaterial.dispose();

      if (threeRef.current.mediaTexture) {
        threeRef.current.mediaTexture.dispose();
      }

      renderer.dispose();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }

      threeRef.current.scene = null;
      threeRef.current.camera = null;
      threeRef.current.renderer = null;
      threeRef.current.bgMaterial = null;
      threeRef.current.current = null;
      threeRef.current.mediaTexture = null;
    };

  }, [modelUrl, restRotationY]);


  // ==========================================================
  // ЭФФЕКТ №2 — СМЕНА МЕДИА (видео/фото)
  //
  // Срабатывает при смене категории. НЕ трогает рендерер,
  // камеру или геометрию модели — только подменяет текстуру
  // в уже существующем bgMaterial. Именно это убирает лаги.
  // ==========================================================

  useEffect(() => {

    const t = threeRef.current;

    // сцена ещё не готова (эффект №1 не успел отработать) —
    // такого не должно случаться благодаря порядку эффектов,
    // но на всякий случай выходим тихо
    if (!t.bgMaterial) return;

    const mediaType = media && media.type;
    const mediaUrl = media && media.url;

    const videoEl =
      mediaType === "video"
        ? (videoRef && videoRef.current)
        : null;

    let cancelled = false;
    let newTexture = null;
    let onLoadedData = null;
    let onLoadedMetadata = null;

    t.mediaReady = false;

    const applyTexture = (tex, nativeW, nativeH) => {

      if (cancelled || !t.bgMaterial) return;

      const old = t.mediaTexture;

      t.mediaTexture = tex;
      t.bgMaterial.uniforms.uMediaTex.value = tex;

      if (nativeW && nativeH) {
        t.bgMaterial.uniforms.uMediaNative.value.set(
          nativeW,
          nativeH
        );
      }

      if (old && old !== tex) {
        old.dispose();
      }

      t.mediaReady = true;
      t.tryReveal();
    };


    if (mediaType === "video" && videoEl) {

      newTexture = new THREE.VideoTexture(videoEl);
      newTexture.colorSpace = THREE.SRGBColorSpace;
      newTexture.generateMipmaps = false;
      newTexture.minFilter = THREE.LinearFilter;
      newTexture.magFilter = THREE.LinearFilter;

      if (videoEl.readyState >= 2) {

        applyTexture(
          newTexture,
          videoEl.videoWidth,
          videoEl.videoHeight
        );

      } else {

        onLoadedData = () => {
          applyTexture(
            newTexture,
            videoEl.videoWidth,
            videoEl.videoHeight
          );
        };

        videoEl.addEventListener(
          "loadeddata",
          onLoadedData,
          { once: true }
        );
      }

      onLoadedMetadata = () => {

        if (t.bgMaterial) {
          t.bgMaterial.uniforms.uMediaNative.value.set(
            videoEl.videoWidth,
            videoEl.videoHeight
          );
        }
      };

      videoEl.addEventListener(
        "loadedmetadata",
        onLoadedMetadata
      );

    } else if (mediaType === "image" && mediaUrl) {

      const textureLoader = new THREE.TextureLoader();

      newTexture = textureLoader.load(
        mediaUrl,

        (tex) => {
          applyTexture(
            tex,
            tex.image ? tex.image.width : undefined,
            tex.image ? tex.image.height : undefined
          );
        },

        undefined,

        (err) => {
          console.error(
            `[Hero3D] Не удалось загрузить фото (${mediaUrl}):`,
            err
          );
          // всё равно открываем модель, чтобы не залипала невидимой
          applyTexture(newTexture);
        }
      );

      newTexture.colorSpace = THREE.SRGBColorSpace;
      newTexture.generateMipmaps = false;
      newTexture.minFilter = THREE.LinearFilter;
      newTexture.magFilter = THREE.LinearFilter;

    } else {

      console.warn(
        "[Hero3D] media не задан или некорректен — текстура не обновлена."
      );
    }


    return () => {

      cancelled = true;

      if (mediaType === "video" && videoEl) {

        if (onLoadedData) {
          videoEl.removeEventListener("loadeddata", onLoadedData);
        }

        if (onLoadedMetadata) {
          videoEl.removeEventListener(
            "loadedmetadata",
            onLoadedMetadata
          );
        }
      }

      // если новая текстура так и не была применена (эффект
      // отменён раньше, чем медиа успело загрузиться) — не
      // оставляем висящую текстуру в памяти
      if (newTexture && t.mediaTexture !== newTexture) {
        newTexture.dispose();
      }
    };

  }, [media && media.type, media && media.url, videoRef]);


  return (
    <div
      className="hero3d-model-wrap"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <div
        className="hero3d-model-canvas"
        ref={mountRef}
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </div>
  );
}