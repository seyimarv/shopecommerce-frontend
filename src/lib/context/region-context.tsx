"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

const REGION_STORAGE_KEY = "shophaull_selected_region";

interface RegionContextType {
  // selectedRegion: any;
  // setSelectedRegion: (region: any) => void;
  // regions: HttpTypes.StoreRegion[] | undefined;
  // isLoading: boolean;
  countryCode: string;
  setCountryCode: (countryCode: string) => void;
  setStoredCountryCode: (countryCode: string) => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const getStoredCountryCode = () => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(REGION_STORAGE_KEY);
  return stored || null;
};

const setStoredCountryCode = (countryCode: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(REGION_STORAGE_KEY, countryCode);
};

export function RegionProvider({ children }: { children: ReactNode }) {
  const initialCountryCode = getStoredCountryCode();
  const [countryCode, setCountryCode] = useState(initialCountryCode || "ng");

  return (
    <RegionContext.Provider
      value={{
        countryCode,
        setCountryCode,
        setStoredCountryCode,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
}
