import axios from "axios";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import initializeFirebase from "../Firebase/firebase.init";

initializeFirebase();

const useFirebase = () => {
  const [user, setUser] = useState([]);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [admin, setAdmin] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth();
  auth.useDeviceLanguage();

  const googleProvider = new GoogleAuthProvider();
  const twitterProvider = new TwitterAuthProvider();

  // Social sign in
  const socialSignIn = (socialProvider) => {
    setIsLoading(true);
    const provider = socialProvider === "google" ? googleProvider : twitterProvider;

    return signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setError("");
        setShowLoginModal(false);
        saveUser(user.email, user.displayName, "put");
      })
      .catch((error) => {
        setError(error.message);
        setModal(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Create user with email and password
  const createUserByEmail = (email, password, name) => {
    setIsLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const newUser = { email, displayName: name };
        setUser(newUser);
        setError("");
        return updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: null,
        }).then(() => {
          saveUser(email, name, "post");
          setShowLoginModal(false);
        });
      })
      .catch((error) => {
        setError(error.message);
        setModal(true);
      })
      .finally(() => setIsLoading(false));
  };

  // Login user with email and password
  const loginUserByEmail = (email, password) => {
    setIsLoading(true);
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setError("");
      })
      .catch((error) => {
        setError(error.message);
        setModal(true);
      })
      .finally(() => setIsLoading(false));
  };

  // Managing user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log(user);
      } else {
        setUser({});
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // Checking is admin
  useEffect(() => {
    if (user.email) {
      const url = `https://homeservice-ixli.onrender.com/allusers/${user.email}`;
      axios.get(url).then((data) => {
        setAdmin(data.data);
      });
    }
  }, [user]);

  // Sign out
  const signOutUser = () => {
    setIsLoading(true);
    return signOut(auth)
      .then(() => {
        setError("");
      })
      .catch((error) => {
        setError(error.message);
        setModal(true);
      })
      .finally(() => setIsLoading(false));
  };

  const saveUser = (email, displayName, method) => {
    const url = "https://homeservice-ixli.onrender.com/adduser";
    const data = { email, displayName };
    axios({ method, url, data });
  };

  return {
    user,
    error,
    setError,
    isLoading,
    isLogin,
    setIsLogin,
    showLoginModal,
    admin,
    setAdmin,
    setShowLoginModal,
    socialSignIn,
    createUserByEmail,
    signOutUser,
    loginUserByEmail,
    modal,
    setModal,
  };
};

export default useFirebase;
