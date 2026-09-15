import * as XLSX from 'xlsx';
import { detectColumns, normalizeText, agingBucketsPattern } from './columnMap.js';

const monthNames = [
  'january','february','march','april','may','june','july','august','september','october','november','december',
  'يناير','فبراير','مارس','ابريل','مايو','يونيو','يوليو','اغسطس','سبتمبر','اكتوبر','نوفمبر','ديسمبر'
];

export function parseWorkbook(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array', cellFormula: true, cellNF: true });
        
        const sheets = wb.SheetNames.map((name) => {
          const ws = wb.Sheets[name];
          const rawGrid = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
          if (!rawGrid.length) return null;

          let bestHeaderIdx = 0, maxMatches = -1, bestColMap = {};
          for (let r = 0; r < Math.min(10, rawGrid.length); r++) {
            const cmap = detectColumns(rawGrid[r] || []);
            const count = Object.keys(cmap).length;
            if (count > maxMatches) { maxMatches = count; bestHeaderIdx = r; bestColMap = cmap; }
          }

          const header = rawGrid[bestHeaderIdx] || [];
          const percentCols = detectPercentColumns(ws, bestHeaderIdx, header.length);
          if (bestColMap.aging) {
            // Re-resolve aging buckets excluding percent-formatted columns: a '%' character is
            // stripped during normalization, so an amount column (e.g. "Npl (> 121)") and its
            // sibling percentage column (e.g. "Npl % (> 121)") can normalize to the same text.
            const normalizedHeaders = header.map(h => normalizeText(h));
            const agingCols = {};
            normalizedHeaders.forEach((h, idx) => {
              if (percentCols.has(idx)) return;
              for (const [bucket, patterns] of Object.entries(agingBucketsPattern)) {
                if (patterns.some(p => p.test(h))) agingCols[bucket] = idx;
              }
            });
            bestColMap.aging = agingCols;
          }
          const rows = rawGrid.slice(bestHeaderIdx + 1).map((r, i) => ({
            data: r.map((v, c) => (percentCols.has(c) && typeof v === 'number') ? v * 100 : v),
            _excelRowNumber: bestHeaderIdx + i + 2
          })).filter(row => row.data.some(c => c !== null && c !== ''));

          return { name, header, rows, colMap: bestColMap };
        }).filter(Boolean);

        // Period detection is done against the FINAL (filtered) sheets array so sheetIndex always
        // points at the right entry in `sheets`, even if an empty sheet was dropped above.
        const periods = [];
        sheets.forEach((sheet, sheetIdx) => {
          const normName = normalizeText(sheet.name);
          const hasMonth = monthNames.some(m => normName.includes(normalizeText(m)));
          const hasYear = /\d{4}/.test(normName);
          if (hasMonth || hasYear) {
            periods.push({ name: sheet.name, sheetIndex: sheetIdx, date: detectDate(sheet.name) });
          }
        });

        const sortedPeriods = periods.sort((a, b) => a.date - b.date);
        resolve({ sheets, periods: sortedPeriods });
      } catch (err) { reject(err); }
    };
    reader.readAsArrayBuffer(file);
  });
}

// Excel stores a "0.00%" formatted cell's underlying value as a fraction (e.g. 0.3917 for 39.17%).
// sheet_to_json returns that raw fraction, not the displayed percentage, so we must read each
// cell's number format (z) directly to know which columns need to be scaled up by 100.
function detectPercentColumns(ws, headerRowIdx, numCols, sampleRows = 8) {
  const percentCols = new Set();
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let c = 0; c < numCols; c++) {
    for (let r = headerRowIdx + 1; r <= Math.min(range.e.r, headerRowIdx + sampleRows); r++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      if (cell && typeof cell.z === 'string' && cell.z.includes('%')) { percentCols.add(c); break; }
    }
  }
  return percentCols;
}

function detectDate(name) {
  const norm = normalizeText(name);
  let month = monthNames.findIndex(m => norm.includes(normalizeText(m))) % 12;
  if (month === -1) month = 0;
  const yearMatch = name.match(/\d{4}/);
  const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
  return new Date(year, month, 1);
}