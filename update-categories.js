const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the WEB filter button
html = html.replace(/<button class="filter-btn hover-target" data-filter="web"[^>]*>WEB \/ UI<\/button>\s*/, '');

// 2. Change the category of "Сайт 18+" to "карточки"
// We know it was set to data-category="web" by our previous script
html = html.replace(/<div class="project-row" data-category="web">([\s\S]*?<h2 class="project-title"[^>]*>Сайт 18\+<\/h2>)/, '<div class="project-row" data-category="карточки">$1');

fs.writeFileSync('index.html', html);
console.log('Categories updated!');
