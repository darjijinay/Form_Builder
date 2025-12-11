# Per-User Email Notification System

## Overview

Each form creator receives email notifications at **their own email address** when someone submits their form. Different users get notifications at different email addresses.

## How It Works

### 1. User Registration & Login
- User registers with email: `vrajparekh231@gmail.com`
- User logs in - their email is stored in the React auth store
- The form builder can now access `user.email`

### 2. Form Builder - Step 3 (Publish)
When user opens the form builder's Step 3:

**Before Changes:**
- User had to manually enter their email address every time
- Easy to forget or enter wrong email
- No default value shown

**After Changes:**
- Checkbox: "Notify me when form is submitted" (unchecked by default)
- When user checks the box:
  - Email field auto-fills with their email: `vrajparekh231@gmail.com`
  - Text shows: "Default: vrajparekh231@gmail.com"
- User can:
  - Keep the default (their email)
  - Change it to a different email (e.g., `team@company.com`)
  - Leave it blank and manually type later

### 3. Form Submission Flow
When someone submits the form:

```
Public Form Submission
↓
Backend receives response
↓
Checks form settings:
  - Is notifyOnSubmission = true? ✓
  - Does notificationEmail exist? ✓
↓
Sends email to: vrajparekh231@gmail.com (the form creator's email)
↓
Form creator receives notification with:
  - Form title
  - All submitted field values
  - Timestamp
```

### 4. Different Users, Different Emails

**User 1: vrajparekh231@gmail.com**
- Creates Form A
- Enables notifications → notificationEmail = `vrajparekh231@gmail.com`
- Receives all Form A submissions at: `vrajparekh231@gmail.com`

**User 2: alice@example.com**
- Creates Form B
- Enables notifications → notificationEmail = `alice@example.com`
- Receives all Form B submissions at: `alice@example.com`

**User 3: bob@company.org**
- Creates Form C
- Enables notifications → notificationEmail = `bob@company.org` (auto-filled)
- But changes it to `team@company.org` → notificationEmail = `team@company.org`
- Receives all Form C submissions at: `team@company.org`

## Technical Details

### Frontend Changes
File: `src/pages/app/forms/builder/[id].jsx`

```javascript
// Import auth store to access current user
import { useAuthStore } from '../../../../store/authStore';

// Inside component
const user = useAuthStore((state) => state.user);

// When checkbox is toggled
onChange={(e) => {
  if (e.target.checked && !form.settings?.notificationEmail && user?.email) {
    // Auto-fill with user's email
    setForm({...form, settings: {...form.settings, 
      notifyOnSubmission: true, 
      notificationEmail: user.email
    }});
  }
}}

// Show default email
placeholder={user?.email || "your@email.com"}

// Display note
{user?.email && <p>Default: {user.email}</p>}
```

### Backend (No Changes Needed)
Backend already:
- Stores `settings.notificationEmail` in Form model
- Checks `form.settings?.notifyOnSubmission && form.settings?.notificationEmail`
- Sends email to whatever address is in `notificationEmail`

### Email Service
File: `src/services/emailService.js`

The email service sends to whatever email is configured:
```javascript
await transporter.sendMail({
  from: process.env.EMAIL_USER, // Gmail account (darjijinay08@gmail.com)
  to: notificationEmail,         // Form creator's email (dynamic)
  subject: `New Response: ${form.title}`,
  html: htmlContent
});
```

## Step-by-Step User Flow

### Scenario: vrajparekh231@gmail.com creates a form

1. **Login**
   ```
   Email: vrajparekh231@gmail.com
   Password: ***
   ↓ Success - user.email = "vrajparekh231@gmail.com"
   ```

2. **Form Builder - Step 1 & 2**
   ```
   Create form fields
   Design form layout
   ↓ Next
   ```

3. **Form Builder - Step 3 (Publish)**
   ```
   [□] Notify me when form is submitted
   ↓ User clicks checkbox ↓
   [✓] Notify me when form is submitted
   Send notifications to: vrajparekh231@gmail.com
   ↓ Auto-filled!
   ```

4. **Save & Publish**
   ```
   Form saved with:
   - settings.notifyOnSubmission = true
   - settings.notificationEmail = "vrajparekh231@gmail.com"
   ```

5. **Form Submission**
   ```
   Visitor submits form
   ↓
   Server checks settings
   ↓
   Sends email to: vrajparekh231@gmail.com
   ↓
   Email received: "New Response: [Form Title]"
   With all field values
   ```

## Testing

### Test Case 1: User gets notification at their email
1. Login as: `vrajparekh231@gmail.com`
2. Create new form with fields
3. Step 3: Enable notifications (auto-fills with `vrajparekh231@gmail.com`)
4. Publish form
5. Get the public link
6. Submit form as guest
7. Check `vrajparekh231@gmail.com` inbox → **Email should arrive**

### Test Case 2: User can change notification email
1. Login as: `user1@example.com`
2. Create form
3. Step 3: Enable notifications
4. Change email to: `different@example.com`
5. Publish
6. Submit response
7. Check `different@example.com` → **Email should arrive**

### Test Case 3: Different users get different emails
1. **User A** (`alice@example.com`):
   - Creates Form A
   - Notifications → `alice@example.com`
   - Receives responses at `alice@example.com`

2. **User B** (`bob@example.com`):
   - Creates Form B
   - Notifications → `bob@example.com`
   - Receives responses at `bob@example.com`

3. Submit both forms → Both users receive at their respective emails

## Troubleshooting

### Problem: Email auto-fill not showing
**Cause:** User not logged in or user object missing email
**Solution:**
- Check that user is properly logged in
- Verify user.email is in auth store
- Check browser console for errors

### Problem: Email going to wrong address
**Cause:** User changed the email but didn't save form
**Solution:**
- Make sure to save the form after changing email
- Check Step 3 email field value before publishing

### Problem: Notifications not sending at all
**Cause:** Several possibilities
**Solutions:**
1. Check "Notify me when form is submitted" is checked ✓
2. Verify email address is entered
3. Check `.env` file has EMAIL_USER and EMAIL_PASS
4. Check backend logs for error messages
5. Check spam folder in email

## Benefits

✅ Each user gets notifications at their own email
✅ No need to manually type email every time
✅ Can override default if needed
✅ Clear indication of which email will receive notifications
✅ Supports team emails (multiple users can share one notification email)

## Future Enhancements

- [ ] Multiple notification emails per form (notify multiple people)
- [ ] Email routing rules (notify different people for different field values)
- [ ] Digest emails (collect responses and send once per day)
- [ ] Response filtering (only notify for certain field values)
- [ ] Email templates customization
- [ ] Webhook notifications as alternative to email
