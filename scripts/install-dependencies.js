#!/usr/bin/env node

/**
 * Script to install missing dependencies
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔧 Installing dependencies...\n')

try {
  // Check if package.json exists
  const packageJsonPath = path.join(__dirname, '..', 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found!')
    process.exit(1)
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  
  // Check required dependencies
  const requiredDeps = {
    '@supabase/supabase-js': packageJson.dependencies['@supabase/supabase-js'],
    'zod': packageJson.dependencies['zod'],
  }

  console.log('📦 Required dependencies:')
  Object.entries(requiredDeps).forEach(([name, version]) => {
    console.log(`   - ${name}@${version}`)
  })

  console.log('\n📥 Installing dependencies...')
  
  // Install with legacy peer deps to avoid conflicts
  execSync('npm install --legacy-peer-deps', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  })

  console.log('\n✅ Dependencies installed successfully!')
  
  // Verify installation
  console.log('\n🔍 Verifying installation...')
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules')
  
  Object.keys(requiredDeps).forEach(dep => {
    const depPath = path.join(nodeModulesPath, dep)
    if (fs.existsSync(depPath)) {
      console.log(`   ✅ ${dep} installed`)
    } else {
      console.log(`   ❌ ${dep} NOT found`)
    }
  })

  console.log('\n✨ Setup complete! You can now run: npm run build')
  
} catch (error) {
  console.error('\n❌ Installation failed:', error.message)
  process.exit(1)
}

