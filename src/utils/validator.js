import { normalizeText } from './columnMap.js';

export function parseFormattedNumber(val) {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return val;

  let str = val.toString().trim();
  // Normalize Arabic-Indic digits to ASCII
  str = str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
  // Normalize Arabic decimal separator to '.' and Arabic thousands separator to ','
  str = str.replace(/٫/g, '.').replace(/٬/g, ',');
  // Strip percent signs and whitespace before separator analysis (must not affect the
  // thousands/decimal logic below)
  str = str.replace(/[%٪\s]/g, '');
  if (str === '') return null;

  const hasDot = str.includes('.');
  const hasComma = str.includes(',');

  // Deterministic separator logic: handles "1,200,500" / "1,200,500.50" / "1.200.500" /
  // "1.200.500,50" / "15.5" / "15,5" as specified.
  if (hasDot && hasComma) {
    // Whichever separator appears LAST is the decimal separator; the other is thousands grouping.
    const lastDot = str.lastIndexOf('.');
    const lastComma = str.lastIndexOf(',');
    if (lastDot > lastComma) str = str.replace(/,/g, '');
    else str = str.replace(/\./g, '').replace(',', '.');
  } else if (hasComma) {
    // Only commas: multiple commas, or a single comma followed by exactly 3 digits, is
    // thousands grouping ("1,200,500" / "100,000"); otherwise it's a decimal comma ("15,5").
    const parts = str.split(',');
    const looksLikeThousands = parts.length > 2 || (parts.length === 2 && parts[1].length === 3 && parts[0].length > 0);
    str = looksLikeThousands ? str.replace(/,/g, '') : str.replace(',', '.');
  } else if (hasDot) {
    // Only dots: multiple dots, or a single dot followed by exactly 3 digits, is thousands
    // grouping ("1.200.500"); otherwise it's a normal decimal point ("15.5").
    const parts = str.split('.');
    const looksLikeThousands = parts.length > 2 || (parts.length === 2 && parts[1].length === 3 && parts[0].length > 0);
    if (looksLikeThousands) str = str.replace(/\./g, '');
  }

  str = str.replace(/[^\d.-]/g, '');
  if (str === '' || str === '-') return null;
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
        else parsedData.branch = row.data[idx];
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