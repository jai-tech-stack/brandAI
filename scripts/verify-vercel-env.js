// Script to verify Vercel environment variables are set correctly
// Run this locally after pulling env vars: vercel env pull .env.local

const fs = require('fs')
const path = require('path')

console.log('🔍 Verifying Vercel environment variables...\n')

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
]

const optionalVars = [
  'STABILITY_API_KEY',
  'REPLICATE_API_TOKEN',
]

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local')
const envExamplePath = path.join(__dirname, '..', '.env.example')

if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env.local not found!')
  console.log('   Run: vercel env pull .env.local')
  console.log('   Or create .env.local manually\n')
  
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Copy .env.example to .env.local and fill in values:')
    console.log('   cp .env.example .env.local\n')
  }
  process.exit(1)
}

// Load .env.local
require('dotenv').config({ path: envPath })

let allSet = true
const missing = []
const set = []

console.log('📋 Required Variables:')
requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value && value.length > 0) {
    console.log(`   ✅ ${varName}`)
    set.push(varName)
  } else {
    console.log(`   ❌ ${varName} - MISSING`)
    missing.push(varName)
    allSet = false
  }
})

console.log('\n📋 Optional Variables:')
optionalVars.forEach(varName => {
  const value = process.env[varName]
  if (value && value.length > 0) {
    console.log(`   ✅ ${varName}`)
  } else {
    console.log(`   ⚪ ${varName} - Not set (optional)`)
  }
})

console.log('\n' + '='.repeat(50))

if (allSet) {
  console.log('✅ All required environment variables are set!')
  console.log('\n📝 Next steps:')
  console.log('   1. Verify Supabase connection: node scripts/test-db-connection.js')
  console.log('   2. Deploy to Vercel: git push origin main')
  console.log('   3. Check deployment logs in Vercel dashboard')
} else {
  console.log('❌ Missing required environment variables:')
  missing.forEach(varName => {
    console.log(`   - ${varName}`)
  })
  console.log('\n📝 To fix:')
  console.log('   1. Add variables in Vercel Dashboard > Settings > Environment Variables')
  console.log('   2. Or run: vercel env pull .env.local')
  console.log('   3. Or manually add to .env.local')
  process.exit(1)
}

