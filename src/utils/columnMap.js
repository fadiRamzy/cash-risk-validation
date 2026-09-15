export function normalizeText(text) {
  if (text === null || text === undefined) return '';
  let str = text.toString().trim().toLowerCase();
  str = str.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ');
  str = str.replace(/[\u064B-\u065F\u0670]/g, ''); // Remove Tashkeel
  str = str.replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
  str = str.replace(/[-_.:|/\\٪%]/g, '');
  str = str.replace(/\s+/g, ''); // Strip all whitespace for matching
  return str;
}

export const columnSynonyms = {
  branch: ['الفرع', 'اسم الفرع', 'branch', 'branchname'],
  portfolio: ['المحفظه', 'المحفظة', 'portfolio', 'portfolioamount', 'الرصيدالقائم', 'اجمالي مبلغ المحفظة'],
  par: ['المتاخرات', 'المتأخرات', 'par', 'paramount', 'رصيدالمتاخرات'],
  parPct: ['نسبه المتاخرات', 'نسبة المتأخرات', 'par%', 'parpercentage'],
  collection: ['التحصيل', 'قيمه التحصيل', 'collection', 'المحصل'],
  target: ['المطلوب', 'المستهدف', 'target', 'required'],
  // 'سداد' matches real-world headers like "سداد يوليو 2026" / "سداد أغسطس" (collection % for a given month)
  collectionPct: ['نسبه التحصيل', 'نسبة التحصيل', 'collection%', 'معدل التحصيل', 'سداد'],
  clients: ['عدد العملاء', 'اجمال العملاء', 'العملاء', 'clients', 'clientcount']
};

// Minimum normalized length a synonym must have to be used in the loose substring fallback pass.
// Short/generic tokens (e.g. "par") are exact-match only to avoid false positives against
// longer headers that merely contain the substring (e.g. "PAR Amount" containing "par").
const SUBSTRING_MIN_LEN = 4;

export const agingBucketsPattern = {
  // Handles both "1-30" (->"130") and "30-1" (->"301") style headers, Arabic and numeric
  '1_30': [/^130$/, /^301$/, /1الي?30/],
  '31_60': [/^3160$/, /^6031$/, /31الي?60/],
  '61_90': [/^6190$/, /^9061$/, /61الي?90/],
  '91_120': [/^91120$/, /^12091$/, /91الي?120/],
  // "Npl (> 121)", "120+", "اكثر من 120" etc. — the final open-ended bucket
  '120_plus': [/^npl/, /120\+/, /\+120/, /اكثرمن120/, /over120/, />120/]
};

export function detectColumns(headerRow) {
  const map = {};
  const normalizedHeaders = headerRow.map(h => normalizeText(h));
  const usedCols = new Set();

  // Pass 1: exact match, in synonym-key priority order. This is what correctly disambiguates
  // short overlapping tokens such as "PAR Amount" (-> "paramount") vs "PAR %" (-> "par").
  for (const [key, synonyms] of Object.entries(columnSynonyms)) {
    const syns = synonyms.map(s => normalizeText(s));
    const idx = normalizedHeaders.findIndex((h, i) => !usedCols.has(i) && syns.includes(h));
    if (idx !== -1) { map[key] = idx; usedCols.add(idx); }
  }

  // Pass 2: substring fallback for keys not resolved by exact match, for headers that carry
  // extra words (e.g. real header "اجمالي مبلغ المحفظة" vs synonym "المحفظة"). Skips columns
  // already claimed and skips short/generic synonyms to avoid collisions.
  for (const [key, synonyms] of Object.entries(columnSynonyms)) {
    if (map[key] !== undefined) continue;
    const syns = synonyms.map(s => normalizeText(s)).filter(s => s.length >= SUBSTRING_MIN_LEN);
    const idx = normalizedHeaders.findIndex((h, i) => !usedCols.has(i) && h && syns.some(s => h.includes(s)));
    if (idx !== -1) { map[key] = idx; usedCols.add(idx); }
  }

  const agingCols = {};
  normalizedHeaders.forEach((h, idx) => {
    if (usedCols.has(idx)) return;
    for (const [bucket, patterns] of Object.entries(agingBucketsPattern)) {
      if (patterns.some(p => p.test(h))) agingCols[bucket] = idx;
    }
  });
  if (Object.keys(agingCols).length > 0) map.aging = agingCols;

  return map;
}