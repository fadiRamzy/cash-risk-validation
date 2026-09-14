import React from 'react';
import * as XLSX from 'xlsx';
import { generateAnalysis } from '../utils/writer.js';

export default function Report({ metrics, sheetName }) {
  const analysisText = generateAnalysis(metrics);

  const exportToExcel = () => {
    const dataRows = metrics.branches.map(b => ({
      'اسم الفرع': b._branch,
      'حجم المحفظة القائمة (ج.م)': b._portfolio,
      'رصيد متأخرات PAR (ج.م)': b._par,
      'نسبة المتأخرات PAR %': b._parPct,
      'نسبة التحصيل %': b._collectionPct,
      'عدد العملاء': b._clients,
      'درجة المخاطرة': b.riskLevel,
      'حجم التأثير المالي': b.impact === 'High' ? 'مرتفع الأثر' : 'اعتيادي',
      'استثناء سياسات': b.policyException ? 'مخالف للمستهدف' : 'مطابق'
    }));

    const ws = XLSX.utils.json_to_sheet(dataRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'تقرير الفروع المقيّم');

    const maxLens = {};
    dataRows.forEach(row => {
      Object.keys(row).forEach(k => {
        const l = String(row[k]).length;
        maxLens[k] = Math.max(maxLens[k] || 0, l);
      });
    });
    ws['!cols'] = Object.keys(maxLens).map(k => ({ wch: maxLens[k] + 3 }));

    XLSX.writeFile(wb, `تقرير_مخاطر_الفروع_${sheetName || 'العام'}.xlsx`);
  };

  return (
    <div className="bg-white p-10 shadow-xl max-w-4xl mx-auto rtl-report" dir="rtl">
      <header className="border-b-4 border-blue-900 pb-4 mb-8">
        <h1 className="text-3xl font-bold">تقرير تحليل وتحوط مخاطر الائتمان</h1>
        <p className="text-gray-500 italic">تم استخراج التقرير في: {new Date().toLocaleDateString('ar-EG')}</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-gray-100 p-4 rounded">
          <span className="block text-sm">إجمالي المحفظة</span>
          <span className="text-xl font-bold">{metrics.totalPortfolio.toLocaleString()} ج.م</span>
        </div>
        <div className="bg-gray-100 p-4 rounded text-red-700">
          <span className="block text-sm">إجمالي PAR</span>
          <span className="text-xl font-bold">{metrics.totalPAR.toLocaleString()} ج.م</span>
        </div>
        <div className="bg-gray-100 p-4 rounded text-blue-700">
          <span className="block text-sm">نسبة التحصيل</span>
          <span className="text-xl font-bold">{metrics.portfolioCollection.toFixed(2)}%</span>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <span className="block text-sm">عدد العملاء</span>
          <span className="text-xl font-bold">{metrics.totalClients.toLocaleString()}</span>
        </div>
      </div>

      <div className="prose max-w-none text-right text-gray-800 space-y-6">
        {analysisText.map((obs, i) => (
          <div key={i} className="mb-8">
            <h3 className="text-lg font-bold border-r-4 border-blue-600 pr-2 mb-2">{obs.title}</h3>
            {Array.isArray(obs.content) ? (
              <ul className="list-disc pr-5">
                {obs.content.map((li, j) => <li key={j}>{li}</li>)}
              </ul>
            ) : <p>{obs.content}</p>}
          </div>
        ))}
      </div>

      <div className="page-break mt-10">
        <h3 className="text-lg font-bold text-emerald-800 text-right pb-2 border-b mb-4">ملحق رقم (١): جدول تقييم ومؤشرات الفروع الشامل</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-emerald-800 text-white">
                <th className="p-2 border">الفرع</th>
                <th className="p-2 border">المحفظة</th>
                <th className="p-2 border">PAR</th>
                <th className="p-2 border">PAR %</th>
                <th className="p-2 border">التحصيل %</th>
                <th className="p-2 border">العملاء</th>
                <th className="p-2 border">المخاطر</th>
                <th className="p-2 border">التأثير</th>
                <th className="p-2 border">الاستثناء</th>
              </tr>
            </thead>
            <tbody>
              {metrics.branches.map((b, idx) => (
                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                  <td className="p-2 border font-semibold">{b._branch}</td>
                  <td className="p-2 border">{b._portfolio.toLocaleString()}</td>
                  <td className="p-2 border text-red-600">{b._par.toLocaleString()}</td>
                  <td className="p-2 border font-medium">{b._parPct.toFixed(2)}%</td>
                  <td className="p-2 border">{b._collectionPct.toFixed(2)}%</td>
                  <td className="p-2 border">{b._clients.toLocaleString()}</td>
                  <td className="p-2 border text-center">
                    <span className={`px-2 py-0.5 rounded text-2xs ${
                      b.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                      b.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {b.riskLevel === 'High' ? 'عالي' : b.riskLevel === 'Medium' ? 'متوسط' : 'منخفض'}
                    </span>
                  </td>
                  <td className="p-2 border text-center">{b.impact === 'High' ? 'عالي' : 'عادي'}</td>
                  <td className="p-2 border text-center">{b.policyException ? 'مخالف' : 'مطابق'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="no-print mt-10 text-center">
        <button onClick={exportToExcel} className="bg-blue-600 text-white px-6 py-2 rounded">
          📊 تصدير البيانات إلى Excel
        </button>
      </div>
    </div>
  );
}