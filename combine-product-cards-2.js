const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The lines are exactly:
// data-gallery='["assets/portfolio/Карточки/18+%202024/photo_2024-01-26_11-33-56.jpg",...]'
// data-gallery='["assets/portfolio/Карточки/Gan%2065w/GaN.png",...]'
// data-gallery='["assets/portfolio/Карточки/Headphones%202024/photo_2023-10-24_16-26-09.jpg",...]'
// data-gallery='["assets/portfolio/Карточки/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2/01.png",...]'

const regex18 = /data-gallery='(\\["assets\\/portfolio\\/Карточки\\/18\\+%202024[^\\]]*\\])'/;
const regexGan = /data-gallery='(\\["assets\\/portfolio\\/Карточки\\/Gan%2065w[^\\]]*\\])'/;
const regexHead = /data-gallery='(\\["assets\\/portfolio\\/Карточки\\/Headphones%202024[^\\]]*\\])'/;
const regexBzu = /data-gallery='(\\["assets\\/portfolio\\/Карточки\\/%D0%91%D0%97%D0%A3%203%D0%B21%20Qi2[^\\]]*\\])'/;

const m18 = html.match(regex18);
const mGan = html.match(regexGan);
const mHead = html.match(regexHead);
const mBzu = html.match(regexBzu);

if (!m18 || !mGan || !mHead || !mBzu) {
    console.error("Missing a match!");
    process.exit(1);
}

let combined = [];
combined = combined.concat(JSON.parse(m18[1]));
combined = combined.concat(JSON.parse(mGan[1]));
combined = combined.concat(JSON.parse(mHead[1]));
combined = combined.concat(JSON.parse(mBzu[1]));

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
