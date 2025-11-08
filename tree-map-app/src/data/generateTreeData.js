import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Seoul districts with approximate center coordinates
const seoulDistricts = [
  { name: 'Gangnam-gu', name_ko: '강남구', lat: 37.5172, lng: 127.0473, neighborhoods: ['Apgujeong-dong', 'Cheongdam-dong', 'Daechi-dong', 'Samseong-dong'] },
  { name: 'Jongno-gu', name_ko: '종로구', lat: 37.5735, lng: 126.9788, neighborhoods: ['Gwanghwamun', 'Insadong', 'Samcheong-dong', 'Bukchon'] },
  { name: 'Jung-gu', name_ko: '중구', lat: 37.5641, lng: 126.9979, neighborhoods: ['Myeong-dong', 'Namsan', 'Euljiro', 'Hoehyeon-dong'] },
  { name: 'Mapo-gu', name_ko: '마포구', lat: 37.5663, lng: 126.9019, neighborhoods: ['Hongdae', 'Yeonnam-dong', 'Sangsu-dong', 'Hapjeong-dong'] },
  { name: 'Songpa-gu', name_ko: '송파구', lat: 37.5145, lng: 127.1059, neighborhoods: ['Jamsil', 'Munjeong-dong', 'Garak-dong', 'Bangi-dong'] },
  { name: 'Seocho-gu', name_ko: '서초구', lat: 37.4837, lng: 127.0324, neighborhoods: ['Seocho-dong', 'Jamwon-dong', 'Banpo-dong', 'Yangjae-dong'] },
  { name: 'Gangdong-gu', name_ko: '강동구', lat: 37.5301, lng: 127.1238, neighborhoods: ['Cheonho-dong', 'Sangil-dong', 'Myeongil-dong', 'Godeok-dong'] },
  { name: 'Gwangjin-gu', name_ko: '광진구', lat: 37.5384, lng: 127.0822, neighborhoods: ['Jayang-dong', 'Guui-dong', 'Gwangjang-dong', 'Neung-dong'] },
  { name: 'Seongdong-gu', name_ko: '성동구', lat: 37.5634, lng: 127.0371, neighborhoods: ['Seongsu-dong', 'Haengdang-dong', 'Wangsimni', 'Geumho-dong'] },
  { name: 'Yongsan-gu', name_ko: '용산구', lat: 37.5326, lng: 126.9905, neighborhoods: ['Itaewon', 'Hannam-dong', 'Ichon-dong', 'Yongsan-dong'] },
  { name: 'Seodaemun-gu', name_ko: '서대문구', lat: 37.5791, lng: 126.9368, neighborhoods: ['Sinchon', 'Yeonhui-dong', 'Hongje-dong', 'Bukgajwa-dong'] },
  { name: 'Eunpyeong-gu', name_ko: '은평구', lat: 37.6176, lng: 126.9227, neighborhoods: ['Bulgwang-dong', 'Yeokchon-dong', 'Galhyeon-dong', 'Jingwan-dong'] },
  { name: 'Gangbuk-gu', name_ko: '강북구', lat: 37.6396, lng: 127.0257, neighborhoods: ['Mia-dong', 'Suyu-dong', 'Beon-dong', 'Ui-dong'] },
  { name: 'Dobong-gu', name_ko: '도봉구', lat: 37.6688, lng: 127.0471, neighborhoods: ['Ssangmun-dong', 'Banghak-dong', 'Chang-dong', 'Dobong-dong'] },
  { name: 'Nowon-gu', name_ko: '노원구', lat: 37.6541, lng: 127.0568, neighborhoods: ['Sanggye-dong', 'Junggye-dong', 'Hagye-dong', 'Wolgye-dong'] },
  { name: 'Seongbuk-gu', name_ko: '성북구', lat: 37.5894, lng: 127.0167, neighborhoods: ['Seongbuk-dong', 'Jeongneung-dong', 'Gil-dong', 'Dongseon-dong'] },
  { name: 'Dongdaemun-gu', name_ko: '동대문구', lat: 37.5744, lng: 127.0396, neighborhoods: ['Jeonnong-dong', 'Yongdu-dong', 'Jegi-dong', 'Hoegi-dong'] },
  { name: 'Jungnang-gu', name_ko: '중랑구', lat: 37.6063, lng: 127.0925, neighborhoods: ['Myeonmok-dong', 'Sangbong-dong', 'Junghwa-dong', 'Mukdong'] },
  { name: 'Gwanak-gu', name_ko: '관악구', lat: 37.4784, lng: 126.9516, neighborhoods: ['Bongcheon-dong', 'Sillim-dong', 'Nakseongdae', 'Daehak-dong'] },
  { name: 'Dongjak-gu', name_ko: '동작구', lat: 37.5124, lng: 126.9393, neighborhoods: ['Noryangjin', 'Sangdo-dong', 'Heukseok-dong', 'Sadang-dong'] },
  { name: 'Yeongdeungpo-gu', name_ko: '영등포구', lat: 37.5264, lng: 126.8962, neighborhoods: ['Yeouido', 'Dangsan-dong', 'Singil-dong', 'Daerim-dong'] },
  { name: 'Guro-gu', name_ko: '구로구', lat: 37.4954, lng: 126.8874, neighborhoods: ['Guro-dong', 'Gasan-dong', 'Sindorim', 'Garibong-dong'] },
  { name: 'Geumcheon-gu', name_ko: '금천구', lat: 37.4519, lng: 126.9023, neighborhoods: ['Gasan-dong', 'Siheung-dong', 'Doksan-dong'] },
  { name: 'Yangcheon-gu', name_ko: '양천구', lat: 37.5170, lng: 126.8665, neighborhoods: ['Mok-dong', 'Sinjeong-dong', 'Sinwol-dong'] },
  { name: 'Gangseo-gu', name_ko: '강서구', lat: 37.5509, lng: 126.8495, neighborhoods: ['Magok-dong', 'Balsan-dong', 'Gaehwa-dong', 'Banghwa-dong'] }
];

