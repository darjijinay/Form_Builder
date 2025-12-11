import axiosClient from './axiosClient';

export const formApi = {
  getMyForms: () => axiosClient.get('/forms'),
  getForm: (id) => axiosClient.get(`/forms/${id}`),
  createForm: (data) => axiosClient.post('/forms', data),
  updateForm: (id, data) => axiosClient.put(`/forms/${id}`, data),
  deleteForm: (id) => axiosClient.delete(`/forms/${id}`),

  // templates (optional)
  getTemplates: () => axiosClient.get('/templates'),
  getTemplate: (id) => axiosClient.get(`/templates/${id}`),

  // public forms
  getPublicForm: (id) => axiosClient.get(`/forms/${id}/public`),

  // responses
  submitResponse: (formId, answers) =>
    axiosClient.post(`/responses/${formId}`, { answers }),

  getResponses: (formId) =>
    axiosClient.get(`/responses/form/${formId}`),

  exportResponsesCsv: (formId) =>
    axiosClient.get(`/responses/form/${formId}/export`, {
      responseType: 'blob',
    }),

  // analytics
  logView: (formId) => axiosClient.post(`/analytics/forms/${formId}/view`),
  getAnalyticsOverview: () => axiosClient.get('/analytics/overview'),
};
