// lib/supabase.ts — javari-cards  May 16 2026
import { createClient as _c } from "@supabase/supabase-js"
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SVC  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ANON
export const supabase = _c(URL, ANON)
export const supabaseAdmin = _c(URL, SVC, { auth: { persistSession: false } })
export const createClient = () => _c(URL, ANON)
export const createClientComponentClient = () => _c(URL, ANON)
export async function getUser(c?: ReturnType<typeof createClient>) {
  const { data: { user } } = await (c ?? supabase).auth.getUser(); return user
}
export function shouldChargeCredits(e?: string|null) { return !["royhenderson@craudiovizai.com"].includes(e??"") }
export function isAdmin(e?: string|null) { return !shouldChargeCredits(e) }
