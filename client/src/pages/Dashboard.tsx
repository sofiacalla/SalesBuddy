import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDeals, getHistoricalRevenue } from "@/lib/mockData";
import { calculateForecast, isDealStale, getConcentrationRisk } from "@/lib/forecastUtils";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from "recharts";
import { ArrowUpRight, AlertTriangle, CheckCircle2, TrendingUp, Calendar, Target, Activity, Percent, Users, Info, Sparkles, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addMonths, subMonths, eachMonthOfInterval, startOfYear, endOfYear, differenceInDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Manager Dashboard Page
 * 
 * This is the landing page for sales managers.
 * It aggregates data from all deals to provide high-level insights into:
 * - Forecast Reliability (MAPE)
 * - Pipeline Hygiene
 * - Win Rates
 * - Month-over-Month Growth
 * 
 * It uses the 'recharts' library for visualization and 'date-fns' for time-based filtering.
 */

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const deals = getDeals();
  const history = getHistoricalRevenue();
  
  // Dialog States for interactive drill-downs
  const [selectedRisk, setSelectedRisk] = useState<{type: string, title: string, desc: string, details: any[]} | null>(null);
  const [selectedCoaching, setSelectedCoaching] = useState<{title: string, desc: string, details: string} | null>(null);

  // Generate months for the dropdown (Current Year)
  const months = eachMonthOfInterval({
    start: startOfYear(new Date()),
    end: endOfYear(new Date())
  });

  // Calculate metrics based on selected month using memoization for performance
  const metrics = useMemo(() => {
    // We construct the date safely by appending a time component to avoid timezone shifts
    // "2025-11-01" can be interpreted as UTC midnight, which is previous day in PST.
    // "2025-11-01T12:00:00" is safer as it lands in the middle of the day.
    const targetDate = new Date(selectedMonth + "-01T12:00:00");
    return calculateForecast(deals, targetDate, history);
  }, [deals, selectedMonth, history]);

  const staleDeals = deals.filter(isDealStale);
  const concentrationRisk = getConcentrationRisk(deals, metrics.pipelineValue);

  // Chart Data: Forecast Composition
  const forecastData = [
    { name: "Closed Won", value: metrics.closedWon, color: "hsl(var(--chart-2))" }, // Green
    { name: "Committed", value: metrics.committedValue, color: "hsl(var(--chart-1))" }, // Blue
    { name: "Uncommitted", value: metrics.uncommittedValue, color: "hsl(var(--chart-3))" }, // Orange/Yellow
    { name: "Leads", value: metrics.leadsValue, color: "hsl(var(--chart-4))" }, // Purple/Other
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
            <SelectTrigger className="w-[200px] border-0 shadow-none focus:ring-0 font-medium">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={format(month, 'yyyy-MM')} value={format(month, 'yyyy-MM')}>
                  {format(month, 'MMMM yyyy')}
                </SelectItem>
              ))}
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

      {/* 2-Tile Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-green-500 shadow-sm bg-green-50/20 relative group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Actuals (Closed Won)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-700">{formatCurrency(metrics.closedWon)}</div>
            <p className="text-sm text-green-600/80 mt-1">Realized revenue for {format(new Date(selectedMonth + "-01T12:00:00"), 'MMMM')}</p>
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-green-700/50 hover:text-green-900" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Revenue from deals already marked as 'Closed Won' this month.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-blue-50/20 relative group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Monthly Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-700">{formatCurrency(metrics.base)}</div>
            <p className="text-sm text-blue-600/80 mt-1">Projected landing (Closed + Committed)</p>
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-blue-700/50 hover:text-blue-900" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Weighted forecast based on High & Medium confidence active deals + Closed Won.</p>
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
            <CardTitle>Forecast Composition ({format(new Date(selectedMonth + "-01T12:00:00"), 'MMMM yyyy')})</CardTitle>
            <CardDescription>Breakdown of Committed, Uncommitted, and Leads for {format(new Date(selectedMonth + "-01T12:00:00"), 'MMMM yyyy')}</CardDescription>
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
              <Sparkles className="w-5 h-5 text-red-500" />
              Top Risks (AI Generated)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {concentrationRisk && (
              <div 
                className="flex items-start gap-3 p-3 bg-white rounded-md border border-red-100 shadow-sm cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedRisk({
                  type: "Concentration",
                  title: "Concentration Risk Detected",
                  desc: "Top 2 deals contribute >30% of your forecast.",
                  details: deals.sort((a, b) => b.amount - a.amount).slice(0, 2)
                })}
              >
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-red-900">Concentration Risk Detected</h4>
                  <p className="text-xs text-red-700 mt-1">Top 2 deals contribute &gt;30% of your forecast. Click for details.</p>
                </div>
              </div>
            )}
            {staleDeals.length > 0 && (
              <div 
                className="flex items-start gap-3 p-3 bg-white rounded-md border border-orange-100 shadow-sm cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedRisk({
                  type: "Stale",
                  title: `${staleDeals.length} Stale Deals`,
                  desc: "Deals with no activity in 7+ days.",
                  details: staleDeals
                })}
              >
                <Activity className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-orange-900">{staleDeals.length} Stale Deals</h4>
                  <p className="text-xs text-orange-700 mt-1">Deals with no activity in 7+ days. Click to review.</p>
                </div>
              </div>
            )}
            {metrics.freshnessScore < 80 && (
              <div 
                className="flex items-start gap-3 p-3 bg-white rounded-md border border-yellow-100 shadow-sm cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedRisk({
                  type: "Freshness",
                  title: `Low Freshness (${metrics.freshnessScore.toFixed(0)}%)`,
                  desc: "Target is 80%. The following deals have not been updated in the last 7 days.",
                  details: deals.filter(d => differenceInDays(new Date(), parseISO(d.lastActivityDate)) > 7)
                })}
              >
                <Calendar className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-yellow-900">Low Freshness ({metrics.freshnessScore.toFixed(0)}%)</h4>
                  <p className="text-xs text-yellow-700 mt-1">Target is 80%. Team needs to update next steps more frequently. Click for details.</p>
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
                 <div 
                   className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                   onClick={() => setSelectedCoaching({
                     title: "Win Rate Optimization",
                     desc: "Win rate is currently below 40%.",
                     details: "Focus on better qualification in the Discovery stage. Review 'Closed Lost' reasons from the last quarter to identify patterns. Suggest role-playing objection handling for pricing discussions."
                   })}
                 >
                  <div className="flex justify-between">
                    <h4 className="font-bold text-sm">Win Rate Optimization</h4>
                    <span className="text-xs font-bold text-red-600">High Impact</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Win rate is below 40%. Review qualification criteria in Discovery stage with team.</p>
                </div>
              )}
              <div 
                className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelectedCoaching({
                  title: "Alex Sales - Negotiation Stagnation",
                  desc: "Has 3 deals in Negotiation for > 14 days.",
                  details: "Alex tends to get stuck in legal review. Suggest he proactively schedule a joint call with legal and the champion to unblock these deals. Review the 'Global Tracking System' deal specifically."
                })}
              >
                <div className="flex justify-between">
                  <h4 className="font-bold text-sm">Alex Sales</h4>
                  <span className="text-xs font-bold text-orange-600">Medium Impact</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Has 3 deals in Negotiation for &gt; 14 days. Strategy session needed.</p>
              </div>
               <div 
                 className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                 onClick={() => setSelectedCoaching({
                   title: "Jordan Closer - Hygiene Excellence",
                   desc: "100% Pipeline Hygiene this week.",
                   details: "Jordan has maintained perfect records. Ask him to share his 'end of day' routine with the rest of the team during the Monday standup to encourage peer learning."
                 })}
               >
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

      {/* Details Dialog for Risks */}
      <Dialog open={!!selectedRisk} onOpenChange={(open) => !open && setSelectedRisk(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              {selectedRisk?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedRisk?.desc}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto pr-2">
            <h4 className="text-sm font-semibold uppercase text-muted-foreground">Contributing Deals</h4>
            {selectedRisk?.details.map((deal, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-muted/30 rounded border">
                <div>
                  <p className="font-bold text-sm">{deal.title}</p>
                  <p className="text-xs text-muted-foreground">{deal.ownerName} • {deal.stage}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-medium">{formatCurrency(deal.amount)}</p>
                  <Badge variant="outline" className="text-[10px] h-5">{deal.confidence}</Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 text-blue-900 text-sm rounded-md">
            <span className="font-bold">AI Recommendation:</span> {selectedRisk?.type === 'Concentration' ? 'Prioritize small-to-medium deals to diversify risk. Do not rely solely on these whales.' : 'Schedule a "Pipeline Flush" session to close or move these stale deals out.'}
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog for Coaching */}
      <Dialog open={!!selectedCoaching} onOpenChange={(open) => !open && setSelectedCoaching(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5 text-primary" />
              Coaching Insight
            </DialogTitle>
            <DialogDescription className="font-medium text-foreground text-lg">
              {selectedCoaching?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <p className="text-muted-foreground italic">"{selectedCoaching?.desc}"</p>
            <div className="p-4 bg-muted rounded-md border">
              <h4 className="text-sm font-bold mb-2 uppercase tracking-wider text-primary">Action Plan</h4>
              <p className="text-sm leading-relaxed">{selectedCoaching?.details}</p>
            </div>
          </div>
           <div className="flex justify-end gap-2 mt-4">
             <Button variant="outline" onClick={() => setSelectedCoaching(null)}>Close</Button>
             <Button>Add to 1:1 Agenda</Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}
