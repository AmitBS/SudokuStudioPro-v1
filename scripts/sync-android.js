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

      // Square launcher icon (legacy)
      await sharp(masterIconPath)
        .resize(d.size, d.size)
        .png()
        .toFile(path.resolve(targetDir, 'ic_launcher.png'));

      // Round launcher icon (legacy)
      const circleSvg = Buffer.from(
        `<svg width="${d.size}" height="${d.size}"><circle cx="${d.size / 2}" cy="${d.size / 2}" r="${d.size / 2}" fill="black"/></svg>`
      );

      const roundedBuf = await sharp(masterIconPath)
        .resize(d.size, d.size)
        .composite([{ input: circleSvg, blend: 'dest-in' }])
        .png()
        .toBuffer();

      fs.writeFileSync(path.resolve(targetDir, 'ic_launcher_round.png'), roundedBuf);

      // Adaptive icon foreground layer (108dp canvas with safe zone centered icon)
      const adaptiveTotalSize = Math.round((d.size / 48) * 108); // 108, 162, 216, 324, 432
      const adaptiveInnerSize = Math.round(adaptiveTotalSize * 0.72); // 72dp viewport safe area

      const innerIconBuf = await sharp(masterIconPath)
        .resize(adaptiveInnerSize, adaptiveInnerSize)
        .png()
        .toBuffer();

      const foregroundBuffer = await sharp({
        create: {
          width: adaptiveTotalSize,
          height: adaptiveTotalSize,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([{ input: innerIconBuf, gravity: 'center' }])
        .png()
        .toBuffer();

      // Write to mipmap target
      fs.writeFileSync(path.resolve(targetDir, 'ic_launcher_foreground.png'), foregroundBuffer);

      // Also write to corresponding drawable target
      const drawableFolderName = d.folder.replace('mipmap-', 'drawable-');
      const drawableDir = path.resolve(androidResDir, drawableFolderName);
      fs.mkdirSync(drawableDir, { recursive: true });
      fs.writeFileSync(path.resolve(drawableDir, 'ic_launcher_foreground.png'), foregroundBuffer);

      console.log(`✓ Generated ${d.folder} and ${drawableFolderName} (legacy ${d.size}x${d.size}, adaptive fg ${adaptiveTotalSize}x${adaptiveTotalSize})`);
    }

    // Default fallback in res/drawable/
    const defaultFgSize = 432;
    const defaultInnerSize = Math.round(defaultFgSize * 0.72);
    const defaultInnerBuf = await sharp(masterIconPath)
      .resize(defaultInnerSize, defaultInnerSize)
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: defaultFgSize,
        height: defaultFgSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: defaultInnerBuf, gravity: 'center' }])
      .png()
      .toFile(path.resolve(androidResDir, 'drawable', 'ic_launcher_foreground.png'));
  }

  console.log('★ All Android Native assets and icons updated successfully!');
}

sync().catch(err => {
  console.error('Error syncing android assets:', err);
  process.exit(1);
});
