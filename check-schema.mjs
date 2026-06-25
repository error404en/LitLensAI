import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  // Querying information_schema via standard PostgREST doesn't usually work unless exposed.
  // Instead, let's see if we can query it using postgres or another way, or write a function to run arbitrary SQL.
  // Wait, let's try reading information_schema.columns first.
  const { data, error } = await supabase
    .from("columns")
    .select("table_name, column_name, data_type")
    .eq("table_schema", "public");
  console.log("Columns:", data, error);
}
checkSchema();
