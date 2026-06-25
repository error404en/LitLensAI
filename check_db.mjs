import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  console.log("--- USERS ---");
  const { data: users, error: usersError } = await supabase.from('users').select('*');
  if (usersError) console.error("Error fetching users:", usersError);
  else console.log(users);

  console.log("--- PAPERS ---");
  const { data: papers, error: papersError } = await supabase.from('papers').select('id, title, user_id, project_id, status, file_name, created_at');
  if (papersError) console.error("Error fetching papers:", papersError);
  else console.log(papers);

  console.log("--- UPLOADS ---");
  const { data: uploads, error: uploadsError } = await supabase.from('uploads').select('*');
  if (uploadsError) console.error("Error fetching uploads:", uploadsError);
  else console.log(uploads);

  console.log("--- PROJECTS ---");
  const { data: projects, error: projectsError } = await supabase.from('projects').select('*');
  if (projectsError) console.error("Error fetching projects:", projectsError);
  else console.log(projects);
}

check().catch(console.error);
