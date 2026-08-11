document.addEventListener('DOMContentLoaded', () => {
    const yearContainers = document.querySelectorAll('.year-3d-canvas');
    if (yearContainers.length === 0 || typeof THREE === 'undefined') return;

    function createTextureAtlas() {
        const chars = ['█', '═', '╗', '╝', '╚', '╔', '║', '0', '1', '&', '*', '#', '$', '@', '%', 'X'];
        const atlasWidth = 1024;
        const atlasHeight = 64;
        const canvas = document.createElement('canvas');
        canvas.width = atlasWidth;
        canvas.height = atlasHeight;
        const ctx = canvas.getContext('2d');

        ctx.globalCompositeOperation = 'screen';
        ctx.font = 'bold 48px "mononoki", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        chars.forEach((char, index) => {
            const x = index * 64 + 32;
            ctx.fillStyle = 'white';
            ctx.fillText(char, x, 32);
        });

        const texture = new THREE.CanvasTexture(canvas);
        return { texture, chars };
    }

    const { texture: atlasTexture } = createTextureAtlas();

    const charIndices = {
        '█': 0, '═': 1, '╗': 2, '╝': 3, '╚': 4, '╔': 5, '║': 6
    };
    const yearAscii = {
        "2011": [
            " ███    ███               ",
            "    █  █   █      █      █",
            "    █  █   █      █      █",
            " ███                      ",
            "█      █   █      █      █",
            "█      █   █      █      █",
            " ███    ███               "
        ],
        "2020": [
            " ███    ███    ███    ███ ",
            "    █  █   █      █  █   █",
            "    █  █   █      █  █   █",
            " ███           ███        ",
            "█      █   █  █      █   █",
            "█      █   █  █      █   █",
            " ███    ███    ███    ███ "
        ],
        "2022": [
            " ███    ███    ███    ███ ",
            "    █  █   █      █      █",
            "    █  █   █      █      █",
            " ███           ███    ███ ",
            "█      █   █  █      █    ",
            "█      █   █  █      █    ",
            " ███    ███    ███    ███ "
        ],
        "2024": [
            " ███    ███    ███   █   █",
            "    █  █   █      █  █   █",
            "    █  █   █      █  █   █",
            " ███           ███    ███ ",
            "█      █   █  █          █ ",
            "█      █   █  █          █ ",
            " ███    ███    ███       █"
        ],
        "2026": [
            " ███    ███    ███    ███ ",
            "    █  █   █      █  █    ",
            "    █  █   █      █  █    ",
            " ███           ███    ███ ",
            "█      █   █  █      █   █",
            "█      █   █  █      █   █",
            " ███    ███    ███    ███ "
        ]
    };

    const yearOutlines = { "2011": [" ███    ███    ███    ███ ", "█   █  █   █  █   █  █   █", "█   █  █   █  █   █  █   █", " ███    ███    ███    ███ ", "█   █  █   █  █   █  █   █", "█   █  █   █  █   █  █   █", " ███    ███    ███    ███ "], "2020": [" ███    ███    ███    ███ ", "█   █  █   █  █   █  █   █", "█   █  █   █  █   █  █   █", " ███    ███    ███    ███ ", "█   █  █   █  █   █  █   █", "█   █  █   █  █   █  █   █", " ███    ███    ███    ███ "], "2022": [" ███    ███    ███    ███ ", "█   █  █   █  █   █  █   █", "█   █  █   █  █   █  █   █", " ███    ███    ███    ███ ", "█   █  █   █  █   █  █   █", "█   █  █   █  █   █  █   █", " ███    ███    ███    ███ "], "2024": [" ███    ███    ███    ███ ", "█   █  █   █  █   █  █   █", "█   █  █   █  █   █  █   █", " ███    ███    ███    ███ ", "█   █  █   █  █   █  █   █", "█   █  █   █  █   █  █   █", " ███    ███    ███    ███ "], "2026": [" ███    ███    ███    ███ ", "█   █  █   █  █   █  █   █", "█   █  █   █  █   █  █   █", " ███    ███    ███    ███ ", "█   █  █   █  █   █  █   █", "█   █  █   █  █   █  █   █", " ███    ███    ███    ███ "] };

    // The drum was sized purely for desktop (a 600×240 box holding an 800×400 render
    // that intentionally bleeds outside it). On a phone that's wider than the whole
    // screen, so scale every dimension together. Derived from the actual viewport so
    // the digits shrink on small phones instead of using one hardcoded mobile size.
    function getDrumScale() {
        if (window.innerWidth > 768) return 1;
        // Fit the 600px-wide box into ~78% of the screen, and never let the drum eat
        // more than ~15% of screen height (the career text below it needs the room).
        const byWidth = (window.innerWidth * 0.78) / 600;
        const byHeight = (window.innerHeight * 0.15) / 240;
        return Math.max(0.22, Math.min(byWidth, byHeight));
    }

    function createVolumetricAscii(text) {
        const positions = [];
        const colors = [];
        const indicesArr = [];
        let baseR = 74 / 255, baseG = 222 / 255, baseB = 128 / 255;
        let shaderLogic = ``;
        let highlightColor = `vec3(0.8, 1.0, 0.8)`;


        // No shader logic needed for the simple LED effect
        shaderLogic = '';
        const lines = yearAscii[text] || yearAscii["2026"];

        const gridW = lines[0].length;
        const gridH = lines.length;

        // Slightly increased spacing to create visible gaps between characters
        const spacingX = 14.0;
        const spacingY = 24.0;
        // Each lit cell is drawn several times at increasing depth for a volumetric look.
        // Perspective pulls those deeper copies sideways, which at desktop size reads as
        // thickness — but on a phone the offset copies land in the empty cells next to a
        // segment and effectively draw strokes that aren't in the digit (a 6 grows an
        // upper-right stem and reads as 8). Flat single layer on mobile keeps digits honest.
        const layers = window.innerWidth > 768 ? 5 : 1;

        for (let y = 0; y < gridH; y++) {
            for (let x = 0; x < lines[y].length; x++) {
                const char = lines[y][x];
                if (char === ' ') continue;



                const cIndex = charIndices[char] !== undefined ? charIndices[char] : 0;

                const baseX = (x - gridW / 2) * spacingX;
                const baseY = -(y - gridH / 2) * spacingY;

                for (let i = 0; i < layers; i++) {
                    let pZ = -i * 10.0; // Spaced out further

                    // Add volumetric noise so it's not a flat plane
                    if (i > 0) {
                        pZ += (Math.random() - 0.5) * 8.0;
                    }


                    positions.push(baseX, baseY, pZ);


                    // Front layer is solid, inner layers are holographic matrix code
                    const finalCIndex = cIndex;
                    indicesArr.push(finalCIndex);

                    // Use dynamic year color
                    const fade = i === 0 ? 1.0 : Math.pow(1 - (i / layers), 1.5) * 0.6; // Inner layers are dimmer
                    colors.push(baseR * fade, baseG * fade, baseB * fade);
                }
            }
        }



        // Add deep background outline layer.
        // This draws a full "8888" (every segment lit) behind the real digits as a depth
        // cue. At desktop size it reads as a faint ghost, but on a phone the digits are
        // small enough that the ghost merges with them and every year ends up looking
        // like the same number — so skip it entirely on mobile.
        const outlineLines = window.innerWidth > 768 ? (yearOutlines[text] || yearOutlines["2026"]) : [];
        for (let y = 0; y < outlineLines.length; y++) {
            for (let x = 0; x < outlineLines[y].length; x++) {
                const char = outlineLines[y][x];
                if (char === ' ') continue;

                const cIndex = charIndices[char] !== undefined ? charIndices[char] : 0;

                const baseX = (x - gridW / 2) * spacingX;
                const baseY = -(y - gridH / 2) * spacingY;

                const pZ = -layers * 6.0 - 15.0; // Place behind all volumetric layers


                positions.push(baseX, baseY, pZ);

                indicesArr.push(cIndex);

                // Dim outline color so it sits cleanly in the background
                colors.push(baseR * 0.15, baseG * 0.15, baseB * 0.15);
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('charIndex', new THREE.Float32BufferAttribute(indicesArr, 1));

        return { geometry, shaderLogic, highlightColor };
    }

    const scenes = [];

    const drumScale = getDrumScale();

    // gl_PointSize is in raw framebuffer pixels, so it does NOT shrink along with a
    // smaller renderer — at mobile size the 32px blocks stayed huge relative to the
    // digit grid, overlapped, and smeared every year into an unreadable blob.
    // Tie it to the framebuffer height so density matches the desktop look at any size.
    function pointScaleFor(height, pixelRatio) {
        const base = (height * pixelRatio) / 400;
        // The atlas glyph only covers part of the point quad, so blocks never quite touch.
        // At desktop size that gap reads as deliberate LED segmentation; shrunk to a phone
        // it breaks each digit into disconnected pieces. Fatten the blocks a little there.
        return window.innerWidth > 768 ? base : base * 1.25;
    }

    // .year-3d-item centers itself with margins hardcoded to half of the desktop 600×240
    // box, so the box has to be resized alongside the canvas or the scaled-down digits
    // drift off-center. Keep both in sync from here, where the scale is known.
    function applyDrumSizing(container, scale) {
        const boxW = 600 * scale;
        const boxH = 240 * scale;

        container.style.width = boxW + 'px';
        container.style.height = boxH + 'px';

        const item = container.parentElement;
        if (item && item.classList.contains('year-3d-item')) {
            item.style.width = boxW + 'px';
            item.style.marginLeft = (-boxW / 2) + 'px';
            item.style.marginTop = (-boxH / 2) + 'px';
        }
    }

    yearContainers.forEach(container => {
        const text = container.getAttribute('data-year-text');

        applyDrumSizing(container, drumScale);
        container.style.position = 'relative';
        container.style.overflow = 'visible';
        container.style.pointerEvents = 'none';

        const scene = new THREE.Scene();

        const w = 800 * drumScale;
        const h = 400 * drumScale;
        const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
        camera.position.z = 400;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const canvasEl = renderer.domElement;
        canvasEl.style.position = 'absolute';
        canvasEl.style.left = '50%';
        canvasEl.style.top = '50%';
        canvasEl.style.transform = 'translate(-50%, -50%)';

        container.appendChild(canvasEl);

        const { geometry, shaderLogic, highlightColor } = createVolumetricAscii(text);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uDiff: { value: 0 },
                uAtlas: { value: atlasTexture },
                uPointScale: { value: pointScaleFor(h, Math.min(window.devicePixelRatio, 2)) }
            },
            vertexShader: `
                uniform float uTime;
                uniform float uDiff;
                uniform float uPointScale;
                attribute float charIndex;
                attribute vec3 color;
                
                varying vec3 vColor;
                varying float vCharIndex;
                varying float vShouldDiscard;
                varying float vHighlight;
                
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                void main() {
                    vColor = color;
                    
                    float finalIndex = charIndex;
                    float shouldDiscard = 0.0;
                    float highlight = 0.0;
                    
                    if (uDiff > 0.02) {
                        ${shaderLogic}
                    }
                    
                    vCharIndex = finalIndex;
                    vShouldDiscard = shouldDiscard;
                    vHighlight = highlight;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = 32.0 * uPointScale * (400.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D uAtlas;
                
                varying vec3 vColor;
                varying float vCharIndex;
                varying float vShouldDiscard;
                varying float vHighlight;

                void main() {
                    if (vShouldDiscard > 0.5) discard;
                    
                    float totalChars = 16.0;
                    
                    vec2 uv = gl_PointCoord;
                    uv.x = (uv.x + vCharIndex) / totalChars;
                    uv.y = 1.0 - uv.y;
                    
                    float g = texture2D(uAtlas, uv).r;
                    if (g < 0.2) discard;
                    
                    vec3 finalColor = mix(vColor, ${highlightColor}, vHighlight);
                    
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `,
            transparent: true,
            depthWrite: true,
            blending: THREE.NormalBlending
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        scenes.push({
            container,
            scene,
            camera,
            renderer,
            particles: particles,
            isVisible: false
        });

        window.addEventListener('resize', () => {
            const scale = getDrumScale();
            const width = 800 * scale;
            const height = 400 * scale;
            applyDrumSizing(container, scale);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            material.uniforms.uPointScale.value = pointScaleFor(height, Math.min(window.devicePixelRatio, 2));
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sceneObj = scenes.find(s => s.container === entry.target);
            if (sceneObj) {
                sceneObj.isVisible = entry.isIntersecting;
            }
        });
    }, { threshold: 0.1 });

    scenes.forEach(s => observer.observe(s.container));

    // Read mouse coordinates from window.globalMouseX/Y set in script.js

    // --- Device tilt (mobile substitute for mouse parallax) ---
    // Note: iOS 13+ only delivers deviceorientation after an explicit permission prompt
    // triggered by a user gesture. We deliberately don't prompt, so this simply stays
    // inert there and the digits keep their idle wobble.
    const tilt = { x: 0, y: 0, active: false };

    if (window.innerWidth <= 768 && window.DeviceOrientationEvent) {
        // beta (front-back) sits at whatever angle the phone is being held at, so the
        // first reading becomes the neutral baseline and we track deviation from it.
        let betaBaseline = null;

        window.addEventListener('deviceorientation', (e) => {
            if (e.gamma === null || e.beta === null) return;
            if (betaBaseline === null) betaBaseline = e.beta;

            const clampNorm = (deg, range) => Math.max(-1, Math.min(1, deg / range));
            // Negated so the digits lean against the tilt rather than with it.
            tilt.y = -clampNorm(e.gamma, 35);
            tilt.x = -clampNorm(e.beta - betaBaseline, 35);
            tilt.active = true;
        });
    }

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        scenes.forEach(s => {
            if (s.isVisible) {
                const parentEl = s.container.parentElement;
                const diff = parseFloat(parentEl.getAttribute('data-diff') || 0);

                s.particles.material.uniforms.uTime.value = clock.elapsedTime;
                s.particles.material.uniforms.uDiff.value = diff;

                let targetRotationY, targetRotationX;

                if (tilt.active) {
                    targetRotationY = tilt.y * 0.6;
                    targetRotationX = tilt.x * 0.6;
                } else {
                    const rect = s.container.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    const normX = ((window.globalMouseX || window.innerWidth / 2) - centerX) / window.innerWidth;
                    const normY = ((window.globalMouseY || window.innerHeight / 2) - centerY) / window.innerHeight;

                    targetRotationY = normX * 0.6;
                    targetRotationX = normY * 0.6;
                }

                s.particles.rotation.y += (targetRotationY - s.particles.rotation.y) * 0.05;
                const wobble = Math.sin(clock.elapsedTime * 0.5) * 0.05;
                s.particles.rotation.x += (targetRotationX + wobble - s.particles.rotation.x) * 0.05;

                s.renderer.render(s.scene, s.camera);
            }
        });
    }

    animate();
});

