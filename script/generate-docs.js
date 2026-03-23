/**
 * Documentation Generator Script
 * Generates markdown documentation from JSDoc comments for whitelisted components
 */

const fs = require("fs");
const path = require("path");
const jsdoc2md = require("jsdoc-to-markdown");

// ===== WHITELIST CONFIGURATION =====
// Add component names here to include them in documentation generation
const WHITELISTED_COMPONENTS = [
  "DeDialogAlert",
  "DeLineChart",
];

// ===== CONFIGURATION =====
const COMPONENTS_DIR = path.join(__dirname, "../public/component");
const DOCS_DIR = path.join(__dirname, "../docs");
const DOCS_FILE = path.join(DOCS_DIR, "COMPONENTS.md");

// Ensure docs directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
  console.log(`✓ Created docs directory: ${DOCS_DIR}`);
}

// ===== MAIN LOGIC =====
async function generateDocumentation() {
  try {
    console.log("🔍 Generating documentation for whitelisted components...\n");

    // Find component index.js files for whitelisted components
    const filesToDocument = [];

    for (const componentName of WHITELISTED_COMPONENTS) {
      const componentPath = path.join(COMPONENTS_DIR, componentName, "index.js");
      
      if (fs.existsSync(componentPath)) {
        filesToDocument.push(componentPath);
        console.log(`✓ Found: ${componentName}`);
      } else {
        console.warn(`⚠ Not found: ${componentName} (expected at ${componentPath})`);
      }
    }

    if (filesToDocument.length === 0) {
      console.error("❌ No whitelisted components found!");
      process.exit(1);
    }

    console.log(`\n📝 Generating documentation for ${filesToDocument.length} component(s)...\n`);

    // Generate markdown documentation
    const markdown = await jsdoc2md.render({
      files: filesToDocument,
      "no-gfm": false,
      "module-index-format": "table",
    });

    // Prepend header
    const header = `# Component Documentation\n\nAuto-generated from JSDoc comments.\n\n`;
    const fullMarkdown = header + markdown;

    // Write to file
    fs.writeFileSync(DOCS_FILE, fullMarkdown);
    console.log(`✅ Documentation generated successfully!`);
    console.log(`📄 Output: ${DOCS_FILE}\n`);

  } catch (error) {
    console.error("❌ Error generating documentation:", error.message);
    process.exit(1);
  }
}

// Run the generator
generateDocumentation();
