"use client";

import { Card, Button, Link } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import cartUtility from "../../cart"; // Import the cart utility

import { translateText } from "@/pages/api/translate-text"; // Import translation function
import { findAllItems } from "@/server/db";
import { decodeHtmlEntity } from "@/utils/decodeHtmlEntity"; // Decode HTML entities

/**
 * DrinksPage component renders a page where users can select and add drinks to their cart.
 * It supports multiple languages and dynamically translates text based on the selected language.
 *
 * @component
 * @example
 * return (
 *   <DrinksPage />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * - The component fetches drink items from a backend service and displays them in a grid layout.
 * - Users can select a drink, which will be highlighted, and then add it to their cart.
 * - If the component is in edit mode, users can update the existing drink in their cart.
 * - The component supports language translation for various UI texts and drink names.
 *
 * @state {Array<{ name: string; calories: number; translatedName?: string }>} drinks - List of drink items.
 * @state {string | null} selectedDrink - The currently selected drink.
 * @state {boolean} loading - Indicates if the drink items are being loaded.
 * @state {string} selectedLanguage - The currently selected language for translations.
 * @state {Object} translatedHeaders - Translated text for various UI elements.
 *
 * @dependencies
 * - useState: React hook to manage component state.
 * - useEffect: React hook to perform side effects in the component.
 * - localStorage: Browser API to store and retrieve the selected language.
 * - findAllItems: Function to fetch drink items from the backend.
 * - translateText: Function to translate text to the selected language.
 * - decodeHtmlEntity: Function to decode HTML entities in translated text.
 * - cartUtility: Utility to add or edit items in the cart.
 * - Link: Next.js component for client-side navigation.
 * - Button: Custom button component.
 * - Card: Custom card component to display drink items.
 */
export default function DrinksPage() {
  const [drinks, setDrinks] = useState<
    { name: string; calories: number; translatedName?: string }[]
  >([]);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedHeaders, setTranslatedHeaders] = useState({
    chooseDrink: "Choose Your Drink",
    editDrink: "Edit Your Drink",
    back: "← Back",
    addToCart: "Add to Cart",
    updateCart: "Update Cart",
    loading: "Loading...",
    noDrinks: "No drinks available.",
    selectPrompt: "Please select a drink to proceed.",
  });

  const isEditMode = false; // searchParams!.get("edit") === "true";
  const itemId = undefined; // searchParams!.get("id"); // Get item ID if in edit mode

  useEffect(() => {
    const storedLanguage = localStorage.getItem("selectedLanguage") || "en";

    setSelectedLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedLanguage", selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    async function fetchDrinks() {
      try {
        const items = await findAllItems({
          include: [{ model: "ItemFeature", where: { name: "Drink" } }],
        });

        setDrinks(items);
        console.log("Fetched Drink Items:", items);
      } catch (error) {
        console.error("Error fetching drinks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDrinks();
  }, []);

  useEffect(() => {
    async function loadTranslations() {
      try {
        const translatedHeaders = await Promise.all([
          translateText({
            text: "Choose Your Drink",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "Edit Your Drink",
            targetLanguage: selectedLanguage,
          }),
          translateText({ text: "← Back", targetLanguage: selectedLanguage }),
          translateText({
            text: "Add to Cart",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "Update Cart",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "Loading...",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "No drinks available.",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "Please select a drink to proceed.",
            targetLanguage: selectedLanguage,
          }),
        ]);

        setTranslatedHeaders({
          chooseDrink: translatedHeaders[0],
          editDrink: translatedHeaders[1],
          back: translatedHeaders[2],
          addToCart: translatedHeaders[3],
          updateCart: translatedHeaders[4],
          loading: translatedHeaders[5],
          noDrinks: translatedHeaders[6],
          selectPrompt: translatedHeaders[7],
        });

        const translatedDrinks = await Promise.all(
          drinks.map((drink) =>
            translateText({
              text: drink.name,
              targetLanguage: selectedLanguage,
            }),
          ),
        );

        // Decode translated names to handle any HTML entities
        const decodedDrinks = translatedDrinks.map(decodeHtmlEntity);

        setDrinks((prevDrinks) =>
          prevDrinks.map((drink, index) => ({
            ...drink,
            translatedName: decodedDrinks[index], // Update translated names
          })),
        );
      } catch (error) {
        console.error("Error translating drink names:", error);
      }
    }

    if (drinks.length > 0) {
      loadTranslations();
    }
  }, [drinks.length, selectedLanguage]);
  const handleAddOrEditCart = () => {
    if (selectedDrink) {
      if (isEditMode && itemId) {
        cartUtility.editSellable(Number(itemId), "drink", [selectedDrink]); // Use original name
        window.location.href = "/kiosk/cart";
      } else {
        cartUtility.addSellable("drink", [selectedDrink]); // Use original name
        window.location.href = "/kiosk";
      }
    } else {
      alert(translatedHeaders.selectPrompt);
    }
  };

  return (
    <div className="pt-10 px-5">
      {/* Back Button */}
      <div className="mb-6">
        <Link href={isEditMode ? "/kiosk/cart" : "/kiosk"}>
          <Button className="bg-[#D62300] text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-[#b81f00] hover:scale-105 transition-all">
            {translatedHeaders.back}
          </Button>
        </Link>
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-[#D62300] mb-6 text-center">
        {isEditMode
          ? translatedHeaders.editDrink
          : translatedHeaders.chooseDrink}
      </h1>

      {/* Drinks Section */}
      {loading ? (
        <p>{translatedHeaders.loading}</p>
      ) : drinks.length > 0 ? (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[800px]">
            {drinks.map((drink, index) => (
              <Card
                key={index}
                isHoverable
                isPressable
                className={`p-4 flex flex-col items-center text-center cursor-pointer
        ${
          selectedDrink === drink.name
            ? "border-4 border-[#D62300]"
            : "border border-gray-300"
        }`}
                onClick={() => setSelectedDrink(drink.name)} // Use original name for cart
              >
                <h3 className="text-xl font-semibold">
                  {drink.translatedName || drink.name}{" "}
                  {/* Display translated name */}
                </h3>
                <p className="text-gray-600">{drink.calories} Cal</p>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <p>{translatedHeaders.noDrinks}</p>
      )}

      {/* Add or Edit Cart Button */}
      <div className="flex justify-center mt-10">
        <Button
          className="bg-[#D62300] text-white w-48 shadow-lg"
          onClick={handleAddOrEditCart}
        >
          {isEditMode
            ? translatedHeaders.updateCart
            : translatedHeaders.addToCart}
        </Button>
      </div>
    </div>
  );
}
