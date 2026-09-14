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
  const [mappingSheetIndex, setMappingSheetIndex] = useState(null);
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

      // Check the sheets that actually matter (the detected period sheets, or sheet 0 if none
      // were detected) rather than always sheet 0 — the first sheet in a real workbook can be
      // a non-period overview sheet while the real period data lives at other indices.
      const candidateIndices = periods.length > 0 ? periods.map(p => p.sheetIndex) : [0];
      const needsMappingIdx = candidateIndices.find(i => processedSheets[i]?.validation.missingFields.length > 0);
      if (needsMappingIdx !== undefined) {
        setMappingSheetIndex(needsMappingIdx);
        setMappingSheet(processedSheets[needsMappingIdx]);
      }
    } catch (err) { setError("فشل في معالجة الملف."); }
  };

  const handleMap = (newMap) => {
    const idx = mappingSheetIndex;
    const s = data.sheets[idx];
    const val = validateSheet(s, newMap);
    const met = computeMetrics(val, newMap);
    const newSheets = [...data.sheets];
    newSheets[idx] = { ...s, colMap: newMap, validation: val, metrics: met };
    const newPeriods = data.periods.map(p => p.sheetIndex === idx ? { ...p, metrics: met } : p);
    setData({ sheets: newSheets, periods: newPeriods });
    setMappingSheet(null);
    setMappingSheetIndex(null);
  };

  const current = data?.periods[periodIdx]?.metrics;
  const previous = periodIdx > 0 ? data?.periods[periodIdx - 1]?.metrics : null;
  const comparison = comparePeriods(current, previous);
  const currentSheetIndex = data?.periods[periodIdx]?.sheetIndex ?? 0;
  const currentSheet = data?.sheets[currentSheetIndex];

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
                تم استيراد: {currentSheet.rows.length} صف | 
                صحيح: {currentSheet.validation.valid.length} | 
                ملخصات: {currentSheet.validation.summaries.length}
             </div>
             {data.periods.length > 1 && (
               <select value={periodIdx} onChange={e => setPeriodIdx(parseInt(e.target.value))}>
                 {data.periods.map((p, i) => <option key={i} value={i}>{p.name}</option>)}
               </select>
             )}
          </div>

          <Report metrics={current} />
          <Charts metrics={current} allPeriods={data.periods} />
        </div>
      )}
    </div>
  );
}