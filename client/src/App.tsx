/**
 * Main Application Component
 * 
 * This is the root React component that orchestrates the entire application.
 * It is responsible for:
 * 1. Setting up Global Providers (QueryClient for data fetching, Toaster for notifications)
 * 2. Defining the Client-Side Routing logic using 'wouter'
 * 3. Integrating the main Application Layout
 */

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Budget from "@/pages/Budget";
import Settings from "@/pages/Settings";
import Accounts from "@/pages/Accounts";
import NotFound from "@/pages/not-found";

/**
 * Router Configuration
 * 
 * Defines the map between URL paths and React Components.
 * The <Switch> component ensures only the first matching route is rendered.
 * All routes are wrapped in the <Layout> component to ensure persistent navigation.
 */
function Router() {
  return (
    <Layout>
      <Switch>
        {/* Dashboard / Overview Page - The landing page */}
        <Route path="/" component={Dashboard} />
        
        {/* Transactions List Page */}
        <Route path="/transactions" component={Transactions} />
        
        {/* Budgeting & Spending Analysis Page */}
        <Route path="/budget" component={Budget} />
        
        {/* Settings & Configuration Page */}
        <Route path="/settings" component={Settings} />
        
        {/* Accounts Management Page */}
        <Route path="/accounts" component={Accounts} />
        
        {/* Fallback 404 Page for unknown routes */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

/**
 * Root App Component
 * 
 * Composes the providers and the router.
 * - QueryClientProvider: Enables React Query for data management
 * - Toaster: Renders toast notifications at the top level
 * - Router: Handles navigation
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