// Common tree species in Seoul
const treeSpecies = [
  { common: 'Korean Red Pine', common_ko: '소나무', scientific: 'Pinus densiflora' },
  { common: 'Ginkgo', common_ko: '은행나무', scientific: 'Ginkgo biloba' },
  { common: 'Zelkova', common_ko: '느티나무', scientific: 'Zelkova serrata' },
  { common: 'Korean Mountain Ash', common_ko: '마가목', scientific: 'Sorbus alnifolia' },
  { common: 'Cherry', common_ko: '벚나무', scientific: 'Prunus serrulata' },
  { common: 'Japanese Maple', common_ko: '단풍나무', scientific: 'Acer palmatum' },
  { common: 'Dawn Redwood', common_ko: '메타세쿼이아', scientific: 'Metasequoia glyptostroboides' },
  { common: 'Korean Oak', common_ko: '참나무', scientific: 'Quercus mongolica' },
  { common: 'Persimmon', common_ko: '감나무', scientific: 'Diospyros kaki' },
  { common: 'Magnolia', common_ko: '목련', scientific: 'Magnolia kobus' },
  { common: 'Crape Myrtle', common_ko: '배롱나무', scientific: 'Lagerstroemia indica' },
  { common: 'Hackberry', common_ko: '팽나무', scientific: 'Celtis sinensis' },
];

const healthConditions = {
  excellent: { healthScore: [9, 10], hazardRating: 'None', structuralCondition: 'Excellent' },
  good: { healthScore: [7, 8], hazardRating: 'Low', structuralCondition: 'Good' },
  fair: { healthScore: [5, 6], hazardRating: 'Medium', structuralCondition: 'Fair' },
  poor: { healthScore: [3, 4], hazardRating: 'High', structuralCondition: 'Poor' },
  critical: { healthScore: [1, 2], hazardRating: 'Critical', structuralCondition: 'Failed' }
};

const maintenanceOptions = [
  'Pruning',
  'Cabling',
  'Fertilization',
  'Pest Control',
  'Disease Treatment',
  'Watering',
  'Mulching',
  'Soil Amendment',
  'Crown Reduction',
  'Deadwood Removal',
  'Root Management',
  'Monitoring'
];

const inspectionNotes = [
  'Healthy specimen with good structure',
  'Minor deadwood in crown, routine maintenance recommended',
  'Excellent canopy density and vigor',
  'Some leaf discoloration observed, monitoring required',
  'Recent pruning, healing well',
  'Mature tree in good condition',
  'Young tree establishing well',
  'Storm damage to minor branches',
  'Pest activity observed, treatment applied',
  'Dense foliage, thriving condition',
  'Root system appears stable',
  'Seasonal variation normal'
];

// Pool of diverse tree photos from Unsplash
const treePhotoPool = [
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', // Forest trees
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80', // Single tree
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80', // Tree canopy
  'https://images.unsplash.com/photo-1469227221030-492c98c89d45?w=800&q=80', // Tall tree
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80', // Tree trunk
  'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=800&q=80', // Nature tree
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80', // Mountain tree
  'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80', // Park tree
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // Landscape tree
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80', // Green tree
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', // Natural tree
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80', // Beautiful tree
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', // Oak tree
  'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80', // Pine tree
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80', // Willow tree
  'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&q=80', // Birch tree
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', // Cherry blossom
  'https://images.unsplash.com/photo-1533371452382-d45a9da51ad9?w=800&q=80', // Autumn tree
  'https://images.unsplash.com/photo-1438109491414-7198515b166b?w=800&q=80', // Spring tree
  'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80'  // Maple tree
];

