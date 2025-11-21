/**
 * Accounts Page
 * 
 * Manages the directory of client accounts and their related opportunities.
 * 
 * Features:
 * - Grid view of all accounts with quick contact info
 * - Detailed Account View via Dialog
 * - Activity Logging (Calls, Emails, Notes) linked to specific deals
 * - Ability to add new Opportunities directly from the Account view
 */

import { useState } from "react";
import { getAccounts, getAccountDeals, addActivityToDeal, addDeal, getDeals, Account, Deal } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, Building2, Plus, ExternalLink, CheckCircle2, StickyNote, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Accounts() {
  const accounts = getAccounts();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDealForHistory, setSelectedDealForHistory] = useState<Deal | null>(null);
  const { toast } = useToast();

  // Activity Log State
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [activityForm, setActivityForm] = useState<{
    type: string;
    notes: string;
    dealId: string;
  }>({
    type: "",
    notes: "",
    dealId: ""
  });

  // Add Deal State
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [newDealForm, setNewDealForm] = useState<Partial<Deal>>({});
  const [addDealErrors, setAddDealErrors] = useState<Record<string, string>>({});

  const handleAccountClick = (account: Account) => {
    setSelectedAccount(account);
    setDeals(getAccountDeals(account.id));
  };

  // Initialize form with defaults when opening the Add Deal modal
  const handleAddDealClick = () => {
      setNewDealForm({
          stage: "DISCOVERY",
          confidence: "LOW",
          probability: 20,
          amount: 0,
          currency: "USD",
          nextStepDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setAddDealErrors({});
      setIsAddDealOpen(true);
  };

  const handleSaveNewDeal = () => {
      if (!selectedAccount) return;

      const errors: Record<string, string> = {};
      let hasError = false;

      if (!newDealForm.title?.trim()) {
          errors.title = "Deal title is required";
          hasError = true;
      } else {
          // Check for global duplicates to maintain data integrity
          const allDeals = getDeals();
          const duplicate = allDeals.find(d => d.title.toLowerCase() === newDealForm.title?.trim().toLowerCase());
          if (duplicate) {
              errors.title = "An opportunity with this name already exists";
              hasError = true;
          }
      }

      if ((newDealForm.amount || 0) < 0) {
          errors.amount = "Amount cannot be negative";
          hasError = true;
      }

      if (hasError) {
          setAddDealErrors(errors);
          return;
      }

      const newDeal = addDeal({
          id: `deal-new-${Date.now()}`,
          accountId: selectedAccount.id,
          ownerId: "user-1",
          ownerName: "Alex Sales",
          title: newDealForm.title!,
          amount: newDealForm.amount || 0,
          currency: "USD",
          stage: newDealForm.stage as any,
          confidence: newDealForm.confidence as any,
          closeDate: newDealForm.closeDate!,
          lastActivityDate: new Date().toISOString(),
          nextStep: newDealForm.nextStep || "Initial contact",
          nextStepDate: newDealForm.nextStepDate!,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          probability: newDealForm.probability || 20,
          activities: [],
          notes: ""
      });

      setDeals([...deals, newDeal]);
      toast({ title: "Success", description: "Opportunity added successfully." });
      setIsAddDealOpen(false);
  };

  const handleLogActivity = () => {
    // Basic Validation
    if (!activityForm.type) {
      toast({
        title: "Validation Error",
        description: "Please select an activity type.",
        variant: "destructive"
      });
      return;
    }
    if (!activityForm.notes.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter activity notes.",
        variant: "destructive"
      });
      return;
    }
    if (!activityForm.dealId) {
      toast({
        title: "Validation Error",
        description: "Please select a related opportunity.",
        variant: "destructive"
      });
      return;
    }

    // Save Activity to the mock backend
    const updatedDeal = addActivityToDeal(activityForm.dealId, {
      type: activityForm.type as any,
      notes: activityForm.notes
    });

    if (updatedDeal) {
      // Update local state
      setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
      
      toast({
        title: "Activity Logged",
        description: "The activity has been recorded successfully.",
      });
      
      setIsActivityOpen(false);
      setActivityForm({ type: "", notes: "", dealId: "" });
    }
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

              <Button 
                className="w-full" 
                variant="outline" 
                size="sm"
                onClick={() => setIsActivityOpen(true)}
              >
                <Plus className="w-3 h-3 mr-2" /> Log Activity
              </Button>
            </div>

            {/* Opportunities List */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Open Opportunities</h4>
                <Button size="sm" variant="ghost" className="h-8 text-primary hover:text-primary/80" onClick={handleAddDealClick}>
                  <Plus className="w-3 h-3 mr-1" /> Add Deal
                </Button>
              </div>

              {deals.length === 0 ? (
                <div className="text-center py-8 border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">No active deals found.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                  {deals.map(deal => (
                    <div 
                      key={deal.id} 
                      className="p-4 border rounded-lg bg-card hover:shadow-sm transition-all relative group cursor-pointer"
                      onClick={() => setSelectedDealForHistory(deal)}
                    >
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
                        {deal.activities && deal.activities.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-dashed text-xs flex items-center gap-1 text-blue-600">
                            <MessageSquare className="w-3 h-3" />
                            Last activity: {deal.activities[0].type} on {format(new Date(deal.activities[0].date), 'MMM d')}
                          </div>
                        )}
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

      {/* Deal History Dialog */}
      <Dialog open={!!selectedDealForHistory} onOpenChange={(open) => !open && setSelectedDealForHistory(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Activity History</DialogTitle>
            <DialogDescription>{selectedDealForHistory?.title}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {selectedDealForHistory?.activities?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No activity logged yet.</p>
            ) : (
              selectedDealForHistory?.activities?.map((activity) => (
                <div key={activity.id} className="flex gap-3 text-sm border-b pb-3 last:border-0">
                  <div className="mt-0.5">
                    {activity.type === 'call' ? <Phone className="w-4 h-4 text-blue-500" /> : 
                     activity.type === 'email' ? <Mail className="w-4 h-4 text-purple-500" /> :
                     activity.type === 'note' ? <StickyNote className="w-4 h-4 text-yellow-500" /> :
                     <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold capitalize">{activity.type}</span>
                      <span className="text-xs text-muted-foreground">{format(new Date(activity.date), 'MMM d, h:mm a')}</span>
                    </div>
                    <p className="text-muted-foreground">{activity.notes}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Log Activity Dialog */}
      <Dialog open={isActivityOpen} onOpenChange={setIsActivityOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log Activity</DialogTitle>
            <DialogDescription>
              Record a recent interaction with {selectedAccount?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="deal">Related Opportunity</Label>
              <Select 
                value={activityForm.dealId} 
                onValueChange={(val) => setActivityForm({...activityForm, dealId: val})}
              >
                <SelectTrigger id="deal">
                  <SelectValue placeholder="Select deal..." />
                </SelectTrigger>
                <SelectContent>
                  {deals.map(deal => (
                    <SelectItem key={deal.id} value={deal.id}>{deal.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Activity Type</Label>
              <Select 
                value={activityForm.type} 
                onValueChange={(val) => setActivityForm({...activityForm, type: val})}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="linkedin">LinkedIn Message</SelectItem>
                  <SelectItem value="note">General Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="What was discussed?" 
                value={activityForm.notes}
                onChange={(e) => setActivityForm({...activityForm, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActivityOpen(false)}>Cancel</Button>
            <Button onClick={handleLogActivity}>Save Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Deal Dialog */}
      <Dialog open={isAddDealOpen} onOpenChange={setIsAddDealOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Opportunity</DialogTitle>
            <DialogDescription>Create a new deal for {selectedAccount?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new-title" className={addDealErrors.title ? "text-red-500" : ""}>Deal Title</Label>
                <Input 
                  id="new-title" 
                  value={newDealForm.title || ""} 
                  onChange={(e) => {
                    setNewDealForm({...newDealForm, title: e.target.value});
                    if (addDealErrors.title) setAddDealErrors({...addDealErrors, title: ""});
                  }}
                  className={addDealErrors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
                  placeholder="e.g. Q4 Expansion"
                />
                {addDealErrors.title && <span className="text-xs text-red-500">{addDealErrors.title}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-amount">Amount ($)</Label>
                    <Input 
                      id="new-amount" 
                      type="number"
                      value={newDealForm.amount || 0} 
                      onChange={(e) => setNewDealForm({...newDealForm, amount: Number(e.target.value)})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-stage">Stage</Label>
                    <Select 
                      value={newDealForm.stage} 
                      onValueChange={(val: any) => setNewDealForm({...newDealForm, stage: val})}
                    >
                      <SelectTrigger id="new-stage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DISCOVERY">Discovery</SelectItem>
                        <SelectItem value="PROPOSAL">Proposal</SelectItem>
                        <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="new-nextStep">Next Step</Label>
                <Input 
                  id="new-nextStep" 
                  value={newDealForm.nextStep || ""} 
                  onChange={(e) => setNewDealForm({...newDealForm, nextStep: e.target.value})}
                  placeholder="e.g. Schedule demo"
                />
              </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDealOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNewDeal}>Create Opportunity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
