/**
 * Settings Page
 * 
 * Currently static.
 * Allows users to view configuration options and documentation.
 * 
 * In a real app, this would connect to a user preferences backend.
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences and profile.</p>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
              <CardDescription>Customize your dashboard experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle application visual theme.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Hide Balances</Label>
                    <p className="text-sm text-muted-foreground">
                      Mask sensitive numbers in the dashboard.
                    </p>
                  </div>
                  <Switch />
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
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="john.doe@example.com" disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
             <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Notification settings coming soon.</p>
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
