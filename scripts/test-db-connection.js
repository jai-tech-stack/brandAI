// Test database connection script
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

console.log('🔌 Testing Supabase connection...')
console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test 1: Check if we can query the database
    console.log('\n📊 Testing database connection...')
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      // Table might not exist yet, that's okay
      if (error.code === '42P01') {
        console.log('⚠️  Tables not created yet. Run the schema.sql in Supabase SQL Editor.')
      } else {
        console.error('❌ Database error:', error.message)
        return false
      }
    } else {
      console.log('✅ Database connection successful!')
    }

    // Test 2: Check storage buckets
    console.log('\n📦 Testing storage access...')
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
    
    if (storageError) {
      console.log('⚠️  Storage error:', storageError.message)
    } else {
      console.log('✅ Storage access successful!')
      console.log('   Available buckets:', buckets?.map(b => b.name).join(', ') || 'none')
    }

    // Test 3: Check auth
    console.log('\n🔐 Testing auth service...')
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({ limit: 1 })
    
    if (authError) {
      console.log('⚠️  Auth error:', authError.message)
    } else {
      console.log('✅ Auth service accessible!')
    }

    console.log('\n✨ Connection test complete!')
    return true
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    return false
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1)
})

