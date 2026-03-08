import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://cpgkqtldivzjmzxqcsvf.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZ2txdGxkaXZ6am16eHFjc3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzODk1NzQsImV4cCI6MjA4Njk2NTU3NH0.0C1IDzqqcOQIRl-L1i-Q9PJkCgnOdos_XJr1J4cvCwY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
