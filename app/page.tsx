"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use Next.js router
import React, { useEffect, useState } from "react";

import AudioRecorder from "../components/audioRecorder";

// Configuration for OAuth based on the environment
const isProduction = process.env.NODE_ENV === "production";

const OAUTH_CONFIG = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  clientId:
    "548903282497-hpnjaq6ed86tqiuiv1fjpka7usa4tc6s.apps.googleusercontent.com", // Replace with your actual Google Client ID
  redirectUri: isProduction
    ? "https://project-3-24-cracked-donkeys.vercel.app/callback" // Production Callback URI
    : "http://localhost:3000/callback", // Local Callback URI
  scope: "openid email profile",
};

/**
 * The `Home` component is the main entry point for the application.
 * It handles user authentication with Google OAuth and displays different
 * content based on the authentication state.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Usage in a Next.js application
 * import Home from './path/to/Home';
 *
 * function App() {
 *   return <Home />;
 * }
 *
 * @remarks
 * This component uses the Next.js router for navigation and Axios for HTTP requests.
 * It also uses the `useState` and `useEffect` hooks from React.
 *
 * @function login
 * Redirects the user to Google's OAuth authorization endpoint.
 *
 * @function handleCallback
 * Handles the callback from Google and exchanges the authorization code for an access token.
 *
 * @hook useEffect
 * Calls `handleCallback` when the component mounts.
 *
 * @state {boolean} isAuthenticated - Indicates whether the user is authenticated.
 * @state {boolean} isLoading - Indicates whether the authentication process is loading.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Use Next.js router

  // Redirects the user to Google's OAuth authorization endpoint
  const login = () => {
    const authUrl = `${OAUTH_CONFIG.authorizationEndpoint}?response_type=code&client_id=${OAUTH_CONFIG.clientId}&redirect_uri=${OAUTH_CONFIG.redirectUri}&scope=${OAUTH_CONFIG.scope}`;

    window.location.href = authUrl;
  };

  // Handles the callback from Google and exchanges the authorization code for an access token
  const handleCallback = async () => {
    setIsLoading(true); // Start loading
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      try {
        const tokenExchangeUrl = isProduction
          ? "https://project-3-24-cracked-donkeys.vercel.app/exchange-token"
          : "http://localhost:5000/exchange-token"; // Dynamically set the token exchange URL

        const response = await axios.post(tokenExchangeUrl, { code });

        localStorage.setItem("accessToken", response.data.access_token);
        setIsAuthenticated(true);
        router.push("/"); // Redirect using Next.js router
      } catch (error) {
        console.error("Error exchanging token:", error);
      }
    }
    setIsLoading(false); // End loading
  };

  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      {isLoading ? (
        <h1>Loading...</h1>
      ) : !isAuthenticated ? (
        <>
          <h1>Welcome! Please log in to continue.</h1>
          <button
            style={{
              padding: "1rem 2rem",
              fontSize: "1.5rem",
              backgroundColor: "#4285F4",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "1rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={login}
          >
            Login with Google
          </button>
          <Link
            href="/kiosk"
            style={{
              padding: "1rem 2rem",
              fontSize: "1.5rem",
              backgroundColor: "#FF0000",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "1rem",
              textAlign: "center",
              textDecoration: "none",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            Continue to Kiosk
          </Link>
        </>
      ) : (
        <>
          <h1>Welcome to your account!</h1>
          <AudioRecorder onProcessOrder={(_) => {}} />
        </>
      )}
    </main>
  );
}
