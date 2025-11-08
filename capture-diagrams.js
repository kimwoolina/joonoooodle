const { chromium } = require('playwright');
const path = require('path');

async function captureHTML() {
  console.log('🎨 Capturing workflow diagrams...\n');

  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const htmlPath = path.join(__dirname, 'workflow-diagrams.html');
    const outputDir = path.join(__dirname, 'workflow-images');

    // Create context and page
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Load the HTML file
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

    // Wait for Mermaid to render all diagrams
    console.log('Waiting for diagrams to render...');
    await page.waitForTimeout(5000);

    // Take full page screenshot
    const fullPagePath = path.join(outputDir, 'all-diagrams.png');
    await page.screenshot({
      path: fullPagePath,
      fullPage: true
    });
    console.log(`✓ Saved full page: ${fullPagePath}`);

    // Capture individual sections
    const sections = [
      { id: 'section1', name: 'overall-system-architecture' },
      { id: 'section2', name: 'agent-code-site-workflow' },
      { id: 'section3', name: 'tree-support-site-user-flow' },
      { id: 'section4', name: 'tree-map-app-data-flow' },
      { id: 'section5', name: 'git-workflow-integration' },
      { id: 'section6', name: 'technology-stack-overview' },
      { id: 'section7', name: 'system-data-flow' },
      { id: 'section8', name: 'component-communication-matrix' }
    ];

    for (const section of sections) {
      const element = await page.$(`#${section.id}`);
      if (element) {
        const outputPath = path.join(outputDir, `${section.name}.png`);
        await element.screenshot({ path: outputPath });
        console.log(`✓ Saved: ${section.name}.png`);
      }
    }

    console.log('\n✅ All diagrams captured successfully!');
    console.log(`📁 Output directory: ${outputDir}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

captureHTML().catch(console.error);
