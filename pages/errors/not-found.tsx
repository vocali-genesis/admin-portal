import Link from "next/link";
import React from "react";

/**
 * TODO: Make nicer
 */
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
