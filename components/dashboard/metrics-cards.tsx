"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, TrendingUp, Clock } from "lucide-react"

interface MetricsCardsProps {
  totalLeads: number
  newLeads: number
  totalConversations: number
  conversionRate: number
}

export function MetricsCards({ totalLeads, newLeads, totalConversations, conversionRate }: MetricsCardsProps) {
  const metrics = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
    },
    {
      title: "Nuevos Leads",
      value: newLeads,
      icon: Clock,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
    },
    {
      title: "Conversaciones",
      value: totalConversations,
      icon: MessageSquare,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
    },
    {
      title: "Tasa Conversión",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.textColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metric.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
