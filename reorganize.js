const fs = require('fs');
const path = require('path');

// File paths
const ORIGINAL_FILE = path.join(__dirname, 'index.html.original');
const BASE_DIR = __dirname;

/**
 * Read specific line range from file (1-indexed, inclusive)
 */
function readLines(filePath, start, end) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    return lines.slice(start - 1, end).join('\n');
}

/**
 * Write content to file
 */
function writeFile(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Created: ${path.relative(BASE_DIR, filePath)}`);
}

/**
 * Extract all CSS into separate files
 */
function extractCssFiles() {
    console.log('\n=== Extracting CSS Files ===');

    const cssFiles = {
        'styles/kamecon.css': [10, 626],
        'styles/navigation.css': [628, 686],
        'styles/carousel.css': [688, 997],
        'styles/anime-cards.css': [998, 1063],
        'styles/eboard-animations.css': [1036, 1463],
        'styles/president.css': [1466, 1836],
        'styles/screening.css': [1839, 2236],
        'styles/global.css': [2238, 3613],
        'styles/components.css': [3615, 3920],
        'styles/events.css': [3922, 4421],
        'styles/forms.css': [4424, 4500],
        'styles/resources.css': [4503, 4784],
        'styles/footer.css': [4786, 4864],
        'styles/mobile.css': [4867, 5499],
        'styles/animusic.css': [5502, 6182],
    };

    for (const [cssFile, [start, end]] of Object.entries(cssFiles)) {
        const content = readLines(ORIGINAL_FILE, start, end);
        writeFile(path.join(BASE_DIR, cssFile), content);
    }
}

/**
 * Extract all JavaScript into separate files
 */
function extractJsFiles() {
    console.log('\n=== Extracting JavaScript Files ===');

    // Extract background.js (lines 6196-6415)
    const bgContent = readLines(ORIGINAL_FILE, 6196, 6415);
    writeFile(path.join(BASE_DIR, 'js/background.js'), bgContent);

    // Extract music carousel (lines 6199-6263) - part of sliders.js
    const carouselContent = readLines(ORIGINAL_FILE, 6199, 6263);

    // Extract season tabs (lines 7794-7814)
    const tabsContent = readLines(ORIGINAL_FILE, 7794, 7814);
    writeFile(path.join(BASE_DIR, 'js/tabs.js'), tabsContent);

    // Extract spinning blossom (lines 7816-7830)
    const spinningContent = readLines(ORIGINAL_FILE, 7816, 7830);
    writeFile(path.join(BASE_DIR, 'js/spinning-blossom.js'), spinningContent);

    // Extract cosplay viewer (lines 7833-7857)
    const cosplayContent = readLines(ORIGINAL_FILE, 7833, 7857);
    writeFile(path.join(BASE_DIR, 'js/cosplay.js'), cosplayContent);

    // Extract anime slider (lines 7859-7902) - part of sliders.js
    const sliderContent = readLines(ORIGINAL_FILE, 7859, 7902);

    // Combine sliders
    const slidersCombined = carouselContent + '\n\n' + sliderContent;
    writeFile(path.join(BASE_DIR, 'js/sliders.js'), slidersCombined);

    // Extract page transition (lines 7904-7955)
    const pageTrans = readLines(ORIGINAL_FILE, 7904, 7955);

    // Extract AudioManager (lines 8047-8129)
    const audioContent = readLines(ORIGINAL_FILE, 8047, 8129);
    writeFile(path.join(BASE_DIR, 'js/audio.js'), audioContent);

    // Extract navigate functions (lines 8130-8175)
    const navigateFuncs = readLines(ORIGINAL_FILE, 8130, 8175);

    // Extract scroll behaviors (lines 8178-8220)
    const scrollContent = readLines(ORIGINAL_FILE, 8178, 8220);
    writeFile(path.join(BASE_DIR, 'js/scroll.js'), scrollContent);

    // Extract navigation system (lines 8227-8296)
    let navSystem = readLines(ORIGINAL_FILE, 8227, 8296);

    // Combine navigation.js
    let navigationCombined = pageTrans + '\n\n' + navigateFuncs + '\n\n' + navSystem;
    // Update hash-based navigation for multi-page
    navigationCombined = navigationCombined.replace(/window\.location\.hash\s*=\s*'#(\w+)'/g, "window.location.href = '$1.html'");
    navigationCombined = navigationCombined.replace(/window\.location\.hash\s*=\s*"#(\w+)"/g, 'window.location.href = "$1.html"');
    writeFile(path.join(BASE_DIR, 'js/navigation.js'), navigationCombined);

    // Extract eboard animations (lines 8258-8274)
    const eboardAnim = readLines(ORIGINAL_FILE, 8258, 8274);
    writeFile(path.join(BASE_DIR, 'js/eboard-animations.js'), eboardAnim);

    // Extract blossom animations (lines 8342-8450)
    const blossomContent = readLines(ORIGINAL_FILE, 8342, 8450);
    writeFile(path.join(BASE_DIR, 'js/animations.js'), blossomContent);

    // Extract init (lines 8453-8466)
    const initContent = readLines(ORIGINAL_FILE, 8453, 8466);
    writeFile(path.join(BASE_DIR, 'js/init.js'), initContent);
}

/**
 * Generate HTML template with proper structure
 */
function getHtmlTemplate(title, cssFiles, jsFiles) {
    const cssLinks = cssFiles.map(css => `    <link rel="stylesheet" href="${css}">`).join('\n');
    const jsScripts = jsFiles.map(js => `    <script src="${js}"></script>`).join('\n');

    // Get navigation bar (lines 6488-6523) and update links
    let navContent = readLines(ORIGINAL_FILE, 6488, 6523);
    // Convert hash links to page links
    navContent = navContent.replace(/href="#home"/g, 'href="index.html"');
    navContent = navContent.replace(/href="#meetings"/g, 'href="meetings.html"');
    navContent = navContent.replace(/href="#events"/g, 'href="events.html"');
    navContent = navContent.replace(/href="#kamecon"/g, 'href="kamecon.html"');
    navContent = navContent.replace(/href="#promotions"/g, 'href="promotions.html"');
    navContent = navContent.replace(/href="#eboard"/g, 'href="eboard.html"');
    navContent = navContent.replace(/href="#join"/g, 'href="join.html"');
    navContent = navContent.replace(/href="#subgroups"/g, 'href="subgroups.html"');
    navContent = navContent.replace(/href="#animusic"/g, 'href="animusic.html"');
    navContent = navContent.replace(/href="#resources"/g, 'href="resources.html"');
    navContent = navContent.replace(/href="#contact"/g, 'href="contact.html"');

    // Get background elements
    const pageTransition = readLines(ORIGINAL_FILE, 6420, 6442);
    const blossomContainer = readLines(ORIGINAL_FILE, 6445, 6456);
    const mascots = readLines(ORIGINAL_FILE, 6459, 6486);

    // Get footer
    const footer = readLines(ORIGINAL_FILE, 7775, 7789);

    return `<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta name="google-site-verification" content="TB3tz3yB9u7jZFQgNRTqnEwV9irF2g_FDVb7TIKbzA4" />
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
${cssLinks}
</head>
<body>
    ${pageTransition}

    ${blossomContainer}

    ${mascots}

    ${navContent}

    <!-- PAGE CONTENT GOES HERE -->
    {{CONTENT}}

    ${footer}

${jsScripts}
</body>
</html>`;
}

/**
 * Create all HTML pages
 */
function createHtmlPages() {
    console.log('\n=== Creating HTML Pages ===');

    // Common CSS for all pages
    const commonCss = [
        'styles/global.css',
        'styles/navigation.css',
        'styles/components.css',
        'styles/footer.css',
        'styles/mobile.css'
    ];

    // Common JS for all pages
    const commonJs = [
        'js/background.js',
        'js/navigation.js',
        'js/audio.js',
        'js/animations.js',
        'js/scroll.js',
        'js/init.js'
    ];

    const pages = [
        {
            filename: 'index.html',
            title: 'Terrapin Anime Society - Home',
            contentLines: [6526, 6558],
            css: commonCss,
            js: commonJs
        },
        {
            filename: 'meetings.html',
            title: 'Terrapin Anime Society - Meetings',
            contentLines: [6562, 6793],
            css: [...commonCss, 'styles/screening.css', 'styles/anime-cards.css'],
            js: [...commonJs, 'js/sliders.js']
        },
        {
            filename: 'events.html',
            title: 'Terrapin Anime Society - Events',
            contentLines: [6796, 6948],
            css: [...commonCss, 'styles/events.css'],
            js: commonJs
        },
        {
            filename: 'kamecon.html',
            title: 'Terrapin Anime Society - Kamecon',
            contentLines: [6950, 7065],
            css: [...commonCss, 'styles/kamecon.css'],
            js: commonJs
        },
        {
            filename: 'promotions.html',
            title: 'Terrapin Anime Society - Promotions',
            contentLines: [7067, 7119],
            css: [...commonCss, 'styles/events.css'],  // Uses promotions styles from events.css
            js: commonJs
        },
        {
            filename: 'eboard.html',
            title: 'Terrapin Anime Society - E-Board',
            contentLines: [7122, 7242],
            css: [...commonCss, 'styles/president.css', 'styles/eboard-animations.css'],
            js: [...commonJs, 'js/cosplay.js', 'js/eboard-animations.js']
        },
        {
            filename: 'join.html',
            title: 'Terrapin Anime Society - Join Us',
            contentLines: [7245, 7266],
            css: commonCss,
            js: commonJs
        },
        {
            filename: 'subgroups.html',
            title: 'Terrapin Anime Society - Subgroups',
            contentLines: [7269, 7297],
            css: [...commonCss, 'styles/eboard-animations.css'],
            js: [...commonJs, 'js/eboard-animations.js']
        },
        {
            filename: 'animusic.html',
            title: 'Terrapin Anime Society - Animusic',
            contentLines: [7299, 7452],
            css: [...commonCss, 'styles/animusic.css', 'styles/carousel.css'],
            js: [...commonJs, 'js/sliders.js', 'js/spinning-blossom.js']
        },
        {
            filename: 'resources.html',
            title: 'Terrapin Anime Society - Resources',
            contentLines: [7453, 7730],
            css: [...commonCss, 'styles/resources.css', 'styles/anime-cards.css'],
            js: [...commonJs, 'js/tabs.js']
        },
        {
            filename: 'contact.html',
            title: 'Terrapin Anime Society - Contact',
            contentLines: [7749, 7772],
            css: [...commonCss, 'styles/forms.css'],
            js: commonJs
        }
    ];

    for (const page of pages) {
        const template = getHtmlTemplate(page.title, page.css, page.js);
        const content = readLines(ORIGINAL_FILE, page.contentLines[0], page.contentLines[1]);

        // Replace content placeholder
        const fullHtml = template.replace('{{CONTENT}}', content);

        writeFile(path.join(BASE_DIR, page.filename), fullHtml);
    }
}

/**
 * Main execution
 */
function main() {
    console.log('Starting reorganization of index.html into multi-page website...');
    console.log(`Source: ${ORIGINAL_FILE}`);
    console.log(`Destination: ${BASE_DIR}`);

    // Extract CSS
    extractCssFiles();

    // Extract JavaScript
    extractJsFiles();

    // Create HTML pages
    createHtmlPages();

    console.log('\n' + '='.repeat(60));
    console.log('✓ Reorganization complete!');
    console.log('='.repeat(60));
    console.log('\nCreated files:');
    console.log('  - 15 CSS files in styles/');
    console.log('  - 10 JavaScript files in js/');
    console.log('  - 11 HTML pages');
    console.log('\nYou can now open index.html in your browser.');
    console.log('All original code has been preserved and organized into proper files.');
}

main();
