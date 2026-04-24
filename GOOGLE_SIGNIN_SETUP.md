# Google Sign-In Setup Guide

## Overview
This guide walks you through setting up Google Sign-In for your Idea Mesh signup page.

## Features Added
✅ Google Sign-In button with professional styling
✅ Auto-fills user data: **Name** and **Email**
✅ Secure password auto-generation for Google signups
✅ Form validation with age check (13+ years old)
✅ Responsive design with smooth transitions
✅ Visual distinction between Google and manual signup

## Step-by-Step Setup

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "NEW PROJECT"
3. Enter project name: "Idea Mesh" (or your preference)
4. Click "CREATE"

### Step 2: Enable Google+ API
1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and press **ENABLE**

### Step 3: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **OAuth 2.0 Client IDs**
3. If prompted, configure the OAuth consent screen first:
   - Choose "External"
   - Fill in:
     - App name: "Idea Mesh"
     - User support email: Your email
     - Developer contact: Your email
   - Click "SAVE AND CONTINUE"
4. Under Scopes, add:
   - `email`
   - `profile`
   - `openid`
5. Continue to credentials creation

### Step 4: Create Web Application Credentials
1. Choose application type: **Web application**
2. Add Authorized JavaScript origins:
   ```
   http://localhost
   http://localhost:3000
   http://localhost:5500
   http://127.0.0.1
   https://yourdomain.com  (add your production domain later)
   ```
3. Add Authorized redirect URIs:
   ```
   http://localhost:3000
   http://localhost:5500
   https://yourdomain.com  (add your production domain later)
   ```
4. Click "CREATE"
5. Copy your **Client ID** (you'll need this!)

### Step 5: Add Client ID to Your Code
1. Open `signup.js`
2. Find this line (at the top):
   ```javascript
   const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";
   ```
3. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID from Step 4
4. Save the file

Example:
```javascript
const GOOGLE_CLIENT_ID = "123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com";
```

## How It Works

### User Sign-In Flow
1. User clicks "Sign up with Google" button
2. Google authentication popup appears
3. User selects/logs in with their Google account
4. Form auto-fills with:
   - **Full Name** (from Google profile)
   - **Email** (from Google account)
   - **Password** (auto-generated secure password)
5. User must fill in:
   - **Date of Birth** (Google doesn't provide this for privacy)
6. User clicks "Create Account"
7. Account is created and saved to localStorage

### Auto-Filled Fields
- ✅ Name - Retrieved from Google profile
- ✅ Email - Retrieved from Google account
- ✅ Password - Auto-generated (16 characters with special symbols)
- ⚠️ DOB - User must enter manually (Google privacy policy)

### Form Styling
- Auto-filled fields have **light green background** (#e8f5e9)
- Auto-generated password has **yellow background** (#fff9c4)
- Password fields are **read-only** for Google signups
- Visual cues help users understand what was auto-filled

## Features Explained

### Password Generation
For Google signups, passwords are automatically generated:
- 16 characters long
- Mix of uppercase, lowercase, numbers, and special symbols
- Read-only field (cannot be edited)
- Secure and unique for each signup

### Data Validation
- Email format validation
- Age verification (must be 13+ years old)
- Password confirmation matching
- Duplicate email detection
- All required fields check

### Local Storage
User data is saved with:
```javascript
{
  fullName: "User Name",
  email: "user@example.com",
  dob: "2000-01-15",
  password: "SecureAutoGenPassword123!@#",
  signupMethod: "google",
  createdAt: "2026-04-22T10:30:00.000Z"
}
```

## Troubleshooting

### "Client ID Error" or blank page
- Verify Client ID is correctly placed in `signup.js`
- Ensure your domain is added to Authorized JavaScript origins
- Check browser console for errors (F12 → Console tab)

### Google popup doesn't appear
- Check if pop-ups are blocked in browser
- Verify Google API is enabled in Cloud Console
- Ensure OAuth consent screen is configured

### Auto-fill not working
- Check browser console for errors
- Verify user is logged into a Google account
- Try incognito/private window to test

### "Email already registered" error
- This email might already be in localStorage
- Open Developer Tools (F12) → Application → localStorage
- Clear localStorage and try again, OR
- Use a different email address

## API Endpoints Reference

The implementation uses Google Sign-In Library (gsi):
- Script: `https://accounts.google.com/gsi/client`
- Method: JWT token-based
- Scopes: `email`, `profile`, `openid`

## Security Considerations

⚠️ **Important Notes:**
1. **Client ID is safe to expose** (it's meant to be public)
2. **JWT tokens** should not be logged in browser console in production
3. **Passwords** should be hashed before storing (implement bcrypt)
4. **HTTPS only** for production environments
5. **Refresh tokens** are not available via gsi (use server-side auth for this)

## Production Deployment

Before going live:
1. Switch to HTTPS
2. Add your production domain to Google Console credentials
3. Implement server-side password hashing (bcrypt, Argon2, etc.)
4. Set up database instead of localStorage
5. Implement session management
6. Add CSRF protection
7. Enable HTTPS/SSL certificate

## Testing Locally

To test locally:
```bash
# Using Live Server (VS Code extension)
# Open 2signup.html with Live Server

# Or using Python
python -m http.server 5500

# Or using Node.js
npx http-server
```

Then access: `http://localhost:5500`

## What Happens with Different Signup Methods

### Google Sign-In
- Auto-filled: Name, Email, Password
- Password field: Read-only
- Signup method: "google"
- User must enter DOB

### Manual Sign-In
- All fields manual entry
- Password field: Editable
- Signup method: "manual"
- All fields required

## Files Modified

1. **2signup.html**
   - Added Google Sign-In button
   - Added divider
   - Made fields optional (filled by JS)

2. **signup.css**
   - Added `.google-signin-wrapper`
   - Added `.google-signin-btn` with hover effects
   - Added `.divider` styling
   - Added `.google-icon` styling

3. **signup.js**
   - Added Google OAuth initialization
   - Added JWT token parsing
   - Added auto-fill logic
   - Added password generation
   - Enhanced form validation
   - Added age verification

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify Google Cloud Console settings
3. Ensure Client ID is correct
4. Test in incognito mode
5. Clear browser cache and localStorage

---

**Last Updated:** April 2026
**Version:** 1.0
