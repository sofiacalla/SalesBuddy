/**
 * Forecast Utilities
 * 
 * This module contains the core business logic for calculating forecast metrics,
 * risk analysis, and pipeline health scores.
 * 
 * It is a pure utility file that transforms raw Deal data into 
 * actionable insights for the Dashboard.
 */

import { Deal, Confidence, HistoricalRevenue } from "./mockData";
import { differenceInDays, isAfter, parseISO, isSameMonth, subMonths, format } from "date-fns";

/**
 * Constants used for forecast rules and health metrics.
 */
const STALE_THRESHOLD_DAYS = 7;

/**
 * Interface for the comprehensive dashboard metrics return value.
 */
export interface DashboardMetrics {
  conservative: number;
  base: number;
  optimistic: number;
  pipelineValue: number;
  committedValue: number; // High confidence deals
  uncommittedValue: number; // Low/Medium confidence deals
  leadsValue: number; // Lead stage deals
  closedWon: number;
  mape: number; // Forecast Reliability
  hygieneScore: number; // % complete
  freshnessScore: number; // % updated recently
  winRate: number; // Won / (Won + Lost)
  momGrowth: number; // Month over Month growth
}

/**
 * Calculates the comprehensive forecast and health metrics for a given set of deals.
 * 
 * @param deals - The list of deals to analyze
 * @param targetDate - The reference date for month filtering (defaults to now)
 * @param history - Historical revenue data for growth/reliability calcs
 */
export function calculateForecast(
  deals: Deal[], 
  targetDate: Date = new Date(),
  history: HistoricalRevenue[] = []
): DashboardMetrics {
  const now = new Date();
  
  let conservative = 0;
  let base = 0;
  let optimistic = 0;
  let optimisticDelta = 0;
  let pipelineValue = 0;
  let committedValue = 0;
  let uncommittedValue = 0;
  let leadsValue = 0;
  let closedWon = 0;
  let closedLost = 0;

  // Filter deals relevant to the target month (for the forecast numbers)
  // Note: For Total Pipeline Value, we might want to show everything open, 
  // but for "Forecast", we usually look at a specific closing period.
  // Here we'll filter active deals by the target month's close date for the forecast buckets.
  
  const activeDeals = deals.filter(d => 
    d.stage !== "WON" && 
    d.stage !== "LOST"
  );

  const wonDeals = deals.filter(d => d.stage === "WON");
  const lostDeals = deals.filter(d => d.stage === "LOST");
  
  // --- Metric: Win Rate ---
  const totalClosed = wonDeals.length + lostDeals.length;
  const winRate = totalClosed > 0 ? (wonDeals.length / totalClosed) * 100 : 0;

  // --- Metric: Hygiene (Completeness) ---
  // Required fields: stage, confidence, next_step, next_step_date, amount, close_date
  const hygienePassingCount = activeDeals.filter(d => 
    d.stage && 
    d.confidence && 
    d.nextStep && 
    d.nextStepDate && 
    d.amount > 0 && 
    d.closeDate
  ).length;
  const hygieneScore = activeDeals.length > 0 ? (hygienePassingCount / activeDeals.length) * 100 : 100;

  // --- Metric: Freshness ---
  // Updated within last 7 days
  const freshCount = activeDeals.filter(d => 
    differenceInDays(now, parseISO(d.lastActivityDate)) <= 7
  ).length;
  const freshnessScore = activeDeals.length > 0 ? (freshCount / activeDeals.length) * 100 : 100;

  // --- Metric: MAPE (Forecast Reliability) ---
  // Mean Absolute Percentage Error based on historical data
  // Sum(|(Actual - Forecast) / Actual|) / n
  let mape = 0;
  if (history.length > 0) {
    const sumError = history.reduce((acc, record) => {
      return acc + Math.abs((record.actual - record.forecasted) / record.actual);
    }, 0);
    mape = (sumError / history.length) * 100;
  }

  // --- Metric: Growth (MoM) ---
  // Compare last month's actuals to the month before
  let momGrowth = 0;
  if (history.length >= 2) {
    const lastMonth = history[history.length - 1].actual;
    const prevMonth = history[history.length - 2].actual;
    momGrowth = ((lastMonth - prevMonth) / prevMonth) * 100;
  }

  // --- Forecast Calculations (Target Month Only) ---
  const dealsInTargetMonth = activeDeals.filter(d => isSameMonth(parseISO(d.closeDate), targetDate));
  const wonInTargetMonth = wonDeals.filter(d => isSameMonth(parseISO(d.closeDate), targetDate));
  
  // Add closed won to current month's realized revenue
  const realizedRevenue = wonInTargetMonth.reduce((sum, d) => sum + d.amount, 0);
  closedWon = realizedRevenue;

  dealsInTargetMonth.forEach(deal => {
    // Pipeline Segmentation
    pipelineValue += deal.amount;
    
    // DIRECT MAPPING: Stage directly correlates to forecast category now
    if (deal.stage === "COMMITTED") {
      committedValue += deal.amount;
      // Base includes Committed + Won
      base += deal.amount; 
      // Conservative only includes very rigorous Committed deals (e.g. High Conf)
      if (deal.confidence === "HIGH") {
          conservative += deal.amount;
      }
    } else if (deal.stage === "UNCOMMITTED") {
      uncommittedValue += deal.amount;
      // Optimistic includes Uncommitted
      optimisticDelta += deal.amount;
    } else if (deal.stage === "LEAD") {
      // Leads generally don't count towards monthly forecast unless highly optimistic
      // We'll count them in pipeline value but maybe not in forecast buckets yet
      leadsValue += deal.amount;
    }
  });

  // Add realized revenue to forecast
  conservative += realizedRevenue;
  base += realizedRevenue; // Base = Won + Committed
  optimistic = base + optimisticDelta; // Optimistic = Base + Uncommitted

  return {
    conservative,
    base,
    optimistic,
    pipelineValue: pipelineValue + realizedRevenue, // Total value of active + won for this month
    committedValue: committedValue + realizedRevenue,
    uncommittedValue,
    leadsValue,
    closedWon,
    mape,
    hygieneScore,
    freshnessScore,
    winRate,
    momGrowth
  };
}

/**
 * Checks if a deal is considered stale based on activity threshold.
 */
export function isDealStale(deal: Deal): boolean {
  const now = new Date();
  const daysSinceActivity = differenceInDays(now, parseISO(deal.lastActivityDate));
  return daysSinceActivity > STALE_THRESHOLD_DAYS;
}

/**
 * Determines if there is a concentration risk in the pipeline.
 * Defined as top 2 deals making up > 30% of the total value.
 */
export function getConcentrationRisk(deals: Deal[], totalValue: number) {
  if (totalValue === 0) return false;
  
  const sortedDeals = [...deals].sort((a, b) => b.amount - a.amount);
  const top2Total = (sortedDeals[0]?.amount || 0) + (sortedDeals[1]?.amount || 0);
  
  return (top2Total / totalValue) > 0.3;
}
