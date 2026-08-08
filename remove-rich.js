const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('<div class="project-row" data-category="карточки" id="rich-content-project">');
const end = html.indexOf('<!-- Сюда будут динамически добавляться проекты', start);

if (start !== -1 && end !== -1) {
    html = html.substring(0, start) + html.substring(end);
    fs.writeFileSync('index.html', html);
    console.log('Removed Rich Content block');
} else {
    console.log('Could not find boundaries');
}
