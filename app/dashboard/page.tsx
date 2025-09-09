"use client";

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { LeadsChart } from "@/components/dashboard/leads-chart"
import { LeadsTable } from "@/components/dashboard/leads-table"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [leads, setLeads] = useState([])
  const [conversations, setConversations] = useState([])
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    newLeads: 0,
    totalConversations: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/")
      } else {
        setUser(user)
        fetchData(user)
      }
    }
    fetchUserData()
  }, [router, supabase])

  const fetchData = async (user) => {
    // Obtener leads
    const { data: leadsData, error: leadsError } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })

    // Obtener conversaciones
    const { data: conversationsData, error: conversationsError } = await supabase.from("conversations").select("*")

    if (leadsError || conversationsError) {
      console.error("Error fetching data:", leadsError || conversationsError)
    }

    const leads = leadsData || []
    const conversations = conversationsData || []

    // Calcular métricas
    const totalLeads = leads.length
    const newLeads = leads.filter((lead) => lead.status === "new").length
    const totalConversations = conversations.length
    const qualifiedLeads = leads.filter((lead) => lead.status === "qualified" || lead.status === "proposal").length
    const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0

    setLeads(leads)
    setConversations(conversations)
    setMetrics({ totalLeads, newLeads, totalConversations, conversionRate })
    setLoading(false)
  }

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader2 className="h-10 w-10 text-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-white">I</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Impactio One</h1>
                <p className="text-sm text-slate-400">Dashboard de Gestión</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">Hola, {user.email}</span>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Métricas */}
          <MetricsCards
            totalLeads={metrics.totalLeads}
            newLeads={metrics.newLeads}
            totalConversations={metrics.totalConversations}
            conversionRate={metrics.conversionRate}
          />
          {/* Gráficos */}
          <LeadsChart leads={leads} />
          {/* Tabla de Leads */}
          <LeadsTable leads={leads} />
        </div>
      </main>
    </div>
  )
}
