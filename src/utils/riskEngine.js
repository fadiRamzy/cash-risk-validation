export const riskConfig = {
  parPercent: { lowMax: 5, mediumMax: 15 },
  collectionTarget: 98,
  parAmountImpact: 1000000
};

export function getRiskLevel(parPct) {
  if (parPct === null || parPct === undefined) return 'غير متاح';
  if (parPct < riskConfig.parPercent.lowMax) return 'Low';
  if (parPct <= riskConfig.parPercent.mediumMax) return 'Medium';
  return 'High';
}

export function evaluateRisk(row) {
  const riskLevel = getRiskLevel(row.parPct);
  const impact = row.par > riskConfig.parAmountImpact ? 'High' : 'Normal';
  const policyException = row.collectionPct !== null && row.collectionPct < riskConfig.collectionTarget;
  
  return { ...row, riskLevel, impact, policyException };
}