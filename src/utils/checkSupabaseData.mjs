import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

const envContent = fs.readFileSync(envPath, 'utf8');
const supabaseUrlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*(.+)/);
const supabaseKeyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.+)/);

const VITE_SUPABASE_URL = supabaseUrlMatch[1].trim();
const VITE_SUPABASE_ANON_KEY = supabaseKeyMatch[1].trim();

async function checkData() {
    const headers = {
        'apikey': VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
    };

    console.log("--- CHECKING PROFILES ---");
    const pRes = await fetch(`${VITE_SUPABASE_URL}/rest/v1/profiles?select=*`, { headers });
    const profiles = await pRes.json();
    console.log(`Found ${profiles.length || 0} profiles`);
    if (profiles.length > 0) console.log(JSON.stringify(profiles.slice(0, 2), null, 2));

    console.log("\n--- CHECKING PROJECTS ---");
    const projRes = await fetch(`${VITE_SUPABASE_URL}/rest/v1/projects?select=*`, { headers });
    const projects = await projRes.json();
    console.log(`Found ${projects.length || 0} projects`);
    if (projects.length > 0) console.log(JSON.stringify(projects.slice(0, 2), null, 2));

    console.log("\n--- CHECKING APPLICATIONS ---");
    const appRes = await fetch(`${VITE_SUPABASE_URL}/rest/v1/applications?select=*,profiles(*)`, { headers });
    const apps = await appRes.json();
    console.log(`Found ${apps.length || 0} applications`);
    if (apps.length > 0) console.log(JSON.stringify(apps.slice(0, 2), null, 2));
}

checkData().catch(console.error);
