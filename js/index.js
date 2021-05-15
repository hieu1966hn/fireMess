let auth, database;

const init = function () {
  var firebaseConfig = {
    apiKey: "AIzaSyDco_mHLZX61GSTIohHJLB3yW-rP-qZKjw",
    authDomain: "hdt-jsao5.firebaseapp.com",
    projectId: "hdt-jsao5",
    storageBucket: "hdt-jsao5.appspot.com",
    messagingSenderId: "1012506478897",
    appId: "1:1012506478897:web:2c32a3f4126a5d83e58810"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  database = firebase.database();

  auth.onAuthStateChanged(function (user) {
    if ((user && user.emailVerified) || (user && user.providerData[0].providerId == "facebook.com")) {
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
    } else if (view.current != "signinScreen" && view.current != "registerScreen") {
      view.setActiveScreen("welcomeScreen");
    }
  });
};

const to_signin = function () {
  view.setActiveScreen("signinScreen");
};

const to_register = function () {
  view.setActiveScreen("registerScreen");
};

document.addEventListener("animationend", function (event) {
  if (event.animationName == "zoom-in") {
    event.target.classList.remove("zoom-in");
  } else if (event.animationName == "load") {
    event.target.classList.remove("load-animation");
  }
});

document.getElementById("emailVerificationModal").addEventListener("hidden.bs.modal", function () {
  auth.signOut();
  to_signin();
});

window.onload = init;
