let auth, database;

const init = function () {
  var firebaseConfig = {
    // apiKey: "",
    // authDomain: "",
    // projectId: "",
    // storageBucket: "",
    // messagingSenderId: "",
    // appId: "",
    apiKey: "AIzaSyB3T25FCSEGdfcGJH9A-y9UiSx0swpE3ek",
    authDomain: "chat-app-cf019.firebaseapp.com",
    databaseURL: "https://chat-app-cf019-default-rtdb.firebaseio.com",
    projectId: "chat-app-cf019",
    storageBucket: "chat-app-cf019.appspot.com",
    messagingSenderId: "282957813640",
    appId: "1:282957813640:web:6078b644d6c345a2100c3d"
  };
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  database = firebase.database();

  auth.onAuthStateChanged(function (user) {
    if ((user && user.emailVerified) || (user && user.providerData[0].providerId === "facebook.com")) {
      database
        .ref("users")
        .child(auth.currentUser.uid)
        .get()
        .then((snapshot) => {
          if (!snapshot.exists()) {
            database.ref("users").child(auth.currentUser.uid).set({
              displayName: auth.currentUser.displayName,
              email: auth.currentUser.email,
              photoURL: auth.currentUser.photoURL,
            });
          }
        });
      view.setActiveScreen("chatScreen");
    } else if (user && !user.emailVerified) {
      document.getElementById("openEmailModal").click();
    } else if (view.current != "signInScreen" && view.current != "registerScreen") {
      view.setActiveScreen("welcomeScreen");
    }
  });
};

document.addEventListener("animationend", function (event) {
  if (event.animationName === "zoom-in") {
    event.target.classList.remove("zoom-in");
  } else if (event.animationName === "load") {
    event.target.classList.remove("load-animation");
  }
});

document.getElementById("emailVerificationModal").addEventListener("hidden.bs.modal", function () {
  auth.signOut();
  view.setActiveScreen("signInScreen");
});

window.onload = init;
