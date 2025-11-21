import { useState, useEffect } from "react";
import { getDeals, updateDeal, Deal } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Calendar as CalendarIcon, AlertCircle, ArrowRight, Save } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

/**
 * Rep "My Week" Page
 * 
 * Designed for individual sales representatives.
 * Focuses on execution and prioritization rather than high-level analytics.
 * 
 * Key Features:
 * 1. Prioritized Task List: Auto-sorted by urgency (Stale > Value > Date)
 * 2. Inline Update Wizard: Step-by-step flow to update deal status
 * 3. Focus Mode: Removes distractions to help reps clear their queue
 */

import { useState, useEffect } from "react";
import { getDeals, updateDeal, Deal } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Calendar as CalendarIcon, AlertCircle, ArrowRight, Save } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function RepMyWeek() {
  const [deals, setDeals] = useState(getDeals());
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const { toast } = useToast();

  // Local state for form fields to allow editing before saving
  const [formData, setFormData] = useState<Partial<Deal>>({});

  // Sync form data when selection changes
  useEffect(() => {
    if (selectedDealId) {
      const deal = deals.find(d => d.id === selectedDealId);
      if (deal) {
        setFormData({
          nextStep: deal.nextStep,
          nextStepDate: deal.nextStepDate,
          confidence: deal.confidence,
          stage: deal.stage,
          notes: deal.notes || ""
        });
      }
    }
  }, [selectedDealId, deals]);

  // Sort deals by priority: Stale > High Value > Closing Soon
  const priorityDeals = [...deals].sort((a, b) => {
    const now = new Date();
    const aStale = differenceInDays(now, parseISO(a.lastActivityDate)) > 7;
    const bStale = differenceInDays(now, parseISO(b.lastActivityDate)) > 7;
    
    if (aStale && !bStale) return -1;
    if (!aStale && bStale) return 1;
    return b.amount - a.amount;
  });

  const selectedDeal = deals.find(d => d.id === selectedDealId);

  const handleSaveUpdate = () => {
    if (!selectedDealId) return;

    const updated = updateDeal(selectedDealId, formData);
    if (updated) {
      setDeals(prev => prev.map(d => d.id === selectedDealId ? updated : d));
      toast({
        title: "Deal Updated",
        description: "Your changes have been saved successfully.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">My Week</h1>
        <p className="text-muted-foreground mt-1">Focus on what matters. Top priority actions for you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Priority List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Action Items</h3>
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {priorityDeals.map((deal, index) => {
              const isStale = differenceInDays(new Date(), parseISO(deal.lastActivityDate)) > 7;
              
              return (
                <Card 
                  key={deal.id} 
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md border-l-4",
                    selectedDealId === deal.id ? "border-l-primary ring-2 ring-primary/20" : "border-l-transparent hover:border-l-primary/50",
                    isStale && "border-l-orange-500"
                  )}
                  onClick={() => setSelectedDealId(deal.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                        #{index + 1} Priority
                      </Badge>
                      {isStale && (
                        <div className="flex items-center gap-1 text-xs text-orange-600 font-bold">
                          <AlertCircle className="w-3 h-3" /> Stale
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-lg leading-tight mb-1">{deal.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{deal.ownerName}</p>
                    <div className="flex justify-between items-center text-sm mt-auto">
                      <span className="font-mono font-medium text-base">${deal.amount.toLocaleString()}</span>
                      <span className="text-xs bg-secondary px-2.5 py-1 rounded-full font-medium">{deal.stage}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Column: Inline Wizard */}
        <div className="lg:col-span-2">
          {selectedDeal ? (
            <Card className="h-full border-t-4 border-t-primary">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedDeal.title}</CardTitle>
                    <CardDescription className="mt-1">
                      Current Stage: <span className="font-semibold text-foreground">{selectedDeal.stage}</span> • 
                      Close Date: <span className="font-semibold text-foreground">{format(parseISO(selectedDeal.closeDate), 'MMM d, yyyy')}</span>
                    </CardDescription>
                  </div>
                  <Badge className={cn(
                    "text-sm px-3 py-1",
                    selectedDeal.confidence === 'HIGH' ? "bg-green-100 text-green-800 hover:bg-green-200" : 
                    selectedDeal.confidence === 'MEDIUM' ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : 
                    "bg-red-100 text-red-800 hover:bg-red-200"
                  )}>
                    {selectedDeal.confidence} CONFIDENCE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Wizard Step 1: Next Steps */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm">1</div>
                    Update Next Steps
                  </div>
                  <div className="grid gap-4 pl-8">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">What needs to happen next?</label>
                      <Input 
                        value={formData.nextStep || ""}
                        onChange={(e) => setFormData({...formData, nextStep: e.target.value})}
                        placeholder="E.g., Send final contract for review"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">When is it due?</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.nextStepDate ? format(parseISO(formData.nextStepDate), "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar 
                            mode="single" 
                            selected={formData.nextStepDate ? parseISO(formData.nextStepDate) : undefined}
                            onSelect={(date) => setFormData({...formData, nextStepDate: date?.toISOString()})}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Wizard Step 2: Confidence & Stage */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-primary font-semibold">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm">2</div>
                    Pipeline Health
                  </div>
                  <div className="grid grid-cols-2 gap-4 pl-8">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confidence Level</label>
                      <Select 
                        value={formData.confidence} 
                        onValueChange={(val: any) => setFormData({...formData, confidence: val})}
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stage</label>
                       <Select 
                         value={formData.stage} 
                         onValueChange={(val: any) => setFormData({...formData, stage: val})}
                       >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DISCOVERY">Discovery</SelectItem>
                          <SelectItem value="PROPOSAL">Proposal</SelectItem>
                          <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                          <SelectItem value="CLOSED_WON">Closed Won</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Wizard Step 3: Notes */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-primary font-semibold">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm">3</div>
                    Latest Notes
                  </div>
                  <div className="pl-8">
                    <Textarea 
                      value={formData.notes || ""}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Log call notes or specific blockers..." 
                      className="min-h-[100px]" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button className="gap-2 w-full md:w-auto" onClick={handleSaveUpdate}>
                    <Save className="w-4 h-4" />
                    Save Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 border-2 border-dashed rounded-lg bg-muted/10">
              <ArrowRight className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a deal to update</p>
              <p className="text-sm">Choose from your priority list on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
