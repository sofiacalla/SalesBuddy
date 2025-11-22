/**
 * Main Application Layout
 * 
 * Wraps all pages with:
 * 1. Sidebar Navigation: persistent navigation links
 * 2. Top Header: Global search and user profile
 * 3. Global Search: Instant search for Deals and Accounts
 * 4. Responsive Container: Handles scrolling and layout structure
 */

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, CreditCard, PieChart, Settings, Bell, Search, Wallet, Target, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTransactions, getAccounts } from "@/lib/mockData";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
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

  // Live Search Implementation
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    
    // Search in both Deals and Accounts
    const transactions = getTransactions().filter(t => t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const accounts = getAccounts().filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Combine and limit results
    setSearchResults([
      ...accounts.map(a => ({ type: 'account', data: a })),
      ...transactions.map(t => ({ type: 'transaction', data: t }))
    ].slice(0, 6));
  }, [searchQuery]);

  const handleResultClick = (result: any) => {
    if (result.type === 'account') {
      setLocation('/accounts'); // We'll keep accounts page but maybe refresh it later
    } else {
      setLocation('/transactions');
    }
    setShowResults(false);
    setSearchQuery("");
  };

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Overview" },
    { href: "/transactions", icon: CreditCard, label: "Transactions" },
    { href: "/budget", icon: PieChart, label: "Budget" },
    { href: "/goals", icon: Target, label: "Goals" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shrink-0 transition-all duration-300 ease-in-out">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">FinTrack</span>
        </div>

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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
        {/* Top Header */}
        <header className="h-16 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
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
              
              {/* Search Results Dropdown */}
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
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
