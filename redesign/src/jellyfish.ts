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
  {
    rotY: number;
    tiltZ: number;
    tiltX: number;
    scale: number;
    bobSpeed: number;
    swimRadius: number;
  }
> = {
  hero: {
    rotY: 0.22,
    tiltZ: 0.04,
    tiltX: 0.02,
    scale: 1.04,
    bobSpeed: 1.0,
    swimRadius: 0.75,
  },
  experience: {
    rotY: -0.52,
    tiltZ: -0.12,
    tiltX: 0.08,
    scale: 0.9,
    bobSpeed: 0.9,
    swimRadius: 0.55,
  },
  projects: {
    rotY: 0.62,
    tiltZ: 0.1,
    tiltX: -0.06,
    scale: 0.92,
    bobSpeed: 0.95,
    swimRadius: 0.65,
  },
  about: {
    rotY: -0.36,
    tiltZ: -0.07,
    tiltX: 0.05,
    scale: 0.88,
    bobSpeed: 0.86,
    swimRadius: 0.5,
  },
  contact: {
    rotY: -0.2,
    tiltZ: -0.08,
    tiltX: 0.04,
    scale: 0.98,
    bobSpeed: 0.96,
    swimRadius: 0.7,
  },
};

/**
 * Biomimetic 3D Voxel Jellyfish with C1-continuous phase accumulators,
 * cylindrical polar-angle rotational water drag on tentacles,
 * smooth envelope-damped bioluminescent waves, and cursor-tracking eyes.
 */
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
    Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.5),
  );
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 160);
  camera.position.set(20, 10.5, 34.5);
  camera.lookAt(0, -4.0, 0);
  const sculpture = new THREE.Group();
  scene.add(sculpture);

  const bellGroup = new THREE.Group();
  sculpture.add(bellGroup);

  const geometry = new THREE.BoxGeometry(0.96, 0.96, 0.96);
  const palette = [
    "#e63b19",
    "#f56222",
    "#ff8528",
    "#ffad36",
    "#ffd573",
    "#fff1c7",
    "#ff5c8a",
  ].map((c) => new THREE.Color(c));

  // GPU shader with radial bell undulation + bioluminescent traveling wave + Fresnel rim glow
  const bellMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uGlow: { value: 0.0 },
      uBreath: { value: 0.0 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uGlow;
      uniform float uBreath;
      varying vec3 vColor;
      void main() {
        vec4 instPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        float radial = length(instPos.xz);
        float rimFactor = smoothstep(3.5, 9.5, radial);
        float angle = atan(instPos.z, instPos.x);

        // Biomimetic bell rim wave + smooth propulsion contraction/flare
        float ripple = sin(uTime * 3.0 - radial * 0.55 + angle * 2.0) * 0.25 * rimFactor;
        float flare = -uBreath * 1.25 * rimFactor;
        vec2 radialDir = radial > 0.001 ? normalize(instPos.xz) : vec2(0.0);

        vec4 localWorld = instanceMatrix * vec4(position, 1.0);
        localWorld.xz += radialDir * (flare + ripple * 0.4);
        localWorld.y += ripple + uBreath * (1.0 - rimFactor) * 0.75;

        vec4 worldPos = modelMatrix * localWorld;
        vec3 worldNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);

        vec3 keyLight = normalize(vec3(-0.55, 1.0, 0.85));
        vec3 rimLight = normalize(vec3(0.75, -0.25, -0.65));
        vec3 viewDir = normalize(cameraPosition - worldPos.xyz);

        float diffuse = max(dot(worldNormal, keyLight), 0.0);
        float rim = pow(1.0 - max(dot(worldNormal, viewDir), 0.0), 2.2) * 0.4;
        float backRim = max(dot(worldNormal, rimLight), 0.0) * 0.24;

        // Traveling bioluminescent wave in local bell coordinates (never jitters on rotation)
        float bioWave = max(0.0, sin(instPos.y * 0.55 - radial * 0.35 + uTime * 3.4));
        float burstWave = max(0.0, sin(instPos.y * 0.45 - uTime * 5.2)) * uGlow;

        vec3 biolumColor = vec3(1.0, 0.72, 0.28) * (bioWave * 0.2 + burstWave * 0.36);
        vColor = instanceColor * (0.56 + diffuse * 0.58 + rim + backRim) + biolumColor;
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

  // Tentacle & particle material with bioluminescent traveling pulse
  const tentacleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uGlow: { value: 0.0 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uGlow;
      varying vec3 vColor;
      void main() {
        vec4 localInst = instanceMatrix * vec4(position, 1.0);
        vec3 worldNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);
        vec4 worldPos = modelMatrix * localInst;
        vec3 light = normalize(vec3(-0.5, 1.0, 0.85));
        vec3 rimLight = normalize(vec3(0.7, -0.3, -0.6));
        float diffuse = max(dot(worldNormal, light), 0.0);
        float rim = max(dot(worldNormal, rimLight), 0.0) * 0.3;

        // Use local Y (localInst.y) so rotation never causes shader phase flicker
        float stream = max(0.0, sin(localInst.y * 0.45 + uTime * 4.2));
        float glowBoost = stream * (0.18 + uGlow * 0.38);
        vec3 warmGlow = vec3(1.0, 0.68, 0.25) * glowBoost;

        vColor = instanceColor * (0.58 + diffuse * 0.54 + rim) + warmGlow;
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
      const r2 = x * x + z * z;
      if (r2 < 52) {
        cubes.push({
          x,
          y: -0.55,
          z,
          color: palette[(x + z) % 3 === 0 ? 3 : 4],
        });
      }
      if (r2 < 20) {
        cubes.push({
          x,
          y: -1.35,
          z,
          color: palette[5],
        });
      }
    }
  }
  const cap = new THREE.InstancedMesh(geometry, bellMaterial, cubes.length);
  cubes.forEach((c, i) => {
    dummy.position.set(c.x, c.y, c.z);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    cap.setMatrixAt(i, dummy.matrix);
    cap.setColorAt(i, c.color);
  });
  bellGroup.add(cap);

  // Expressive cursor-tracking eyes + blush voxels
  const eyeMaterial = new THREE.MeshBasicMaterial({ color: "#261812" });
  const sparkleMaterial = new THREE.MeshBasicMaterial({ color: "#fff8e6" });
  const blushMaterial = new THREE.MeshBasicMaterial({ color: "#ff6448" });
  const eyesGroup = new THREE.Group();
  const pupilMeshes: {
    eye: THREE.Mesh;
    sparkle: THREE.Mesh;
    subSparkle: THREE.Mesh;
    baseX: number;
  }[] = [];

  for (const x of [-2.65, 2.65]) {
    const eye = new THREE.Mesh(
      new THREE.BoxGeometry(1.22, 1.72, 0.62),
      eyeMaterial,
    );
    eye.position.set(x, 0.55, 9.55);

    const sparkle = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.48, 0.18),
      sparkleMaterial,
    );
    sparkle.position.set(x - 0.18, 1.0, 9.95);

    const subSparkle = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.22, 0.16),
      sparkleMaterial,
    );
    subSparkle.position.set(x + 0.24, 0.22, 9.95);

    const blush = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.45, 0.4),
      blushMaterial,
    );
    blush.position.set(x * 1.48, -0.22, 9.15);

    eyesGroup.add(eye, sparkle, subSparkle, blush);
    pupilMeshes.push({ eye, sparkle, subSparkle, baseX: x });
  }
  bellGroup.add(eyesGroup);

  // 12 Multi-layered tentacles: 6 outer long ribbon tentacles + 6 inner frilly oral arms
  const strandCount = 12;
  const segments = 21;
  const tentacles = new THREE.InstancedMesh(
    geometry,
    tentacleMaterial,
    segments * strandCount,
  );
  tentacles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const tentacleArray = tentacles.instanceMatrix.array as Float32Array;
  for (let s = 0; s < strandCount; s++) {
    const isInner = s >= 6;
    for (let j = 0; j < segments; j++) {
      const idx = s * segments + j;
      const colorIdx = isInner
        ? Math.min(5, 3 + ((j + s) % 3))
        : j > segments - 5
          ? 5
          : ((s + j) % 4) + 1;
      tentacles.setColorAt(idx, palette[colorIdx]);
      const base = idx * 16;
      tentacleArray[base + 15] = 1;
    }
  }
  sculpture.add(tentacles);

  const strandMeta = Array.from({ length: strandCount }, (_, strand) => {
    const isInner = strand >= 6;
    const ringIdx = strand % 6;
    const angle =
      (ringIdx * Math.PI) / 3 + (isInner ? Math.PI / 6 + 0.15 : 0.38);
    return {
      angle,
      baseRadius: isInner ? 2.15 : 4.15,
      length: isInner
        ? 0.48 + (ringIdx % 2) * 0.08
        : 0.66 + (ringIdx % 3) * 0.09,
      isInner,
      strand,
    };
  });
  const segmentMeta = Array.from({ length: segments }, (_, j) => {
    const u = j / (segments - 1);
    return {
      u,
      uLag: Math.pow(u, 1.5),
      j,
      scaleOuter: 1.04 - u * 0.38,
      scaleInner: 0.88 - u * 0.35,
      tipLift: Math.max(0, u - 0.76) * 11.5,
      tipSpread: Math.max(0, u - 0.72),
    };
  });

  // 52 Ambient floating voxel crystals & rising bioluminescent bubbles
  const particleCount = 52;
  const particles = new THREE.InstancedMesh(
    geometry,
    tentacleMaterial,
    particleCount,
  );
  particles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const particleSeeds = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2 + (i % 5) * 0.35;
    const isCloseRing = i < 16;
    const radius = isCloseRing
      ? 8.8 + (i % 4) * 1.4
      : 11.2 + (i % 7) * 2.4;
    const baseY = -16 + (i / particleCount) * 28;
    const size = isCloseRing
      ? 0.22 + (i % 3) * 0.1
      : 0.26 + (i % 4) * 0.14;
    const speed = 0.5 + (i % 5) * 0.18;
    particles.setColorAt(i, palette[Math.min(5, 2 + (i % 4))]);
    return {
      angle,
      radius,
      baseY,
      size,
      speed,
      phase: i * 1.47,
      isCloseRing,
    };
  });
  scene.add(particles);

  /**
   * Uses monotonically accumulated phase (wavePhase, particlePhase) and
   * cylindrical polar-angle rotational drag (rotSwirl) so rotating the
   * jellyfish never causes phase jumps or erratic X-axis twitching.
   */
  const updateTentaclesAndParticles = (
    wavePhase: number,
    particlePhase: number,
    smoothGlow: number,
    breathContract: number,
    rotSwirl: number,
  ) => {
    const curlAmp = 2.35 + smoothGlow * 0.65;
    const spreadSlope = 0.68 - breathContract * 0.9 - smoothGlow * 0.2;
    const tipFlare = 5.6 + smoothGlow * 1.6 - breathContract * 1.5;
    const zAmp = 1.95 + smoothGlow * 0.55;

    for (let sIdx = 0; sIdx < strandCount; sIdx++) {
      const { angle, baseRadius, length, isInner, strand } = strandMeta[sIdx];
      const strandOffset = sIdx * segments;
      const phaseX = strand * 1.15 - wavePhase * 1.6;
      const phaseZ = strand * 0.95 - wavePhase * 1.32;
      const ampScale = isInner ? 0.72 : 1.0;

      for (let j = 0; j < segments; j++) {
        const { u, uLag, scaleOuter, scaleInner, tipLift, tipSpread } =
          segmentMeta[j];
        const scale = isInner
          ? scaleInner * (1 + Math.sin(u * 5.5 - wavePhase * 1.5) * 0.1)
          : scaleOuter;

        // Cylindrical polar-angle swirl: tentacles trail smoothly along the circular arc when rotating
        const laggedAngle = angle - rotSwirl * uLag * (isInner ? 0.55 : 0.85);
        const cosA = Math.cos(laggedAngle);
        const sinA = Math.sin(laggedAngle);

        const waveX =
          Math.sin(u * 5.0 + phaseX) * (0.2 + u * curlAmp * ampScale);
        const waveZ =
          Math.cos(u * 4.2 + phaseZ) * (0.18 + u * zAmp * ampScale);
        const spread =
          baseRadius +
          u * spreadSlope +
          tipSpread * tipFlare * (isInner ? 0.55 : 1.0);

        // Gentle centrifugal flare when spinning rapidly
        const spinLift = Math.min(1.2, Math.abs(rotSwirl) * 0.45) * uLag;

        const base = (strandOffset + j) * 16;
        tentacleArray[base] = scale;
        tentacleArray[base + 5] = scale;
        tentacleArray[base + 10] = scale;
        tentacleArray[base + 12] = cosA * (spread + spinLift) + waveX;
        tentacleArray[base + 13] =
          -1.6 - j * length + tipLift * (isInner ? 0.6 : 1.0) + spinLift * 0.35;
        tentacleArray[base + 14] = sinA * (spread + spinLift) + waveZ;
      }
    }
    tentacles.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < particleCount; i++) {
      const p = particleSeeds[i];
      // Monotonic particlePhase guarantees zero vertical jumping when pulseEnergy changes
      const climb = particlePhase * p.speed * 2.4;
      const yOffset = ((p.baseY + climb + 16) % 30) - 16;
      const fadeEdge = Math.min(
        1,
        Math.min((yOffset + 16) * 0.22, (14 - yOffset) * 0.22),
      );
      const orbitSpeed = p.isCloseRing ? 0.65 : 0.36;
      const orbit =
        p.angle +
        particlePhase * orbitSpeed * (i % 2 === 0 ? 1 : -0.7) +
        Math.sin(particlePhase * 0.5 + p.phase) * 0.28;
      const r =
        p.radius +
        Math.cos(particlePhase * 0.75 + p.phase) * 1.25 +
        smoothGlow * (p.isCloseRing ? 1.6 : 0.8);
      dummy.position.set(
        Math.cos(orbit) * r,
        yOffset,
        Math.sin(orbit) * r - 1.5,
      );
      const s = Math.max(0.01, p.size * fadeEdge * (1 + smoothGlow * 0.4));
      dummy.scale.setScalar(s);
      dummy.rotation.set(
        particlePhase * 0.8 + p.phase,
        particlePhase * 0.6 + p.phase,
        particlePhase * 0.3,
      );
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
    }
    particles.instanceMatrix.needsUpdate = true;
  };

  let visible = true;
  let disposed = false;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
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
  let smoothPointerX = 0;
  let smoothPointerY = 0;
  let rotSwirl = 0;
  let pulseEnergy = 0.3;
  let smoothPulse = 0.0;
  let blinkTimer = 0;
  let lastTime = 0;
  let elapsed = 0;
  let wavePhase = 0;
  let particlePhase = 0;
  let raf = 0;
  let compiled = false;

  const render = (now: number) => {
    raf = 0;
    if (disposed || !visible || document.hidden || !compiled) return;
    const dt = Math.min(0.05, (now - lastTime) / 1000 || 0.016);
    lastTime = now;
    const preset = MODE_PRESETS[currentMode];

    const lerpFast = 1 - Math.exp(-dt * 8.0);
    const lerpSmooth = 1 - Math.exp(-dt * 5.5);

    if (!reduce.matches) {
      pulseEnergy = Math.max(0, pulseEnergy - dt * 1.15);
      smoothPulse += (pulseEnergy - smoothPulse) * lerpSmooth;
      elapsed += dt * preset.bobSpeed;
      // Monotonically advancing phases: speed changes never rewind or jump positions!
      wavePhase += dt * (preset.bobSpeed + smoothPulse * 0.45);
      particlePhase += dt * (1.0 + smoothPulse * 0.4);
    } else {
      pulseEnergy = 0;
      smoothPulse = 0;
    }

    smoothPointerX += (pointerX - smoothPointerX) * lerpSmooth;
    smoothPointerY += (pointerY - smoothPointerY) * lerpSmooth;

    // Asymmetric biomimetic swimming rhythm: gentle contraction & glide
    const swimPhase = elapsed * 2.05;
    const rawSin = Math.sin(swimPhase);
    const asymmetricPulse =
      rawSin > 0 ? Math.pow(rawSin, 0.72) : -Math.pow(-rawSin, 1.3);

    const figure8X = reduce.matches
      ? 0
      : Math.sin(elapsed * 0.65) * preset.swimRadius +
        smoothPointerX * 0.75;
    const figure8Y = reduce.matches
      ? 0
      : Math.sin(elapsed * 1.3) * 0.78 +
        asymmetricPulse * 0.38 +
        smoothPulse * 0.95 -
        smoothPointerY * 0.6;

    // Compute smooth rotational delta for cylindrical tentacle water-drag
    const desiredRot =
      targetRotation +
      smoothPointerX * 0.28 +
      (reduce.matches ? 0 : Math.sin(elapsed * 0.42) * 0.09);
    const prevRot = rotation;
    rotation += (desiredRot - rotation) * lerpFast;
    const stepRotVel = (rotation - prevRot) / Math.max(0.008, dt);
    // Clamp and low-pass filter rotational swirl so tentacles trail without twitching
    const clampedSwirl = Math.max(-1.6, Math.min(1.6, stepRotVel * 0.22));
    rotSwirl += (clampedSwirl - rotSwirl) * lerpSmooth;

    tiltZ +=
      (targetTiltZ -
        smoothPointerX * 0.11 -
        rotSwirl * 0.08 +
        (reduce.matches ? 0 : Math.cos(elapsed * 0.65) * 0.06) -
        tiltZ) *
      lerpSmooth;
    tiltX +=
      (targetTiltX +
        smoothPointerY * 0.14 +
        (reduce.matches ? 0 : asymmetricPulse * 0.05) -
        tiltX) *
      lerpSmooth;
    baseScale += (targetScale - baseScale) * lerpSmooth;

    sculpture.rotation.y = rotation;
    sculpture.rotation.z = tiltZ;
    sculpture.rotation.x = tiltX;
    sculpture.position.x = figure8X;
    sculpture.position.y = figure8Y;
    sculpture.scale.setScalar(baseScale * (1 + smoothPulse * 0.035));

    // Biomimetic bell contraction & expansion driven by smoothPulse (never raw spiky pulseEnergy)
    const breath = reduce.matches
      ? 0
      : asymmetricPulse * 0.068 + smoothPulse * 0.11;
    bellGroup.scale.set(
      1 - breath * 0.88,
      1 + breath * 1.2,
      1 - breath * 0.88,
    );

    // Natural eye blink every ~4.4s + smooth happy squint (no hard boolean threshold flicker!)
    blinkTimer += dt;
    const blinkCycle = blinkTimer % 4.4;
    const blinkFactor =
      !reduce.matches && blinkCycle > 4.18
        ? Math.sin(((blinkCycle - 4.18) / 0.22) * Math.PI)
        : 0;
    const happySquint = Math.max(0, Math.min(1, (smoothPulse - 0.35) * 1.4));
    const closeAmount = Math.max(blinkFactor * 0.88, happySquint * 0.62);
    const eyeScaleY = 1.0 - closeAmount;
    const eyeScaleX = 1.0 + happySquint * 0.14;

    for (const p of pupilMeshes) {
      const lookX = smoothPointerX * 0.38;
      const lookY = -smoothPointerY * 0.28 + happySquint * 0.14;
      p.eye.position.x = p.baseX + lookX;
      p.eye.position.y = 0.55 + lookY;
      p.eye.scale.set(eyeScaleX, eyeScaleY, 1);

      p.sparkle.position.x = p.baseX - 0.18 + lookX * 1.2;
      p.sparkle.position.y = 1.0 + lookY * 1.2;
      p.sparkle.visible = blinkFactor < 0.65;

      p.subSparkle.position.x = p.baseX + 0.24 + lookX * 1.1;
      p.subSparkle.position.y = 0.22 + lookY * 1.1;
      p.subSparkle.visible = blinkFactor < 0.55;
    }

    bellMaterial.uniforms.uTime.value = wavePhase;
    bellMaterial.uniforms.uGlow.value = smoothPulse;
    bellMaterial.uniforms.uBreath.value = breath;
    tentacleMaterial.uniforms.uTime.value = wavePhase;
    tentacleMaterial.uniforms.uGlow.value = smoothPulse;

    updateTentaclesAndParticles(
      reduce.matches ? 0 : wavePhase,
      reduce.matches ? 0 : particlePhase,
      smoothPulse,
      breath,
      rotSwirl,
    );
    renderer.render(scene, camera);
    host.dataset.ready = "true";
    if (
      !reduce.matches ||
      dragging ||
      Math.abs(desiredRot - rotation) > 0.001 ||
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
    lastY = event.clientY;
    pulseEnergy = Math.min(0.85, pulseEnergy + 0.45);
    host.setPointerCapture(event.pointerId);
    host.classList.add("is-dragging");
    schedule();
  };
  const move = (event: PointerEvent) => {
    if (dragging) {
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      targetRotation += dx * 0.0095;
      targetTiltX = Math.max(-0.28, Math.min(0.28, targetTiltX + dy * 0.003));
      lastX = event.clientX;
      lastY = event.clientY;
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
    targetTiltX = MODE_PRESETS[currentMode].tiltX;
    host.classList.remove("is-dragging");
  };
  const key = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.stopPropagation();
      event.preventDefault();
      targetRotation += event.key === "ArrowLeft" ? -0.32 : 0.32;
      pulseEnergy = Math.min(0.85, pulseEnergy + 0.38);
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
  updateTentaclesAndParticles(0, 0, 0, 0, 0);
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
      targetRotation = preset.rotY + variant * 0.48;
      targetTiltZ = preset.tiltZ + (variant % 2 === 1 ? -0.06 : 0.04);
      targetTiltX = preset.tiltX;
      targetScale = preset.scale;
      schedule();
    },
    pulse(direction = 1) {
      if (reduce.matches) return;
      pulseEnergy = Math.min(0.95, pulseEnergy + 0.55);
      targetRotation += direction * 0.36;
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
        bellMaterial.dispose();
        tentacleMaterial.dispose();
        eyeMaterial.dispose();
        sparkleMaterial.dispose();
        blushMaterial.dispose();
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
