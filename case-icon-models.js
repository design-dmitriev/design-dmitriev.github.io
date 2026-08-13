/* ==========================================================================
   БИБЛИОТЕКА 3D WIREFRAME МОДЕЛЕЙ ДЛЯ ИКОНОК КЕЙСОВ
   --------------------------------------------------------------------------
   Общий источник для боевого сайта (case-icons-3d.js) и страницы выбора
   (icons-preview.html) — чтобы превью показывало ровно то, что потом уедет
   на сайт, а не свою копию, которая со временем разойдётся с оригиналом.

   Стилистика — ранняя компьютерная графика (чайник Юты, 1975): каркас без
   заливки. Модели собраны из примитивов.

   Рисуем через EdgesGeometry, а не WireframeGeometry: вторая показывает рёбра
   ВСЕХ треугольников, то есть к каждой грани добавляет диагональ, и на иконке
   104×104 модель превращается в кашу из линий. EdgesGeometry оставляет только
   рёбра между непараллельными гранями — силуэт читается с первого взгляда.

   Соглашения:
   - модель вписана примерно в 3 юнита по ширине (камера показывает ~3.7);
   - userData.baseRotX — постоянный наклон, нужен плоским моделям, иначе в
     половине оборота они видны строго с ребра и превращаются в чёрточку;
   - userData.float — вертикальный дрейф («левитирует»);
   - userData.spin — массив узлов, вращающихся независимо от модели.
   ========================================================================== */
