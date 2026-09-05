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
// ============================================================

function makeBgSampleMaterial(videoTexture) {
  return new THREE.ShaderMaterial({

    uniforms: {

      uVideoTex: {
        value: videoTexture,
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

      uVideoNative: {
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

      uniform sampler2D uVideoTex;

      uniform vec2 uContainerSize;
      uniform vec2 uContainerOffset;

      uniform vec2 uCanvasOffset;
      uniform vec2 uCanvasSize;

      uniform vec2 uVideoNative;

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

        float videoAspect =
          uVideoNative.x /
          uVideoNative.y;

        vec2 uv = screenUV;


        if (
          containerAspect >
          videoAspect
        ) {

          float scale =
            videoAspect /
            containerAspect;

          uv.y =
            (uv.y - 0.5) *
            scale +
            0.5;

        } else {

          float scale =
            containerAspect /
            videoAspect;

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


        vec2 videoUV =
          coverUV(
            clamp(
              distorted,
              0.0,
              1.0
            )
          );


        vec2 sampleUV =
          vec2(
            videoUV.x,
            1.0 - videoUV.y
          );


        return texture2D(
          uVideoTex,
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
  videoRef,
  videoUrl,
  restRotationY = 0,
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
    // CONFIG — ОРИГИНАЛЬНЫЕ ЗНАЧЕНИЯ
    // ========================================================

    const CONFIG = {

      modelSize: 2.8,

      cameraZ: 6,

      dragSensitivity: 0.008,

      inertiaDamping: 0.94,

      minVelocity: 0.00015,

      settleDelay: 500,

      settleSpeed: 0.045,

      scrollPauseMs: 700,
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


    const MAX_CANVAS_PX = 900;


    const getSize = () =>
      Math.min(
        mount.clientWidth || 560,
        mount.clientHeight || 560,
        MAX_CANVAS_PX
      );


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
    // IMPORTANT:
    // SAME VIDEO ELEMENT
    // ========================================================

    const videoEl =
      videoUrl
        ? (
            videoRef &&
            videoRef.current
          )
        : null;


    let videoTexture =
      null;


    const videoReady = {
      value: !videoEl,
    };


    let onLoadedData =
      null;


    if (videoEl) {

      videoTexture =
        new THREE.VideoTexture(
          videoEl
        );


      videoTexture.colorSpace =
        THREE.SRGBColorSpace;


      videoTexture.generateMipmaps =
        false;


      videoTexture.minFilter =
        THREE.LinearFilter;


      videoTexture.magFilter =
        THREE.LinearFilter;


      if (
        videoEl.readyState >= 2
      ) {

        videoReady.value =
          true;

      } else {

        onLoadedData = () => {

          videoReady.value =
            true;
        };


        videoEl.addEventListener(
          "loadeddata",
          onLoadedData,
          {
            once: true,
          }
        );
      }

    } else {

      console.warn(
        "[Hero3D] videoUrl/videoRef отсутствует — модель без фонового отражения."
      );
    }


    // ========================================================
    // THE EFFECT MATERIAL
    // ========================================================

    const bgMaterial =
      makeBgSampleMaterial(
        videoTexture ||
        new THREE.Texture()
      );


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
          videoEl &&
          videoEl.videoWidth &&
          videoEl.videoHeight
        ) {

          bgMaterial.uniforms
            .uVideoNative.value
            .set(
              videoEl.videoWidth,
              videoEl.videoHeight
            );
        }
      };


    updateScreenUniforms();


    if (videoEl) {

      videoEl.addEventListener(
        "loadedmetadata",
        updateScreenUniforms
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
    // SCROLL PAUSE
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


            current =
              object;


            current.visible =
              videoReady.value;


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

          // Video loaded after model
          if (
            !current.visible &&
            videoReady.value
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
          // AUTO ROTATION
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


      if (videoEl) {

        videoEl.removeEventListener(
          "loadedmetadata",
          updateScreenUniforms
        );


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


      if (videoTexture) {

        videoTexture.dispose();
      }


      // ВАЖНО:
      // videoEl НЕ уничтожаем.
      // Им владеет родительский компонент.


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
    videoUrl,
    videoRef,
    restRotationY,
  ]);


  return (
    <div className="hero3d-model-wrap">

      <div
        className="hero3d-model-canvas"
        ref={mountRef}
      />

    </div>
  );
}