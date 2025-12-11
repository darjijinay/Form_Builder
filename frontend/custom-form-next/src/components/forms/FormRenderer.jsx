"use client";
import { useEffect } from 'react';

export default function FormRenderer({ form, isPreview = false, onSubmit }) {
  const handleSubmit = async (e) => {
    if (isPreview) return;
    e.preventDefault();
    const formEl = e.target;

    // Build answers array, uploading files when necessary
    const answers = [];

    for (const field of form.fields) {
      try {
        if (field.type === 'file') {
          const input = formEl.querySelector(`[name="${field._id}"]`);
          const file = input?.files?.[0];
          if (file) {
            const fd = new FormData();
            fd.append('file', file);
            // upload to backend (use NEXT_PUBLIC_API_URL when available)
            const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
            const uploadEndpoint = `${apiBase}/uploads`;
            const res = await fetch(uploadEndpoint, {
              method: 'POST',
              body: fd,
            });
            if (res.ok) {
              const body = await res.json();
              answers.push({ fieldId: field._id, value: body.url || body.filename });
            } else {
              // push a placeholder or filename on failure
              answers.push({ fieldId: field._id, value: file.name });
            }
          } else {
            answers.push({ fieldId: field._id, value: null });
          }
        } else if (field.type === 'checkbox') {
          const inputs = Array.from(formEl.querySelectorAll(`[name="${field._id}"]`));
          const vals = inputs.filter(i => i.checked).map(i => i.value);
          answers.push({ fieldId: field._id, value: vals });
        } else if (field.type === 'radio') {
          const input = formEl.querySelector(`[name="${field._id}"]:checked`);
          answers.push({ fieldId: field._id, value: input ? input.value : '' });
        } else {
          const input = formEl.querySelector(`[name="${field._id}"]`);
          answers.push({ fieldId: field._id, value: input ? input.value : '' });
        }
      } catch (err) {
        answers.push({ fieldId: field._id, value: null });
      }
    }

    onSubmit?.(answers);
  };

  useEffect(() => {
    if (!form || !form.fields) return;

    const applyLogic = (logicField, targetFieldId) => {
      try {
        const wrapper = document.getElementById(`field-wrapper-${targetFieldId}`);
        if (!wrapper) return;
        const refName = logicField.showWhenFieldId;
        const refInputs = Array.from(document.querySelectorAll(`[name="${refName}"]`));
        if (refInputs.length === 0) {
          wrapper.style.display = 'none';
          return;
        }

        // compute value
        let val;
        if (refInputs[0].type === 'checkbox') {
          val = refInputs.filter(i => i.checked).map(i => i.value);
        } else if (refInputs[0].type === 'radio') {
          const r = refInputs.find(i => i.checked);
          val = r ? r.value : '';
        } else {
          val = refInputs[0].value;
        }

        const op = logicField.operator || 'equals';
        const targetVal = logicField.value || '';
        let matched = false;
        if (Array.isArray(val)) {
          if (op === 'contains') matched = val.includes(targetVal);
          else if (op === 'equals') matched = val.length > 0 && String(val[0]) === String(targetVal);
          else matched = !(val.length > 0 && String(val[0]) === String(targetVal));
        } else {
          if (op === 'contains') matched = String(val || '').includes(targetVal);
          else if (op === 'equals') matched = String(val || '') === String(targetVal);
          else matched = String(val || '') !== String(targetVal);
        }

        wrapper.style.display = matched ? '' : 'none';
      } catch (e) {
        // ignore
      }
    };

    const listeners = [];
    form.fields.forEach((f) => {
      if (!f.logic || !f.logic.showWhenFieldId) return;
      const refName = f.logic.showWhenFieldId;
      const refInputs = Array.from(document.querySelectorAll(`[name="${refName}"]`));
      // initial apply
      applyLogic(f.logic, f._id);
      refInputs.forEach((inp) => {
        const fn = () => applyLogic(f.logic, f._id);
        inp.addEventListener('change', fn);
        listeners.push({ inp, fn });
      });
    });

    return () => {
      listeners.forEach(({ inp, fn }) => inp.removeEventListener('change', fn));
    };
  }, [form]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {form.fields.map((field) => (
        <div key={field._id} id={`field-wrapper-${field._id}`} className="space-y-1">
          <label className="block text-sm font-medium text-[var(--text)]">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field, isPreview)}
        </div>
      ))}

      {!isPreview && form.fields.length > 0 && (
        <button
          type="submit"
          className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white"
        >
          Submit
        </button>
      )}
    </form>
  );
}

function renderField(field, isPreview) {
  const commonProps = {
    id: field._id,
    name: field._id,
    required: field.required,
    placeholder: field.placeholder,
    disabled: isPreview,
    className: 'input',
  };

  
  switch (field.type) {
    case 'short_text':
    case 'email':
    case 'number':
      return <input type={field.type === 'short_text' ? 'text' : field.type} {...commonProps} />;

    case 'long_text':
      return <textarea rows={3} {...commonProps} />;

    case 'dropdown':
      return (
        <select {...commonProps}>
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          {(field.options || []).map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input type="radio" name={field._id} value={opt} disabled={isPreview} />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      );

    case 'checkbox':
      return (
        <div className="space-y-2">
          {(field.options || []).map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input type="checkbox" name={field._id} value={opt} disabled={isPreview} />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      );

    case 'file':
      const fileTypes = field.fileTypes || '.pdf,.doc,.docx,.jpg,.png';
      return (
        <div className="space-y-2">
          <input
            type="file"
            {...commonProps}
            accept={fileTypes}
          />
          <p className="text-xs text-slate-500">
            Max size: {field.maxFileSize || 5} MB. Allowed types: {fileTypes}
          </p>
        </div>
      );

    case 'rating':
      return (
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name={field._id}
                value={star}
                disabled={isPreview}
                className="sr-only"
              />
              <svg
                className={`w-8 h-8 transition-colors ${
                  isPreview ? 'text-slate-300' : 'text-slate-300 hover:text-yellow-400'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </label>
          ))}
        </div>
      );

    default:
      return <input type="text" {...commonProps} />;
  }
}
