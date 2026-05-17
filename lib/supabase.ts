// lib/supabase.ts
import { createClient as _create } from "@supabase/supabase-js"
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
const SVC  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ANON
export const supabase = _create(URL, ANON)
export const supabaseAdmin = _create(URL, SVC, { auth: { persistSession: false } })
export const createClient = () => _create(URL, ANON)
export const createClientComponentClient = () => _create(URL, ANON)
export const createServerComponentClient = () => _create(URL, ANON)
export const createSupabaseBrowserClient = () => _create(URL, ANON)
export const createSupabaseServerClient = () => _create(URL, SVC, { auth: { persistSession: false } })
export default supabase
