// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyDSvKfWrCXxDxD-bkjYEezVgdQFuKN-3lo",
  authDomain: "procurement-1750c.firebaseapp.com",
  projectId: "procurement-1750c",
  storageBucket: "procurement-1750c.appspot.com",
  messagingSenderId: "916853882847",
  appId: "1:916853882847:web:ff59d39f0bd7ec9471ce6a",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});