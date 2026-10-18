import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

if (Boolean(url) !== Boolean(anonKey)) {
  console.error('StudyTrack cloud mode needs both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Running in local demo mode instead.')
}

export const supabase = url && anonKey ? createClient(url, anonKey) : null
