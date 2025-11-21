import { Deal, Confidence } from "./mockData";
import { differenceInDays, isAfter, parseISO } from "date-fns";

/**
 * FORECAST RULES (Deterministic)
 * 
 * Conservative = sum(amount) of deals where:
 *  - confidence >= HIGH 
 *  - AND next_step_date within 14 days 
 *  - AND last_activity_date within stale_threshold (7 days).
 * 
 * Base = sum(amount) of deals where:
 *  - confidence in {HIGH, MEDIUM} 
 *  - AND next_step_date within 30 days.
 * 
 * Optimistic = Base + sum(amount) of deals where:
 *  - confidence = LOW 
 *  - OR (early-stage high-value deals flagged by priority rules - simplified to > $100k in Discovery).
 */

const STALE_THRESHOLD_DAYS = 7;

export function calculateForecast(deals: Deal[]) {
  const now = new Date();
  
  let conservative = 0;
  let base = 0;
  let optimistic = 0;
  let pipelineValue = 0;
  let closedWon = 0;
  
  const activeDeals = deals.filter(d => d.stage !== "CLOSED_WON" && d.stage !== "CLOSED_LOST");
  const wonDeals = deals.filter(d => d.stage === "CLOSED_WON");
  
  // Calculate totals
  pipelineValue = activeDeals.reduce((sum, d) => sum + d.amount, 0);
  closedWon = wonDeals.reduce((sum, d) => sum + d.amount, 0);

  activeDeals.forEach(deal => {
    const daysSinceActivity = differenceInDays(now, parseISO(deal.lastActivityDate));
    const daysToNextStep = differenceInDays(parseISO(deal.nextStepDate), now);
    
    const isHigh = deal.confidence === "HIGH";
    const isMedium = deal.confidence === "MEDIUM";
    const isLow = deal.confidence === "LOW";
    
    // Conservative Logic
    if (isHigh && daysToNextStep <= 14 && daysSinceActivity <= STALE_THRESHOLD_DAYS) {
      conservative += deal.amount;
    }
    
    // Base Logic
    if ((isHigh || isMedium) && daysToNextStep <= 30) {
      base += deal.amount;
    }
    
    // Optimistic Logic (Base + extras)
    // Note: The prompt says Optimistic = Base + ... 
    // So we start with Base calculation for Optimistic baseline, but wait, let's follow the formula strictly.
    // "Optimistic = Base + sum(amount) of deals with confidence = LOW or early-stage high-value..."
    // This implies Optimistic is a superset.
  });

  // Optimistic Addition
  // We need to recalculate Base for the Optimistic sum because we can't just add to the 'base' variable 
  // if we want to be strict about the sets. 
  // Actually, let's just add the delta to the base value we already calculated.
  
  let optimisticDelta = 0;
  activeDeals.forEach(deal => {
    const daysToNextStep = differenceInDays(parseISO(deal.nextStepDate), now);
    const isHigh = deal.confidence === "HIGH";
    const isMedium = deal.confidence === "MEDIUM";
    
    // If it was included in Base, we already have it.
    const inBase = (isHigh || isMedium) && daysToNextStep <= 30;
    
    if (!inBase) {
       // Check if it qualifies for Optimistic extras
       if (deal.confidence === "LOW" || (deal.amount > 100000 && deal.stage === "DISCOVERY")) {
         optimisticDelta += deal.amount;
       }
    }
  });
  
  optimistic = base + optimisticDelta;

  return {
    conservative,
    base,
    optimistic,
    pipelineValue,
    closedWon
  };
}

export function isDealStale(deal: Deal): boolean {
  const now = new Date();
  const daysSinceActivity = differenceInDays(now, parseISO(deal.lastActivityDate));
  return daysSinceActivity > STALE_THRESHOLD_DAYS;
}

export function getConcentrationRisk(deals: Deal[], forecastType: 'conservative' | 'base' | 'optimistic', totalValue: number) {
  // Concentration risk = true if top 1–2 deals contribute > 30% of any forecast tier
  // Simplified: just check against the total value provided
  if (totalValue === 0) return false;
  
  const sortedDeals = [...deals].sort((a, b) => b.amount - a.amount);
  const top2Total = (sortedDeals[0]?.amount || 0) + (sortedDeals[1]?.amount || 0);
  
  return (top2Total / totalValue) > 0.3;
}
