const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin(username, password) {
    const hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
        .from('admin_users')
        .insert({ username, password_hash: hash })
        .select();

    if (error) {
        console.error('Error creating admin:', error.message);
    } else {
        console.log('Admin user created successfully:', data);
    }
}

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node scripts/create-admin.js <username> <password>');
} else {
    createAdmin(args[0], args[1]);
}