(function (global) {
    'use strict';

    // thresholdAngle: у коробок все стыки 90°, поэтому подходит любой малый
    // порог. Скруглённым моделям нужен порог побольше, иначе каждый сегмент
    // кривой даёт свою линию и силуэт зарастает штриховкой.
    function wireframe(geometry, material, thresholdAngle = 1) {
        return new THREE.LineSegments(new THREE.EdgesGeometry(geometry, thresholdAngle), material);
    }

    // Замкнутая окружность линией. Сфера через SphereGeometry не годится: её
    // триангуляция даёт диагональ в каждой ячейке, и вместо сетки глобуса
    // получается рябь — поэтому меридианы, параллели и орбиты строим кольцами.
    function ring(radius, material, segments = 48) {
        const pts = [];
        for (let i = 0; i <= segments; i++) {
            const a = (i / segments) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
        }
        return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), material);
    }

    function box(w, h, d, material) {
        return wireframe(new THREE.BoxGeometry(w, h, d), material);
    }

    // Гранёный цилиндр: radialSegments небольшой, чтобы читались рёбра призмы,
    // а не гладкий бок с частоколом вертикалей.
    function prism(rTop, rBottom, height, sides, material) {
        return wireframe(new THREE.CylinderGeometry(rTop, rBottom, height, sides), material);
    }

    /* ---------------------------------------------------------------- 001 */

    /* Левитирующий микропроцессор: корпус, кристалл сверху и дорожки печатной
       платы, расходящиеся на четыре стороны к контактным площадкам. */
    function buildChip(material) {
        const group = new THREE.Group();

        group.add(box(1.0, 0.16, 1.0, material));

        const die = box(0.46, 0.07, 0.46, material);
        die.position.y = 0.115;
        group.add(die);

        // Средняя дорожка длиннее боковых — рисунок платы живее, чем четыре
        // одинаковых «уса».
        const LENGTHS = [0.34, 0.60, 0.34];
        const OFFSETS = [-0.3, 0, 0.3];
        for (let side = 0; side < 4; side++) {
            const arm = new THREE.Group();
            OFFSETS.forEach((off, i) => {
                const len = LENGTHS[i];
                const trace = box(0.045, 0.045, len, material);
                trace.position.set(off, 0, 0.5 + len / 2);
                arm.add(trace);

                const pad = box(0.15, 0.05, 0.15, material);
                pad.position.set(off, 0, 0.5 + len + 0.075);
                arm.add(pad);
            });
            arm.rotation.y = (side * Math.PI) / 2;
            group.add(arm);
        }

        group.userData.float = true;
        group.userData.baseRotX = 0.62;
        return group;
    }

    /* Орбитальная станция: гексагональное ядро, четыре пристыкованных модуля
       на коротких переходах, солнечные панели и опоясывающее кольцо.
       Метафора DesignOps: ядро — ты, модули — плагины и коннекторы. */
    function buildStation(material) {
        const group = new THREE.Group();

        const core = prism(0.42, 0.42, 0.7, 6, material);
        group.add(core);

        // Четыре стыковочных узла: переход + модуль + торцевая крышка.
        for (let i = 0; i < 4; i++) {
            const dock = new THREE.Group();

            const neck = box(0.12, 0.12, 0.32, material);
            neck.position.z = 0.55;
            dock.add(neck);

            const pod = box(0.34, 0.34, 0.46, material);
            pod.position.z = 0.94;
            dock.add(pod);

            const cap = prism(0.13, 0.13, 0.1, 6, material);
            cap.rotation.x = Math.PI / 2;
            cap.position.z = 1.22;
            dock.add(cap);

            dock.rotation.y = (i * Math.PI) / 2;
            group.add(dock);
        }

        // Солнечные панели — сверху и снизу, чтобы силуэт не был симметричен
        // по всем осям и станция читалась как объект, а не как узор.
        [1, -1].forEach(dir => {
            const mast = box(0.07, 0.3, 0.07, material);
            mast.position.y = dir * 0.5;
            group.add(mast);

            const panel = box(1.5, 0.05, 0.5, material);
            panel.position.y = dir * 0.7;
            group.add(panel);
        });

        const belt = ring(0.72, material);
        group.add(belt);

        group.userData.baseRotX = 0.3;
        return group;
    }

    /* Ядро гипердвигателя: гранёный реактор, внутри светящийся сердечник,
       снаружи три кольца удержания под разными углами — они вращаются
       независимо от корпуса (userData.spin). */
    function buildWarpCore(material) {
        const group = new THREE.Group();

        const chamber = prism(0.34, 0.34, 1.5, 8, material);
        group.add(chamber);

        // Расширители сверху и снизу — силуэт «катушки», а не просто трубы.
        [1, -1].forEach(dir => {
            const flare = prism(0.55, 0.34, 0.26, 8, material);
            flare.position.y = dir * 0.86;
            if (dir < 0) flare.rotation.x = Math.PI;
            group.add(flare);
        });

        const heart = wireframe(new THREE.OctahedronGeometry(0.28), material);
        group.add(heart);

        const spin = [];
        [
            { r: 0.78, rx: 0, rz: 0 },
            { r: 0.92, rx: 1.0, rz: 0.3 },
            { r: 0.92, rx: -1.0, rz: -0.3 }
        ].forEach(({ r, rx, rz }) => {
            const hoop = new THREE.Group();
            hoop.add(ring(r, material));
            hoop.rotation.set(rx, 0, rz);
            group.add(hoop);
            spin.push(hoop);
        });

        group.userData.spin = spin;
        group.userData.float = true;
        return group;
    }

    /* Спутниковая тарелка: параболическое зеркало, набранное кольцами
       возрастающего радиуса (высота считается по параболе, поэтому кольца
       ложатся на реальную поверхность), спицы, облучатель и опора. */
    function buildRadar(material) {
        const group = new THREE.Group();
        const dish = new THREE.Group();

        const RIM = 0.95;
        const DEPTH = 0.55;
        for (let i = 1; i <= 4; i++) {
            const r = (RIM * i) / 4;
            const hoop = ring(r, material);
            hoop.position.y = DEPTH * (r / RIM) * (r / RIM);
            dish.add(hoop);
        }

        // Спицы от центра к ободу — без них кольца выглядят как стопка колец,
        // а не как одна вогнутая поверхность.
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            const pts = [];
            for (let s = 0; s <= 4; s++) {
                const r = (RIM * s) / 4;
                pts.push(new THREE.Vector3(
                    Math.cos(a) * r,
                    DEPTH * (r / RIM) * (r / RIM),
                    Math.sin(a) * r
                ));
            }
            dish.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), material));
        }

        // Облучатель на треноге в фокусе зеркала.
        const feed = box(0.16, 0.16, 0.16, material);
        feed.position.y = DEPTH + 0.5;
        dish.add(feed);
        for (let i = 0; i < 3; i++) {
            const a = (i / 3) * Math.PI * 2;
            const pts = [
                new THREE.Vector3(Math.cos(a) * RIM * 0.8, DEPTH * 0.64, Math.sin(a) * RIM * 0.8),
                new THREE.Vector3(0, DEPTH + 0.42, 0)
            ];
            dish.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), material));
        }

        // Наклон антенны «в небо» — характерная поза радиотелескопа.
        dish.rotation.x = -0.55;
        dish.position.y = 0.34;
        group.add(dish);

        const mast = box(0.16, 0.55, 0.16, material);
        mast.position.y = -0.28;
        group.add(mast);

        const base = prism(0.42, 0.5, 0.16, 6, material);
        base.position.y = -0.63;
        group.add(base);

        group.userData.baseRotX = 0.12;
        return group;
    }

    /* ---------------------------------------------------------------- 002 */

    /* Багажная бирка: скошенный сверху контур с отверстием под шнурок и
       штрих-код рейками разной ширины поверх лицевой грани. */
    function buildTag(material) {
        const group = new THREE.Group();

        const s = new THREE.Shape();
        s.moveTo(-0.42, -0.85);
        s.lineTo(0.42, -0.85);
        s.lineTo(0.42, 0.5);
        s.lineTo(0, 0.9);
        s.lineTo(-0.42, 0.5);
        s.closePath();

        const hole = new THREE.Path();
        hole.absarc(0, 0.52, 0.11, 0, Math.PI * 2, true);
        s.holes.push(hole);

        // Порог 18° из-за круглого отверстия — иначе его сегменты дают
        // частокол линий по внутренней стенке.
        const plate = wireframe(new THREE.ExtrudeGeometry(s, {
            depth: 0.16,
            bevelEnabled: false,
            curveSegments: 8
        }), material, 18);
        // ExtrudeGeometry растит объём только в +Z, центрируем по толщине сами.
        plate.position.z = -0.08;
        group.add(plate);

        const bars = [-0.26, -0.17, -0.11, -0.01, 0.08, 0.14, 0.24];
        const widths = [0.05, 0.03, 0.06, 0.03, 0.05, 0.03, 0.05];
        bars.forEach((x, i) => {
            const bar = box(widths[i], 0.5, 0.03, material);
            bar.position.set(x, -0.2, 0.095);
            group.add(bar);
        });

        group.userData.baseRotX = 0.3;
        return group;
    }

    /* Грузовой модуль: гексагональный контейнер с рёбрами жёсткости, замками
       по торцам и внутренним ядром, которое видно сквозь каркас — «свечение»
       груза в линейной графике честнее показать вложенным объёмом. */
    function buildCargo(material) {
        const group = new THREE.Group();

        const shell = prism(0.72, 0.72, 1.5, 6, material);
        shell.rotation.z = Math.PI / 2;
        group.add(shell);

        // Рёбра жёсткости — три пояса поперёк контейнера.
        [-0.45, 0, 0.45].forEach(x => {
            const rib = prism(0.78, 0.78, 0.08, 6, material);
            rib.rotation.z = Math.PI / 2;
            rib.position.x = x;
            group.add(rib);
        });

        // Торцевые люки с замками.
        [1, -1].forEach(dir => {
            const hatch = prism(0.5, 0.5, 0.1, 6, material);
            hatch.rotation.z = Math.PI / 2;
            hatch.position.x = dir * 0.79;
            group.add(hatch);

            const lock = box(0.06, 0.22, 0.22, material);
            lock.position.x = dir * 0.86;
            group.add(lock);
        });

        const glow = wireframe(new THREE.OctahedronGeometry(0.3), material);
        group.add(glow);

        group.userData.baseRotX = 0.34;
        return group;
    }

    /* Транспортный шлюз: гранёное кольцо врат на опорах, сквозь которое летит
       заготовка. Метафора конвейера — на входе сырьё, на выходе готовая
       карточка. Кольцо вращается независимо (userData.spin). */
    function buildGate(material) {
        const group = new THREE.Group();

        const gate = new THREE.Group();
        // TorusGeometry с малым числом сегментов даёт гранёное кольцо: рёбра
        // видны как сегменты врат, а не как гладкий бублик.
        const torus = wireframe(new THREE.TorusGeometry(0.95, 0.13, 4, 12), material);
        gate.add(torus);

        // Маркеры сегментов по внутреннему периметру.
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            const chevron = box(0.12, 0.12, 0.1, material);
            chevron.position.set(Math.cos(a) * 0.78, Math.sin(a) * 0.78, 0);
            gate.add(chevron);
        }
        group.add(gate);

        // Опоры врат — стоят на месте, пока кольцо крутится.
        [-1, 1].forEach(dir => {
            const leg = box(0.1, 0.42, 0.1, material);
            leg.position.set(dir * 0.62, -1.0, 0);
            group.add(leg);
        });
        const base = box(1.7, 0.1, 0.34, material);
        base.position.y = -1.25;
        group.add(base);

        // Заготовка, проходящая сквозь врата.
        const payload = wireframe(new THREE.OctahedronGeometry(0.26), material);
        payload.position.z = 0.1;
        group.add(payload);

        group.userData.spin = [gate];
        group.userData.baseRotX = 0.16;
        return group;
    }

    /* Тяжёлый грузовой шаттл: угловатый утилитарный тягач — корпус со
       скошенным носом, рубка, два двигателя на пилонах и грузовой контейнер
       под брюхом. */
    function buildShuttle(material) {
        const group = new THREE.Group();

        const hull = box(0.7, 0.42, 1.5, material);
        group.add(hull);

        // Нос: сужающаяся призма, дающая скос вместо тупого торца.
        const nose = wireframe(new THREE.CylinderGeometry(0.2, 0.42, 0.5, 4), material);
        nose.rotation.x = -Math.PI / 2;
        nose.rotation.y = Math.PI / 4;
        nose.position.z = 1.0;
        group.add(nose);

        const bridge = box(0.42, 0.26, 0.5, material);
        bridge.position.set(0, 0.32, 0.3);
        group.add(bridge);

        // Двигатели на пилонах.
        [-1, 1].forEach(dir => {
            const pylon = box(0.34, 0.1, 0.3, material);
            pylon.position.set(dir * 0.5, -0.05, -0.5);
            group.add(pylon);

            const engine = prism(0.2, 0.26, 0.62, 6, material);
            engine.rotation.x = Math.PI / 2;
            engine.position.set(dir * 0.72, -0.05, -0.62);
            group.add(engine);
        });

        // Груз под брюхом — то, ради чего тягач и летает.
        const cargo = box(0.5, 0.3, 0.9, material);
        cargo.position.y = -0.38;
        group.add(cargo);

        group.userData.baseRotX = 0.34;
        return group;
    }

    /* ---------------------------------------------------------------- 003 */

    /* Каркасный глобус с орбитами: параллели, меридианы и два наклонённых
       кольца со спутниками — «присутствие везде». */
    function buildGlobe(material) {
        const group = new THREE.Group();
        const R = 0.8;

        // Радиус каждой параллели считается от её высоты, поэтому кольца
        // ложатся ровно на поверхность сферы, а не «плавают» рядом.
        [-0.5, -0.25, 0, 0.25, 0.5].forEach(t => {
            const y = R * t;
            const r = Math.sqrt(Math.max(R * R - y * y, 0.0001));
            const parallel = ring(r, material);
            parallel.position.y = y;
            group.add(parallel);
        });

        for (let i = 0; i < 4; i++) {
            const meridian = ring(R, material);
            meridian.rotation.x = Math.PI / 2;
            meridian.rotation.z = (i * Math.PI) / 4;
            group.add(meridian);
        }

        [
            { r: 1.15, rx: 0.42, rz: 0.15 },
            { r: 1.38, rx: -0.3, rz: -0.5 }
        ].forEach(({ r, rx, rz }) => {
            const orbit = new THREE.Group();
            orbit.add(ring(r, material));

            const sat = box(0.11, 0.11, 0.11, material);
            sat.position.set(r, 0, 0);
            orbit.add(sat);

            orbit.rotation.set(rx, 0, rz);
            group.add(orbit);
        });

        return group;
    }

    // Многие модели асимметричны (тарелка задрана вверх, груз-шаттл с рубкой
    // сверху и грузом снизу) — их геометрический центр не совпадает с (0,0,0),
    // вокруг которого крутит model.rotation в общей петле анимации. На глаз
    // это читается как «иконка съехала» в квадратной рамке.
    //
    // Чинится сдвигом СОДЕРЖИМОГО в дочерний pivot-узел, а не позиции самой
    // модели: model.position нельзя использовать, потому что Object3D
    // применяет позицию уже в мировых координатах после поворота — модель
    // при вращении не встанет по центру, а начнёт ходить по кругу вокруг
    // старого центра рамки. Pivot же сдвигается ДО поворота, в локальном
    // пространстве, поэтому вращение остаётся на месте, а видимый центр
    // модели совпадает с центром иконки.
    function centerPivot(model) {
        const box = new THREE.Box3().setFromObject(model);
        if (box.isEmpty()) return model;
        const center = box.getCenter(new THREE.Vector3());
        if (center.lengthSq() < 1e-6) return model; // уже по центру

        const pivot = new THREE.Group();
        while (model.children.length) pivot.add(model.children[0]);
        pivot.position.copy(center).multiplyScalar(-1);
        model.add(pivot);
        return model;
    }

    function centered(builder) {
        return material => centerPivot(builder(material));
    }

    global.CaseIconModels = {
        // No.001 — нейросети, плагины, автоматизация
        chip: centered(buildChip),
        station: centered(buildStation),
        warpcore: centered(buildWarpCore),
        radar: centered(buildRadar),
        // No.002 — товарное производство, упаковка
        tag: centered(buildTag),
        cargo: centered(buildCargo),
        gate: centered(buildGate),
        shuttle: centered(buildShuttle),
        // No.003 — омниканальность
        globe: centered(buildGlobe)
    };
})(window);