// Helper functions
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomChoices(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomDate(startDate, endDate) {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime);
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Generate random coordinates within a district
function generateCoordinates(district) {
  // Generate coordinates within approximately 0.02 degrees of the district center
  const latOffset = randomBetween(-0.02, 0.02);
  const lngOffset = randomBetween(-0.02, 0.02);
  return {
    lat: parseFloat((district.lat + latOffset).toFixed(6)),
    lng: parseFloat((district.lng + lngOffset).toFixed(6))
  };
}

// Generate a single tree
function generateTree(id, district) {
  const species = randomChoice(treeSpecies);
  const coordinates = generateCoordinates(district);
  const neighborhood = randomChoice(district.neighborhoods);

  // Generate street number
  const streetNumber = randomInt(1, 999);
  const address = `${streetNumber} ${district.name}, ${neighborhood}, Seoul`;

  // Random health condition
  const conditionKey = randomChoice(Object.keys(healthConditions));
  const condition = healthConditions[conditionKey];
  const healthScore = randomInt(condition.healthScore[0], condition.healthScore[1]);

  // Physical characteristics (vary by species and age)
  const age = randomInt(5, 80);
  const height = parseFloat(randomBetween(3, 25).toFixed(1));
  const dbh = randomInt(10, 120); // diameter in cm
  const trunks = randomInt(1, 3);
  const canopySpread = parseFloat(randomBetween(2, 15).toFixed(1));

  // Maintenance needs
  const needsCount = randomInt(0, 3);
  const maintenanceNeeds = needsCount > 0
    ? randomChoices(maintenanceOptions, needsCount)
    : [];

  // Last inspection date (within last 2 years)
  const lastInspection = getRandomDate(
    new Date(2023, 0, 1),
    new Date()
  );

  // Photos - randomly select 3 unique photos from the pool
  const photos = randomChoices(treePhotoPool, 3);

  return {
    id: `TREE-${String(id).padStart(4, '0')}`,
    species: {
      common: species.common,
      common_ko: species.common_ko,
      scientific: species.scientific
    },
    location: {
      address: address,
      coordinates: coordinates,
      district: district.name,
      district_ko: district.name_ko,
      neighborhood: neighborhood
    },
    physical: {
      height: height,
      dbh: dbh,
      trunks: trunks,
      canopySpread: canopySpread,
      estimatedAge: age
    },
    condition: {
      healthScore: healthScore,
      hazardRating: condition.hazardRating,
      structuralCondition: condition.structuralCondition,
      maintenanceNeeds: maintenanceNeeds,
      lastInspection: formatDate(lastInspection),
      notes: randomChoice(inspectionNotes)
    },
    photos: photos
  };
}

// Main generation function
function generateTreesData(count = 700) {
  console.log(`Generating ${count} trees distributed across Seoul...`);

  const trees = [];
  const treesPerDistrict = Math.floor(count / seoulDistricts.length);
  const remainder = count % seoulDistricts.length;

  let treeId = 1;

  // Generate trees for each district
  seoulDistricts.forEach((district, index) => {
    const districtTreeCount = treesPerDistrict + (index < remainder ? 1 : 0);

    for (let i = 0; i < districtTreeCount; i++) {
      trees.push(generateTree(treeId, district));
      treeId++;
    }

    console.log(`Generated ${districtTreeCount} trees for ${district.name_ko} (${district.name})`);
  });

  console.log(`Total trees generated: ${trees.length}`);
  return trees;
}

// Generate and save the data
const trees = generateTreesData(700);
const outputPath = path.join(__dirname, 'trees.json');

fs.writeFileSync(outputPath, JSON.stringify(trees, null, 2), 'utf-8');

console.log(`\n✅ Tree data successfully generated!`);
console.log(`📁 File saved to: ${outputPath}`);
console.log(`🌳 Total trees: ${trees.length}`);

// Display some statistics
const speciesCount = {};
trees.forEach(tree => {
  const species = tree.species.common_ko;
  speciesCount[species] = (speciesCount[species] || 0) + 1;
});

console.log('\n📊 Species distribution:');
Object.entries(speciesCount)
  .sort((a, b) => b[1] - a[1])
  .forEach(([species, count]) => {
    console.log(`   ${species}: ${count}`);
  });
