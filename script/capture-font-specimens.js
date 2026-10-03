import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, "../public/app/tempustoi/doc/images");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const htmlPath = path.resolve(__dirname, "../public/app/tempustoi/doc/font-specimens.html");
const fileUrl = "file://" + htmlPath.replace(/\\/g, "/");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 4500 },
    deviceScaleFactor: 2
  });

  console.log("Loading", fileUrl);
  await page.goto(fileUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1500));

  const specimens = [
    { id: "specimen-option-a-overview", file: "typography-option-a.png" },
    { id: "specimen-option-b-overview", file: "typography-option-b.png" },
    { id: "specimen-cinzel-decorative", file: "font-cinzel-decorative.png" },
    { id: "specimen-playfair-display-sc", file: "font-playfair-display-sc.png" },
    { id: "specimen-eb-garamond", file: "font-eb-garamond.png" },
    { id: "specimen-im-fell-english", file: "font-im-fell-english.png" },
    { id: "specimen-share-tech-mono", file: "font-share-tech-mono.png" },
    { id: "specimen-space-mono", file: "font-space-mono.png" },
    { id: "specimen-besley", file: "font-besley.png" },
    { id: "specimen-alfa-slab-one", file: "font-alfa-slab-one.png" },
    { id: "specimen-literata", file: "font-literata.png" },
    { id: "specimen-source-serif-4", file: "font-source-serif-4.png" },
    { id: "specimen-dm-mono", file: "font-dm-mono.png" }
  ];

  for (const item of specimens) {
    const locator = page.locator("#" + item.id);
    const destPath = path.join(outputDir, item.file);
    await locator.screenshot({ path: destPath });
    console.log("Captured", item.file);
  }

  await browser.close();
  console.log("All specimens captured successfully!");
}

run().catch((err) => {
  console.error("Error capturing specimens:", err);
  process.exit(1);
});
