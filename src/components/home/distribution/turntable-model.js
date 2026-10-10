// Extracted from the approved JazzHQ vinyl experience's index.html.
// Keeps the original procedural deck, tonearm, controls, materials and lighting.
// No experimental page styles, audio, CDN dependencies or global event handlers.
import * as THREE from "three";

      function cnv(w, h) {
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        return c;
      }
      function grain(x, amount = 14, count = 2600) {
        const g = x.canvas;
        x.save();
        x.globalAlpha = 0.05;
        for (let i = 0; i < count; i++) {
          const v = (Math.random() * amount) | 0;
          x.fillStyle =
            Math.random() > 0.5
              ? `rgb(${255 - v},${255 - v},${255 - v})`
              : `rgb(${v},${v},${v})`;
          x.fillRect(
            Math.random() * g.width,
            Math.random() * g.height,
            1.4,
            1.4,
          );
        }
        x.restore();
      }

      function texWood(size = 1024) {
        const c = cnv(size, size),
          x = c.getContext("2d");
        const g = x.createLinearGradient(0, 0, size, size * 0.2);
        g.addColorStop(0, "#5a3a22");
        g.addColorStop(0.5, "#4c2f1a");
        g.addColorStop(1, "#5f3d24");
        x.fillStyle = g;
        x.fillRect(0, 0, size, size);
        // long grain streaks
        for (let i = 0; i < 220; i++) {
          const y = Math.random() * size,
            len = size * (0.4 + Math.random() * 0.8),
            sx = Math.random() * size - len / 2;
          const light = Math.random() > 0.5;
          x.strokeStyle = light
            ? `rgba(150,100,58,${0.05 + Math.random() * 0.12})`
            : `rgba(28,16,7,${0.06 + Math.random() * 0.14})`;
          x.lineWidth = 0.6 + Math.random() * 2.4;
          x.beginPath();
          x.moveTo(sx, y);
          for (let t = 0; t <= 1; t += 0.12)
            x.lineTo(
              sx + len * t,
              y + Math.sin(t * 9 + i) * 2.4 + (Math.random() - 0.5) * 1.6,
            );
          x.stroke();
        }
        // cathedral arcs
        for (let k = 0; k < 4; k++) {
          const cx0 = Math.random() * size,
            cy0 = Math.random() * size;
          x.strokeStyle = "rgba(30,17,8,.10)";
          for (let r = 8; r < size * 0.3; r += 7 + Math.random() * 8) {
            x.lineWidth = 1 + Math.random() * 1.6;
            x.beginPath();
            x.ellipse(cx0, cy0, r * 2.4, r * 0.5, 0, -0.4, 3.5);
            x.stroke();
          }
        }
        grain(x, 20, 3200);
        return c;
      }
      function texWoodBump(size = 512) {
        const c = cnv(size, size),
          x = c.getContext("2d");
        x.fillStyle = "#808080";
        x.fillRect(0, 0, size, size);
        for (let i = 0; i < 180; i++) {
          const y = Math.random() * size;
          x.strokeStyle = `rgba(${Math.random() > 0.5 ? 255 : 0},${Math.random() > 0.5 ? 255 : 0},0,.08)`;
          const v = Math.random() > 0.5 ? 255 : 20;
          x.strokeStyle = `rgba(${v},${v},${v},.09)`;
          x.lineWidth = 0.6 + Math.random() * 1.8;
          x.beginPath();
          x.moveTo(0, y);
          for (let t = 0; t <= 1; t += 0.1)
            x.lineTo(size * t, y + Math.sin(t * 8 + i) * 2);
          x.stroke();
        }
        return c;
      }

      /* vinyl top: color map + bump grooves. Grooves are geometry-scale
   concentric rings so specular highlights shimmer radially as the
   record spins (the texture rotates with the mesh). */
      function texVinyl(size = 1024) {
        const c = cnv(size, size),
          x = c.getContext("2d"),
          m = size / 2;
        x.fillStyle = "#0a0a0b";
        x.fillRect(0, 0, size, size);
        const rLabel = size * 0.155,
          rDead = size * 0.205,
          rOut = size * 0.492;
        // dead wax / run-out: smooth, glossier ring between grooves and label
        x.fillStyle = "#101013";
        x.beginPath();
        x.arc(m, m, rDead, 0, 7);
        x.arc(m, m, rLabel, 0, 7, true);
        x.fill("evenodd");
        x.strokeStyle = "rgba(190,190,200,.14)";
        x.lineWidth = 1; // faint run-out spiral
        x.beginPath();
        for (let a = 0; a < 22; a += 0.05)
          x.lineTo(
            m + Math.cos(a) * (rDead - 3 - a * 1.1),
            m + Math.sin(a) * (rDead - 3 - a * 1.1),
          );
        x.stroke();
        // groove sheen: alternating micro rings
        for (let r = rDead + size * 0.004; r < rOut; r += 1.35) {
          const t = (r - rDead) / (rOut - rDead);
          const band = Math.sin(t * 260) * 0.5 + 0.5; // program bands
          const v = 8 + band * 7 + Math.random() * 5;
          x.strokeStyle = `rgb(${v},${v},${v + 2})`;
          x.lineWidth = 1.1;
          x.beginPath();
          x.arc(m, m, r, 0, 7);
          x.stroke();
        }
        // track separation gaps (shinier)
        [0.3, 0.52, 0.74].forEach((t) => {
          const r = rDead + (rOut - rDead) * t;
          x.strokeStyle = "#1f1f22";
          x.lineWidth = size * 0.004;
          x.beginPath();
          x.arc(m, m, r, 0, 7);
          x.stroke();
        });
        // lead-in / lead-out
        x.strokeStyle = "#232326";
        x.lineWidth = size * 0.005;
        x.beginPath();
        x.arc(m, m, rOut - size * 0.006, 0, 7);
        x.stroke();
        x.beginPath();
        x.arc(m, m, rDead + size * 0.003, 0, 7);
        x.stroke();
        // faint hairline scratches
        x.strokeStyle = "rgba(120,120,125,.10)";
        x.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
          const a0 = Math.random() * 7,
            al = 0.15 + Math.random() * 0.5,
            rr = rDead + Math.random() * (rOut - rDead);
          x.beginPath();
          x.arc(m, m, rr, a0, a0 + al);
          x.stroke();
        }
        // dust specks
        x.fillStyle = "rgba(190,185,175,.15)";
        for (let i = 0; i < 80; i++) {
          const a = Math.random() * 7,
            rr = rDead + Math.random() * (rOut - rDead);
          x.fillRect(m + Math.cos(a) * rr, m + Math.sin(a) * rr, 1.3, 1.3);
        }
        return c;
      }
      function texVinylBump(size = 1024) {
        const c = cnv(size, size),
          x = c.getContext("2d"),
          m = size / 2;
        x.fillStyle = "#808080";
        x.fillRect(0, 0, size, size);
        const rDead = size * 0.205,
          rOut = size * 0.492;
        for (let r = rDead; r < rOut; r += 2) {
          x.strokeStyle = ((r / 2) | 0) % 2 ? "#6e6e6e" : "#929292";
          x.lineWidth = 1.2;
          x.beginPath();
          x.arc(m, m, r, 0, 7);
          x.stroke();
        }
        return c;
      }

      /* platter: brushed circular aluminum roughness */
      function texBrushed(size = 1024) {
        const c = cnv(size, size),
          x = c.getContext("2d"),
          m = size / 2;
        x.fillStyle = "#b9b9bd";
        x.fillRect(0, 0, size, size);
        for (let r = 6; r < size * 0.5; r += 1.5) {
          const v = 165 + Math.random() * 70;
          x.strokeStyle = `rgba(${v},${v},${v + 4},.5)`;
          x.lineWidth = 1;
          x.beginPath();
          x.arc(m, m, r, 0, 7);
          x.stroke();
        }
        // strobe dots near rim
        x.fillStyle = "#3a3a3d";
        const n = 140,
          rr = size * 0.472;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2;
          x.beginPath();
          x.arc(m + Math.cos(a) * rr, m + Math.sin(a) * rr, size * 0.004, 0, 7);
          x.fill();
        }
        return c;
      }

      /* rubber mat with ribbed rings */
      function texMat(size = 1024) {
        const c = cnv(size, size),
          x = c.getContext("2d"),
          m = size / 2;
        x.fillStyle = "#151412";
        x.fillRect(0, 0, size, size);
        for (let r = size * 0.06; r < size * 0.5; r += size * 0.024) {
          x.strokeStyle = "rgba(255,255,255,.05)";
          x.lineWidth = size * 0.006;
          x.beginPath();
          x.arc(m, m, r, 0, 7);
          x.stroke();
          x.strokeStyle = "rgba(0,0,0,.5)";
          x.lineWidth = size * 0.004;
          x.beginPath();
          x.arc(m, m, r + size * 0.007, 0, 7);
          x.stroke();
        }
        grain(x, 16, 1600);
        return c;
      }

      /* brass front plaque: “JazzHQ — AI DISTRIBUTION PLATFORM” */
      function texPlaque(w = 768, h = 224) {
        const c = cnv(w, h),
          x = c.getContext("2d");
        const g = x.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "#1c1610");
        g.addColorStop(1, "#0f0b07");
        x.fillStyle = g;
        x.fillRect(0, 0, w, h);
        x.strokeStyle = "#caa25e";
        x.lineWidth = 5;
        x.strokeRect(10, 10, w - 20, h - 20);
        x.strokeStyle = "rgba(202,162,94,.4)";
        x.lineWidth = 2;
        x.strokeRect(20, 20, w - 40, h - 40);
        x.textAlign = "center";
        x.fillStyle = "#e8c684";
        x.font = `600 ${h * 0.34}px 'Cormorant Garamond', serif`;
        x.fillText("JazzHQ", w / 2, h * 0.48);
        x.font = `600 ${h * 0.115}px Inter, sans-serif`;
        x.fillStyle = "#caa25e";
        x.save();
        x.letterSpacing = `${h * 0.05}px`;
        x.fillText("AI DISTRIBUTION PLATFORM", w / 2, h * 0.74);
        x.restore();
        return c;
      }

      /* deck print (light lettering silk-screened onto the wood) */
      function texDeckPrint(main, subs, w = 512, h = 256) {
        const c = cnv(w, h),
          x = c.getContext("2d");
        x.clearRect(0, 0, w, h);
        x.textAlign = "center";
        x.fillStyle = "rgba(240,228,205,.92)";
        x.font = `600 ${h * 0.19}px Inter, sans-serif`;
        x.save();
        x.letterSpacing = `${h * 0.05}px`;
        x.fillText(main, w / 2, h * 0.24);
        x.restore();
        if (subs) {
          x.font = `500 ${h * 0.13}px Inter, sans-serif`;
          x.fillStyle = "rgba(240,228,205,.75)";
          x.textAlign = "left";
          x.fillText(subs[0], w * 0.03, h * 0.92);
          x.textAlign = "right";
          x.fillText(subs[1], w * 0.97, h * 0.92);
        }
        return c;
      }

      function ctex(canvas, { srgb = true, aniso = 4, repeat } = {}) {
        const t = new THREE.CanvasTexture(canvas);
        if (srgb) t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = aniso;
        if (repeat) {
          t.wrapS = t.wrapT = THREE.RepeatWrapping;
          t.repeat.set(repeat[0], repeat[1]);
        }
        return t;
      }


