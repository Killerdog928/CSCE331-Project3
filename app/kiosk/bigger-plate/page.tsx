"use client";

import { Card, Button, Link } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import cartUtility from "../../cart"; // Import the cart utility

import { translateText } from "@/pages/api/translate-text"; // Import translation function
import { findAllItems, filterItems } from "@/server/db";

/**
 * Component representing the Bigger Plate page.
 *
 * This component allows users to create or edit a "Bigger Plate" by selecting sides and entrees.
 * It supports multiple languages and stores user preferences in local storage.
 *
 * @component
 * @example
 * return (
 *   <BiggerPlatePage />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * - The component fetches available sides and entrees from the server and filters them based on user preferences.
 * - It supports translation of headers and item names based on the selected language.
 * - Users can select up to 2 sides and 3 entrees to add to the cart.
 * - The component handles both adding new items to the cart and editing existing items.
 *
 * @state {Array<{ name: string; calories: number; translatedName?: string }>} sides - List of available sides.
 * @state {Array<{ name: string; calories: number; translatedName?: string }>} entrees - List of available entrees.
 * @state {number[]} selectedSides - Indices of selected sides.
 * @state {number[]} selectedEntrees - Indices of selected entrees.
 * @state {boolean} loading - Indicates whether the data is being loaded.
 * @state {string[]} includeFeatures - List of features to include in the item filtering.
 * @state {string[]} excludedFeatures - List of features to exclude in the item filtering.
 * @state {Object} translatedHeaders - Translated headers for the UI.
 * @state {string} selectedLanguage - The currently selected language.
 *
 * @function handleSideSelection - Handles the selection of a side.
 * @param {number} index - The index of the selected side.
 *
 * @function handleEntreeSelection - Handles the selection of an entree.
 * @param {number} index - The index of the selected entree.
 *
 * @function handleAddOrEditCart - Handles adding or editing items in the cart.
 *
 * @hook useEffect - Fetches items and translations, and manages local storage.
 */
const BiggerPlatePage = () => {
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
    createBiggerPlate: "Create Your Bigger Plate",
    editBiggerPlate: "Edit Your Bigger Plate",
    sides: "Sides",
    entrees: "Entrees",
    back: "← Back",
    addToCart: "Add to Cart",
    updateCart: "Update Cart",
    loading: "Loading...",
    noSides: "No sides available.",
    noEntrees: "No entrees available.",
    selectPrompt:
      "Please select 2 sides (or 1/2 sides) and 3 entrees to add to the cart.",
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
            text: "Create Your Bigger Plate",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "Edit Your Bigger Plate",
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
            text: "Please select 2 sides (or 1/2 sides) and 3 entrees to add to the cart.",
            targetLanguage: selectedLanguage,
          }),
        ]);

        setTranslatedHeaders({
          createBiggerPlate: translatedHeaders[0],
          editBiggerPlate: translatedHeaders[1],
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
    }
  };

  const handleEntreeSelection = (index: number) => {
    if (selectedEntrees.includes(index)) {
      setSelectedEntrees(
        selectedEntrees.filter((entreeIndex) => entreeIndex !== index),
      );
    } else if (selectedEntrees.length < 3) {
      setSelectedEntrees([...selectedEntrees, index]);
    }
  };

  const handleAddOrEditCart = () => {
    let selectedSideNames: string[] = [];

    if (selectedSides.length === 1) {
      selectedSideNames = [sides[selectedSides[0]].name]; // Use English name
    } else if (selectedSides.length === 2) {
      selectedSideNames = selectedSides.map(
        (index) => `${sides[index].name} (1/2)`, // Use English name
      );
    }

    let selectedEntreeNames: string[] = [];

    if (selectedEntrees.length === 1) {
      const entreeName = entrees[selectedEntrees[0]].name; // Use English name

      selectedEntreeNames = [entreeName, entreeName, entreeName]; // 3 entrees for Bigger Plate
    } else if (selectedEntrees.length === 2) {
      const entreeName1 = entrees[selectedEntrees[0]].name; // Use English name
      const entreeName2 = entrees[selectedEntrees[1]].name; // Use English name

      selectedEntreeNames = [entreeName1, entreeName2, entreeName2]; // Duplicate last entree
    } else if (selectedEntrees.length === 3) {
      selectedEntreeNames = selectedEntrees.map(
        (index) => entrees[index].name, // Use English names
      );
    }

    if (
      selectedSideNames.length > 0 &&
      selectedSideNames.length <= 2 &&
      selectedEntreeNames.length === 3
    ) {
      const cartItems = [...selectedSideNames, ...selectedEntreeNames];

      if (isEditMode && itemId) {
        cartUtility.editSellable(Number(itemId), "Bigger Plate", cartItems);
        window.location.href = "/kiosk/cart";
      } else {
        cartUtility.addSellable("Bigger Plate", cartItems);
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
        {isEditMode
          ? translatedHeaders.editBiggerPlate
          : translatedHeaders.createBiggerPlate}
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

export default BiggerPlatePage;
