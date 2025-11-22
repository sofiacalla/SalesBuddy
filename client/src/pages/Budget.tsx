/**
 * Budget Page
 * 
 * Provides a detailed breakdown of spending against allocated limits.
 * Features:
 * 1. Overall Budget Progress Bar
 * 2. Per-Category Progress Bars
 * 3. Visual breakdown via Pie Chart
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getBudgets, getSpendingByCategory } from "@/lib/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Budget() {
  // Fetch data
  const budgets = getBudgets();
  const spendingByCategory = getSpendingByCategory();

  // Calculate High-Level Aggregates
  const totalBudget = budgets.reduce((acc, curr) => acc + curr.allocated, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const overallProgress = (totalSpent / totalBudget) * 100;

  return (
    <div className="space-y-8">
       <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Budgeting</h1>
          <p className="text-muted-foreground mt-1">Track your spending against your goals.</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Left Column: Detailed Breakdown --- */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Overview</CardTitle>
              <CardDescription>You have spent ${totalSpent} of your ${totalBudget} monthly limit.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Total Progress Section */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Total Budget Used</span>
                  <span className="font-bold">{overallProgress.toFixed(1)}%</span>
                </div>
                <Progress value={overallProgress} className="h-4" />
              </div>

              {/* Category Progress List */}
              <div className="space-y-6">
                {budgets.map((category) => {
                  const progress = (category.spent / category.allocated) * 100;
                  const isOverBudget = progress > 100;

                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-sm">
                          <span className={isOverBudget ? "text-red-500 font-bold" : "text-muted-foreground"}>
                            ${category.spent}
                          </span>
                          <span className="text-muted-foreground"> / ${category.allocated}</span>
                        </div>
                      </div>
                      {/* Custom Progress Bar with Color Overrides */}
                      <Progress 
                        value={progress} 
                        className="h-2 bg-slate-100" 
                        style={{ 
                            // Use red if over budget, otherwise use category color
                            "--progress-background": isOverBudget ? "rgb(239 68 68)" : category.color 
                        } as any}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- Right Column: Visual Breakdown --- */}
        <div className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>Spending Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {/* Pie Chart */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {spendingByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={budgets.find(b => b.name === entry.name)?.color || "#cbd5e1"} />
                    ))}
                  </Pie>
                  <Tooltip 
                     formatter={(value: number) => [`$${value}`, 'Spent']}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {spendingByCategory.slice(0,5).map((entry, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: budgets.find(b => b.name === entry.name)?.color || "#cbd5e1" }} />
                          {entry.name}
                      </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
