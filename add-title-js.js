const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

js = js.replace(
    'if (folder !== activeCategory) {',
    `const titleEl = document.getElementById('lightbox-project-title');
            if (titleEl) titleEl.textContent = '// ' + folder.toUpperCase();

            if (folder !== activeCategory) {`
);

fs.writeFileSync('script.js', js);
console.log('Added title to JS');
