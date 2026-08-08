const fs = require('fs');

const data = JSON.parse(fs.readFileSync('gallery-data.json', 'utf8'));

let html = '';
data.forEach(project => {
    html += `
                        <div class="project-row">
                            <div class="project-visual format-adaptive placeholder hover-target gallery-trigger" 
                                style="background-image: url('${project.thumbnail}'); ${project.customStyle}"
                                data-text=""
                                data-gallery='${JSON.stringify(project.images)}'></div>
                            <div class="project-info">
                                <div class="project-type mono">${project.type}</div>
                                <h2 class="project-title">${project.title}</h2>
                                <p class="project-desc mono">${project.desc}</p>
                            </div>
                        </div>`;
});

let indexContent = fs.readFileSync('index.html', 'utf8');
indexContent = indexContent.replace(
    '<div id="dynamic-projects-container" style="display: contents;"></div>',
    html
);
fs.writeFileSync('index.html', indexContent);
console.log('Projects statically injected into index.html');
