
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rbnwlknztyhfahwenjym.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibndsa256dHloZmFod2VuanltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwODA2NjAsImV4cCI6MjA2NjY1NjY2MH0.rFVnHHxVtoGCsRxI2vEZ9tjMK-MJeDijBzbidEV3dgA';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
