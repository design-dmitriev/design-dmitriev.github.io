const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const revertedHTML = `                <section class="content-bleed" id="selected-works">
                    <div class="section-label mono" data-i18n="label_selected_works">// ИЗБРАННЫЕ_РАБОТЫ</div>

                    <div class="gallery-filters mono" style="display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid var(--grid-line); padding-bottom: 1rem; flex-wrap: wrap;">
                        <button class="filter-btn hover-target active" data-filter="all" style="background:transparent; border:none; color:var(--hero-accent); cursor:pointer;">ВСЕ</button>
                        <button class="filter-btn hover-target" data-filter="карточки" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer;">КАРТОЧКИ ТОВАРОВ</button>
                        <button class="filter-btn hover-target" data-filter="реклама" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer;">РЕКЛАМА</button>
                        <button class="filter-btn hover-target" data-filter="соцсети" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer;">СОЦ СЕТИ</button>
                    </div>
                    
                    <div class="projects-list">
                        <!-- Проект 2 (Рич-контент) -->
                        <div class="project-row" data-category="карточки" id="rich-content-project">
                            <div class="project-visual format-rich placeholder hover-target gallery-trigger" 
                                data-gallery='["RICH_CONTENT"]'
                                data-text="RICH_CONTENT">
                                <div class="rich-scroll-content"></div>
                            </div>
                            <div class="project-info">
                                <div class="project-type mono">КАРТОЧКИ ТОВАРОВ</div>
                                <h2 class="project-title" data-i18n="project_rich_title">Рич-контент</h2>
                                <p class="project-desc mono" data-i18n="project_rich_desc">Бесшовные визуальные истории (лендинги), полностью погружающие клиента в продукт.</p>
                            </div>
                        </div>

                        <!-- Сюда будут динамически добавляться проекты из gallery-data.json -->
                        
                        <div class="project-row" data-category="карточки">
                            <div class="project-visual format-adaptive placeholder hover-target gallery-trigger" 
                                style="background-image: url('assets/portfolio/Карточки/18+%202024/photo_2024-01-26_11-33-56.jpg'); background-size: cover; background-position: center;"
                                data-text=""
                                data-gallery='["assets/portfolio/Карточки/18+%202024/photo_2024-01-26_11-33-56.jpg","assets/portfolio/Карточки/18+%202024/red_wb%20(1).png","assets/portfolio/Карточки/18+%202024/red_wb%20(10).png","assets/portfolio/Карточки/18+%202024/red_wb%20(2).png","assets/portfolio/Карточки/18+%202024/red_wb%20(3).png","assets/portfolio/Карточки/18+%202024/red_wb%20(4).png","assets/portfolio/Карточки/18+%202024/red_wb%20(5).png","assets/portfolio/Карточки/18+%202024/red_wb%20(6).png","assets/portfolio/Карточки/18+%202024/red_wb%20(7).png","assets/portfolio/Карточки/18+%202024/red_wb%20(8).png","assets/portfolio/Карточки/18+%202024/red_wb%20(9).png","assets/portfolio/Карточки/18+%202024/%D0%A1%D0%BB%D0%B0%D0%B9%D0%B4_6_%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B9.png","assets/portfolio/Карточки/18+%202024/%D0%A1%D0%BB%D0%B0%D0%B9%D0%B4_7_%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B9.png","assets/portfolio/Карточки/18+%202024/%D0%A1%D0%BB%D0%B0%D0%B9%D0%B4_8_%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B9.png","assets/portfolio/Карточки/18+%202024/%D0%A1%D0%BB%D0%B0%D0%B9%D0%B4_9_%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B9.png"]'></div>
                            <div class="project-info">
                                <div class="project-type mono">КАРТОЧКИ ТОВАРОВ</div>
                                <h2 class="project-title">Сайт 18+</h2>
                                <p class="project-desc mono">Дизайн платформы с возрастным ограничением, фокус на UX и приватность.</p>
                            </div>
                        </div>
                        <div class="project-row" data-category="карточки">
                            <div class="project-visual format-adaptive placeholder hover-target gallery-trigger" 
                                style="background-image: url('assets/portfolio/Карточки/Gan%2065w/GaN.png'); background-size: cover; background-position: center;"
                                data-text=""
                                data-gallery='["assets/portfolio/Карточки/Gan%2065w/GaN.png","assets/portfolio/Карточки/Gan%2065w/%D0%91%D0%B5%D0%B7%D0%BE%D0%BF%D0%B0%D1%81%D0%BD%D0%BE%D1%81%D1%82%D1%8C.png","assets/portfolio/Карточки/Gan%2065w/%D0%93%D0%B0%D1%80%D0%B0%D0%BD%D1%82%D0%B8%D1%8F.png","assets/portfolio/Карточки/Gan%2065w/%D0%94%D0%BB%D1%8F%20%D0%BD%D0%BE%D1%83%D1%82%D0%B1%D1%83%D0%BA%D0%BE%D0%B2.png","assets/portfolio/Карточки/Gan%2065w/%D0%97%D0%B0%D0%B3%D0%BB%D0%B0%D0%B2%D0%BA%D0%B0-1.png","assets/portfolio/Карточки/Gan%2065w/%D0%97%D0%B0%D0%B3%D0%BB%D0%B0%D0%B2%D0%BA%D0%B0.png","assets/portfolio/Карточки/Gan%2065w/%D0%9A%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%82%D0%B0%D1%86%D0%B8%D1%8F.png","assets/portfolio/Карточки/Gan%2065w/%D0%9C%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%B0%D0%BB.png","assets/portfolio/Карточки/Gan%2065w/%D0%9F%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE.png","assets/portfolio/Карточки/Gan%2065w/%D0%A0%D0%B0%D0%B7%D0%BC%D0%B5%D1%80-1.png","assets/portfolio/Карточки/Gan%2065w/%D0%A0%D0%B0%D0%B7%D0%BC%D0%B5%D1%80.png","assets/portfolio/Карточки/Gan%2065w/%D0%A0%D0%B0%D1%81%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-1.png","assets/portfolio/Карточки/Gan%2065w/%D0%A0%D0%B0%D1%81%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5.png","assets/portfolio/Карточки/Gan%2065w/%D0%A1%D0%BE%D0%B2%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D0%BC%D0%BE%D1%81%D1%82%D1%8C.png","assets/portfolio/Карточки/Gan%2065w/%D0%A2%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D0%B8.png"]'></div>
                            <div class="project-info">
                                <div class="project-type mono">КАРТОЧКИ ТОВАРОВ</div>
                                <h2 class="project-title">GaN 65W Промо</h2>
                                <p class="project-desc mono">Разработка продающего лендинга и 3D визуализаций для электроники.</p>
                            </div>
                        </div>
                        <div class="project-row" data-category="карточки">
                            <div class="project-visual format-adaptive placeholder hover-target gallery-trigger" 
                                style="background-image: url('assets/portfolio/Карточки/Headphones%202024/photo_2023-10-24_16-26-09.jpg'); background-size: cover; background-position: center;"
                                data-text=""
                                data-gallery='["assets/portfolio/Карточки/Headphones%202024/photo_2023-10-24_16-26-09.jpg","assets/portfolio/Карточки/Headphones%202024/photo_2023-10-24_17-37-25%20(2).jpg","assets/portfolio/Карточки/Headphones%202024/photo_2023-10-24_17-37-25.jpg","assets/portfolio/Карточки/Headphones%202024/photo_2023-10-24_18-27-19.jpg"]'></div>
                            <div class="project-info">
                                <div class="project-type mono">КАРТОЧКИ ТОВАРОВ</div>
                                <h2 class="project-title">Наушники 2024</h2>
                                <p class="project-desc mono">Продуктовый лендинг и концепт дизайна для беспроводных наушников.</p>
                            </div>
                        </div>
                        <div class="project-row" data-category="карточки">
                            <div class="project-visual format-adaptive placeholder hover-target gallery-trigger" 
                                style="background-image: url('assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/01.png'); background-size: cover; background-position: center;"
                                data-text=""
                                data-gallery='["assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/01.png","assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/02-1.png","assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/02.png","assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/03.png","assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/04_1.png","assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/05.png","assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/06.png","assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/07.png","assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/08.png","assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/09.png","assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/10.png","assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/11.png","assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/13.png"]'></div>
                            <div class="project-info">
                                <div class="project-type mono">КАРТОЧКИ ТОВАРОВ</div>
                                <h2 class="project-title">БЗУ 3в1 Qi2</h2>
                                <p class="project-desc mono">Дизайн посадочной страницы для беспроводного зарядного устройства.</p>
                            </div>
                        </div>
                        <div class="project-row" data-category="реклама">
                            <div class="project-visual format-adaptive placeholder hover-target gallery-trigger" 
                                style="background-image: url('assets/portfolio/Реклама/1440_720%20%D0%A3%D0%9B%D0%98%D0%A6%D0%90-1.png'); background-size: cover; background-position: center;"
                                data-text=""
                                data-gallery='["assets/portfolio/Реклама/1440_720%20%D0%A3%D0%9B%D0%98%D0%A6%D0%90-1.png","assets/portfolio/Реклама/1440_720%20%D0%A3%D0%9B%D0%98%D0%A6%D0%90.png","assets/portfolio/Реклама/1440_720.png","assets/portfolio/Реклама/2160_3840%20%D0%9C%D0%95%D0%A2%D0%A0%D0%9E-1.png","assets/portfolio/Реклама/2160_3840%20%D0%9C%D0%95%D0%A2%D0%A0%D0%9E-2.png","assets/portfolio/Реклама/2160_3840%20%D0%9C%D0%95%D0%A2%D0%A0%D0%9E-3.png","assets/portfolio/Реклама/2160_3840%20%D0%9C%D0%95%D0%A2%D0%A0%D0%9E.png"]'></div>
                            <div class="project-info">
                                <div class="project-type mono">РЕКЛАМА</div>
                                <h2 class="project-title">Уличные баннеры</h2>
                                <p class="project-desc mono">Широкоформатная наружная реклама и живые фотографии.</p>
                            </div>
                        </div>
                        <div class="project-row" data-category="соцсети">
                            <div class="project-visual format-adaptive placeholder hover-target gallery-trigger" 
                                style="background-image: url('%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B8/Lobnya.jpg'); background-size: cover; background-position: center;"
                                data-text=""
                                data-gallery='["%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B8/Lobnya.jpg","%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B8/SRVVRS.jpg","%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B8/Starset.jpg"]'></div>
                            <div class="project-info">
                                <div class="project-type mono">СОЦ СЕТИ</div>
                                <h2 class="project-title">Обложки релизов</h2>
                                <p class="project-desc mono">Аватарки и обложки треков для музыкальных групп (Starset, Srvvrs).</p>
                            </div>
                        </div>
                    </div>
                </section>`;

const startIndex = html.indexOf('<section class="content-bleed" id="selected-works">');
const endIndex = html.indexOf('</section>', startIndex) + 10;

html = html.substring(0, startIndex) + revertedHTML + html.substring(endIndex);

// Revert floating title in lightbox
html = html.replace('<div id="lightbox-project-title" class="mono" style="position: absolute; top: 2rem; left: 2rem; color: var(--accent-color); font-size: 1.2rem; z-index: 100; background: rgba(0,0,0,0.8); padding: 0.5rem 1rem; border: 1px solid var(--accent-color);"></div>\n                <div id="lightbox-inner"', '<div id="lightbox-inner"');

fs.writeFileSync('index.html', html);
console.log('Reverted HTML');
