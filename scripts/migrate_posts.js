const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env vars manually for the script
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter(line => line.includes('='))
    .map(line => line.split('='))
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_DATABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('🚀 Starting migration...');
  
  const jsonPath = path.join(process.cwd(), 'src/data/posts.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ posts.json not found!');
    return;
  }

  const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`📦 Found ${posts.length} posts in JSON.`);

  // Batch insert to avoid many requests
  // We insert in chunks of 50
  const chunkSize = 50;
  for (let i = 0; i < posts.length; i += chunkSize) {
    const chunk = posts.slice(i, i + chunkSize).map(p => ({
      title: p.title,
      content: p.content,
      author_name: p.author || '익명',
      created_at: p.createdAt // Preserving original date
    }));

    const { error } = await supabase.from('posts').insert(chunk);
    
    if (error) {
      console.error(`❌ Error inserting chunk ${i / chunkSize + 1}:`, error.message);
    } else {
      console.log(`✅ Inserted chunk ${i / chunkSize + 1} (${chunk.length} posts)`);
    }
  }

  console.log('✨ Migration completed!');
}

migrate();
