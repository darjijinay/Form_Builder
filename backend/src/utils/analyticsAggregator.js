// Analytics data aggregation utility
const aggregateResponses = (form, responses) => {
  const fieldMap = {}; // fieldId -> field metadata
  const fieldAnalytics = {}; // fieldId -> analytics data

  // Build field map for quick lookup
  form.fields.forEach((field) => {
    fieldMap[field._id] = field;
    fieldAnalytics[field._id] = {
      fieldId: field._id,
      label: field.label,
      type: field.type,
      totalResponses: 0,
      uniqueValues: new Set(),
      values: [], // all values for this field
      counts: {}, // value -> count (for single/multiple choice)
    };
  });

  // Process each response
  responses.forEach((response) => {
    response.answers.forEach((answer) => {
      const analytics = fieldAnalytics[answer.fieldId];
      if (!analytics) return;

      analytics.totalResponses++;
      const value = answer.value;

      // Handle different field types
      if (analytics.type === 'radio' || analytics.type === 'dropdown' || analytics.type === 'checkbox') {
        // For single/multiple choice, track counts
        if (Array.isArray(value)) {
          value.forEach((v) => {
            analytics.counts[v] = (analytics.counts[v] || 0) + 1;
            analytics.uniqueValues.add(v);
          });
        } else {
          analytics.counts[value] = (analytics.counts[value] || 0) + 1;
          analytics.uniqueValues.add(value);
        }
      } else {
        // For text/numeric fields
        analytics.uniqueValues.add(value);
        analytics.values.push(value);
      }
    });
  });

  // Convert to response-friendly format
  const result = {};
  Object.keys(fieldAnalytics).forEach((fieldId) => {
    const analytics = fieldAnalytics[fieldId];
    const field = fieldMap[fieldId];

    result[fieldId] = {
      fieldId: analytics.fieldId,
      label: analytics.label,
      type: analytics.type,
      totalResponses: analytics.totalResponses,
      completionRate: responses.length > 0 ? (analytics.totalResponses / responses.length) * 100 : 0,
    };

    // Build chart data based on field type
    if (
      field.type === 'radio' ||
      field.type === 'dropdown' ||
      field.type === 'checkbox'
    ) {
      // Pie/Bar chart data for choices
      result[fieldId].chartData = {
        type: 'pie',
        labels: Object.keys(analytics.counts),
        data: Object.values(analytics.counts),
        options: field.options || [],
      };
    } else if (field.type === 'rating') {
      // Rating distribution
      result[fieldId].chartData = {
        type: 'bar',
        labels: field.options || ['1', '2', '3', '4', '5'],
        data: (field.options || ['1', '2', '3', '4', '5']).map(
          (opt) => analytics.counts[opt] || 0
        ),
      };
    } else if (field.type === 'number') {
      // Statistics for numeric fields
      const numbers = analytics.values.map((v) => parseFloat(v)).filter((v) => !isNaN(v));
      if (numbers.length > 0) {
        result[fieldId].stats = {
          min: Math.min(...numbers),
          max: Math.max(...numbers),
          avg: (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2),
          total: numbers.reduce((a, b) => a + b, 0),
        };
      }
    } else {
      // Text fields - show unique count
      result[fieldId].uniqueCount = analytics.uniqueValues.size;
    }
  });

  return result;
};

// Calculate submission timeline (grouped by date)
const getSubmissionTimeline = (responses, groupBy = 'daily') => {
  const timeline = {};

  responses.forEach((response) => {
    const date = new Date(response.submittedAt);
    let key;

    if (groupBy === 'daily') {
      key = date.toISOString().split('T')[0]; // YYYY-MM-DD
    } else if (groupBy === 'weekly') {
      const weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      key = weekStart.toISOString().split('T')[0];
    } else if (groupBy === 'monthly') {
      key = date.toISOString().substring(0, 7); // YYYY-MM
    }

    timeline[key] = (timeline[key] || 0) + 1;
  });

  // Sort by date
  const sorted = Object.entries(timeline)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, count]) => ({ date, submissions: count }));

  return sorted;
};

// Calculate overall form statistics
const getFormStats = (form, responses, views = []) => {
  const completionRate =
    views.length > 0 ? ((responses.length / views.length) * 100).toFixed(2) : 0;

  const totalViews = views.length || 0;
  const totalResponses = responses.length;
  const avgCompletionTime = calculateAvgCompletionTime(responses);

  return {
    totalViews,
    totalResponses,
    completionRate,
    avgCompletionTime,
    respondentsToday: countResponsesInRange(responses, 1),
    respondentsThisWeek: countResponsesInRange(responses, 7),
    respondentsThisMonth: countResponsesInRange(responses, 30),
  };
};

// Helper: count responses in past N days
const countResponsesInRange = (responses, days) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return responses.filter((r) => new Date(r.submittedAt) > cutoff).length;
};

// Helper: calculate average time to completion
const calculateAvgCompletionTime = (responses) => {
  if (responses.length === 0) return 0;
  // This is a placeholder - would need timestamps for when form was opened
  return null; // TODO: implement if form start time is tracked
};

module.exports = {
  aggregateResponses,
  getSubmissionTimeline,
  getFormStats,
};
