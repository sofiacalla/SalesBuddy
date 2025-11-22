/**
 * Main Application Component
 * 
 * This is the entry point for the React application.
 * It orchestrates the core infrastructure of the frontend:
 * 
 * 1. Routing: Maps URL paths to specific page components.
 * 2. State Management: Sets up React Query for server state.
 * 3. UI Feedback: Initializes the Toast notification system.
 * 4. Layout: Applies the persistent shell (sidebar/header) to all pages.
 */

// Routing library for handling client-side navigation
import { Switch, Route } from "wouter";

// React Query client configuration for data fetching and caching
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

// Global UI components
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";

// Page components mapped to routes
import Dashboard from "@/pages/Dashboard";
import Accounts from "@/pages/Accounts";
import Pipeline from "@/pages/Pipeline";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";
import RepMyWeek from "@/pages/RepMyWeek";

/**
 * Router Component
 * 
 * Manages the client-side routing logic.
 * 'Switch' ensures only one Route renders at a time.
 * All routes are wrapped in 'Layout' to ensure consistent navigation UI.
 */
function Router() {
  return (
    <Layout>
      <Switch>
        {/* Dashboard: The main landing page showing key metrics */}
        <Route path="/" component={Dashboard} />
        
        {/* My Week: The sales representative's weekly planner and task view */}
        <Route path="/my-week" component={RepMyWeek} />
        
        {/* Accounts: List and management of customer accounts */}
        <Route path="/accounts" component={Accounts} />
        
        {/* Pipeline: Kanban board view of opportunities */}
        <Route path="/pipeline" component={Pipeline} />
        
        {/* Settings: User preferences and app configuration */}
        <Route path="/settings" component={Settings} />
        
        {/* Fallback route: Renders when no other path matches */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

/**
 * App Component
 * 
 * The root React component.
 * wraps the application in necessary global context providers.
 */
function App() {
  return (
    // Provide the QueryClient to the entire component tree
    <QueryClientProvider client={queryClient}>
      {/* Render the Toast container for displaying temporary notifications */}
      <Toaster />
      {/* Render the main application router */}
      <Router />
    </QueryClientProvider>
  );
}

export default App;
