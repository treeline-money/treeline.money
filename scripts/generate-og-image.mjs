import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// OG image dimensions
const WIDTH = 1200;
const HEIGHT = 630;

// Brand colors
const SAGE_GREEN = '#4a8a63';
const BG_COLOR = '#f5f5f4';

// Load Outfit fonts
const outfitSemiBold = readFileSync(join(__dirname, 'fonts', 'Outfit-SemiBold.ttf'));
const outfitRegular = readFileSync(join(__dirname, 'fonts', 'Outfit-Regular.ttf'));

async function generateOgImage() {

  // Load and resize the screenshot
  const screenshot = await sharp(join(publicDir, 'screenshots', 'accounts-light.png'))
    .resize(650, null, { fit: 'inside' })
    .png()
    .toBuffer();

  const screenshotBase64 = `data:image/png;base64,${screenshot.toString('base64')}`;
  const screenshotMeta = await sharp(screenshot).metadata();

  // Create the SVG using satori with proper React-like elements
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: BG_COLOR,
          padding: '50px',
        },
        children: [
          // Left side - branding
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '420px',
                paddingRight: '30px',
              },
              children: [
                // Logo + wordmark row
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '24px',
                    },
                    children: [
                      // Logo SVG
                      {
                        type: 'svg',
                        props: {
                          width: 64,
                          height: 64,
                          viewBox: '0 0 64 64',
                          children: [
                            { type: 'path', props: { d: 'M32 12 L20 35 L35 40 L44 35 Z', fill: BG_COLOR } },
                            { type: 'path', props: { d: 'M20 35 L35 40 L44 35 L54 52 L10 52 Z', fill: SAGE_GREEN } },
                            { type: 'path', props: { d: 'M32 12 L54 52 L10 52 Z', stroke: SAGE_GREEN, strokeWidth: 2.5, fill: 'none' } },
                          ],
                        },
                      },
                      // Wordmark
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '48px',
                            fontWeight: 600,
                            color: '#1c1c1c',
                            fontFamily: 'Outfit',
                          },
                          children: 'treeline',
                        },
                      },
                    ],
                  },
                },
                // Tagline
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontWeight: 400,
                            color: '#525252',
                            fontFamily: 'Outfit',
                          },
                          children: 'A local-first, plugin-based finance app.',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontWeight: 400,
                            color: '#525252',
                            fontFamily: 'Outfit',
                          },
                          children: 'Built on DuckDB.',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Right side - screenshot
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flex: 1,
              },
              children: [
                {
                  type: 'img',
                  props: {
                    src: screenshotBase64,
                    width: screenshotMeta.width,
                    height: screenshotMeta.height,
                    style: {
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: 'Outfit',
          data: outfitSemiBold,
          weight: 600,
          style: 'normal',
        },
        {
          name: 'Outfit',
          data: outfitRegular,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );

  // Convert SVG to PNG
  await sharp(Buffer.from(svg))
    .png()
    .toFile(join(publicDir, 'og-image.png'));

  console.log('Generated og-image.png');
}

generateOgImage().catch(console.error);
