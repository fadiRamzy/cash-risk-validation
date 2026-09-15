import { evaluateRisk } from './riskEngine.js';
import { normalizeText } from './columnMap.js';

export function computeMetrics(validation, colMap) {
  const processed = validation.valid.map(evaluateRisk);
  
  const totalPortfolio = processed.reduce((s, r) => s + r.portfolio, 0);
  const totalPAR = processed.reduce((s, r) => s + r.par, 0);
  const totalClients = processed.reduce((s, r) => s + r.clients, 0);
  
  // Weighted PAR %
  const overallPARPct = totalPortfolio > 0 ? (totalPAR / totalPortfolio) * 100 : 0;
  
  // Collection Weighted vs Unweighted
  let portfolioCollection = null;
  let isWeighted = false;
  if (colMap.collection !== undefined && colMap.target !== undefined) {
    const tColl = processed.reduce((s, r) => s + (parseFloat(r.data[colMap.collection]) || 0), 0);
    const tTarget = processed.reduce((s, r) => s + (parseFloat(r.data[colMap.target]) || 0), 0);
    if (tTarget > 0) {
      portfolioCollection = (tColl / tTarget) * 100;
      isWeighted = true;
    }
  }
  
  if (portfolioCollection === null) {
    portfolioCollection = processed.reduce((s, r) => s + r.collectionPct, 0) / processed.length;
  }

  // Aging
  const agingTotals = { '1_30': 0, '31_60': 0, '61_90': 0, '91_120': 0, '120_plus': 0 };
  if (colMap.aging) {
    processed.forEach(r => {
      Object.keys(agingTotals).forEach(k => {
        const idx = colMap.aging[k];
        if (idx !== undefined) agingTotals[k] += (parseFloat(r.data[idx]) || 0);
      });
    });
  }

  // Top Risk Sorting: High -> Med -> Low, then PAR desc
  const sorted = [...processed].sort((a, b) => {
    const weights = { High: 3, Medium: 2, Low: 1, 'غير متاح': 0 };
    if (weights[b.riskLevel] !== weights[a.riskLevel]) return weights[b.riskLevel] - weights[a.riskLevel];
    return b.par - a.par;
  });

  return {
    branches: sorted,
    totalPortfolio, totalPAR, overallPARPct, totalClients,
    portfolioCollection, isWeighted, agingTotals,
    riskCounts: {
      High: processed.filter(r => r.riskLevel === 'High').length,
      Medium: processed.filter(r => r.riskLevel === 'Medium').length,
      Low: processed.filter(r => r.riskLevel === 'Low').length
    }
  };
}

export function comparePeriods(curr, prev) {
  if (!curr || !prev) return null;
  const match = (name) => normalizeText(name);
  
  const deltas = curr.branches.map(cb => {
    const pb = prev.branches.find(p => match(p.branch) === match(cb.branch));
    if (!pb) return null;
    return {
      branch: cb.branch,
      portfolioDelta: cb.portfolio - pb.portfolio,
      parDelta: cb.par - pb.par
    };
  }).filter(Boolean);

  return {
    portfolioChange: curr.totalPortfolio - prev.totalPortfolio,
    parChange: curr.totalPAR - prev.totalPAR,
    branchDeltas: deltas
  };
}