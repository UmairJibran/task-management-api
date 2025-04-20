const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.FA_SUPABASE_URL,
  process.env.FA_SUPABASE_PUBLIC_API_KEY,
);

module.exports = supabase;
