"use client";

import { useRouter } from "next/navigation";
import React from "react";

/**
 * HomeButton component renders a fixed-position button that navigates the user to the home page when clicked.
 *
 * @component
 * @example
 * // Usage example:
 * // <HomeButton />
 *
 * @returns {JSX.Element} A button element styled with inline CSS.
 *
 * @remarks
 * This component uses the Next.js `useRouter` hook to programmatically navigate to the home page.
 *
 * @see {@link https://nextjs.org/docs/api-reference/next/router#userouter} for more information on the `useRouter` hook.
 */
const HomeButton: React.FC = () => {
  const router = useRouter();

  const navigateToHome = () => {
    router.push("/"); // Redirect to the main/login page
  };

  return (
    <button
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        padding: "0.5rem 1rem",
        backgroundColor: "white", // White background
        color: "black", // Black text
        border: "2px solid black", // Black border
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "1rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.3s, color 0.3s", // Smooth transitions
      }}
      onClick={navigateToHome}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f0f0f0"; // Light gray background on hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "white"; // Reset background
      }}
    >
      Home
    </button>
  );
};

export default HomeButton;
