import React, { createContext, useContext, ReactNode, useState } from "react";
import { AppProvider } from "./AppProvider";
import { DataPermissionsProvider } from "./DataPermissionsProvider";
import { PatientEntity } from "../shared/model/entity/PatientEntity";

type PatientContextValue = {
  patients: PatientEntity[];
  setPatients: React.Dispatch<React.SetStateAction<PatientEntity[]>>;
};

const PatientContext = createContext<PatientContextValue | undefined>(
  undefined
);

type PatientProviderProps = {
  children: ReactNode;
};

export const PatientProvider = ({ children }: PatientProviderProps) => {
  const [patients, setPatients] = useState<PatientEntity[]>([]);
  const value: PatientContextValue = { patients, setPatients };
  return (
    <AppProvider>
      <DataPermissionsProvider>
        <PatientContext.Provider value={value}>
          {children}
        </PatientContext.Provider>
      </DataPermissionsProvider>
    </AppProvider>
  );
};

export const usePatients = () => {
  const ctx = useContext(PatientContext);
  if (!ctx) {
    throw new Error("usePatients must be used within a PatientProvider");
  }
  return ctx;
};
