/**
 * Main Application Layout Component
 * 
 * This component provides the persistent shell for the application.
 * It includes:
 * 1. A persistent Sidebar for navigation
 * 2. A top Header for global actions (Search, Notifications)
 * 3. A main content area that renders the current page
 * 
 * It handles responsive behavior and global search functionality.
 */

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, CreditCard, PieChart, Settings, Bell, Search, Wallet, Target, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTransactions, getAccounts } from "@/lib/mockData";

export default function Layout({ children }: { children: React.ReactNode }) {
  // -- State Management --
  const [location, setLocation] = useLocation(); // Current URL path
  const [searchQuery, setSearchQuery] = useState(""); // Global search input
  const [searchResults, setSearchResults] = useState<any[]>([]); // Live search results
  const [showResults, setShowResults] = useState(false); // Dropdown visibility
  const searchRef = useRef<HTMLDivElement>(null); // Ref for click-outside detection

  // -- Effects --

  // Effect: Handle clicks outside the search box to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Effect: Live Search Logic
  // Filters transactions and accounts based on user input
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    
    // Perform search against mock data
    const transactions = getTransactions().filter(t => t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const accounts = getAccounts().filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Combine results, prioritizing accounts, and limit to 6 items
    setSearchResults([
      ...accounts.map(a => ({ type: 'account', data: a })),
      ...transactions.map(t => ({ type: 'transaction', data: t }))
    ].slice(0, 6));
  }, [searchQuery]);

  // -- Handlers --

  // Navigation handler for search results
  const handleResultClick = (result: any) => {
    if (result.type === 'account') {
      setLocation('/accounts');
    } else {
      setLocation('/transactions');
    }
    setShowResults(false);
    setSearchQuery("");
  };

  // Navigation Menu Configuration
  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Overview" },
    { href: "/transactions", icon: CreditCard, label: "Transactions" },
    { href: "/budget", icon: PieChart, label: "Budget" },
    { href: "/goals", icon: Target, label: "Goals" }, // Placeholder link
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex">
      {/* --- Sidebar Section --- */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shrink-0 transition-all duration-300 ease-in-out">
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">FinTrack</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                  <item.icon className="w-4 h-4" />
                  {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-md bg-sidebar-accent/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              JD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">Premium Member</p>
            </div>
            <LogOut className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          
          {/* Global Search Bar */}
          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="relative w-full" ref={searchRef}>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full bg-muted/50 pl-9 pr-4 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
              />
              
              {/* Search Results Dropdown Panel */}
              {showResults && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-popover rounded-md border shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Results
                      </div>
                      {searchResults.map((result, idx) => (
                        <button
                          key={`${result.type}-${result.data.id}-${idx}`}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-3 transition-colors"
                          onClick={() => handleResultClick(result)}
                        >
                          {result.type === 'account' ? (
                            <Wallet className="w-4 h-4 text-blue-500 shrink-0" />
                          ) : (
                            <CreditCard className="w-4 h-4 text-green-500 shrink-0" />
                          )}
                          <div className="truncate">
                            <div className="font-medium text-foreground">
                              {result.type === 'account' ? result.data.name : result.data.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {result.type === 'account' ? 'Account' : `Transaction • $${result.data.amount}`}
                            </div>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
