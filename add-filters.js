const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add filter UI
const filterUI = `
                    <div class="gallery-filters mono" style="display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid var(--grid-line); padding-bottom: 1rem; flex-wrap: wrap;">
                        <button class="filter-btn hover-target active" data-filter="all" style="background:transparent; border:none; color:var(--hero-accent); cursor:pointer;">ВСЕ</button>
                        <button class="filter-btn hover-target" data-filter="карточки" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer;">КАРТОЧКИ ТОВАРОВ</button>
                        <button class="filter-btn hover-target" data-filter="реклама" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer;">РЕКЛАМА</button>
                        <button class="filter-btn hover-target" data-filter="соцсети" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer;">СОЦ СЕТИ</button>
                        <button class="filter-btn hover-target" data-filter="web" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer;">WEB / UI</button>
                    </div>
                    <div class="projects-list">`;

html = html.replace('<div class="projects-list">', filterUI);

// 2. Assign categories
html = html.replace(/<div class="project-row" id="rich-content-project">/, '<div class="project-row" data-category="карточки" id="rich-content-project">');
html = html.replace(/<h2 class="project-title">Сайт 18\+<\/h2>/, '<h2 class="project-title" data-cat="web">Сайт 18+</h2>');
html = html.replace(/<h2 class="project-title">Уличные баннеры<\/h2>/, '<h2 class="project-title" data-cat="реклама">Уличные баннеры</h2>');
html = html.replace(/<h2 class="project-title">GaN 65W Промо<\/h2>/, '<h2 class="project-title" data-cat="карточки">GaN 65W Промо</h2>');
html = html.replace(/<h2 class="project-title">Наушники 2024<\/h2>/, '<h2 class="project-title" data-cat="карточки">Наушники 2024</h2>');
html = html.replace(/<h2 class="project-title">БЗУ 3в1 Qi2<\/h2>/, '<h2 class="project-title" data-cat="карточки">БЗУ 3в1 Qi2</h2>');
html = html.replace(/<h2 class="project-title">Обложки релизов<\/h2>/, '<h2 class="project-title" data-cat="соцсети">Обложки релизов</h2>');

// Add data-category to project-rows based on the h2 data-cat
html = html.replace(/<div class="project-row">\s*(?:.*?)\s*(?:.*?)\s*(?:.*?)\s*(?:.*?)\s*<h2 class="project-title" data-cat="([^"]+)">/g, (match, cat) => {
    return match.replace('<div class="project-row">', `<div class="project-row" data-category="${cat}">`);
});

fs.writeFileSync('index.html', html);
console.log('Filters added to index.html');
