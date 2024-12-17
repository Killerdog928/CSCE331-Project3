"use client";

import { Card, Button, Link } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import cartUtility from "../../../cart"; // Import the cart utility

import { translateText } from "@/pages/api/translate-text"; // Import translation function
import { findAllItems, filterItems } from "@/server/db";

/**
 * PlatePage component allows users to create or edit a plate by selecting sides, entrees, and drinks.
 * It supports multiple languages and dynamically translates the UI based on the selected language.
 *
 * @component
 * @example
 * return (
 *   <PlatePage />
 * )
 *
 * @returns {JSX.Element} The rendered PlatePage component.
 *
 * @remarks
 * - The component fetches items (sides, entrees, drinks) from an API and filters them based on included and excluded features.
 * - It supports translation of item names and UI text based on the selected language.
 * - Users can select up to 2 sides, 2 entrees, and 1 drink to add to the cart.
 * - The component handles both creation and editing of a plate.
 *
 * @state {Object[]} sides - List of available sides.
 * @state {Object[]} entrees - List of available entrees.
 * @state {Object[]} drinks - List of available drinks.
 * @state {number[]} selectedSides - Indices of selected sides.
 * @state {number[]} selectedEntrees - Indices of selected entrees.
 * @state {number | null} selectedDrink - Index of the selected drink.
 * @state {boolean} loading - Indicates if the items are being loaded.
 * @state {string[]} includeFeatures - List of features to include in the item filtering.
 * @state {string[]} excludedFeatures - List of features to exclude in the item filtering.
 * @state {string} selectedLanguage - The currently selected language for translation.
 * @state {Object} translatedHeaders - Translated UI text headers.
 *
 * @effect Fetches items and filters them based on included and excluded features.
 * @effect Loads translations for UI text and item names based on the selected language.
 * @effect Stores and retrieves the selected language and features from localStorage.
 *
 * @function handleSideSelection - Handles the selection of a side item.
 * @function handleEntreeSelection - Handles the selection of an entree item.
 * @function handleDrinkSelection - Handles the selection of a drink item.
 * @function handleAddOrEditCart - Adds or edits the selected items in the cart.
 */
