"use client";
import { Button } from "@nextui-org/react";
import React, { useState, useEffect } from "react";

import AudioRecorder from "../../components/audioRecorder.tsx";
import CartSection from "../../components/cartsection-audio.tsx";

import { createOrder } from "@/server/db";
import Link from "next/link";

/**
 * Page component that manages the state of cart items and handles order processing and submission.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * This component uses the `useState` hook to manage the state of cart items and the current cart index.
 * It provides functions to process and submit orders.
 *
 * @function handleProcessOrder
 * @param {any} order - The order to be added to the cart.
 * @description Adds a new order to the cart items state.
 *
 * @function handleSubmitOrder
 * @async
 * @description Submits the current order to the server and handles success and error cases.
 *
 * @returns {Promise<void>} A promise that resolves when the order is submitted.
 *
 * @component AudioRecorder
 * @param {function} onProcessOrder - Callback function to process an order.
 *
 * @component CartSection
 * @param {any[]} cartItems - The list of items in the cart.
 * @param {number} currentCartIndex - The index of the current cart item.
 * @param {function} setCurrentCartIndex - Function to set the current cart index.
 *
 * @component Button
 * @param {string} className - The CSS class for styling the button.
 * @param {function} onClick - The click event handler for the button.
 */

export default function Page() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [currentCartIndex, setCurrentCartIndex] = useState(0);
  const [fromKiosk, setFromKiosk] = useState(false);

  useEffect(() => {
    // Check if the URL contains "fromKiosk=true"
    const params = new URLSearchParams(window.location.search);
    setFromKiosk(params.get("fromKiosk") === "true");
  }, []);

  const handleProcessOrder = (order: any) => {
    setCartItems((prevCart) => [...prevCart, order]); // Add new order to the cart
  };

  const handleSubmitOrder = async () => {
    try {
      const orderJson = await createOrder(cartItems[currentCartIndex]);
      console.log("Order submitted successfully:", orderJson);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main>
      {/* Back Button */}
      {fromKiosk && (
        <Link href="/kiosk">
          <Button
            style={{
              position: "fixed",
              top: "1rem",
              left: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#f9f9f9", // White background
              color: "#333", // Black text
              border: "1px solid #ccc", // Light gray border
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Back
          </Button>
        </Link>
      )}

      <AudioRecorder onProcessOrder={handleProcessOrder} />
      <CartSection
        cartItems={cartItems}
        currentCartIndex={currentCartIndex}
        setCurrentCartIndex={setCurrentCartIndex}
      />
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        {/* Submit Order Button */}
        {fromKiosk ? (
          <Link href="/kiosk">
            <Button
              style={{
                padding: "10px 20px",
                backgroundColor: "#C2185B", // Dark pink background
                color: "white", // White text
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "background-color 0.3s",
              }}
              onClick={handleSubmitOrder}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#AD1457")
              } // Darker pink on hover
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#C2185B")
              } // Reset to dark pink
            >
              Submit Order
            </Button>
          </Link>
        ) : (
          <Button
            style={{
              padding: "10px 20px",
              backgroundColor: "#C2185B", // Dark pink background
              color: "white", // White text
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s",
            }}
            onClick={handleSubmitOrder}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#AD1457")
            } // Darker pink on hover
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#C2185B")
            } // Reset to dark pink
          >
            Submit Order
          </Button>
        )}
      </div>
    </main>
  );
}

