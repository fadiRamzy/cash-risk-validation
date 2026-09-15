import { normalizeText } from './columnMap.js';

export function parseFormattedNumber(val) {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return val;

  let str = val.toString().trim();
  str = str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
  str = str.replace(/٫/g, '.').replace(/٬/g, '');

  str = str.replace(/[^\d.,-]/g, '');
  if (!str) return null;

  const hasDot = str.includes('.');
  const hasComma = str.includes(',');

  if (hasDot && hasComma) {
    const lastDot = str.lastIndexOf('.');
    const lastComma = str.lastIndexOf(',');
    if (lastDot > lastComma) {
      str = str.replace(/,/g, '');
    } else {
      str = str.replace(/\./g, '').replace(',', '.');
    }
  } else if (hasComma && !hasDot) {
    const commaParts = str.split(',');
    if (commaParts.length === 2 && commaParts[1].length <= 2) {
      str = str.replace(',', '.');
    } else {
      str = str.replace(/,/g, '');
    }
  } else if (hasDot && !hasComma) {
    const dotParts = str.split('.');
    if (dotParts.length > 2) {
      str = str.replace(/\./g, '');
    }
  }

  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

export function isSummaryRow(row, colMap) {
  const branchVal = row[colMap.branch];
  if (!branchVal) {
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
        parsedData[k] = row.data[idx];
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