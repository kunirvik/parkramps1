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
// EXACT BACKGROUND SAMPLING SHADER
// (uMediaTex/uMediaNative — единый источник, видео или фото)
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
    },


    // ========================================================
    // VERTEX
    // ========================================================

    vertexShader: `

      varying vec3 vViewPos;
      varying vec3 vViewDir;

      void main() {

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


      varying vec3 vViewPos;
      varying vec3 vViewDir;


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

        // Screen-space derivatives
        vec3 fdx = dFdx(vViewPos);
        vec3 fdy = dFdy(vViewPos);


        // Flat normal
        vec3 flatNormal =
          normalize(
            cross(
              fdx,
              fdy
            )
          );


        // Canvas pixel coordinates
        vec2 localCanvasPx =
          gl_FragCoord.xy /
          uDPR;


        localCanvasPx.y =
          uCanvasSize.y -
          localCanvasPx.y;


        // Window coordinates
        vec2 windowPx =
          uCanvasOffset +
          localCanvasPx;


        // Coordinates relative to HERO
        vec2 local =
          (
            windowPx -
            uContainerOffset
          ) /
          uContainerSize;


        // ----------------------------------------------------
        // CHROMATIC SHIFT
        // ----------------------------------------------------

        float r =
          sampleBg(
            local,
            flatNormal +
            vec3(
              uChromaShift,
              0.0,
              0.0
            )
          ).r;


        float g =
          sampleBg(
            local,
            flatNormal
          ).g;


        float b =
          sampleBg(
            local,
            flatNormal -
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
        // FRESNEL
        // ----------------------------------------------------

        float fresnel =
          pow(
            1.0 -
            max(
              dot(
                normalize(vViewDir),
                flatNormal
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


  useEffect(() => {

    const mount =
      mountRef.current;

    if (!mount) return;


    // ========================================================
    // CONFIG
    // ========================================================

    const CONFIG = {

      modelSize: 5.5,

      cameraZ: 6,

      dragSensitivity: 0.008,

      inertiaDamping: 0.94,

      minVelocity: 0.00015,

      settleDelay: 500,

      settleSpeed: 0.045,

      scrollPauseMs: 700,

      // ИЗМЕНЕНО: канвас теперь считается от размера ЭКРАНА,
      // а не от clientWidth/clientHeight контейнера — так модель
      // всегда занимает предсказуемую долю вьюпорта и центрируется
      // независимо от внешней вёрстки/CSS.
      viewportFraction: 0.82, // модель занимает ~82% меньшей стороны экрана
      minCanvasPx: 320,
      maxCanvasPx: 1500,
    };


    // ========================================================
    // HERO CONTAINER
    // ========================================================

    const heroEl =
      mount.closest(".hero3d");

    heroSectionRef.current =
      heroEl;


    // ========================================================
    // THREE
    // ========================================================

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


    // ИЗМЕНЕНО: размер канваса считается от window.innerWidth/Height,
    // а не от размеров mount-контейнера (это и было причиной того,
    // что модель "плавала" не по центру и не подстраивалась под экран —
    // размер зависел от непредсказуемой внешней вёрстки).

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
    // MEDIA SOURCE: VIDEO OR IMAGE
    // ========================================================

    const mediaType =
      media && media.type;

    const mediaUrl =
      media && media.url;


    const videoEl =
      mediaType === "video"
        ? (videoRef && videoRef.current)
        : null;


    let mediaTexture =
      null;


    const mediaReady = {
      value: false,
    };


    let onLoadedData = null;
    let onLoadedMetadata = null;


    if (mediaType === "video" && videoEl) {

      mediaTexture =
        new THREE.VideoTexture(
          videoEl
        );


      mediaTexture.colorSpace =
        THREE.SRGBColorSpace;


      mediaTexture.generateMipmaps =
        false;


      mediaTexture.minFilter =
        THREE.LinearFilter;


      mediaTexture.magFilter =
        THREE.LinearFilter;


      if (videoEl.readyState >= 2) {

        mediaReady.value = true;

      } else {

        onLoadedData = () => {
          mediaReady.value = true;
        };

        videoEl.addEventListener(
          "loadeddata",
          onLoadedData,
          { once: true }
        );
      }

    } else if (mediaType === "image" && mediaUrl) {

      const textureLoader =
        new THREE.TextureLoader();

      mediaTexture =
        textureLoader.load(
          mediaUrl,

          (tex) => {

            mediaReady.value = true;

            if (tex.image) {

              bgMaterial.uniforms
                .uMediaNative.value
                .set(
                  tex.image.width,
                  tex.image.height
                );
            }
          },

          undefined,

          (err) => {

            console.error(
              `[Hero3D] Не удалось загрузить фото (${mediaUrl}):`,
              err
            );

            mediaReady.value = true;
          }
        );


      mediaTexture.colorSpace =
        THREE.SRGBColorSpace;


      mediaTexture.generateMipmaps =
        false;


      mediaTexture.minFilter =
        THREE.LinearFilter;


      mediaTexture.magFilter =
        THREE.LinearFilter;

    } else {

      console.warn(
        "[Hero3D] media не задан или некорректен — модель без фонового отражения."
      );
    }


    // ========================================================
    // THE EFFECT MATERIAL
    // ========================================================

    const bgMaterial =
      makeBgSampleMaterial(
        mediaTexture ||
        new THREE.Texture()
      );


    bgMaterial.uniforms.uMediaTex.value =
      mediaTexture ||
      bgMaterial.uniforms.uMediaTex.value;


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


        if (
          mediaType === "video" &&
          videoEl &&
          videoEl.videoWidth &&
          videoEl.videoHeight
        ) {

          bgMaterial.uniforms
            .uMediaNative.value
            .set(
              videoEl.videoWidth,
              videoEl.videoHeight
            );
        }
      };


    updateScreenUniforms();


    if (mediaType === "video" && videoEl) {

      onLoadedMetadata =
        updateScreenUniforms;

      videoEl.addEventListener(
        "loadedmetadata",
        onLoadedMetadata
      );
    }


    window.addEventListener(
      "resize",
      updateScreenUniforms
    );


    window.addEventListener(
      "scroll",
      updateScreenUniforms,
      {
        passive: true,
      }
    );


    // ========================================================
    // SCROLL PAUSE (для автовращения модели)
    // ========================================================

    const scrollState = {
      lastScrollAt:
        -Infinity,
    };


    const onPageScroll =
      () => {

        scrollState.lastScrollAt =
          performance.now();
      };


    window.addEventListener(
      "scroll",
      onPageScroll,
      {
        passive: true,
      }
    );


    // ========================================================
    // LOAD MODEL
    // ========================================================

    let current =
      null;


    const disposeModel =
      loadMeshWithMaterial({

        url: modelUrl,

        fallbackGeo:
          new THREE.IcosahedronGeometry(
            1,
            2
          ),

        material:
          bgMaterial,

        label:
          "modelUrl",

        onReady:
          (object) => {

            fitAndCenter(
              object,
              CONFIG.modelSize
            );

            object.rotation.y =
              restRotationY;


            current =
              object;


            current.visible =
              mediaReady.value;


            scene.add(
              current
            );
          },
      });


    // ========================================================
    // POINTER CONTROL
    // ========================================================

    const canvas =
      renderer.domElement;


    canvas.style.cursor =
      "grab";


    canvas.style.touchAction =
      "pan-y";


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


    // --------------------------------------------------------
    // POINTER DOWN
    // --------------------------------------------------------

    const onPointerDown =
      (event) => {

        if (!current) return;

        if (!event.isPrimary)
          return;


        state.activePointerId =
          event.pointerId;


        state.dragging =
          true;


        state.settling =
          false;


        state.velocity =
          0;


        state.hasInteracted =
          true;


        state.lastX =
          event.clientX;


        canvas.setPointerCapture(
          event.pointerId
        );


        canvas.style.cursor =
          "grabbing";


        canvas.style.touchAction =
          "none";
      };


    // --------------------------------------------------------
    // POINTER MOVE
    // --------------------------------------------------------

    const onPointerMove =
      (event) => {

        if (
          !state.dragging ||
          !current ||
          event.pointerId !==
            state.activePointerId
        ) {
          return;
        }


        const dx =
          event.clientX -
          state.lastX;


        state.lastX =
          event.clientX;


        const sensitivity =
          event.pointerType === "touch"
            ? CONFIG.dragSensitivity * 0.6
            : CONFIG.dragSensitivity;


        const rotationDelta =
          dx * sensitivity;


        current.rotation.y +=
          rotationDelta;


        state.velocity =
          rotationDelta;
      };


    // --------------------------------------------------------
    // POINTER UP
    // --------------------------------------------------------

    const onPointerUp =
      (event) => {

        if (
          !state.dragging ||
          event.pointerId !==
            state.activePointerId
        ) {
          return;
        }


        state.dragging =
          false;


        state.activePointerId =
          null;


        state.releasedAt =
          performance.now();


        canvas.style.cursor =
          "grab";


        canvas.style.touchAction =
          "pan-y";


        try {

          canvas.releasePointerCapture(
            event.pointerId
          );

        } catch (_) {}
      };


    canvas.addEventListener(
      "pointerdown",
      onPointerDown
    );

    canvas.addEventListener(
      "pointermove",
      onPointerMove
    );

    canvas.addEventListener(
      "pointerup",
      onPointerUp
    );

    canvas.addEventListener(
      "pointercancel",
      onPointerUp
    );


    // ========================================================
    // ANIMATION
    // ========================================================

    let raf;


    const animate =
      () => {

        if (current) {

          if (
            !current.visible &&
            mediaReady.value
          ) {

            current.visible =
              true;
          }


          // ----------------------------------------------
          // USER IS DRAGGING
          // ----------------------------------------------

          if (state.dragging) {

            // rotation handled in pointermove


          // ----------------------------------------------
          // AUTO ROTATION (idle, никто не трогал модель —
          // либо она уже "остыла" после клика, см. ниже)
          // ----------------------------------------------

          } else if (
            !state.hasInteracted
          ) {

            const scrolledRecently =
              performance.now() -
              scrollState.lastScrollAt <
              CONFIG.scrollPauseMs;


            if (!scrolledRecently) {

              current.rotation.y +=
                0.003;
            }


          // ----------------------------------------------
          // INERTIA
          // ----------------------------------------------

          } else if (
            !state.settling
          ) {

            if (
              Math.abs(
                state.velocity
              ) >
              CONFIG.minVelocity
            ) {

              current.rotation.y +=
                state.velocity;


              state.velocity *=
                CONFIG.inertiaDamping;


            } else if (
              performance.now() -
                state.releasedAt >
              CONFIG.settleDelay
            ) {

              state.settling =
                true;
            }


          // ----------------------------------------------
          // RETURN TO REST
          // ----------------------------------------------

          } else {

            const diff =
              shortestAngle(
                current.rotation.y,
                restRotationY
              );


            if (
              Math.abs(diff) >
              0.002
            ) {

              current.rotation.y +=
                diff *
                CONFIG.settleSpeed;

            } else {

              current.rotation.y =
                restRotationY;


              state.settling =
                false;


              state.velocity =
                0;


              // ИЗМЕНЕНО: раньше после "успокоения" модель
              // навсегда замирала (hasInteracted оставался true).
              // Теперь автовращение возобновляется само —
              // ровно то, что просили: "анимация прокрутки
              // начинается снова после клика мышью по модели".

              state.hasInteracted =
                false;
            }
          }
        }


        renderer.render(
          scene,
          camera
        );


        raf =
          requestAnimationFrame(
            animate
          );
      };


    animate();


    // ========================================================
    // RESIZE
    // ========================================================

    const onResize =
      () => {

        size =
          getSize();


        camera.aspect =
          1;


        camera.updateProjectionMatrix();


        renderer.setSize(
          size,
          size
        );


        updateScreenUniforms();
      };


    window.addEventListener(
      "resize",
      onResize
    );


    // ========================================================
    // CLEANUP
    // ========================================================

    return () => {

      cancelAnimationFrame(
        raf
      );


      window.removeEventListener(
        "resize",
        onResize
      );


      window.removeEventListener(
        "resize",
        updateScreenUniforms
      );


      window.removeEventListener(
        "scroll",
        updateScreenUniforms
      );


      window.removeEventListener(
        "scroll",
        onPageScroll
      );


      if (mediaType === "video" && videoEl) {

        if (onLoadedMetadata) {

          videoEl.removeEventListener(
            "loadedmetadata",
            onLoadedMetadata
          );
        }


        if (onLoadedData) {

          videoEl.removeEventListener(
            "loadeddata",
            onLoadedData
          );
        }
      }


      canvas.removeEventListener(
        "pointerdown",
        onPointerDown
      );


      canvas.removeEventListener(
        "pointermove",
        onPointerMove
      );


      canvas.removeEventListener(
        "pointerup",
        onPointerUp
      );


      canvas.removeEventListener(
        "pointercancel",
        onPointerUp
      );


      disposeModel();


      if (current) {

        current.traverse(
          (child) => {

            if (
              child.isMesh &&
              child.geometry
            ) {

              child.geometry.dispose();
            }
          }
        );
      }


      bgMaterial.dispose();


      if (mediaTexture) {

        mediaTexture.dispose();
      }


      renderer.dispose();


      if (
        renderer.domElement
          .parentNode === mount
      ) {

        mount.removeChild(
          renderer.domElement
        );
      }
    };

  }, [
    modelUrl,
    media && media.type,
    media && media.url,
    videoRef,
    restRotationY,
  ]);


  // ==========================================================
  // ИЗМЕНЕНО: обёртка теперь абсолютно позиционирована на всю
  // hero-секцию и центрирует канвас через flex — это гарантирует
  // центр экрана независимо от внешнего CSS. pointerEvents:"none"
  // на обёртке, чтобы она не перехватывала клики по фону/кнопкам
  // за пределами самого канваса; сам канвас — pointerEvents:"auto".
  // ==========================================================

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