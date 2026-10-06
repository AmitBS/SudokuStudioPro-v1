import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.resolve(rootDir, 'dist');
const androidAssetsDir = path.resolve(rootDir, 'android-native/app/src/main/assets');
const androidResDir = path.resolve(rootDir, 'android-native/app/src/main/res');
const masterIconPath = path.resolve(rootDir, 'src/assets/images/sudoku_app_icon_1791303842670.jpg');

async function sync() {
  console.log('1. Copying fresh dist/ assets into android-native/app/src/main/assets/...');
  
  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist! Please run npm run build first.');
    process.exit(1);
  }

  // Ensure target assets directory exists
  fs.mkdirSync(androidAssetsDir, { recursive: true });

  // Clean old assets in android-native/app/src/main/assets
  fs.rmSync(androidAssetsDir, { recursive: true, force: true });
  fs.mkdirSync(androidAssetsDir, { recursive: true });

  // Copy dist/ to android-native/app/src/main/assets/
  fs.cpSync(distDir, androidAssetsDir, { recursive: true });
  console.log('✓ Successfully copied dist/ files to android-native assets!');

  // 2. Generate native Android mipmap launcher icons from extraordinary master image
  if (fs.existsSync(masterIconPath)) {
    console.log('2. Generating Android native mipmap launcher icons from master icon...');
    const densities = [
      { folder: 'mipmap-mdpi', size: 48 },
      { folder: 'mipmap-hdpi', size: 72 },
      { folder: 'mipmap-xhdpi', size: 96 },
      { folder: 'mipmap-xxhdpi', size: 144 },
      { folder: 'mipmap-xxxhdpi', size: 192 },
    ];

    for (const d of densities) {
      const targetDir = path.resolve(androidResDir, d.folder);
      fs.mkdirSync(targetDir, { recursive: true });

      // Square launcher icon
      await sharp(masterIconPath)
        .resize(d.size, d.size)
        .png()
        .toFile(path.resolve(targetDir, 'ic_launcher.png'));

      // Round launcher icon
      const circleSvg = Buffer.from(
        `<svg width="${d.size}" height="${d.size}"><circle cx="${d.size / 2}" cy="${d.size / 2}" r="${d.size / 2}" fill="black"/></svg>`
      );

      const roundedBuf = await sharp(masterIconPath)
        .resize(d.size, d.size)
        .composite([{ input: circleSvg, blend: 'dest-in' }])
        .png()
        .toBuffer();

      fs.writeFileSync(path.resolve(targetDir, 'ic_launcher_round.png'), roundedBuf);
      console.log(`✓ Generated ${d.folder} (${d.size}x${d.size})`);
    }
  }

  console.log('★ All Android Native assets and icons updated successfully!');
}

sync().catch(err => {
  console.error('Error syncing android assets:', err);
  process.exit(1);
});
