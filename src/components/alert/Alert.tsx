"use client";

import React from "react";
import { useAlert } from "./AlertContext";

const Alert = () => {
  const { alert } = useAlert();

  if (!alert.show) return null;

  return (
    <div className={`custom-alert custom-alert-${alert.type}`}>
      {alert.message}
    </div>
  );
};

export default Alert;
