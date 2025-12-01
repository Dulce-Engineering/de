const fs = require('fs-extra');
const path = require('path');

// --- Configuration ---
const ASSETS_DIR = path.join(__dirname, 'dist'); // Directory containing your finished HTML, CSS, and JS files
const VERSION_FILE = path.join(__dirname, 'package.json');
const FILES_TO_UPDATE = [
    // Add paths relative to ASSETS_DIR here:
    'index.html',
    'about/index.html',
    'css/style.css', 
    // ... add all relevant files
];
// ---------------------

/**
 * 1. Reads the current version from package.json
 * 2. Increments the patch version (e.g., 1.0.0 -> 1.0.1)
 * 3. Updates package.json
 * 4. Replaces the old version string with the new version string in specified files.
 */
async function runCacheBuster() {
    try {
        // --- Step 1 & 2: Get and Increment Version ---
        const pkg = await fs.readJson(VERSION_FILE);
        const oldVersion = pkg.version;
        
        // Simple function to increment the patch version (X.Y.Z -> X.Y.(Z+1))
        const [major, minor, patch] = oldVersion.split('.').map(Number);
        const newVersion = `${major}.${minor}.${patch + 1}`;
        
        // --- Step 3: Update package.json ---
        pkg.version = newVersion;
        await fs.writeJson(VERSION_FILE, pkg, { spaces: 2 });
        console.log(`✅ Version updated: ${oldVersion} -> ${newVersion}`);
        
        // --- Step 4: Update Files for Cache Busting ---
        console.log('\nStarting cache busting...');
        const oldVersionRegex = new RegExp(`v=${oldVersion.replace(/\./g, '\\.')}`, 'g');
        const newVersionString = `v=${newVersion}`;

        for (const relativeFilePath of FILES_TO_UPDATE) {
            const absolutePath = path.join(ASSETS_DIR, relativeFilePath);
            let content = await fs.readFile(absolutePath, 'utf8');

            // Replace the old version query parameter with the new one
            const newContent = content.replace(oldVersionRegex, newVersionString);

            if (content !== newContent) {
                await fs.writeFile(absolutePath, newContent, 'utf8');
                console.log(`- Updated: ${relativeFilePath}`);
            } else {
                console.warn(`- Skipped: ${relativeFilePath} (No version change found)`);
            }
        }
        
        console.log('\n✨ Cache busting complete!');

    } catch (error) {
        console.error('❌ An error occurred during cache busting:', error.message);
        process.exit(1);
    }
}

runCacheBuster();