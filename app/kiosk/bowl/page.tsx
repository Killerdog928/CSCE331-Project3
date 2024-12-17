"use client";

import { Card, Button, Link } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import cartUtility from "../../cart"; // Import the cart utility

import { translateText } from "@/pages/api/translate-text"; // Import translation function
import { findAllItems, filterItems } from "@/server/db";

/**
 * The `BowlPage` component allows users to create or edit a bowl by selecting sides and entrees.
 * It supports multiple languages and saves user preferences in local storage.
 *
 * @component
 * @example
 * return (
 *   <BowlPage />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * - The component fetches items and translations from an API.
 * - User selections are managed using state hooks.
 * - Preferences for included and excluded features are stored in local storage.
 * - The component supports both creation and editing modes for bowls.
 *
 * @function
 * @name BowlPage
 *
 * @typedef {Object} Side
 * @property {string} name - The name of the side.
 * @property {number} calories - The calorie count of the side.
 * @property {string} [translatedName] - The translated name of the side.
 *
 * @typedef {Object} Entree
 * @property {string} name - The name of the entree.
 * @property {number} calories - The calorie count of the entree.
 * @property {string} [translatedName] - The translated name of the entree.
 *
 * @typedef {Object} TranslatedHeaders
 * @property {string} createBowl - The translated text for "Create Your Bowl".
 * @property {string} editBowl - The translated text for "Edit Your Bowl".
 * @property {string} sides - The translated text for "Sides".
 * @property {string} entrees - The translated text for "Entrees".
 * @property {string} back - The translated text for "← Back".
 * @property {string} addToCart - The translated text for "Add to Cart".
 * @property {string} updateCart - The translated text for "Update Cart".
 * @property {string} loading - The translated text for "Loading...".
 * @property {string} noSides - The translated text for "No sides available.".
 * @property {string} noEntrees - The translated text for "No entrees available.".
 * @property {string} selectPrompt - The translated text for the selection prompt.
 *
 * @typedef {Object} Props
 * @property {Side[]} sides - The list of available sides.
 * @property {Entree[]} entrees - The list of available entrees.
 * @property {number[]} selectedSides - The indices of selected sides.
 * @property {number[]} selectedEntrees - The indices of selected entrees.
 * @property {boolean} loading - The loading state.
 * @property {string[]} includeFeatures - The list of included features.
 * @property {string[]} excludedFeatures - The list of excluded features.
 * @property {TranslatedHeaders} translatedHeaders - The translated headers.
 * @property {boolean} isEditMode - The edit mode state.
 * @property {string} itemId - The ID of the item being edited.
 * @property {string} selectedLanguage - The selected language.
 *
 * @hook
 * @name useEffect
 * @description
 * - Fetches items and filters them based on included and excluded features.
 * - Loads translations for headers and item names.
 * - Saves user preferences in local storage.
 *
 * @hook
 * @name useState
 * @description
 * - Manages the state of sides, entrees, selected items, loading state, and user preferences.
 *
 * @function
 * @name handleSideSelection
 * @description Handles the selection of sides.
 * @param {number} index - The index of the selected side.
 *
 * @function
 * @name handleEntreeSelection
 * @description Handles the selection of entrees.
 * @param {number} index - The index of the selected entree.
 *
 * @function
 * @name handleAddOrEditCart
 * @description Adds or edits the selected items in the cart.
 */
