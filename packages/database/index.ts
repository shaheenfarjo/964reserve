import "server-only";

import { createClient } from "@supabase/supabase-js";
import { keys } from "./keys";

export const database = createClient(
  keys().SUPABASE_URL,
  keys().SUPABASE_ANON_KEY
);
