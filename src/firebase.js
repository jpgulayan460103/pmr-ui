import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

var firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const serviceWorkerRegistration = async () => {
  const dir = process.env.NODE_ENV == "development" ? "" : process.env.PUBLIC_URL;
  const serviceWorkerRegistration = await navigator
    .serviceWorker
    .register(`${dir}/firebase-messaging-sw.js`);
  return serviceWorkerRegistration;
}

export const getTokens = async () => {
    let serviceWorkerRegistrations = serviceWorkerRegistration();
    return getToken(messaging, {vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY, serviceWorkerRegistrations})
  }

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});