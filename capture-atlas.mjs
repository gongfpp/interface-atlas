import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'http://localhost:4321';
const OUTPUT_DIR = path.join(__dirname, 'out/textures');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2
  });

  try {
    console.log('📸 Capturing Interface Atlas homepage...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);

    await page.screenshot({ path: `${OUTPUT_DIR}/homepage-2x.png`, fullPage: false });
    console.log(`✅ Homepage captured`);

    // 生成 layout.json
    const layoutJson = {
      pageWidth: 1920,
      pageHeight: 1080,
      elements: {
        searchBox: { x: 100, y: 100, w: 1720, h: 60 },
        resultCards: [
          { x: 100, y: 200, w: 1720, h: 150 },
          { x: 100, y: 370, w: 1720, h: 150 },
          { x: 100, y: 540, w: 1720, h: 150 }
        ],
        ctaButton: { x: 700, y: 850, w: 520, h: 60 }
      }
    };

    fs.writeFileSync(
      `${OUTPUT_DIR}/layout.json`,
      JSON.stringify(layoutJson, null, 2)
    );
    console.log(`✅ layout.json generated`);

    const files = fs.readdirSync(OUTPUT_DIR);
    console.log(`\n📦 All done! Files: ${files.join(', ')}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
