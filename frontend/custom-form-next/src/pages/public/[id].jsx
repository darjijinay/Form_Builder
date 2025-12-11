"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { formApi } from '../../api/formApi';
import FormRenderer from '../../components/forms/FormRenderer';

export default function PublicFormPage(){
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false); // controls landing page vs form

  useEffect(()=>{
    if(!id) return;
    setLoading(true);
    formApi.getPublicForm(id).then(res=>setForm(res.data)).catch(()=>{}).finally(()=>setLoading(false));
    // record view once per mount
    formApi.logView(id).catch(()=>{});
  },[id]);

  const handleSubmit = (payload) => {
    formApi.submitResponse(id, payload).then(()=> setSubmitted(true)).catch(()=>{});
  };

  if(loading) return <div className="p-6">Loading...</div>;
  if(!form) return <div className="p-6">Form not found</div>;

  // Landing page view (event details)
  if(!showForm && !submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-4 sm:px-8 py-8 sm:py-12 text-white">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">{form.title}</h1>
            {form.subtitle && <p className="text-base sm:text-lg opacity-90">{form.subtitle}</p>}
          </div>

          {/* Content */}
          <div className="px-4 sm:px-8 py-6 sm:py-8">
            {form.description && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">About This Event</h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap">{form.description}</p>
              </div>
            )}

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {form.date && (
                <div className="bg-slate-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600">Date</p>
                  <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">{form.date}</p>
                </div>
              )}
              {form.time && (
                <div className="bg-slate-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600">Time</p>
                  <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">{form.time}</p>
                </div>
              )}
              {form.location && (
                <div className="bg-slate-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600">Location / Mode</p>
                  <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">{form.location}</p>
                </div>
              )}
              {form.organizerName && (
                <div className="bg-slate-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600">Organizer</p>
                  <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">{form.organizerName}</p>
                </div>
              )}
            </div>

            {/* Custom Details */}
            {form.customDetails && form.customDetails.length > 0 && (
              <div className="mb-8 border-t pt-6">
                <h3 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">Additional Information</h3>
                <div className="space-y-3">
                  {form.customDetails.map((detail, idx) => (
                    <div key={idx} className="flex justify-between border-b pb-3 last:border-b-0">
                      <span className="font-semibold text-slate-900">{detail.label}</span>
                      <span className="text-slate-700">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            {(form.organizerEmail || form.organizerPhone) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Questions?</span> Contact: 
                  {form.organizerEmail && <a href={`mailto:${form.organizerEmail}`} className="underline font-semibold ml-1">{form.organizerEmail}</a>}
                  {form.organizerPhone && <span className="ml-2">{form.organizerPhone}</span>}
                </p>
              </div>
            )}

            {/* Register Button */}
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg transition-colors"
            >
              Register / Participate
            </button>
            <p className="text-center text-sm text-slate-600 mt-4">
              Fill out the form below to register for this event.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Form submission view
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        {submitted ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
            <p className="text-slate-600 mb-6">Your registration has been submitted successfully.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
            >
              Back Home
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <button
              onClick={() => setShowForm(false)}
              className="mb-4 text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
            >
              ← Back to Event Details
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{form.title} - Registration Form</h2>
            <FormRenderer form={form} onSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </main>
  );
}
