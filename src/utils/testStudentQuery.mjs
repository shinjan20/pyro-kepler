import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

const envContent = fs.readFileSync(envPath, 'utf8');
const supabaseUrlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*(.+)/);
const supabaseKeyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.+)/);

const VITE_SUPABASE_URL = supabaseUrlMatch[1].trim();
const VITE_SUPABASE_ANON_KEY = supabaseKeyMatch[1].trim();

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function checkData() {
    console.log("--- TEST IN QUERY ---");
    const { data, error } = await supabase
        .from('applications')
        .select('project_id, status')
        .in('status', ['accepted', 'working']);

    if (error) {
        console.error("ERROR:", error.message, error.details || '', error.hint || '');
    } else {
        console.log("SUCCESS:", data?.length, "apps");
    }
}

checkData();
