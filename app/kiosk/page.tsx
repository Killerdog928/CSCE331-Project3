"use client";
import { Button, Card, Image, Spacer } from "@nextui-org/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import WeatherDisplay from "@/components/weatherDisplay.tsx";
import { translateText } from "@/pages/api/translate-text"; // Import the translation function

// Define the type for the menu item
type MenuItem = {
  name: string;
  description: string;
  route: string;
  image: string;
};

/**
 * HomePage component renders the main page of the kiosk application.
 * It includes the following features:
 * - Displays a list of menu items with translation support.
 * - Allows users to switch between different languages.
 * - Fetches and displays item features with options to include or exclude them.
 * - Saves selected language and feature filters to localStorage.
 * - Displays a weather widget and a "View Cart" button.
 *
 * @component
 * @returns {JSX.Element} The rendered HomePage component.
 *
 * @example
 * <HomePage />
 */
const HomePage = () => {
  const menuItems: MenuItem[] = [
    {
      name: "Bowl",
      description: "Starting at $X.XX",
      route: "kiosk/bowl",
      image: "images/bowl.png",
    },
    {
      name: "Plate",
      description: "Starting at $X.XX",
      route: "kiosk/plate",
      image: "images/plate.png",
    },
    {
      name: "Bigger Plate",
      description: "Starting at $X.XX",
      route: "kiosk/bigger-plate",
      image: "images/bigger_plate.png",
    },
    {
      name: "Drinks",
      description: "Starting at $X.XX",
      route: "kiosk/drinks",
      image: "images/drinks.png",
    },
    {
      name: "Appetizers",
      description: "Starting at $X.XX",
      route: "kiosk/appetizers",
      image: "images/appetizers.png",
    },
    {
      name: "Bundles and Family Meals",
      description: "Starting at $X.XX",
      route: "kiosk/bundles",
      image: "images/bundles_family.png",
    },
    {
      name: "A La Carte",
      description: "Starting at $X.XX",
      route: "kiosk/a-la-carte",
      image: "images/ala_carte.png",
    },
    {
      name: "Cub Meal",
      description: "Starting at $X.XX",
      route: "kiosk/cub-meal",
      image: "images/cub_meal.png",
    },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedMenu, setTranslatedMenu] = useState<MenuItem[]>(menuItems);
  const [itemFeatures, setItemFeatures] = useState<any[]>([]); // Replace with your feature type
  const [translatedFeatures, setTranslatedFeatures] = useState<any[]>([]);
  const [includeFeatures, setIncludeFeatures] = useState<string[]>([]);
  const [excludedFeatures, setExcludedFeatures] = useState<string[]>([]);
  const [showFeatureFilters, setShowFeatureFilters] = useState(false);

  // Function to translate all menu items
  const translateMenuItems = async (language: string) => {
    const targetLanguage = language || "en"; // Default to "en" if no language

    try {
      const translatedItems = await Promise.all(
        menuItems.map(async (item) => ({
          name: await translateText({
            text: item.name,
            targetLanguage,
          }),
          description: await translateText({
            text: item.description,
            targetLanguage,
          }),
          route: item.route,
          image: item.image,
        })),
      );

      setTranslatedMenu(translatedItems);
    } catch (error) {
      console.error("Error translating content:", error);
    }
  };

  // Load the selected language and feature filters from localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem("selectedLanguage") || "en";

    setSelectedLanguage(storedLanguage);
    translateMenuItems(storedLanguage);

    const storedIncludeFeatures = JSON.parse(
      localStorage.getItem("includeFeatures") || "[]",
    );
    const storedExcludedFeatures = JSON.parse(
      localStorage.getItem("excludedFeatures") || "[]",
    );

    setIncludeFeatures(storedIncludeFeatures);
    setExcludedFeatures(storedExcludedFeatures);

    const translateFeatures = async () => {
      try {
        const translatedFeatureNames = await Promise.all(
          itemFeatures.map(async (feature) => ({
            ...feature,
            name: await translateText({
              text: feature.name,
              targetLanguage: storedLanguage || "en",
            }),
          })),
        );

        setTranslatedFeatures(translatedFeatureNames);
      } catch (error) {
        console.error("Error translating feature names:", error);
      }
    };

    if (itemFeatures.length > 0) {
      translateFeatures();
    }
  }, [itemFeatures]);

  // Save selected language to localStorage
  useEffect(() => {
    localStorage.setItem("selectedLanguage", selectedLanguage);
  }, [selectedLanguage]);

  // Save feature filters to localStorage
  useEffect(() => {
    localStorage.setItem("includeFeatures", JSON.stringify(includeFeatures));
    localStorage.setItem("excludedFeatures", JSON.stringify(excludedFeatures));
  }, [includeFeatures, excludedFeatures]);

  // Handle language change
  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    translateMenuItems(language);
  };

  // Fetch item features
  useEffect(() => {
    const fetchItemFeatures = async () => {
      try {
        const response = await fetch("/api/itemFeatures");
        const data = await response.json();

        setItemFeatures(data);
      } catch (error) {
        console.error("Error fetching item features:", error);
      }
    };

    fetchItemFeatures();
  }, []);

  // Handle feature toggle
  const handleFeatureClick = (
    featureName: string,
    action: "include" | "exclude",
  ) => {
    let updatedIncludeFeatures = [...includeFeatures];
    let updatedExcludedFeatures = [...excludedFeatures];

    if (action === "include") {
      if (updatedIncludeFeatures.includes(featureName)) {
        updatedIncludeFeatures = updatedIncludeFeatures.filter(
          (f) => f !== featureName,
        );
      } else {
        updatedIncludeFeatures.push(featureName);
        updatedExcludedFeatures = updatedExcludedFeatures.filter(
          (f) => f !== featureName,
        ); // Remove from exclude if it's included
      }
    } else if (action === "exclude") {
      if (updatedExcludedFeatures.includes(featureName)) {
        updatedExcludedFeatures = updatedExcludedFeatures.filter(
          (f) => f !== featureName,
        );
      } else {
        updatedExcludedFeatures.push(featureName);
        updatedIncludeFeatures = updatedIncludeFeatures.filter(
          (f) => f !== featureName,
        ); // Remove from include if it's excluded
      }
    }

    setIncludeFeatures(updatedIncludeFeatures);
    setExcludedFeatures(updatedExcludedFeatures);
  };

  return (
    <div className="text-center pt-10 px-5">
      <title>Panda Express Order Kiosk</title>
      {/* Header */}
      <h1 className="text-4xl text-[#D62300] font-bold">
        Welcome to Panda Express
      </h1>
      <p className="text-lg text-gray-600">Freshly Made. Freshly Served.</p>
      <Spacer y={2} />

      {/* Language Switcher Buttons */}
      <div className="mb-6">
        <Button onPress={() => handleLanguageChange("en")}>English</Button>
        <Button onPress={() => handleLanguageChange("es")}>Español</Button>
        <Button onPress={() => handleLanguageChange("fr")}>Français</Button>
        <Button onPress={() => handleLanguageChange("de")}>Deutsch</Button>
        {/* Add more buttons for other languages */}
      </div>

      {/* Order With Voice Button */}
      <div className="mb-8">
        <Link passHref href="/assistant?fromKiosk=true">
          <Button className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600">
            Order With Voice
          </Button>
        </Link>
      </div>


      {/* Featured Menu Items Section */}
      <h2 className="text-2xl mb-8">Featured Menu Items</h2>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl px-4">
          {translatedMenu.map((item, index) => (
            <Link key={index} passHref href={item.route}>
              <Card
                isHoverable
                isPressable
                className="p-4 flex flex-col items-center text-center w-full max-w-xs cursor-pointer"
              >
                <Image
                  alt={item.name}
                  className="rounded-lg mb-4"
                  height={150}
                  src={item.image}
                  width={200}
                />
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Feature Filter Section */}
      <div className="text-left mb-4">
        <div className="flex items-center mb-4">
          <input
            checked={showFeatureFilters}
            id="toggleFeatureFilters"
            type="checkbox"
            onChange={(e) => setShowFeatureFilters(e.target.checked)}
          />
          <label className="ml-2" htmlFor="toggleFeatureFilters">
            Show Feature Filters
          </label>
        </div>

        {showFeatureFilters && (
          <div className="flex flex-wrap gap-4">
            {translatedFeatures.map((feature) => {
              const isIncluded = includeFeatures.includes(feature.name);
              const isExcluded = excludedFeatures.includes(feature.name);

              return (
                <div key={feature.id} className="flex items-center">
                  <span className="mr-2">{feature.name}</span>
                  <div className="flex border rounded overflow-hidden">
                    {/* Left side: Exclude */}
                    <button
                      className={`p-2 w-12 ${
                        isExcluded
                          ? "bg-red-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                      onClick={() =>
                        handleFeatureClick(feature.name, "exclude")
                      }
                    >
                      -
                    </button>
                    {/* Right side: Include */}
                    <button
                      className={`p-2 w-12 ${
                        isIncluded
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                      onClick={() =>
                        handleFeatureClick(feature.name, "include")
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Spacer y={2} />

      {/* View Cart Button */}
      <div className="fixed bottom-10 right-10">
        <Link passHref href="kiosk/cart">
          <Button className="bg-[#D62300] text-white shadow-lg">
            View Cart
          </Button>
        </Link>
      </div>

      {/* Weather Display at the Top-Left Corner */}
      <div className="absolute top-12 left-4">
        <WeatherDisplay />
      </div>
    </div>
  );
};

export default HomePage;
