"use client";
import AppLayout from '../../../../../components/layout/AppLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { formApi as responsesApi } from '../../../../../api/formApi';

export default function ResponseDetailPage(){
  const router = useRouter();
  const { formId, id } = router.query; // id is response id
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(!formId || !id) return;
    setLoading(true);
    // fetch all responses for the form and find the one with matching id
    responsesApi
      .getResponses(formId)
      .then(res => {
        const data = res.data;
        // backend may return { form, responses } or an array; handle both
        const responses = Array.isArray(data) ? data : (data?.responses || []);
        const found = responses.find(r => String(r._id) === String(id));
        setResponse(found || null);
      })
      .catch((e)=>{
        console.error('Error loading response detail', e);
        setResponse(null);
      })
      .finally(()=>setLoading(false));
  },[formId, id]);

  return (
    <AppLayout>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Response Details</h2>
        {loading ? (
          <div>Loading...</div>
        ) : !response ? (
          <div className="text-sm text-slate-600">Response not found.</div>
        ) : (
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-600 mb-2">Submitted</div>
            <div className="text-sm text-slate-700 mb-4">
              {new Date(response.createdAt).toLocaleString()}
            </div>
            <div className="space-y-3">
              {response.answers?.map((a) => (
                <div key={a.fieldId}>
                  <div className="text-xs text-slate-500">{a.fieldId}</div>
                  <div className="text-sm text-[var(--text)]">{typeof a.value === 'object' ? JSON.stringify(a.value) : String(a.value)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
