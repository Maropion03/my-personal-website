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
    bobSpeed: 1.05,
    swimRadius: 0.85,
  },
  experience: {
    rotY: -0.52,
    tiltZ: -0.12,
    tiltX: 0.08,
    scale: 0.9,
    bobSpeed: 0.92,
    swimRadius: 0.65,
  },
  projects: {
    rotY: 0.62,
    tiltZ: 0.1,
    tiltX: -0.06,
    scale: 0.92,
    bobSpeed: 0.98,
    swimRadius: 0.75,
  },
  about: {
    rotY: -0.36,
    tiltZ: -0.07,
    tiltX: 0.05,
    scale: 0.88,
    bobSpeed: 0.88,
    swimRadius: 0.6,
  },
  contact: {
    rotY: -0.2,
    tiltZ: -0.08,
    tiltX: 0.04,
    scale: 0.98,
    bobSpeed: 1.0,
    swimRadius: 0.8,
  },
};

/**
 * Biomimetic 3D Voxel Jellyfish with GPU-driven bell undulation,
 * bioluminescent traveling waves, cursor-tracking expressive eyes,
 * 12 multi-layered spring-whip tentacles, and an orbital voxel vortex.
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
      varying float vEnergy;
      void main() {
        vec4 instPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        float radial = length(instPos.xz);
        float rimFactor = smoothstep(3.5, 9.5, radial);
        float angle = atan(instPos.z, instPos.x);

        // Biomimetic bell rim wave + propulsion contraction/flare
        float ripple = sin(uTime * 3.2 - radial * 0.58 + angle * 2.0) * 0.28 * rimFactor;
        float flare = -uBreath * 1.35 * rimFactor;
        vec2 radialDir = radial > 0.001 ? normalize(instPos.xz) : vec2(0.0);

        vec3 localPos = position;
        vec4 worldPos = instanceMatrix * vec4(localPos, 1.0);
        worldPos.xz += radialDir * (flare + ripple * 0.45);
        worldPos.y += ripple + uBreath * (1.0 - rimFactor) * 0.85;

        worldPos = modelMatrix * worldPos;
        vec3 worldNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);

        vec3 keyLight = normalize(vec3(-0.55, 1.0, 0.85));
        vec3 rimLight = normalize(vec3(0.75, -0.25, -0.65));
        vec3 viewDir = normalize(cameraPosition - worldPos.xyz);

        float diffuse = max(dot(worldNormal, keyLight), 0.0);
        float rim = pow(1.0 - max(dot(worldNormal, viewDir), 0.0), 2.2) * 0.42;
        float backRim = max(dot(worldNormal, rimLight), 0.0) * 0.25;

        // Traveling bioluminescent wave from apex to bell rim
        float bioWave = max(0.0, sin(instPos.y * 0.55 - radial * 0.35 + uTime * 3.8));
        float burstWave = max(0.0, sin(worldPos.y * 0.4 - uTime * 7.5)) * uGlow;

        vec3 biolumColor = vec3(1.0, 0.72, 0.28) * (bioWave * 0.22 + burstWave * 0.42);
        vColor = instanceColor * (0.56 + diffuse * 0.58 + rim + backRim) + biolumColor;
        vEnergy = bioWave * 0.3 + uGlow * 0.7;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vEnergy;
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
        vec3 worldNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);
        vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
        vec3 light = normalize(vec3(-0.5, 1.0, 0.85));
        vec3 rimLight = normalize(vec3(0.7, -0.3, -0.6));
        float diffuse = max(dot(worldNormal, light), 0.0);
        float rim = max(dot(worldNormal, rimLight), 0.0) * 0.3;

        // Bioluminescent energy traveling down tentacles
        float stream = max(0.0, sin(worldPos.y * 0.45 + uTime * 4.6));
        float glowBoost = stream * (0.2 + uGlow * 0.45);
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
  // Scalloped luminous sub-bell rim & inner core
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
      cosA: Math.cos(angle),
      sinA: Math.sin(angle),
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
      uLag: Math.pow(u, 1.55),
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

  const updateTentaclesAndParticles = (
    time: number,
    pulseEnergy: number,
    breathContract: number,
    trailX: number,
    trailY: number,
  ) => {
    const waveSpeed = 1.08 + pulseEnergy * 0.55;
    const timeWave = time * 1.65 * waveSpeed;
    const timeZ = time * 1.38 * waveSpeed;
    const curlAmp = 2.45 + pulseEnergy * 0.95;
    const spreadSlope = 0.72 - breathContract * 1.2 - pulseEnergy * 0.3;
    const tipFlare = 5.8 + pulseEnergy * 2.4 - breathContract * 2.0;
    const zAmp = 2.05 + pulseEnergy * 0.75;

    for (let sIdx = 0; sIdx < strandCount; sIdx++) {
      const { cosA, sinA, baseRadius, length, isInner, strand } =
        strandMeta[sIdx];
      const strandOffset = sIdx * segments;
      const phaseX = strand * 1.15 - timeWave;
      const phaseZ = strand * 0.95 - timeZ;
      const ampScale = isInner ? 0.72 : 1.0;

      for (let j = 0; j < segments; j++) {
        const { u, uLag, scaleOuter, scaleInner, tipLift, tipSpread } =
          segmentMeta[j];
        const scale = isInner
          ? scaleInner * (1 + Math.sin(u * 6 - timeWave) * 0.12)
          : scaleOuter;

        // Traveling fluid wave + helical twist + velocity drag trail
        const waveX =
          Math.sin(u * 5.2 + phaseX) * (0.22 + u * curlAmp * ampScale);
        const waveZ =
          Math.cos(u * 4.4 + phaseZ) * (0.18 + u * zAmp * ampScale);
        const spread =
          baseRadius +
          u * spreadSlope +
          tipSpread * tipFlare * (isInner ? 0.55 : 1.0);

        const dragOffsetX = -trailX * uLag * 4.2;
        const dragOffsetY = -trailY * uLag * 2.8;

        const base = (strandOffset + j) * 16;
        tentacleArray[base] = scale;
        tentacleArray[base + 5] = scale;
        tentacleArray[base + 10] = scale;
        tentacleArray[base + 12] = cosA * spread + waveX + dragOffsetX;
        tentacleArray[base + 13] =
          -1.6 - j * length + tipLift * (isInner ? 0.6 : 1.0) + dragOffsetY;
        tentacleArray[base + 14] = sinA * spread + waveZ;
      }
    }
    tentacles.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < particleCount; i++) {
      const p = particleSeeds[i];
      const climb = time * p.speed * (2.4 + pulseEnergy * 1.5);
      const yOffset = ((p.baseY + climb + 16) % 30) - 16;
      const fadeEdge = Math.min(
        1,
        Math.min((yOffset + 16) * 0.22, (14 - yOffset) * 0.22),
      );
      const orbitSpeed = p.isCloseRing ? 0.68 : 0.38;
      const orbit =
        p.angle +
        time * orbitSpeed * (i % 2 === 0 ? 1 : -0.7) +
        Math.sin(time * 0.5 + p.phase) * 0.3;
      const r =
        p.radius +
        Math.cos(time * 0.8 + p.phase) * 1.35 +
        pulseEnergy * (p.isCloseRing ? 2.4 : 1.2);
      dummy.position.set(
        Math.cos(orbit) * r,
        yOffset,
        Math.sin(orbit) * r - 1.5,
      );
      const s = Math.max(0.01, p.size * fadeEdge * (1 + pulseEnergy * 0.55));
      dummy.scale.setScalar(s);
      dummy.rotation.set(
        time * 0.85 + p.phase,
        time * 0.65 + p.phase,
        time * 0.35,
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
  let prevSculptureX = 0;
  let prevSculptureY = 0;
  let trailVelX = 0;
  let trailVelY = 0;
  let pulseEnergy = 0.35; // Start with a welcoming initial pulse
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
      elapsed += dt * (preset.bobSpeed + pulseEnergy * 0.75);
      pulseEnergy = Math.max(0, pulseEnergy - dt * 1.35);
    } else {
      pulseEnergy = 0;
    }

    const lerpFast = 1 - Math.exp(-dt * 9.5);
    const lerpSmooth = 1 - Math.exp(-dt * 6.5);
    smoothPointerX += (pointerX - smoothPointerX) * lerpFast;
    smoothPointerY += (pointerY - smoothPointerY) * lerpFast;

    // Asymmetric biomimetic swimming rhythm: quick contraction snap, graceful glide
    const swimPhase = elapsed * 2.15;
    const rawSin = Math.sin(swimPhase);
    const asymmetricPulse =
      rawSin > 0 ? Math.pow(rawSin, 0.68) : -Math.pow(-rawSin, 1.35);

    const figure8X = reduce.matches
      ? 0
      : Math.sin(elapsed * 0.68) * preset.swimRadius +
        smoothPointerX * 0.95;
    const figure8Y = reduce.matches
      ? 0
      : Math.sin(elapsed * 1.36) * 0.85 +
        asymmetricPulse * 0.42 +
        pulseEnergy * 1.25 -
        smoothPointerY * 0.75;

    // Compute velocity trail for fluid tentacle lag
    const instVelX = (figure8X - prevSculptureX) / Math.max(0.008, dt);
    const instVelY = (figure8Y - prevSculptureY) / Math.max(0.008, dt);
    prevSculptureX = figure8X;
    prevSculptureY = figure8Y;
    trailVelX += (instVelX * 0.08 + (targetRotation - rotation) * 1.4 - trailVelX) * lerpSmooth;
    trailVelY += (instVelY * 0.08 - trailVelY) * lerpSmooth;

    rotation +=
      (targetRotation +
        smoothPointerX * 0.34 +
        (reduce.matches ? 0 : Math.sin(elapsed * 0.45) * 0.12) -
        rotation) *
      lerpFast;
    tiltZ +=
      (targetTiltZ -
        smoothPointerX * 0.14 +
        (reduce.matches ? 0 : Math.cos(elapsed * 0.68) * 0.075) -
        tiltZ) *
      lerpSmooth;
    tiltX +=
      (targetTiltX +
        smoothPointerY * 0.18 +
        (reduce.matches ? 0 : asymmetricPulse * 0.06) -
        tiltX) *
      lerpSmooth;
    baseScale += (targetScale - baseScale) * lerpSmooth;

    sculpture.rotation.y = rotation;
    sculpture.rotation.z = tiltZ;
    sculpture.rotation.x = tiltX;
    sculpture.position.x = figure8X;
    sculpture.position.y = figure8Y;
    sculpture.scale.setScalar(baseScale * (1 + pulseEnergy * 0.04));

    // Biomimetic bell contraction & expansion squash-and-stretch
    const breath = reduce.matches
      ? 0
      : asymmetricPulse * 0.075 + pulseEnergy * 0.14;
    bellGroup.scale.set(
      1 - breath * 0.92,
      1 + breath * 1.28,
      1 - breath * 0.92,
    );

    // Expressive eye tracking + happy squint on pulse + natural double-blink
    blinkTimer += dt;
    const blinkCycle = blinkTimer % 4.2;
    const isBlinking =
      !reduce.matches &&
      ((blinkCycle > 3.95 && blinkCycle < 4.1) || pulseEnergy > 0.65);
    const eyeScaleY = pulseEnergy > 0.65 ? 0.28 : isBlinking ? 0.12 : 1.0;
    const eyeScaleX = pulseEnergy > 0.65 ? 1.18 : 1.0;

    for (const p of pupilMeshes) {
      const lookX = smoothPointerX * 0.42;
      const lookY = -smoothPointerY * 0.32 + (pulseEnergy > 0.65 ? 0.18 : 0);
      p.eye.position.x = p.baseX + lookX;
      p.eye.position.y = 0.55 + lookY;
      p.eye.scale.set(eyeScaleX, eyeScaleY, 1);

      p.sparkle.position.x = p.baseX - 0.18 + lookX * 1.25;
      p.sparkle.position.y = 1.0 + lookY * 1.25;
      p.sparkle.visible = !isBlinking || pulseEnergy > 0.65;

      p.subSparkle.position.x = p.baseX + 0.24 + lookX * 1.15;
      p.subSparkle.position.y = 0.22 + lookY * 1.15;
      p.subSparkle.visible = !isBlinking;
    }

    bellMaterial.uniforms.uTime.value = elapsed;
    bellMaterial.uniforms.uGlow.value = pulseEnergy;
    bellMaterial.uniforms.uBreath.value = breath;
    tentacleMaterial.uniforms.uTime.value = elapsed;
    tentacleMaterial.uniforms.uGlow.value = pulseEnergy;

    updateTentaclesAndParticles(
      reduce.matches ? 0 : elapsed,
      pulseEnergy,
      breath,
      trailVelX,
      trailVelY,
    );
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
    lastY = event.clientY;
    pulseEnergy = Math.min(1.25, pulseEnergy + 0.85);
    host.setPointerCapture(event.pointerId);
    host.classList.add("is-dragging");
    schedule();
  };
  const move = (event: PointerEvent) => {
    if (dragging) {
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      targetRotation += dx * 0.011;
      targetTiltX = Math.max(-0.35, Math.min(0.35, targetTiltX + dy * 0.004));
      pulseEnergy = Math.min(1.1, pulseEnergy + Math.abs(dx) * 0.0025);
      lastX = event.clientX;
      lastY = event.clientY;
      schedule();
    }
  };
  const windowMove = (event: PointerEvent) => {
    if (reduce.matches) return;
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
      targetRotation += event.key === "ArrowLeft" ? -0.35 : 0.35;
      pulseEnergy = Math.min(1.2, pulseEnergy + 0.55);
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
      pulseEnergy = Math.min(1.3, pulseEnergy + 0.9);
      targetRotation += direction * 0.42;
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
