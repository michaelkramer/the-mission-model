import React, { useState, useCallback, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

firebase.initializeApp(config);
const auth = firebase.auth();
const db = firebase.firestore();

/* Social Sign In Method Provider */

const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
const twitterProvider = new firebase.auth.TwitterAuthProvider();

const context = React.createContext(null);

const FirebaseProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(auth.currentUser);

  // *** User API ***
  const userDb = (uid) => {
    return db.doc(`users/${uid}`);
  };
  const usersDb = () => db.collection("users");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const snapshot = await userDb(user.uid).get();
        const dbUser = snapshot.data();

        // default empty roles
        if (!dbUser.roles) {
          dbUser.roles = {};
        }

        // merge auth and db user
        const authUser = {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          providerData: user.providerData,
          ...dbUser,
        };
        setAuthUser(authUser);
      } else {
        console.log("nothing");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const doSignInWithEmailAndPassword = useCallback(
    (email, password) => auth.signInWithEmailAndPassword(email, password),
    []
  );

  const doSignOut = useCallback(() => auth.signOut(), []);

  // *** Auth API ***

  const doCreateUserWithEmailAndPassword = useCallback(
    (email, password) => auth.createUserWithEmailAndPassword(email, password),
    []
  );

  const doSignInWithGoogle = useCallback(
    () => auth.signInWithPopup(googleProvider),
    []
  );

  const doSignInWithFacebook = useCallback(
    () => auth.signInWithPopup(facebookProvider),
    []
  );

  const doSignInWithTwitter = useCallback(
    () => auth.signInWithPopup(twitterProvider),
    []
  );

  const doPasswordReset = useCallback(
    (email) => auth.sendPasswordResetEmail(email),
    []
  );

  const doSendEmailVerification = useCallback(
    () =>
      auth.currentUser.sendEmailVerification({
        url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
      }),
    []
  );

  const doPasswordUpdate = useCallback(
    (password) => auth.currentUser.updatePassword(password),
    []
  );

  return (
    <context.Provider
      value={{
        authUser,
        doSignInWithEmailAndPassword,
        doSignInWithGoogle,
        doSignInWithFacebook,
        doSignInWithTwitter,
        doPasswordReset,
        doSendEmailVerification,
        doCreateUserWithEmailAndPassword,
        doPasswordUpdate,
        doSignOut,
        userDb,
        usersDb,
        firebaseAuth: auth,
        firebaseApp: firebase,
      }}
    >
      {children}
    </context.Provider>
  );
};
FirebaseProvider.context = context;
export default FirebaseProvider;
