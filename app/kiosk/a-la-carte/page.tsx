"use client";

import { Card, Button, Link } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import cartUtility from "../../cart"; // Import the cart utility

import { translateText } from "@/pages/api/translate-text"; // Import translation function
import { findAllItems, filterItems } from "@/server/db";

/**
 * ALaCartePage component allows users to create or edit an A La Carte selection.
 * It fetches items from the server, filters them based on included and excluded features,
 * and provides translation support for multiple languages.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <ALaCartePage />
 *
 * @remarks
 * This component uses several hooks to manage state and side effects:
 * - `useState` to manage items, selected items, loading state, included and excluded features, and translated headers.
 * - `useEffect` to fetch items, load translations, and manage local storage for language and feature preferences.
 *
 * The component also handles item selection and adding or editing items in the cart.
 *
 * @function
 * @name ALaCartePage
 */
const ALaCartePage = () => {
  const [items, setItems] = useState<
    { name: string; calories: number; translatedName?: string }[]
  >([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeFeatures, setIncludeFeatures] = useState<string[]>([]);
  const [excludedFeatures, setExcludedFeatures] = useState<string[]>([]);
  const [translatedHeaders, setTranslatedHeaders] = useState({
    createALaCarte: "Create Your A La Carte",
    editALaCarte: "Edit Your A La Carte",
    items: "Items",
    back: "← Back",
    addToCart: "Add to Cart",
    updateCart: "Update Cart",
    loading: "Loading...",
    noItems: "No items available.",
    selectPrompt: "Please select items to add to the cart.",
  });

  const isEditMode = false; // searchParams!.get("edit") === "true";
  const itemId = undefined; // searchParams!.get("id"); // Cart item ID to edit

  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("selectedLanguage") || "en";

    setSelectedLanguage(storedLanguage);

    const storedIncludeFeatures = localStorage.getItem("includeFeatures");
    const storedExcludedFeatures = localStorage.getItem("excludedFeatures");

    if (storedIncludeFeatures) {
      setIncludeFeatures(JSON.parse(storedIncludeFeatures));
    }
    if (storedExcludedFeatures) {
      setExcludedFeatures(JSON.parse(storedExcludedFeatures));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedLanguage", selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    localStorage.setItem("includeFeatures", JSON.stringify(includeFeatures));
    localStorage.setItem("excludedFeatures", JSON.stringify(excludedFeatures));
  }, [includeFeatures, excludedFeatures]);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const items = await findAllItems({
          include: [{ model: "ItemFeature" }],
        });

        const inc = includeFeatures.map((name) => ({ name }));
        const exc = ["Kids", ...excludedFeatures].map((name) => ({ name }));
        const filteredItems = filterItems(items, inc, exc);

        setItems(filteredItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [includeFeatures, excludedFeatures]);

  useEffect(() => {
    async function loadTranslations() {
      try {
        const translatedHeaders = await Promise.all([
          translateText({
            text: "Create Your A La Carte",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "Edit Your A La Carte",
            targetLanguage: selectedLanguage,
          }),
          translateText({ text: "Items", targetLanguage: selectedLanguage }),
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
            text: "No items available.",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "Please select items to add to the cart.",
            targetLanguage: selectedLanguage,
          }),
        ]);

        setTranslatedHeaders({
          createALaCarte: translatedHeaders[0],
          editALaCarte: translatedHeaders[1],
          items: translatedHeaders[2],
          back: translatedHeaders[3],
          addToCart: translatedHeaders[4],
          updateCart: translatedHeaders[5],
          loading: translatedHeaders[6],
          noItems: translatedHeaders[7],
          selectPrompt: translatedHeaders[8],
        });

        const translatedItems = await Promise.all(
          items.map((item) =>
            translateText({
              text: item.name,
              targetLanguage: selectedLanguage,
            }),
          ),
        );

        setItems((prevItems) =>
          prevItems.map((item, index) => ({
            ...item,
            translatedName: translatedItems[index], // Update translated names
          })),
        );
      } catch (error) {
        console.error("Error translating item names:", error);
      }
    }

    if (items.length > 0) {
      loadTranslations();
    }
  }, [items.length, selectedLanguage]);

  const handleItemSelection = (index: number) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(
        selectedItems.filter((itemIndex) => itemIndex !== index),
      );
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const handleAddOrEditCart = () => {
    const selectedItemNames = selectedItems.map((index) => items[index].name);

    if (selectedItemNames.length > 0) {
      if (isEditMode && itemId) {
        cartUtility.editSellable(
          Number(itemId),
          "a-la-carte",
          selectedItemNames,
        );
        window.location.href = "/kiosk/cart";
      } else {
        cartUtility.addSellable("a-la-carte", selectedItemNames);
        window.location.href = "/kiosk";
      }

      setSelectedItems([]);
    } else {
      alert(translatedHeaders.selectPrompt);
    }
  };

  return (
    <div className="pt-10 px-5">
      <div className="mb-6">
        <Link href={isEditMode ? "/kiosk/cart" : "/kiosk"}>
          <Button className="bg-[#D62300] text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-[#b81f00] hover:scale-105 transition-all">
            {translatedHeaders.back}
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-[#D62300] mb-2 text-center">
        {isEditMode
          ? translatedHeaders.editALaCarte
          : translatedHeaders.createALaCarte}
      </h1>

      <div className="text-left mb-12">
        <h2 className="text-2xl font-semibold mb-2">
          {translatedHeaders.items}
        </h2>
        {loading ? (
          <p>{translatedHeaders.loading}</p>
        ) : items.length > 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[800px]">
              {items.map((item, index) => (
                <Card
                  key={index}
                  isHoverable
                  isPressable
                  className={`p-4 flex flex-col items-center text-center cursor-pointer
                    ${selectedItems.includes(index) ? "border-4 border-[#D62300]" : "border border-gray-300"}`}
                  onClick={() => handleItemSelection(index)}
                >
                  <h3 className="text-xl font-semibold">
                    {item.translatedName || item.name}{" "}
                    {/* Display translated name */}
                  </h3>

                  <p className="text-gray-600">{item.calories} Cal</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <p>{translatedHeaders.noItems}</p>
        )}
      </div>

      <div className="flex justify-center mb-10">
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
};

export default ALaCartePage;
