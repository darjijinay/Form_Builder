import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '../../../../components/layout/AppLayout';
import AnalyticsDashboard from '../../../../components/analytics/AnalyticsDashboard';
import analyticsApi from '../../../../api/analyticsApi';
import { formApi } from '../../../../api/formApi';

export default function FormAnalytics() {
  const router = useRouter();
  const { id: formId } = router.query;
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    if (formId) {
      loadForm();
    }
  }, [formId]);

  const loadForm = async () => {
    try {
      const { data } = await formApi.getFormById(formId);
      setForm(data);
    } catch (error) {
      console.error('Error loading form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (!form) {
    return (
      <AppLayout>
        <div className="text-center py-12 text-gray-600">
          Form not found
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
          <p className="text-gray-600 mt-1">Analytics & Responses</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-4 px-1 font-medium text-sm border-b-2 transition ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('responses')}
              className={`pb-4 px-1 font-medium text-sm border-b-2 transition ${
                activeTab === 'responses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              All Responses
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'analytics' && <AnalyticsDashboard formId={formId} />}

        {activeTab === 'responses' && (
          <ResponsesList formId={formId} />
        )}
      </div>
    </AppLayout>
  );
}

// Responses list component with pagination and search
function ResponsesList({ formId }) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);

  useEffect(() => {
    loadResponses();
  }, [formId, page, search]);

  const loadResponses = async () => {
    try {
      setLoading(true);
      const { data } = await analyticsApi.getFormResponses(formId, {
        page,
        limit,
        search: search || undefined,
      });
      setResponses(data.responses);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search responses..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Responses */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading responses...</div>
        ) : responses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No responses yet</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {responses.map((response) => (
              <div key={response._id} className="p-4 hover:bg-gray-50 transition">
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(response.submittedAt).toLocaleString()}
                </div>
                <div className="space-y-1">
                  {response.answers.slice(0, 3).map((answer, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium text-gray-700">{answer.fieldId}:</span>
                      <span className="text-gray-600 ml-2 line-clamp-1">
                        {Array.isArray(answer.value) ? answer.value.join(', ') : String(answer.value)}
                      </span>
                    </div>
                  ))}
                  {response.answers.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{response.answers.length - 3} more fields
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, pages) }, (_, i) => {
            const pageNum = Math.max(1, page - 2) + i;
            if (pageNum > pages) return null;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  page === pageNum
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage(Math.min(pages, page + 1))}
            disabled={page === pages}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 mt-4">
        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} responses
      </div>
    </div>
  );
}
