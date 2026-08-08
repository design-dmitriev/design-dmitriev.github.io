/* ==========================================================================
   PRELOADER LOGIC
   ========================================================================== */
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

(function () {
    let progress = 0;
    let preloaderInterval;

    // We wait for DOMContentLoaded to access DOM elements reliably
    document.addEventListener('DOMContentLoaded', () => {
        // Instantly hide elements that will be animated by GSAP later to prevent flashing
        const elementsToHide = document.querySelectorAll(`
            .hero-meta, .initial-contact-btn,
            main.content-area h2,
            main.content-area h3,
            main.content-area p,
            main.content-area .section-label,
            main.content-area .project-type,
            main.content-area .mod-id,
            main.content-area .mod-title,
            footer.sys-footer .contact-title,
            footer.sys-footer .label,
            footer.sys-footer .log-line,
            footer.sys-footer .blog-container
        `);
        elementsToHide.forEach(el => {
            if (el.closest('.mod-list-bleed') && el.id === 'dynamic-mods-container') return;
            if (el.closest('.career-text-blocks')) return;
            el.style.opacity = '0';
        });

        const progressFill = document.getElementById('preloader-progress-fill');
        const percentageText = document.getElementById('preloader-percentage');
        const currentTask = document.getElementById('preloader-current-task');
        const preloader = document.getElementById('sys-preloader');

        if (!preloader) return;

        const tasks = [
            "ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ...",
            "ЗАГРУЗКА МОДУЛЕЙ...",
            "УСТАНОВКА СОЕДИНЕНИЯ...",
            "СИНХРОНИЗАЦИЯ ДАННЫХ...",
            "СБОРКА ИНТЕРФЕЙСА...",
            "ИНИЦИАЛИЗАЦИЯ ВИДЕОПАМЯТИ...",
            "РАСШИФРОВКА АССЕТОВ..."
        ];

        preloaderInterval = setInterval(() => {
            let increment = progress > 80 ? 1 : Math.floor(Math.random() * 10) + 1;
            progress += increment;
            if (progress > 95) progress = 95;

            if (progressFill) progressFill.style.width = `${progress}%`;
            if (percentageText) percentageText.textContent = `${progress}%`;

            if (Math.random() > 0.7 && currentTask) {
                currentTask.textContent = tasks[Math.floor(Math.random() * tasks.length)];
            }
        }, 50);
    });

    window.addEventListener('load', () => {
        document.fonts.ready.then(() => {
            const progressFill = document.getElementById('preloader-progress-fill');
            const percentageText = document.getElementById('preloader-percentage');
            const currentTask = document.getElementById('preloader-current-task');
            const preloader = document.getElementById('sys-preloader');

            if (preloaderInterval) clearInterval(preloaderInterval);

            if (progressFill) progressFill.style.width = '100%';
            if (percentageText) percentageText.textContent = '100%';
            if (currentTask) currentTask.textContent = 'ЗАГРУЗКА ЗАВЕРШЕНА';

            setTimeout(() => {
                if (preloader) preloader.classList.add('loaded');
                setTimeout(() => {
                    if (preloader) preloader.style.display = 'none';
                    if (window.startInitialAnimations) window.startInitialAnimations();
                }, 800);
            }, 500);
        });
    });
})();

