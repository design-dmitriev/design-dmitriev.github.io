const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('<h2 class="project-title">Уличные баннеры</h2>', '<h2 class="project-title">Реклама</h2>');
html = html.replace('<h2 class="project-title">Обложки релизов</h2>', '<h2 class="project-title">Соц сети</h2>');

fs.writeFileSync('index.html', html);
console.log('Renamed HTML titles');
