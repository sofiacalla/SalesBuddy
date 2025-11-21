import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Accounts from "@/pages/Accounts";
import Pipeline from "@/pages/Pipeline";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

import RepMyWeek from "@/pages/RepMyWeek";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/my-week" component={RepMyWeek} />
        <Route path="/accounts" component={Accounts} />
        <Route path="/pipeline" component={Pipeline} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
