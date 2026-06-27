import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// ── Fill these in before running ──────────────────────────────
const SUPABASE_URL = "https://hdezcdqrygamvlxroagj.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = "admin@servenaija.com";
const ADMIN_PASSWORD = "Instruction1122@"; // change this to something strong
const ADMIN_FULL_NAME = "Super Admin";
// ─────────────────────────────────────────────────────────────

if (!SERVICE_ROLE_KEY) {
  console.error("❌  Missing SUPABASE_SERVICE_ROLE_KEY env var");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

const { data, error } = await supabase
  .from("admins")
  .insert({ email: ADMIN_EMAIL, password_hash: passwordHash, full_name: ADMIN_FULL_NAME })
  .select()
  .single();

if (error) {
  console.error("❌  Failed to seed admin:", error.message);
  process.exit(1);
}

console.log("✅  Admin created successfully:");
console.log("   Email   :", data.email);
console.log("   Name    :", data.full_name);
console.log("   ID      :", data.id);
console.log("\n🔑  Login with:", ADMIN_EMAIL, "/", ADMIN_PASSWORD);