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
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Getting Started
              </CardTitle>
              <CardDescription>
                Welcome to Sales Buddy! Here is how to manage your weekly rhythm.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-muted/30 p-4 rounded-lg border">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-3">1</div>
                  <h3 className="font-bold mb-2">Update Accounts</h3>
                  <p className="text-sm text-muted-foreground">
                    Go to the <strong>Accounts</strong> tab to add new potential clients. Ensure contact details are accurate for AI outreach suggestions.
                  </p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-3">2</div>
                  <h3 className="font-bold mb-2">Manage Pipeline</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the <strong>Pipeline</strong> view to drag deals between stages. Update "Next Steps" weekly to keep deals from going stale.
                  </p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg border">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-3">3</div>
                  <h3 className="font-bold mb-2">Review Forecast</h3>
                  <p className="text-sm text-muted-foreground">
                    Check the <strong>Dashboard</strong> every Monday. The "Conservative" forecast is your locked-in number; "Optimistic" is your stretch goal.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-bold mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold">How is the forecast calculated?</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Conservative forecast only includes High Confidence deals closing within 14 days. Base includes Medium confidence deals within 30 days.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">What makes a deal "Stale"?</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Any deal without a logged activity or update in the last 7 days is automatically flagged as stale.
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
