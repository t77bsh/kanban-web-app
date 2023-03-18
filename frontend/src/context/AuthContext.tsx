import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  onAuthStateChanged,
  UserCredential,
  User,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext<{
  loading: boolean;
  user: User | null;
  signup: (
    displayName: string,
    email: string,
    password: string,
    firstName: string,
    surname: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  googleAuth: () => Promise<void>;
  facebookAuth: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}>({
  loading: true,
  user: null,
  signup: async (
    email: string,
    password: string,
    firstName: string,
    surname: string,
    displayName: string
  ) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(auth.currentUser!);
    } catch (err) {
      alert(err);
    }
  },
  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      alert(error.message);
    }
  },
  login: (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  },
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      alert(error.message);
    }
  },
  googleAuth: async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error: any) {
      alert(error.message);
    }
  },
  facebookAuth: async () => {
    try {
      await signInWithPopup(auth, new FacebookAuthProvider());
    } catch (error: any) {
      alert(error.message);
    }
  },
});

// Props config
interface Props {
  children: React.ReactNode;
}

export default function AuthProvider(props: Props) {
  // States
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  //   Navigation
  const navigate = useNavigate();

  //   Register via email & pass
  const signup = async (
    email: string,
    password: string,
    firstName: string,
    surname: string,
    displayName: string
  ) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(auth.currentUser!);
      await axios.all([
        axios.post("http://localhost:8000/api/users", {
          displayName: displayName.toLowerCase(),
          firstName: firstName,
          surname: surname,
          loginProvider: "email",
          email: email,
          fbaseUID: auth.currentUser!.uid,
        }),
        axios.post("http://localhost:8000/api/user_boards", {
          displayName: displayName.toLowerCase(),
          fbaseUID: auth.currentUser!.uid,
          boards: [
            {
              boardName: "My First Board",
              cols: [
                {
                  colTitle: "To Do",
                  tasks: [],
                },
                { colTitle: "Doing", tasks: [] },
                { colTitle: "Done", tasks: [] },
              ],
            },
          ],
        }),
      ]);
    } catch (err: any) {
      alert(err.message);
    }
  };

  //   Login
  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  //  Logout
  const logout = async () => {
    try {
      await signOut(auth).then(() => {
        setLoading(true);
        setTimeout(() => {
          navigate("/");
          setLoading(false);
        }, 250);
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const res = await sendPasswordResetEmail(auth, email);
      alert("Reset link sent successfully! Check your inbox.");
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Google Auth
  const googleAuth = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider()).then(
        (currentUser) => {
          const fbaseUID = currentUser.user.uid;
          const noSpacesDisplayName = currentUser.user
            .displayName!.split(" ")
            .join("");
          const fullName = currentUser.user.displayName!.split(" ");
          const firstName = fullName[0];
          let surname: string | null;
          if (fullName.length > 1) {
            surname = fullName[fullName.length - 1];
          } else {
            surname = null;
          }

          //
          axios.all([
            axios.post("http://localhost:8000/api/users", {
              displayName: noSpacesDisplayName.toLowerCase(),
              firstName: firstName,
              surname: surname,
              loginProvider: "google",
              email: currentUser.user.email,
              fbaseUID: fbaseUID,
            }),
            axios.post("http://localhost:8000/api/user_boards", {
              displayName: noSpacesDisplayName.toLowerCase(),
              fbaseUID: fbaseUID,
              boards: [
                {
                  boardName: "My First Board",
                  cols: [
                    {
                      colTitle: "To Do",
                      tasks: [],
                    },
                    { colTitle: "Doing", tasks: [] },
                    { colTitle: "Done", tasks: [] },
                  ],
                },
              ],
            }),
          ]);
        }
      );
    } catch (error: any) {
      console.log(error.message);
    }
  };

  //   Facebok Auth
  const facebookAuth = async () => {
    try {
      await signInWithPopup(auth, new FacebookAuthProvider()).then(
        (currentUser) => {
          const noSpacesDisplayName = currentUser.user
            .displayName!.split(" ")
            .join("");
          const fullName = currentUser.user.displayName!.split(" ");
          const firstName = fullName[0];
          let surname: string | null;
          if (fullName.length > 1) {
            surname = fullName[fullName.length - 1];
          } else {
            surname = null;
          }
          axios.all([
            axios.post("http://localhost:8000/api/users", {
              displayName: noSpacesDisplayName.toLowerCase(),
              firstName: firstName,
              surname: surname,
              loginProvider: "facebook",
              email: currentUser.user.email,
              fbaseUID: currentUser.user.uid,
            }),
            axios.post("http://localhost:8000/api/user_boards", {
              displayName: noSpacesDisplayName.toLowerCase(),
              fbaseUID: currentUser.user.uid,
              boards: [
                {
                  boardName: "My First Board",
                  cols: [
                    {
                      colTitle: "To Do",
                      tasks: [],
                    },
                    { colTitle: "Doing", tasks: [] },
                    { colTitle: "Done", tasks: [] },
                  ],
                },
              ],
            }),
          ]);

          navigate(`/${currentUser.user.uid}`);
        }
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

  //   Login State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        login,
        logout,
        user,
        loading,
        googleAuth,
        facebookAuth,
        resetPassword,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
