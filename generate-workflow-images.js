const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function generateMermaidImage(mermaidCode, outputPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Create HTML with Mermaid
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({
          startOnLoad: true,
          theme: 'default',
          themeVariables: {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif'
          }
        });
      </script>
      <style>
        body {
          margin: 0;
          padding: 20px;
          background: white;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .mermaid {
          background: white;
        }
      </style>
    </head>
    <body>
      <div class="mermaid">
${mermaidCode}
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);

  // Wait for Mermaid to render
  await page.waitForTimeout(2000);

  // Get the rendered diagram dimensions
  const element = await page.$('.mermaid svg');
  if (element) {
    const boundingBox = await element.boundingBox();

    // Add some padding
    const padding = 40;
    await page.setViewportSize({
      width: Math.ceil(boundingBox.width + padding * 2),
      height: Math.ceil(boundingBox.height + padding * 2)
    });

    // Wait a bit more for re-render
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({
      path: outputPath,
      fullPage: true
    });

    console.log(`✓ Generated: ${outputPath}`);
  }

  await browser.close();
}

async function extractMermaidDiagrams(mdFilePath) {
  const content = await fs.readFile(mdFilePath, 'utf-8');
  const diagrams = [];

  // Extract all mermaid code blocks
  const regex = /```mermaid\n([\s\S]*?)```/g;
  let match;
  let index = 1;

  while ((match = regex.exec(content)) !== null) {
    diagrams.push({
      code: match[1],
      index: index++
    });
  }

  return diagrams;
}

async function main() {
  console.log('🎨 Generating workflow diagrams...\n');

  const mdFile = path.join(__dirname, 'workflow-diagram.md');
  const outputDir = path.join(__dirname, 'workflow-images');

  // Create output directory
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (e) {
    // Directory exists
  }

  // Extract diagrams
  const diagrams = await extractMermaidDiagrams(mdFile);
  console.log(`Found ${diagrams.length} diagrams\n`);

  // Generate images
  const diagramNames = [
    'overall-system-architecture',
    'agent-code-site-workflow',
    'tree-support-site-user-flow',
    'tree-map-app-data-flow',
    'git-workflow-integration',
    'technology-stack-overview',
    'system-data-flow',
    'component-communication-matrix'
  ];

  for (let i = 0; i < diagrams.length; i++) {
    const diagram = diagrams[i];
    const name = diagramNames[i] || `diagram-${diagram.index}`;
    const outputPath = path.join(outputDir, `${name}.png`);

    console.log(`Generating ${name}...`);
    await generateMermaidImage(diagram.code, outputPath);
  }

  console.log('\n✅ All diagrams generated successfully!');
  console.log(`📁 Output directory: ${outputDir}`);
}

main().catch(console.error);
