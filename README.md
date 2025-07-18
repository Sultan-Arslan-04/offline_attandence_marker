# ClassTrack - Attendance Management App

## Overview
ClassTrack is a modern, user-friendly web application built with React and TypeScript for managing student attendance. It allows teachers or administrators to mark attendance, view historical records, manage students and classes, and view attendance statistics. The app features a clean interface with tabs for marking attendance, viewing records, analyzing stats, and managing data, all persisted locally using `localStorage`.

## Features
- **Mark Attendance**: Select a date and mark students as present or absent, with real-time saving and feedback.
- **View Attendance**: Filter attendance records by date and class, with clear present/absent indicators.
- **Manage Students and Classes**: Add, edit, or delete students and classes, with support for roll numbers and class assignments.
- **Attendance Statistics**: View overall attendance percentages by class and individual student performance with progress bars.
- **Responsive Design**: Built with a mobile-friendly UI using Tailwind CSS and Shadcn/UI components.
- **Local Storage**: Data persists across sessions using browser `localStorage`.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI (Button, Card, Input, Tabs, Badge, Progress, Select)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Storage**: Browser `localStorage` for data persistence
- **Framework**: [React or Next.js, depending on your project setup]

## Prerequisites
To run or build the app, ensure you have:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git** (optional, for cloning the repository)
- For APK conversion:
  - **Android Studio** (for manual builds with Capacitor)
  - **JDK** (version 11 or higher)
  - Access to an online tool like [Appilix](https://appilix.com) for APK conversion

## Installation
1. **Clone the Repository** (if applicable):
   ```bash
   git clone <your-repository-url>
   cd classtrack
