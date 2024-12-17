"use client";

import { Card, Button, Link } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import cartUtility from "../../cart"; // Adjusted import path for cart utility

import { translateText } from "@/pages/api/translate-text"; // Import translation function
import { findAllItems } from "@/server/db";
import { decodeHtmlEntity } from "@/utils/decodeHtmlEntity.ts"; // Utility function for HTML decoding

/**
 * CubMealPage component allows users to create or edit a cub meal by selecting sides, entrees, drinks, and optional apple slices.
 * It supports multiple languages and fetches items from the server, translating them as needed.
 *
 * @component
 * @example
 * return (
 *   <CubMealPage />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * - The component uses multiple `useState` hooks to manage state for sides, entrees, selected items, loading state, and translations.
 * - It uses `useEffect` hooks to fetch items, store and retrieve the selected language, and load translations.
 * - The component conditionally renders different UI elements based on the loading state and the availability of sides and entrees.
 * - It includes handlers for selecting sides, entrees, and drinks, as well as adding or editing the cart.
 *
 * @state {Object[]} sides - The list of available sides.
 * @state {Object[]} entrees - The list of available entrees.
 * @state {number[]} selectedSides - The indices of the selected sides.
 * @state {number[]} selectedEntree - The ID of the selected entree.
 * @state {string | null} selectedDrink - The selected drink.
 * @state {boolean} includeAppleSlices - Whether to include apple slices.
 * @state {boolean} loading - The loading state.
 * @state {string} selectedLanguage - The selected language.
 * @state {Object} translatedHeaders - The translated headers for UI text.
 *
 * @param {boolean} isEditMode - Indicates if the page is in edit mode.
 * @param {string | undefined} itemId - The ID of the item being edited.
 *
 * @function handleSideSelection - Handles the selection of sides.
 * @function handleEntreeSelection - Handles the selection of entrees.
 * @function handleAddOrEditCart - Handles adding or editing the cart.
 *
 * @async
 * @function fetchItems - Fetches sides, entrees, and kids items from the server.
 * @function loadTranslations - Loads translations for headers, sides, and entrees.
 */
