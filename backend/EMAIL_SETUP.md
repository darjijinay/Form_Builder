# Email Setup Guide for FormCraft

## Problem
Emails are not being sent when forms are submitted because the email credentials are not configured.

## Solution

### Step 1: Get Gmail App Password

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Enable 2-Step Verification** (if not already enabled):
   - Go to Security → 2-Step Verification
   - Follow the setup process
3. **Generate an App Password**:
   - Go to Security → 2-Step Verification → App passwords
   - Or visit directly: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or Other)
   - Click "Generate"
   - **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 2: Update .env File

Open `backend/.env` and update these lines:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

**Important Notes:**
- `EMAIL_USER`: Your full Gmail address (e.g., `johndoe@gmail.com`)
- `EMAIL_PASS`: The 16-character App Password (remove spaces, just the letters)
- Do NOT use your regular Gmail password - it won't work!

### Step 3: Restart the Server

After updating `.env`:

```bash
cd backend
npm start
```

### Step 4: Test Email Notifications

1. Open a form in the form builder
2. Go to Step 3 (Publish)
3. Check "Notify me when form is submitted"
4. Enter your email address (can be same as EMAIL_USER or different)
5. Save the form
6. Submit a test response through the public form URL
7. Check your email inbox (and spam folder!)

## Troubleshooting

### Email Still Not Received?

1. **Check Server Console**:
   - Look for: `Email sent to [email]` (success)
   - Or: `Error sending email:` (failure with details)

2. **Check Spam Folder**:
   - Gmail might mark automated emails as spam initially

3. **Verify .env Configuration**:
   - Ensure no extra spaces in EMAIL_USER or EMAIL_PASS
   - Ensure EMAIL_SERVICE is set to `gmail`
   - App Password should be 16 characters (no spaces)

4. **Test SMTP Connection**:
   Run this test in backend folder:
   ```bash
   node -e "const nodemailer = require('nodemailer'); const t = nodemailer.createTransport({service:'gmail',auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}}); t.verify((err,success)=>console.log(err||'SMTP OK'));"
   ```

5. **Check Form Settings**:
   - Open the form in builder
   - Go to Step 3
   - Ensure "Notify me when form is submitted" is checked
   - Ensure email address is entered and saved

### Using Different Email Service

If you want to use Outlook, Yahoo, or another service:

```env
# For Outlook
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password

# For Yahoo
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password

# For custom SMTP
EMAIL_SERVICE=
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
```

Note: For custom SMTP, you'll need to modify `emailService.js` to support EMAIL_HOST and EMAIL_PORT.

## Security Notes

- Never commit your `.env` file to Git (it's already in `.gitignore`)
- App Passwords are safer than using your regular password
- Each app password is unique - you can revoke it anytime from Google Account settings
- If you share the project, create a `.env.example` without real credentials

## Current Status

✅ Nodemailer installed
✅ Email service code implemented
✅ Response controller integrated
✅ Frontend UI for email settings
❌ Email credentials not configured ← **YOU ARE HERE**

Once you complete Steps 1-3 above, email notifications will work!
