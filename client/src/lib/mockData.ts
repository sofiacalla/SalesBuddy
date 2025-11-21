import { addDays, subDays, subMonths, addMonths, format } from "date-fns";

/**
 * Types for the Sales Buddy CRM
 * Defines the core data structures used throughout the application.
 */

// Confidence levels for deal probability
export type Confidence = "HIGH" | "MEDIUM" | "LOW";

// Sales stages in the pipeline
export type Stage = "LEAD" | "DISCOVERY" | "PROPOSAL" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST";

// Account information structure
export interface Account {
  id: string;
  name: string;
  contactFirstName: string;
  contactLastName: string;
  phone: string;
  email: string;
  industry: string;
  avatar?: string;
}

// Deal information structure
export interface Deal {
  id: string;
  accountId: string;
  ownerId: string;
  ownerName: string;
  title: string;
  amount: number;
  currency: string;
  stage: Stage;
  confidence: Confidence;
  closeDate: string; // ISO Date
  lastActivityDate: string; // ISO Date
  nextStep: string;
  nextStepDate: string; // ISO Date
  createdAt: string;
  updatedAt: string;
  notes?: string;
  probability: number; // 0-100
}

// Historical revenue data for MAPE calculation
export interface HistoricalRevenue {
  month: string; // YYYY-MM
  forecasted: number;
  actual: number;
}

/**
 * Mock Data Generation
 * Provides a static set of data to simulate a backend database.
 */

const ACCOUNTS: Account[] = [
  { id: "acc-1", name: "SkyJet Airlines", contactFirstName: "Sarah", contactLastName: "Connor", phone: "+1 (555) 010-1001", email: "sarah@skyjet.com", industry: "Aviation" },
  { id: "acc-2", name: "CloudAir", contactFirstName: "John", contactLastName: "McClane", phone: "+1 (555) 010-2002", email: "john@cloudair.com", industry: "Aviation" },
  { id: "acc-3", name: "Pacific Wings", contactFirstName: "Ellen", contactLastName: "Ripley", phone: "+1 (555) 010-3003", email: "ellen@pacificwings.com", industry: "Aviation" },
  { id: "acc-4", name: "TechFlow Systems", contactFirstName: "Neo", contactLastName: "Anderson", phone: "+1 (555) 010-4004", email: "neo@techflow.com", industry: "Technology" },
  { id: "acc-5", name: "Global Logistics", contactFirstName: "Marty", contactLastName: "McFly", phone: "+1 (555) 010-5005", email: "marty@globallogistics.com", industry: "Logistics" },
  { id: "acc-6", name: "Cyberdyne Systems", contactFirstName: "Miles", contactLastName: "Dyson", phone: "+1 (555) 010-6006", email: "miles@cyberdyne.com", industry: "Technology" },
  { id: "acc-7", name: "InGen", contactFirstName: "John", contactLastName: "Hammond", phone: "+1 (555) 010-7007", email: "john@ingen.com", industry: "Biotech" },
];

const OWNERS = [
  { id: "user-1", name: "Alex Sales" },
  { id: "user-2", name: "Jordan Closer" },
];

// Helper to generate dynamic historical data so it always looks fresh relative to "now"
const generateHistory = (): HistoricalRevenue[] => {
    const history: HistoricalRevenue[] = [];
    const now = new Date();
    
    // Generate last 12 months of history
    for (let i = 12; i >= 1; i--) {
        const date = subMonths(now, i);
        const monthStr = format(date, 'yyyy-MM');
        
        // Create some variance for realistic data
        // Q4 usually higher
        const isQ4 = date.getMonth() >= 9; // Oct, Nov, Dec
        const baseAmount = 800000 + (isQ4 ? 200000 : 0); 
        const randomVariance = Math.floor(Math.random() * 100000) - 50000;
        
        // Forecast error simulation
        const forecastError = Math.floor(Math.random() * 150000) - 75000;

        history.push({
            month: monthStr,
            forecasted: baseAmount + randomVariance + forecastError,
            actual: baseAmount + randomVariance
        });
    }
    return history;
};

const HISTORICAL_REVENUE = generateHistory();

