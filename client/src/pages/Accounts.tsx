import { useState } from "react";
import { getAccounts, getAccountDeals, Account, Deal } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Building2, Plus, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function Accounts() {
  const accounts = getAccounts();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);

  const handleAccountClick = (account: Account) => {
    setSelectedAccount(account);
    setDeals(getAccountDeals(account.id));
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Accounts</h1>
          <p className="text-muted-foreground mt-1">Manage your key relationships.</p>
        </div>
        <Button className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card 
            key={account.id} 
            className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
            onClick={() => handleAccountClick(account)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  {account.name.substring(0, 2).toUpperCase()}
                </div>
                <Badge variant="outline" className="text-xs font-normal">{account.industry}</Badge>
              </div>
              <CardTitle className="mt-4 text-lg">{account.name}</CardTitle>
              <CardDescription>{account.contactFirstName} {account.contactLastName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  {account.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  {account.phone}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Account Detail Dialog */}
      <Dialog open={!!selectedAccount} onOpenChange={(open) => !open && setSelectedAccount(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              {selectedAccount?.name}
            </DialogTitle>
            <DialogDescription className="text-base">
              Account Details & Opportunities
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {/* Contact Info Sidebar */}
            <div className="md:col-span-1 space-y-4 border-r pr-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Primary Contact</h4>
                <div className="text-lg font-medium">{selectedAccount?.contactFirstName} {selectedAccount?.contactLastName}</div>
                <div className="text-sm text-foreground/80 mt-1 flex items-center gap-2">
                  <Phone className="w-3 h-3" /> {selectedAccount?.phone}
                </div>
                <div className="text-sm text-foreground/80 mt-1 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> {selectedAccount?.email}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-900 border border-blue-100">
                <h5 className="font-bold mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  AI Insight
                </h5>
                <p>High engagement detected. Consider proposing a multi-year contract extension during the next QBR.</p>
              </div>

              <Button className="w-full" variant="outline" size="sm">
                <Plus className="w-3 h-3 mr-2" /> Log Activity
              </Button>
            </div>

            {/* Opportunities List */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Open Opportunities</h4>
                <Button size="sm" variant="ghost" className="h-8 text-primary hover:text-primary/80">
                  <Plus className="w-3 h-3 mr-1" /> Add Deal
                </Button>
              </div>

              {deals.length === 0 ? (
                <div className="text-center py-8 border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">No active deals found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {deals.map(deal => (
                    <div key={deal.id} className="p-4 border rounded-lg bg-card hover:shadow-sm transition-all relative group">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-base">{deal.title}</h5>
                        <span className="font-mono font-bold text-primary">{formatCurrency(deal.amount)}</span>
                      </div>
                      
                      <div className="flex gap-2 mb-3">
                        <Badge variant="secondary" className="rounded-sm font-normal">{deal.stage}</Badge>
                        <Badge variant={deal.confidence === 'HIGH' ? 'default' : deal.confidence === 'MEDIUM' ? 'secondary' : 'outline'} className="rounded-sm font-normal text-xs">
                          {deal.confidence} Confidence
                        </Badge>
                      </div>

                      <div className="text-sm text-muted-foreground border-t pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span>Next: <span className="text-foreground font-medium">{deal.nextStep}</span></span>
                          <span className="text-xs">{format(new Date(deal.nextStepDate), 'MMM d')}</span>
                        </div>
                      </div>
                      
                      <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
