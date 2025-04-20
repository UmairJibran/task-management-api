const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.FA_SUPABASE_URL,
  process.env.FA_SUPABASE_SERVICE_KEY,
);

module.exports = supabase;
