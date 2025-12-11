"use client";
import { useRouter } from 'next/router';
import AppLayout from '../../../../components/layout/AppLayout';
import FormBuilder from '../../../../components/builder/FormBuilder';
import { useEffect, useState, useRef } from 'react';
import { formApi } from '../../../../api/formApi';

export default function FormBuilderPage() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const statusTimer = useRef(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      if (id === 'new') {
        setForm({
          title: 'Untitled form',
          subtitle: '',
          description: '',
          date: '',
          time: '',
          location: '',
          organizerName: '',
          organizerEmail: '',
          organizerPhone: '',
          customDetails: [],
          fields: [],
          settings: { isPublic: true },
        });
        return;
      }

      try {
        const { data } = await formApi.getForm(id);
        setForm(data);
      } catch (error) {
        console.error('Error loading form:', error);
      }
    };

    load();
  }, [id]);

  // mark mounted
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  // autosave disabled: saving is manual via Save button

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setStatus('');
    try {
      if (id && id !== 'new') {
        const { data } = await formApi.updateForm(id, form);
        setForm(data);
      } else {
        const { data } = await formApi.createForm(form);
        // replace URL with new id so future saves update
        router.replace(`/app/forms/builder/${data._id}`);
        setForm(data);
      }
      setStatus('Form saved');
      // clear previous timer
      if (statusTimer.current) clearTimeout(statusTimer.current);
      statusTimer.current = setTimeout(() => setStatus(''), 2000);
    } catch (error) {
      console.error('Error saving form:', error);
    } finally {
      setSaving(false);
    }
  };

  // shared save used by autosave and step navigation
  const doSave = async () => {
    if (!form) return false;
    if (saving) return false; // avoid concurrent saves
    setSaving(true);
    setStatus('Saving…');
    try {
      if (id && id !== 'new' && form._id) {
        const { data } = await formApi.updateForm(form._id || id, form);
        setForm(data);
      } else {
        const { data } = await formApi.createForm(form);
        router.replace(`/app/forms/builder/${data._id}`);
        setForm(data);
      }
      setStatus('Saved');
      if (statusTimer.current) clearTimeout(statusTimer.current);
      statusTimer.current = setTimeout(() => setStatus(''), 2000);
      return true;
    } catch (e) {
      console.error('Autosave error', e);
      setStatus('Save failed');
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (statusTimer.current) clearTimeout(statusTimer.current);
    };
  }, []);

  if (!form) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-sm text-slate-600">Loading form...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col gap-4">
        <div className="flex items-center justify-end">
          {status && <span className="text-sm font-medium text-emerald-600">{status}</span>}
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-4">
          <StepperItem index={1} label="Form Details" active={step===1} onClick={() => setStep(1)} />
          <div className="h-px bg-slate-200 flex-1" />
          <StepperItem index={2} label="Design Form" active={step===2} onClick={() => setStep(2)} />
          <div className="h-px bg-slate-200 flex-1" />
          <StepperItem index={3} label="Preview & Publish" active={step===3} onClick={() => setStep(3)} />
        </div>

        <div className="bg-white/90 border border-slate-200 rounded-2xl p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Step 1: Form / Event Details</h2>
              <p className="text-sm text-slate-600">Add details about why the form exists. </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-slate-600">Form Title / Event Name</label>
                  <input value={form.title || ''} onChange={(e) => setForm({...form, title: e.target.value})} className="mt-2 w-full px-3 py-2 border rounded-xl" />
                  {errors.title && <div className="text-xs text-red-500 mt-1">{errors.title}</div>}
                </div>
                <div>
                  <label className="text-sm text-slate-600">Short Subtitle (optional)</label>
                  <input value={form.subtitle || ''} onChange={(e) => setForm({...form, subtitle: e.target.value})} className="mt-2 w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600">Description / Purpose</label>
                <textarea value={form.description || ''} onChange={(e) => setForm({...form, description: e.target.value})} className="mt-2 w-full px-3 py-2 border rounded-xl" rows={4} />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm text-slate-600">Date</label>
                  <input type="date" value={form.date || ''} onChange={(e) => setForm({...form, date: e.target.value})} className="mt-2 w-full px-3 py-2 border rounded-xl cursor-pointer" style={{ colorScheme: 'light' }} />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Time</label>
                  <input type="time" value={form.time || ''} onChange={(e) => setForm({...form, time: e.target.value})} className="mt-2 w-full px-3 py-2 border rounded-xl cursor-pointer" style={{ colorScheme: 'light' }} />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Location / Mode</label>
                  <input value={form.location || ''} onChange={(e) => setForm({...form, location: e.target.value})} placeholder="Online / Office / City, etc." className="mt-2 w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-slate-600">Organizer Name</label>
                  <input value={form.organizerName || ''} onChange={(e) => setForm({...form, organizerName: e.target.value})} className="mt-2 w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Organizer Email</label>
                  <input value={form.organizerEmail || ''} onChange={(e) => setForm({...form, organizerEmail: e.target.value})} className="mt-2 w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600">Organizer Phone (optional)</label>
                <input type="tel" value={form.organizerPhone || ''} onChange={(e) => setForm({...form, organizerPhone: e.target.value})} className="mt-2 w-full px-3 py-2 border rounded-xl" />
              </div>

              <div>
                <h4 className="font-semibold">Additional Details (custom)</h4>
                <p className="text-sm text-slate-500 mb-2">Use this section to add more structured details about the event/purpose (e.g., Speaker Name, Duration, Eligibility, Logo, etc.).</p>
                {/* simple list input for custom details */}
                {(form.customDetails || []).map((d, idx) => (
                  <div key={idx} className="grid gap-2 md:grid-cols-2 items-center mb-2">
                    <input value={d.label} onChange={(e) => {
                      const next = [...form.customDetails]; next[idx] = {...next[idx], label: e.target.value}; setForm({...form, customDetails: next});
                    }} placeholder="Detail Label" className="px-3 py-2 border rounded-xl" />
                    <div className="flex gap-2">
                      <input value={d.value} onChange={(e) => { const next = [...form.customDetails]; next[idx] = {...next[idx], value: e.target.value}; setForm({...form, customDetails: next}); }} placeholder="Value" className="flex-1 px-3 py-2 border rounded-xl" />
                      <button onClick={() => {
                        const next = form.customDetails.filter((_, i) => i !== idx);
                        setForm({...form, customDetails: next});
                      }} className="px-2 py-2 text-red-500 hover:bg-red-50 rounded">✕</button>
                    </div>
                  </div>
                ))}
                <div className="mt-2">
                  <button onClick={() => setForm({...form, customDetails: [...(form.customDetails||[]), { label: '', value: '' }]})} className="px-3 py-2 rounded-full border">+ Add Detail</button>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <div />
                <div>
                  <button
                    onClick={async () => {
                      const errs = {};
                      if (!form.title || !form.title.trim()) errs.title = 'Title is required';
                      setErrors(errs);
                      if (Object.keys(errs).length > 0) return;
                      const ok = await doSave();
                      if (ok) setStep(2);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Step 2: Design Response Form</h2>
              <p className="text-sm text-slate-600 mb-4">Define what information you want from participants. </p>
              <div className="h-[600px]"><FormBuilder initialForm={form} onChange={setForm} /></div>
              <div className="mt-4 flex justify-between">
                <button onClick={() => setStep(1)} className="px-4 py-2 rounded-xl border">← Back</button>
                <button
                  onClick={async () => {
                    const ok = await doSave();
                    if (ok) setStep(3);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Step 3: Preview & Publish</h2>
              <p className="text-sm text-slate-600 mb-4">This is how your form will look. </p>
              <div className="border rounded-xl p-4 mb-4 bg-white">
                <h3 className="font-semibold text-xl">{form.title || 'Form / Event Title'}</h3>
                <p className="text-sm text-slate-500">{form.description || 'Fill Step 1 to see the event details preview here.'}</p>
                <div className="mt-4">
                  <button className="px-4 py-2 rounded-full bg-indigo-600 text-white">Register / Participate</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 items-start">
                <div className="space-y-3 border rounded-lg p-4 bg-slate-50">
                  <h3 className="font-semibold text-sm">Email Notifications</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="notify_toggle"
                      checked={!!form.settings?.notifyOnSubmission}
                      onChange={(e) => setForm({...form, settings: {...form.settings, notifyOnSubmission: e.target.checked}})}
                      className="w-4 h-4"
                    />
                    <label htmlFor="notify_toggle" className="text-sm cursor-pointer">Notify me when form is submitted</label>
                  </div>

                  {form.settings?.notifyOnSubmission && (
                    <div>
                      <label className="text-xs font-medium text-slate-700 block mb-1">Send notifications to:</label>
                      <input
                        type="email"
                        value={form.settings?.notificationEmail || ''}
                        onChange={(e) => setForm({...form, settings: {...form.settings, notificationEmail: e.target.value}})}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 border rounded text-sm"
                      />
                      <p className="text-xs text-slate-500 mt-1">You'll receive an email each time someone submits the form.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={!!form.settings?.isPublic} onChange={(e) => setForm({...form, settings: {...form.settings, isPublic: e.target.checked}})} />
                    <span className="text-sm">Make form public</span>
                  </label>
                  <p className="text-sm text-slate-500 mt-2">When published, anyone with the link can view and submit this form.</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">Share link</div>
                  <div className="text-xs text-slate-400">Copy to clipboard</div>
                </div>
                <div className="mt-2 flex gap-2">
                  <input readOnly value={form._id ? `${typeof window !== 'undefined' ? window.location.origin : ''}/public/${form._id}` : ''} className="flex-1 px-3 py-2 border rounded" />
                  <button onClick={() => {
                    const url = form._id ? `${typeof window !== 'undefined' ? window.location.origin : ''}/public/${form._id}` : '';
                    if (!url) return;
                    navigator.clipboard?.writeText(url).then(()=> alert('Link copied'));
                  }} className="px-3 py-2 rounded bg-indigo-600 text-white">Copy</button>
                </div>
                <div className="mt-2 text-xs text-slate-500">Public URL: <code className="break-all">{form._id ? `${typeof window !== 'undefined' ? window.location.origin : ''}/public/${form._id}` : '-'}</code></div>
              </div>

              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep(2)} className="px-4 py-2 rounded-xl border">← Back</button>
                <div />
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function StepButton({ children, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded-full text-sm ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
      {children}
    </button>
  );
}

function StepperItem({ index, label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3">
      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${active ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
        {index}
      </div>
      <div className={`text-sm ${active ? 'text-[var(--text)] font-medium' : 'text-slate-500'}`}>{label}</div>
    </button>
  );
}
