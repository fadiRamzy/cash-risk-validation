import React from 'react';
import { generateAnalysis } from '../utils/writer.js';

export default function Report({ metrics }) {
  const analysis = generateAnalysis(metrics);

  return (
    <div className="bg-white p-10 shadow-xl max-w-4xl mx-auto rtl-report" dir="rtl">
      <style>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          .no-print { display: none; }
          .rtl-report { width: 100%; border: none; box-shadow: none; }
          .kpi-card { break-inside: avoid; }
        }
      `}</style>
      
      <header className="border-b-4 border-blue-900 pb-4 mb-8">
        <h1 className="text-3xl font-bold">تقرير مخاطر الفروع</h1>
        <p className="text-gray-500 italic">تم استخراج التقرير في: {new Date().toLocaleDateString('ar-EG')}</p>
      </header>

      <section className="grid grid-cols-3 gap-4 mb-10 kpi-card">
        <div className="bg-gray-100 p-4 rounded">
          <span className="block text-sm">إجمالي المحفظة</span>
          <span className="text-xl font-bold">{metrics.totalPortfolio.toLocaleString()}</span>
        </div>
        <div className="bg-gray-100 p-4 rounded text-red-700">
          <span className="block text-sm">إجمالي PAR</span>
          <span className="text-xl font-bold">{metrics.totalPAR.toLocaleString()}</span>
        </div>
        <div className="bg-gray-100 p-4 rounded text-blue-700">
          <span className="block text-sm">نسبة التحصيل</span>
          <span className="text-xl font-bold">{metrics.portfolioCollection.toFixed(2)}%</span>
        </div>
      </section>

      {analysis.map((obs, i) => (
        <div key={i} className="mb-8 break-inside-avoid">
          <h3 className="text-lg font-bold border-r-4 border-blue-600 pr-2 mb-2">{obs.title}</h3>
          <div className="text-gray-700 leading-relaxed">
            {Array.isArray(obs.content) ? (
              <ul className="list-disc pr-5">
                {obs.content.map((li, j) => <li key={j}>{li}</li>)}
              </ul>
            ) : <p>{obs.content}</p>}
          </div>
        </div>
      ))}
      
      <div className="no-print mt-10 text-center">
        <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded">طباعة التقرير (A4)</button>
      </div>
    </div>
  );
}