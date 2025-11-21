import { useState, useEffect } from "react";
import { getDeals, Deal, updateDeal } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Filter, Plus, Download, Search, Save } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Pipeline() {
  const [deals, setDeals] = useState(getDeals());
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("ALL");
  const { toast } = useToast();

  // Edit Dialog State
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [editForm, setEditForm] = useState<Partial<Deal>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEditClick = (deal: Deal) => {
    setEditingDeal(deal);
    setErrors({});
    setEditForm({
      title: deal.title,
      amount: deal.amount,
      stage: deal.stage,
      probability: deal.probability,
      nextStep: deal.nextStep,
      confidence: deal.confidence
    });
  };

  const handleSaveDeal = () => {
    if (!editingDeal) return;
    
    const newErrors: Record<string, string> = {};
    let hasError = false;

    // Validation
    if (!editForm.title?.trim()) {
      newErrors.title = "Deal title is required";
      hasError = true;
    }
    if ((editForm.amount || 0) < 0) {
      newErrors.amount = "Amount cannot be negative";
      hasError = true;
    }
    if ((editForm.probability || 0) < 0 || (editForm.probability || 0) > 100) {
      newErrors.probability = "Probability must be between 0 and 100";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const updated = updateDeal(editingDeal.id, editForm);
    if (updated) {
      setDeals(prev => prev.map(d => d.id === editingDeal.id ? updated : d));
      toast({ title: "Success", description: "Opportunity updated successfully." });
      setEditingDeal(null);
    }
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(search.toLowerCase()) || 
                          deal.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === "ALL" || deal.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const getConfidenceColor = (conf: string) => {
    switch(conf) {
      case "HIGH": return "bg-green-100 text-green-700 border-green-200";
      case "MEDIUM": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "LOW": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Pipeline Details</h1>
          <p className="text-muted-foreground mt-1">Full visibility into every opportunity.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Add Opportunity
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search deals, owners..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Stages</SelectItem>
                  <SelectItem value="DISCOVERY">Discovery</SelectItem>
                  <SelectItem value="PROPOSAL">Proposal</SelectItem>
                  <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                  <SelectItem value="CLOSED_WON">Closed Won</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[250px]">Deal Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Next Step</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.map((deal) => (
                <TableRow 
                  key={deal.id} 
                  className="group cursor-pointer hover:bg-muted/20"
                  onClick={() => handleEditClick(deal)}
                >
                  <TableCell className="font-medium">
                    {deal.title}
                    <div className="text-xs text-muted-foreground font-normal mt-0.5">
                      Close: {format(new Date(deal.closeDate), 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>{deal.ownerName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-xs uppercase tracking-wider">
                      {deal.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-medium">{formatCurrency(deal.amount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-secondary rounded-full h-2 w-16">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${deal.probability}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate text-sm" title={deal.nextStep}>
                      {deal.nextStep}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Due: {format(new Date(deal.nextStepDate), 'MMM d')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getConfidenceColor(deal.confidence)}`}>
                      {deal.confidence}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Opportunity Dialog */}
      <Dialog open={!!editingDeal} onOpenChange={(open) => !open && setEditingDeal(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Opportunity</DialogTitle>
            <DialogDescription>Update details for {editingDeal?.title}</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className={errors.title ? "text-red-500" : ""}>Deal Title</Label>
                <Input 
                  id="title" 
                  value={editForm.title || ""} 
                  onChange={(e) => {
                    setEditForm({...editForm, title: e.target.value});
                    if (errors.title) setErrors({...errors, title: ""});
                  }}
                  className={errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount" className={errors.amount ? "text-red-500" : ""}>Amount ($)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  value={editForm.amount || 0} 
                  onChange={(e) => {
                    setEditForm({...editForm, amount: Number(e.target.value)});
                    if (errors.amount) setErrors({...errors, amount: ""});
                  }}
                  className={errors.amount ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.amount && <span className="text-xs text-red-500">{errors.amount}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stage">Stage</Label>
                <Select 
                  value={editForm.stage} 
                  onValueChange={(val: any) => setEditForm({...editForm, stage: val})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DISCOVERY">Discovery</SelectItem>
                    <SelectItem value="PROPOSAL">Proposal</SelectItem>
                    <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                    <SelectItem value="CLOSED_WON">Closed Won</SelectItem>
                    <SelectItem value="CLOSED_LOST">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                 <Label htmlFor="confidence">Confidence</Label>
                <Select 
                  value={editForm.confidence} 
                  onValueChange={(val: any) => setEditForm({...editForm, confidence: val})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nextStep">Next Step</Label>
              <Input 
                id="nextStep" 
                value={editForm.nextStep || ""} 
                onChange={(e) => setEditForm({...editForm, nextStep: e.target.value})} 
              />
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="probability" className={errors.probability ? "text-red-500" : ""}>Probability (%)</Label>
                <span className="text-xs text-muted-foreground">{editForm.probability}%</span>
              </div>
              <Input 
                id="probability" 
                type="number" 
                min="0" 
                max="100" 
                value={editForm.probability || 0} 
                onChange={(e) => {
                  setEditForm({...editForm, probability: Number(e.target.value)});
                  if (errors.probability) setErrors({...errors, probability: ""});
                }}
                className={errors.probability ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.probability && <span className="text-xs text-red-500">{errors.probability}</span>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDeal(null)}>Cancel</Button>
            <Button onClick={handleSaveDeal} className="gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
