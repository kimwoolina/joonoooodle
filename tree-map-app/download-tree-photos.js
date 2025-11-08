import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Real tree photo URLs - using reliable image sources
const treePhotos = {
  'pine': [
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=600&fit=crop', // Pine tree
    'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop', // Pine forest
    'https://images.unsplash.com/photo-1519408299519-b52503e6e4e0?w=800&h=600&fit=crop'  // Pine branches
  ],
  'ginkgo': [
    'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?w=800&h=600&fit=crop', // Ginkgo tree
    'https://images.unsplash.com/photo-1606506750622-37cb9d7e6b0d?w=800&h=600&fit=crop', // Ginkgo leaves
    'https://images.unsplash.com/photo-1604608672516-f1b9b1a61ec3?w=800&h=600&fit=crop'  // Ginkgo autumn
  ],
  'zelkova': [
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop', // Large tree
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=600&fit=crop', // Tree in park
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'  // Tree landscape
  ],
  'mountain-ash': [
    'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=800&h=600&fit=crop', // Mountain tree
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Mountain landscape
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop'  // Mountain forest
  ],
  'cherry': [
    'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=600&fit=crop', // Cherry blossom
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop', // Cherry tree
    'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?w=800&h=600&fit=crop'  // Cherry blossoms pink
  ],
  'maple': [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop', // Maple leaves red
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop', // Maple tree
    'https://images.unsplash.com/photo-1476231790875-69f3b3f23e13?w=800&h=600&fit=crop'  // Autumn maple
  ],
  'redwood': [
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=600&fit=crop', // Tall tree
    'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop', // Forest
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop'  // Redwood forest
  ],
  'oak': [
    'https://images.unsplash.com/photo-1540206395-68808572332f?w=800&h=600&fit=crop', // Oak tree
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=600&fit=crop', // Large oak
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop'  // Oak in nature
  ],
  'persimmon': [
    'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=800&h=600&fit=crop', // Fruit tree
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=600&fit=crop', // Tree
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'  // Landscape tree
  ],
  'magnolia': [
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop', // Magnolia blossom
    'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?w=800&h=600&fit=crop', // White flowers
    'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=600&fit=crop'  // Spring blossom
  ],
  'crape-myrtle': [
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop', // Flowering tree
    'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?w=800&h=600&fit=crop', // Pink flowers
    'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=600&fit=crop'  // Tree blossoms
  ],
  'hackberry': [
    'https://images.unsplash.com/photo-1540206395-68808572332f?w=800&h=600&fit=crop', // Tree
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=600&fit=crop', // Park tree
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'  // Landscape
  ]
};

const outputDir = path.join(__dirname, 'public', 'images', 'trees');

// Download function using https
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      // Follow redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filepath);
        return downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        return reject(new Error(`Failed to download: ${response.statusCode}`));
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

async function downloadAllPhotos() {
  console.log('Downloading real tree photos from the internet...\n');

  let successCount = 0;
  let failCount = 0;

  for (const [treeName, urls] of Object.entries(treePhotos)) {
    for (let i = 0; i < urls.length; i++) {
      const filename = `${treeName}-${i + 1}.jpg`;
      const filepath = path.join(outputDir, filename);

      try {
        await downloadImage(urls[i], filepath);
        console.log(`✓ Downloaded ${filename}`);
        successCount++;
      } catch (error) {
        console.log(`✗ Failed to download ${filename}: ${error.message}`);
        failCount++;
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`\n✅ Download complete!`);
  console.log(`Success: ${successCount} photos`);
  console.log(`Failed: ${failCount} photos`);
}

downloadAllPhotos().catch(console.error);
