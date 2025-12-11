"use client";
import { useState } from 'react';

export default function Step1FormDetails({ form, onUpdate }) {
  const [newDetail, setNewDetail] = useState({ label: '', value: '' });

  const handleInputChange = (field, value) => {
    onUpdate({ ...form, [field]: value });
  };

  const handleCustomDetailChange = (index, field, value) => {
    const updated = [...(form.customDetails || [])];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ ...form, customDetails: updated });
  };

  const addCustomDetail = () => {
    if (newDetail.label.trim() && newDetail.value.trim()) {
      const updated = [...(form.customDetails || []), newDetail];
      onUpdate({ ...form, customDetails: updated });
      setNewDetail({ label: '', value: '' });
    }
  };

  const removeCustomDetail = (index) => {
    const updated = form.customDetails.filter((_, i) => i !== index);
    onUpdate({ ...form, customDetails: updated });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 text-slate-900">Step 1: Form / Event Details</h2>
        <p className="text-sm text-slate-600 mb-6">
          Add details about why the form exists. This becomes the landing / info page for participants.
        </p>

        {/* Title & Subtitle */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Form Title / Event Name
            </label>
            <input
              type="text"
              value={form.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Workshop Registration"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Short Subtitle (optional)
            </label>
            <input
              type="text"
              value={form.subtitle || ''}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="e.g., 2024 Annual Workshop"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Description / Purpose
          </label>
          <textarea
            value={form.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Explain the purpose and details..."
            rows="4"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Date, Time, Location */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Date</label>
            <input
              type="date"
              value={form.date || ''}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              style={{
                colorScheme: 'light',
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Time</label>
            <input
              type="time"
              value={form.time || ''}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              style={{
                colorScheme: 'light',
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Location / Mode
            </label>
            <input
              type="text"
              value={form.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Online / Office / City, etc."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Organizer Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Organizer Name
            </label>
            <input
              type="text"
              value={form.organizerName || ''}
              onChange={(e) => handleInputChange('organizerName', e.target.value)}
              placeholder="e.g., John Smith"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Organizer Email
            </label>
            <input
              type="email"
              value={form.organizerEmail || ''}
              onChange={(e) => handleInputChange('organizerEmail', e.target.value)}
              placeholder="e.g., john@example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Organizer Phone (optional) */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Organizer Phone (optional)
          </label>
          <input
            type="tel"
            value={form.organizerPhone || ''}
            onChange={(e) => handleInputChange('organizerPhone', e.target.value)}
            placeholder="e.g., +1 (555) 123-4567"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Custom Details Section */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Additional Details (custom)</h3>
          <p className="text-xs text-slate-500 mb-4">
            Add more structured details about the event/purpose (e.g., Speaker Name, Duration, Mode, Eligibility, Logo, etc.).
          </p>

          {/* Existing Custom Details */}
          {form.customDetails && form.customDetails.length > 0 && (
            <div className="space-y-2 mb-4">
              {form.customDetails.map((detail, idx) => (
                <div key={idx} className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{detail.label}</p>
                    <p className="text-sm text-slate-600">{detail.value}</p>
                  </div>
                  <button
                    onClick={() => removeCustomDetail(idx)}
                    className="text-red-600 hover:text-red-700 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Custom Detail */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input
              type="text"
              value={newDetail.label}
              onChange={(e) => setNewDetail({ ...newDetail, label: e.target.value })}
              placeholder="e.g., Speaker Name, Duration, Logo"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={newDetail.value}
              onChange={(e) => setNewDetail({ ...newDetail, value: e.target.value })}
              placeholder="e.g., John Doe, 2 hours, Final year students only"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={addCustomDetail}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700"
          >
            + Add Detail
          </button>
        </div>
      </div>
    </div>
  );
}
