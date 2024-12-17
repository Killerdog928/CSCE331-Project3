"use client";

import axios from "axios";
import { useRouter } from "next/navigation"; // For redirection
import React, { useEffect, useState } from "react";

import { exchangeToken } from "../api";

/**
 * Callback component handles the OAuth2 callback process.
 * It exchanges the authorization code for an access token,
 * fetches user information, and checks the user's status.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <Callback />
 *
 * @remarks
 * This component uses the `useRouter` hook from Next.js for navigation
 * and the `useState` and `useEffect` hooks from React for state management
 * and side effects.
 *
 * @function
 * @name Callback
 *
 * @description
 * The component performs the following steps:
 * 1. Extracts the authorization code from the URL.
 * 2. Exchanges the authorization code for an access token.
 * 3. Fetches user information using the access token.
 * 4. Sets the user's email and updates the status.
 * 5. Renders the `CheckEmail` component if the email is available.
 * 6. Provides a logout button if the user is logged in.
 *
 * @state {string} status - The current status of the login process.
 * @state {string | null} email - The email of the logged-in user.
 *
 * @hook {function} useRouter - Hook from Next.js for navigation.
 * @hook {function} useState - Hook from React for state management.
 * @hook {function} useEffect - Hook from React for side effects.
 *
 * @function handleCallback - Handles the OAuth2 callback process.
 * @function handleLogout - Logs the user out and redirects to the login page.
 *
 * @throws Will set an error status and redirect to the login page if an error occurs during the login process.
 */
export default function Callback() {
  const [status, setStatus] = useState<string>("Processing...");
  const [email, setEmail] = useState<string | null>(null); // State to store the email
  const [name, setName] = useState<string | null>(null); // State to store the name
  const [jobPositionId, setJobPositionId] = useState<number | null>(null); // State to store the job position ID
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const code = new URLSearchParams(window.location.search).get("code");

      if (!code) {
        setStatus("Authorization code is missing.");
        router.push("/"); // Redirect back to the login page

        return;
      }

      try {
        // Exchange the authorization code for an access token
        const tokenResponse = await exchangeToken(code);
        const accessToken = tokenResponse.access_token;

        // Fetch user info using the access token
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        const userInfo = await userInfoResponse.json();
        const userEmail = userInfo.email;

        setEmail(userEmail); // Set the email to be checked
        localStorage.setItem("userEmail", userEmail); // Save email to local storage
        setStatus("Fetching user details...");

        // Fetch user details from the database
        const response = await axios.get("/api/employees/check", {
          params: { email: userEmail },
        });

        const { employee } = response.data;

        if (employee) {
          setName(employee.name);
          setJobPositionId(employee.jobPositionId);
          localStorage.setItem(
            "jobPositionId",
            employee.jobPositionId.toString(),
          ); // Save jobPositionId to local storage
          setStatus(`Welcome, ${employee.name}!`);
        } else {
          setStatus("User not found in the system. Redirecting...");
          setTimeout(() => router.push("/"), 2000); // Redirect to login page
        }
      } catch (error) {
        console.error("Error during login process:", error);
        setStatus("An error occurred during login. Please try again.");
        router.push("/"); // Redirect back to the login page on error
      }
    };

    handleCallback(); // Automatically call the login process on load
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>{status}</h1>

      {/* Display user details once available */}
      {email && name && jobPositionId && (
        <div>
          <p>Email: {email}</p>
          <p>Job Position ID: {jobPositionId}</p>
        </div>
      )}
    </div>
  );
}
