const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: "new"
    });
    const page = await browser.newPage();
    const htmlContent = fs.readFileSync(path.join(__dirname, 'cv.html'), 'utf8');
    await page.setContent(htmlContent, {waitUntil: 'networkidle0'});
    await page.pdf({ 
      path: path.join(__dirname, 'CV_Starlight.pdf'), 
      format: 'A4', 
      printBackground: true,
      margin: { top: '60px', bottom: '60px', left: '80px', right: '80px' }
    });
    await browser.close();
    console.log('PDF Generated successfully');
  } catch(e) {
    console.error('Error generating PDF:', e);
  }
})();
