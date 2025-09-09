import { createBrowserClient, createServerClient } from "@supabase/ssr"
import { headers, cookies } from "next/headers"

const supabaseUrl = "https://easvluujwstcbymyxrsx.supabase.co" // 👈 CAMBIA ESTA URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhc3ZsdXVqd3N0Y2J5bXl4cnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTQ0NDYsImV4cCI6MjA3MTEzMDQ0Nn0.FDAv-GTiAu1vB1pisXTJxhRKH45z9YzfNhjdI7VgvaA" // 👈 CAMBIA ESTA KEY

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
