const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf8');

js = js.replace(
    "const folder = currentData.split('/')[2] || 'Uncategorized';",
    "const folder = (typeof currentData === 'string' && currentData.includes('/')) ? decodeURIComponent(currentData.split('/').slice(-2, -1)[0]) : 'Uncategorized';"
);

js = js.replace(
    "const folderForCounter = typeof currentData === 'string' ? (currentData.split('/')[2] || 'Uncategorized') : 'Uncategorized';",
    "const folderForCounter = (typeof currentData === 'string' && currentData.includes('/')) ? decodeURIComponent(currentData.split('/').slice(-2, -1)[0]) : 'Uncategorized';"
);

js = js.replace(
    "const folder = item.split('/')[2] || 'Uncategorized';",
    "const folder = (typeof item === 'string' && item.includes('/')) ? decodeURIComponent(item.split('/').slice(-2, -1)[0]) : 'Uncategorized';"
);

fs.writeFileSync('script.js', js);
console.log('Fixed folder parsing logic!');
