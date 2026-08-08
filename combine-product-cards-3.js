const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const matches = [];
const regex = /<div class="project-row" data-category="карточки">\s*<div[^>]*data-gallery='(\[[^]*?\])'/g;
let match;
while ((match = regex.exec(html)) !== null) {
    matches.push(match[1]);
}

if (matches.length < 4) {
    console.log("Found less than 4 matches: " + matches.length);
    process.exit(1);
}

// matches[0] is 18+, matches[1] is GaN, matches[2] is Headphones, matches[3] is BZU
let combined = [];
for (let i = 0; i < matches.length; i++) {
    combined = combined.concat(JSON.parse(matches[i]));
}

const combinedStr = JSON.stringify(combined);

const newRow = `                        <div class="project-row" data-category="карточки">
                            <div class="project-visual format-adaptive placeholder hover-target gallery-trigger" 
                                style="background-image: url('assets/portfolio/Карточки/Gan%2065w/GaN.png'); background-size: cover; background-position: center;"
                                data-text=""
                                data-gallery='${combinedStr}'></div>
                            <div class="project-info">
                                <div class="project-type mono">КАРТОЧКИ ТОВАРОВ</div>
                                <h2 class="project-title">Карточки товаров</h2>
                                <p class="project-desc mono">Объединенная галерея всех дизайнов карточек товаров.</p>
                            </div>
                        </div>`;

const richContentEndIdx = html.indexOf('<div class="project-row" data-category="карточки">', html.indexOf('rich-content-project'));
const reklamaStartIdx = html.indexOf('<div class="project-row" data-category="реклама">');

if (richContentEndIdx !== -1 && reklamaStartIdx !== -1) {
    html = html.substring(0, richContentEndIdx) + newRow + '\\n' + html.substring(reklamaStartIdx);
    fs.writeFileSync('index.html', html);
    console.log("Success");
} else {
    console.log("Failed insertion");
}
