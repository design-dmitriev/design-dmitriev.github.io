const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

html = html.replaceAll('assets/portfolio/18+%202024/', 'assets/portfolio/Карточки/18+%202024/');
html = html.replaceAll('assets/portfolio/Gan%2065w/', 'assets/portfolio/Карточки/Gan%2065w/');
html = html.replaceAll('assets/portfolio/Headphones%202024/', 'assets/portfolio/Карточки/Headphones%202024/');
html = html.replaceAll('assets/portfolio/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/', 'assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/');
html = html.replaceAll('assets/portfolio/banners/', 'assets/portfolio/Реклама/');

fs.writeFileSync('index.html', html);
console.log('Image paths updated successfully.');
