import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDeals, getHistoricalRevenue } from "@/lib/mockData";
import { calculateForecast, isDealStale, getConcentrationRisk } from "@/lib/forecastUtils";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from "recharts";
import { ArrowUpRight, AlertTriangle, CheckCircle2, TrendingUp, Calendar, Target, Activity, Percent, Users, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Manager Dashboard Page
 * Provides high-level visibility into forecast accuracy, pipeline health, and team performance.
 * Includes month filtering and specific coaching opportunities.
 */
export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const deals = getDeals();
  const history = getHistoricalRevenue();

  // Calculate metrics based on selected month
  const metrics = useMemo(() => {
    const targetDate = new Date(selectedMonth + "-01"); // Append day to make it parseable
    return calculateForecast(deals, targetDate, history);
  }, [deals, selectedMonth, history]);

  const staleDeals = deals.filter(isDealStale);
  const concentrationRisk = getConcentrationRisk(deals, metrics.pipelineValue);

  // Chart Data: Forecast Composition
  const forecastData = [
    { name: "Closed Won", value: metrics.closedWon, color: "hsl(var(--chart-2))" }, // Green
    { name: "Committed", value: metrics.committedValue, color: "hsl(var(--chart-1))" }, // Blue
    { name: "Uncommitted", value: metrics.uncommittedValue, color: "hsl(var(--chart-3))" }, // Orange/Yellow
  ];

  // Chart Data: Historical Trend (for Growth Tracking)
  const trendData = history.map(h => ({
    name: format(new Date(h.month), 'MMM'),
    Actual: h.actual,
    Forecast: h.forecasted
  }));

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <TooltipProvider>
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-1">Performance, health, and forecast reliability.</p>
        </div>
        <div className="flex items-center gap-2 bg-card p-1 rounded-lg border shadow-sm">
          <Calendar className="w-4 h-4 text-muted-foreground ml-2" />
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px] border-0 shadow-none focus:ring-0">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={format(subMonths(new Date(), 1), 'yyyy-MM')}>Last Month</SelectItem>
              <SelectItem value={format(new Date(), 'yyyy-MM')}>Current Month</SelectItem>
              <SelectItem value={format(addMonths(new Date(), 1), 'yyyy-MM')}>Next Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Top Level Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20 relative group">
          <CardHeader className="pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-primary uppercase tracking-wider flex justify-between">
              Forecast Reliability
              <Target className="w-4 h-4 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.mape.toFixed(1)}% MAPE</div>
            <p className="text-xs text-muted-foreground mt-1">Target: &lt;15% Error</p>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground/50 hover:text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Mean Absolute Percentage Error between predicted vs. actual monthly revenue.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        <Card className="relative group">
          <CardHeader className="pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex justify-between">
              Pipeline Hygiene
              <Activity className="w-4 h-4 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", metrics.hygieneScore < 90 ? "text-orange-600" : "text-green-600")}>
              {metrics.hygieneScore.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Target: &ge;90% Complete</p>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground/50 hover:text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">% of active deals with all required fields completed (Stage, Confidence, Next Step, Amount).</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        <Card className="relative group">
          <CardHeader className="pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex justify-between">
              Win Rate
              <Percent className="w-4 h-4 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.winRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Balanced flow</p>
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground/50 hover:text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Percentage of closed deals that were Won vs Lost.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        <Card className="relative group">
          <CardHeader className="pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex justify-between">
              MoM Growth
              <TrendingUp className="w-4 h-4 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", metrics.momGrowth > 0 ? "text-green-600" : "text-red-600")}>
              {metrics.momGrowth > 0 ? "+" : ""}{metrics.momGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs. Last Month</p>
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground/50 hover:text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Month-over-Month revenue growth comparing current actuals/forecast to previous month.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3-Line Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500 shadow-sm relative group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conservative</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatCurrency(metrics.conservative)}</div>
            <p className="text-xs text-muted-foreground mt-1">Locked-in revenue</p>
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground/50 hover:text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">High Confidence deals closing within 14 days + already Closed Won.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-blue-50/50 relative group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Base Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{formatCurrency(metrics.base)}</div>
            <p className="text-xs text-blue-600/80 mt-1">Most likely outcome</p>
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-blue-700/50 hover:text-blue-900" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">High & Medium Confidence deals closing within 30 days.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 shadow-sm relative group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Optimistic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatCurrency(metrics.optimistic)}</div>
            <p className="text-xs text-muted-foreground mt-1">Upside potential</p>
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground/50 hover:text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Base + Low Confidence deals + Early stage high value deals.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart: Pipeline Composition */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Forecast Composition</CardTitle>
            <CardDescription>Breakdown of Committed vs. Uncommitted revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} fontSize={12} />
                <RechartsTooltip 
                  cursor={{ fill: 'transparent' }}
                  formatter={(value: number) => [formatCurrency(value), "Value"]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                  {forecastData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart: Historical Accuracy */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Growth & Accuracy</CardTitle>
            <CardDescription>Actual vs. Forecasted Revenue Trend</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickFormatter={(val) => `$${val/1000}k`} tickLine={false} axisLine={false} fontSize={12} />
                <RechartsTooltip formatter={(value: number) => [formatCurrency(value), "Revenue"]} />
                <Legend />
                <Line type="monotone" dataKey="Forecast" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeWidth={2} />
                <Line type="monotone" dataKey="Actual" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Panel */}
        <Card className="border-red-100 bg-red-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-5 h-5" />
              Top Risks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {concentrationRisk && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-md border border-red-100 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-red-900">Concentration Risk Detected</h4>
                  <p className="text-xs text-red-700 mt-1">Top 2 deals contribute &gt;30% of your forecast. Diversify pipeline immediately.</p>
                </div>
              </div>
            )}
            {staleDeals.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-md border border-orange-100 shadow-sm">
                <Activity className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-orange-900">{staleDeals.length} Stale Deals</h4>
                  <p className="text-xs text-orange-700 mt-1">Deals with no activity in 7+ days. Review immediately.</p>
                </div>
              </div>
            )}
            {metrics.freshnessScore < 80 && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-md border border-yellow-100 shadow-sm">
                <Calendar className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-yellow-900">Low Freshness ({metrics.freshnessScore.toFixed(0)}%)</h4>
                  <p className="text-xs text-yellow-700 mt-1">Target is 80%. Team needs to update next steps more frequently.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coaching List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Coaching Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.winRate < 40 && (
                 <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between">
                    <h4 className="font-bold text-sm">Win Rate Optimization</h4>
                    <span className="text-xs font-bold text-red-600">High Impact</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Win rate is below 40%. Review qualification criteria in Discovery stage with team.</p>
                </div>
              )}
              <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex justify-between">
                  <h4 className="font-bold text-sm">Alex Sales</h4>
                  <span className="text-xs font-bold text-orange-600">Medium Impact</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Has 3 deals in Negotiation for &gt; 14 days. Strategy session needed.</p>
              </div>
               <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex justify-between">
                  <h4 className="font-bold text-sm">Jordan Closer</h4>
                  <span className="text-xs font-bold text-green-600">Positive Reinforcement</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">100% Pipeline Hygiene this week. Use as example in team meeting.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </TooltipProvider>
  );
}


