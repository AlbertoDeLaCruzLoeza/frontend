import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAZ914WKt7pdJgQPpPAwJxhzVuMjhDPgdY",
  authDomain: "tiendapi-8a207.firebaseapp.com",
  projectId: "tiendapi-8a207",
  storageBucket: "tiendapi-8a207.firebasestorage.app",
  messagingSenderId: "462203680999",
  appId: "1:462203680999:web:1f408e78995e0428a6ca42",
  measurementId: "G-7K4FVYEY58"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
