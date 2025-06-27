importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAZ914WKt7pdJgQPpPAwJxhzVuMjhDPgdY",
  authDomain: "tiendapi-8a207.firebaseapp.com",
  projectId: "tiendapi-8a207",
  storageBucket: "tiendapi-8a207.firebasestorage.app",
  messagingSenderId: "462203680999",
  appId: "1:462203680999:web:1f408e78995e0428a6ca42",
  measurementId: "G-7K4FVYEY58"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Mensaje en segundo plano recibido: ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png", // opcional
  });
});
