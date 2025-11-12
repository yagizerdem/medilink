import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  JSX,
} from "react";

// Context shape
type AppContextValue = {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
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

  const value: AppContextValue = {
    isLoading,
    setIsLoading,
  };

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
