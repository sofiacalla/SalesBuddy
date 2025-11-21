import { addDays, subDays, subMonths, addMonths, format, eachMonthOfInterval, startOfYear, endOfYear } from "date-fns";

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

// Helper to generate deals across the whole current year
const generateAnnualDeals = (): Deal[] => {
    const deals: Deal[] = [];
    const now = new Date();
    const start = startOfYear(now);
    const end = endOfYear(now);
    const months = eachMonthOfInterval({ start, end });
    
    const dealTemplates = [
        { title: "Global Fleet Expansion", amount: 450000, stage: "NEGOTIATION", confidence: "HIGH" },
        { title: "Annual Maintenance Renewal", amount: 120000, stage: "PROPOSAL", confidence: "MEDIUM" },
        { title: "New Logistics Hub Setup", amount: 850000, stage: "DISCOVERY", confidence: "LOW" },
        { title: "Enterprise Software License", amount: 200000, stage: "CLOSED_WON", confidence: "HIGH" },
        { title: "Staff Training Program", amount: 25000, stage: "PROPOSAL", confidence: "MEDIUM" },
        { title: "Global Tracking System Implementation", amount: 1200000, stage: "NEGOTIATION", confidence: "HIGH" },
        { title: "Cloud Infrastructure Upgrade", amount: 600000, stage: "DISCOVERY", confidence: "LOW" },
        { title: "Q4 Equipment Supply", amount: 350000, stage: "PROPOSAL", confidence: "MEDIUM" },
        { title: "Premium Support Renewal", amount: 50000, stage: "NEGOTIATION", confidence: "HIGH" },
        { title: "Strategic Consulting Project", amount: 75000, stage: "CLOSED_WON", confidence: "HIGH" }
    ];

    let dealCounter = 1;

    months.forEach(month => {
        // Add 2-4 deals per month
        const dealsCount = Math.floor(Math.random() * 3) + 2;
        
        for (let i = 0; i < dealsCount; i++) {
            const template = dealTemplates[Math.floor(Math.random() * dealTemplates.length)];
            const account = ACCOUNTS[Math.floor(Math.random() * ACCOUNTS.length)];
            const owner = OWNERS[Math.floor(Math.random() * OWNERS.length)];
            
            // Random day within the month
            const closeDate = addDays(month, Math.floor(Math.random() * 25) + 1);
            
            // Adjust stage based on if date is past
            let stage = template.stage as Stage;
            let confidence = template.confidence as Confidence;
            let probability = 50;
            
            if (closeDate < now && stage !== "CLOSED_WON" && stage !== "CLOSED_LOST") {
                // Past deals should be closed or very late
                 if (Math.random() > 0.7) {
                     stage = "CLOSED_WON";
                     probability = 100;
                 } else if (Math.random() > 0.5) {
                     stage = "CLOSED_LOST";
                     probability = 0;
                 }
            }
            
            if (stage === "CLOSED_WON") probability = 100;
            if (stage === "CLOSED_LOST") probability = 0;
            if (stage === "NEGOTIATION") probability = 90;
            if (stage === "PROPOSAL") probability = 60;
            if (stage === "DISCOVERY") probability = 20;

            deals.push({
                id: `deal-gen-${dealCounter++}`,
                accountId: account.id,
                ownerId: owner.id,
                ownerName: owner.name,
                title: `${account.name} - ${template.title}`,
                amount: template.amount + (Math.random() * 50000 - 25000),
                currency: "USD",
                stage: stage,
                confidence: confidence,
                closeDate: closeDate.toISOString(),
                lastActivityDate: subDays(now, Math.floor(Math.random() * 20)).toISOString(),
                nextStep: "Follow up",
                nextStepDate: addDays(now, 3).toISOString(),
                createdAt: subDays(closeDate, 60).toISOString(),
                updatedAt: subDays(now, 2).toISOString(),
                probability: probability
            });
        }
        
        // FORCE add at least one LOW/MEDIUM confidence deal per month to ensure "Uncommitted" pipeline exists
        const forceAccount = ACCOUNTS[Math.floor(Math.random() * ACCOUNTS.length)];
        const forceOwner = OWNERS[Math.floor(Math.random() * OWNERS.length)];
        
        // 1. Force Uncommitted (Low Confidence)
        deals.push({
            id: `deal-forced-uncommitted-${dealCounter++}`,
            accountId: forceAccount.id,
            ownerId: forceOwner.id,
            ownerName: forceOwner.name,
            title: `${forceAccount.name} - Upside Opportunity`,
            amount: 150000 + Math.floor(Math.random() * 100000),
            currency: "USD",
            stage: "DISCOVERY",
            confidence: "LOW",
            closeDate: addDays(month, 15).toISOString(),
            lastActivityDate: subDays(now, 5).toISOString(),
            nextStep: "Initial review",
            nextStepDate: addDays(now, 5).toISOString(),
            createdAt: subDays(month, 30).toISOString(),
            updatedAt: subDays(now, 5).toISOString(),
            probability: 25
        });

        // 2. Force Committed (High/Medium Confidence)
        deals.push({
            id: `deal-forced-committed-${dealCounter++}`,
            accountId: forceAccount.id,
            ownerId: forceOwner.id,
            ownerName: forceOwner.name,
            title: `${forceAccount.name} - Committed Renewal`,
            amount: 200000 + Math.floor(Math.random() * 100000),
            currency: "USD",
            stage: "NEGOTIATION",
            confidence: "HIGH",
            closeDate: addDays(month, 20).toISOString(),
            lastActivityDate: subDays(now, 2).toISOString(),
            nextStep: "Final Sign-off",
            nextStepDate: addDays(now, 2).toISOString(),
            createdAt: subDays(month, 60).toISOString(),
            updatedAt: subDays(now, 2).toISOString(),
            probability: 90
        });

        // 3. Force Closed Won (Actuals)
        deals.push({
            id: `deal-forced-won-${dealCounter++}`,
            accountId: forceAccount.id,
            ownerId: forceOwner.id,
            ownerName: forceOwner.name,
            title: `${forceAccount.name} - Strategic Win`,
            amount: 100000 + Math.floor(Math.random() * 50000),
            currency: "USD",
            stage: "CLOSED_WON",
            confidence: "HIGH",
            closeDate: addDays(month, 10).toISOString(),
            lastActivityDate: subDays(now, 15).toISOString(),
            nextStep: "Onboarding",
            nextStepDate: addDays(now, 15).toISOString(),
            createdAt: subDays(month, 90).toISOString(),
            updatedAt: subDays(month, 5).toISOString(),
            probability: 100
        });
    });
    
    return deals;
};

// Combine generated deals with some specific ones if needed, or just use generated ones for full coverage
const DEALS: Deal[] = [
    ...generateAnnualDeals(),
    // Keep a few explicit ones for testing specific scenarios if needed
    {
    id: "deal-specific-1",
    accountId: "acc-1",
    ownerId: "user-1",
    ownerName: "Alex Sales",
    title: "Q3 Fleet Expansion (Manual)",
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
