import React from "react";

export default function Spinner({ maxHeight }: { maxHeight?: string }) {
  return (
    <div
      data-testid="spinner"
      className="flex justify-center items-center h-screen bg-white"
      style={{ maxHeight: maxHeight || "85vh" }}
    >
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-[#59DBBC] rounded-full"></div>
        <div
          className="absolute top-0 left-0 right-0 bottom-0 border-4 border-[#ccc] rounded-full animate-spin"
          style={{ clipPath: "inset(0 0 90%)" }}
        ></div>
      </div>
    </div>
  );
}
