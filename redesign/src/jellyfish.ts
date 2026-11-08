import * as THREE from "three";

export type JellyfishMode =
  | "hero"
  | "experience"
  | "projects"
  | "about"
  | "contact";

export interface JellyfishController {
  setVisible: (visible: boolean) => void;
  setMode: (mode: JellyfishMode, variant?: number) => void;
  pulse: (direction?: number) => void;
  dispose: () => void;
}

const MODE_PRESETS: Record<
  JellyfishMode,
  { rotY: number; tiltZ: number; tiltX: number; scale: number; bobSpeed: number }
> = {
  hero: { rotY: 0.25, tiltZ: 0.02, tiltX: 0.0, scale: 1.0, bobSpeed: 0.9 },
  experience: {
    rotY: -0.55,
    tiltZ: -0.1,
    tiltX: 0.08,
    scale: 0.86,
    bobSpeed: 0.72,
  },
  projects: {
    rotY: 0.68,
    tiltZ: 0.09,
    tiltX: -0.06,
    scale: 0.88,
    bobSpeed: 0.8,
  },
  about: {
    rotY: -0.38,
    tiltZ: -0.06,
    tiltX: 0.04,
    scale: 0.84,
    bobSpeed: 0.7,
  },
  contact: {
    rotY: -0.22,
    tiltZ: -0.08,
    tiltX: 0.03,
    scale: 0.94,
    bobSpeed: 0.85,
  },
};

