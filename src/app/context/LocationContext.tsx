"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Coords = {
  latitude: number;
  longitude: number;
};

type LocationContextType = {
  coords: Coords | null;
  requestLocation: () => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);

  if (!context) throw new Error("useLocation deve estar dentro do LocationProvider");

  return context;
};

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [coords, setCoords] = useState<Coords | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error); // uso do parâmetro para evitar erro do ESLint
        alert("Permita acesso à localização para continuar");
      }
    );
  };

  return (
    <LocationContext.Provider value={{ coords, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
