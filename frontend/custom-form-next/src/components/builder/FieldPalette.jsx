"use client";
const FIELDS = [
  { type: 'short_text', label: 'Short Text' },
  { type: 'long_text', label: 'Long Text' },
  { type: 'email', label: 'Email' },
  { type: 'number', label: 'Number' },
  { type: 'dropdown', label: 'Dropdown' },
  { type: 'radio', label: 'Multiple Choice (Radio)' },
  { type: 'checkbox', label: 'Checkboxes' },
  { type: 'file', label: 'File Upload' },
  { type: 'rating', label: 'Rating (1-5)' },
];

export default function FieldPalette({ onAddField }) {
  return (
    <aside className="bg-white shadow-sm border border-slate-200 rounded-2xl p-3 flex flex-col">
      <h3 className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Field types</h3>
      <div className="space-y-2">
        {FIELDS.map((f) => (
          <button
            key={f.type}
            onClick={() => onAddField(f.type)}
            className="w-full text-left px-3 py-2 rounded-xl bg-white/90 hover:bg-slate-50 text-sm flex justify-between items-center transition border border-slate-200"
          >
            <span className="text-[var(--text)]">{f.label}</span>
            <span className="text-xs text-slate-500">{f.type}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
