"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type AlertType = "success" | "error";
interface AlertContextType {
  alert: {
    show: boolean;
    message: string;
    type: AlertType;
  };
  showAlert: (message: string, type: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: AlertType;
  }>({
    show: false,
    message: "",
    type: "success" as AlertType,
  });

  const showAlert = (message: string, type: AlertType = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "success" });
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
}
