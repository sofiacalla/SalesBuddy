import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Info, CheckCircle } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Settings & Guide</h1>
        <p className="text-muted-foreground mt-1">Configure your workspace and learn how to use Sales Buddy.</p>
      </div>

      <Tabs defaultValue="guide" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="guide">Instruction Guide</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-primary">
                <Info className="w-6 h-6 text-primary" />
                Mastering Sales Buddy
              </CardTitle>
              <CardDescription className="text-base">
                A playbook for high-velocity sales teams. Move beyond data entry and start driving revenue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              
              {/* Section 1: Philosophy */}
              <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
                <h3 className="text-lg font-bold text-foreground mb-2">Why Sales Buddy?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Most CRMs are just databases. Sales Buddy is a <span className="font-semibold text-primary">performance engine</span>. 
                  We stripped away the clutter to focus on the three things that actually matter: 
                  <span className="font-semibold text-foreground"> Forecast Reliability</span>, 
                  <span className="font-semibold text-foreground"> Pipeline Hygiene</span>, and 
                  <span className="font-semibold text-foreground"> Deal Velocity</span>.
                </p>
              </div>

              {/* Section 2: Compelling Use Cases */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  High-Impact Use Cases
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  
                  {/* Use Case A */}
                  <div className="border rounded-lg p-5 hover:shadow-md transition-shadow bg-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">1</div>
                      <h4 className="font-bold text-base">The "No-Surprise" Forecast Call</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Stop asking "what's closing?" and start managing risk.
                    </p>
                    <ul className="space-y-2 text-sm text-foreground/80">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        Use the <strong>Dashboard</strong> to see the exact gap between "Committed" and your quota.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        Click on <strong>"Top Risks"</strong> to see which committed deals are stale or at risk (AI-detected).
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        Drill down into "Uncommitted" to find upside opportunities to bridge the gap.
                      </li>
                    </ul>
                  </div>

                  {/* Use Case B */}
                  <div className="border rounded-lg p-5 hover:shadow-md transition-shadow bg-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">2</div>
                      <h4 className="font-bold text-base">The "My Week" Focus Routine</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      For Reps: Eliminate decision fatigue every morning.
                    </p>
                    <ul className="space-y-2 text-sm text-foreground/80">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        Open the <strong>My Week</strong> tab first thing. The list is auto-sorted by priority (Stale &gt; Value).
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        Use the <strong>Focus Wizard</strong> to update Next Steps, Confidence, and Notes in one flow.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        Clear the list to hit "Inbox Zero" for your pipeline.
                      </li>
                    </ul>
                  </div>

                   {/* Use Case C */}
                   <div className="border rounded-lg p-5 hover:shadow-md transition-shadow bg-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">3</div>
                      <h4 className="font-bold text-base">Pipeline Hygiene Fridays</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Enter the weekend with a clean slate and accurate data.
                    </p>
                    <ul className="space-y-2 text-sm text-foreground/80">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        Check the <strong>Hygiene Score</strong> on the dashboard. Is it below 90%?
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        Filter the <strong>Pipeline</strong> view by "Stale" or missing "Next Steps".
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        Update dates to ensure Monday's forecast is based on reality, not hope.
                      </li>
                    </ul>
                  </div>

                   {/* Use Case D */}
                   <div className="border rounded-lg p-5 hover:shadow-md transition-shadow bg-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">4</div>
                      <h4 className="font-bold text-base">Smart Coaching</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Turn managers into super-coaches with AI insights.
                    </p>
                    <ul className="space-y-2 text-sm text-foreground/80">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Review the <strong>Coaching Opportunities</strong> tile on the dashboard.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Find specific reps struggling with "Negotiation Stagnation" or low "Win Rates".
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        Use the suggested <strong>Action Plans</strong> in your 1:1s to drive specific behavioral changes.
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
              
              <Separator />
              
              {/* FAQ */}
              <div>
                <h3 className="font-bold mb-4 text-lg">Terminology & Concepts</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-muted/30 rounded-md">
                    <h4 className="text-sm font-bold text-foreground">Forecast Categories</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      <strong>Committed:</strong> Deals in 'Committed' stage + 'Won'. Highly reliable.<br/>
                      <strong>Uncommitted:</strong> Upside deals. Good for gap filling.<br/>
                      <strong>Leads:</strong> Early stage, rarely count towards current month.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-md">
                    <h4 className="text-sm font-bold text-foreground">Deal Health</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      <strong>Stale:</strong> No activity &gt; 7 days.<br/>
                      <strong>Risk:</strong> High value but low engagement or stuck in stage.<br/>
                      <strong>Hygiene:</strong> Completeness of data fields.
                    </p>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Configuration</CardTitle>
              <CardDescription>Customize how Sales Buddy works for your team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Stale Deal Threshold</Label>
                    <p className="text-sm text-muted-foreground">
                      Days of inactivity before flagging a deal as stale.
                    </p>
                  </div>
                  <div className="w-[100px]">
                    <Input type="number" defaultValue="7" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Strict Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Require "Next Step" and "Date" for all active deals.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">AI Insights</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable automated deal coaching suggestions.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" defaultValue="John Smith" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Sales Manager" disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
