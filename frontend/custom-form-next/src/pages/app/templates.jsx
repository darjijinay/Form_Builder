"use client";
import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import TemplateModal from '../../components/templates/TemplateModal';
import { useRouter } from 'next/router';
import { formApi } from "../../api/formApi";
import Link from "next/link";

const FALLBACK_TEMPLATES = [
  { 
    _id: "tpl1", 
    title: "Workshop Registration", 
    description: "Collect attendee details for your upcoming workshop or seminar.", 
    category: "Events",
    fields: [
      { _id: "f1", type: "short_text", label: "Full Name", required: true, placeholder: "Enter your full name", order: 0 },
      { _id: "f2", type: "email", label: "Email Address", required: true, placeholder: "your.email@example.com", order: 1 },
      { _id: "f3", type: "short_text", label: "Phone Number", required: false, placeholder: "+1 (555) 000-0000", order: 2 },
      { _id: "f4", type: "short_text", label: "Company/Organization", required: false, placeholder: "Your company name", order: 3 },
      { _id: "f5", type: "dropdown", label: "Dietary Requirements", required: false, options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Other"], order: 4 },
      { _id: "f6", type: "radio", label: "Preferred Session", required: true, options: ["Morning Session", "Afternoon Session"], order: 5 },
      { _id: "f7", type: "long_text", label: "Additional Comments", required: false, placeholder: "Any questions or special requirements?", order: 6 }
    ]
  },
  { 
    _id: "tpl2", 
    title: "Job Application", 
    description: "Standard job application form with resume upload section.", 
    category: "HR",
    fields: [
      { _id: "f1", type: "short_text", label: "Full Name", required: true, placeholder: "Enter your full name", order: 0 },
      { _id: "f2", type: "email", label: "Email Address", required: true, placeholder: "your.email@example.com", order: 1 },
      { _id: "f3", type: "short_text", label: "Phone Number", required: true, placeholder: "+1 (555) 000-0000", order: 2 },
      { _id: "f4", type: "short_text", label: "Position Applied For", required: true, placeholder: "e.g., Software Engineer", order: 3 },
      { _id: "f5", type: "dropdown", label: "Years of Experience", required: true, options: ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"], order: 4 },
      { _id: "f6", type: "file", label: "Upload Resume", required: true, placeholder: "PDF or DOC file", order: 5 },
      { _id: "f7", type: "long_text", label: "Cover Letter", required: false, placeholder: "Tell us why you're a great fit...", order: 6 },
      { _id: "f8", type: "date", label: "Available Start Date", required: true, order: 7 }
    ]
  },
  { 
    _id: "tpl3", 
    title: "Customer Feedback", 
    description: "Gather insights from your customers about your product.", 
    category: "Feedback",
    fields: [
      { _id: "f1", type: "short_text", label: "Name", required: false, placeholder: "Your name (optional)", order: 0 },
      { _id: "f2", type: "email", label: "Email", required: true, placeholder: "your.email@example.com", order: 1 },
      { _id: "f3", type: "short_text", label: "Product/Service Used", required: true, placeholder: "Which product did you use?", order: 2 },
      { _id: "f4", type: "radio", label: "Overall Rating", required: true, options: ["Poor", "Fair", "Good", "Very Good", "Excellent"], order: 3 },
      { _id: "f5", type: "radio", label: "Would you recommend us?", required: true, options: ["Yes", "No", "Maybe"], order: 4 },
      { _id: "f6", type: "long_text", label: "Your Feedback", required: true, placeholder: "Share your experience with us...", order: 5 },
      { _id: "f7", type: "long_text", label: "Suggestions for Improvement", required: false, placeholder: "What could we do better?", order: 6 }
    ]
  },
  { 
    _id: "tpl4", 
    title: "College Admission", 
    description: "Comprehensive form for student admission inquiries.", 
    category: "Education",
    fields: [
      { _id: "f1", type: "short_text", label: "First Name", required: true, placeholder: "Enter first name", order: 0 },
      { _id: "f2", type: "short_text", label: "Last Name", required: true, placeholder: "Enter last name", order: 1 },
      { _id: "f3", type: "email", label: "Email Address", required: true, placeholder: "student@example.com", order: 2 },
      { _id: "f4", type: "short_text", label: "Phone Number", required: true, placeholder: "+1 (555) 000-0000", order: 3 },
      { _id: "f5", type: "date", label: "Date of Birth", required: true, order: 4 },
      { _id: "f6", type: "dropdown", label: "Program of Interest", required: true, options: ["Computer Science", "Engineering", "Business Administration", "Medicine", "Arts", "Other"], order: 5 },
      { _id: "f7", type: "short_text", label: "Current GPA", required: false, placeholder: "e.g., 3.8", order: 6 },
      { _id: "f8", type: "short_text", label: "High School Name", required: true, placeholder: "Your high school", order: 7 },
      { _id: "f9", type: "long_text", label: "Personal Statement", required: true, placeholder: "Tell us about yourself and why you want to join our institution...", order: 8 }
    ]
  },
  { 
    _id: "tpl5", 
    title: "Event RSVP", 
    description: "Simple RSVP form for parties, weddings, and corporate events.", 
    category: "Events",
    fields: [
      { _id: "f1", type: "short_text", label: "Full Name", required: true, placeholder: "Enter your name", order: 0 },
      { _id: "f2", type: "email", label: "Email Address", required: true, placeholder: "your.email@example.com", order: 1 },
      { _id: "f3", type: "radio", label: "Will you attend?", required: true, options: ["Yes, I'll be there", "No, I can't make it"], order: 2 },
      { _id: "f4", type: "number", label: "Number of Guests", required: false, placeholder: "Including yourself", order: 3 },
      { _id: "f5", type: "dropdown", label: "Dietary Restrictions", required: false, options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Other"], order: 4 },
      { _id: "f6", type: "long_text", label: "Special Requests/Comments", required: false, placeholder: "Any special requirements or messages?", order: 5 }
    ]
  },
  { 
    _id: "tpl6", 
    title: "Contact Us", 
    description: "Basic contact form for your website visitors.", 
    category: "General",
    fields: [
      { _id: "f1", type: "short_text", label: "Your Name", required: true, placeholder: "Enter your name", order: 0 },
      { _id: "f2", type: "email", label: "Email Address", required: true, placeholder: "your.email@example.com", order: 1 },
      { _id: "f3", type: "short_text", label: "Subject", required: true, placeholder: "What is this regarding?", order: 2 },
      { _id: "f4", type: "long_text", label: "Message", required: true, placeholder: "Write your message here...", order: 3 },
      { _id: "f5", type: "radio", label: "Preferred Contact Method", required: false, options: ["Email", "Phone"], order: 4 },
      { _id: "f6", type: "short_text", label: "Phone Number (optional)", required: false, placeholder: "+1 (555) 000-0000", order: 5 }
    ]
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(FALLBACK_TEMPLATES);
  const [loading, setLoading] = useState(true);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [creatingFromTemplate, setCreatingFromTemplate] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Temporarily disable API call to debug
    setLoading(false);
    // formApi
    //   .getTemplates()
    //   .then((res) => {
    //     if (res.data && res.data.length > 0) {
    //       setTemplates(res.data);
    //     }
    //   })
    //   .catch(() => {
    //     // Keep FALLBACK_TEMPLATES on error
    //   })
    //   .finally(() => setLoading(false));
  }, []);

  const handleUseTemplate = async (tpl) => {
    try {
      setCreatingFromTemplate(true);
      const payload = { 
        title: tpl.title, 
        description: tpl.description, 
        fields: tpl.fields || [],
        settings: { isPublic: true }
      };
      const res = await formApi.createForm(payload);
      const id = res.data?._id;
      if (id) router.push(`/app/forms/builder/${id}`);
      else router.push('/app/forms');
    } catch (e) {
      console.error('Error creating form from template:', e);
      router.push('/app/forms/builder/new');
    } finally {
      setCreatingFromTemplate(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Templates</h1>
            <p className="text-sm sm:text-base text-slate-600">Start with a pre-built template to save time.</p>
          </div>
          <div className="flex items-center gap-3">
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
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => {
            const id = t._id || t.id;
            const isSelected = selectedTemplateId === id;
            const category = (t.category || 'General').toLowerCase();

            const colorMap = {
              events: 'bg-rose-400',
              hr: 'bg-emerald-400',
              feedback: 'bg-violet-400',
              education: 'bg-orange-400',
              general: 'bg-sky-400',
            };

            const stripeClass = colorMap[category] || 'bg-sky-400';

            return (
              <div
                key={id}
                onClick={() => setSelectedTemplateId(id)}
                className={`relative rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between h-full overflow-hidden shadow-sm hover:shadow-md ${
                  isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {/* colored top stripe */}
                <div className={`${stripeClass} h-1 w-full`} />

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs uppercase text-slate-500 font-medium">{t.category || 'General'}</div>
                      <div className="text-slate-400 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-semibold text-[var(--text)] mb-2">{t.title}</h3>
                    <p className="text-sm text-slate-600">{t.description}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleUseTemplate(t); }} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors">Use Template</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer action for selected template */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={async () => {
              if (!selectedTemplateId) return;
              const tpl = (templates.length ? templates : FALLBACK_TEMPLATES).find(t => (t._id || t.id) === selectedTemplateId);
              if (tpl) await handleUseTemplate(tpl);
            }}
            disabled={!selectedTemplateId || creatingFromTemplate}
            className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingFromTemplate ? 'Creating...' : 'Use Template'}
          </button>
        </div>
        
        <TemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onSelectTemplate={async (templateData) => {
            setCreatingFromTemplate(true);
            try {
              const newForm = {
                title: templateData.title || templateData.form?.title,
                description: templateData.description || templateData.form?.description,
                fields: templateData.fields || templateData.form?.fields || [],
                settings: { isPublic: true },
              };
              const { data } = await formApi.createForm(newForm);
              router.push(`/app/forms/builder/${data._id}`);
            } catch (err) {
              console.error('Error creating form from template:', err);
              alert('Failed to create form from template. Please try again.');
            } finally {
              setCreatingFromTemplate(false);
              setIsTemplateModalOpen(false);
            }
          }}
        />
      </div>
    </AppLayout>
  );
}
