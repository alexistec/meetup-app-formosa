# MeetupApp formosa

The goal of this project is to develop an attendance registration system for our tech meetups in Formosa. Since venue capacity can sometimes be limited, we need an accurate count of attendees for each event.

The app is built with React, Typescript, and TailwindCSS for the front end, and leverages Firebase as the backend for securely storing participant data and managing real-time information for each meetup.

# Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn package manager
- Firebase account with Firestore database

# Installation

1. Clone the repository:

```bash
git clone https://github.com/alexistec/meetup-app-formosa
cd meetupapp-formosa
```

2. Install the dependencies:
   
```bash
npm install
```

3. Create a .env file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

# Firebase Setup

The application uses Firebase Firestore. Here's how to set it up:

1. Create a new Firebase project at Firebase Console
2. Enable Firestore Database in your project
3. Create a collection for events satisfying the following interface:

```js
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;  // Firebase Timestamp
  active: boolean;
  agenda: {         
    time: string;   // index 0
    topic: string;  // index 1
  }[];
}
```