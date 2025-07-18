# offline_attandence_marker
ClassTrack - Attendance Management App
Overview
ClassTrack is a modern, user-friendly web application built with React and TypeScript for managing student attendance. It allows teachers or administrators to mark attendance, view historical records, manage students and classes, and view attendance statistics. The app features a clean interface with tabs for marking attendance, viewing records, analyzing stats, and managing data, all persisted locally using localStorage.
Features

Mark Attendance: Select a date and mark students as present or absent, with real-time saving and feedback.
View Attendance: Filter attendance records by date and class, with clear present/absent indicators.
Manage Students and Classes: Add, edit, or delete students and classes, with support for roll numbers and class assignments.
Attendance Statistics: View overall attendance percentages by class and individual student performance with progress bars.
Responsive Design: Built with a mobile-friendly UI using Tailwind CSS and Shadcn/UI components.
Local Storage: Data persists across sessions using browser localStorage.

Tech Stack

Frontend: React, TypeScript, Tailwind CSS
UI Components: Shadcn/UI (Button, Card, Input, Tabs, Badge, Progress, Select)
Animation: Framer Motion
Icons: Lucide React
Storage: Browser localStorage for data persistence
Framework: [React or Next.js, depending on your project setup]

Prerequisites
To run or build the app, ensure you have:

Node.js (v16 or higher)
npm or yarn
Git (optional, for cloning the repository)
For APK conversion:
Android Studio (for manual builds with Capacitor)
JDK (version 11 or higher)
Access to an online tool like Appilix for APK conversion



Installation

Clone the Repository (if applicable):git clone <your-repository-url>
cd classtrack


Install Dependencies:npm install

Ensure package.json includes dependencies like react, lucide-react, framer-motion, and Shadcn/UI components.
Run the App Locally:npm run dev

Open http://localhost:3000 (or the port specified) in your browser.

Project Structure
classtrack/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
├── pages/
│   ├── index.tsx  # Main app component (provided code)
├── public/
├── package.json
├── README.md

Usage

Mark Attendance:
Navigate to the "Mark" tab.
Select a date and filter by class (optional).
Check boxes next to student names to mark them present.
Click "Save Attendance" to store the record.


View Attendance:
Go to the "View" tab.
Select a date and class to see who was present or absent.


View Statistics:
In the "Stats" tab, view attendance percentages by class and individual student performance.


Manage Students and Classes:
Use the "Manage" tab to add, edit, or delete students and classes.
Assign students to classes and include roll numbers.



Converting to APK
To convert ClassTrack into an Android APK, use an online tool like Appilix or a framework like Capacitor. Below are instructions for both:
Option 1: Using Appilix (Online Tool)

Build the Web App:
If using Next.js, add output: 'export' to next.config.js:module.exports = {
  output: 'export',
};


Build the static site:npm run build


Host the out folder locally (e.g., using npx serve out) to get a URL like http://localhost:3000.


Visit Appilix:
Go to appilix.com.


Enter Details:
Input your app’s URL (local or hosted).
Provide an app name (e.g., "ClassTrack") and icon (PNG, 512x512).
Customize features like splash screen or push notifications (optional).


Generate and Download APK:
Click "Create App" to generate the APK.
Download and test on an Android device or emulator:adb install path/to/classtrack.apk




Publish to Google Play (Optional):
Create a Google Play Developer account ($25 one-time fee).
Use Appilix’s dashboard to generate a signed APK/AAB for submission.



Option 2: Using Capacitor (Manual)

Install Capacitor:npm install -g @capacitor/cli
npm install @capacitor/core @capacitor/android


Initialize Capacitor:npx cap init


App Name: ClassTrack
App ID: com.example.classtrack
Web Dir: out (for Next.js) or build (for React)


Build the Web App:npm run build


Add Android Platform:npx cap add android
npx cap sync


Generate APK:
Open Android Studio:npx cap open android


Build the APK via Build > Build Bundle(s) / APK(s) > Build APK(s).
Find the APK in android/app/build/outputs/apk/debug/classtrack-debug.apk.


Test the APK:adb install android/app/build/outputs/apk/debug/classtrack-debug.apk



Notes for APK Conversion

Static Export: For Next.js, ensure output: 'export' is set in next.config.js for compatibility with Appilix or Capacitor.
Permissions: The app uses localStorage, so no special Android permissions are required. If you add features (e.g., notifications), update android/app/src/main/AndroidManifest.xml:<uses-permission android:name="android.permission.INTERNET" />


Responsive Design: The app’s Tailwind CSS ensures mobile compatibility, but test the APK to verify UI rendering.

Troubleshooting

App Not Loading in APK:
Ensure the web app is built correctly (npm run build).
Verify webDir in capacitor.config.json matches your build output (out or build).


API Issues: If your app uses external APIs, ensure they’re accessible from the APK and API keys are securely embedded.
Build Errors: Check for missing dependencies or Android SDK in Android Studio.

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
This project is licensed under the MIT License.
