import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { LeadsChart } from "@/components/dashboard/leads-chart"
import { LeadsTable } from "@/components/dashboard/leads-table"
import { Button } from "@/components/ui/button"
import { LogOut, Settings } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  // Obtener leads
  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })

  // Obtener conversaciones
  const { data: conversations, error: conversationsError } = await supabase.from("conversations").select("*")

  if (leadsError || conversationsError) {
    console.error("Error fetching data:", leadsError || conversationsError)
  }

  const leadsData = leads || []
  const conversationsData = conversations || []

  // Calcular métricas
  const totalLeads = leadsData.length
  const newLeads = leadsData.filter((lead) => lead.status === "new").length
  const totalConversations = conversationsData.length
  const qualifiedLeads = leadsData.filter((lead) => lead.status === "qualified" || lead.status === "proposal").length
  const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0

  const handleLogout = async () => {
    "use server"
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
    redirect("/")
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
              <form action={handleLogout}>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Métricas */}
          <MetricsCards
            totalLeads={totalLeads}
            newLeads={newLeads}
            totalConversations={totalConversations}
            conversionRate={conversionRate}
          />

          {/* Gráficos */}
          <LeadsChart leads={leadsData} />

          {/* Tabla de Leads */}
          <LeadsTable leads={leadsData} />
        </div>
      </main>
    </div>
  )
}