const translations = {
    ru: {
        sys_id: "СИСТ.ID:",
        status_online: "В СЕТИ",
        interface_mode: "РЕЖИМ РАБОТЫ:",
        mode_designer: "РАБОЧИЙ",
        mode_modder: "ХОББИ",
        sound_label: "ЗВУК:",
        sound_on: "ВКЛ",
        sound_off: "ВЫКЛ",
        author_name: "Алексей Дмитриев",

        hero_title_designer_1: "ЭСТЕТИКА",
        hero_title_designer_2: "ФУНКЦИЯ",
        hero_sub_designer: "От карточек товаров до управления отделом дизайна",

        label_selected_works: "// ИЗБРАННЫЕ_РАБОТЫ",
        label_about_me: "// ИНФОРМАЦИЯ",
        about_1_date: "01_СПЕЦИАЛИЗАЦИЯ",
        about_1_title: "Дизайн маркетплейсов",
        about_1_desc: "Создание премиальных карточек товаров и рич-контента с глубоким анализом конкурентов.",
        about_2_date: "02_НАВЫКИ",
        about_2_title: "UX/UI и Арт-дирекшн",
        about_2_desc: "Проектирование пользовательского опыта и управление визуальным стилем.",
        about_3_date: "03_ПОДХОД",
        about_3_title: "Эстетика + Функция",
        about_3_desc: "Каждый пиксель должен решать бизнес-задачу и выделять продукт среди остальных.",

        proj_type_ecommerce: "ЭЛЕКТРОННАЯ_КОММЕРЦИЯ",
        project_1_title: "Карточка товара",
        project_1_desc: "Аналитика, инфографика и премиальный визуальный стиль для маркетплейсов.",

        proj_type_rich: "RICH_CONTENT",
        project_rich_title: "Рич-контент",
        project_rich_desc: "Бесшовные визуальные истории (лендинги), полностью погружающие клиента в продукт.",

        proj_type_outdoor: "НАРУЖНАЯ_РЕКЛАМА",
        project_2_title: "Уличный баннер",
        project_2_desc: "Широкоформатная наружная реклама и живые фотографии.",

        label_career_path: "// КАРЬЕРНЫЙ_ПУТЬ",
        date_now: "СЕЙЧАС",
        career_1_title: "руководитель_отдела_дизайна",
        career_1_desc: "Управление процессами, контроль качества.",

        date_prev: "РАНЕЕ",
        career_2_title: "ведущий_графический_дизайнер",
        career_2_desc: "Широкоформатная печать, наружная реклама.",

        date_init: "СТАРТ",
        career_3_title: "дизайнер_карточек_товаров",
        career_3_desc: "Маркетплейсы, работа со светом и тенью.",

        hero_title_modder_1: "МУТАЦИЯ",
        hero_title_modder_2: "КОДА",
        hero_sub_modder: "Minecraft моддинг • Скромно и со вкусом",

        label_mod_archive: "// АРХИВ_МОДОВ",
        mod_1_title: "1_миллион_скачиваний",
        mod_1_desc: "Знаковое достижение, подтверждающее востребованность моих маленьких, но полезных модов.",
        mod_cf_desc: "Основная база моих небольших модов для Minecraft.",
        mod_mr_desc: "Современная и удобная платформа для публикации моих работ.",
        btn_view_repo: "СМОТРЕТЬ_ПРОФИЛЬ",

        label_communication: "// УСТАНОВЛЕНИЕ_СВЯЗИ",
        footer_title: "дайте_сигнал",

        contact_direct: "Прямая связь:",
        contact_phone: "Телефон / Max:",
        contact_email: "Почта (РФ):",
        email_value: "starlight.lnk@yandex.ru",
        modder_contact_desc: "Если есть идеи для модов или вопросы по сборкам — пишите напрямую в Telegram.",

        lbl_downloads: "Скачивания:",
        lbl_updated: "Обновлено:",

        sys_normal: "Система работает в штатном режиме.",
        sys_tg_blog: "Авторский блог:",
        mod_id_1: "ACHIEVEMENT",
        document_title: "СИСТ.ПОРТФОЛИО // STARLIGHT",
        lightbox_view: "// РЕЖИМ_ПРОСМОТРА",
        btn_cv_download: "ПОСМОТРЕТЬ CV",
        label_cv: "РЕЗЮМЕ:"
    },
    en: {
        sys_id: "SYS.ID:",
        status_online: "ONLINE",
        interface_mode: "INTERFACE_MODE:",
        mode_designer: "UX/UI_DESIGN",
        mode_modder: "MODDING",
        sound_label: "SOUND:",
        sound_on: "ON",
        sound_off: "OFF",
        author_name: "Alex Dmitriev",

        hero_title_designer_1: "AESTHETIC",
        hero_title_designer_2: "FUNCTION",
        hero_sub_designer: "From product cards to design department management",

        label_selected_works: "// SELECTED_WORKS",
        label_about_me: "// INFORMATION",
        about_1_date: "01_SPECIALIZATION",
        about_1_title: "Marketplace Design",
        about_1_desc: "Creating premium product cards and rich content with deep competitor analysis.",
        about_2_date: "02_SKILLS",
        about_2_title: "UX/UI & Art Direction",
        about_2_desc: "Designing user experience and managing visual style.",
        about_3_date: "03_APPROACH",
        about_3_title: "Aesthetics + Function",
        about_3_desc: "Every pixel must solve a business problem and make the product stand out.",

        proj_type_ecommerce: "E-COMMERCE",
        project_1_title: "Product card",
        project_1_desc: "Analytics, infographics, and premium visual styling for marketplaces.",

        proj_type_rich: "RICH_CONTENT",
        project_rich_title: "Rich content",
        project_rich_desc: "Seamless visual stories (landings) fully immersing the client in the product.",

        proj_type_outdoor: "OUTDOOR_AD",
        project_2_title: "Outdoor banner",
        project_2_desc: "Large-format outdoor advertising and live photography.",

        label_career_path: "// CAREER_PATH",
        date_now: "NOW",
        career_1_title: "head_of_design_department",
        career_1_desc: "Process management, quality control.",

        date_prev: "PREV",
        career_2_title: "lead_graphic_designer",
        career_2_desc: "Large format printing, outdoor advertising.",

        date_init: "INIT",
        career_3_title: "product_card_designer",
        career_3_desc: "Marketplaces, working with light and shadows.",

        hero_title_modder_1: "CODE",
        hero_title_modder_2: "MUTATION",
        hero_sub_modder: "Minecraft modding • Simple and modest",

        label_mod_archive: "// MOD_ARCHIVE",
        mod_1_title: "1_million_downloads",
        mod_1_desc: "A landmark achievement confirming the demand for my small but useful mods.",
        mod_cf_desc: "The main base for my small Minecraft mods.",
        mod_mr_desc: "A modern and convenient platform for publishing my work.",
        btn_view_repo: "VIEW_PROFILE",

        label_communication: "// ESTABLISH_COMMUNICATION",
        footer_title: "give_a_signal",

        contact_direct: "Direct contact:",
        contact_phone: "Phone / Max:",
        contact_email: "Email (Global):",
        email_value: "desing.starlight@gmail.com",
        modder_contact_desc: "If you have mod ideas or modpack questions — DM me on Telegram.",

        lbl_downloads: "Downloads:",
        lbl_updated: "Updated:",

        sys_normal: "System running normal.",
        sys_tg_blog: "Author blog:",
        mod_id_1: "ACHIEVEMENT",
        document_title: "SYS.PORTFOLIO // STARLIGHT",
        lightbox_view: "// VIEW_MODE",
        btn_cv_download: "VIEW CV",
        label_cv: "CV:"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

    // --- Initialize Lenis for Global Smooth Scrolling ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Reusable function to glitch ASCII text (preserves layout, scrambles characters line-by-line)
    function glitchAsciiElement(word, speedMultiplier = 1, onCompleteCb = null) {
        if (typeof speedMultiplier === 'function') {
            onCompleteCb = speedMultiplier;
            speedMultiplier = 1;
        }

        if (word.dataset.isGlitching) return;
        word.dataset.isGlitching = "true";
        word.style.visibility = "visible";

        const originalText = word.innerHTML;
        const rawText = word.textContent;

        // Let the element scale naturally to prevent 0px height collapse

        // Split into lines and wrap each in a span. Keep \n so <pre> maintains layout.
        // Initialize with opacity:0 to prevent the FOUC blink before GSAP takes over.
        word.innerHTML = rawText.split('\n').map(line => `<span style="opacity:0">${line}</span>`).join('\n');
        const spans = word.querySelectorAll('span');

        let maxDelay = 0;
        let completedLines = 0;
        const totalLines = Array.from(spans).filter(s => s.textContent.trim() !== '').length;

        if (totalLines === 0) {
            word.dataset.isGlitching = "";
            if (onCompleteCb) onCompleteCb();
            return;
        }

        spans.forEach((span, lineIndex) => {
            if (span.textContent.trim() === '') return; // Skip empty lines

            const lineOriginal = span.textContent;
            const animDelay = (0.1 + lineIndex * 0.05) * speedMultiplier;
            maxDelay = Math.max(maxDelay, animDelay);

            const duration = 0.8 * speedMultiplier;
            // 10 FPS retro monitor feel
            const steps = Math.max(4, Math.floor(duration * 10));

            gsap.fromTo(span,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: duration,
                    delay: animDelay,
                    ease: `steps(${steps})`, // Retro VDU stepping
                    onUpdate: function () {
                        const progress = this.ratio;
                        let scrambled = "";
                        const matrixChars = "01&*#$@%X";
                        const finalizedCount = Math.floor(progress * lineOriginal.length);

                        for (let i = 0; i < lineOriginal.length; i++) {
                            // Escape HTML characters to prevent breaking innerHTML
                            const origChar = lineOriginal[i] === '<' ? '&lt;' : (lineOriginal[i] === '>' ? '&gt;' : lineOriginal[i]);

                            if (i < finalizedCount) {
                                // Revealed characters (clean)
                                scrambled += origChar;
                            } else {
                                // Glitch static for EVERYTHING unrevealed (very dirty)
                                if (lineOriginal[i] === " ") {
                                    scrambled += " ";
                                } else {
                                    const mChar = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                                    // Make some glitch characters grey for the retro CRT flash effect
                                    const isGrey = Math.random() > 0.4;
                                    if (isGrey) {
                                        scrambled += `<span style="color: #666; opacity: 0.6; text-shadow: none;">${mChar}</span>`;
                                    } else {
                                        scrambled += mChar;
                                    }
                                }
                            }
                        }
                        span.innerHTML = scrambled;
                    },
                    onComplete: () => {
                        span.textContent = lineOriginal;
                        completedLines++;
                        if (completedLines === totalLines) {
                            // Cleanup
                            word.innerHTML = originalText;
                            word.dataset.isGlitching = "";
                            word.dataset.glitchComplete = "true";
                            if (onCompleteCb) onCompleteCb();
                        }
                    }
                }
            );
        });
    }

    // --- Initial Boot Animation (Hero Title) ---
    function animateHeroTitle(container) {
        const asciiWords = container.querySelectorAll('.ascii-word');
        asciiWords.forEach((word, index) => {
            setTimeout(() => {
                glitchAsciiElement(word);
            }, index * 300);
        });

        // Also animate the hero meta text (ScrambleText is safe here because it's a single line)
        const metaText = container.querySelector('.hero-meta');
        if (metaText) {
            const metaOriginal = metaText.innerText;
            gsap.fromTo(metaText,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.8,
                    delay: 1.0,
                    scrambleText: { text: metaOriginal, chars: "upperCase", speed: 1 },
                    ease: "power2.out"
                }
            );
        }

        // Animate the initial contact button smoothly as well
        const contactBtn = container.querySelector('.initial-contact-btn');
        if (contactBtn) {
            const btnOriginal = contactBtn.textContent;
            gsap.fromTo(contactBtn,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.8,
                    delay: 1.2,
                    scrambleText: { text: btnOriginal, chars: "upperCase", speed: 1 },
                    ease: "power2.out"
                }
            );
        }
    }

    // --- Matrix Hover Effect for ASCII Art ---
    function initMatrixHoverEffect(container) {
        const asciiWords = container.querySelectorAll('.matrix-hover-target');
        if (!asciiWords || asciiWords.length === 0) return;

        asciiWords.forEach(asciiWord => {
            // Wait until the glitch animation has fully completed
            const checkReady = setInterval(() => {
                if (asciiWord.dataset.glitchComplete === "true") {
                    clearInterval(checkReady);
                    setupMatrix(asciiWord);
                }
            }, 100);
        });

        function setupMatrix(el) {
            if (el.dataset.matrixSetup) return;
            el.dataset.matrixSetup = "true";

            const rawText = el.textContent;
            el.innerHTML = '';

            const chars = [];
            for (let i = 0; i < rawText.length; i++) {
                const char = rawText[i];
                if (char === '\n') {
                    el.appendChild(document.createTextNode('\n'));
                } else {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.dataset.orig = char;
                    // Prevent span from messing up line height or layout
                    span.style.display = 'inline-block';
                    el.appendChild(span);
                    if (char.trim() !== '') {
                        chars.push(span);
                    }
                }
            }

            const matrixChars = "01&*#$@%X<>[]{}";

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                // Get the computed color of the element to use for glow
                const glowColor = getComputedStyle(el).color;
                // Make the text color itself 10% brighter than the base color
                const brightColor = `color-mix(in srgb, ${glowColor}, white 10%)`;

                chars.forEach(span => {
                    const sRect = span.getBoundingClientRect();
                    const sx = (sRect.left - rect.left) + sRect.width / 2;
                    const sy = (sRect.top - rect.top) + sRect.height / 2;

                    const dist = Math.hypot(mouseX - sx, mouseY - sy);
                    const radius = 25; // 25px radius (very tight)

                    if (dist < radius) {
                        if (Math.random() < 0.2) {
                            span.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                        }

                        span.style.color = brightColor;
                        span.style.textShadow = `0 0 5px ${glowColor}, 0 0 10px ${glowColor}`;
                    } else {
                        if (span.textContent !== span.dataset.orig) {
                            span.textContent = span.dataset.orig;
                        }
                        span.style.color = '';
                        span.style.textShadow = '';
                    }
                });
            });

            el.addEventListener('mouseleave', () => {
                chars.forEach(span => {
                    span.textContent = span.dataset.orig;
                    span.style.color = '';
                    span.style.textShadow = '';
                });
            });
        }
    }

    let textAnimInstances = [];
    let textScrollTriggers = [];

    window.cleanupTextAnimations = function () {
        textScrollTriggers.forEach(st => st.kill());
        textScrollTriggers = [];
        textAnimInstances.forEach(instance => instance.revert());
        textAnimInstances = [];
    };

    window.initScrollTextAnimations = function () {
        if (typeof SplitType === 'undefined') return;

        window.cleanupTextAnimations();

        const elementsToAnimate = document.querySelectorAll(`
            main.content-area h2:not(.giant-name):not(.mod-title), 
            main.content-area h3:not(.card-role), 
            main.content-area p:not(.career-text-blocks p), 
            main.content-area .section-label,
            main.content-area .project-type,
            main.content-area .mod-id,
            main.content-area .mod-title,
            footer.sys-footer .contact-title,
            footer.sys-footer .label,
            footer.sys-footer .log-line
        `);

        elementsToAnimate.forEach(el => {
            // Ignore elements inside dynamic mod lists to avoid breaking them
            if (el.closest('.mod-list-bleed') && el.id === 'dynamic-mods-container') return;
            // Ignore career text blocks to avoid breaking the 3D scroll animation
            if (el.closest('.career-text-blocks')) return;
            // Ignore empty elements
            if (!el.textContent.trim()) return;

            const splitText = new SplitType(el, { types: 'lines', lineClass: 'split-line' });
            textAnimInstances.push(splitText);

            if (splitText.lines && splitText.lines.length > 0) {
                // Store raw text for scroll rendering
                splitText.lines.forEach(line => {
                    gsap.set(line, { opacity: 0 });
                });

                // Clear the parent's opacity so the animated lines become visible
                el.style.opacity = '';

                const st = ScrollTrigger.create({
                    trigger: el,
                    start: "top 90%",
                    animation: gsap.to(splitText.lines, {
                        opacity: 1,
                        duration: 1.2,
                        scrambleText: { text: "{original}", chars: "upperCase", speed: 0.7, revealDelay: 0.2 },
                        stagger: 0.15,
                        ease: "power3.out"
                    }),
                    toggleActions: "play none none none"
                });
                textScrollTriggers.push(st);
            }
        });

        // Animate blog-container separately (simple fade-in, no SplitType — it breaks SVG icons)
        document.querySelectorAll('footer.sys-footer .blog-container').forEach(bc => {
            gsap.set(bc, { opacity: 0 });
            const st = ScrollTrigger.create({
                trigger: bc,
                start: "top 90%",
                animation: gsap.to(bc, {
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out"
                }),
                toggleActions: "play none none none"
            });
            textScrollTriggers.push(st);
        });
    };

    // Call it when preloader finishes
    window.startInitialAnimations = function () {
        const activeSection = document.querySelector('.view-section.active');
        if (activeSection) {
            animateHeroTitle(activeSection);
            initMatrixHoverEffect(activeSection);
        }
        window.initScrollTextAnimations();
        setTimeout(() => ScrollTrigger.refresh(), 100);
    };

    // --- 0. Global Mouse Tracker & Custom Cursor ---
    window.globalMouseX = window.innerWidth / 2;
    window.globalMouseY = window.innerHeight / 2;

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let outlineX = window.globalMouseX, outlineY = window.globalMouseY;
    let hasMoved = false;

    window.addEventListener('mousemove', (e) => {
        if (!hasMoved) {
            hasMoved = true;
            if (cursorDot) cursorDot.style.opacity = '1';
            if (cursorOutline) cursorOutline.style.opacity = '1';
            // Snap the outline directly to the mouse on first interaction
            outlineX = e.clientX;
            outlineY = e.clientY;
        }

        window.globalMouseX = e.clientX;
        window.globalMouseY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = `${window.globalMouseX}px`;
            cursorDot.style.top = `${window.globalMouseY}px`;
        }
    }, { passive: true });

    function animateCursor() {
        let distX = window.globalMouseX - outlineX;
        let distY = window.globalMouseY - outlineY;

        outlineX = outlineX + (distX * 0.2);
        outlineY = outlineY + (distY * 0.2);

        if (cursorOutline) {
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
        }

        // Galaxian Ship Tracking
        const galaxianShip = document.getElementById('galaxian-ship');
        if (galaxianShip) {
            let shipCurrentX = parseFloat(galaxianShip.dataset.x) || window.innerWidth / 2;
            const trackRect = galaxianShip.parentElement.getBoundingClientRect();
            let targetX = window.globalMouseX - trackRect.left;
            // Ограничиваем движение корабля по краям трека
            if (targetX < 20) targetX = 20;
            if (targetX > trackRect.width - 20) targetX = trackRect.width - 20;

            // Плавное следование за мышкой (Lerp)
            shipCurrentX = shipCurrentX + (targetX - shipCurrentX) * 0.08;
            galaxianShip.dataset.x = shipCurrentX;
            galaxianShip.style.left = `${shipCurrentX}px`;
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // --- 0.5. Sound Design (Web Audio API) ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const SOUND_PREF_KEY = 'starlight.sound';
    let audioCtx = null;
    let soundEnabled = false;
    let noiseBuffer = null;

    // Звук по умолчанию выключен: включается только кнопкой в шапке.
    // preload='none' — 5 МБ трека не грузятся, пока звук не включили.
    window.bgMusic = new Audio('./background.mp3');
    window.bgMusic.loop = true;
    window.bgMusic.volume = 0.1;
    window.bgMusic.preload = 'none';

    function createNoiseBuffer() {
        const bufferSize = audioCtx.sampleRate * 2; // 2 seconds
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    function enableSound() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
            noiseBuffer = createNoiseBuffer();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => { });

        soundEnabled = true;
        window.bgMusic.preload = 'auto';
        window.bgMusic.play().catch(() => { });
    }

    function disableSound() {
        soundEnabled = false;
        window.bgMusic.pause();
        if (audioCtx && audioCtx.state === 'running') audioCtx.suspend().catch(() => { });
    }

    const soundBtn = document.getElementById('sound-toggle');

    function setSound(on, persist = true) {
        if (on) enableSound(); else disableSound();

        if (persist) {
            try { localStorage.setItem(SOUND_PREF_KEY, on ? 'on' : 'off'); } catch (e) { /* приватный режим */ }
        }
        if (soundBtn) {
            soundBtn.classList.toggle('sound-on', on);
            soundBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
        }
    }

    if (soundBtn) {
        soundBtn.addEventListener('click', () => setSound(!soundEnabled));
    }

    // Тем, кто уже включал звук, возвращаем его — но браузеру всё равно нужен
    // жест пользователя, поэтому ждём первое осмысленное действие.
    let savedSoundPref = null;
    try { savedSoundPref = localStorage.getItem(SOUND_PREF_KEY); } catch (e) { /* приватный режим */ }

    if (savedSoundPref === 'on') {
        const gestureEvents = ['pointerdown', 'keydown', 'touchstart'];
        const restoreSound = () => {
            gestureEvents.forEach(evt => document.removeEventListener(evt, restoreSound));
            setSound(true, false);
        };
        gestureEvents.forEach(evt => document.addEventListener(evt, restoreSound, { once: true }));
    }

    // "Alien/Nostromo" terminal tick - mechanical, muted, non-tonal
    function playHoverSound() {
        if (!soundEnabled || !audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.type = 'sine';
        // Extremely fast frequency drop creates a mechanical "thwack" or "tick" instead of a beep
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.015);

        gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.015);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.015);
    }

    // Deep structural click mixed with slight static
    function playClickSound() {
        if (!soundEnabled || !audioCtx) return;

        // Deep thud component
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.connect(oscGain);
        oscGain.connect(audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.1);
        oscGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);

        // Static burst component
        if (noiseBuffer) {
            const noiseSource = audioCtx.createBufferSource();
            noiseSource.buffer = noiseBuffer;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1500; // Muted radio static

            const noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(0.03, audioCtx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);

            noiseSource.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);

            noiseSource.start();
            noiseSource.stop(audioCtx.currentTime + 0.05);
        }
    }

    // Sci-fi data corruption / interface glitch
    function playGlitchSound() {
        if (!soundEnabled || !audioCtx) return;

        // Deep ominous rumble
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.connect(oscGain);
        oscGain.connect(audioCtx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(45, audioCtx.currentTime); // Low engine/reactor rumble
        oscGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        oscGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);

        // Glitchy radio static
        if (noiseBuffer) {
            const noiseSource = audioCtx.createBufferSource();
            noiseSource.buffer = noiseBuffer;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(600, audioCtx.currentTime);
            filter.frequency.linearRampToValueAtTime(2500, audioCtx.currentTime + 0.3);
            filter.Q.value = 3;

            const noiseGain = audioCtx.createGain();
            // Stuttering volume to simulate datastream break
            noiseGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            noiseGain.gain.setValueAtTime(0, audioCtx.currentTime + 0.05);
            noiseGain.gain.setValueAtTime(0.12, audioCtx.currentTime + 0.08);
            noiseGain.gain.setValueAtTime(0, audioCtx.currentTime + 0.12);
            noiseGain.gain.setValueAtTime(0.05, audioCtx.currentTime + 0.14);
            noiseGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);

            noiseSource.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);

            noiseSource.start();
            noiseSource.stop(audioCtx.currentTime + 0.3);
        }
    }

    // Attach sounds to all interactive elements dynamically
    function attachSoundToElements() {
        document.querySelectorAll('a, button, .hover-target, summary').forEach(el => {
            if (!el.dataset.soundAttached) {
                el.addEventListener('mouseenter', playHoverSound);
                el.addEventListener('mousedown', playClickSound);
                el.dataset.soundAttached = "true";
            }
        });
    }
    attachSoundToElements();

    // --- 1. SPA Mode Toggle & URL Routing ---
    const toggleBtn = document.getElementById('mode-toggle');
    const body = document.body;
    const viewDesigner = document.getElementById('view-designer');
    const viewModder = document.getElementById('view-modder');
    const glitchScreen = document.getElementById('glitch-screen');

    const txtDesigner = toggleBtn.querySelector('.designer-text');
    const txtModder = toggleBtn.querySelector('.modder-text');

    function triggerGlitch() {
        glitchScreen.classList.add('active');
        playGlitchSound(); // Trigger glitch audio
        setTimeout(() => {
            glitchScreen.classList.remove('active');
        }, 200);
    }

    function switchToModder() {
        triggerGlitch();
        setTimeout(() => {
            window.location.href = '?mode=modder';
        }, 200);
    }

    function switchToDesigner() {
        triggerGlitch();
        setTimeout(() => {
            window.location.href = '?mode=designer';
        }, 200);
    }

    // URL Routing check
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'modder') {
        // Загружаемся в режим мододела
        body.classList.remove('theme-designer');
        body.classList.add('theme-modder');
        txtDesigner.classList.remove('active');
        txtModder.classList.add('active');
        viewDesigner.classList.remove('active');
        viewModder.classList.add('active');
    }

    toggleBtn.addEventListener('click', () => {
        const currentlyModder = body.classList.contains('theme-modder');

        if (currentlyModder) {
            switchToDesigner();
            window.history.pushState({}, '', window.location.pathname);
        } else {
            switchToModder();
            window.history.pushState({}, '', '?mode=modder');
        }
    });

    // --- 2. Language Toggle ---
    const langBtn = document.getElementById('lang-toggle');
    const ruSpan = langBtn.querySelector('[data-lang="ru"]');
    const enSpan = langBtn.querySelector('[data-lang="en"]');
    let currentLang = 'ru';

    function setLanguage(lang) {
        currentLang = lang;
        if (lang === 'ru') {
            ruSpan.classList.add('active');
            enSpan.classList.remove('active');
        } else {
            enSpan.classList.add('active');
            ruSpan.classList.remove('active');
        }

        if (typeof cleanupTextAnimations === 'function') cleanupTextAnimations();

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Почта есть в обоих футерах (рабочий/хобби) — обновляем каждую
        const emailVal = translations[lang]['email_value'];
        document.querySelectorAll('.dynamic-email').forEach(emailEl => {
            emailEl.textContent = emailVal;
            emailEl.href = "mailto:" + emailVal;
        });

        // Reset original text cache for scramble animations so new language text is used
        document.querySelectorAll('.career-text-blocks h3, .career-text-blocks p').forEach(t => {
            delete t.dataset.orig;
        });

        document.title = translations[lang]['document_title'];

        if (typeof initScrollTextAnimations === 'function') {
            setTimeout(() => {
                initScrollTextAnimations();
                ScrollTrigger.refresh();
            }, 50);
        }
    }

    langBtn.addEventListener('click', () => {
        setLanguage(currentLang === 'ru' ? 'en' : 'ru');
    });

    // --- 3. Starlight Canvas Background ---
    const canvas = document.getElementById('starlight-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    let comets = [];
    let cometTimer = null;

    function scheduleComet() {
        if (cometTimer) clearTimeout(cometTimer);
        // Random time between 40s (40000ms) and 120s (120000ms)
        const nextSpawn = 40000 + Math.random() * 80000;

        cometTimer = setTimeout(() => {
            // Spawn comet only in night mode (3% "chance" is essentially the extreme rarity we're achieving with this timer)
            if (!document.body.classList.contains('theme-light')) {
                comets.push({
                    x: Math.random() * width,
                    y: -50,
                    vx: (Math.random() - 0.5) * 15, // horizontal drift
                    vy: Math.random() * 10 + 15,    // fast falling
                    radius: Math.random() * 1.5 + 1,
                    opacity: 1,
                    tailFactor: Math.random() * 4 + 4 // length of tail
                });
            }
            scheduleComet();
        }, nextSpawn);
    }

    window.blackHoleState = { progress: 0 };

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        particles = [];
        const isLight = document.body.classList.contains('theme-light');
        // Sunset mode has much fewer stars (1/4th)
        const numParticles = isLight ? Math.floor((width * height) / 12000) : Math.floor((width * height) / 3000);

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5,
                speed: Math.random() * 0.2 + 0.05,
                opacity: isLight ? Math.random() * 0.3 : Math.random()
            });
        }

        if (!cometTimer) scheduleComet();
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        const isLight = document.body.classList.contains('theme-light');
        const isModder = document.body.classList.contains('theme-modder');

        // 1. Draw Stars
        particles.forEach(p => {
            if (window.blackHoleState.progress > 0) {
                // Black hole math
                const centerX = width / 2;
                const centerY = height / 2;
                const dx = centerX - p.x;
                const dy = centerY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const force = window.blackHoleState.progress * 3;

                if (dist > 5) {
                    // Pull to center
                    p.x += (dx / dist) * force * p.speed * 15;
                    p.y += (dy / dist) * force * p.speed * 15;

                    // Swirl (tangential velocity)
                    p.x += (dy / dist) * force * p.speed * 8;
                    p.y -= (dx / dist) * force * p.speed * 8;
                }

                // Respawn at edges if sucked in completely
                if (dist < 10) {
                    p.x = Math.random() * width;
                    p.y = Math.random() > 0.5 ? -50 : height + 50;
                }
            } else {
                // Normal falling
                p.y -= p.speed;
                if (p.y < 0) {
                    p.y = height;
                    p.x = Math.random() * width;
                }
            }


            p.opacity += (Math.random() - 0.5) * 0.05;
            const minOp = isLight ? 0.02 : 0.1;
            const maxOp = isLight ? 0.3 : 1;
            if (p.opacity < minOp) p.opacity = minOp;
            if (p.opacity > maxOp) p.opacity = maxOp;

            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.6})`;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // 2. Draw Comets (Shooting Stars)
        for (let i = comets.length - 1; i >= 0; i--) {
            let c = comets[i];
            c.x += c.vx;
            c.y += c.vy;
            c.opacity -= 0.008; // fade out over time

            // Remove dead comets
            if (c.opacity <= 0 || c.y > height + 100 || c.x < -100 || c.x > width + 100) {
                comets.splice(i, 1);
                continue;
            }

            const tailX = c.x - c.vx * c.tailFactor;
            const tailY = c.y - c.vy * c.tailFactor;

            const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
            const color = isModder ? '255, 255, 255' : '200, 220, 255';
            grad.addColorStop(0, `rgba(${color}, ${c.opacity})`);
            grad.addColorStop(1, `rgba(${color}, 0)`);

            // Tail
            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = c.radius;
            ctx.moveTo(c.x, c.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            // Head
            ctx.fillStyle = `rgba(255, 255, 255, ${c.opacity})`;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.radius * 1.2, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(animateCanvas);
    }

    window.addEventListener('resize', initCanvas);
    initCanvas();
    animateCanvas();


    // --- 4. Lightbox Gallery Logic ---

    const lightbox = document.getElementById('lightbox');
    const lightboxInner = document.getElementById('lightbox-inner');
    const lightboxClose = document.getElementById('lightbox-close');
    // Removed static querySelectorAll for triggers to use event delegation
    const btnNext = document.getElementById('gallery-next');
    const btnPrev = document.getElementById('gallery-prev');
    const counter = document.getElementById('gallery-counter');
    const thumbnailsContainer = document.getElementById('lightbox-thumbnails');

    let currentGallery = [];
    let currentIndex = 0;

    const categoriesContainer = document.getElementById('gallery-categories');

    let galleryGroups = {};
    let activeCategory = '';

    function renderThumbnailsForCategory(folder) {
        if (!thumbnailsContainer || !galleryGroups[folder]) return;

        // Render metrics
        const metricsContainer = document.getElementById('gallery-metrics');
        if (metricsContainer) {
            metricsContainer.innerHTML = '';

            const metricText = categoryMetrics[folder.toLowerCase()];

            if (metricText) {
                const title = document.createElement('div');
                title.style.color = 'var(--text-main)';
                title.style.marginBottom = '0.75rem';
                title.style.fontWeight = 'bold';
                title.textContent = folder.toLowerCase() === 'реклама' ? '[ МАСШТАБ ПРОЕКТА ]' : '[ АНАЛИТИКА ]';
                metricsContainer.appendChild(title);

                const textElem = document.createElement('div');
                textElem.className = 'metric-text mono';
                textElem.style.fontSize = '0.85rem';
                textElem.style.color = 'var(--text-muted)';
                textElem.style.lineHeight = '1.4';
                textElem.textContent = metricText;
                metricsContainer.appendChild(textElem);
            }
        }

        thumbnailsContainer.innerHTML = '';
        galleryGroups[folder].forEach(gItem => {
            const thumb = document.createElement('img');
            thumb.src = gItem.item;
            thumb.dataset.index = gItem.originalIndex;
            thumb.addEventListener('click', () => {
                currentIndex = gItem.originalIndex;
                renderLightboxImage();
            });
            thumbnailsContainer.appendChild(thumb);
        });
    }

    function renderLightboxImage() {
        lightboxInner.innerHTML = '';
        const currentData = currentGallery[currentIndex];

        if (typeof currentData === 'string' && currentData.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
            lightboxInner.className = 'project-visual';
            const img = document.createElement('img');
            img.src = currentData;

            let isZoomed = false;

            img.addEventListener('mouseenter', () => {
                document.body.classList.add(isZoomed ? 'zoom-out-mode' : 'zoom-in-mode');
            });
            img.addEventListener('mouseleave', () => {
                document.body.classList.remove('zoom-in-mode', 'zoom-out-mode');
            });

            function updateTransformOrigin(e) {
                if (!isZoomed) return;
                const rect = img.getBoundingClientRect();
                // Ensure calculations are clamped to 0-100%
                let x = ((e.clientX - rect.left) / rect.width) * 100;
                let y = ((e.clientY - rect.top) / rect.height) * 100;

                // When zoomed, rect bounds might be larger than viewport,
                // but e.clientX/Y is viewport relative. We must track relative to original dimensions.
                // A simpler approach for WB zoom is to track the mouse relative to the container.
                const containerRect = lightboxInner.getBoundingClientRect();
                x = ((e.clientX - containerRect.left) / containerRect.width) * 100;
                y = ((e.clientY - containerRect.top) / containerRect.height) * 100;

                img.style.transformOrigin = `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`;
            }

            img.addEventListener('mousemove', (e) => {
                if (isZoomed) updateTransformOrigin(e);
            });

            img.addEventListener('click', (e) => {
                e.stopPropagation();
                isZoomed = !isZoomed;
                if (isZoomed) {
                    lightboxInner.classList.add('zoomed');
                    document.body.classList.replace('zoom-in-mode', 'zoom-out-mode');
                    updateTransformOrigin(e);
                } else {
                    lightboxInner.classList.remove('zoomed');
                    document.body.classList.replace('zoom-out-mode', 'zoom-in-mode');
                    img.style.transformOrigin = 'center center';
                }
            });

            lightboxInner.appendChild(img);
            lightboxInner.removeAttribute('data-text');

            const folder = (typeof currentData === 'string' && currentData.includes('/')) ? decodeURIComponent(currentData.split('/').slice(-2, -1)[0]) : 'Uncategorized';
            if (folder !== activeCategory) {
                activeCategory = folder;
                renderThumbnailsForCategory(folder);
                if (categoriesContainer) {
                    Array.from(categoriesContainer.children).forEach(tab => {
                        tab.classList.toggle('active', tab.textContent === '// ' + folder.toUpperCase());
                    });
                }
            }
        } else {
            lightboxInner.className = 'project-visual placeholder';
            lightboxInner.setAttribute('data-text', currentData);
        }

        const folderForCounter = (typeof currentData === 'string' && currentData.includes('/')) ? decodeURIComponent(currentData.split('/').slice(-2, -1)[0]) : 'Uncategorized';
        const currentGroup = galleryGroups[folderForCounter] || [];
        const indexInCategory = currentGroup.findIndex(gItem => gItem.originalIndex === currentIndex) + 1;
        const totalInCategory = currentGroup.length;
        counter.textContent = `[ ${indexInCategory || 1} / ${totalInCategory || 1} ]`;

        if (thumbnailsContainer) {
            Array.from(thumbnailsContainer.children).forEach(thumb => {
                if (parseInt(thumb.dataset.index) === currentIndex) {
                    thumb.classList.add('active');
                    setTimeout(() => {
                        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }, 10);
                } else {
                    thumb.classList.remove('active');
                }
            });
        }

        btnPrev.style.opacity = currentIndex > 0 ? '1' : '0.2';
        btnPrev.style.pointerEvents = currentIndex > 0 ? 'auto' : 'none';
        btnNext.style.opacity = currentIndex < currentGallery.length - 1 ? '1' : '0.2';
        btnNext.style.pointerEvents = currentIndex < currentGallery.length - 1 ? 'auto' : 'none';
    }

    const categoryMetrics = {
        'gan 65w': 'Прирост CTR в поиске с 3.1% до 7.2%. Конверсия "в корзину" выросла с 18% до 24%, а цена заказа снизилась на 12%.',
        'бзу 3в1 qi2': 'Увеличение CTR в поиске с 2.8% до 5.1%. Добавления "в корзину" выросли с 15% до 19%, цена заказа снижена на 8%.',
        '18+ 2024': 'CTR в каталоге вырос с 5.2% до 9.5%. Конверсия "в корзину" увеличилась с 14% до 22% при общем трафике в 1.2M.',
        'headphones 2024': 'Прирост CTR в поиске с 4.5% до 8.1%. Конверсия "в корзину" выросла с 12% до 21%, а цена заказа упала на 15%.',
        'реклама': 'Точных метрик нет — это масштабная имиджевая реклама для Wildberries. Баннеры (включая гигантские суперфасады) были размещены по всей стране и на территориях СНГ, обеспечив колоссальный охват аудитории.'
    };

    document.body.addEventListener('click', (e) => {
        const trigger = e.target.closest('.gallery-trigger');
        if (!trigger) return;

        const galleryData = trigger.getAttribute('data-gallery');
        if (galleryData) {
            currentGallery = JSON.parse(galleryData);
            galleryGroups = {};

            currentGallery.forEach((item, index) => {
                if (typeof item === 'string' && item.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
                    const folder = (typeof item === 'string' && item.includes('/')) ? decodeURIComponent(item.split('/').slice(-2, -1)[0]) : 'Uncategorized';
                    if (!galleryGroups[folder]) galleryGroups[folder] = [];
                    galleryGroups[folder].push({ item, originalIndex: index });
                }
            });

            let folders = Object.keys(galleryGroups);
            folders.sort((a, b) => {
                let a18 = a.includes('18+');
                let b18 = b.includes('18+');
                if (a18 && !b18) return 1;
                if (!a18 && b18) return -1;
                return a.localeCompare(b);
            });

            if (categoriesContainer) {
                categoriesContainer.innerHTML = '';
                folders.forEach((folder) => {
                    const btn = document.createElement('button');
                    btn.className = 'category-tab';
                    btn.textContent = '// ' + folder.toUpperCase();
                    btn.addEventListener('click', () => {
                        currentIndex = galleryGroups[folder][0].originalIndex;
                        renderLightboxImage();
                    });
                    categoriesContainer.appendChild(btn);
                });
            }

            // Open first non-18+ item
            currentIndex = folders.length > 0 ? galleryGroups[folders[0]][0].originalIndex : 0;
            activeCategory = ''; // Force refresh
            renderLightboxImage();

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (typeof lenis !== 'undefined') lenis.stop();
        }
    });

    btnNext.addEventListener('click', (e) => {
        e.stopPropagation(); // Чтобы клик не дошел до фона лайтбокса
        if (currentIndex < currentGallery.length - 1) {
            currentIndex++;
            renderLightboxImage();
        }
    });

    btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            currentIndex--;
            renderLightboxImage();
        }
    });

    const closeLightbox = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; if (typeof lenis !== 'undefined') lenis.start(); };
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox || e.target.classList.contains('lightbox-content') || e.target.classList.contains('project-visual')) { closeLightbox(); } });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            if (currentIndex < currentGallery.length - 1) {
                currentIndex++;
                renderLightboxImage();
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentIndex > 0) {
                currentIndex--;
                renderLightboxImage();
            }
        }
    });

    // Mobile swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50; // minimum pixels to swipe
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swiped left (next)
            if (currentIndex < currentGallery.length - 1) {
                currentIndex++;
                renderLightboxImage();
            }
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swiped right (prev)
            if (currentIndex > 0) {
                currentIndex--;
                renderLightboxImage();
            }
        }
    }

    // --- 5. Fetch Dynamic Mods from Modrinth ---
    const dynamicModsContainer = document.getElementById('dynamic-mods-container');

    async function fetchMods() {
        try {
            const response = await fetch('https://api.modrinth.com/v2/user/starlight.lnk/projects');
            if (!response.ok) throw new Error('Network response was not ok');
            const mods = await response.json();

            dynamicModsContainer.innerHTML = ''; // Clear container

            for (const mod of mods) {
                let totalDownloads = mod.downloads;

                // Generate potential CF slugs automatically for current and future mods
                const potentialSlugs = new Set([mod.slug]);

                // Generate potential CF identifiers (Project IDs or Slugs)
                const potentialCfIds = new Set();

                // 1. Exact mapping for current mods by their CurseForge Project IDs (100% accurate)
                const cfMap = {
                    'camerainertia': '1546366',
                    'ocular': '1550497',
                    'tacz-x-guns-lights-addon': '1325673'
                };
                if (cfMap[mod.slug]) potentialCfIds.add(cfMap[mod.slug]);

                // 2. Try the Modrinth slug directly
                potentialCfIds.add(mod.slug);

                // 3. Try extracting from GitHub source URL (usually matches CF slug for future mods)
                if (mod.source_url) {
                    const repoName = mod.source_url.split('/').pop();
                    if (repoName) potentialCfIds.add(repoName.toLowerCase());
                }

                // 4. Fetch from CurseForge via CFWidget API, trying each potential ID/slug
                for (const cfId of potentialCfIds) {
                    try {
                        const cfResponse = await fetch(`https://api.cfwidget.com/${cfId}`);
                        if (cfResponse.ok) {
                            const cfData = await cfResponse.json();
                            if (cfData && cfData.downloads && cfData.downloads.total) {
                                totalDownloads += cfData.downloads.total;
                                break; // Successfully found and added CF downloads, stop trying
                            }
                        }
                    } catch (e) {
                        // Ignore error and try the next potential slug
                    }
                }

                const date = new Date(mod.updated);
                const formattedDate = date.toLocaleDateString(currentLang === 'ru' ? 'ru-RU' : 'en-US');

                const row = document.createElement('div');
                row.className = 'mod-row hover-target';

                row.innerHTML = `
                    <div style="display: flex; align-items: center;">
                        <img src="${mod.icon_url}" class="mod-icon" alt="${mod.title}">
                    </div>
                    <div class="mod-content">
                        <h2 class="mod-title">${mod.title}</h2>
                        <p class="mono" style="margin-bottom: 0.5rem;">${mod.description}</p>
                        <div class="mono" style="font-size: 0.75rem; color: var(--text-muted); display: flex; gap: 1.5rem;">
                            <span><span data-i18n="lbl_downloads">${translations[currentLang].lbl_downloads}</span> <span style="color: var(--accent-color);">${totalDownloads.toLocaleString()}</span></span>
                            <span><span data-i18n="lbl_updated">${translations[currentLang].lbl_updated}</span> ${formattedDate}</span>
                        </div>
                    </div>
                    <a href="https://modrinth.com/mod/${mod.slug}" target="_blank" class="btn-action mono hover-target" data-i18n="btn_view_repo">${translations[currentLang].btn_view_repo}</a>
                `;

                dynamicModsContainer.appendChild(row);
            }

            // Re-apply language translations to newly created elements
            setLanguage(currentLang);
            // Attach sounds to newly added mod elements
            attachSoundToElements();
        } catch (error) {
            console.error('Error fetching mods:', error);
            // On error, we just leave it blank or show a tiny error message
        }
    }

    // Call fetch immediately
    fetchMods();

    // --- 5.5 Hero Section Scroll Animation (o-scs style) ---
    const heroBgLogo = document.getElementById('hero-3d-model');
    const asciiFirstName = document.getElementById('ascii-first-name');
    const asciiLastName = document.getElementById('ascii-last-name');
    const asciiStarlight = document.getElementById('ascii-starlight');
    const heroMetas = document.querySelectorAll('.hero-meta');
    const heroBtns = document.querySelectorAll('.hero-action-btns');

    if (heroBgLogo && asciiFirstName && asciiLastName) {
        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: "body", // Use body to trigger immediately
                start: 0, // Starts exactly at 0 scroll
                end: "+=150%",
                scrub: 1.5,
                pin: ".hero-bleed", // Explicitly pin the hero section
            }
        });

        // 1. Contact Buttons independent of scrub timeline for instant reaction
        const headerContactBtn = document.querySelector('.header-contact-btn');

        if (headerContactBtn) {
            gsap.to(headerContactBtn, {
                autoAlpha: 1,
                duration: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: "body",
                    start: 60, // Appear slightly after
                    toggleActions: "play none none reverse"
                }
            });
        }

        heroTl.to(asciiFirstName, {
            y: "-150vh",
            scale: 12,
            filter: "blur(12px)",
            ease: "power1.inOut",
            duration: 1
        }, 0);
        heroTl.to(asciiFirstName, { opacity: 0, duration: 0.5, ease: "none" }, 0); // Fade out early

        heroTl.to(asciiLastName, {
            y: "150vh",
            scale: 12,
            filter: "blur(12px)",
            ease: "power1.inOut",
            duration: 1
        }, 0);
        heroTl.to(asciiLastName, { opacity: 0, duration: 0.5, ease: "none" }, 0); // Fade out early

        if (asciiStarlight) {
            heroTl.to(asciiStarlight, {
                y: "-100vh",
                scale: 12,
                filter: "blur(12px)",
                ease: "power1.inOut",
                duration: 1
            }, 0);
            heroTl.to(asciiStarlight, { opacity: 0, duration: 0.5, ease: "none" }, 0); // Fade out early
        }

        heroTl.to(heroBgLogo, {
            scale: 0.5,
            filter: "blur(20px)",
            ease: "power1.inOut",
            duration: 1
        }, 0);
        heroTl.to(heroBgLogo, { autoAlpha: 0, duration: 0.5, ease: "none" }, 0); // Fade out early

        // 2. Unified Info Block appears EARLIER (Starts at 0.3s)
        const infoBlocks = document.querySelectorAll('.hero-info-block');
        if (infoBlocks.length > 0) {
            heroTl.from(infoBlocks, {
                autoAlpha: 0,
                filter: "blur(15px)",
                y: 30,
                ease: "power2.out",
                duration: 0.7
            }, 0.3);
        }
    }

    // --- 6. ScrollTrigger Reveal Animation ---

    document.querySelectorAll('.reveal-text').forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';

        // Wrap each word for the cascade effect
        text.split(' ').forEach(word => {
            if (word.trim() === '') return;

            const wrap = document.createElement('span');
            wrap.style.display = 'inline-flex';
            wrap.style.overflow = 'hidden';
            wrap.style.marginRight = '0.25em';
            wrap.style.verticalAlign = 'bottom';

            const inner = document.createElement('span');
            inner.innerText = word;
            inner.className = 'reveal-word';

            wrap.appendChild(inner);
            el.appendChild(wrap);
        });

        // Add spaces between words normally via DOM (or just rely on marginRight)

        ScrollTrigger.create({
            trigger: el,
            start: "top 90%", // Trigger when the top of the element hits 90% of the viewport height
            onEnter: () => {
                el.style.opacity = 1; // Make wrapper visible
                gsap.fromTo(el.querySelectorAll('.reveal-word'),
                    { y: "100%", opacity: 0 },
                    {
                        y: "0%",
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.015,
                        ease: "power4.out"
                    }
                );
            }
        });
    });

    // --- 7. Career 3D Timeline ---
    const careerTimeline = document.getElementById('career-timeline');
    if (careerTimeline) {
        const years = gsap.utils.toArray('.year-3d-item');
        const textBlocks = gsap.utils.toArray('.text-block');
        let activeIndex = -1;

        // Build 3D physical volume for ASCII art
        years.forEach(year => {
            const pre = year.querySelector('.ascii-year');
            if (pre) {
                // Store raw text for scroll rendering
                pre.dataset.raw = pre.innerText;

                const wrapper = document.createElement('div');
                wrapper.className = 'ascii-wrapper';
                // Start with back layers hidden (will be revealed when fully rendered)
                wrapper.classList.add('is-glitching');
                year.appendChild(wrapper);

                // Removed 3D extrusion layers as per user request to keep glow attached to the digits

                // Add front layer LAST so it renders on top in DOM order
                pre.classList.remove('ascii-year');
                pre.classList.add('ascii-layer', 'ascii-front');
                wrapper.appendChild(pre);
            }
        });

        // 3D Parallax Variables
        let targetRotX = 0;
        let targetRotY = 0;
        let currentRotX = 0;
        let currentRotY = 0;

        // Track mouse to tilt the active year via global mouse

        // Smoothly interpolate rotation
        gsap.ticker.add(() => {
            // Only calculate if section is in viewport
            const rect = careerTimeline.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                const x = ((window.globalMouseX || window.innerWidth / 2) / window.innerWidth - 0.5) * 2;
                const y = ((window.globalMouseY || window.innerHeight / 2) / window.innerHeight - 0.5) * 2;
                targetRotX = -y * 12; // Reduced by ~50%
                targetRotY = x * 12; // Reduced by ~50%
            }

            currentRotX += (targetRotX - currentRotX) * 0.1;
            currentRotY += (targetRotY - currentRotY) * 0.1;

            if (activeIndex >= 0 && years[activeIndex]) {
                const activeWrapper = years[activeIndex].querySelector('.ascii-wrapper');
                if (activeWrapper) {
                    gsap.set(activeWrapper, {
                        rotateX: currentRotX,
                        rotateY: currentRotY,
                        transformPerspective: 800,
                        transformOrigin: "center center"
                    });
                }
            }
        });

        ScrollTrigger.create({
            trigger: careerTimeline,
            start: "center center",
            end: `+=${years.length * 100}%`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            onUpdate: (self) => {
                const maxIndex = years.length - 1;
                const progress = self.progress * maxIndex;
                const current = Math.round(progress);

                // Update terminal header progress
                const statusText = document.getElementById('career-status-text');
                const progressBar = document.getElementById('career-progress-bar');
                if (statusText && progressBar) {
                    statusText.innerText = `БЛОК_0${current + 1} / 0${years.length}`;

                    const ratio = self.progress; // 0.0 to 1.0
                    const totalBlocks = 10;
                    const filled = Math.round(ratio * totalBlocks);
                    const empty = totalBlocks - filled;
                    progressBar.innerText = `[${'█'.repeat(filled)}${'▒'.repeat(empty)}]`;
                }

                // 1. Update 3D Drum positions and Render ASCII Text
                years.forEach((year, i) => {
                    const diff = i - progress;

                    // Terminal style: stay in place, dissolve in/out
                    const y = 0;
                    const z = 0;
                    const scaleFactor = 1.0;

                    // Instant LED clock switch
                    const op = Math.abs(diff) < 0.5 ? 1.0 : 0.0;

                    gsap.set(year, {
                        y: y,
                        z: z,
                        scale: scaleFactor,
                        opacity: op
                    });
                    year.setAttribute('data-diff', Math.abs(diff));

                    if (Math.abs(diff) < 0.5) {
                        year.classList.add('active');
                    } else {
                        year.classList.remove('active');
                    }

                    // Восстанавливаем процедурный глитч (Matrix Effect)
                    const frontLayer = year.querySelector('.ascii-front');
                    if (frontLayer && frontLayer.dataset.raw) {
                        const raw = frontLayer.dataset.raw;
                        let scrambled = "";
                        const matrixChars = "01&*#$@%X";

                        // Множитель скорости проявления. 3.0 делает проявление очень быстрым и резким.
                        const speedMultiplier = 3.0;

                        let currentLine = 0;
                        const totalLines = raw.split('\n').length;

                        for (let j = 0; j < raw.length; j++) {
                            const origChar = raw[j];
                            if (origChar === '\n') {
                                scrambled += origChar;
                                currentLine++;
                                continue;
                            }
                            if (origChar === ' ') {
                                scrambled += origChar;
                                continue;
                            }

                            const charRandom = Math.sin(j * 12.9898) * 43758.5453;
                            const randomVal = charRandom - Math.floor(charRandom);

                            const cycle = Math.floor((progress * 40 * speedMultiplier) + randomVal * 10) % matrixChars.length;
                            const mChar = matrixChars[Math.abs(cycle)];

                            // Строгое появление "сверху вниз" с помощью скользящего окна
                            const linePos = currentLine / totalLines;
                            const effectivePos = linePos + (randomVal - 0.5) * 0.15; // Шум матрицы

                            // Сдвигаем окно пропорционально скроллу.
                            const windowVal = effectivePos + diff * speedMultiplier;

                            // Широкая "мертвая зона" от -0.5 до 1.5 гарантирует, что 
                            // текст будет абсолютно стабильным в центре экрана без случайного глитча.
                            if (windowVal > -0.5 && windowVal < 1.5) {
                                // Центр окна - чистый текст
                                scrambled += origChar;
                            } else if (windowVal > -0.8 && windowVal < 1.8) {
                                // Границы окна - глитч матрицы
                                scrambled += mChar;
                            } else {
                                // Вне окна - пустота
                                scrambled += " ";
                            }
                        }
                        frontLayer.innerText = scrambled;
                    }
                });

                // 2. Trigger text reveal on index change
                if (current !== activeIndex && current >= 0 && current <= maxIndex) {
                    activeIndex = current;

                    // Also play a glitch sound if they scroll to a new year
                    if (window.playHoverSound && soundEnabled) {
                        playHoverSound();
                    }

                    // Trigger text reveal on index change
                    if (window.playHoverSound && soundEnabled) {
                        playHoverSound();
                    }


                    textBlocks.forEach((block, i) => {
                        if (i === current) {
                            block.classList.add('active');
                            const texts = block.querySelectorAll('h3, p');
                            texts.forEach((t, tIdx) => {
                                gsap.fromTo(t,
                                    { autoAlpha: 0, y: 40, filter: "blur(10px)" },
                                    {
                                        autoAlpha: 1,
                                        y: 0,
                                        filter: "blur(0px)",
                                        duration: 1.2,
                                        delay: tIdx * 0.1,
                                        ease: "power3.out"
                                    }
                                );
                            });
                        } else {
                            block.classList.remove('active');
                        }
                    });
                }
            }
        });
    }

    // --- GALAXIAN SHOOTING MECHANICS ---
    const galaxianTrack = document.getElementById('galaxian-track');
    const galaxianShip = document.getElementById('galaxian-ship');
    if (galaxianTrack && galaxianShip) {
        let audioCtx;
        function playShootSound() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        }

        const shootAreas = document.querySelectorAll('.sys-footer, .galaxian-minigame');
        shootAreas.forEach(area => {
            area.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return; // Only left click

                // Игнорируем клики по ссылкам, кнопкам и другим интерактивным элементам
                if (e.target.closest('a, button, input, textarea, select')) return;

                playShootSound();

                const rect = galaxianShip.getBoundingClientRect();
                const trackRect = galaxianTrack.getBoundingClientRect();

                const laser = document.createElement('div');
                laser.style.position = 'absolute';
                laser.style.width = '2px';
                laser.style.height = '15px';
                laser.style.backgroundColor = 'var(--accent-color)';
                laser.style.left = (rect.left - trackRect.left + rect.width / 2 - 1) + 'px';
                laser.style.bottom = '35px'; // Start just above ship
                laser.style.boxShadow = '0 0 8px var(--accent-color)';

                galaxianTrack.appendChild(laser);

                gsap.to(laser, {
                    bottom: (window.innerHeight + 500) + 'px',
                    duration: 1.5,
                    ease: 'none',
                    onComplete: () => laser.remove()
                });
            });
        });
    }

    // --- 10. Smooth Scroll for specific anchor links (Using Lenis) ---
    document.querySelectorAll('a.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    if (typeof lenis !== 'undefined') {
                        lenis.scrollTo(targetElement, { offset: 0, duration: 1.2 });
                    } else {
                        // Fallback
                        const targetY = targetElement.getBoundingClientRect().top + window.scrollY;
                        window.scrollTo({ top: targetY, behavior: 'smooth' });
                    }
                }
            }
        });
    });

    // --- 11. Global Scroll Reveal (Premium Framer-style Text Animation) ---
    // Dynamic gallery logic removed as projects are now statically generated in index.html
    const revealElements = document.querySelectorAll('.view-section p, .view-section h2, .view-section h3, .view-section .project-card, .view-section .career-item, .view-section .mod-card, .section-title, .about-skills .skill-tag');

    revealElements.forEach(el => {
        if (el.closest('.hero-bleed') || el.closest('.sys-header') || el.closest('.career-text-blocks')) return;

        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            autoAlpha: 0,
            y: 40,
            filter: "blur(10px)",
            duration: 1.2,
            ease: "power3.out"
        });
    });

    // --- 12. Bottom Custom Scrollbar ---
    const bottomScrollThumb = document.getElementById('bottom-scroll-thumb');
    if (bottomScrollThumb) {
        gsap.to(bottomScrollThumb, {
            left: "80%", // 100% minus 20% thumb width
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: true
            }
        });
    }


    // Removed loadDynamicGallery() call

});

