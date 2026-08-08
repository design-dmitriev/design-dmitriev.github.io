const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The project titles we want to update
const updates = [
    { title: 'Рич-контент', cat: 'карточки', type: 'КАРТОЧКИ ТОВАРОВ' },
    { title: 'Сайт 18+', cat: 'карточки', type: 'КАРТОЧКИ ТОВАРОВ' },
    { title: 'GaN 65W Промо', cat: 'карточки', type: 'КАРТОЧКИ ТОВАРОВ' },
    { title: 'Наушники 2024', cat: 'карточки', type: 'КАРТОЧКИ ТОВАРОВ' },
    { title: 'БЗУ 3в1 Qi2', cat: 'карточки', type: 'КАРТОЧКИ ТОВАРОВ' },
    { title: 'Уличные баннеры', cat: 'реклама', type: 'РЕКЛАМА' },
    { title: 'Обложки релизов', cat: 'соцсети', type: 'СОЦ СЕТИ' }
];

updates.forEach(u => {
    // We need to find the project-row that contains this title.
    // Since JS regex can be tricky with newlines, we'll split the HTML by '<div class="project-row'
    
    let parts = html.split('<div class="project-row');
    for (let i = 1; i < parts.length; i++) {
        if (parts[i].includes(`>${u.title}<`)) {
            // This is the part for this project.
            
            // 1. Ensure data-category is set.
            // Replace any existing data-category="..." with nothing, then add the new one.
            parts[i] = parts[i].replace(/data-category="[^"]*"/, '');
            // Now add data-category to the very beginning (right after '<div class="project-row')
            parts[i] = `" data-category="${u.cat}"` + (parts[i].startsWith('"') ? parts[i].substring(1) : parts[i]);
            
            // 2. Change the project-type text
            // It looks like: <div class="project-type mono">WEB_ДИЗАЙН</div>
            parts[i] = parts[i].replace(/<div class="project-type mono"[^>]*>.*?<\/div>/, `<div class="project-type mono">${u.type}</div>`);
            
            break;
        }
    }
    html = parts.join('<div class="project-row');
});

fs.writeFileSync('index.html', html);
console.log('Fixed projects categories and labels');