const DEALS: Deal[] = [
  {
    id: "deal-1",
    accountId: "acc-1",
    ownerId: "user-1",
    ownerName: "Alex Sales",
    title: "Q3 Fleet Expansion",
    amount: 450000,
    currency: "USD",
    stage: "NEGOTIATION",
    confidence: "HIGH",
    closeDate: addDays(new Date(), 10).toISOString(),
    lastActivityDate: subDays(new Date(), 2).toISOString(),
    nextStep: "Final legal review",
    nextStepDate: addDays(new Date(), 2).toISOString(),
    createdAt: subDays(new Date(), 45).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
    probability: 85,
  },
  {
    id: "deal-2",
    accountId: "acc-2",
    ownerId: "user-1",
    ownerName: "Alex Sales",
    title: "Maintenance Contract Renewal",
    amount: 120000,
    currency: "USD",
    stage: "PROPOSAL",
    confidence: "MEDIUM",
    closeDate: addDays(new Date(), 25).toISOString(),
    lastActivityDate: subDays(new Date(), 5).toISOString(),
    nextStep: "Present proposal to board",
    nextStepDate: addDays(new Date(), 5).toISOString(),
    createdAt: subDays(new Date(), 20).toISOString(),
    updatedAt: subDays(new Date(), 5).toISOString(),
    probability: 60,
  },
  {
    id: "deal-3",
    accountId: "acc-3",
    ownerId: "user-2",
    ownerName: "Jordan Closer",
    title: "New Route Logistics",
    amount: 850000,
    currency: "USD",
    stage: "DISCOVERY",
    confidence: "LOW",
    closeDate: addDays(new Date(), 60).toISOString(),
    lastActivityDate: subDays(new Date(), 12).toISOString(), // Stale
    nextStep: "Schedule stakeholders meeting",
    nextStepDate: addDays(new Date(), 7).toISOString(),
    createdAt: subDays(new Date(), 15).toISOString(),
    updatedAt: subDays(new Date(), 12).toISOString(),
    probability: 20,
  },
  {
    id: "deal-4",
    accountId: "acc-4",
    ownerId: "user-2",
    ownerName: "Jordan Closer",
    title: "Enterprise Software License",
    amount: 200000,
    currency: "USD",
    stage: "CLOSED_WON",
    confidence: "HIGH",
    closeDate: subDays(new Date(), 5).toISOString(),
    lastActivityDate: subDays(new Date(), 5).toISOString(),
    nextStep: "Handover to Customer Success",
    nextStepDate: addDays(new Date(), 1).toISOString(),
    createdAt: subDays(new Date(), 60).toISOString(),
    updatedAt: subDays(new Date(), 5).toISOString(),
    probability: 100,
  },
  {
    id: "deal-5",
    accountId: "acc-1",
    ownerId: "user-1",
    ownerName: "Alex Sales",
    title: "Training Module Add-on",
    amount: 25000,
    currency: "USD",
    stage: "PROPOSAL",
    confidence: "MEDIUM",
    closeDate: addDays(new Date(), 15).toISOString(),
    lastActivityDate: subDays(new Date(), 1).toISOString(),
    nextStep: "Send revised pricing",
    nextStepDate: addDays(new Date(), 1).toISOString(),
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
    probability: 50,
  },
  {
    id: "deal-6",
    accountId: "acc-5",
    ownerId: "user-2",
    ownerName: "Jordan Closer",
    title: "Global Tracking System",
    amount: 1200000,
    currency: "USD",
    stage: "NEGOTIATION",
    confidence: "HIGH",
    closeDate: addDays(new Date(), 14).toISOString(),
    lastActivityDate: subDays(new Date(), 0).toISOString(),
    nextStep: "Sign contract",
    nextStepDate: addDays(new Date(), 3).toISOString(),
    createdAt: subDays(new Date(), 90).toISOString(),
    updatedAt: subDays(new Date(), 0).toISOString(),
    probability: 90,
  },
  // Future Deals (Next Month)
  {
    id: "deal-7",
    accountId: "acc-6",
    ownerId: "user-1",
    ownerName: "Alex Sales",
    title: "AI Infrastructure Upgrade",
    amount: 600000,
    currency: "USD",
    stage: "DISCOVERY",
    confidence: "LOW",
    closeDate: addDays(new Date(), 45).toISOString(), // Next Month
    lastActivityDate: subDays(new Date(), 1).toISOString(),
    nextStep: "Demo POC",
    nextStepDate: addDays(new Date(), 5).toISOString(),
    createdAt: subDays(new Date(), 5).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
    probability: 30,
  },
  {
    id: "deal-8",
    accountId: "acc-7",
    ownerId: "user-2",
    ownerName: "Jordan Closer",
    title: "Lab Equipment Supply",
    amount: 350000,
    currency: "USD",
    stage: "PROPOSAL",
    confidence: "MEDIUM",
    closeDate: addDays(new Date(), 50).toISOString(), // Next Month
    lastActivityDate: subDays(new Date(), 3).toISOString(),
    nextStep: "Negotiate terms",
    nextStepDate: addDays(new Date(), 4).toISOString(),
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: subDays(new Date(), 3).toISOString(),
    probability: 50,
  },
  {
    id: "deal-9",
    accountId: "acc-4",
    ownerId: "user-1",
    ownerName: "Alex Sales",
    title: "Support Renewal 2025",
    amount: 50000,
    currency: "USD",
    stage: "NEGOTIATION",
    confidence: "HIGH",
    closeDate: addDays(new Date(), 8).toISOString(),
    lastActivityDate: subDays(new Date(), 1).toISOString(),
    nextStep: "Sign renewal",
    nextStepDate: addDays(new Date(), 1).toISOString(),
    createdAt: subDays(new Date(), 30).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
    probability: 95,
  },
  {
    id: "deal-new-1",
    accountId: "acc-3",
    ownerId: "user-2",
    ownerName: "Jordan Closer",
    title: "Logistics Expansion Phase 2",
    amount: 320000,
    currency: "USD",
    stage: "PROPOSAL",
    confidence: "MEDIUM",
    closeDate: addDays(new Date(), 12).toISOString(),
    lastActivityDate: subDays(new Date(), 2).toISOString(),
    nextStep: "Review proposal",
    nextStepDate: addDays(new Date(), 3).toISOString(),
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
    probability: 50,
  },
  {
    id: "deal-new-2",
    accountId: "acc-5",
    ownerId: "user-1",
    ownerName: "Alex Sales",
    title: "Warehouse Automation Pilot",
    amount: 150000,
    currency: "USD",
    stage: "DISCOVERY",
    confidence: "LOW",
    closeDate: addDays(new Date(), 20).toISOString(),
    lastActivityDate: subDays(new Date(), 1).toISOString(),
    nextStep: "Onsite visit",
    nextStepDate: addDays(new Date(), 5).toISOString(),
    createdAt: subDays(new Date(), 5).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
    probability: 20,
  },
   // Last Month Deals (Simulated Closed Won history or slipped deals)
  {
    id: "deal-10",
    accountId: "acc-2",
    ownerId: "user-1",
    ownerName: "Alex Sales",
    title: "Q1 Initial Pilot",
    amount: 80000,
    currency: "USD",
    stage: "CLOSED_WON",
    confidence: "HIGH",
    closeDate: subMonths(new Date(), 1).toISOString(),
    lastActivityDate: subMonths(new Date(), 1).toISOString(),
    nextStep: "Deployment",
    nextStepDate: subMonths(new Date(), 1).toISOString(),
    createdAt: subMonths(new Date(), 3).toISOString(),
    updatedAt: subMonths(new Date(), 1).toISOString(),
    probability: 100,
  },
  {
    id: "deal-11",
    accountId: "acc-5",
    ownerId: "user-2",
    ownerName: "Jordan Closer",
    title: "Previous Consulting Engagement",
    amount: 45000,
    currency: "USD",
    stage: "CLOSED_WON",
    confidence: "HIGH",
    closeDate: subMonths(new Date(), 1).toISOString(),
    lastActivityDate: subMonths(new Date(), 1).toISOString(),
    nextStep: "Complete",
    nextStepDate: subMonths(new Date(), 1).toISOString(),
    createdAt: subMonths(new Date(), 2).toISOString(),
    updatedAt: subMonths(new Date(), 1).toISOString(),
    probability: 100,
  }
];

/**
 * Data Accessors
 * Functions to retrieve data from the mock database.
 */
export const getAccounts = () => ACCOUNTS;
export const getDeals = () => DEALS;
export const getHistoricalRevenue = () => HISTORICAL_REVENUE;
export const getAccount = (id: string) => ACCOUNTS.find((a) => a.id === id);
export const getAccountDeals = (accountId: string) => DEALS.filter((d) => d.accountId === accountId);

/**
 * Data Modifiers
 * Functions to update data in the mock database (in-memory only).
 */
export const addDeal = (deal: Deal) => {
    DEALS.push(deal);
    return deal;
};

export const updateDeal = (id: string, updates: Partial<Deal>) => {
    const index = DEALS.findIndex(d => d.id === id);
    if (index !== -1) {
        DEALS[index] = { ...DEALS[index], ...updates, updatedAt: new Date().toISOString() };
        return DEALS[index];
    }
    return null;
};
