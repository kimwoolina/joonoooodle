import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Seoul districts with approximate center coordinates
const seoulDistricts = [
  { name: 'Gangnam-gu', name_ko: '강남구', lat: 37.5172, lng: 127.0473, neighborhoods: [
    { en: 'Apgujeong-dong', ko: '압구정동' }, { en: 'Cheongdam-dong', ko: '청담동' }, { en: 'Daechi-dong', ko: '대치동' }, { en: 'Samseong-dong', ko: '삼성동' }
  ]},
  { name: 'Jongno-gu', name_ko: '종로구', lat: 37.5735, lng: 126.9788, neighborhoods: [
    { en: 'Gwanghwamun', ko: '광화문' }, { en: 'Insadong', ko: '인사동' }, { en: 'Samcheong-dong', ko: '삼청동' }, { en: 'Bukchon', ko: '북촌' }
  ]},
  { name: 'Jung-gu', name_ko: '중구', lat: 37.5641, lng: 126.9979, neighborhoods: [
    { en: 'Myeong-dong', ko: '명동' }, { en: 'Namsan', ko: '남산' }, { en: 'Euljiro', ko: '을지로' }, { en: 'Hoehyeon-dong', ko: '회현동' }
  ]},
  { name: 'Mapo-gu', name_ko: '마포구', lat: 37.5663, lng: 126.9019, neighborhoods: [
    { en: 'Hongdae', ko: '홍대' }, { en: 'Yeonnam-dong', ko: '연남동' }, { en: 'Sangsu-dong', ko: '상수동' }, { en: 'Hapjeong-dong', ko: '합정동' }
  ]},
  { name: 'Songpa-gu', name_ko: '송파구', lat: 37.5145, lng: 127.1059, neighborhoods: [
    { en: 'Jamsil', ko: '잠실' }, { en: 'Munjeong-dong', ko: '문정동' }, { en: 'Garak-dong', ko: '가락동' }, { en: 'Bangi-dong', ko: '방이동' }
  ]},
  { name: 'Seocho-gu', name_ko: '서초구', lat: 37.4837, lng: 127.0324, neighborhoods: [
    { en: 'Seocho-dong', ko: '서초동' }, { en: 'Jamwon-dong', ko: '잠원동' }, { en: 'Banpo-dong', ko: '반포동' }, { en: 'Yangjae-dong', ko: '양재동' }
  ]},
  { name: 'Gangdong-gu', name_ko: '강동구', lat: 37.5301, lng: 127.1238, neighborhoods: [
    { en: 'Cheonho-dong', ko: '천호동' }, { en: 'Sangil-dong', ko: '상일동' }, { en: 'Myeongil-dong', ko: '명일동' }, { en: 'Godeok-dong', ko: '고덕동' }
  ]},
  { name: 'Gwangjin-gu', name_ko: '광진구', lat: 37.5384, lng: 127.0822, neighborhoods: [
    { en: 'Jayang-dong', ko: '자양동' }, { en: 'Guui-dong', ko: '구의동' }, { en: 'Gwangjang-dong', ko: '광장동' }, { en: 'Neung-dong', ko: '능동' }
  ]},
  { name: 'Seongdong-gu', name_ko: '성동구', lat: 37.5634, lng: 127.0371, neighborhoods: [
    { en: 'Seongsu-dong', ko: '성수동' }, { en: 'Haengdang-dong', ko: '행당동' }, { en: 'Wangsimni', ko: '왕십리' }, { en: 'Geumho-dong', ko: '금호동' }
  ]},
  { name: 'Yongsan-gu', name_ko: '용산구', lat: 37.5326, lng: 126.9905, neighborhoods: [
    { en: 'Itaewon', ko: '이태원' }, { en: 'Hannam-dong', ko: '한남동' }, { en: 'Ichon-dong', ko: '이촌동' }, { en: 'Yongsan-dong', ko: '용산동' }
  ]},
  { name: 'Seodaemun-gu', name_ko: '서대문구', lat: 37.5791, lng: 126.9368, neighborhoods: [
    { en: 'Sinchon', ko: '신촌' }, { en: 'Yeonhui-dong', ko: '연희동' }, { en: 'Hongje-dong', ko: '홍제동' }, { en: 'Bukgajwa-dong', ko: '북가좌동' }
  ]},
  { name: 'Eunpyeong-gu', name_ko: '은평구', lat: 37.6176, lng: 126.9227, neighborhoods: [
    { en: 'Bulgwang-dong', ko: '불광동' }, { en: 'Yeokchon-dong', ko: '역촌동' }, { en: 'Galhyeon-dong', ko: '갈현동' }, { en: 'Jingwan-dong', ko: '진관동' }
  ]},
  { name: 'Gangbuk-gu', name_ko: '강북구', lat: 37.6396, lng: 127.0257, neighborhoods: [
    { en: 'Mia-dong', ko: '미아동' }, { en: 'Suyu-dong', ko: '수유동' }, { en: 'Beon-dong', ko: '번동' }, { en: 'Ui-dong', ko: '우이동' }
  ]},
  { name: 'Dobong-gu', name_ko: '도봉구', lat: 37.6688, lng: 127.0471, neighborhoods: [
    { en: 'Ssangmun-dong', ko: '쌍문동' }, { en: 'Banghak-dong', ko: '방학동' }, { en: 'Chang-dong', ko: '창동' }, { en: 'Dobong-dong', ko: '도봉동' }
  ]},
  { name: 'Nowon-gu', name_ko: '노원구', lat: 37.6541, lng: 127.0568, neighborhoods: [
    { en: 'Sanggye-dong', ko: '상계동' }, { en: 'Junggye-dong', ko: '중계동' }, { en: 'Hagye-dong', ko: '하계동' }, { en: 'Wolgye-dong', ko: '월계동' }
  ]},
  { name: 'Seongbuk-gu', name_ko: '성북구', lat: 37.5894, lng: 127.0167, neighborhoods: [
    { en: 'Seongbuk-dong', ko: '성북동' }, { en: 'Jeongneung-dong', ko: '정릉동' }, { en: 'Gil-dong', ko: '길동' }, { en: 'Dongseon-dong', ko: '동선동' }
  ]},
  { name: 'Dongdaemun-gu', name_ko: '동대문구', lat: 37.5744, lng: 127.0396, neighborhoods: [
    { en: 'Jeonnong-dong', ko: '전농동' }, { en: 'Yongdu-dong', ko: '용두동' }, { en: 'Jegi-dong', ko: '제기동' }, { en: 'Hoegi-dong', ko: '회기동' }
  ]},
  { name: 'Jungnang-gu', name_ko: '중랑구', lat: 37.6063, lng: 127.0925, neighborhoods: [
    { en: 'Myeonmok-dong', ko: '면목동' }, { en: 'Sangbong-dong', ko: '상봉동' }, { en: 'Junghwa-dong', ko: '중화동' }, { en: 'Mukdong', ko: '묵동' }
  ]},
  { name: 'Gwanak-gu', name_ko: '관악구', lat: 37.4784, lng: 126.9516, neighborhoods: [
    { en: 'Bongcheon-dong', ko: '봉천동' }, { en: 'Sillim-dong', ko: '신림동' }, { en: 'Nakseongdae', ko: '낙성대' }, { en: 'Daehak-dong', ko: '대학동' }
  ]},
  { name: 'Dongjak-gu', name_ko: '동작구', lat: 37.5124, lng: 126.9393, neighborhoods: [
    { en: 'Noryangjin', ko: '노량진' }, { en: 'Sangdo-dong', ko: '상도동' }, { en: 'Heukseok-dong', ko: '흑석동' }, { en: 'Sadang-dong', ko: '사당동' }
  ]},
  { name: 'Yeongdeungpo-gu', name_ko: '영등포구', lat: 37.5264, lng: 126.8962, neighborhoods: [
    { en: 'Yeouido', ko: '여의도' }, { en: 'Dangsan-dong', ko: '당산동' }, { en: 'Singil-dong', ko: '신길동' }, { en: 'Daerim-dong', ko: '대림동' }
  ]},
  { name: 'Guro-gu', name_ko: '구로구', lat: 37.4954, lng: 126.8874, neighborhoods: [
    { en: 'Guro-dong', ko: '구로동' }, { en: 'Gasan-dong', ko: '가산동' }, { en: 'Sindorim', ko: '신도림' }, { en: 'Garibong-dong', ko: '가리봉동' }
  ]},
  { name: 'Geumcheon-gu', name_ko: '금천구', lat: 37.4519, lng: 126.9023, neighborhoods: [
    { en: 'Gasan-dong', ko: '가산동' }, { en: 'Siheung-dong', ko: '시흥동' }, { en: 'Doksan-dong', ko: '독산동' }
  ]},
  { name: 'Yangcheon-gu', name_ko: '양천구', lat: 37.5170, lng: 126.8665, neighborhoods: [
    { en: 'Mok-dong', ko: '목동' }, { en: 'Sinjeong-dong', ko: '신정동' }, { en: 'Sinwol-dong', ko: '신월동' }
  ]},
  { name: 'Gangseo-gu', name_ko: '강서구', lat: 37.5509, lng: 126.8495, neighborhoods: [
    { en: 'Magok-dong', ko: '마곡동' }, { en: 'Balsan-dong', ko: '발산동' }, { en: 'Gaehwa-dong', ko: '개화동' }, { en: 'Banghwa-dong', ko: '방화동' }
  ]}
];

