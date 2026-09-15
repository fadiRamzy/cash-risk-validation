import React, { useState } from 'react';

export default function Mapping({ sheet, onConfirm }) {
  const [map, setMap] = useState(sheet.colMap || {});
  const keys = [
    { id: 'branch', label: 'الفرع' },
    { id: 'portfolio', label: 'المحفظة' },
    { id: 'par', label: 'المتأخرات' },
    { id: 'parPct', label: 'نسبة المتأخرات' },
    { id: 'collectionPct', label: 'نسبة التحصيل' },
    { id: 'clients', label: 'العملاء' }
  ];

  return (
    <div className="bg-white p-6 rounded shadow-lg border rtl" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تعيين أعمدة البيانات: {sheet.name}</h2>
      <div className="grid grid-cols-1 gap-4">
        {keys.map(k => (
          <div key={k.id} className="flex items-center justify-between border-b pb-2">
            <span>{k.label}</span>
            <select 
              value={map[k.id] ?? ''} 
              onChange={e => setMap({...map, [k.id]: parseInt(e.target.value)})}
              className="border p-1 rounded"
            >
              <option value="">-- اختر العمود --</option>
              {sheet.header.map((h, i) => (
                <option key={i} value={i}>{h || `Column ${i+1}`}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button 
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => onConfirm(map)}
      >
        تأكيد التعيين
      </button>
    </div>
  );
}