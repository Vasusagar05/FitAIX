import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Standard fallback config (user can override in .env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForGoogleSignInFitAIX",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fitaix-auth.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fitaix-auth",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fitaix-auth.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential || !credential.idToken) {
      throw new Error("Failed to retrieve Google credential.");
    }
    return credential.idToken;
  } catch (error: any) {
    console.error("Firebase Google Sign-In error:", error);
    throw new Error(
      error.message?.includes('invalid-api-key') || error.code === 'auth/invalid-api-key'
        ? 'Please add your valid Firebase Configuration to the frontend .env file to enable real Google Sign-In.'
        : error.message || 'Failed to sign in with Google.'
    );
  }
};
export default app;
