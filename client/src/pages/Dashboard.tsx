import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDeals, getAccounts } from "@/lib/mockData";
import { calculateForecast, isDealStale } from "@/lib/forecastUtils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowUpRight, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const deals = getDeals();
  const metrics = useMemo(() => calculateForecast(deals), [deals]);
  const staleDeals = deals.filter(isDealStale);

  // Chart Data Preparation
  const data = [
    { name: "Conservative", value: metrics.conservative, color: "hsl(var(--chart-2))" },
    { name: "Base", value: metrics.base, color: "hsl(var(--chart-1))" },
    { name: "Optimistic", value: metrics.optimistic, color: "hsl(var(--chart-3))" },
  ];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your weekly forecast and pipeline health overview.</p>
      </div>

      {/* Forecast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-[hsl(var(--chart-2))] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Conservative Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatCurrency(metrics.conservative)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[hsl(var(--chart-2))]" />
              High confidence, closing soon
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(var(--chart-1))] shadow-sm hover:shadow-md transition-shadow bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary uppercase tracking-wider">Base Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatCurrency(metrics.base)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-primary" />
              Weighted pipeline + committed
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(var(--chart-3))] shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Optimistic Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatCurrency(metrics.optimistic)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-[hsl(var(--chart-3))]" />
              Includes upside & early big deals
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Forecast Analysis</CardTitle>
            <CardDescription>Projected revenue scenarios for this month</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis 
                  tickFormatter={(value) => `$${value / 1000}k`} 
                  tickLine={false} 
                  axisLine={false} 
                  fontSize={12}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), "Value"]}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stale Deals Alert */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Risk Signals
              </CardTitle>
              <span className="text-xs font-medium px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                {staleDeals.length} Stale Deals
              </span>
            </div>
            <CardDescription>Deals with no activity in &gt; 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staleDeals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500 opacity-50" />
                  Pipeline is fresh! No stale deals.
                </div>
              ) : (
                staleDeals.map(deal => (
                  <div key={deal.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{deal.title}</p>
                      <p className="text-xs text-muted-foreground">{getAccounts().find(a => a.id === deal.accountId)?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(deal.amount)}</p>
                      <p className="text-xs text-orange-600 font-medium">Stale</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
