const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fhswmcrlqaslhvsqndva.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoc3dtY3JscWFzbGh2c3FuZHZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQyMTE3MSwiZXhwIjoyMDk3OTk3MTcxfQ.Bz04iRvR6hgkZkpblUBYu5LtfgPwms_Kr7dB2GpHiVs';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
