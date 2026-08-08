const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Extract the data-gallery JSON strings from the 4 rows
const s18 = html.match(/data-gallery='(\\["assets\\/portfolio\\/Карточки\\/18\\+%202024[^\\]]*\\])'/);
const gan = html.match(/data-gallery='(\\["assets\\/portfolio\\/Карточки\\/Gan%2065w[^\\]]*\\])'/);
const head = html.match(/data-gallery='(\\["assets\\/portfolio\\/Карточки\\/Headphones%202024[^\\]]*\\])'/);
const bzu = html.match(/data-gallery='(\\["assets\\/portfolio\\/Карточки\\/%D0%91%D0%97%D0%A3[^\\]]*\\])'/);

if (!s18 || !gan || !head || !bzu) {
    console.log("Failed to find one of the data-gallery arrays.");
    process.exit(1);
}

// 2. Parse and merge them
let combinedArray = [];
try {
    combinedArray = combinedArray.concat(JSON.parse(s18[1]));
    combinedArray = combinedArray.concat(JSON.parse(gan[1]));
    combinedArray = combinedArray.concat(JSON.parse(head[1]));
    combinedArray = combinedArray.concat(JSON.parse(bzu[1]));
} catch (e) {
    console.log("Error parsing JSON");
    process.exit(1);
}

const combinedGalleryStr = JSON.stringify(combinedArray);

// 3. Create the new combined project-row HTML
const newRow = `
                        <div class="project-row" data-category="карточки">
                            <div class="project-visual format-adaptive placeholder hover-target gallery-trigger" 
                                style="background-image: url('assets/portfolio/Карточки/Gan%2065w/GaN.png'); background-size: cover; background-position: center;"
                                data-text=""
                                data-gallery='${combinedGalleryStr}'></div>
                            <div class="project-info">
                                <div class="project-type mono">КАРТОЧКИ ТОВАРОВ</div>
                                <h2 class="project-title">Сборник карточек</h2>
                                <p class="project-desc mono">Объединенная галерея всех дизайнов карточек товаров (GaN, Наушники, 18+, БЗУ).</p>
                            </div>
                        </div>
`;

// 4. Remove the 4 old rows and insert the new one
// First, find the boundary after Rich Content
const richContentEndIdx = html.indexOf('<div class="project-row" data-category="карточки">', html.indexOf('rich-content-project'));

// Next, find where "Реклама" starts
const reklamaStartIdx = html.indexOf('<div class="project-row" data-category="реклама">');

if (richContentEndIdx !== -1 && reklamaStartIdx !== -1) {
    html = html.substring(0, richContentEndIdx) + newRow + html.substring(reklamaStartIdx);
    fs.writeFileSync('index.html', html);
    console.log("Successfully combined the 4 project cards into 1.");
} else {
    console.log("Failed to find insertion boundaries.");
}
