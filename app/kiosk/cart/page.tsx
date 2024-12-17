"use client";
import { Button, Card, Input } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import cartUtility from "@/app/cart.ts";
import { translateText } from "@/pages/api/translate-text";
import { createOrder } from "@/server/db"; // Replace with the actual import path

/**
 * CartPage component represents the shopping cart page in the kiosk application.
 * It handles displaying the cart items, translating UI text based on the selected language,
 * and provides functionalities to remove items, clear the cart, and submit an order.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <CartPage />
 *
 * @remarks
 * This component uses several hooks:
 * - `useRouter` from `next/router` for navigation.
 * - `useState` for managing component state.
 * - `useEffect` for side effects such as loading translations and cart data.
 *
 * @interface Item
 * Represents an item in the cart.
 * @property {string} name - The name of the item.
 *
 * @interface Sellable
 * Represents a sellable entity in the cart.
 * @property {number} id - Unique identifier for the sellable.
 * @property {string} type - Type of sellable (e.g., "Side" or "Entree").
 * @property {Item[]} items - Array of items within the sellable.
 *
 * @function handleRemoveSellable
 * Removes a sellable item from the cart.
 * @param {number} sellableId - The ID of the sellable to remove.
 *
 * @function toTitleCase
 * Converts a string to title case.
 * @param {string} str - The string to convert.
 * @returns {string} The converted string in title case.
 *
 * @function handleClearCart
 * Clears all items from the cart.
 *
 * @function handleSubmitOrder
 * Submits the current order.
 * @returns {Promise<void>} A promise that resolves when the order is submitted.
 *
 * @hook useEffect
 * Loads the selected language from localStorage on component mount.
 *
 * @hook useEffect
 * Saves the selected language to localStorage whenever it changes.
 *
 * @hook useEffect
 * Loads translations for UI text based on the selected language.
 *
 * @hook useEffect
 * Loads the cart data from localStorage on component mount.
 *
 * @state {object | null} cart - The current state of the cart.
 * @state {boolean} loading - Indicates whether the cart data is being loaded.
 * @state {string} selectedLanguage - The currently selected language for translations.
 * @state {object} translatedHeaders - The translated UI text headers.
 */
const CartPage = () => {
  const router = useRouter();

  interface Item {
    name: string;
  }

  interface Sellable {
    id: number;
    type: string;
    items: Item[];
  }

  const [cart, setCart] = useState<{
    sellables: Sellable[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedHeaders, setTranslatedHeaders] = useState({
    yourCart: "Your Cart",
    back: "← Back",
    emptyCart: "Your cart is empty.",
    remove: "Remove",
    clearCart: "Clear Cart",
    submitOrder: "Submit Order",
    enterName: "Enter your name:",
    loading: "Loading...",
    errorLoading: "There was an error loading your cart.",
  });
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("selectedLanguage") || "en";

    setSelectedLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedLanguage", selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    async function loadTranslations() {
      try {
        const translations = await Promise.all([
          translateText({
            text: "Your Cart",
            targetLanguage: selectedLanguage,
          }),
          translateText({ text: "← Back", targetLanguage: selectedLanguage }),
          translateText({
            text: "Your cart is empty.",
            targetLanguage: selectedLanguage,
          }),
          translateText({ text: "Remove", targetLanguage: selectedLanguage }),
          translateText({
            text: "Clear Cart",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "Submit Order",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "Enter your name:",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "Loading...",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "There was an error loading your cart.",
            targetLanguage: selectedLanguage,
          }),
        ]);

        setTranslatedHeaders({
          yourCart: translations[0],
          back: translations[1],
          emptyCart: translations[2],
          remove: translations[3],
          clearCart: translations[4],
          submitOrder: translations[5],
          enterName: translations[6],
          loading: translations[7],
          errorLoading: translations[8],
        });
      } catch (error) {
        console.error("Error translating headers:", error);
      }
    }

    loadTranslations();
  }, [selectedLanguage]);

  useEffect(() => {
    const cartData = cartUtility.getCart();

    setCart(cartData);
    setLoading(false);
  }, []);

  const handleRemoveSellable = (sellableId: number) => {
    cartUtility.removeSellableById(sellableId);
    setCart((prevCart) => {
      if (!prevCart) return null;

      return {
        sellables: prevCart.sellables.filter(
          (sellable) => sellable.id !== sellableId,
        ),
      };
    });
  };

  const toTitleCase = (str: string): string => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleClearCart = () => {
    cartUtility.clearCart();
    setCart({ sellables: [] });
  };

  const handleSubmitOrder = async () => {
    if (!cart || customerName.trim() === "") {
      alert("Please enter your name before submitting the order.");

      return;
    }

    try {
      const processedSellables = cart.sellables.map((sellable) => ({
        Sellable: { name: toTitleCase(sellable.type) },
        SoldItems: sellable.items.map((item) => ({
          Item: { name: toTitleCase(item.name) },
          quantity: 1,
        })),
      }));

      const orderData = {
        Employee: {
          id: 11,
        },
        RecentOrder: {
          orderStatus: 0,
        },
        SoldSellables: processedSellables,
        totalPrice: 10.0,
        customerName: customerName.trim(),
      };

      await createOrder(orderData);
      alert("Order submitted successfully!");

      cartUtility.clearCart();
      setCart({ sellables: [] });
      router.push("/kiosk");
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return <p>{translatedHeaders.loading}</p>;
  }

  if (!cart || !Array.isArray(cart.sellables)) {
    return <p>{translatedHeaders.errorLoading}</p>;
  }

  return (
    <div className="text-center pt-10 px-5 relative">
      <div className="absolute top-5 left-5">
        <Link href="/kiosk">
          <Button className="bg-[#D62300] text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-[#b81f00] hover:scale-105 transition-all">
            {translatedHeaders.back}
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-[#D62300] mb-4">
        {translatedHeaders.yourCart}
      </h1>

      {cart.sellables.length === 0 ? (
        <p className="text-lg text-gray-600">{translatedHeaders.emptyCart}</p>
      ) : (
        <div>
          {cart.sellables.map((sellable) => (
            <Card key={sellable.id} className="mb-6 p-4">
              <h3 className="text-xl font-semibold mb-2">
                {toTitleCase(sellable.type)}
              </h3>
              <ul className="list-disc list-inside text-left mb-4">
                {sellable.items.map((item, idx) => (
                  <li key={idx}>{toTitleCase(item.name)}</li>
                ))}
              </ul>

              <Button
                className="bg-red-500 text-white"
                size="sm"
                onClick={() => handleRemoveSellable(sellable.id)}
              >
                {translatedHeaders.remove}
              </Button>
            </Card>
          ))}

          <div className="mt-6">
            <Button
              className="bg-gray-500 text-white"
              onClick={handleClearCart}
            >
              {translatedHeaders.clearCart}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <label
          className="block text-lg font-medium mb-2"
          htmlFor="customer-name"
        >
          {translatedHeaders.enterName}
        </label>
        <Input
          className="w-full mb-4"
          id="customer-name"
          placeholder="John Doe"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>

      <div className="flex justify-center mt-10">
        <Button
          className="bg-[#D62300] text-white w-48 shadow-lg"
          onClick={handleSubmitOrder}
        >
          {translatedHeaders.submitOrder}
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
