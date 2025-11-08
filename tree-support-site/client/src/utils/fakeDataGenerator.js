/**
 * Utility to generate fake Korean contact data for testing
 */

const firstNames = [
  'Min-jun', 'Seo-yeon', 'Do-yoon', 'Ji-woo', 'Ye-jun',
  'Seo-jun', 'Ha-yoon', 'Ji-ho', 'Soo-yeon', 'Eun-woo',
  'Jae-won', 'Yoo-jin', 'Si-woo', 'Chae-won', 'Ju-won'
];

const lastNames = [
  'Kim', 'Lee', 'Park', 'Choi', 'Jung',
  'Kang', 'Cho', 'Yoon', 'Jang', 'Lim'
];

const districts = [
  'Gangnam-gu', 'Gangdong-gu', 'Gangbuk-gu', 'Gangseo-gu',
  'Gwanak-gu', 'Gwangjin-gu', 'Guro-gu', 'Geumcheon-gu',
  'Nowon-gu', 'Dobong-gu', 'Dongdaemun-gu', 'Dongjak-gu',
  'Mapo-gu', 'Seodaemun-gu', 'Seocho-gu', 'Seongdong-gu',
  'Seongbuk-gu', 'Songpa-gu', 'Yangcheon-gu', 'Yeongdeungpo-gu',
  'Yongsan-gu', 'Eunpyeong-gu', 'Jongno-gu', 'Jung-gu', 'Jungnang-gu'
];

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDigits(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

function randomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => randomElement(chars.split(''))).join('');
}

export function generateFakeContact() {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);

  return {
    name: `${lastName} ${firstName} (Demo)`,
    email: `demo.${randomString(6)}@example.com`,
    phone: `010-${randomDigits(4)}-${randomDigits(4)}`
  };
}

export function getRandomDistrict() {
  return randomElement(districts);
}

export function getDistricts() {
  return districts;
}

export function formatPhoneNumber(value) {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Format as 010-XXXX-XXXX
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
}