const BowlPage = () => {
  const [sides, setSides] = useState<
    { name: string; calories: number; translatedName?: string }[]
  >([]);
  const [entrees, setEntrees] = useState<
    { name: string; calories: number; translatedName?: string }[]
  >([]);
  const [selectedSides, setSelectedSides] = useState<number[]>([]);
  const [selectedEntrees, setSelectedEntrees] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeFeatures, setIncludeFeatures] = useState<string[]>([]);
  const [excludedFeatures, setExcludedFeatures] = useState<string[]>([]);
  const [translatedHeaders, setTranslatedHeaders] = useState({
    createBowl: "Create Your Bowl",
    editBowl: "Edit Your Bowl",
    sides: "Sides",
    entrees: "Entrees",
    back: "← Back",
    addToCart: "Add to Cart",
    updateCart: "Update Cart",
    loading: "Loading...",
    noSides: "No sides available.",
    noEntrees: "No entrees available.",
    selectPrompt:
      "Please select 1 entree and 2 sides (or 1/2 sides) to add to the cart.",
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

        setSides(filteredSides);
        setEntrees(filteredEntrees);
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
            text: "Please select 1 entree and 2 sides (or 1/2 sides) to add to the cart.",
            targetLanguage: selectedLanguage,
          }),
        ]);

        setTranslatedHeaders({
          createBowl: translatedHeaders[0],
          editBowl: translatedHeaders[1],
          sides: translatedHeaders[2],
          entrees: translatedHeaders[3],
          back: translatedHeaders[4],
          addToCart: translatedHeaders[5],
          updateCart: translatedHeaders[6],
          loading: translatedHeaders[7],
          noSides: translatedHeaders[8],
          noEntrees: translatedHeaders[9],
          selectPrompt: translatedHeaders[10],
        });

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

        setSides((prevSides) =>
          prevSides.map((side, index) => ({
            ...side,
            translatedName: translatedSides[index], // Update translated names
          })),
        );

        setEntrees((prevEntrees) =>
          prevEntrees.map((entree, index) => ({
            ...entree,
            translatedName: translatedEntrees[index], // Update translated names
          })),
        );
      } catch (error) {
        console.error("Error translating item names:", error);
      }
    }

    if (sides.length > 0 && entrees.length > 0) {
      loadTranslations();
    }
  }, [sides.length, entrees.length, selectedLanguage]);

  const handleSideSelection = (index: number) => {
    if (selectedSides.includes(index)) {
      setSelectedSides(
        selectedSides.filter((sideIndex) => sideIndex !== index),
      );
    } else if (selectedSides.length < 2) {
      setSelectedSides([...selectedSides, index]);
    } else {
      setSelectedSides([index]); // Reset if a third selection is made
    }
  };

  const handleEntreeSelection = (index: number) => {
    if (selectedEntrees.includes(index)) {
      setSelectedEntrees(
        selectedEntrees.filter((entreeIndex) => entreeIndex !== index),
      );
    } else if (selectedEntrees.length < 1) {
      setSelectedEntrees([...selectedEntrees, index]);
    } else {
      setSelectedEntrees([index]); // Reset if a second selection is made
    }
  };

  const handleAddOrEditCart = () => {
    let selectedSideNames: string[] = [];

    if (selectedSides.length === 1) {
      selectedSideNames = [
        sides[selectedSides[0]].name || sides[selectedSides[0]].name,
      ];
    } else if (selectedSides.length === 2) {
      selectedSideNames = selectedSides.map(
        (index) => `${sides[index].name || sides[index].name}`,
      );
    }

    let selectedEntreeNames: string[] = [];

    if (selectedEntrees.length === 1) {
      const entreeName =
        entrees[selectedEntrees[0]].name || entrees[selectedEntrees[0]].name;

      selectedEntreeNames = [entreeName];
    }

    if (
      selectedSideNames.length > 0 &&
      selectedSideNames.length <= 2 &&
      selectedEntreeNames.length === 1
    ) {
      if (isEditMode && itemId) {
        cartUtility.editSellable(Number(itemId), "bowl", [
          ...selectedSideNames,
          ...selectedEntreeNames,
        ]);
        window.location.href = "/kiosk/cart";
      } else {
        cartUtility.addSellable("bowl", [
          ...selectedSideNames,
          ...selectedEntreeNames,
        ]);
        window.location.href = "/kiosk";
      }

      setSelectedSides([]);
      setSelectedEntrees([]);
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
