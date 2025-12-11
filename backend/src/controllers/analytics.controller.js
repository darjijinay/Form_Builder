// server/src/controllers/analytics.controller.js
const Form = require('../models/Form');
const Response = require('../models/Response');
const View = require('../models/View');
const mongoose = require('mongoose');

// record a view event for a form
exports.recordView = async (req, res, next) => {
  try {
    const { formId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({ message: 'Invalid form id' });
    }

    await View.create({
      form: formId,
      meta: {
        ip: req.ip,
        userAgent: req.get('user-agent') || '',
      },
    });

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
};

// overview across all forms for the current user
exports.getOverview = async (req, res, next) => {
  try {
    const forms = await Form.find({ user: req.user._id }).select('_id settings title').lean();
    const formIds = forms.map((f) => f._id);

    // total responses and per-form counts
    const responsesAgg = await Response.aggregate([
      { $match: { form: { $in: formIds } } },
      { $group: { _id: '$form', count: { $sum: 1 } } },
    ]);
    const responseMap = Object.fromEntries(responsesAgg.map((r) => [r._id.toString(), r.count]));
    const totalResponses = responsesAgg.reduce((acc, r) => acc + r.count, 0);

    // total views
    const viewsAgg = await View.aggregate([
      { $match: { form: { $in: formIds } } },
      { $group: { _id: '$form', count: { $sum: 1 } } },
    ]);
    const totalViews = viewsAgg.reduce((acc, v) => acc + v.count, 0);

    // daily timeseries last 30 days
    const today = new Date();
    const startDay = new Date(today);
    startDay.setDate(startDay.getDate() - 29);

    const dailyViews = await View.aggregate([
      { $match: { form: { $in: formIds }, createdAt: { $gte: startDay } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);
    const dailyResponses = await Response.aggregate([
      { $match: { form: { $in: formIds }, createdAt: { $gte: startDay } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);

    const fillDaily = (records) => {
      const map = Object.fromEntries(records.map((r) => [r._id, r.count]));
      const result = [];
      for (let i = 0; i < 30; i++) {
        const d = new Date(startDay);
        d.setDate(startDay.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        result.push({ date: key, count: map[key] || 0 });
      }
      return result;
    };

    const dailyViewSeries = fillDaily(dailyViews);
    const dailyResponseSeries = fillDaily(dailyResponses);

    // monthly timeseries last 6 months
    const startMonth = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    const monthlyViews = await View.aggregate([
      { $match: { form: { $in: formIds }, createdAt: { $gte: startMonth } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);
    const monthlyResponses = await Response.aggregate([
      { $match: { form: { $in: formIds }, createdAt: { $gte: startMonth } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);

    const fillMonthly = (records) => {
      const map = Object.fromEntries(records.map((r) => [r._id, r.count]));
      const result = [];
      for (let i = 0; i < 6; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        result.push({ month: key, count: map[key] || 0 });
      }
      return result;
    };

    const monthlyViewSeries = fillMonthly(monthlyViews);
    const monthlyResponseSeries = fillMonthly(monthlyResponses);

    // per-form summary
    const perForm = forms.map((f) => {
      const responses = responseMap[f._id.toString()] || 0;
      const viewsCount = (viewsAgg.find((v) => v._id.toString() === f._id.toString())?.count) || 0;
      const conversion = viewsCount > 0 ? Math.round((responses / viewsCount) * 100) : 0;
      return {
        id: f._id,
        name: f.title || 'Untitled',
        responses,
        views: viewsCount,
        status: f?.settings?.isPublic ? 'Active' : 'Draft',
        conversion,
      };
    });

    res.json({
      totalForms: forms.length,
      activeForms: forms.filter((f) => f?.settings?.isPublic).length,
      totalResponses,
      totalViews,
      dailyViewSeries,
      dailyResponseSeries,
      monthlyViewSeries,
      monthlyResponseSeries,
      perForm,
    });
  } catch (err) {
    next(err);
  }
};