/** @param {HTMLCanvasElement} canvas */
export function buildTurntable(canvas) {
  let environmentTarget;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 2, 0.1, 60);
      const camHome = new THREE.Vector3(0.12, 2.68, 6.5);
      camera.position.copy(camHome);
      camera.lookAt(0, 0.1, 0);

      /* PMREM studio environment — a warm little light room built from
   emissive planes, prefiltered for PBR reflections. */
      {
        const envScene = new THREE.Scene();
        envScene.background = new THREE.Color("#2e2a24");
        const panel = (w, h, c, i, x, y, z, rx = 0, ry = 0) => {
          const m = new THREE.Mesh(
            new THREE.PlaneGeometry(w, h),
            new THREE.MeshBasicMaterial({
              color: new THREE.Color(c).multiplyScalar(i),
            }),
          );
          m.position.set(x, y, z);
          m.rotation.set(rx, ry, 0);
          envScene.add(m);
        };
        panel(6, 3, "#fff2dc", 9, 0, 4.5, -2, -Math.PI / 2, 0); // big warm softbox above
        panel(2.5, 4, "#ffe9c8", 5, -5, 2, 0, 0, Math.PI / 2); // key left
        panel(2, 3, "#dfe6f2", 2.5, 5, 1.5, 1, 0, -Math.PI / 2); // cool fill right
        panel(8, 2, "#f3e3c6", 1.2, 0, 1, 5, 0, Math.PI); // front bounce
        const pm = new THREE.PMREMGenerator(renderer);
        environmentTarget = pm.fromScene(envScene, 0.04);
        scene.environment = environmentTarget.texture;
        envScene.traverse((object) => {
          if (object.isMesh) { object.geometry.dispose(); object.material.dispose(); }
        });
        pm.dispose();
      }

      /* lights */
      const hemi = new THREE.HemisphereLight("#fff4e0", "#8a7355", 0.55);
      scene.add(hemi);
      const key = new THREE.DirectionalLight("#fff0d8", 2.0);
      key.position.set(-4.5, 7, 4);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = -4;
      key.shadow.camera.right = 4;
      key.shadow.camera.top = 4;
      key.shadow.camera.bottom = -4;
      key.shadow.bias = -0.0004;
      key.shadow.radius = 6;
      scene.add(key);
      const rim = new THREE.DirectionalLight("#ffe2b0", 0.9);
      rim.position.set(3.5, 4.5, -5);
      scene.add(rim);
      const fill = new THREE.DirectionalLight("#e8ecf4", 0.35);
      fill.position.set(4, 2, 4);
      scene.add(fill);

      /* contact shadow: soft radial gradient plane under the player */
      {
        const c = cnv(512, 512),
          x = c.getContext("2d");
        const g = x.createRadialGradient(256, 256, 30, 256, 256, 250);
        g.addColorStop(0, "rgba(52,36,14,.42)");
        g.addColorStop(0.55, "rgba(52,36,14,.20)");
        g.addColorStop(1, "rgba(52,36,14,0)");
        x.fillStyle = g;
        x.fillRect(0, 0, 512, 512);
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(7.6, 5.4),
          new THREE.MeshBasicMaterial({
            map: ctex(c),
            transparent: true,
            depthWrite: false,
          }),
        );
        m.rotation.x = -Math.PI / 2;
        m.position.y = -0.72;
        scene.add(m);
      }
      /* ground plane receives the crisper key-light shadow */
      {
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(30, 30),
          new THREE.ShadowMaterial({ opacity: 0.16 }),
        );
        m.rotation.x = -Math.PI / 2;
        m.position.y = -0.715;
        m.receiveShadow = true;
        scene.add(m);
      }

      /* ══════════════════════════════════════════════════════════════
   4 · THE TURNTABLE — every part procedural geometry
   ══════════════════════════════════════════════════════════════ */
      const player = new THREE.Group(); // drag-to-rotate root
      scene.add(player);

      const M = {
        wood: new THREE.MeshPhysicalMaterial({
          // lacquered walnut
          map: ctex(texWood(), { repeat: [1, 1] }),
          bumpMap: ctex(texWoodBump(), { srgb: false }),
          bumpScale: 0.4,
          color: "#a97e52",
          roughness: 0.38,
          metalness: 0,
          envMapIntensity: 0.7,
          clearcoat: 0.45,
          clearcoatRoughness: 0.35,
        }),
        woodDark: new THREE.MeshStandardMaterial({
          color: "#2c1c10",
          roughness: 0.6,
        }),
        alu: new THREE.MeshStandardMaterial({
          color: "#d6d6da",
          metalness: 0.95,
          roughness: 0.34,
          roughnessMap: ctex(texBrushed(), { srgb: false }),
          envMapIntensity: 1.15,
        }),
        chrome: new THREE.MeshStandardMaterial({
          color: "#e8e8ee",
          metalness: 1,
          roughness: 0.12,
          envMapIntensity: 1.3,
        }),
        steel: new THREE.MeshStandardMaterial({
          color: "#9a9aa0",
          metalness: 0.9,
          roughness: 0.35,
        }),
        brass: new THREE.MeshStandardMaterial({
          color: "#c9a25e",
          metalness: 0.9,
          roughness: 0.3,
          envMapIntensity: 1.1,
        }),
        blackMetal: new THREE.MeshStandardMaterial({
          color: "#1a1a1c",
          metalness: 0.7,
          roughness: 0.42,
        }),
        blackGloss: new THREE.MeshPhysicalMaterial({
          color: "#101012",
          metalness: 0.2,
          roughness: 0.2,
          clearcoat: 0.8,
          clearcoatRoughness: 0.2,
        }),
        blackPlastic: new THREE.MeshStandardMaterial({
          color: "#141312",
          metalness: 0.1,
          roughness: 0.55,
        }),
        rubber: new THREE.MeshStandardMaterial({
          map: ctex(texMat()),
          color: "#ffffff",
          roughness: 0.92,
          metalness: 0,
          envMapIntensity: 0.25,
        }),
        vinyl: new THREE.MeshPhysicalMaterial({
          map: ctex(texVinyl()),
          bumpMap: ctex(texVinylBump(), { srgb: false }),
          bumpScale: 1.6,
          color: "#ffffff",
          roughness: 0.34,
          metalness: 0.05,
          clearcoat: 0.65,
          clearcoatRoughness: 0.3,
          envMapIntensity: 1.5,
        }),
      };

      const PLATTER_C = new THREE.Vector3(-0.45, 0, -0.1); // platter centre (deck top = y0)

      /* — plinth: rounded-rect extrusion with beveled edges — */
      {
        const w = 4.7,
          d = 3.3,
          r = 0.16;
        const sh = new THREE.Shape();
        sh.moveTo(-w / 2 + r, -d / 2);
        sh.lineTo(w / 2 - r, -d / 2);
        sh.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
        sh.lineTo(w / 2, d / 2 - r);
        sh.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
        sh.lineTo(-w / 2 + r, d / 2);
        sh.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
        sh.lineTo(-w / 2, -d / 2 + r);
        sh.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
        const geo = new THREE.ExtrudeGeometry(sh, {
          depth: 0.46,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.03,
          bevelSegments: 4,
          curveSegments: 12,
        });
        geo.rotateX(-Math.PI / 2);
        geo.translate(0, -0.49, 0);
        const uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) {
          uv.setXY(i, uv.getX(i) * 0.22, uv.getY(i) * 0.22);
        }
        const plinth = new THREE.Mesh(geo, M.wood);
        plinth.castShadow = plinth.receiveShadow = true;
        player.add(plinth);
      }
      /* isolation feet: alloy cone + rubber ring */
      [
        [-2.0, -1.32],
        [2.0, -1.32],
        [-2.0, 1.32],
        [2.0, 1.32],
      ].forEach(([fx, fz]) => {
        const f = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.175, 0.18, 28),
          M.blackPlastic,
        );
        f.position.set(fx, -0.585, fz);
        f.castShadow = true;
        player.add(f);
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.165, 0.016, 10, 28),
          M.blackMetal,
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.set(fx, -0.655, fz);
        player.add(ring);
      });

      /* dust cover hinges on the rear edge */
      [[-1.35], [1.35]].forEach(([hx]) => {
        const seat = new THREE.Mesh(
          new THREE.BoxGeometry(0.22, 0.05, 0.08),
          M.blackPlastic,
        );
        seat.position.set(hx, 0.025, -1.56);
        seat.castShadow = true;
        player.add(seat);
        const barrel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.026, 0.026, 0.22, 16),
          M.blackMetal,
        );
        barrel.rotation.z = Math.PI / 2;
        barrel.position.set(hx, 0.062, -1.585);
        player.add(barrel);
      });

      /* rear connection panel: RCA out · ground post · power lead */
      {
        const plate = new THREE.Mesh(
          new THREE.PlaneGeometry(1.0, 0.26),
          M.blackPlastic,
        );
        plate.rotation.y = Math.PI;
        plate.position.set(0.65, -0.26, -1.684);
        player.add(plate);
        const mkRCA = (x0, ring) => {
          const jack = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.06, 18),
            M.chrome,
          );
          jack.rotation.x = Math.PI / 2;
          jack.position.set(x0, -0.24, -1.71);
          player.add(jack);
          const r = new THREE.Mesh(
            new THREE.TorusGeometry(0.032, 0.01, 10, 20),
            new THREE.MeshStandardMaterial({
              color: ring,
              roughness: 0.4,
              metalness: 0.2,
            }),
          );
          r.position.set(x0, -0.24, -1.735);
          player.add(r);
        };
        mkRCA(0.45, "#c33b2e");
        mkRCA(0.66, "#e8e2d4");
        const gnd = new THREE.Mesh(
          new THREE.CylinderGeometry(0.018, 0.018, 0.05, 12),
          M.brass,
        );
        gnd.rotation.x = Math.PI / 2;
        gnd.position.set(0.88, -0.24, -1.705);
        player.add(gnd);
        // power lead: strain relief + short drooping cable
        const relief = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.04, 0.09, 14),
          M.blackPlastic,
        );
        relief.rotation.x = Math.PI / 2;
        relief.position.set(1.1, -0.3, -1.72);
        player.add(relief);
        const cable = new THREE.Mesh(
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(1.1, -0.3, -1.76),
              new THREE.Vector3(1.12, -0.42, -1.95),
              new THREE.Vector3(1.16, -0.66, -2.1),
              new THREE.Vector3(1.22, -0.705, -2.3),
            ]),
            24,
            0.02,
            10,
          ),
          M.blackPlastic,
        );
        cable.castShadow = true;
        player.add(cable);
      }

      /* power rocker on the front-left corner */
      {
        const base = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 0.024, 0.1),
          M.steel,
        );
        base.position.set(-2.06, 0.012, 1.32);
        player.add(base);
        const rocker = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.03, 0.075),
          M.blackGloss,
        );
        rocker.position.set(-2.06, 0.036, 1.32);
        rocker.rotation.x = -0.16;
        player.add(rocker);
      }

      /* platter well: recessed seat shadow under the platter */
      {
        const well = new THREE.Mesh(
          new THREE.RingGeometry(1.36, 1.52, 96),
          new THREE.MeshBasicMaterial({
            color: "#241a10",
            transparent: true,
            opacity: 0.55,
            depthWrite: false,
          }),
        );
        well.rotation.x = -Math.PI / 2;
        well.position.set(PLATTER_C.x, 0.0015, PLATTER_C.z);
        player.add(well);
      }

      /* — spin group: platter · strobe dots · mat · record · spindle — */
      const spin = new THREE.Group();
      spin.position.copy(PLATTER_C);
      player.add(spin);
      {
        const platter = new THREE.Mesh(
          new THREE.CylinderGeometry(1.42, 1.38, 0.1, 96),
          M.alu,
        );
        platter.position.y = 0.05;
        platter.castShadow = true;
        platter.receiveShadow = true;
        spin.add(platter);
        // machined chrome trim at the top edge
        const trim = new THREE.Mesh(
          new THREE.TorusGeometry(1.415, 0.01, 8, 120),
          M.chrome,
        );
        trim.rotation.x = Math.PI / 2;
        trim.position.y = 0.098;
        spin.add(trim);
        // strobe dots around the rim wall (instanced)
        const dotGeo = new THREE.SphereGeometry(0.0115, 8, 8);
        const dots = new THREE.InstancedMesh(dotGeo, M.blackMetal, 80);
        const mtx = new THREE.Matrix4(),
          q = new THREE.Quaternion(),
          s = new THREE.Vector3(1, 1, 0.5);
        for (let i = 0; i < 80; i++) {
          const a = (i / 80) * Math.PI * 2;
          q.setFromEuler(new THREE.Euler(0, -a, 0));
          mtx.compose(
            new THREE.Vector3(Math.cos(a) * 1.412, 0.055, Math.sin(a) * 1.412),
            q,
            s,
          );
          dots.setMatrixAt(i, mtx);
        }
        spin.add(dots);
        const mat = new THREE.Mesh(
          new THREE.CylinderGeometry(1.32, 1.32, 0.022, 96),
          M.rubber,
        );
        mat.position.y = 0.111;
        spin.add(mat);
      }
      const recordGroup = new THREE.Group(); // lifts out on album swap
      recordGroup.position.y = 0;
      spin.add(recordGroup);
      const vinylMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(1.36, 1.352, 0.026, 128),
        M.vinyl,
      );
      vinylMesh.position.y = 0.135;
      vinylMesh.castShadow = true;
      recordGroup.add(vinylMesh);
      {
        // rounded pressing edge
        const edge = new THREE.Mesh(
          new THREE.TorusGeometry(1.352, 0.012, 8, 140),
          M.blackGloss,
        );
        edge.rotation.x = Math.PI / 2;
        edge.position.y = 0.14;
        recordGroup.add(edge);
      }
      const labelMat = new THREE.MeshStandardMaterial({
        roughness: 0.95,
        metalness: 0,
        envMapIntensity: 0.3,
      });
      const labelMesh = new THREE.Mesh(
        new THREE.CircleGeometry(0.435, 64),
        labelMat,
      );
      labelMesh.rotation.x = -Math.PI / 2;
      labelMesh.position.y = 0.1496;
      recordGroup.add(labelMesh);
      {
        // spindle: shaft + rounded tip + bearing collar
        const spindle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.021, 0.021, 0.1, 20),
          M.chrome,
        );
        spindle.position.y = 0.17;
        spin.add(spindle);
        const tip = new THREE.Mesh(
          new THREE.SphereGeometry(0.021, 16, 12),
          M.chrome,
        );
        tip.position.y = 0.219;
        tip.scale.y = 0.55;
        spin.add(tip);
      }

      /* 45 rpm adapter puck resting on the deck */
      {
        const seat = new THREE.Mesh(
          new THREE.CircleGeometry(0.135, 40),
          new THREE.MeshBasicMaterial({
            color: "#2a1c0f",
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
          }),
        );
        seat.rotation.x = -Math.PI / 2;
        seat.position.set(-1.15, 0.002, 1.38);
        player.add(seat);
        const puck = new THREE.Mesh(
          new THREE.CylinderGeometry(0.105, 0.105, 0.042, 40),
          M.alu,
        );
        puck.position.set(-1.15, 0.023, 1.38);
        puck.castShadow = true;
        player.add(puck);
        const grip = new THREE.Mesh(
          new THREE.TorusGeometry(0.098, 0.008, 8, 40),
          M.steel,
        );
        grip.rotation.x = Math.PI / 2;
        grip.position.set(-1.15, 0.045, 1.38);
        player.add(grip);
        const hole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.036, 0.036, 0.046, 24),
          M.blackPlastic,
        );
        hole.position.set(-1.15, 0.024, 1.38);
        player.add(hole);
      }

      /* — tonearm assembly: base · gimbal · S-tube · headshell · counterweight — */
      const ARM = {
        pivot: new THREE.Vector3(1.55, 0, -0.85),
        L: 2.05,
        bearingY: 0.3,
      };
      const armRoot = new THREE.Group();
      armRoot.position.copy(ARM.pivot);
      player.add(armRoot);
      const armYaw = new THREE.Group();
      armYaw.position.y = ARM.bearingY;
      armRoot.add(armYaw);
      const armLift = new THREE.Group();
      armYaw.add(armLift);
      let cueLever;
      {
        // polished base disc + black housing + VTA collar
        const disc = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.235, 0.035, 44),
          M.alu,
        );
        disc.position.y = 0.0175;
        disc.castShadow = true;
        armRoot.add(disc);
        const housing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.155, 0.17, 0.06, 40),
          M.blackMetal,
        );
        housing.position.y = 0.062;
        housing.castShadow = true;
        armRoot.add(housing);
        const collar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.075, 0.075, 0.04, 28),
          M.steel,
        );
        collar.position.y = 0.105;
        armRoot.add(collar);
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.055, ARM.bearingY - 0.09, 24),
          M.chrome,
        );
        post.position.y = (ARM.bearingY + 0.09) / 2;
        armRoot.add(post);
        // gimbal: vertical yoke ring + horizontal axle with pivot screws
        const yoke = new THREE.Mesh(
          new THREE.TorusGeometry(0.088, 0.013, 10, 36),
          M.blackMetal,
        );
        yoke.rotation.y = Math.PI / 2;
        armYaw.add(yoke);
        const axle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.03, 0.2, 18),
          M.blackMetal,
        );
        axle.rotation.z = Math.PI / 2;
        armLift.add(axle);
        [[-0.105], [0.105]].forEach(([ax]) => {
          const screw = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 0.016, 14),
            M.chrome,
          );
          screw.rotation.z = Math.PI / 2;
          screw.position.x = ax;
          armYaw.add(screw);
        });
        // screws on the base disc
        for (let i = 0; i < 4; i++) {
          const s = new THREE.Mesh(
            new THREE.CylinderGeometry(0.012, 0.012, 0.012, 10),
            M.steel,
          );
          const a = (i / 4) * Math.PI * 2 + 0.4;
          s.position.set(Math.cos(a) * 0.185, 0.038, Math.sin(a) * 0.185);
          armRoot.add(s);
        }
        // cueing lever beside the pivot
        cueLever = new THREE.Group();
        cueLever.position.set(0.2, 0.095, 0.1);
        armRoot.add(cueLever);
        const lbase = new THREE.Mesh(
          new THREE.BoxGeometry(0.045, 0.03, 0.045),
          M.blackMetal,
        );
        cueLever.add(lbase);
        const larm = new THREE.Mesh(
          new THREE.CylinderGeometry(0.01, 0.013, 0.15, 10),
          M.steel,
        );
        larm.rotation.x = 1.15;
        larm.position.set(0, 0.045, 0.055);
        cueLever.add(larm);
        const ltip = new THREE.Mesh(
          new THREE.SphereGeometry(0.02, 12, 10),
          M.blackGloss,
        );
        ltip.position.set(0, 0.075, 0.115);
        cueLever.add(ltip);
        cueLever.rotation.x = 0.55; // starts raised
        // lift platform under the tube
        const platform = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.022, 0.17),
          M.blackPlastic,
        );
        platform.position.set(-0.02, 0.175, -0.3);
        platform.rotation.y = 0.35;
        armRoot.add(platform);
        // S-shaped arm tube along −Z, with rear stub + joining collar
        const pts = [
          new THREE.Vector3(0, 0, 0.08),
          new THREE.Vector3(0.02, 0, -0.45),
          new THREE.Vector3(0.09, -0.01, -1.05),
          new THREE.Vector3(-0.02, -0.03, -1.65),
          new THREE.Vector3(-0.1, -0.045, -ARM.L + 0.09),
        ];
        const tube = new THREE.Mesh(
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(pts),
            48,
            0.024,
            12,
          ),
          M.chrome,
        );
        tube.castShadow = true;
        armLift.add(tube);
        const stub = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.03, 0.26, 14),
          M.blackMetal,
        );
        stub.rotation.x = Math.PI / 2;
        stub.position.set(0, 0.002, 0.2);
        armLift.add(stub);
        const joint = new THREE.Mesh(
          new THREE.CylinderGeometry(0.034, 0.034, 0.05, 16),
          M.steel,
        );
        joint.rotation.x = Math.PI / 2;
        joint.position.set(0, 0, 0.06);
        armLift.add(joint);
        // headshell: shell + finger lift + cartridge + cantilever + stylus
        const hs = new THREE.Group();
        hs.position.set(-0.115, -0.052, -ARM.L + 0.055);
        hs.rotation.y = 0.32;
        armLift.add(hs);
        const lock = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.03, 0.05, 14),
          M.blackMetal,
        );
        lock.rotation.x = Math.PI / 2;
        lock.position.set(0, 0.01, 0.1);
        hs.add(lock);
        const shell = new THREE.Mesh(
          new THREE.BoxGeometry(0.085, 0.022, 0.19),
          M.blackGloss,
        );
        shell.castShadow = true;
        hs.add(shell);
        const lift = new THREE.Mesh(
          new THREE.TorusGeometry(0.045, 0.006, 8, 20, 2.4),
          M.chrome,
        );
        lift.rotation.set(0, 0.4, 1.1);
        lift.position.set(0.055, 0.008, -0.055);
        hs.add(lift);
        const cart = new THREE.Mesh(
          new THREE.BoxGeometry(0.066, 0.048, 0.11),
          M.blackPlastic,
        );
        cart.position.set(0, -0.034, -0.025);
        hs.add(cart);
        const face = new THREE.Mesh(
          new THREE.BoxGeometry(0.052, 0.034, 0.008),
          new THREE.MeshStandardMaterial({ color: "#8e2f26", roughness: 0.5 }),
        );
        face.position.set(0, -0.036, -0.082);
        hs.add(face);
        const cant = new THREE.Mesh(
          new THREE.CylinderGeometry(0.004, 0.006, 0.055, 8),
          M.steel,
        );
        cant.rotation.x = Math.PI / 2 - 0.5;
        cant.position.set(0, -0.066, -0.07);
        hs.add(cant);
        const stylus = new THREE.Mesh(
          new THREE.ConeGeometry(0.007, 0.024, 8),
          M.chrome,
        );
        stylus.rotation.x = Math.PI;
        stylus.position.set(0, -0.081, -0.084);
        hs.add(stylus);
        // headshell lead wires
        const wires = new THREE.Mesh(
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(0.01, 0.012, 0.075),
              new THREE.Vector3(0.02, 0.03, 0.02),
              new THREE.Vector3(0.005, 0.005, -0.02),
            ]),
            12,
            0.005,
            6,
          ),
          M.blackPlastic,
        );
        hs.add(wires);
        // counterweight: knurled main + tracking-force scale ring
        const cw = new THREE.Mesh(
          new THREE.CylinderGeometry(0.082, 0.082, 0.11, 32),
          M.blackMetal,
        );
        cw.rotation.x = Math.PI / 2;
        cw.position.set(0, 0.002, 0.36);
        cw.castShadow = true;
        armLift.add(cw);
        const knurl = new THREE.Mesh(
          new THREE.TorusGeometry(0.083, 0.007, 8, 40),
          M.blackGloss,
        );
        knurl.position.set(0, 0.002, 0.36);
        armLift.add(knurl);
        const scaleRing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.055, 0.05, 24),
          M.steel,
        );
        scaleRing.rotation.x = Math.PI / 2;
        scaleRing.position.set(0, 0.002, 0.285);
        armLift.add(scaleRing);
        const scaleMark = new THREE.Mesh(
          new THREE.BoxGeometry(0.008, 0.01, 0.048),
          new THREE.MeshStandardMaterial({ color: "#f3ead6", roughness: 0.4 }),
        );
        scaleMark.position.set(0, 0.058, 0.285);
        armLift.add(scaleMark);
        // anti-skate dial with index dot
        const dial = new THREE.Mesh(
          new THREE.CylinderGeometry(0.038, 0.042, 0.035, 20),
          M.steel,
        );
        dial.position.set(0.17, 0.1, 0.16);
        armRoot.add(dial);
        const idx = new THREE.Mesh(
          new THREE.BoxGeometry(0.006, 0.006, 0.024),
          M.blackMetal,
        );
        idx.position.set(0.17, 0.12, 0.145);
        armRoot.add(idx);
        // arm rest: post + U-clip
        const rpost = new THREE.Mesh(
          new THREE.CylinderGeometry(0.024, 0.028, 0.25, 16),
          M.blackPlastic,
        );
        rpost.position.set(-0.26, 0.125, 0.55);
        armRoot.add(rpost);
        const clipBase = new THREE.Mesh(
          new THREE.BoxGeometry(0.075, 0.022, 0.05),
          M.blackPlastic,
        );
        clipBase.position.set(-0.26, 0.262, 0.55);
        armRoot.add(clipBase);
        [[-0.034], [0.034]].forEach(([cx]) => {
          const prong = new THREE.Mesh(
            new THREE.BoxGeometry(0.012, 0.06, 0.05),
            M.blackPlastic,
          );
          prong.position.set(-0.26 + cx, 0.3, 0.55);
          armRoot.add(prong);
        });
      }

      /* stylus world-target solver: find yaw φ so the stylus lands at
   radius r from the platter centre (front-side branch). */
      function yawForRadius(r) {
        const px = ARM.pivot.x - PLATTER_C.x,
          pz = ARM.pivot.z - PLATTER_C.z;
        let best = 0,
          bestErr = 1e9;
        for (let phi = 1.2; phi < 3.3; phi += 0.002) {
          const sx = px - ARM.L * Math.sin(phi),
            sz = pz - ARM.L * Math.cos(phi);
          const err = Math.abs(Math.hypot(sx, sz) - r);
          if (err < bestErr && phi > 1.9) {
            bestErr = err;
            best = phi;
          }
        }
        return best;
      }
      const YAW_REST = 2.72; // tube seats in the rest clip
      const YAW_OUTER = yawForRadius(1.27);
      const LIFT_UP = 0.055; // armLift.rotation.x — raised
      const LIFT_DOWN = -0.0065; //                    — stylus in the groove
      armYaw.rotation.y = YAW_REST;
      armLift.rotation.x = LIFT_UP;

      /* — controls on the deck — */
      function knurledKnob(r = 0.14, h = 0.12) {
        const g = new THREE.Group();
        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(r, r * 1.04, h, 40),
          M.blackMetal,
        );
        body.position.y = h / 2;
        body.castShadow = true;
        g.add(body);
        const cap = new THREE.Mesh(
          new THREE.CylinderGeometry(r * 0.78, r * 0.78, 0.012, 32),
          M.steel,
        );
        cap.position.y = h + 0.005;
        g.add(cap);
        for (let i = 0; i < 24; i++) {
          // knurling ribs
          const rib = new THREE.Mesh(
            new THREE.BoxGeometry(0.012, h * 0.8, 0.014),
            M.blackPlastic,
          );
          const a = (i / 24) * Math.PI * 2;
          rib.position.set(Math.cos(a) * r, h / 2, Math.sin(a) * r);
          rib.rotation.y = -a;
          g.add(rib);
        }
        const skirt = new THREE.Mesh(
          new THREE.CylinderGeometry(r * 1.16, r * 1.22, 0.018, 40),
          M.steel,
        );
        skirt.position.y = 0.009;
        g.add(skirt);
        const mark = new THREE.Mesh(
          new THREE.BoxGeometry(0.014, 0.008, r * 0.55),
          new THREE.MeshStandardMaterial({
            color: "#e8ddc4",
            roughness: 0.4,
            emissive: "#7a6a48",
            emissiveIntensity: 0.25,
          }),
        );
        mark.position.set(0, h + 0.012, -r * 0.42);
        g.add(mark);
        return g;
      }
      const volKnob = knurledKnob();
      volKnob.position.set(1.28, 0, 0.98);
      player.add(volKnob);
      const toneKnob = knurledKnob();
      toneKnob.position.set(1.92, 0, 0.98);
      player.add(toneKnob);

      /* start/stop push button + LED in a chrome bezel */
      const startBtn = new THREE.Group();
      startBtn.position.set(1.94, 0, 0.3);
      player.add(startBtn);
      {
        const collar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.095, 0.1, 0.03, 32),
          M.steel,
        );
        collar.position.y = 0.015;
        startBtn.add(collar);
        const cap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.072, 0.078, 0.075, 32),
          M.blackGloss,
        );
        cap.position.y = 0.062;
        cap.castShadow = true;
        cap.name = "startCap";
        startBtn.add(cap);
      }
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 14, 14),
        new THREE.MeshStandardMaterial({
          color: "#3a2408",
          emissive: "#ff9a2a",
          emissiveIntensity: 0,
          roughness: 0.3,
        }),
      );
      led.position.set(1.94, 0.012, 0.7);
      led.scale.y = 0.5;
      player.add(led);
      {
        const bezel = new THREE.Mesh(
          new THREE.TorusGeometry(0.026, 0.007, 8, 20),
          M.chrome,
        );
        bezel.rotation.x = Math.PI / 2;
        bezel.position.set(1.94, 0.008, 0.7);
        player.add(bezel);
      }

      /* speed selector knob (front-left) */
      const speedKnob = new THREE.Group();
      speedKnob.position.set(-1.58, 0, 1.1);
      player.add(speedKnob);
      {
        const skirt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.115, 0.125, 0.016, 32),
          M.steel,
        );
        skirt.position.y = 0.008;
        speedKnob.add(skirt);
        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(0.085, 0.095, 0.11, 32),
          M.alu,
        );
        body.position.y = 0.055;
        body.castShadow = true;
        speedKnob.add(body);
        const mark = new THREE.Mesh(
          new THREE.BoxGeometry(0.012, 0.006, 0.07),
          M.blackMetal,
        );
        mark.position.set(0, 0.113, -0.035);
        speedKnob.add(mark);
      }

      /* silk-screened deck lettering (planes flush with the wood) */
      function deckPrint(canvasEl, w, x, z, opts = {}) {
        const t = ctex(canvasEl);
        const h = (w * canvasEl.height) / canvasEl.width;
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(w, h),
          new THREE.MeshBasicMaterial({
            map: t,
            transparent: true,
            depthWrite: false,
            opacity: opts.opacity ?? 1,
          }),
        );
        m.rotation.x = -Math.PI / 2;
        m.position.set(x, 0.003, z);
        player.add(m);
        return m;
      }
      deckPrint(texDeckPrint("VOLUME", ["MIN", "MAX"]), 0.62, 1.28, 0.93);
      deckPrint(texDeckPrint("TONE", ["LO", "HI"]), 0.62, 1.92, 0.93);
      deckPrint(
        texDeckPrint("START / STOP", null, 640, 160),
        0.56,
        1.94,
        0.555,
      );
      {
        // 33 · 45 marks beside the speed knob
        const c = cnv(160, 220),
          x = c.getContext("2d");
        x.fillStyle = "rgba(240,228,205,.92)";
        x.textAlign = "center";
        x.font = "600 52px Inter, sans-serif";
        x.fillText("33", 80, 72);
        x.fillText("45", 80, 168);
        deckPrint(c, 0.14, -1.86, 1.1);
      }
      /* brass plaque on the front face */
      {
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(1.5, 0.44),
          new THREE.MeshStandardMaterial({
            map: ctex(texPlaque()),
            roughness: 0.5,
            metalness: 0.35,
          }),
        );
        m.position.set(0.12, -0.255, 1.684);
        player.add(m);
      }
      /* tiny corner screws on the deck */
      [
        [-2.2, -1.5],
        [2.2, -1.5],
        [-2.2, 1.5],
        [2.2, 1.5],
      ].forEach(([sx, sz]) => {
        const s = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, 0.01, 12),
          M.steel,
        );
        s.position.set(sx, 0.004, sz);
        player.add(s);
      });


  return { renderer, scene, camera, camHome, player, spin, recordGroup,
    labelMat, armYaw, armLift, cueLever, volKnob, toneKnob, speedKnob, startBtn, led,
    restYaw: YAW_REST, playYaw: YAW_OUTER, liftUp: LIFT_UP, liftDown: LIFT_DOWN,
    dispose() {
      const geometries = new Set(), materials = new Set(), textures = new Set();
      scene.traverse((object) => {
        if (!object.isMesh) return;
        geometries.add(object.geometry);
        for (const material of (Array.isArray(object.material) ? object.material : [object.material])) {
          materials.add(material);
          for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      environmentTarget?.dispose();
      key.shadow.dispose();
      renderer.dispose();
    }
  };
}
