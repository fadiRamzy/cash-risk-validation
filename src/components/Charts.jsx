import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function Charts({ metrics, allPeriods }) {
  const refs = useRef([]);
  const instances = useRef([]);

  const destroy = () => {
    instances.current.forEach(i => i.destroy());
    instances.current = [];
  };

  useEffect(() => {
    destroy();
    if (!metrics) return;

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      rtl: true,
      plugins: { legend: { rtl: true, textDirection: 'rtl' } }
    };

    const config = [
      { id: 'portfolioTrend', type: 'line', data: { labels: allPeriods.map(p => p.name), datasets: [{ label: 'المحفظة', data: allPeriods.map(p => p.metrics?.totalPortfolio) }] }, trend: true },
      { id: 'parTrend', type: 'line', data: { labels: allPeriods.map(p => p.name), datasets: [{ label: 'المتأخرات', data: allPeriods.map(p => p.metrics?.totalPAR) }] }, trend: true },
      { id: 'collTrend', type: 'line', data: { labels: allPeriods.map(p => p.name), datasets: [{ label: 'التحصيل', data: allPeriods.map(p => p.metrics?.portfolioCollection) }] }, trend: true },
      { id: 'branchPar', type: 'bar', data: { labels: metrics.branches.slice(0, 10).map(b => b.data[0]), datasets: [{ label: 'PAR', data: metrics.branches.slice(0, 10).map(b => b.par) }] } },
      { id: 'branchColl', type: 'bar', data: { labels: metrics.branches.slice(0, 10).map(b => b.data[0]), datasets: [{ label: 'Collection %', data: metrics.branches.slice(0, 10).map(b => b.collectionPct) }] } },
      { id: 'topRisk', type: 'bar', data: { labels: metrics.branches.slice(0, 5).map(b => b.data[0]), datasets: [{ label: 'Risk Score', data: metrics.branches.slice(0, 5).map(b => b.parPct) }] } },
      { id: 'agingDist', type: 'doughnut', data: { labels: ['1-30', '31-60', '61-90', '90+'], datasets: [{ data: Object.values(metrics.agingTotals) }] }, aging: true },
      { id: 'parConc', type: 'pie', data: { labels: ['Top 3', 'Others'], datasets: [{ data: [metrics.branches.slice(0,3).reduce((s,r)=>s+r.par,0), metrics.totalPAR] }] } },
      { id: 'portVsPar', type: 'scatter', data: { datasets: [{ label: 'Portfolio vs PAR', data: metrics.branches.map(b => ({x: b.portfolio, y: b.par})) }] } },
      { id: 'riskDist', type: 'polarArea', data: { labels: ['Low', 'Medium', 'High'], datasets: [{ data: [metrics.riskCounts.Low, metrics.riskCounts.Medium, metrics.riskCounts.High] }] } }
    ];

    config.forEach((c, i) => {
      const ctx = refs.current[i]?.getContext('2d');
      if (!ctx) return;
      if (c.trend && allPeriods.length < 2) return;
      if (c.aging && Object.values(metrics.agingTotals).every(v => v === 0)) return;
      
      instances.current.push(new Chart(ctx, { type: c.type, data: c.data, options: commonOptions }));
    });
  }, [metrics, allPeriods]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bg-white p-4 rounded shadow h-64 relative">
          <canvas ref={el => refs.current[i] = el} />
          {(i < 3 && allPeriods.length < 2) && (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center opacity-80 text-sm">غير متاح لفترة واحدة</div>
          )}
        </div>
      ))}
    </div>
  );
}