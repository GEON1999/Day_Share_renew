import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg_main">
      <div className="loading spinner"></div>
    </div>
  );
}
