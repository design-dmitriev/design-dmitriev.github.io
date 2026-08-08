const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('<div id="lightbox-inner"', '<div id="lightbox-project-title" class="mono" style="position: absolute; top: 2rem; left: 2rem; color: var(--accent-color); font-size: 1.2rem; z-index: 100; background: rgba(0,0,0,0.8); padding: 0.5rem 1rem; border: 1px solid var(--accent-color);"></div>\n                <div id="lightbox-inner"');
fs.writeFileSync('index.html', html);
console.log('Added title to HTML');
