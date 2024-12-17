"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

type CheckEmailProps = {
  email: string | null; // Email to check
  onValidUser: () => void; // Callback when the user is valid
  onInvalidUser: () => void; // Callback when the user is invalid
};

/**
 * Component to check if an email is associated with a known user.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.email - The email to check.
 * @param {Function} props.onValidUser - Callback function to call when the email is associated with a known user.
 * @param {Function} props.onInvalidUser - Callback function to call when the email is not associated with a known user or an error occurs.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <CheckEmail
 *   email="example@example.com"
 *   onValidUser={() => console.log("Valid user")}
 *   onInvalidUser={() => console.log("Invalid user")}
 * />
 */
const CheckEmail: React.FC<CheckEmailProps> = ({
  email,
  onValidUser,
  onInvalidUser,
}) => {
  const [status, setStatus] = useState<string>("Checking email...");

  useEffect(() => {
    const checkEmail = async () => {
      if (!email) {
        setStatus("No email provided.");
        // setIsKnown(false);
        onInvalidUser();

        return;
      }

      try {
        const response = await axios.get("/api/employees/check", {
          params: { email },
        });

        if (response.data.exists) {
          setStatus("User is known.");
          // setIsKnown(true);
          onValidUser();
        } else {
          setStatus("Unknown user.");
          // setIsKnown(false);
          onInvalidUser();
        }
      } catch (error) {
        console.error("Error checking email:", error);
        setStatus("An error occurred. Please try again.");
        // setIsKnown(null);
        onInvalidUser();
      }
    };

    checkEmail();
  }, [email, onValidUser, onInvalidUser]);

  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      <p>{status}</p>
    </div>
  );
};

export default CheckEmail;
