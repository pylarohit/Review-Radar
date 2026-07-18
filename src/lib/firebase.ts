import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const cleanEnvVar = (val: string | undefined) => {
  if (!val) return val;
  // Extract the first line to handle potential multi-line environment variable pastes
  const firstLine = val.split(/[\r\n]/)[0];
  // Strip quotes and spaces
  return firstLine.replace(/["']/g, "").trim();
};

const firebaseConfig = {
  apiKey: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  measurementId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID),
};

// Initialize Firebase checking for existing app to support Next.js Fast Refresh/SSR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Customizing Google Provider settings
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export { app, auth, googleProvider };
