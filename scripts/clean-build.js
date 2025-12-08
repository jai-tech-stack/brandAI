#!/usr/bin/env node

/**
 * Clean build script - removes .next and cache directories
 */

const fs = require('fs')
const path = require('path')

const dirsToClean = [
  '.next',
  'node_modules/.cache',
]

console.log('🧹 Cleaning build artifacts...\n')

dirsToClean.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir)
  if (fs.existsSync(fullPath)) {
    try {
      // Try multiple methods for Windows compatibility
      try {
        fs.rmSync(fullPath, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 })
        console.log(`✅ Removed ${dir}`)
      } catch (e) {
        // Fallback: try to remove files individually
        console.log(`⚠️  Could not remove ${dir} directly. Trying alternative method...`)
        console.log(`⚠️  Please make sure no Next.js processes are running (stop 'npm run dev' if running)`)
        console.log(`⚠️  Then manually delete the ${dir} folder and run build again`)
        throw e
      }
    } catch (error) {
      console.log(`⚠️  Could not remove ${dir}: ${error.message}`)
      console.log(`💡 Tip: Close any running Next.js dev servers and try again`)
    }
  } else {
    console.log(`ℹ️  ${dir} does not exist (already clean)`)
  }
})

console.log('\n✨ Clean complete! Run `npm run build` to rebuild.')

