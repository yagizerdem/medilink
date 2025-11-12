import React, { createContext, useContext, ReactNode } from "react";
import { AppProvider } from "./AppProvider";

type BaseContextValue = {};

const BaseContext = createContext<BaseContextValue | undefined>(undefined);

type BaseProviderProps = {
  children: ReactNode;
};

export const BaseProvider = ({ children }: BaseProviderProps) => {
  const value: BaseContextValue = {};

  return (
    <AppProvider>
      <BaseContext.Provider value={value}>{children}</BaseContext.Provider>
    </AppProvider>
  );
};

export const useBase = () => {
  const ctx = useContext(BaseContext);
  if (!ctx) {
    throw new Error("useBase must be used within a BaseProvider");
  }
  return ctx;
};
