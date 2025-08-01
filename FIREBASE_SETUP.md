# Firebase Setup Instructions for BZA RUET Alumni Registration

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `bza-ruet-alumni`
4. Enable Google Analytics (optional)
5. Select your Google Analytics account
6. Click "Create project"

## Step 2: Configure Firestore Database

1. In the Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users (e.g., asia-south1 for Bangladesh)
5. Click "Done"

## Step 3: Configure Firebase Storage (OPTIONAL - Skip if using free tier)

**Note: Firebase Storage requires a paid plan (Blaze). For free tier users, skip this step.**

If you want to use Firebase Storage for image uploads:

1. Go to "Storage" in the Firebase console
2. Click "Get started"
3. Choose "Start in test mode"
4. Select a location for your storage bucket
5. Click "Done"

**Alternative: The system will work without Storage by storing images as Base64 in Firestore (free tier compatible).**

## Step 4: Get Firebase Configuration

1. Go to "Project Settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Enter app nickname: "BZA RUET Website"
5. Check "Set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the firebaseConfig object

## Step 5: Configure Environment Variables

1. Create a `.env` file in your project root:

```bash
cp .env.example .env
```

2. Replace the values in `.env` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
# Storage bucket not required for free tier
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Note: If you're using the free tier without Firebase Storage, you can leave the storage bucket as is - it won't be used.**

## Step 6: Update Firestore Security Rules (Optional)

For production, update your Firestore rules in the Firebase console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Alumni collection - allow read/write for authenticated users
    match /alumni/{document} {
      allow read, write: if true; // Adjust based on your auth requirements
    }
  }
}
```

## Step 7: Firebase Storage Rules (Optional)

For production, update your Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /alumni-photos/{allPaths=**} {
      allow read, write: if true; // Adjust based on your auth requirements
    }
  }
}
```

## ✅ Your Firebase Configuration is Ready!

Your Firebase project `bza-ruet-alumni-477a6` is configured and ready to use.

The `.env` file has been created with your Firebase configuration:

- **Project ID**: `bza-ruet-alumni-477a6`
- **Auth Domain**: `bza-ruet-alumni-477a6.firebaseapp.com`
- **Analytics**: Enabled with measurement ID `G-LWZR566SGE`

## Step 8: Test the Setup

1. Start your development server:

```bash
npm run dev
```

2. Navigate to `/alumni/register` and submit a test registration
3. Check the Firebase console to see if data is saved in Firestore
4. Navigate to `/admin` to view the admin dashboard

## Features Included

### Alumni Registration System

- ✅ Complete registration form with validation
- ✅ Profile image storage (Base64 in Firestore - free tier compatible)
- ✅ Data storage in Firestore with timestamps
- ✅ Status tracking (pending, approved, rejected)
- ✅ Works with Firebase free tier (Spark plan)

### Admin Dashboard

- ✅ View all alumni registrations
- ✅ Filter by status (all, pending, approved, rejected)
- ✅ Search by name, email, or department
- ✅ Approve/reject registrations
- ✅ Delete registrations
- ✅ Statistics overview
- ✅ Responsive design

### Data Structure

Each alumni registration includes:

- Personal information (name, email, phone, location)
- Academic details (department, batch, graduation year, student ID)
- Professional information (current position, company, work location)
- Social links (LinkedIn, GitHub, Twitter, website)
- Profile image URL
- Registration status and timestamps

## Routes

- `/alumni/register` - Alumni registration form
- `/admin` - Admin dashboard for managing registrations

## Security Considerations

For production deployment:

1. Implement proper authentication for admin routes
2. Set up proper Firestore security rules
3. Configure CORS settings
4. Use Firebase Authentication for user management
5. Implement rate limiting for form submissions

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify your Firebase configuration
3. Ensure all environment variables are set correctly
4. Check Firebase console for any configuration issues