// Common tree species in Seoul with local SVG images
const treeSpecies = [
  {
    common: 'Korean Red Pine',
    common_ko: '소나무',
    scientific: 'Pinus densiflora',
    photos: ['/images/trees/pine-1.svg', '/images/trees/pine-2.svg', '/images/trees/pine-3.svg']
  },
  {
    common: 'Ginkgo',
    common_ko: '은행나무',
    scientific: 'Ginkgo biloba',
    photos: ['/images/trees/ginkgo-1.svg', '/images/trees/ginkgo-2.svg', '/images/trees/ginkgo-3.svg']
  },
  {
    common: 'Zelkova',
    common_ko: '느티나무',
    scientific: 'Zelkova serrata',
    photos: ['/images/trees/zelkova-1.svg', '/images/trees/zelkova-2.svg', '/images/trees/zelkova-3.svg']
  },
  {
    common: 'Korean Mountain Ash',
    common_ko: '마가목',
    scientific: 'Sorbus alnifolia',
    photos: ['/images/trees/mountain-ash-1.svg', '/images/trees/mountain-ash-2.svg', '/images/trees/mountain-ash-3.svg']
  },
  {
    common: 'Cherry',
    common_ko: '벚나무',
    scientific: 'Prunus serrulata',
    photos: ['/images/trees/cherry-1.svg', '/images/trees/cherry-2.svg', '/images/trees/cherry-3.svg']
  },
  {
    common: 'Japanese Maple',
    common_ko: '단풍나무',
    scientific: 'Acer palmatum',
    photos: ['/images/trees/maple-1.svg', '/images/trees/maple-2.svg', '/images/trees/maple-3.svg']
  },
  {
    common: 'Dawn Redwood',
    common_ko: '메타세쿼이아',
    scientific: 'Metasequoia glyptostroboides',
    photos: ['/images/trees/redwood-1.svg', '/images/trees/redwood-2.svg', '/images/trees/redwood-3.svg']
  },
  {
    common: 'Korean Oak',
    common_ko: '참나무',
    scientific: 'Quercus mongolica',
    photos: ['/images/trees/oak-1.svg', '/images/trees/oak-2.svg', '/images/trees/oak-3.svg']
  },
  {
    common: 'Persimmon',
    common_ko: '감나무',
    scientific: 'Diospyros kaki',
    photos: ['/images/trees/persimmon-1.svg', '/images/trees/persimmon-2.svg', '/images/trees/persimmon-3.svg']
  },
  {
    common: 'Magnolia',
    common_ko: '목련',
    scientific: 'Magnolia kobus',
    photos: ['/images/trees/magnolia-1.svg', '/images/trees/magnolia-2.svg', '/images/trees/magnolia-3.svg']
  },
  {
    common: 'Crape Myrtle',
    common_ko: '배롱나무',
    scientific: 'Lagerstroemia indica',
    photos: ['/images/trees/crape-myrtle-1.svg', '/images/trees/crape-myrtle-2.svg', '/images/trees/crape-myrtle-3.svg']
  },
  {
    common: 'Hackberry',
    common_ko: '팽나무',
    scientific: 'Celtis sinensis',
    photos: ['/images/trees/hackberry-1.svg', '/images/trees/hackberry-2.svg', '/images/trees/hackberry-3.svg']
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
  const address = `${streetNumber} ${district.name}, ${neighborhood.en}, Seoul`;

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
      neighborhood: neighborhood.en,
      neighborhood_ko: neighborhood.ko
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
