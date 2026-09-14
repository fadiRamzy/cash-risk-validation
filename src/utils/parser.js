import * as XLSX from 'xlsx';
import { detectColumns, normalizeText } from './columnMap.js';

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
        const wb = XLSX.read(data, { type: 'array', cellFormula: true });
        
        const periods = [];
        const sheets = wb.SheetNames.map(name => {
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
          const rows = rawGrid.slice(bestHeaderIdx + 1).map((r, i) => ({
            data: r,
            _excelRowNumber: bestHeaderIdx + i + 2
          })).filter(row => row.data.some(c => c !== null && c !== ''));

          // Period Detection
          const normName = normalizeText(name);
          const hasMonth = monthNames.some(m => normName.includes(normalizeText(m)));
          const hasYear = /\d{4}/.test(normName);
          if (hasMonth || hasYear) {
            periods.push({ name, sheetIndex: periods.length, date: detectDate(name) });
          }

          return { name, header, rows, colMap: bestColMap };
        }).filter(Boolean);

        const sortedPeriods = periods.sort((a, b) => a.date - b.date);
        resolve({ sheets, periods: sortedPeriods });
      } catch (err) { reject(err); }
    };
    reader.readAsArrayBuffer(file);
  });
}

function detectDate(name) {
  const norm = normalizeText(name);
  let month = monthNames.findIndex(m => norm.includes(normalizeText(m))) % 12;
  if (month === -1) month = 0;
  const yearMatch = name.match(/\d{4}/);
  const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
  return new Date(year, month, 1);
}