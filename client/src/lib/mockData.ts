import { addDays, subDays } from "date-fns";

/**
 * Types for the Sales Buddy CRM
 */

export type Confidence = "HIGH" | "MEDIUM" | "LOW";
export type Stage = "LEAD" | "DISCOVERY" | "PROPOSAL" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST";

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

export interface SalesMetrics {
  forecastConservative: number;
  forecastBase: number;
  forecastOptimistic: number;
  pipelineValue: number;
  winRate: number;
  dealCount: number;
  staleDealCount: number;
}

/**
 * Mock Data Generation
 */

const ACCOUNTS: Account[] = [
  { id: "acc-1", name: "SkyJet Airlines", contactFirstName: "Sarah", contactLastName: "Connor", phone: "+1 (555) 010-1001", email: "sarah@skyjet.com", industry: "Aviation" },
  { id: "acc-2", name: "CloudAir", contactFirstName: "John", contactLastName: "McClane", phone: "+1 (555) 010-2002", email: "john@cloudair.com", industry: "Aviation" },
  { id: "acc-3", name: "Pacific Wings", contactFirstName: "Ellen", contactLastName: "Ripley", phone: "+1 (555) 010-3003", email: "ellen@pacificwings.com", industry: "Aviation" },
  { id: "acc-4", name: "TechFlow Systems", contactFirstName: "Neo", contactLastName: "Anderson", phone: "+1 (555) 010-4004", email: "neo@techflow.com", industry: "Technology" },
  { id: "acc-5", name: "Global Logistics", contactFirstName: "Marty", contactLastName: "McFly", phone: "+1 (555) 010-5005", email: "marty@globallogistics.com", industry: "Logistics" },
];

const OWNERS = [
  { id: "user-1", name: "Alex Sales" },
  { id: "user-2", name: "Jordan Closer" },
];

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
    lastActivityDate: subDays(new Date(), 12).toISOString(), // Stale?
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
];

export const getAccounts = () => ACCOUNTS;
export const getDeals = () => DEALS;
export const getAccount = (id: string) => ACCOUNTS.find((a) => a.id === id);
export const getAccountDeals = (accountId: string) => DEALS.filter((d) => d.accountId === accountId);

// Helper to simulate "adding" data (in memory only)
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

