/**
 * Accounts Page
 * 
 * Manages the list of connected financial accounts.
 * Features:
 * - Grid view of all accounts (Checking, Savings, Credit, Investment)
 * - "Add Account" functionality via a Dialog modal
 * - Visual indicators for account types
 */

import { useState } from "react";
import { getAccounts, Account } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Wallet, CreditCard, DollarSign, TrendingUp, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Accounts() {
  // -- State --
  const [accounts, setAccounts] = useState<Account[]>(getAccounts());
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const { toast } = useToast();
  const [newAccount, setNewAccount] = useState<Partial<Account>>({ type: 'checking' });

  // Helper: Get icon based on account type
  const getIcon = (type: string) => {
    switch (type) {
      case 'checking': return <Wallet className="w-5 h-5" />;
      case 'savings': return <DollarSign className="w-5 h-5" />;
      case 'credit': return <CreditCard className="w-5 h-5" />;
      case 'investment': return <TrendingUp className="w-5 h-5" />;
      default: return <Wallet className="w-5 h-5" />;
    }
  };

  // Handler: Add new account
  // Simulates adding an account by updating local state
  const handleAddAccount = () => {
      // Simple Validation
      if (!newAccount.name || !newAccount.institution) {
          toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
          return;
      }

      // Create new account object
      const account: Account = {
          id: `acc-new-${Date.now()}`,
          name: newAccount.name,
          type: newAccount.type as any,
          balance: Math.floor(Math.random() * 10000), // Mock random balance
          accountNumber: `**** ${Math.floor(1000 + Math.random() * 9000)}`,
          institution: newAccount.institution,
          color: "hsl(221.2 83.2% 53.3%)" // Default blue color
      };

      // Update state
      setAccounts([...accounts, account]);
      setIsAddAccountOpen(false);
      toast({ title: "Success", description: "Account added successfully" });
      setNewAccount({ type: 'checking' }); // Reset form
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Accounts</h1>
          <p className="text-muted-foreground mt-1">Manage your bank accounts and credit cards.</p>
        </div>
        <Button className="gap-2 shadow-sm" onClick={() => setIsAddAccountOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Account
        </Button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="relative overflow-hidden group hover:shadow-md transition-all border-t-4" style={{ borderTopColor: account.color }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize text-muted-foreground">
                {account.type}
              </CardTitle>
              {getIcon(account.type)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">${account.balance.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mb-4">{account.institution} • {account.accountNumber}</p>
              <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="h-8 text-xs">View Transactions</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Account Modal */}
      <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>Connect a new bank account or credit card.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input 
                placeholder="e.g. Primary Checking" 
                value={newAccount.name || ""} 
                onChange={e => setNewAccount({...newAccount, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Institution</Label>
              <Input 
                placeholder="e.g. Chase, Wells Fargo" 
                value={newAccount.institution || ""} 
                onChange={e => setNewAccount({...newAccount, institution: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={newAccount.type} onValueChange={(val) => setNewAccount({...newAccount, type: val as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAccountOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAccount}>Add Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
