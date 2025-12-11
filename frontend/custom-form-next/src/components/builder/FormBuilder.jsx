"use client";
import { useState, useMemo } from 'react';
import { nanoid } from 'nanoid';
import FieldPalette from './FieldPalette';
import FormCanvas from './FormCanvas';
import FieldSettingsPanel from './FieldSettingsPanel';

const DEFAULT_FIELD_CONFIGS = {
  short_text: { label: 'Short answer', placeholder: 'Type your answer' },
  long_text: { label: 'Long answer', placeholder: 'Type your answer' },
  email: { label: 'Email', placeholder: 'example@domain.com' },
  number: { label: 'Number', placeholder: 'Enter a number' },
  dropdown: { label: 'Dropdown', options: ['Option 1', 'Option 2'] },
  radio: { label: 'Multiple choice', options: ['Option 1', 'Option 2'] },
  checkbox: { label: 'Checkboxes', options: ['Option 1', 'Option 2'] },
  file: { label: 'File Upload', placeholder: 'Choose a file' },
  rating: { label: 'Rating', placeholder: 'Select a rating' },
};

export default function FormBuilder({ initialForm, onChange }) {
  const [form, setForm] = useState(
    () => initialForm || { title: 'Untitled form', description: '', fields: [], settings: {} }
  );
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  const selectedField = useMemo(
    () => form.fields.find((f) => f._id === selectedFieldId) || null,
    [form.fields, selectedFieldId]
  );

  const updateForm = (updater) => {
    setForm((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      onChange?.(next);
      return next;
    });
  };

  const updateMeta = (changes) => {
    updateForm((prev) => ({ ...prev, ...changes }));
  };

  const addField = (type) => {
    const base = DEFAULT_FIELD_CONFIGS[type] || { label: 'Untitled', placeholder: '' };

    updateForm((prev) => {
      const newField = {
        _id: nanoid(),
        type,
        label: base.label,
        placeholder: base.placeholder || '',
        required: false,
        options: base.options || [],
        order: prev.fields.length,
        width: 'full',
      };

      return { ...prev, fields: [...prev.fields, newField] };
    });
  };

  const updateField = (fieldId, changes) => {
    updateForm((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f._id === fieldId ? { ...f, ...changes } : f
      ),
    }));
  };

  const removeField = (fieldId) => {
    updateForm((prev) => ({
      ...prev,
      fields: prev.fields
        .filter((f) => f._id !== fieldId)
        .map((f, idx) => ({ ...f, order: idx })),
    }));
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
  };

  const moveField = (fieldId, direction) => {
    updateForm((prev) => {
      const idx = prev.fields.findIndex((f) => f._id === fieldId);
      if (idx === -1) return prev;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= prev.fields.length) return prev;

      const fields = [...prev.fields];
      const [removed] = fields.splice(idx, 1);
      fields.splice(newIdx, 0, removed);
      return {
        ...prev,
        fields: fields.map((f, index) => ({ ...f, order: index })),
      };
    });
  };

  return (
    <div className="grid grid-cols-[250px_minmax(0,1fr)_280px] gap-4 h-full">
      <FieldPalette onAddField={addField} />
      <FormCanvas
        form={form}
        onSelectField={setSelectedFieldId}
        selectedFieldId={selectedFieldId}
        onMoveField={moveField}
        onRemoveField={removeField}
        onUpdateMeta={updateMeta}
      />
      <FieldSettingsPanel
            field={selectedField}
            fields={form.fields}
            onChange={(changes) =>
              selectedField && updateField(selectedField._id, changes)
            }
          />
    </div>
  );
}
