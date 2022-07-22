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

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    data: {
      url: payload.data.url,
    },
    actions: [{action: "get", title: "View"}]
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);

  self.addEventListener('notificationclick', function(event) {
    console.log(event);
    // console.log(event.notification.data.url);
    event.notification.close();
    // console.log(clients);
    clients.openWindow(event.notification.data.url).then(windowClient => windowClient ? windowClient.focus() : null);
  }, false);

});