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

// Common tree species in Seoul with placeholder images showing tree names
const treeSpecies = [
  {
    common: 'Korean Red Pine',
    common_ko: '소나무',
    scientific: 'Pinus densiflora',
    photos: [
      'https://placehold.co/800x600/228B22/white?text=Korean+Red+Pine+%EC%86%8C%EB%82%98%EB%AC%B4',
      'https://placehold.co/800x600/2F4F2F/white?text=Pinus+densiflora',
      'https://placehold.co/800x600/006400/white?text=%EC%86%8C%EB%82%98%EB%AC%B4+Pine'
    ]
  },
  {
    common: 'Ginkgo',
    common_ko: '은행나무',
    scientific: 'Ginkgo biloba',
    photos: [
      'https://placehold.co/800x600/FFD700/black?text=Ginkgo+%EC%9D%80%ED%96%89%EB%82%98%EB%AC%B4',
      'https://placehold.co/800x600/FFA500/white?text=Ginkgo+biloba',
      'https://placehold.co/800x600/DAA520/white?text=%EC%9D%80%ED%96%89%EB%82%98%EB%AC%B4+Ginkgo'
    ]
  },
  {
    common: 'Zelkova',
    common_ko: '느티나무',
    scientific: 'Zelkova serrata',
    photos: [
      'https://placehold.co/800x600/8B4513/white?text=Zelkova+%EB%8A%90%ED%8B%B0%EB%82%98%EB%AC%B4',
      'https://placehold.co/800x600/A0522D/white?text=Zelkova+serrata',
      'https://placehold.co/800x600/654321/white?text=%EB%8A%90%ED%8B%B0%EB%82%98%EB%AC%B4+Zelkova'
    ]
  },
  {
    common: 'Korean Mountain Ash',
    common_ko: '마가목',
    scientific: 'Sorbus alnifolia',
    photos: [
      'https://placehold.co/800x600/556B2F/white?text=Mountain+Ash+%EB%A7%88%EA%B0%80%EB%AA%A9',
      'https://placehold.co/800x600/6B8E23/white?text=Sorbus+alnifolia',
      'https://placehold.co/800x600/808000/white?text=%EB%A7%88%EA%B0%80%EB%AA%A9+Sorbus'
    ]
  },
  {
    common: 'Cherry',
    common_ko: '벚나무',
    scientific: 'Prunus serrulata',
    photos: [
      'https://placehold.co/800x600/FFB6C1/black?text=Cherry+%EB%B2%9A%EB%82%98%EB%AC%B4',
      'https://placehold.co/800x600/FFC0CB/black?text=Prunus+serrulata',
      'https://placehold.co/800x600/FF69B4/white?text=%EB%B2%9A%EB%82%98%EB%AC%B4+Cherry'
    ]
  },
  {
    common: 'Japanese Maple',
    common_ko: '단풍나무',
    scientific: 'Acer palmatum',
    photos: [
      'https://placehold.co/800x600/DC143C/white?text=Japanese+Maple+%EB%8B%A8%ED%92%8D%EB%82%98%EB%AC%B4',
      'https://placehold.co/800x600/8B0000/white?text=Acer+palmatum',
      'https://placehold.co/800x600/B22222/white?text=%EB%8B%A8%ED%92%8D%EB%82%98%EB%AC%B4+Maple'
    ]
  },
  {
    common: 'Dawn Redwood',
    common_ko: '메타세쿼이아',
    scientific: 'Metasequoia glyptostroboides',
    photos: [
      'https://placehold.co/800x600/8B4513/white?text=Dawn+Redwood+%EB%A9%94%ED%83%80%EC%84%B8%EC%BF%BC%EC%9D%B4%EC%95%84',
      'https://placehold.co/800x600/A0522D/white?text=Metasequoia',
      'https://placehold.co/800x600/CD853F/white?text=%EB%A9%94%ED%83%80%EC%84%B8%EC%BF%BC%EC%9D%B4%EC%95%84'
    ]
  },
  {
    common: 'Korean Oak',
    common_ko: '참나무',
    scientific: 'Quercus mongolica',
    photos: [
      'https://placehold.co/800x600/6B8E23/white?text=Korean+Oak+%EC%B0%B8%EB%82%98%EB%AC%B4',
      'https://placehold.co/800x600/556B2F/white?text=Quercus+mongolica',
      'https://placehold.co/800x600/8FBC8F/black?text=%EC%B0%B8%EB%82%98%EB%AC%B4+Oak'
    ]
  },
  {
    common: 'Persimmon',
    common_ko: '감나무',
    scientific: 'Diospyros kaki',
    photos: [
      'https://placehold.co/800x600/FF8C00/white?text=Persimmon+%EA%B0%90%EB%82%98%EB%AC%B4',
      'https://placehold.co/800x600/FF6347/white?text=Diospyros+kaki',
      'https://placehold.co/800x600/FFA07A/white?text=%EA%B0%90%EB%82%98%EB%AC%B4+Persimmon'
    ]
  },
  {
    common: 'Magnolia',
    common_ko: '목련',
    scientific: 'Magnolia kobus',
    photos: [
      'https://placehold.co/800x600/F8F8FF/black?text=Magnolia+%EB%AA%A9%EB%A0%A8',
      'https://placehold.co/800x600/FFFAF0/black?text=Magnolia+kobus',
      'https://placehold.co/800x600/FFE4E1/black?text=%EB%AA%A9%EB%A0%A8+Magnolia'
    ]
  },
  {
    common: 'Crape Myrtle',
    common_ko: '배롱나무',
    scientific: 'Lagerstroemia indica',
    photos: [
      'https://placehold.co/800x600/DB7093/white?text=Crape+Myrtle+%EB%B0%B0%EB%A1%B1%EB%82%98%EB%AC%B4',
      'https://placehold.co/800x600/C71585/white?text=Lagerstroemia',
      'https://placehold.co/800x600/FF1493/white?text=%EB%B0%B0%EB%A1%B1%EB%82%98%EB%AC%B4+Myrtle'
    ]
  },
  {
    common: 'Hackberry',
    common_ko: '팽나무',
    scientific: 'Celtis sinensis',
    photos: [
      'https://placehold.co/800x600/2E8B57/white?text=Hackberry+%ED%8C%BD%EB%82%98%EB%AC%B4',
      'https://placehold.co/800x600/3CB371/white?text=Celtis+sinensis',
      'https://placehold.co/800x600/20B2AA/white?text=%ED%8C%BD%EB%82%98%EB%AC%B4+Hackberry'
    ]
  },
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

  // Photos - use the species-specific photos
  const photos = species.photos;

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
