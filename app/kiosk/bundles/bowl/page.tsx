"use client";

import { Card, Button, Link } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import cartUtility from "../../../cart"; // Import the cart utility

import { translateText } from "@/pages/api/translate-text"; // Import translation function
import { findAllItems, filterItems } from "@/server/db";

/**
 * BowlPage component allows users to create or edit a bowl by selecting sides, entrees, and drinks.
 * It supports multiple languages and dynamically translates text based on the selected language.
 * The component fetches items from the server and filters them based on included and excluded features.
 * It also handles the selection of sides, entrees, and drinks, and adds or edits the selected items in the cart.
 *
 * @component
 * @example
 * return (
 *   <BowlPage />
 * )
 *
 * @returns {JSX.Element} The rendered BowlPage component.
 *
 * @typedef {Object} Item
 * @property {string} name - The name of the item.
 * @property {number} calories - The number of calories in the item.
 * @property {string} [translatedName] - The translated name of the item.
 *
 * @typedef {Object} TranslatedHeaders
 * @property {string} createBowl - The translated text for "Create Your Bowl".
 * @property {string} editBowl - The translated text for "Edit Your Bowl".
 * @property {string} sides - The translated text for "Sides".
 * @property {string} entrees - The translated text for "Entrees".
 * @property {string} drinks - The translated text for "Drinks".
 * @property {string} back - The translated text for "← Back".
 * @property {string} addToCart - The translated text for "Add to Cart".
 * @property {string} updateCart - The translated text for "Update Cart".
 * @property {string} loading - The translated text for "Loading...".
 * @property {string} noSides - The translated text for "No sides available.".
 * @property {string} noEntrees - The translated text for "No entrees available.".
 * @property {string} noDrinks - The translated text for "No drinks available.".
 * @property {string} selectPrompt - The translated text for the selection prompt.
 *
 * @typedef {Object} Props
 * @property {boolean} isEditMode - Indicates if the component is in edit mode.
 * @property {string} itemId - The ID of the cart item to edit.
 *
 * @typedef {Object} State
 * @property {Item[]} sides - The list of available sides.
 * @property {Item[]} entrees - The list of available entrees.
 * @property {Item[]} drinks - The list of available drinks.
 * @property {number[]} selectedSides - The indices of the selected sides.
 * @property {number[]} selectedEntrees - The indices of the selected entrees.
 * @property {number | null} selectedDrink - The index of the selected drink.
 * @property {boolean} loading - Indicates if the items are being loaded.
 * @property {string[]} includeFeatures - The list of included features.
 * @property {string[]} excludedFeatures - The list of excluded features.
 * @property {string} selectedLanguage - The selected language for translations.
 * @property {TranslatedHeaders} translatedHeaders - The translated headers.
 *
 * @function handleSideSelection
 * @description Handles the selection of a side item.
 * @param {number} index - The index of the selected side.
 *
 * @function handleEntreeSelection
 * @description Handles the selection of an entree item.
 * @param {number} index - The index of the selected entree.
 *
 * @function handleDrinkSelection
 * @description Handles the selection of a drink item.
 * @param {number} index - The index of the selected drink.
 *
 * @function handleAddOrEditCart
 * @description Adds or edits the selected items in the cart.
 */
const BowlPage = () => {
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
    createBowl: "Create Your Bowl",
    editBowl: "Edit Your Bowl",
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
      "Please select 1 side (or 2 half sides), 1 entree, and 1 drink to add to the cart.",
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
            text: "Create Your Bowl",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "Edit Your Bowl",
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
            text: "Please select 1 side, 1 entree, and 1 drink to add to the cart.",
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
          createBowl: translatedHeaders[0],
          editBowl: translatedHeaders[1],
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
    } else if (selectedEntrees.length < 1) {
      setSelectedEntrees([index]);
    }
  };

  const handleDrinkSelection = (index: number) => {
    setSelectedDrink(index); // Only 1 drink can be selected
  };

  const handleAddOrEditCart = () => {
    const selectedSideNames = selectedSides.map((index) => sides[index].name);
    const selectedEntreeName =
      selectedEntrees.length === 1 ? entrees[selectedEntrees[0]].name : null;
    const selectedDrinkName =
      selectedDrink !== null ? drinks[selectedDrink].name : null;

    if (
      selectedSideNames.length > 0 &&
      selectedSideNames.length <= 2 &&
      selectedEntreeName &&
      selectedDrinkName
    ) {
      const cartItems = [
        ...selectedSideNames,
        selectedEntreeName,
        selectedDrinkName,
      ];

      if (isEditMode && itemId) {
        cartUtility.editSellable(Number(itemId), "bowl bundle", cartItems);
      } else {
        cartUtility.addSellable("bowl bundle", cartItems);
      }

      window.location.href = "/kiosk";
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
        {isEditMode ? translatedHeaders.editBowl : translatedHeaders.createBowl}
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
                  {selectedSides.length === 2 &&
                    selectedSides.includes(index) && (
                      <span className="text-sm font-semibold text-gray-700 mt-2">
                        1/2
                      </span>
                    )}
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

export default BowlPage;
