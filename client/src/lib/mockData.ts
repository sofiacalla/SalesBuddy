/**
 * Mock Data Service
 * 
 * This file acts as a simulated backend database for the prototype.
 * It generates realistic financial data (Accounts, Transactions, Budgets) 
 * so the UI has content to display without needing a real server.
 */

import { subDays, subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from "date-fns";

// --- Type Definitions ---

/**
 * Transaction Types
 * Defining the shape of transaction data used across the app.
 */
export type TransactionType = "income" | "expense";
export type TransactionStatus = "completed" | "pending";

export interface Transaction {
  id: string;
  date: string;        // ISO Date String
  description: string; // Merchant or Description
  amount: number;
  category: string;    // e.g., "Groceries", "Utilities"
  type: TransactionType;
  status: TransactionStatus;
  merchantLogo?: string; // Optional URL for logo
}

/**
 * Account Types
 * Represents bank accounts, credit cards, etc.
 */
export interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | "investment";
  balance: number;
  accountNumber: string; // Masked string like "**** 1234"
  institution: string;   // e.g., "Chase", "Wells Fargo"
  color: string;         // CSS color value for UI theming
}

/**
 * Budget Category Types
 * Represents spending limits for specific categories.
 */
export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number; // Budgeted amount
  spent: number;     // Actual amount spent
  color: string;     // Chart color
}

// --- Mock Data Constants & Generation ---

const CATEGORIES = [
  "Groceries", "Dining Out", "Housing", "Transportation", "Entertainment", "Utilities", "Health", "Shopping", "Income"
];

// List of popular merchants to generate realistic descriptions
const MERCHANTS = [
  { name: "Whole Foods Market", category: "Groceries", logo: "https://logo.clearbit.com/wholefoodsmarket.com" },
  { name: "Trader Joe's", category: "Groceries", logo: "https://logo.clearbit.com/traderjoes.com" },
  { name: "Uber", category: "Transportation", logo: "https://logo.clearbit.com/uber.com" },
  { name: "Netflix", category: "Entertainment", logo: "https://logo.clearbit.com/netflix.com" },
  { name: "Starbucks", category: "Dining Out", logo: "https://logo.clearbit.com/starbucks.com" },
  { name: "Amazon", category: "Shopping", logo: "https://logo.clearbit.com/amazon.com" },
  { name: "Target", category: "Shopping", logo: "https://logo.clearbit.com/target.com" },
  { name: "Shell", category: "Transportation", logo: "https://logo.clearbit.com/shell.com" },
  { name: "Pacific Gas & Electric", category: "Utilities", logo: "https://logo.clearbit.com/pge.com" },
  { name: "Spotify", category: "Entertainment", logo: "https://logo.clearbit.com/spotify.com" },
  { name: "Sweetgreen", category: "Dining Out", logo: "https://logo.clearbit.com/sweetgreen.com" },
  { name: "CVS Pharmacy", category: "Health", logo: "https://logo.clearbit.com/cvs.com" },
];

/**
 * Generates a list of random transactions to simulate history.
 * Includes consistent salary deposits and random expenses.
 * 
 * @param count - Number of random expense transactions to generate
 */
const generateTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  // 1. Generate Recurring Salary (Income)
  // Simulates bi-weekly paychecks for the last 6 months
  for (let i = 0; i < 6; i++) {
     // Mid-month paycheck
     transactions.push({
        id: `txn-salary-${i}`,
        date: subMonths(new Date(now.getFullYear(), now.getMonth(), 15), i).toISOString(),
        description: "Direct Deposit - Tech Corp Inc.",
        amount: 5200.00,
        category: "Income",
        type: "income",
        status: "completed"
     });
     // End-of-month paycheck
     transactions.push({
        id: `txn-salary-2-${i}`,
        date: subMonths(new Date(now.getFullYear(), now.getMonth(), 30), i).toISOString(),
        description: "Direct Deposit - Tech Corp Inc.",
        amount: 5200.00,
        category: "Income",
        type: "income",
        status: "completed"
     });
  }

  // 2. Generate Random Expenses
  for (let i = 0; i < count; i++) {
    const merchant = MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
    // Weight dates towards recent days for realism
    const isRecent = Math.random() > 0.8;
    const date = subDays(now, Math.floor(Math.random() * (isRecent ? 5 : 90)));
    const amount = Math.floor(Math.random() * 15000) / 100 + 5; // Random amount between $5.00 and $155.00

    transactions.push({
      id: `txn-${i}`,
      date: date.toISOString(),
      description: merchant.name,
      amount: amount,
      category: merchant.category,
      type: "expense",
      // Mark recent transactions as pending to show status variety
      status: i < 3 ? "pending" : "completed",
      merchantLogo: merchant.logo
    });
  }
  
  // 3. Generate Fixed Monthly Bills (Rent)
  for (let i = 0; i < 3; i++) {
      transactions.push({
          id: `txn-rent-${i}`,
          date: subMonths(new Date(now.getFullYear(), now.getMonth(), 1), i).toISOString(),
          description: "Luxury Apartments Rent",
          amount: 2450.00,
          category: "Housing",
          type: "expense",
          status: "completed"
      });
  }

  // Sort by date descending (newest first)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// --- Static Data Definitions ---

