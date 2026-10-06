import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const masterImgPath = path.resolve('src/assets/images/sudoku_app_icon_1791303842670.jpg');
const iconSvgPath = path.resolve('public/icon.svg');

const imageSource = fs.existsSync(masterImgPath) ? masterImgPath : iconSvgPath;

async function generate() {
  console.log(`Generating PNG icons from ${imageSource}...`);

  // 1. 192x192 PNG
  await sharp(imageSource)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public/pwa-192x192.png'));
  console.log('Created public/pwa-192x192.png');

  // 2. 512x512 PNG
  await sharp(imageSource)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/pwa-512x512.png'));
  console.log('Created public/pwa-512x512.png');

  // 3. Apple Touch Icon 180x180
  await sharp(imageSource)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));
  console.log('Created public/apple-touch-icon.png');

  // 4. Maskable 512x512 (with safe padding as required by PWA & Android standards)
  const innerSize = Math.round(512 * 0.8); // 410px
  const innerBuffer = await sharp(imageSource)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 9, g: 13, b: 22, alpha: 1 }, // Matches theme_color #090d16
    },
  })
    .composite([{ input: innerBuffer, gravity: 'center' }])
    .png()
    .toFile(path.resolve('public/pwa-maskable-512x512.png'));
  console.log('Created public/pwa-maskable-512x512.png');

  // 5. Favicon 48x48
  await sharp(imageSource)
    .resize(48, 48)
    .png()
    .toFile(path.resolve('public/favicon.ico'));
  console.log('Created public/favicon.ico');

  console.log('All icons generated successfully!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
