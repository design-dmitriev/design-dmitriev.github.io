/* ==========================================================================
   3D WIREFRAME ИКОНКИ В БЛОКЕ «ВЫПОЛНЕННЫЕ_КЕЙСЫ»
   --------------------------------------------------------------------------
   Сами модели живут в case-icon-models.js — общей библиотеке, которую делят
   боевой сайт и страница выбора icons-preview.html. Здесь только монтаж:
   рендереры, общая петля анимации и правила экономии ресурсов.

   Только десктоп. На мобиле остаются пиксельные значки из GLYPH_MAPS
   (script.js): три дополнительных WebGL-контекста поверх пяти у барабана
   годов и одного у героя — заметная нагрузка на телефон ради декора.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const holders = document.querySelectorAll('.row-icon[data-icon3d]');
    if (!holders.length) return;
    if (window.innerWidth <= 768) return;
    if (typeof THREE === 'undefined') return;
    if (!window.CaseIconModels) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Основной зелёный сайта (--hero-accent), чтобы иконки не выпадали из палитры.
    const WIRE_COLOR = 0x60b756;

    const scenes = [];

    holders.forEach(holder => {
        const build = window.CaseIconModels[holder.dataset.icon3d];
        if (!build) return;

        // Пиксельный значок (renderGlyphs из script.js) уже мог отрисоваться —
        // на десктопе заменяем его 3D-сценой, разметка остаётся общей.
        holder.innerHTML = '';

        const size = holder.clientWidth || 104;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(size, size);
        renderer.domElement.style.display = 'block';
        holder.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(0, 0, 5.4);

        const material = new THREE.LineBasicMaterial({
            color: WIRE_COLOR,
            transparent: true,
            opacity: 0.85
        });

        const model = build(material);
        // Рамка (.row-icon) остаётся 104px — крупнее становится сама модель
        // внутри неё. Запаса по кадру хватает: самая широкая модель занимает
        // ~3.3 юнита при видимых ~3.7.
        model.scale.setScalar(1.2);
        scene.add(model);

        scenes.push({ renderer, scene, camera, model });
    });

    if (!scenes.length) return;

    // Одна общая rAF-петля на все иконки вместо трёх независимых, и она
    // засыпает, когда секция за пределами экрана — вращать невидимое незачем.
    let visible = true;
    const section = document.getElementById('selected-works');
    if (section && 'IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            visible = entries[0].isIntersecting;
        }, { rootMargin: '120px' }).observe(section);
    }

    let last = performance.now();
    function tick(now) {
        requestAnimationFrame(tick);
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        if (!visible) return;

        scenes.forEach(({ renderer, scene, camera, model }, i) => {
            if (!reduceMotion) {
                model.rotation.y += dt * 0.55;
                // Лёгкое покачивание по X поверх постоянного наклона модели —
                // объект не выглядит как плоская картинка на одной оси.
                model.rotation.x = (model.userData.baseRotX || 0) + Math.sin((now / 1000) * 0.5 + i) * 0.18;
                if (model.userData.float) {
                    model.position.y = Math.sin((now / 1000) * 0.9) * 0.09;
                }
                // Кольца врат и удержания крутятся отдельно от корпуса.
                if (model.userData.spin) {
                    model.userData.spin.forEach((node, k) => {
                        node.rotation.z += dt * (k % 2 === 0 ? 0.9 : -0.7);
                    });
                }
            }
            renderer.render(scene, camera);
        });
    }
    requestAnimationFrame(tick);
});
