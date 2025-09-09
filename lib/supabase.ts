import { createBrowserClient, createServerClient } from "@supabase/ssr"

const supabaseUrl = "https://mzmpbdmriwalbfvmoqca.supabase.co" // 👈 CAMBIA ESTA URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16bXBiZG1yaXdhbGJmdm1vcWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTI0OTQsImV4cCI6MjA3MzAyODQ5NH0.k4pENmqeVgMzVc6ciGsUQR2uMYqeGWDC1M3DepRKGlc" // 👈 CAMBIA ESTA KEY

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