const PlatePage = () => {
  const [sides, setSides] = useState<
    { name: string; calories: number; translatedName?: string }[]
  >([]);
  const [entrees, setEntrees] = useState<
    { name: string; calories: number; translatedName?: string }[]
  >([]);
  const [drinks, setDrinks] = useState<
    { name: string; calories: number; translatedName?: string }[]
  >([]);
  const [selectedSides, setSelectedSides] = useState<number[]>([]);
  const [selectedEntrees, setSelectedEntrees] = useState<number[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [includeFeatures, setIncludeFeatures] = useState<string[]>([]);
  const [excludedFeatures, setExcludedFeatures] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedHeaders, setTranslatedHeaders] = useState({
    createPlate: "Create Your Plate",
    editPlate: "Edit Your Plate",
    sides: "Sides",
    entrees: "Entrees",
    drinks: "Drinks",
    back: "← Back",
    addToCart: "Add to Cart",
    updateCart: "Update Cart",
    loading: "Loading...",
    noSides: "No sides available.",
    noEntrees: "No entrees available.",
    noDrinks: "No drinks available.",
    selectPrompt:
      "Please select 1 side (or 2 half sides), 2 entrees, and 1 drink to add to the cart.",
  });

  const isEditMode = false; // searchParams!.get("edit") === "true";
  const itemId = undefined; // searchParams!.get("id"); // Cart item ID to edit

  useEffect(() => {
    const storedLanguage = localStorage.getItem("selectedLanguage") || "en";

    setSelectedLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedLanguage", selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
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
    async function fetchItems() {
      setLoading(true);
      try {
        const items = await findAllItems({
          include: [{ model: "ItemFeature" }],
        });

        const inc = includeFeatures.map((name) => ({ name }));
        const exc = ["Kids", ...excludedFeatures].map((name) => ({ name }));
        const filteredSides = filterItems(
          items,
          [...inc, { name: "Side" }],
          exc,
        );
        const filteredEntrees = filterItems(
          items,
          [...inc, { name: "Entree" }],
          exc,
        );
        const filteredDrinks = filterItems(
          items,
          [...inc, { name: "Drink" }],
          exc,
        ); // Fetch drinks

        setSides(filteredSides);
        setEntrees(filteredEntrees);
        setDrinks(filteredDrinks); // Store the drinks
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
            text: "Create Your Plate",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "Edit Your Plate",
            targetLanguage: selectedLanguage,
          }),
          translateText({ text: "Sides", targetLanguage: selectedLanguage }),
          translateText({ text: "Entrees", targetLanguage: selectedLanguage }),
          translateText({ text: "Drinks", targetLanguage: selectedLanguage }),
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
            text: "No sides available.",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "No entrees available.",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "No drinks available.",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "Please select 1 side, 2 entrees, and 1 drink to add to the cart.",
            targetLanguage: selectedLanguage,
          }),
        ]);

        const translatedSides = await Promise.all(
          sides.map((side) =>
            translateText({
              text: side.name,
              targetLanguage: selectedLanguage,
            }),
          ),
        );
        const translatedEntrees = await Promise.all(
          entrees.map((entree) =>
            translateText({
              text: entree.name,
              targetLanguage: selectedLanguage,
            }),
          ),
        );
        const translatedDrinks = await Promise.all(
          drinks.map((drink) =>
            translateText({
              text: drink.name,
              targetLanguage: selectedLanguage,
            }),
          ),
        );

        setTranslatedHeaders({
          createPlate: translatedHeaders[0],
          editPlate: translatedHeaders[1],
          sides: translatedHeaders[2],
          entrees: translatedHeaders[3],
          drinks: translatedHeaders[4],
          back: translatedHeaders[5],
          addToCart: translatedHeaders[6],
          updateCart: translatedHeaders[7],
          loading: translatedHeaders[8],
          noSides: translatedHeaders[9],
          noEntrees: translatedHeaders[10],
          noDrinks: translatedHeaders[11],
          selectPrompt: translatedHeaders[12],
        });

        setSides((prevSides) =>
          prevSides.map((side, index) => ({
            ...side,
            translatedName: translatedSides[index],
          })),
        );

        setEntrees((prevEntrees) =>
          prevEntrees.map((entree, index) => ({
            ...entree,
            translatedName: translatedEntrees[index],
          })),
        );

        setDrinks((prevDrinks) =>
          prevDrinks.map((drink, index) => ({
            ...drink,
            translatedName: translatedDrinks[index],
          })),
        );
      } catch (error) {
        console.error("Error translating item names:", error);
      }
    }

    if (sides.length > 0 && entrees.length > 0 && drinks.length > 0) {
      loadTranslations();
    }
  }, [sides, entrees, drinks, selectedLanguage]);
  const handleSideSelection = (index: number) => {
    if (selectedSides.includes(index)) {
      setSelectedSides(
        selectedSides.filter((sideIndex) => sideIndex !== index),
      );
    } else if (selectedSides.length < 2) {
      setSelectedSides([...selectedSides, index]);
    }
  };

  const handleEntreeSelection = (index: number) => {
    if (selectedEntrees.includes(index)) {
      setSelectedEntrees(
        selectedEntrees.filter((entreeIndex) => entreeIndex !== index),
      );
    } else if (selectedEntrees.length < 2) {
      setSelectedEntrees([...selectedEntrees, index]);
    }
  };

  const handleDrinkSelection = (index: number) => {
    setSelectedDrink(index); // Only 1 drink can be selected
  };

  const handleAddOrEditCart = () => {
    const selectedSideNames = selectedSides.map((index) => sides[index].name); // English names for sides
    const selectedEntreeNames = selectedEntrees.map(
      (index) => entrees[index].name,
    ); // English names for entrees
    const selectedDrinkName =
      selectedDrink !== null ? drinks[selectedDrink].name : null; // English name for drink

    if (
      selectedSideNames.length > 0 &&
      selectedSideNames.length <= 2 &&
      selectedEntreeNames.length === 2 &&
      selectedDrinkName
    ) {
      const cartItems = [
        ...selectedSideNames,
        ...selectedEntreeNames,
        selectedDrinkName,
      ];

      if (isEditMode && itemId) {
        cartUtility.editSellable(Number(itemId), "plate bundle", cartItems);
      } else {
        cartUtility.addSellable("plate bundle", cartItems);
      }

      window.location.href = "/kiosk";
      setSelectedSides([]);
      setSelectedEntrees([]);
      setSelectedDrink(null); // Reset drink selection
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
          ? translatedHeaders.editPlate
          : translatedHeaders.createPlate}
      </h1>

      <div className="text-left mb-12">
        <h2 className="text-2xl font-semibold mb-2">
          {translatedHeaders.sides}
        </h2>
        {loading ? (
          <p>{translatedHeaders.loading}</p>
        ) : sides.length > 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[800px]">
              {sides.map((side, index) => (
                <Card
                  key={index}
                  isHoverable
                  isPressable
                  className={`p-4 flex flex-col items-center text-center cursor-pointer
                    ${selectedSides.includes(index) ? "border-4 border-[#D62300]" : "border border-gray-300"}`}
                  onClick={() => handleSideSelection(index)}
                >
                  <h3 className="text-xl font-semibold">
                    {side.translatedName || side.name}
                  </h3>
                  <p className="text-gray-600">{side.calories} Cal</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <p>{translatedHeaders.noSides}</p>
        )}
      </div>

      <div className="text-left mb-10">
        <h2 className="text-2xl font-semibold mb-2">
          {translatedHeaders.entrees}
        </h2>
        {loading ? (
          <p>{translatedHeaders.loading}</p>
        ) : entrees.length > 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[800px]">
              {entrees.map((entree, index) => (
                <Card
                  key={index}
                  isHoverable
                  isPressable
                  className={`p-4 flex flex-col items-center text-center cursor-pointer
                    ${selectedEntrees.includes(index) ? "border-4 border-[#D62300]" : "border border-gray-300"}`}
                  onClick={() => handleEntreeSelection(index)}
                >
                  <h3 className="text-xl font-semibold">
                    {entree.translatedName || entree.name}
                  </h3>
                  <p className="text-gray-600">{entree.calories} Cal</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <p>{translatedHeaders.noEntrees}</p>
        )}
      </div>

      <div className="text-left mb-12">
        <h2 className="text-2xl font-semibold mb-2">
          {translatedHeaders.drinks}
        </h2>
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
              ${selectedDrink === index ? "border-4 border-[#D62300]" : "border border-gray-300"}`}
                  onClick={() => handleDrinkSelection(index)}
                >
                  <h3 className="text-xl font-semibold">
                    {drink.translatedName || drink.name}
                  </h3>
                  <p className="text-gray-600">{drink.calories} Cal</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <p>{translatedHeaders.noDrinks}</p>
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

export default PlatePage;
