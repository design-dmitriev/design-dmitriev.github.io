document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-3d-model');
    if (!container || typeof THREE === 'undefined') return;

    // --- 1. Initialize Three.js Scene ---
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, (container.clientWidth || 600) / (container.clientHeight || 600), 0.1, 1000);
    camera.position.z = 290;

    // Renderer setup (transparent background)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth || 600, container.clientHeight || 600);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.style.cursor = 'grab';
    container.appendChild(renderer.domElement);

    // --- 2. Create Volumetric Particle System ---
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const initialPositions = []; // for animation

    // Theme color: Just WHITE
    const baseColor = new THREE.Color(0xffffff); 

    // Mathematical definition of the volumetric shapes
    function isInsideStar(x, y, z) {
        const p = 0.6; // curve sharpness
        
        // Main 4-pointed star (horizontal/vertical)
        const R1 = 140;
        const H1 = 30; // max depth
        const prof1 = Math.pow(Math.abs(x), p) + Math.pow(Math.abs(y), p);
        const maxP1 = Math.pow(R1, p);
        
        // Secondary 4-pointed star (diagonals)
        const R2 = 70;
        const H2 = 15;
        // Rotate coords by 45 degrees
        const x45 = (x + y) * 0.7071;
        const y45 = (x - y) * 0.7071;
        const prof2 = Math.pow(Math.abs(x45), p) + Math.pow(Math.abs(y45), p);
        const maxP2 = Math.pow(R2, p);
        
        if (prof1 > maxP1 && prof2 > maxP2) return false;
        
        // Z boundary (bevel)
        let maxZ1 = 0, maxZ2 = 0;
        if (prof1 <= maxP1) maxZ1 = H1 * Math.pow(1 - prof1 / maxP1, 1.2); 
        if (prof2 <= maxP2) maxZ2 = H2 * Math.pow(1 - prof2 / maxP2, 1.2); 
        
        const maxZ = Math.max(maxZ1, maxZ2);
        return Math.abs(z) <= maxZ;
    }

    function isInsideCrescent(x, y, z) {
        const H_cres = 12; // half-thickness
        
        // Outer circle (centered)
        const r_out = 125;
        const d_out = Math.sqrt(x*x + y*y);
        
        // Inner circle (shifted TOP-RIGHT so crescent forms at BOTTOM-LEFT)
        const cx_in = 22;
        const cy_in = 22;
        const r_in = 135;
        const d_in = Math.sqrt(Math.pow(x - cx_in, 2) + Math.pow(y - cy_in, 2));
        
        if (d_out <= r_out && d_in >= r_in) {
            // Provide a soft Z-profile based on distance to center
            const maxZ = H_cres; 
            return Math.abs(z) <= maxZ; 
        }
        return false;
    }

    // Rejection sampling to fill the volume with particles
    const totalParticles = 15000;
    let attempts = 0;
    
    while (positions.length / 3 < totalParticles && attempts < 800000) {
        attempts++;
        // Random point in bounding box
        const x = (Math.random() - 0.5) * 300;
        const y = (Math.random() - 0.5) * 300;
        const z = (Math.random() - 0.5) * 80;
        
        if (isInsideStar(x, y, z) || isInsideCrescent(x, y, z)) {
            positions.push(x, y, z);
            initialPositions.push(x, y, z);
            
            // Exaggerated volumetric shading based on Z depth
            const color = baseColor.clone();
            // Z is approx -40 to 40. We map back (-40) to dark, front (40) to bright.
            const normalizedZ = (z + 40) / 80;
            // Increased max brightness by ~10% (1.0 instead of 0.9)
            const shade = 0.1 + 1.0 * Math.max(0, Math.min(1, normalizedZ)); // Deep volume effect
            color.multiplyScalar(shade);
            colors.push(color.r, color.g, color.b);
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('initialPosition', new THREE.Float32BufferAttribute(initialPositions, 3));

    // Create a soft blurred circle texture with baked Chromatic Aberration
    function createSoftParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Additive blending for RGB channels
        ctx.globalCompositeOperation = 'screen';
        
        // Red channel (shifted slightly left)
        const gR = ctx.createRadialGradient(29, 32, 0, 29, 32, 32);
        gR.addColorStop(0, 'rgba(255, 0, 0, 1)');
        gR.addColorStop(0.3, 'rgba(255, 0, 0, 0.6)');
        gR.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gR;
        ctx.fillRect(0, 0, 64, 64);
        
        // Green channel (centered)
        const gG = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gG.addColorStop(0, 'rgba(0, 255, 0, 1)');
        gG.addColorStop(0.3, 'rgba(0, 255, 0, 0.6)');
        gG.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gG;
        ctx.fillRect(0, 0, 64, 64);
        
        // Blue channel (shifted slightly right)
        const gB = ctx.createRadialGradient(35, 32, 0, 35, 32, 32);
        gB.addColorStop(0, 'rgba(0, 0, 255, 1)');
        gB.addColorStop(0.3, 'rgba(0, 0, 255, 0.6)');
        gB.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gB;
        ctx.fillRect(0, 0, 64, 64);
        
        return new THREE.CanvasTexture(canvas);
    }

    const softTexture = createSoftParticleTexture();

    // Particle material
    const material = new THREE.PointsMaterial({
        size: 4.5, // Slightly larger to show the chromatic aberration clearly
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        map: softTexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    particles.scale.set(0.8, 0.8, 0.8); // Scaled to 0.8
    scene.add(particles);

    // --- 3. Animation & Interaction ---
    let targetRotationX = 0;
    let targetRotationY = -0.2; // Slightly rotated like a logo
    let autoRotateSpeed = 0.001; 
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        container.style.cursor = 'grabbing';
        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            targetRotationY += e.movementX * 0.005;
            targetRotationX += e.movementY * 0.005;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, {passive: true});

    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const deltaX = e.touches[0].clientX - previousMousePosition.x;
            const deltaY = e.touches[0].clientY - previousMousePosition.y;
            targetRotationY += deltaX * 0.005;
            targetRotationX += deltaY * 0.005;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }, {passive: true});

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    const clock = new THREE.Clock();

    // Раньше эта сцена крутилась бесконечно, даже когда герой давно
    // проскроллен мимо — единственный из трёх WebGL-блоков сайта без такой
    // защиты (у барабана годов и у 3D-иконок кейсов пауза за кадром уже была).
    // Тот же приём: IntersectionObserver выключает рендер, rAF продолжает
    // тикать вхолостую — это дёшево, а переинициализировать сцену не надо.
    // По умолчанию «видим»: герой — самый первый экран сайта, безопаснее
    // отрисовать один лишний кадр, чем рискнуть пустым канвасом, если
    // наблюдатель ещё не успел сработать.
    let isVisible = true;
    if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
        }, { threshold: 0.01 }).observe(container);
    }

    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;

        const time = clock.getElapsedTime();

        if (!isDragging) {
            targetRotationY += autoRotateSpeed;
        }

        particles.rotation.y += (targetRotationY - particles.rotation.y) * 0.1;
        particles.rotation.x += (targetRotationX - particles.rotation.x) * 0.1;

        renderer.render(scene, camera);
    }

    animate();

    // --- 4. Handle Resize ---
    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = (container.clientWidth || 600) / (container.clientHeight || 600);
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth || 600, container.clientHeight || 600);
    });
});
