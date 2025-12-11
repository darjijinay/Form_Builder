"use client";
import FormRenderer from '../forms/FormRenderer';

export default function FormCanvas({
  form,
  onSelectField,
  selectedFieldId,
  onMoveField,
  onRemoveField,
  onUpdateMeta,
}) {
  return (
    <section className="bg-white/90 border border-slate-200 rounded-2xl p-4 overflow-y-auto">
      <div className="mb-4">
        <input
          className="bg-transparent text-2xl font-semibold outline-none border-b border-transparent focus:border-indigo-500 pb-1 w-full"
          value={form.title || ''}
          onChange={(e) => onUpdateMeta?.({ title: e.target.value })}
          placeholder="Untitled form"
        />
        <textarea
          className="w-full text-sm text-slate-600 mt-1 bg-transparent border border-transparent focus:border-indigo-200 rounded-lg outline-none resize-none"
          rows={2}
          value={form.description || ''}
          onChange={(e) => onUpdateMeta?.({ description: e.target.value })}
          placeholder="Add a short description"
        />
      </div>

      <div className="space-y-3">
        {form.fields.map((field) => (
          <div
            key={field._id}
            onClick={() => onSelectField(field._id)}
            className={`rounded-xl border px-3 py-2 ${
              selectedFieldId === field._id
                ? 'border-indigo-500 bg-white/95 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase text-slate-600">{field.type}</span>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveField(field._id, -1);
                  }}
                  className="text-xs px-2 py-1 rounded-full border border-slate-200 hover:border-slate-300"
                >
                  ↑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveField(field._id, 1);
                  }}
                  className="text-xs px-2 py-1 rounded-full border border-slate-200 hover:border-slate-300"
                >
                  ↓
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveField(field._id);
                  }}
                  className="text-xs px-2 py-1 rounded-full border border-red-500/40 text-red-500 hover:bg-red-50"
                >
                  ✕
                </button>
              </div>
            </div>
            <FormRenderer form={{ ...form, fields: [field] }} isPreview />
          </div>
        ))}

        {form.fields.length === 0 && (
          <div className="text-center text-sm text-slate-600 py-10 border border-dashed border-slate-200 rounded-2xl">
            Add a field from the left to start building your form
          </div>
        )}
      </div>
    </section>
  );
}
