/**
 * Dashboard Page
 * 
 * The main landing page for the application.
 * Aggregates key financial metrics into a high-level overview:
 * 1. Net Worth calculation
 * 2. Account Balances summary
 * 3. Monthly Spending Trend (Bar Chart)
 * 4. Budget Utilization (Circular Progress)
 * 5. Recent Activity Feed
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAccounts, getMonthlySpending, getRecentTransactions, getBudgets } from "@/lib/mockData";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, TrendingUp, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  // Fetch data from mock backend
  const accounts = getAccounts();
  const recentTransactions = getRecentTransactions(5);
  const monthlySpending = getMonthlySpending();
  const budgets = getBudgets();

  // Calculate High-Level Metrics
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const totalBudget = budgets.reduce((acc, curr) => acc + curr.allocated, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);

  return (
    <div className="space-y-8">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Financial Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back, John. Here's your financial summary.</p>
        </div>
        <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm">
           <div className="text-sm font-medium text-muted-foreground px-2">Net Worth</div>
           <div className="text-2xl font-bold text-primary">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* --- Account Cards Grid --- */}
      {/* Displays a card for each account with dynamic icons based on type */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="relative overflow-hidden border-l-4" style={{ borderLeftColor: account.color }}>
            <CardHeader className="pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex justify-between">
                {account.type}
                {/* Conditional Icon Rendering */}
                {account.type === 'checking' && <Wallet className="w-4 h-4 opacity-50" />}
                {account.type === 'savings' && <DollarSign className="w-4 h-4 opacity-50" />}
                {account.type === 'credit' && <CreditCard className="w-4 h-4 opacity-50" />}
                {account.type === 'investment' && <TrendingUp className="w-4 h-4 opacity-50" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${account.balance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{account.name} • {account.accountNumber}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Spending Bar Chart (Recharts) */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
            <CardDescription>Your expense history over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpending} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickFormatter={(val) => `$${val}`} tickLine={false} axisLine={false} fontSize={12} />
                <RechartsTooltip 
                  cursor={{ fill: 'transparent' }}
                  formatter={(value: number) => [`$${value}`, "Spent"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={40} fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget Summary Widget */}
        {/* Custom SVG Circular Progress Bar */}
        <Card className="shadow-sm">
             <CardHeader>
                <CardTitle>Budget Snapshot</CardTitle>
                <CardDescription>This Month</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                         {/* Background Circle */}
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                            {/* Progress Circle */}
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" 
                                strokeDasharray={440} // Circumference approx
                                strokeDashoffset={440 - (440 * (totalSpent / totalBudget))}
                                className={cn("transition-all duration-1000 ease-out", totalSpent > totalBudget ? "text-red-500" : "text-primary")}
                            />
                         </svg>
                         {/* Centered Label */}
                         <div className="absolute text-center">
                             <span className="text-3xl font-bold block">{Math.round((totalSpent / totalBudget) * 100)}%</span>
                             <span className="text-xs text-muted-foreground">Used</span>
                         </div>
                    </div>
                    <div className="mt-6 w-full space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Spent</span>
                            <span className="font-medium">${totalSpent.toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Remaining</span>
                            <span className="font-medium text-green-600">${(totalBudget - totalSpent).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* --- Recent Transactions List --- */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  {/* Transaction Icon (Income vs Expense) */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    t.type === 'income' ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-600"
                  )}>
                    {t.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base">{t.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{format(new Date(t.date), "MMM d")}</span>
                      <span>•</span>
                      <span>{t.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "font-bold block",
                    t.type === 'income' ? "text-green-600" : "text-foreground"
                  )}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
