import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tree species with colors and Korean names
const treeSpecies = [
  { id: 'pine', name: 'Korean Red Pine', name_ko: '소나무', colors: ['#2D5016', '#3A6B1F', '#234012'] },
  { id: 'ginkgo', name: 'Ginkgo', name_ko: '은행나무', colors: ['#FFD700', '#FFA500', '#FFB90F'] },
  { id: 'zelkova', name: 'Zelkova', name_ko: '느티나무', colors: ['#90EE90', '#7CCD7C', '#6B8E6B'] },
  { id: 'mountain-ash', name: 'Korean Mountain Ash', name_ko: '마가목', colors: ['#FF8C00', '#FF7F50', '#FF6347'] },
  { id: 'cherry', name: 'Cherry Blossom', name_ko: '벚나무', colors: ['#FFB6C1', '#FFC0CB', '#FFD1DC'] },
  { id: 'maple', name: 'Japanese Maple', name_ko: '단풍나무', colors: ['#DC143C', '#B22222', '#8B0000'] },
  { id: 'redwood', name: 'Dawn Redwood', name_ko: '메타세쿼이아', colors: ['#8B4513', '#A0522D', '#6B4423'] },
  { id: 'oak', name: 'Korean Oak', name_ko: '참나무', colors: ['#228B22', '#2E8B57', '#3CB371'] },
  { id: 'persimmon', name: 'Persimmon', name_ko: '감나무', colors: ['#FFA500', '#FF8C00', '#FF7F00'] },
  { id: 'magnolia', name: 'Magnolia', name_ko: '목련', colors: ['#FFF0F5', '#FFE4E1', '#FFB6C1'] },
  { id: 'crape-myrtle', name: 'Crape Myrtle', name_ko: '배롱나무', colors: ['#BA55D3', '#9370DB', '#8B008B'] },
  { id: 'hackberry', name: 'Hackberry', name_ko: '팽나무', colors: ['#6B8E23', '#808000', '#556B2F'] }
];

function generateTreeSVG(species, colorIndex) {
  const color = species.colors[colorIndex];
  const darkerColor = adjustBrightness(color, -30);
  const variation = colorIndex + 1;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="sky-${species.id}-${variation}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="tree-${species.id}-${variation}" cx="50%" cy="50%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${darkerColor};stop-opacity:1" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="600" fill="url(#sky-${species.id}-${variation})"/>

  <!-- Ground -->
  <rect y="450" width="800" height="150" fill="#8B7355"/>

  <!-- Tree trunk -->
  <rect x="380" y="350" width="40" height="150" fill="#4A3728"/>

  <!-- Tree foliage (shape varies by type) -->
  ${getTreeShape(species.id, variation)}

  <!-- Label -->
  <text x="400" y="550" font-family="Arial, sans-serif" font-size="28" fill="#2C3E50" text-anchor="middle" font-weight="bold">${species.name_ko} (${species.name})</text>
</svg>`;
}

function getTreeShape(treeId, variation) {
  const shapes = {
    'pine': `
  <polygon points="400,150 300,250 500,250" fill="url(#tree-${treeId}-${variation})"/>
  <polygon points="400,200 320,280 480,280" fill="url(#tree-${treeId}-${variation})" opacity="0.9"/>
  <polygon points="400,250 340,320 460,320" fill="url(#tree-${treeId}-${variation})" opacity="0.8"/>
  <polygon points="400,300 360,370 440,370" fill="url(#tree-${treeId}-${variation})" opacity="0.7"/>`,

    'ginkgo': `
  <circle cx="400" cy="280" r="120" fill="url(#tree-${treeId}-${variation})"/>
  <circle cx="350" cy="300" r="80" fill="url(#tree-${treeId}-${variation})" opacity="0.8"/>
  <circle cx="450" cy="300" r="80" fill="url(#tree-${treeId}-${variation})" opacity="0.8"/>`,

    'cherry': `
  <ellipse cx="400" cy="260" rx="150" ry="130" fill="url(#tree-${treeId}-${variation})"/>
  <ellipse cx="350" cy="290" rx="90" ry="80" fill="url(#tree-${treeId}-${variation})" opacity="0.9"/>
  <ellipse cx="450" cy="290" rx="90" ry="80" fill="url(#tree-${treeId}-${variation})" opacity="0.9"/>`,

    'maple': `
  <polygon points="400,180 320,280 350,350 450,350 480,280" fill="url(#tree-${treeId}-${variation})"/>
  <circle cx="400" cy="250" r="70" fill="url(#tree-${treeId}-${variation})" opacity="0.9"/>`,

    'default': `
  <ellipse cx="400" cy="270" rx="130" ry="120" fill="url(#tree-${treeId}-${variation})"/>
  <ellipse cx="360" cy="300" rx="80" ry="70" fill="url(#tree-${treeId}-${variation})" opacity="0.85"/>
  <ellipse cx="440" cy="300" rx="80" ry="70" fill="url(#tree-${treeId}-${variation})" opacity="0.85"/>`
  };

  return shapes[treeId] || shapes['default'];
}

function adjustBrightness(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

// Generate all SVG files
console.log('Generating tree SVG images...');

treeSpecies.forEach(species => {
  [0, 1, 2].forEach(colorIndex => {
    const filename = `${species.id}-${colorIndex + 1}.svg`;
    const filepath = path.join(__dirname, filename);
    const svgContent = generateTreeSVG(species, colorIndex);

    fs.writeFileSync(filepath, svgContent, 'utf-8');
    console.log(`✓ Created ${filename}`);
  });
});

console.log(`\n✅ Generated ${treeSpecies.length * 3} tree images successfully!`);
