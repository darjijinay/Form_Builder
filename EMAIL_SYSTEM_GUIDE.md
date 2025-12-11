# FormCraft Email System - Complete Guide

## Overview
The email notification system in FormCraft automatically sends an email to the form creator whenever someone submits a form response. This is configured during the form creation process.

---

## System Architecture

### 1. Frontend (Form Builder) - Step 3: Preview & Publish

**Location:** `frontend/custom-form-next/src/pages/app/forms/builder/[id].jsx`

**User Interface:**
- **Checkbox:** "Notify me when form is submitted"
- **Email Field:** Text input for notification recipient email (e.g., `your@email.com`)
- **Message:** "You'll receive an email each time someone submits the form."

**What Gets Saved:**
```javascript
form.settings = {
  notifyOnSubmission: boolean,      // Toggle - enable/disable emails
  notificationEmail: string,         // Email address to receive notifications
}
```

**User Flow:**
1. Form creator opens form builder
2. Goes to Step 3 (Preview & Publish)
3. Checks "Notify me when form is submitted"
4. Enters their email address (e.g., darji@gmail.com)
5. Clicks Save/Publish
6. Settings are stored in MongoDB

---

### 2. Backend Data Model

**Location:** `backend/src/models/Form.js`

```javascript
settings: {
  isPublic: Boolean,              // Form is public
  notificationEmail: String,      // Who to notify
  notifyOnSubmission: Boolean,    // Enable/disable emails
  theme: { ... },
  allowMultipleSubmissions: Boolean,
}
```

---

### 3. Email Service

**Location:** `backend/src/services/emailService.js`

**Function:** `sendResponseNotification(notificationEmail, form, answers)`

**Process:**
1. **Checks Prerequisites:**
   - Validates `notificationEmail` exists
   - Validates `EMAIL_USER` credentials are configured
   - If either missing, logs "Email notification skipped" and returns

2. **Builds Email Content:**
   - Creates field-to-label mapping from form
   - Converts response answers to readable format
   - Generates HTML email table with:
     - Field name | Response value rows
     - Professional styling
     - FormCraft branding footer

3. **Email Structure:**
   ```
   From: process.env.EMAIL_USER
   To: notificationEmail (form creator's email)
   Subject: "New Response: {Form Title}"
   Body: HTML with response table
   ```

4. **Error Handling:**
   - Catches any errors during email sending
   - Logs error but does NOT block form submission
   - Non-blocking: form submission succeeds even if email fails

---

### 4. Response Submission Trigger

**Location:** `backend/src/controllers/response.controller.js`

**Function:** `submitResponse()`

**Trigger Logic:**
```javascript
if (form.settings?.notifyOnSubmission && form.settings?.notificationEmail) {
  sendResponseNotification(
    form.settings.notificationEmail,
    form,
    sanitizedAnswers
  ).catch((err) => {
    console.error('Failed to send notification email:', err);
  });
}
```

**When This Runs:**
- User submits form on public form page
- Response is saved to database
- Email is sent asynchronously (non-blocking)
- User sees success message regardless of email status

---

## Email Service Configuration

### Required Environment Variables

Add these to your `.env` file:

```env
# Gmail Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Supported Email Services

Node.js Nodemailer supports:
- Gmail
- Outlook
- Yahoo
- AWS SES
- Custom SMTP servers

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on Gmail account
2. **Create App Password:**
   - Go to myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Generate password (16 characters)
3. **Use in .env:**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```

### Custom SMTP Server

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.your-server.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

---

## Email Template

The HTML email includes:
- **Header:** Form title + "New Response" heading
- **Body:** Professional table with field names and responses
- **Footer:** "Automated notification from FormCraft"
- **Styling:** Professional borders, padding, colors

### Example Email Output:

```
Subject: New Response: Job Application

---

Job Application - New Response

A new response has been submitted to your form.

┌─────────────────────────┬──────────────────────┐
│ Field                   │ Response             │
├─────────────────────────┼──────────────────────┤
│ Full Name               │ John Doe             │
│ Email Address           │ john@example.com     │
│ Phone Number            │ +1 (555) 123-4567   │
│ Position Applied For    │ Senior Developer     │
│ Years of Experience     │ 5                    │
│ Cover Letter            │ I'm excited about... │
└─────────────────────────┴──────────────────────┘

This is an automated notification from FormCraft.
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Form Builder)                  │
│  User enables email notifications + enters their email      │
│           form.settings.notificationEmail = "x@y.com"       │
└────────────────────┬────────────────────────────────────────┘
                     │ Save Form
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (MongoDB)                         │
│  Form stored with settings:                                 │
│  {                                                          │
│    notifyOnSubmission: true,                               │
│    notificationEmail: "x@y.com"                            │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
                     │
                     │ User submits public form
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            RESPONSE SUBMISSION (/submitResponse)            │
│  1. Save response to database                              │
│  2. Check: notifyOnSubmission && notificationEmail exist?  │
│  3. IF YES → Call sendResponseNotification()               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            EMAIL SERVICE (Nodemailer)                       │
│  1. Build HTML email with response data                    │
│  2. Connect to SMTP (Gmail / Custom)                       │
│  3. Send email                                             │
│  4. Log success/error (never block form submission)        │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│        FORM CREATOR'S EMAIL INBOX                          │
│  Receives: "New Response: Job Application"                │
│  Contains: All submitted data in a table                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

✅ **Optional:** Form creators choose whether to enable notifications
✅ **Flexible:** Each form can have different notification email
✅ **Safe:** Errors don't block form submission
✅ **Professional:** HTML-formatted emails with clear data display
✅ **Scalable:** Non-blocking async email sending
✅ **Configurable:** Supports multiple email providers
✅ **Logged:** Email sending logged to console for debugging

---

## Troubleshooting

### "Email notification skipped: no recipient or credentials"
- **Cause:** Missing `EMAIL_USER` or `notificationEmail`
- **Fix:** Set environment variables in `.env`

### Email not sending despite credentials configured
- **Check:** Is Gmail 2FA enabled? Use App Password, not account password
- **Check:** Is `.env` file loaded? Restart server after changes
- **Check:** Are EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS all set?

### Email sent but with missing data
- **Cause:** Response answers not properly mapped to fields
- **Check:** Ensure all field._id values in form match answer.fieldId values

### Want to test email sending?
```javascript
// In emailService.js, add temporary test:
exports.testEmail = async () => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: 'test@example.com',
    subject: 'Test Email',
    html: '<p>This is a test</p>'
  });
};
```

---

## Future Enhancements

💡 **Email Templates:** Allow custom HTML templates per form
💡 **Conditional Emails:** Send different emails based on responses
💡 **Email Digest:** Batch multiple responses into one email
💡 **File Attachments:** Attach uploaded files to email
💡 **Reply-To:** Set reply-to address for responses
💡 **Email History:** Show sent emails in form analytics