// --- Header Button Visibility Toggle ---
document.addEventListener('DOMContentLoaded', () => {
    const headerBtn = document.querySelector('.header-contact-btn');
    const heroBtn = document.querySelector('.initial-contact-btn');

    if (headerBtn && heroBtn) {
        // Create an Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If hero button is visible (intersecting), hide header button
                // If hero button is NOT visible, show header button
                if (entry.isIntersecting) {
                    headerBtn.classList.remove('visible');
                } else {
                    headerBtn.classList.add('visible');
                }
            });
        }, {
            // Trigger when even 1 pixel of the hero button goes in/out of view
            threshold: 0,
            rootMargin: "-50px 0px 0px 0px" // Slight offset so it triggers nicely
        });

        observer.observe(heroBtn);
    }
});

// --- Gallery Filters ---
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-row');

    if (filterBtns.length > 0 && projects.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.style.color = 'var(--text-muted)';
                });
                btn.classList.add('active');
                btn.style.color = 'var(--hero-accent)';

                const filter = btn.getAttribute('data-filter');

                // Filter projects
                projects.forEach(project => {
                    const category = project.getAttribute('data-category') || 'all';
                    
                    if (filter === 'all' || category === filter) {
                        // Show
                        gsap.to(project, {
                            height: 'auto',
                            autoAlpha: 1,
                            duration: 0.4,
                            ease: 'power2.out',
                            onStart: () => {
                                project.style.display = 'flex';
                            }
                        });
                    } else {
                        // Hide
                        gsap.to(project, {
                            height: 0,
                            autoAlpha: 0,
                            duration: 0.3,
                            ease: 'power2.in',
                            onComplete: () => {
                                project.style.display = 'none';
                            }
                        });
                    }
                });
                
                // Refresh scroll trigger to account for new heights
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 450);
            });
        });
    }
});
