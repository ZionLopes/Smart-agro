import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://idkpxeloimipnnwgecpz.supabase.co';
const supabaseAnonKey = 'sb_publishable_0LZb-RAE_XbOGgH3XqkmKQ_qvAt81FF';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