const CubMealPage = () => {
  const [sides, setSides] = useState<
    { name: string; calories: number; translatedName?: string }[]
  >([]);
  const [entrees, setEntrees] = useState<
    { id: number; name: string; calories: number; translatedName?: string }[]
  >([]);
  const [selectedSides, setSelectedSides] = useState<number[]>([]);
  const [selectedEntree, setSelectedEntree] = useState<number[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [includeAppleSlices, setIncludeAppleSlices] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedHeaders, setTranslatedHeaders] = useState({
    createCubMeal: "Create Your Cub Meal",
    editCubMeal: "Edit Your Cub Meal",
    sides: "Sides",
    entrees: "Entrees",
    appleSlices: "Apple Slices",
    drink: "Drink",
    back: "← Back",
    addToCart: "Add to Cart",
    updateCart: "Update Cart",
    loading: "Loading...",
    noSides: "No sides available.",
    noEntrees: "No entrees available.",
    selectPrompt: "Please select an entree and at least one side.",
  });

  const isEditMode = false; // searchParams!.get("edit") === "true";
  const itemId = undefined; // searchParams!.get("id");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("selectedLanguage") || "en";

    setSelectedLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedLanguage", selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const sidesItems = await findAllItems({
          include: [{ model: "ItemFeature", where: { name: "Side" } }],
        });
        const kidsItems = await findAllItems({
          include: [{ model: "ItemFeature", where: { name: "Kids" } }],
        });
        const entreesItems = await findAllItems({
          include: [{ model: "ItemFeature", where: { name: "Entree" } }],
        });

        const filteredSides = sidesItems.filter((side) =>
          kidsItems.some((kid) => kid.name === side.name),
        );
        const filteredEntrees = entreesItems.filter((entree) =>
          kidsItems.some((kid) => kid.name === entree.name),
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
  }, []);

  useEffect(() => {
    async function loadTranslations() {
      try {
        const translatedHeaders = await Promise.all([
          translateText({
            text: "Create Your Cub Meal",
            targetLanguage: selectedLanguage,
          }),
          translateText({
            text: "Edit Your Cub Meal",
            targetLanguage: selectedLanguage,
          }),
          translateText({ text: "Sides", targetLanguage: selectedLanguage }),
          translateText({ text: "Entrees", targetLanguage: selectedLanguage }),
          translateText({
            text: "Apple Slices",
            targetLanguage: selectedLanguage,
          }),
          translateText({ text: "Drink", targetLanguage: selectedLanguage }),
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
            text: "Please select an entree and at least one side.",
            targetLanguage: selectedLanguage,
          }),
        ]);

        setTranslatedHeaders({
          createCubMeal: translatedHeaders[0],
          editCubMeal: translatedHeaders[1],
          sides: translatedHeaders[2],
          entrees: translatedHeaders[3],
          appleSlices: translatedHeaders[4],
          drink: translatedHeaders[5],
          back: translatedHeaders[6],
          addToCart: translatedHeaders[7],
          updateCart: translatedHeaders[8],
          loading: translatedHeaders[9],
          noSides: translatedHeaders[10],
          noEntrees: translatedHeaders[11],
          selectPrompt: translatedHeaders[12],
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
            translatedName: decodeHtmlEntity(translatedSides[index]),
          })),
        );

        setEntrees((prevEntrees) =>
          prevEntrees.map((entree, index) => ({
            ...entree,
            translatedName: decodeHtmlEntity(translatedEntrees[index]),
          })),
        );
      } catch (error) {
        console.error("Error translating item names:", error);
      }
    }

    if (sides.length > 0 && entrees.length > 0) {
      loadTranslations();
    }
  }, [sides, entrees, selectedLanguage]);

  const handleSideSelection = (index: number) => {
    if (selectedSides.includes(index)) {
      setSelectedSides(
        selectedSides.filter((sideIndex) => sideIndex !== index),
      );
    } else if (selectedSides.length < 2) {
      setSelectedSides([...selectedSides, index]);
    }
  };

  const handleEntreeSelection = (id: number) => {
    if (selectedEntree.includes(id)) {
      setSelectedEntree([]); // Deselect if already selected
    } else {
      setSelectedEntree([id]); // Limit to one selection
    }
  };

  const handleAddOrEditCart = () => {
    if (!selectedEntree.length || selectedSides.length === 0) {
      alert(translatedHeaders.selectPrompt);

      return;
    }

    const selectedSideNames = selectedSides.map((index) => sides[index].name);
    const selectedEntreeName = entrees.find(
      (e) => e.id === selectedEntree[0],
    )?.name;

    const sellableItems = [
      ...selectedSideNames,
      selectedEntreeName,
      ...(includeAppleSlices ? ["Apple Slices"] : []),
      ...(selectedDrink ? [selectedDrink] : []),
    ].filter(Boolean); // Remove any undefined values

    if (isEditMode && itemId) {
      cartUtility.editSellable(
        Number(itemId),
        "cub meal",
        sellableItems as string[],
      );
    } else {
      cartUtility.addSellable("cub meal", sellableItems as string[]);
    }
    window.location.href = isEditMode ? "/kiosk/cart" : "/kiosk";
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
          ? translatedHeaders.editCubMeal
          : translatedHeaders.createCubMeal}
      </h1>

      {loading ? (
        <p>{translatedHeaders.loading}</p>
      ) : (
        <>
          <div className="text-left mb-12">
            <h2 className="text-2xl font-semibold mb-2">
              {translatedHeaders.sides}
            </h2>
            {sides.length > 0 ? (
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

          <div className="text-left mb-12">
            <h2 className="text-2xl font-semibold mb-2">
              {translatedHeaders.entrees}
            </h2>
            {entrees.length > 0 ? (
              <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[800px]">
                  {entrees.map((entree) => (
                    <Card
                      key={entree.id}
                      isHoverable
                      isPressable
                      className={`p-4 flex flex-col items-center text-center cursor-pointer
                        ${selectedEntree.includes(entree.id) ? "border-4 border-[#D62300]" : "border border-gray-300"}`}
                      onClick={() => handleEntreeSelection(entree.id)}
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

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-2">
              {translatedHeaders.appleSlices}
            </h2>
            <div className="flex justify-center items-center">
              <label className="text-lg mr-4" htmlFor="apple-slices">
                Include Apple Slices?
              </label>
              <input
                checked={includeAppleSlices}
                className="w-5 h-5"
                id="apple-slices"
                type="checkbox"
                onChange={() => setIncludeAppleSlices(!includeAppleSlices)}
              />
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-2">
              {translatedHeaders.drink}
            </h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-6 max-w-[400px]">
                {["Bottled Water", "Kid's Juice"].map((drink, index) => (
                  <Card
                    key={index}
                    isHoverable
                    isPressable
                    className={`p-4 flex flex-col items-center text-center cursor-pointer
                      ${selectedDrink === drink ? "border-4 border-[#D62300]" : "border border-gray-300"}`}
                    onClick={() => setSelectedDrink(drink)}
                  >
                    <h3 className="text-xl font-semibold">{drink}</h3>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

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

export default CubMealPage;
