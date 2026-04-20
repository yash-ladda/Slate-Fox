import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const service_key = process.env.SUPABASE_SERVICE_ROLE_KEY; 

const supabase = createClient(url, service_key);

export default supabase;