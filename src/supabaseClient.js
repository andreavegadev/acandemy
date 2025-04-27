import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gymjejdlzxezhmchargd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bWplamRsenhlemhtY2hhcmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNDU4OTMsImV4cCI6MjA2MDcyMTg5M30.M7mukPdsNy16OzUDzo8EYoDtPu2zs7XXxi6g0bg1kuk";

export const supabase = createClient(supabaseUrl, supabaseKey);
