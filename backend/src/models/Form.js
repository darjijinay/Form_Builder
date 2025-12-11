// server/src/models/Form.js
const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // uuid or nanoid
    type: {
      type: String,
      enum: [
        'short_text',
        'long_text',
        'email',
        'number',
        'date',
        'dropdown',
        'checkbox',
        'radio',
        'file',
        'rating',
        'matrix',
        'signature',
        'image_choice',
      ],
      required: true,
    },
    label: { type: String, required: true },
    placeholder: { type: String },
    required: { type: Boolean, default: false },
    options: [{ type: String }], // for dropdown / radio / checkbox
    validation: {
      min: Number,
      max: Number,
      regex: String,
      errorMessage: String,
    },
    width: {
      type: String,
      enum: ['full', 'half'],
      default: 'full',
    },
    order: { type: Number, default: 0 },
    logic: {
      // conditional show/hide
      showWhenFieldId: String,
      operator: {
        type: String,
        enum: ['equals', 'not_equals', 'contains'],
      },
      value: String,
    },
    matrixRows: [{ type: String }], // for matrix/grid type
    matrixColumns: [{ type: String }], // for matrix/grid type
  },
  { _id: false }
);

const formSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    subtitle: String,
    date: String,
    time: String,
    location: String,
    organizerName: String,
    organizerEmail: String,
    organizerPhone: String,
    customDetails: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    fields: {
      type: [fieldSchema],
      default: [],
    },
    settings: {
      isPublic: { type: Boolean, default: true },
      notificationEmail: String,
      notifyOnSubmission: { type: Boolean, default: false },
      theme: {
        primaryColor: { type: String, default: '#6366f1' },
        accentColor: { type: String, default: '#22c55e' },
        background: { type: String, default: '#0f172a' },
      },
      allowMultipleSubmissions: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Form', formSchema);