export const ACCOUNTS: Account[] = [
  {
    id: "acc-1",
    name: "Platinum Checking",
    type: "checking",
    balance: 12450.32,
    accountNumber: "**** 4582",
    institution: "Chase",
    color: "hsl(221.2 83.2% 53.3%)" // Blue
  },
  {
    id: "acc-2",
    name: "High Yield Savings",
    type: "savings",
    balance: 45200.00,
    accountNumber: "**** 9921",
    institution: "Ally",
    color: "hsl(162 94% 30%)" // Green
  },
  {
    id: "acc-3",
    name: "Sapphire Reserve",
    type: "credit",
    balance: -1240.50,
    accountNumber: "**** 1122",
    institution: "Chase",
    color: "hsl(262.1 83.3% 57.8%)" // Purple
  },
   {
    id: "acc-4",
    name: "Investment Portfolio",
    type: "investment",
    balance: 89500.75,
    accountNumber: "**** 7744",
    institution: "Vanguard",
    color: "hsl(31 97% 53%)" // Orange
  }
];

export const TRANSACTIONS = generateTransactions(150);

export const BUDGETS: BudgetCategory[] = [
  { id: "cat-1", name: "Groceries", allocated: 600, spent: 450, color: "hsl(162 94% 30%)" },
  { id: "cat-2", name: "Dining Out", allocated: 400, spent: 320, color: "hsl(31 97% 53%)" },
  { id: "cat-3", name: "Entertainment", allocated: 200, spent: 180, color: "hsl(262.1 83.3% 57.8%)" },
  { id: "cat-4", name: "Transportation", allocated: 300, spent: 150, color: "hsl(221.2 83.2% 53.3%)" },
  { id: "cat-5", name: "Shopping", allocated: 500, spent: 620, color: "hsl(346.8 77.2% 49.8%)" }, // Intentionally over budget for demo
];

// --- Data Accessor Functions ---
// These act as our "API" layer

export const getAccounts = () => ACCOUNTS;
export const getTransactions = () => TRANSACTIONS;
export const getBudgets = () => BUDGETS;
export const getRecentTransactions = (limit = 5) => TRANSACTIONS.slice(0, limit);

/**
 * Calculates total spending per month for the last 6 months.
 * Used for the main dashboard bar chart.
 */
export const getMonthlySpending = () => {
    const result = [];
    const now = new Date();
    
    for(let i = 5; i >= 0; i--) {
        const monthDate = subMonths(now, i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        
        // Filter expenses for this specific month
        const monthlyTxns = TRANSACTIONS.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= monthStart && tDate <= monthEnd && t.type === 'expense';
        });
        
        // Sum up the amount
        const total = monthlyTxns.reduce((sum, t) => sum + t.amount, 0);
        
        result.push({
            name: format(monthDate, 'MMM'),
            amount: Math.round(total)
        });
    }
    return result;
};

/**
 * Aggregates spending by category for the current month.
 * Used for the pie chart breakdown.
 */
export const getSpendingByCategory = () => {
    const currentMonth = new Date();
    
    // Filter for current month expenses only
    const txns = TRANSACTIONS.filter(t => 
        isSameMonth(new Date(t.date), currentMonth) && t.type === 'expense'
    );
    
    const categoryMap = new Map<string, number>();
    
    // Aggregate amounts
    txns.forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.amount);
    });
    
    // Convert to array and sort by highest spending
    return Array.from(categoryMap.entries()).map(([name, value]) => ({
        name,
        value: Math.round(value)
    })).sort((a,b) => b.value - a.value);
};
