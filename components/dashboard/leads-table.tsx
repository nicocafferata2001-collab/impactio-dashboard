"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye } from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  source: string
  status: string
  priority: string
  created_at: string
}

interface LeadsTableProps {
  leads: Lead[]
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter

    return matchesSearch && matchesStatus && matchesSource
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "contacted":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "qualified":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "proposal":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "closed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const exportToCSV = () => {
    const headers = ["Nombre", "Email", "Teléfono", "Empresa", "Fuente", "Estado", "Prioridad", "Fecha"]
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map((lead) =>
        [
          lead.name,
          lead.email,
          lead.phone || "",
          lead.company || "",
          lead.source,
          lead.status,
          lead.priority,
          new Date(lead.created_at).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "leads.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-white">Gestión de Leads</CardTitle>
          <Button
            onClick={exportToCSV}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="new">Nuevo</SelectItem>
              <SelectItem value="contacted">Contactado</SelectItem>
              <SelectItem value="qualified">Calificado</SelectItem>
              <SelectItem value="proposal">Propuesta</SelectItem>
              <SelectItem value="closed">Cerrado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="Filtrar por fuente" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">Todas las fuentes</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="referral">Referido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Nombre</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Empresa</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Fuente</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Estado</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Prioridad</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Fecha</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="py-3 px-4 text-white font-medium">{lead.name}</td>
                  <td className="py-3 px-4 text-slate-300">{lead.email}</td>
                  <td className="py-3 px-4 text-slate-300">{lead.company || "-"}</td>
                  <td className="py-3 px-4">
                    <span className="capitalize text-slate-300">{lead.source}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getPriorityColor(lead.priority)}>{lead.priority}</Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              No se encontraron leads que coincidan con los filtros.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
