const fs = require('fs');
let content = fs.readFileSync('styles.css', 'utf8');
const searchString = 'z-index: 100;\n    }\n}';
const index = content.lastIndexOf(searchString);
if (index !== -1) {
    const cleanContent = content.substring(0, index + searchString.length);
    const cssPatch = `

.career-text-panel *, .text-block * {
    font-family: 'mononoki', monospace !important;
}

.header-contact-btn {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s ease, border-color 0.3s, color 0.3s !important;
    transform: translateX(-50%) translateY(-10px) !important;
}

.header-contact-btn.visible {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0) !important;
}`;
    fs.writeFileSync('styles.css', cleanContent + cssPatch);
    console.log('Fixed styles.css');
}
