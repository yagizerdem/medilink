import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { AppProvider, useApp } from "./AppProvider";
import { app } from "../firebaseConfig";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { DataPermissions } from "../model/DataPermissions";

type DataPermissionsContextValue = {
  dataPermissions: DataPermissions | null;
  isLoading: boolean;
  setDataPermissions: React.Dispatch<
    React.SetStateAction<DataPermissions | null>
  >;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const DataPermissionsContext = createContext<
  DataPermissionsContextValue | undefined
>(undefined);

type DataPermissionsProviderProps = {
  children: ReactNode;
};

export const DataPermissionsProvider = ({
  children,
}: DataPermissionsProviderProps) => {
  const { profile } = useApp();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataPermissions, setDataPermissions] =
    useState<DataPermissions | null>({
      allowAnonymousAnalytics: false,
      kvkkApproved: false,
    });

  const value: DataPermissionsContextValue = {
    dataPermissions: dataPermissions,
    isLoading: isLoading,
    setDataPermissions: setDataPermissions,
    setIsLoading: setIsLoading,
  };

  useEffect(() => {
    fetchDataPermissions();

    async function fetchDataPermissions() {
      try {
        setIsLoading(true);
        if (profile && profile.uid) {
          const db = getFirestore(app);

          const response = await getDoc(
            doc(db, "dataPermissions", profile.uid)
          );

          if (response.exists()) {
            const data = response.data() as DataPermissions;
            setDataPermissions(data);
          }
        }
      } catch (error) {
        console.log("Error fetching data permissions:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [profile]);

  return (
    <AppProvider>
      <DataPermissionsContext.Provider value={value}>
        {children}
      </DataPermissionsContext.Provider>
    </AppProvider>
  );
};

export const useDataPermissions = () => {
  const ctx = useContext(DataPermissionsContext);
  if (!ctx) {
    throw new Error(
      "useDataPermissions must be used within a DataPermissionsProvider"
    );
  }
  return ctx;
};
