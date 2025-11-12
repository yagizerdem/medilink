import React, { createContext, useContext, ReactNode } from "react";

type BaseContextValue = {};

const BaseContext = createContext<BaseContextValue | undefined>(undefined);

type BaseProviderProps = {
  children: ReactNode;
};

export const BaseProvider = ({ children }: BaseProviderProps) => {
  const value: BaseContextValue = {};

  return <BaseContext.Provider value={value}>{children}</BaseContext.Provider>;
};

export const useBase = () => {
  const ctx = useContext(BaseContext);
  if (!ctx) {
    throw new Error("useBase must be used within a BaseProvider");
  }
  return ctx;
};
