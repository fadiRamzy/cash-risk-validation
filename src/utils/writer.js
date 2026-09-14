export function generateAnalysis(metrics) {
  const { branches, overallPARPct, portfolioCollection, riskCounts, totalPAR, agingTotals } = metrics;
  const top3 = branches.slice(0, 3);
  const observations = [];

  observations.push({
    type: 'summary',
    title: 'الملخص التنفيذي',
    content: `سجلت المحفظة الإجمالية نسبة تعثر (PAR) بلغت ${overallPARPct.toFixed(2)}%. تم تصنيف ${riskCounts.High} فروع كفروع عالية المخاطر.`
  });

  if (riskCounts.High > 0) {
    observations.push({
      type: 'risk',
      title: 'تحليل المخاطر المرتفعة',
      content: `يتركز التعثر في فروع (${top3.map(b => b.data[0]).join('، ')})، مما يتطلب مراجعة دقيقة لمحفظة هذه الفروع.`
    });
  }

  const recs = [];
  if (overallPARPct > 10) recs.push('يوصى بمراجعة معايير المنح في الفروع ذات التعثر المرتفع.');
  if (portfolioCollection < 95) recs.push('يوصى بتكثيف عمليات المتابعة الميدانية لرفع كفاءة التحصيل.');
  
  if (recs.length > 0) {
    observations.push({
      type: 'recommendations',
      title: 'التوصيات المقترحة',
      content: recs
    });
  }

  return observations;
}