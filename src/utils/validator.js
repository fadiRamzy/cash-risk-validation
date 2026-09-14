import { normalizeText } from './columnMap.js';

export function parseFormattedNumber(val) {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return val;
  
  let str = val.toString().trim();
  str = str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
  str = str.replace(/[٫]/g, '.').replace(/[٬,]/g, ''); // Arabic decimal/thousands
  
  // Deterministic Separator Logic
  if (str.includes('.') && str.includes(',')) {
    const lastDot = str.lastIndexOf('.');
    const lastComma = str.lastIndexOf(',');
    if (lastDot > lastComma) str = str.replace(/,/g, '');
    else str = str.replace(/\./g, '').replace(',', '.');
  }

  str = str.replace(/[^\d.-]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

export function isSummaryRow(row, colMap) {
  const branchVal = row[colMap.branch];
  if (!branchVal) {
    // Structural heuristic: if branch is empty but Portfolio and PAR are filled, likely a total row
    return (row[colMap.portfolio] && row[colMap.par]);
  }
  const norm = normalizeText(branchVal);
  const keywords = ['total', 'grandtotal', 'اجمالي', 'المجموع'];
  return keywords.some(k => norm.includes(k));
}

export function validateSheet(sheet, colMap) {
  const valid = [], invalid = [], summaries = [];
  const required = ['branch', 'portfolio', 'par', 'parPct', 'collectionPct', 'clients'];
  
  sheet.rows.forEach(row => {
    if (isSummaryRow(row.data, colMap)) {
      summaries.push(row);
      return;
    }
    
    const errors = [];
    const parsedData = { ...row };
    
    required.forEach(k => {
      const idx = colMap[k];
      if (idx === undefined) return;
      if (k === 'branch') {
        if (!row.data[idx]) errors.push('Missing Branch Name');
      } else {
        const n = parseFormattedNumber(row.data[idx]);
        if (n === null) errors.push(`Invalid number in ${k}`);
        parsedData[k] = n;
      }
    });

    if (errors.length) invalid.push({ ...parsedData, errors });
    else valid.push(parsedData);
  });

  return { valid, invalid, summaries, missingFields: required.filter(k => colMap[k] === undefined) };
}