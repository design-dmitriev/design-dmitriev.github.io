const fs = require('fs');
const jsCode = fs.readFileSync('gallery-filters.js', 'utf8');
fs.appendFileSync('script.js', '\n' + jsCode);
console.log('Appended filters to script.js');
