import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Create simple PNG images (solid colors for each tree type)
const treeColors = {
  'pine': { r: 45, g: 80, b: 22 },      // Dark green
  'ginkgo': { r: 255, g: 215, b: 0 },    // Gold
  'zelkova': { r: 144, g: 238, b: 144 }, // Light green
  'mountain-ash': { r: 255, g: 140, b: 0 }, // Orange
  'cherry': { r: 255, g: 182, b: 193 },  // Pink
  'maple': { r: 220, g: 20, b: 60 },     // Red
  'redwood': { r: 139, g: 69, b: 19 },   // Brown
  'oak': { r: 34, g: 139, b: 34 },       // Forest green
  'persimmon': { r: 255, g: 165, b: 0 }, // Orange
  'magnolia': { r: 255, g: 240, b: 245 },// Light pink
  'crape-myrtle': { r: 186, g: 85, b: 211 }, // Purple
  'hackberry': { r: 107, g: 142, b: 35 } // Olive green
};

// Create a minimal valid PNG file
function createPNG(r, g, b, width = 800, height = 600) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0); // Length
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr.writeUInt8(8, 16); // Bit depth
  ihdr.writeUInt8(2, 17); // Color type (RGB)
  ihdr.writeUInt8(0, 18); // Compression
  ihdr.writeUInt8(0, 19); // Filter
  ihdr.writeUInt8(0, 20); // Interlace

  // Calculate CRC for IHDR
  const crc = zlib.crc32(ihdr.slice(4, 21));
  ihdr.writeUInt32BE(crc, 21);

  // IDAT chunk - compressed image data
  // Create scanlines (filter byte + RGB pixels)
  const bytesPerRow = 1 + (width * 3); // 1 filter byte + width * 3 (RGB)
  const imageData = Buffer.alloc(height * bytesPerRow);

  for (let y = 0; y < height; y++) {
    const rowStart = y * bytesPerRow;
    imageData[rowStart] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pixelStart = rowStart + 1 + (x * 3);
      imageData[pixelStart] = r;
      imageData[pixelStart + 1] = g;
      imageData[pixelStart + 2] = b;
    }
  }

  const compressed = zlib.deflateSync(imageData);
  const idat = Buffer.alloc(12 + compressed.length);
  idat.writeUInt32BE(compressed.length, 0);
  idat.write('IDAT', 4);
  compressed.copy(idat, 8);
  const idatCrc = zlib.crc32(idat.slice(4, 8 + compressed.length));
  idat.writeUInt32BE(idatCrc, 8 + compressed.length);

  // IEND chunk
  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

  return Buffer.concat([signature, ihdr, idat, iend]);
}

// Create images for all tree types
const outputDir = './public/images/trees';

console.log('Creating tree images...\n');

Object.entries(treeColors).forEach(([treeName, color]) => {
  for (let i = 1; i <= 3; i++) {
    // Vary the color slightly for each photo
    const variation = (i - 1) * 0.1;
    const r = Math.min(255, Math.floor(color.r * (1 + variation)));
    const g = Math.min(255, Math.floor(color.g * (1 + variation)));
    const b = Math.min(255, Math.floor(color.b * (1 + variation)));

    const filename = `${treeName}-${i}.png`;
    const filepath = path.join(outputDir, filename);

    const pngData = createPNG(r, g, b);
    fs.writeFileSync(filepath, pngData);

    console.log(`✓ Created ${filename}`);
  }
});

console.log('\n✅ All tree images created successfully!');
console.log(`Total: 36 PNG files (12 species × 3 photos each)`);
