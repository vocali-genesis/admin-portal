import React from "react";

/**
 * Full Page Spinner
 */
export default function Spinner({ maxHeight }: { maxHeight?: string }) {
  return (
    <div
      data-testid="spinner"
      className="flex justify-center items-center h-screen bg-white"
      style={{ maxHeight: maxHeight || "85vh" }}
    >
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-[var(--primary)] rounded-full"></div>
        <div
          className="absolute top-0 left-0 right-0 bottom-0 border-4 border-[var(--gray-200)] rounded-full animate-spin"
          style={{ clipPath: "inset(0 0 90%)" }}
        ></div>
      </div>
    </div>
  );
}
