// lib/supabase.ts — canonical supabase client
import { createClient } from "@supabase/supabase-js"
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
const SVC = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ANON

export const supabase = createClient(URL, ANON)
export const supabaseAdmin = createClient(URL, SVC, { auth: { persistSession: false } })
export const createClient_ = () => createClient(URL, ANON)
export const createClientComponentClient = () => createClient(URL, ANON)
export const createServerComponentClient = () => createClient(URL, ANON)
export const createSupabaseBrowserClient = () => createClient(URL, ANON)
export const createSupabaseServerClient = () => createClient(URL, SVC, { auth: { persistSession: false } })
export default supabase
