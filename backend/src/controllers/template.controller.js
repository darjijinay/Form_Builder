// server/src/controllers/template.controller.js
const { nanoid } = require('nanoid');

const templates = [
  {
    id: 'workshop-registration',
    name: 'Workshop Registration',
    description: 'Collect participant details for a workshop/event',
    form: {
      title: 'Workshop Registration Form',
      description: 'Please fill in your details to register.',
      fields: [
        {
          _id: nanoid(),
          type: 'short_text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
        },
        {
          _id: nanoid(),
          type: 'email',
          label: 'Email Address',
          placeholder: 'you@example.com',
          required: true,
        },
        {
          _id: nanoid(),
          type: 'short_text',
          label: 'College / Organization',
          placeholder: 'Your college/organization',
          required: false,
        },
        {
          _id: nanoid(),
          type: 'dropdown',
          label: 'Session Slot',
          options: ['Morning', 'Afternoon', 'Full day'],
          required: true,
        },
      ],
      settings: {
        isPublic: true,
      },
    },
  },
];

exports.getTemplates = (req, res) => {
  res.json(
    templates.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
    }))
  );
};

exports.getTemplateById = (req, res) => {
  const tpl = templates.find((t) => t.id === req.params.id);
  if (!tpl) return res.status(404).json({ message: 'Template not found' });
  res.json(tpl);
};
