import * as THREE from "three";

export interface JellyfishController {
  setVisible: (visible: boolean) => void;
  dispose: () => void;
}

/** Original voxel geometry. The generated concept is a separate static fallback. */
export function createJellyfish(host: HTMLElement): JellyfishController {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const fallback = () => {
    host.dataset.fallback = "true";
    const image = host.querySelector<HTMLImageElement>("img");
    if (image?.dataset.fallbackSrc) image.src = image.dataset.fallbackSrc;
  };
  const empty = { setVisible: (_visible: boolean) => {}, dispose: () => {} };
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    fallback();
    return empty;
  }
  renderer.setPixelRatio(
    Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.5),
  );
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 140);
  camera.position.set(20, 11, 34);
  camera.lookAt(0, -4.2, 0);
  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const geometry = new THREE.BoxGeometry(0.98, 0.98, 0.98);
  const palette = [
    "#ed4d20",
    "#f56826",
    "#ff8a2d",
    "#ffae3a",
    "#ffd479",
    "#ffebba",
  ].map((c) => new THREE.Color(c));

  const material = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vTint;
      varying vec3 vFace;
      void main() {
        vTint = instanceColor;
        vFace = normalize(mat3(modelMatrix * instanceMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vTint;
      varying vec3 vFace;
      void main() {
        vec3 light = normalize(vec3(-0.5, 1.0, 0.8));
        float diffuse = max(dot(normalize(vFace), light), 0.0);
        float grain = fract(sin(dot(floor(gl_FragCoord.xy / 2.0), vec2(12.9898, 78.233))) * 43758.5453);
        vec3 color = vTint * (0.55 + diffuse * 0.57) + vec3((grain - 0.5) * 0.012);
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  const dummy = new THREE.Object3D();
  const cubes: { x: number; y: number; z: number; color: THREE.Color }[] = [];
  for (let x = -9; x <= 9; x++) {
    for (let z = -9; z <= 9; z++) {
      const radius = Math.sqrt(x * x + z * z);
      if (radius > 9.35) continue;
      const top = Math.floor(
        6.1 * Math.sqrt(Math.max(0, 1 - (radius / 10) ** 2)),
      );
      for (let y = Math.max(0, top - 2); y <= top; y++) {
        const highlight = Math.max(0, -x * 0.13 + z * 0.05 + y * 0.48);
        const index = Math.min(
          5,
          Math.max(
            0,
            Math.floor(highlight + ((x * x + z * 3) % 5 === 0 ? 1 : 0)),
          ),
        );
        cubes.push({ x, y, z, color: palette[index] });
      }
    }
  }
  // Cream underside, visible between the rim and the six tentacles.
  for (let x = -7; x <= 7; x++) {
    for (let z = -7; z <= 7; z++) {
      if (x * x + z * z < 51)
        cubes.push({
          x,
          y: -0.55,
          z,
          color: palette[(x + z) % 3 === 0 ? 3 : 4],
        });
    }
  }
  const cap = new THREE.InstancedMesh(geometry, material, cubes.length);
  cubes.forEach((c, i) => {
    dummy.position.set(c.x, c.y, c.z);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    cap.setMatrixAt(i, dummy.matrix);
    cap.setColorAt(i, c.color);
  });
  sculpture.add(cap);

  const eyeMaterial = new THREE.MeshBasicMaterial({ color: "#2b1d17" });
  const sparkleMaterial = new THREE.MeshBasicMaterial({ color: "#fff1cf" });
  for (const x of [-2.6, 2.6]) {
    const eye = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 1.65, 0.6),
      eyeMaterial,
    );
    eye.position.set(x, 0.5, 9.55);
    const sparkle = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.45, 0.15),
      sparkleMaterial,
    );
    sparkle.position.set(x - 0.15, 0.95, 9.94);
    sculpture.add(eye, sparkle);
  }

  const segments = 19;
  const tentacles = new THREE.InstancedMesh(geometry, material, segments * 6);
  tentacles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  for (let i = 0; i < segments * 6; i++)
    tentacles.setColorAt(i, palette[i % 7 === 0 ? 4 : (i % 3) + 1]);
  sculpture.add(tentacles);
  const updateTentacles = (time: number) => {
    for (let strand = 0; strand < 6; strand++) {
      const angle = (strand * Math.PI) / 3 + 0.4;
      const length = 0.62 + (strand % 3) * 0.1;
      for (let j = 0; j < segments; j++) {
        const u = j / (segments - 1);
        const curl =
          Math.sin(u * 4.7 + time * 1.1 + strand * 1.3) * (0.15 + u * 2.1);
        const spread = 4.0 + u * 0.6 + Math.max(0, u - 0.75) * 6;
        dummy.position.set(
          Math.cos(angle) * spread + curl,
          -1.7 - j * length + Math.max(0, u - 0.78) * 13,
          Math.sin(angle) * spread +
            Math.cos(u * 3.6 + time + strand) * u * 1.8,
        );
        dummy.scale.setScalar(1.05 - u * 0.3);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        tentacles.setMatrixAt(strand * segments + j, dummy.matrix);
      }
    }
    tentacles.instanceMatrix.needsUpdate = true;
  };

  let visible = true;
  let disposed = false;
  let dragging = false;
  let lastX = 0;
  let rotation = 0.25;
  let targetRotation = 0.25;
  let pointerY = 0;
  let lastTime = 0;
  let elapsed = 0;
  let raf = 0;
  let compiled = false;

  const render = (now: number) => {
    raf = 0;
    if (disposed || !visible || document.hidden || !compiled) return;
    if (!dragging && lastTime && now - lastTime < 1000 / 30) {
      raf = requestAnimationFrame(render);
      return;
    }
    const dt = Math.min(0.05, (now - lastTime) / 1000 || 0.016);
    lastTime = now;
    if (!reduce.matches) elapsed += dt;
    rotation += (targetRotation - rotation) * Math.min(1, dt * 7);
    sculpture.rotation.y = rotation;
    sculpture.rotation.z = reduce.matches
      ? 0
      : Math.sin(elapsed * 0.42) * 0.035;
    sculpture.rotation.x = pointerY * 0.08;
    sculpture.position.y = reduce.matches ? 0 : Math.sin(elapsed * 0.85) * 0.42;
    updateTentacles(reduce.matches ? 0 : elapsed);
    renderer.render(scene, camera);
    host.dataset.ready = "true";
    if (
      !reduce.matches ||
      dragging ||
      Math.abs(targetRotation - rotation) > 0.001
    )
      raf = requestAnimationFrame(render);
  };
  const schedule = () => {
    if (!raf && !disposed && visible && compiled)
      raf = requestAnimationFrame(render);
  };
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (width < 1 || height < 1) return;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    schedule();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const down = (event: PointerEvent) => {
    dragging = true;
    lastX = event.clientX;
    host.setPointerCapture(event.pointerId);
    host.classList.add("is-dragging");
    schedule();
  };
  const move = (event: PointerEvent) => {
    if (dragging) {
      targetRotation += (event.clientX - lastX) * 0.009;
      lastX = event.clientX;
    } else {
      const r = host.getBoundingClientRect();
      pointerY = (event.clientY - r.top) / r.height - 0.5;
    }
    schedule();
  };
  const up = () => {
    dragging = false;
    host.classList.remove("is-dragging");
  };
  const key = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.stopPropagation();
      event.preventDefault();
      targetRotation += event.key === "ArrowLeft" ? -0.25 : 0.25;
      schedule();
    }
  };
  const visibility = () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else {
      raf = 0;
      schedule();
    }
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    fallback();
    cancelAnimationFrame(raf);
  };
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerup", up);
  host.addEventListener("lostpointercapture", up);
  host.addEventListener("keydown", key);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  document.addEventListener("visibilitychange", visibility);
  reduce.addEventListener("change", schedule);
  resize();
  updateTentacles(0);
  const compilation = renderer
    .compileAsync(scene, camera)
    .then(() => {
      compiled = true;
      if (!disposed) schedule();
    })
    .catch(() => {
      if (!disposed) fallback();
    });

  return {
    setVisible(value) {
      visible = value;
      if (value) schedule();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("lostpointercapture", up);
      host.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
      reduce.removeEventListener("change", schedule);
      // Keep programs alive until the driver's async compilation check settles.
      // Fast language changes can otherwise dispose a program while it is polled.
      void compilation.then(() => {
        geometry.dispose();
        material.dispose();
        eyeMaterial.dispose();
        sparkleMaterial.dispose();
        sculpture.traverse((obj) => {
          if (obj instanceof THREE.Mesh && obj.geometry !== geometry)
            obj.geometry.dispose();
        });
        cap.dispose();
        tentacles.dispose();
        renderer.domElement.removeEventListener(
          "webglcontextlost",
          contextLost,
        );
        renderer.forceContextLoss();
        renderer.dispose();
        renderer.domElement.remove();
      });
    },
  };
}
