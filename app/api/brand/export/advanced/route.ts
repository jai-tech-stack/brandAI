import { NextRequest, NextResponse } from 'next/server'
import { buildCompleteBrandKitPDF } from '@/lib/pdf/buildPDF'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { format, brandSystem, brandName } = await request.json()

    let result: any = {}

    switch (format) {
      case 'css-advanced':
        result = {
          content: generateAdvancedCSS(brandSystem),
          filename: 'brand-system.css',
          mimeType: 'text/css'
        }
        break

      case 'scss':
        result = {
          content: generateSCSS(brandSystem),
          filename: 'brand-system.scss',
          mimeType: 'text/scss'
        }
        break

      case 'tailwind':
        result = {
          content: generateTailwindConfig(brandSystem),
          filename: 'tailwind.config.js',
          mimeType: 'application/javascript'
        }
        break

      case 'figma-tokens':
        result = {
          content: JSON.stringify(generateFigmaTokens(brandSystem), null, 2),
          filename: 'figma-tokens.json',
          mimeType: 'application/json'
        }
        break

      case 'sketch':
        result = {
          content: JSON.stringify(generateSketchPalette(brandSystem), null, 2),
          filename: 'brand-colors.sketchpalette',
          mimeType: 'application/json'
        }
        break

      case 'pdf-complete':
        const pdfBytes = await buildCompleteBrandKitPDF(brandSystem, brandName)
        result = {
          content: Buffer.from(pdfBytes).toString('base64'),
          filename: `${brandName}-brand-kit.pdf`,
          mimeType: 'application/pdf'
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error: unknown) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Export failed' },
      { status: 500 }
    )
  }
}

function generateAdvancedCSS(brandSystem: any): string {
  return `:root {
  /* Primary Colors */
${brandSystem.primaryColors?.map((c: string, i: number) => `  --color-primary-${i + 1}: ${c};`).join('\n')}

  /* Secondary Colors */
${brandSystem.secondaryColors?.map((c: string, i: number) => `  --color-secondary-${i + 1}: ${c};`).join('\n')}

  /* Typography */
  --font-primary: '${brandSystem.primaryFont}', sans-serif;
  --font-secondary: '${brandSystem.secondaryFont}', sans-serif;

  /* Spacing Scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}`
}

function generateSCSS(brandSystem: any): string {
  return `// Brand Colors
$primary-colors: (
${brandSystem.primaryColors?.map((c: string, i: number) => `  'primary-${i + 1}': ${c}`).join(',\n')}
);

$secondary-colors: (
${brandSystem.secondaryColors?.map((c: string, i: number) => `  'secondary-${i + 1}': ${c}`).join(',\n')}
);

// Typography
$font-primary: '${brandSystem.primaryFont}', sans-serif;
$font-secondary: '${brandSystem.secondaryFont}', sans-serif;

// Spacing
$spacing: (
  'xs': 0.25rem,
  'sm': 0.5rem,
  'md': 1rem,
  'lg': 1.5rem,
  'xl': 2rem
);`
}

function generateTailwindConfig(brandSystem: any): string {
  return `module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          ${brandSystem.primaryColors?.map((c: string, i: number) => `${i + 1}00: '${c}'`).join(',\n          ')}
        },
        secondary: {
          ${brandSystem.secondaryColors?.map((c: string, i: number) => `${i + 1}00: '${c}'`).join(',\n          ')}
        }
      },
      fontFamily: {
        primary: ['${brandSystem.primaryFont}', 'sans-serif'],
        secondary: ['${brandSystem.secondaryFont}', 'sans-serif']
      }
    }
  }
}`
}

function generateFigmaTokens(brandSystem: any) {
  return {
    global: {
      colors: {
        primary: Object.fromEntries(
          brandSystem.primaryColors?.map((c: string, i: number) => [
            `primary-${i + 1}`,
            { value: c, type: 'color' }
          ]) || []
        ),
        secondary: Object.fromEntries(
          brandSystem.secondaryColors?.map((c: string, i: number) => [
            `secondary-${i + 1}`,
            { value: c, type: 'color' }
          ]) || []
        )
      },
      typography: {
        primary: { value: brandSystem.primaryFont, type: 'fontFamilies' },
        secondary: { value: brandSystem.secondaryFont, type: 'fontFamilies' }
      }
    }
  }
}

function generateSketchPalette(brandSystem: any) {
  return {
    compatibleVersion: '2.0',
    pluginVersion: '2.0',
    colors: [
      ...brandSystem.primaryColors?.map((c: string) => c) || [],
      ...brandSystem.secondaryColors?.map((c: string) => c) || []
    ]
  }
}