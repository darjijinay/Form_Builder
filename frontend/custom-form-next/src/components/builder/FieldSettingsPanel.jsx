"use client";
export default function FieldSettingsPanel({ field, fields = [], onChange }) {
  if (!field)
    return (
      <aside className="bg-white shadow-sm border border-slate-200 rounded-2xl p-4 text-sm text-slate-600">
        Select a field to customize its settings
      </aside>
    );

  return (
    <aside className="bg-white shadow-sm border border-slate-200 rounded-2xl p-4 space-y-3 text-sm">
      <div>
        <div className="text-xs text-slate-600 uppercase mb-1">Label</div>
        <input
          value={field.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className="input"
        />
      </div>

      <div>
        <div className="text-xs text-slate-600 uppercase mb-1">Placeholder</div>
        <input
          value={field.placeholder || ''}
          onChange={(e) => onChange({ placeholder: e.target.value })}
          className="input"
        />
      </div>

      <div className="flex items-center justify-between">
        <span>Required</span>
        <button
          onClick={() => onChange({ required: !field.required })}
          className={`w-10 h-5 rounded-full text-[10px] flex items-center px-1 ${
            field.required ? 'bg-emerald-500' : 'bg-slate-200'
          }`}
        >
          <span
            className={`h-4 w-4 bg-white rounded-full shadow transition-transform ${
              field.required ? 'translate-x-4' : 'translate-x-0'
            }`}
          ></span>
        </button>
      </div>

      {['dropdown','radio','checkbox'].includes(field.type) && (
        <div>
          <div className="text-xs text-slate-600 uppercase mb-1">Options (comma separated)</div>
          <input
            value={field.options?.join(', ') || ''}
            onChange={(e) =>
              onChange({
                options: e.target.value
                  .split(',')
                  .map((o) => o.trim())
                  .filter(Boolean),
              })
            }
            className="input"
          />
        </div>
      )}

      {field.type === 'matrix' && (
        <div className="space-y-2 border-t border-slate-200 pt-3">
          <div className="text-xs text-slate-600 uppercase mb-2">Matrix Settings</div>
          
          <div>
            <div className="text-xs text-slate-500 mb-1">Rows (comma separated)</div>
            <input
              value={field.matrixRows?.join(', ') || ''}
              onChange={(e) =>
                onChange({
                  matrixRows: e.target.value
                    .split(',')
                    .map((r) => r.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Row 1, Row 2, Row 3"
              className="input"
            />
          </div>

          <div>
            <div className="text-xs text-slate-500 mb-1">Columns (comma separated)</div>
            <input
              value={field.matrixColumns?.join(', ') || ''}
              onChange={(e) =>
                onChange({
                  matrixColumns: e.target.value
                    .split(',')
                    .map((c) => c.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Column 1, Column 2, Column 3"
              className="input"
            />
          </div>
        </div>
      )}

      {field.type === 'file' && (
        <div className="space-y-2 border-t border-slate-200 pt-3">
          <div className="text-xs text-slate-600 uppercase mb-2">File Upload Settings</div>
          
          <div>
            <div className="text-xs text-slate-500 mb-1">Allowed file types</div>
            <input
              value={field.fileTypes || '.pdf,.doc,.docx,.jpg,.png'}
              onChange={(e) => onChange({ fileTypes: e.target.value })}
              placeholder=".pdf,.jpg,.png"
              className="input"
            />
          </div>

          <div>
            <div className="text-xs text-slate-500 mb-1">Max file size (MB)</div>
            <input
              type="number"
              value={field.maxFileSize || 5}
              onChange={(e) => onChange({ maxFileSize: parseInt(e.target.value) || 5 })}
              min="1"
              max="100"
              className="input"
            />
          </div>
        </div>
      )}

      <div>
        <div className="text-xs text-slate-600 uppercase mb-1">Conditional Logic</div>
        <div className="text-sm text-slate-500 mb-2">Show this field only when a condition is met.</div>
        <div className="grid gap-2">
          <select value={field.logic?.showWhenFieldId || ''} onChange={(e) => onChange({ logic: { ...(field.logic||{}), showWhenFieldId: e.target.value } })} className="input">
            <option value="">-- Select field --</option>
            {fields.filter(f => f._id !== field._id).map(f => (
              <option key={f._id} value={f._id}>{f.label || f.type}</option>
            ))}
          </select>

          <select value={field.logic?.operator || 'equals'} onChange={(e) => onChange({ logic: { ...(field.logic||{}), operator: e.target.value } })} className="input">
            <option value="equals">equals</option>
            <option value="not_equals">not equals</option>
            <option value="contains">contains</option>
          </select>

          <input value={field.logic?.value || ''} onChange={(e) => onChange({ logic: { ...(field.logic||{}), value: e.target.value } })} placeholder="Value to match" className="input" />

          <div className="flex gap-2">
            <button onClick={() => onChange({ logic: null })} className="px-3 py-1 rounded-md border text-sm">Clear</button>
          </div>
        </div>
      </div>
    </aside>
  );
}
