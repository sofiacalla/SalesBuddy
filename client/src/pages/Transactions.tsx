import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTransactions } from "@/lib/mockData";
import { format } from "date-fns";
import { Search, Filter, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const transactions = getTransactions();

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) || 
                          t.amount.toString().includes(search);
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-1">View and manage your financial activity.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
           <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[200px]">
               <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
           </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors bg-card">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    t.type === 'income' ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-600"
                  )}>
                    {t.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base">{t.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{format(new Date(t.date), "MMM d, yyyy")}</span>
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
                  <span className="text-xs text-muted-foreground capitalize">{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