/** Original voxel geometry with breathing bell, propulsion pulse, and floating ambient voxels. */
export function createJellyfish(host: HTMLElement): JellyfishController {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const fallback = () => {
    host.dataset.fallback = "true";
    const image = host.querySelector<HTMLImageElement>("img");
    if (image?.dataset.fallbackSrc) image.src = image.dataset.fallbackSrc;
  };
  const empty: JellyfishController = {
    setVisible: () => {},
    setMode: () => {},
    pulse: () => {},
    dispose: () => {},
  };
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: innerWidth >= 768,
      powerPreference: "high-performance",
    });
  } catch {
    fallback();
    return empty;
  }
  renderer.setPixelRatio(
    Math.min(devicePixelRatio, innerWidth < 768 ? 1.2 : 1.35),
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

  const bellGroup = new THREE.Group();
  sculpture.add(bellGroup);

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
    uniforms: {
      uGlow: { value: 0.0 },
    },
    vertexShader: `
      uniform float uGlow;
      varying vec3 vColor;
      void main() {
        vec3 worldNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);
        vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
        vec3 light = normalize(vec3(-0.5, 1.0, 0.8));
        vec3 rimLight = normalize(vec3(0.7, -0.3, -0.6));
        float diffuse = max(dot(worldNormal, light), 0.0);
        float rim = max(dot(worldNormal, rimLight), 0.0) * 0.22;
        float pulseWave = max(0.0, sin(worldPos.y * 0.35 - uGlow * 6.0)) * uGlow * 0.18;
        vColor = instanceColor * (0.55 + diffuse * 0.56 + rim + pulseWave);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, 1.0);
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
  bellGroup.add(cap);

  const eyeMaterial = new THREE.MeshBasicMaterial({ color: "#2b1d17" });
  const sparkleMaterial = new THREE.MeshBasicMaterial({ color: "#fff1cf" });
  const eyesGroup = new THREE.Group();
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
    eyesGroup.add(eye, sparkle);
  }
  bellGroup.add(eyesGroup);

  const segments = 19;
  const tentacles = new THREE.InstancedMesh(geometry, material, segments * 6);
  tentacles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const tentacleArray = tentacles.instanceMatrix.array as Float32Array;
  for (let i = 0; i < segments * 6; i++) {
    tentacles.setColorAt(i, palette[i % 7 === 0 ? 4 : (i % 3) + 1]);
    const base = i * 16;
    tentacleArray[base + 15] = 1;
  }
  sculpture.add(tentacles);

  const strandMeta = Array.from({ length: 6 }, (_, strand) => {
    const angle = (strand * Math.PI) / 3 + 0.4;
    return {
      cosA: Math.cos(angle),
      sinA: Math.sin(angle),
      length: 0.62 + (strand % 3) * 0.1,
      strand,
    };
  });
  const segmentMeta = Array.from({ length: segments }, (_, j) => {
    const u = j / (segments - 1);
    return {
      u,
      j,
      scale: 1.05 - u * 0.3,
      tipLift: Math.max(0, u - 0.78) * 13,
      tipSpread: Math.max(0, u - 0.75),
    };
  });

  // Ambient floating voxel particles around the jellyfish
  const particleCount = 28;
  const particles = new THREE.InstancedMesh(geometry, material, particleCount);
  particles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const particleSeeds = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2 + (i % 3) * 0.4;
    const radius = 10.5 + (i % 5) * 2.2;
    const baseY = -14 + (i / particleCount) * 24;
    const size = 0.24 + (i % 4) * 0.11;
    const speed = 0.45 + (i % 5) * 0.15;
    particles.setColorAt(i, palette[Math.min(5, 2 + (i % 4))]);
    return { angle, radius, baseY, size, speed, phase: i * 1.7 };
  });
  scene.add(particles);

  const updateTentaclesAndParticles = (time: number, pulseEnergy: number) => {
    const waveSpeed = 1 + pulseEnergy * 0.45;
    const timeWave = time * 1.35 * waveSpeed;
    const timeZ = time * 1.15;
    const curlAmp = 2.25 + pulseEnergy * 0.7;
    const spreadSlope = 0.6 - pulseEnergy * 0.25;
    const tipFlare = 6 + pulseEnergy * 1.8;
    const zAmp = 1.85 + pulseEnergy * 0.5;

    for (let sIdx = 0; sIdx < 6; sIdx++) {
      const { cosA, sinA, length, strand } = strandMeta[sIdx];
      const strandOffset = sIdx * segments;
      const phaseX = strand * 1.3 - timeWave;
      const phaseZ = strand - timeZ;
      for (let j = 0; j < segments; j++) {
        const { u, scale, tipLift, tipSpread } = segmentMeta[j];
        const curl = Math.sin(u * 4.7 + phaseX) * (0.18 + u * curlAmp);
        const spread = 4.0 + u * spreadSlope + tipSpread * tipFlare;
        const base = (strandOffset + j) * 16;
        tentacleArray[base] = scale;
        tentacleArray[base + 5] = scale;
        tentacleArray[base + 10] = scale;
        tentacleArray[base + 12] = cosA * spread + curl;
        tentacleArray[base + 13] = -1.7 - j * length + tipLift;
        tentacleArray[base + 14] =
          sinA * spread + Math.cos(u * 3.6 + phaseZ) * u * zAmp;
      }
    }
    tentacles.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < particleCount; i++) {
      const p = particleSeeds[i];
      const yOffset = ((p.baseY + time * p.speed * 2.2 + 14) % 26) - 14;
      const fadeEdge = Math.min(
        1,
        Math.min((yOffset + 14) * 0.25, (12 - yOffset) * 0.25),
      );
      const orbit = p.angle + Math.sin(time * 0.35 + p.phase) * 0.25;
      const r = p.radius + Math.cos(time * 0.6 + p.phase) * 1.1;
      dummy.position.set(
        Math.cos(orbit) * r,
        yOffset,
        Math.sin(orbit) * r - 2,
      );
      const s = Math.max(0.01, p.size * fadeEdge * (1 + pulseEnergy * 0.35));
      dummy.scale.setScalar(s);
      dummy.rotation.set(time * 0.5 + p.phase, time * 0.3, 0);
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
    }
    particles.instanceMatrix.needsUpdate = true;
  };

  let visible = true;
  let disposed = false;
  let dragging = false;
  let lastX = 0;
  let currentMode: JellyfishMode = "hero";
  let rotation = MODE_PRESETS.hero.rotY;
  let targetRotation = MODE_PRESETS.hero.rotY;
  let tiltZ = MODE_PRESETS.hero.tiltZ;
  let targetTiltZ = MODE_PRESETS.hero.tiltZ;
  let tiltX = MODE_PRESETS.hero.tiltX;
  let targetTiltX = MODE_PRESETS.hero.tiltX;
  let baseScale = MODE_PRESETS.hero.scale;
  let targetScale = MODE_PRESETS.hero.scale;
  let pointerX = 0;
  let pointerY = 0;
  let pulseEnergy = 0;
  let blinkTimer = 0;
  let lastTime = 0;
  let elapsed = 0;
  let raf = 0;
  let compiled = false;

  const render = (now: number) => {
    raf = 0;
    if (disposed || !visible || document.hidden || !compiled) return;
    const dt = Math.min(0.05, (now - lastTime) / 1000 || 0.016);
    lastTime = now;
    const preset = MODE_PRESETS[currentMode];
    if (!reduce.matches) {
      elapsed += dt * (preset.bobSpeed + pulseEnergy * 0.6);
      pulseEnergy = Math.max(0, pulseEnergy - dt * 1.65);
    } else {
      pulseEnergy = 0;
    }

    const lerpFast = 1 - Math.exp(-dt * 8.5);
    const lerpSmooth = 1 - Math.exp(-dt * 6.5);
    rotation += (targetRotation + pointerX * 0.22 - rotation) * lerpFast;
    tiltZ += (targetTiltZ - pointerX * 0.06 - tiltZ) * lerpSmooth;
    tiltX += (targetTiltX + pointerY * 0.12 - tiltX) * lerpSmooth;
    baseScale += (targetScale - baseScale) * lerpSmooth;

    sculpture.rotation.y = rotation;
    sculpture.rotation.z = reduce.matches
      ? tiltZ
      : tiltZ + Math.sin(elapsed * 0.52) * 0.045;
    sculpture.rotation.x = tiltX;

    // Gentle swimming bob + propulsion lift
    sculpture.position.y = reduce.matches
      ? 0
      : Math.sin(elapsed * 1.05) * 0.58 + pulseEnergy * 0.85;
    sculpture.scale.setScalar(baseScale);

    // Bell breathing contraction/expansion
    const breath = reduce.matches
      ? 0
      : Math.sin(elapsed * 2.1) * 0.032 + pulseEnergy * 0.09;
    bellGroup.scale.set(1 - breath * 0.85, 1 + breath * 1.15, 1 - breath * 0.85);

    // Subtle cute eye blink every ~4.5 seconds
    blinkTimer += dt;
    const blinkCycle = blinkTimer % 4.6;
    const isBlinking = !reduce.matches && blinkCycle > 4.42;
    eyesGroup.scale.y = isBlinking ? 0.15 : 1;

    material.uniforms.uGlow.value = pulseEnergy;
    updateTentaclesAndParticles(reduce.matches ? 0 : elapsed, pulseEnergy);
    renderer.render(scene, camera);
    host.dataset.ready = "true";
    if (
      !reduce.matches ||
      dragging ||
      Math.abs(targetRotation - rotation) > 0.001 ||
      Math.abs(targetScale - baseScale) > 0.001
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
    pulseEnergy = Math.min(1, pulseEnergy + 0.55);
    host.setPointerCapture(event.pointerId);
    host.classList.add("is-dragging");
    schedule();
  };
  const move = (event: PointerEvent) => {
    if (dragging) {
      targetRotation += (event.clientX - lastX) * 0.009;
      lastX = event.clientX;
      schedule();
    }
  };
  const windowMove = (event: PointerEvent) => {
    if (dragging || reduce.matches) return;
    pointerX = (event.clientX / Math.max(1, innerWidth) - 0.5) * 2;
    pointerY = (event.clientY / Math.max(1, innerHeight) - 0.5) * 2;
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
      targetRotation += event.key === "ArrowLeft" ? -0.28 : 0.28;
      pulseEnergy = Math.min(1, pulseEnergy + 0.4);
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
  window.addEventListener("pointermove", windowMove, { passive: true });
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  document.addEventListener("visibilitychange", visibility);
  reduce.addEventListener("change", schedule);
  resize();
  updateTentaclesAndParticles(0, 0);
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
    setMode(mode, variant = 0) {
      currentMode = mode;
      const preset = MODE_PRESETS[mode];
      targetRotation = preset.rotY + variant * 0.42;
      targetTiltZ = preset.tiltZ + (variant % 2 === 1 ? -0.05 : 0);
      targetTiltX = preset.tiltX;
      targetScale = preset.scale;
      schedule();
    },
    pulse(direction = 1) {
      if (reduce.matches) return;
      pulseEnergy = Math.min(1.1, pulseEnergy + 0.75);
      targetRotation += direction * 0.32;
      schedule();
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
      window.removeEventListener("pointermove", windowMove);
      document.removeEventListener("visibilitychange", visibility);
      reduce.removeEventListener("change", schedule);
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
        particles.dispose();
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
