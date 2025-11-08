const fs = require('fs');
const path = require('path');

function extractMermaidDiagrams(mdFilePath) {
  const content = fs.readFileSync(mdFilePath, 'utf-8');
  const diagrams = [];

  // Extract all mermaid code blocks
  const regex = /```mermaid\n([\s\S]*?)```/g;
  let match;
  let index = 1;

  while ((match = regex.exec(content)) !== null) {
    diagrams.push({
      code: match[1].trim(),
      index: index++
    });
  }

  return diagrams;
}

function generateMermaidInkURL(mermaidCode) {
  // Encode the mermaid code to base64
  const encoded = Buffer.from(mermaidCode).toString('base64');
  // Remove padding
  const trimmed = encoded.replace(/=/g, '');
  return `https://mermaid.ink/img/${trimmed}`;
}

function main() {
  console.log('🎨 Generating Mermaid.ink image URLs...\n');

  const mdFile = path.join(__dirname, 'workflow-diagram.md');
  const diagrams = extractMermaidDiagrams(mdFile);

  const diagramNames = [
    'Overall System Architecture',
    'Agent Code Site - Detailed Workflow',
    'Tree Support Site - User Flow',
    'Tree Map App - Data Flow',
    'Git Workflow Integration',
    'Technology Stack Overview',
    'System Data Flow',
    'Component Communication Matrix'
  ];

  let markdown = '# Joonoooodle Project Workflow - Image Links\n\n';
  markdown += 'Generated Mermaid diagram images using [Mermaid.ink](https://mermaid.ink/)\n\n';
  markdown += '---\n\n';

  diagrams.forEach((diagram, i) => {
    const name = diagramNames[i] || `Diagram ${diagram.index}`;
    const url = generateMermaidInkURL(diagram.code);

    console.log(`${i + 1}. ${name}`);
    console.log(`   URL: ${url}\n`);

    markdown += `## ${i + 1}. ${name}\n\n`;
    markdown += `![${name}](${url})\n\n`;
    markdown += `**Direct Link:** ${url}\n\n`;
    markdown += '---\n\n';
  });

  // Save markdown file with image links
  const outputFile = path.join(__dirname, 'WORKFLOW_IMAGES.md');
  fs.writeFileSync(outputFile, markdown);

  console.log(`\n✅ Generated image links markdown: ${outputFile}`);
  console.log('\n📝 You can open WORKFLOW_IMAGES.md to view all diagram images!');
}

main();
