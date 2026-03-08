import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function checkThreads() {
    const { data, error } = await supabase.from('message_threads').select('*');
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("All Threads Length:", data?.length);
        console.log("Threads Data:", JSON.stringify(data, null, 2));
    }
}

checkThreads();
