import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  JSX,
  useEffect,
} from "react";
import { app } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { Profile } from "../model/Profile";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Toast from "react-native-toast-message";

// Context shape
type AppContextValue = {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
};

// Context
const AppContext = createContext<AppContextValue | undefined>(undefined);

// Provider props
type AppProviderProps = {
  children: ReactNode;
};

// Provider
export const AppProvider = ({ children }: AppProviderProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const value: AppContextValue = {
    isLoading,
    setIsLoading,
    profile,
    setProfile,
    isLoggedIn,
    setIsLoggedIn,
  };

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const uid = user.uid;
        const docRef = doc(db, "profile", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const profileData = docSnap.data() as Profile;
          setProfile(profileData);
          setIsLoggedIn(true);
        } else {
          Toast.show({
            type: "error",
            text1: "Profile not found",
          });
          setProfile(null);
          setIsLoggedIn(false);
        }
      }
    });
  }, []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook
export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return ctx;
};
