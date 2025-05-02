# MeetupApp formosa

The goal of this project is to develop an attendance registration system for our tech meetups in Formosa. Since venue capacity can sometimes
be limited, we need an accurate count of attendes for each event.

The app is build with React, Typescript, and TailwindCSS for the front end, and leverages Firebase as the backend for securely storing participant data and managing real-time information for each meetup.

## Getting Started

To run this project locally, follow these steps:

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with your Firebase configuration values to initialize Firestore. The file should contain the following variables:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Start the development server:

```bash
npm run dev
```
