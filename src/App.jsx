import React, { useState } from 'react';
import { parseWorkbook } from './utils/parser.js';
import { validateSheet } from './utils/validator.js';
import { computeMetrics, comparePeriods } from './utils/calculations.js';
import Mapping from './components/Mapping.jsx';
import Charts from './components/Charts.jsx';
import Report from './components/Report.jsx';

export default function App() {
  const [data, setData] = useState(null);
  const [periodIdx, setPeriodIdx] = useState(0);
  const [mappingSheet, setMappingSheet] = useState(null);
  const [error, setError] = useState(null);

  const onUpload = async (e) => {
    const file = e.target.files[0];
    setError(null);
    setData(null);
    try {
      const res = await parseWorkbook(file);
      const processedSheets = res.sheets.map(s => {
        const val = validateSheet(s, s.colMap);
        const met = computeMetrics(val, s.colMap);
        return { ...s, validation: val, metrics: met };
      });

      const periods = res.periods.map(p => ({
        ...p,
        metrics: processedSheets[p.sheetIndex]?.metrics
      }));

      setData({ sheets: processedSheets, periods });

      // Check all sheets for missing fields and trigger mapping for the first one
      const firstNeedingMapping = processedSheets.find(s => s.validation.missingFields.length > 0);
      if (firstNeedingMapping) {
        setMappingSheet(firstNeedingMapping);
      }
    } catch (err) { setError("فشل في معالجة الملف."); }
  };

  const handleMap = (newMap) => {
    const s = mappingSheet;
    const val = validateSheet(s, newMap);
    const met = computeMetrics(val, newMap);
    const newData = {...data};
    const sheetIdx = newData.sheets.findIndex(sh => sh.name === s.name);
    if (sheetIdx >= 0) {
      newData.sheets[sheetIdx] = { ...s, colMap: newMap, validation: val, metrics: met };
      // Also update the period metrics if this sheet is a period
      const periodIdx = newData.periods.findIndex(p => p.sheetIndex === s.sheetIndex);
      if (periodIdx >= 0) {
        newData.periods[periodIdx] = { ...newData.periods[periodIdx], metrics: met };
      }
    }
    setData(newData);
    setMappingSheet(null);
  };

  const current = data?.periods[periodIdx]?.metrics;
  const previous = periodIdx > 0 ? data?.periods[periodIdx - 1]?.metrics : null;
  const comparison = comparePeriods(current, previous);

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Risk Reporting Engine</h1>
        <input type="file" onChange={onUpload} className="border p-2" />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </header>

      {mappingSheet && <Mapping sheet={mappingSheet} onConfirm={handleMap} />}

      {data && !mappingSheet && (
        <div className="space-y-10">
          <div className="flex justify-between bg-white p-4 shadow rounded">
             <div className="text-sm">
               {(() => {
                 const sheetForPeriod = data.sheets[data.periods[periodIdx]?.sheetIndex];
                 if (sheetForPeriod) {
                   return `تم استيراد: ${sheetForPeriod.rows.length} صف | صحيح: ${sheetForPeriod.validation.valid.length} | ملخصات: ${sheetForPeriod.validation.summaries.length}`;
                 }
                 return 'بيانات غير متاحة';
               })()}
             </div>
             {data.periods.length > 1 && (
               <select value={periodIdx} onChange={e => setPeriodIdx(parseInt(e.target.value))}>
                 {data.periods.map((p, i) => <option key={i} value={i}>{p.name}</option>)}
               </select>
             )}
          </div>

          <Report metrics={current} sheetName={data.periods[periodIdx]?.name} />
          <Charts metrics={current} allPeriods={data.periods} />
        </div>
      )}
    </div>
  );
}