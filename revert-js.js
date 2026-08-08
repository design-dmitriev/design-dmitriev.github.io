const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

// Revert add-title-js.js
js = js.replace(
    `const titleEl = document.getElementById('lightbox-project-title');
            if (titleEl) titleEl.textContent = '// ' + folder.toUpperCase();

            if (folder !== activeCategory) {`,
    'if (folder !== activeCategory) {'
);

// Revert fix-gallery-folders.js
js = js.replace(
    "const folder = (typeof currentData === 'string' && currentData.includes('/')) ? decodeURIComponent(currentData.split('/').slice(-2, -1)[0]) : 'Uncategorized';",
    "const folder = currentData.split('/')[2] || 'Uncategorized';"
);

js = js.replace(
    "const folderForCounter = (typeof currentData === 'string' && currentData.includes('/')) ? decodeURIComponent(currentData.split('/').slice(-2, -1)[0]) : 'Uncategorized';",
    "const folderForCounter = typeof currentData === 'string' ? (currentData.split('/')[2] || 'Uncategorized') : 'Uncategorized';"
);

js = js.replace(
    "const folder = (typeof item === 'string' && item.includes('/')) ? decodeURIComponent(item.split('/').slice(-2, -1)[0]) : 'Uncategorized';",
    "const folder = item.split('/')[2] || 'Uncategorized';"
);

fs.writeFileSync('script.js', js);
console.log('Reverted JS');
