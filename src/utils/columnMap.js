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
  portfolio: ['المحفظه', 'المحفظة', 'portfolio', 'portfolioamount', 'الرصيدالقائم'],
  par: ['المتاخرات', 'المتأخرات', 'par', 'paramount', 'رصيدالمتاخرات'],
  parPct: ['نسبه المتاخرات', 'نسبة المتأخرات', 'par%', 'parpercentage'],
  collection: ['التحصيل', 'قيمه التحصيل', 'collection', 'المحصل'],
  target: ['المطلوب', 'المستهدف', 'target', 'required'],
  collectionPct: ['نسبه التحصيل', 'نسبة التحصيل', 'collection%', 'معدل التحصيل'],
  clients: ['عدد العملاء', 'العملاء', 'clients', 'clientcount']
};

export const agingBucketsPattern = {
  '1_30': [/130/, /1الى30/, /1الي30/],
  '31_60': [/3160/, /31الى60/],
  '61_90': [/6190/, /61الى90/],
  '90_plus': [/90\+/, /\+90/, /اكثرمن90/, /over90/]
};

export function detectColumns(headerRow) {
  const map = {};
  const normalizedHeaders = headerRow.map(h => normalizeText(h));

  for (const [key, synonyms] of Object.entries(columnSynonyms)) {
    const syns = synonyms.map(s => normalizeText(s));
    const idx = normalizedHeaders.findIndex(h => syns.includes(h));
    if (idx !== -1) map[key] = idx;
  }

  const agingCols = {};
  normalizedHeaders.forEach((h, idx) => {
    for (const [bucket, patterns] of Object.entries(agingBucketsPattern)) {
      if (patterns.some(p => p.test(h))) agingCols[bucket] = idx;
    }
  });
  if (Object.keys(agingCols).length > 0) map.aging = agingCols;

  return map;
}