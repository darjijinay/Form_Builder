"use client";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { formApi } from '../../api/formApi';
import TemplateModal from '../../components/templates/TemplateModal';

export default function DashboardPage() {
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [overview, setOverview] = useState(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [creatingFromTemplate, setCreatingFromTemplate] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadForms = async () => {
      try {
        setError(null);
        const [{ data: formsData }, { data: overviewData }] = await Promise.all([
          formApi.getMyForms(),
          formApi.getAnalyticsOverview().catch(() => ({ data: null })),
        ]);
        setForms(formsData || []);
        setOverview(overviewData);
      } catch (err) {
        console.error('Error loading forms:', err);
        if (err.response?.status === 429) {
          setError('You\'ve made too many requests. Please wait a moment and try again.');
        } else {
          setError('Failed to load forms. Please refresh the page.');
        }
        setForms([]);
      }
    };

    loadForms();
  }, []);

  const handleSelectTemplate = async (templateData) => {
    setCreatingFromTemplate(true);
    try {
      // Create form from template
      const newForm = {
        title: templateData.form.title,
        description: templateData.form.description,
        subtitle: '',
        date: '',
        time: '',
        location: '',
        organizerName: '',
        organizerEmail: '',
        organizerPhone: '',
        customDetails: [],
        fields: templateData.form.fields,
        settings: templateData.form.settings || { isPublic: true },
      };

      const { data } = await formApi.createForm(newForm);
      // Redirect to builder with new form id
      router.push(`/app/forms/builder/${data._id}`);
    } catch (error) {
      console.error('Error creating form from template:', error);
      alert('Failed to create form from template. Please try again.');
    } finally {
      setCreatingFromTemplate(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 animate-fadeIn">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-red-800 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-red-600 hover:text-red-700 font-medium mt-1"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            label="Total Forms" 
            value={forms.length} 
            iconBg="bg-indigo-500/10" 
            iconColor="text-indigo-400"
            hoverBorder="hover:border-indigo-200"
          />
          <StatCard 
            label="Total Responses" 
            value={overview?.totalResponses ?? 0} 
            iconBg="bg-purple-500/10" 
            iconColor="text-purple-400"
            hoverBorder="hover:border-purple-200"
          />
          <StatCard 
            label="Active Forms" 
            value={forms.filter(f => f?.settings?.isPublic).length} 
            iconBg="bg-emerald-500/10" 
            iconColor="text-emerald-400"
            hoverBorder="hover:border-emerald-200"
          />
          <StatCard 
            label="Draft Forms" 
            value={forms.filter(f => !f?.settings?.isPublic).length} 
            iconBg="bg-orange-500/10" 
            iconColor="text-orange-400"
            hoverBorder="hover:border-orange-200"
          />
        </div>

        <div className="text-[var(--text)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-semibold text-[var(--text)]">
              Recent Forms
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                disabled={creatingFromTemplate}
                className="text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {creatingFromTemplate ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    From Template
                  </>
                )}
              </button>
              <Link
                href="/app/forms"
                className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          {forms.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">No forms yet</h3>
              <p className="text-sm text-slate-600 mb-6">
                Create your first form to get started
              </p>
              <Link
                href="/app/forms/builder/new"
                className="btn-primary btn-accent inline-flex"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Form
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {forms.slice(0, 6).map((f) => {
                const categoryMap = {
                  'Workshop Registration': 'Events',
                  'Job Application': 'HR',
                  'Customer Feedback': 'Feedback',
                  'College Admission': 'Education',
                  'Event RSVP': 'Events',
                  'Contact Us': 'General',
                };
                const category = categoryMap[f.title] || 'OTHER';
                const perFormStats = overview?.perForm || [];
                const stat = perFormStats.find((s) => s.id === f._id);
                const respCount = stat?.responses || 0;
                return (
                  <div
                    key={f._id}
                    className="p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-xs uppercase text-slate-500 font-medium">{category}</div>
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 flex items-center justify-center border border-slate-200">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mb-4 flex-1">
                      <h3 className="font-semibold text-[var(--text)] mb-1 group-hover:text-indigo-500 transition-colors">{f.title}</h3>
                      <p className="text-sm text-slate-600">{f.description || 'Add a description to your form'}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-4 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        </svg>
                        {respCount} responses
                      </div>
                      <div>{new Date(f.updatedAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/app/forms/responses/${f._id}`}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-all text-center"
                      >
                        Results
                      </Link>
                      <Link
                        href={`/app/forms/builder/${f._id}`}
                        className="flex-1 px-3 py-2 rounded-xl bg-indigo-500/10 text-indigo-600 border border-indigo-200 text-sm font-medium hover:bg-indigo-500/20 transition-all text-center"
                      >
                        Edit Form
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </AppLayout>
  );
}

function StatCard({ label, value, iconBg, iconColor, hoverBorder }) {
  return (
    <div className={`bg-white shadow-sm border border-slate-200 p-6 ${hoverBorder} transition-all duration-300 group text-[var(--text)]`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-slate-600 uppercase tracking-wider">
          {label}
        </div>
        <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center group-hover:opacity-80 transition-colors`}>
          {label === "Total Forms" && (
            <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          {label === "Active Forms" && (
            <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {label === "This Month" && (
            <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )}
        </div>
      </div>
      <div className="text-4xl font-bold text-[var(--text)]">{value}</div>
    </div>
  );
}
