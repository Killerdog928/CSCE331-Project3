"use client";

import { Card } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { translateText } from "@/pages/api/translate-text"; // Import translation function
import { decodeHtmlEntity } from "@/utils/decodeHtmlEntity.ts"; // Utility function for HTML decoding

/**
 * BundlesPage component displays a list of bundles with their names and descriptions.
 * It supports translation of the bundle names and descriptions based on the selected language.
 *
 * @component
 *
 * @example
 * // Usage example:
 * <BundlesPage />
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * - The component uses `useState` to manage the bundles and the selected language.
 * - The selected language is stored in and retrieved from `localStorage`.
 * - The component uses `useEffect` to load translations when the selected language changes.
 * - The `translateText` function is used to translate the bundle names and descriptions.
 * - The `decodeHtmlEntity` function is used to decode HTML entities in the translated text.
 *
 * @function
 * @name BundlesPage
 */
export default function BundlesPage() {
  const [bundles, setBundles] = useState([
    {
      name: "Bowl",
      description: "Any 1 Side, 1 Entree & Medium Fountain Drink",
      translatedName: "",
      translatedDescription: "",
    },
    {
      name: "Plate",
      description: "Any 1 Side, 2 Entrees & Medium Fountain Drink",
      translatedName: "",
      translatedDescription: "",
    },
    {
      name: "Bigger Plate",
      description: "Any 1 Side, 3 Entrees & Medium Fountain Drink",
      translatedName: "",
      translatedDescription: "",
    },
  ]);

  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("selectedLanguage") || "en";

    setSelectedLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedLanguage", selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    async function loadBundleTranslations() {
      try {
        const translatedNames = await Promise.all(
          bundles.map((bundle) =>
            translateText({
              text: bundle.name,
              targetLanguage: selectedLanguage,
            }),
          ),
        );
        const translatedDescriptions = await Promise.all(
          bundles.map((bundle) =>
            translateText({
              text: bundle.description,
              targetLanguage: selectedLanguage,
            }),
          ),
        );

        // Decode HTML entities and update state
        setBundles((prevBundles) =>
          prevBundles.map((bundle, index) => ({
            ...bundle,
            translatedName: decodeHtmlEntity(translatedNames[index]), // Decode translated name
            translatedDescription: decodeHtmlEntity(
              translatedDescriptions[index],
            ), // Decode translated description
          })),
        );
      } catch (error) {
        console.error(
          "Error translating bundle names and descriptions:",
          error,
        );
      }
    }

    loadBundleTranslations();
  }, [selectedLanguage]);

  return (
    <div className="pt-10 px-5">
      <h1 className="text-3xl font-bold text-center mb-8">Bundles</h1>

      <div className="flex justify-center flex-wrap gap-6 max-w-3xl mx-auto">
        {bundles.map((bundle, index) => (
          <Link
            key={index}
            href={`/kiosk/bundles/${bundle.name.toLowerCase().replace(/ /g, "-")}`}
          >
            <Card
              isHoverable
              isPressable
              className="w-52 h-52 p-4 flex flex-col justify-center items-center text-center cursor-pointer border border-gray-300 hover:scale-105 hover:shadow-lg transition-transform"
            >
              <h3 className="text-xl font-bold text-[#D62300]">
                {bundle.translatedName || bundle.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {bundle.translatedDescription || bundle.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
