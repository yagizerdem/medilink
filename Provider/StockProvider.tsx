import React, { createContext, useContext, ReactNode, useState } from "react";
import { StockEntity } from "../shared/model/entity/StockEntity";

type StockContextValue = {
  stock: StockEntity[] | [];
  setStock: React.Dispatch<React.SetStateAction<StockEntity[] | []>>;
  selectedStockEntity: StockEntity | null;
  setSelectedStockEntity: React.Dispatch<
    React.SetStateAction<StockEntity | null>
  >;
  stockFilter: string;
  setStockFilter: React.Dispatch<React.SetStateAction<string>>;
};

const StockContext = createContext<StockContextValue | undefined>(undefined);

type StockProviderProps = {
  children: ReactNode;
};

export const StockProvider = ({ children }: StockProviderProps) => {
  const [stock, setStock] = useState<StockEntity[] | []>([]);
  const [selectedStockEntity, setSelectedStockEntity] =
    useState<StockEntity | null>(null);
  const [stockFilter, setStockFilter] = useState<string>("");

  const value: StockContextValue = {
    setStock,
    stock,
    selectedStockEntity,
    setSelectedStockEntity,
    stockFilter,
    setStockFilter,
  };

  return (
    <StockContext.Provider value={value}>{children}</StockContext.Provider>
  );
};

export const useStock = () => {
  const ctx = useContext(StockContext);
  if (!ctx) {
    throw new Error("useStock must be used within a StockProvider");
  }
  return ctx;
};
