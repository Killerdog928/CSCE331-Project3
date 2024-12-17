"use client";
import { Card, Image, Spinner } from "@nextui-org/react";
import React, { useState, useEffect } from "react";

import { findAllItems } from "@/server/db/Item";
import { ItemJson } from "@/server/db/Item/types";
import { filterItems } from "@/server/db/Item/utils";
import { sellables } from "@/server/populateDatabase/entries/sellables";

/**
 * MenuBoard component displays a menu board with various sections including
 * popular entrees, featured items, sellable meals, appetizers, and drinks.
 * It fetches items from the server and filters them based on their features.
 * The component also cycles through the items in each section automatically.
 *
 * @component
 * @example
 * return (
 *   <MenuBoard />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @typedef {Object} ItemJson
 * @property {string} name - The name of the item.
 * @property {number} calories - The number of calories in the item.
 * @property {number} additionalPrice - The additional price of the item.
 * @property {Date | null} deletedAt - The deletion date of the item, if any.
 *
 * @typedef {Object} Sellable
 * @property {string} name - The name of the sellable item.
 * @property {number} price - The price of the sellable item.
 * @property {Array<{ amount: number, ItemFeature: { name: string } }>} SellableComponents - The components included in the sellable item.
 *
 * @typedef {Object} ImageObject
 * @property {string} name - The name of the item.
 * @property {string} image - The image URL of the item.
 *
 * @typedef {Object} Feature
 * @property {string} name - The name of the feature.
 *
 * @typedef {Object} FilterItemsOptions
 * @property {Array<Feature>} include - The features to include.
 * @property {Array<Feature>} exclude - The features to exclude.
 *
 * @function filterItems
 * @param {Array<ItemJson>} items - The items to filter.
 * @param {Array<Feature>} include - The features to include.
 * @param {Array<Feature>} exclude - The features to exclude.
 * @returns {Array<ItemJson>} The filtered items.
 *
 * @function findAllItems
 * @param {Object} options - The options for fetching items.
 * @returns {Promise<Array<ItemJson>>} The fetched items.
 */
const MenuBoard = () => {
  const sellablesImages = [
    { name: "Bowl", image: "/images/bowl.png" },
    { name: "Plate", image: "/images/plate.png" },
    { name: "Bigger Plate", image: "/images/bigger_plate.png" },
    { name: "Kids Meal", image: "/images/cub_meal.png" },
  ];

  const sellableMeals = sellables.filter((sellable) =>
    ["Bowl", "Plate", "Bigger Plate", "Kids Meal"].includes(sellable.name),
  );

  const [allItems, setAllItems] = useState<ItemJson[]>([]);
  const [seasonal, setSeasonal] = useState<ItemJson[]>([]);

  const [featured, setFeatured] = useState<ItemJson[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [allEntrees, setAllEntrees] = useState<ItemJson[]>([]);
  const [allEntreesLoading, setAllEntreesLoading] = useState(true);
  const [appetizers, setAppetizers] = useState<ItemJson[]>([]);
  const [appetizersLoading, setAppetizersLoading] = useState(true);
  const [drinks, setDrinks] = useState<ItemJson[]>([]);
  const [drinksLoading, setDrinksLoading] = useState(true);

  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [currentPopularIndex, setCurrentPopularIndex] = useState(0);
  const [currentAppetizersIndex, setCurrentAppetizersIndex] = useState(0);
  const [currentDrinksIndex, setCurrentDrinksIndex] = useState(0);

  // exclude deleted items
  const seasonalItems = seasonal.filter((item) => item.deletedAt === null);
  const featuredItems = featured.filter((item) => item.deletedAt === null);
  const seasonalFeaturedItems = [...seasonalItems, ...featuredItems];
  const popularEntrees = allEntrees.filter((item) => item.deletedAt === null);
  const appetizersItems = appetizers.filter(
    (
      item, // right top section
    ) => item.deletedAt === null,
  );
  const drinksItems = drinks.filter(
    (
      item, // right bottom section
    ) => item.deletedAt === null,
  );

  const itemsImages = allItems.map((item) => {
    let imageName: string;

    if (["Bottled Water", "Kids Water"].includes(item.name)) {
      imageName = "/images/water.png";
    } else if (
      ["Small Drink", "Medium Drink", "Large Drink", "Kids Drink"].includes(
        item.name,
      )
    ) {
      imageName = "/images/drinks.png";
    } else {
      imageName = `/images/${item.name
        .toLowerCase()
        .replace(/ kids/g, "")
        .replace(/ entree/g, "")
        .replace(/ /g, "")}.png`;
    }

    return {
      name: item.name,
      image: imageName,
    };
  });

  useEffect(() => {
    const fetchItems = async () => {
      setFeaturedLoading(true);
      setAllEntreesLoading(true);
      setAppetizersLoading(true);
      setDrinksLoading(true);
      try {
        const allItems = await findAllItems({
          // Fetch all items
          include: [{ model: "ItemFeature" }],
        });

        // Call all items
        setAllItems(allItems);

        // Call filterItems to filter the items based on featured
        const includedFeaturedFeatures = [{ name: "Featured" }];
        const excludedFeaturedFeatures: { name: string }[] = [];

        const filteredFeatured = filterItems(
          allItems,
          includedFeaturedFeatures,
          excludedFeaturedFeatures,
        );

        setFeatured(filteredFeatured);

        // Call filterItems to filter the items based on seasonal
        const includedSeasonalFeatures = [{ name: "Seasonal" }];
        const excludedSeasonalFeatures: { name: string }[] = [];

        const filteredSeasonal = filterItems(
          allItems,
          includedSeasonalFeatures,
          excludedSeasonalFeatures,
        );

        setSeasonal(filteredSeasonal);

        // Call filterItems to filter the items based on entrees
        const includedEntreesFeatures = [{ name: "Entree" }];
        const excludedEntreesFeatures: { name: string }[] = [];

        const filteredAllEntrees = filterItems(
          allItems,
          includedEntreesFeatures,
          excludedEntreesFeatures,
        );

        setAllEntrees(filteredAllEntrees);

        // Call filterItems to filter the items based on appetizers
        const includedAppetizersFeatures = [{ name: "Appetizer" }];
        const excludedAppetizersFeatures: { name: string }[] = [];

        const filteredAppetizers = filterItems(
          allItems,
          includedAppetizersFeatures,
          excludedAppetizersFeatures,
        );

        setAppetizers(filteredAppetizers);

        // Call filterItems to filter the items based on drinks
        const includedDrinksFeatures = [{ name: "Drink" }];
        const excludedDrinksFeatures: { name: string }[] = [];

        const filteredDrinks = filterItems(
          allItems,
          includedDrinksFeatures,
          excludedDrinksFeatures,
        );

        setDrinks(filteredDrinks);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setFeaturedLoading(false);
        setAllEntreesLoading(false);
        setAppetizersLoading(false);
        setDrinksLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Automatically cycle featured section
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedIndex(
        (prevIndex) => (prevIndex + 1) % seasonalFeaturedItems.length,
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [seasonalFeaturedItems.length]);

  // Automatically cycle popular entrees (left section)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPopularIndex(
        (prevIndex) => (prevIndex + 4) % popularEntrees.length,
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [popularEntrees.length]);

  // Automatically cycle others (right top section) ----------------------- change to appetizer later
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAppetizersIndex(
        (prevIndex) => (prevIndex + 2) % appetizersItems.length,
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [appetizersItems.length]);

  // Automatically cycle others (right bottom section)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDrinksIndex(
        (prevIndex) => (prevIndex + 2) % drinksItems.length,
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [drinksItems.length]);

  return (
    <div className="grid grid-cols-5 gap-4 items-start h-screen">
      {/* Left Section: Popular Entrees */}
      {allEntreesLoading ? (
        <Spinner />
      ) : (
        <div className="col-span-1 flex flex-col space-y-2">
          <h2 className="text-xl font-bold text-center">Popular Entrees</h2>
          {popularEntrees
            .slice(currentPopularIndex, currentPopularIndex + 4)
            .map((entree) => (
              <Card
                key={entree.name}
                isHoverable
                isPressable
                className="flex flex-col items-center justify-center text-center"
              >
                <Image
                  alt={entree.name}
                  height={100}
                  src={
                    itemsImages.find((img) => img.name === entree.name)
                      ?.image || "/images/appetizers.png"
                  }
                  width={100}
                />
                <div>
                  <h3 className="font-semibold">{entree.name}</h3>
                  <p className="text-gray-500">{entree.calories} Calories</p>
                  <p>Additional Price: ${entree.additionalPrice}</p>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Center Section */}
      <div className="col-span-3 flex flex-col items-center space-y-2">
        {/* Featured Section */}
        {featuredLoading ? (
          <Spinner />
        ) : seasonalFeaturedItems.length === 0 ? (
          <></>
        ) : (
          <div className="w-full text-center flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Featured!</h2>
            <Card
              isHoverable
              isPressable
              className="featured-card flex flex-col items-center justify-center text-center"
            >
              <Image
                alt={seasonalFeaturedItems[currentFeaturedIndex].name}
                height={300} // Increased height
                src={
                  itemsImages.find(
                    (img) =>
                      img.name ===
                      seasonalFeaturedItems[currentFeaturedIndex].name,
                  )?.image || ""
                }
                width={600} // Increased width
              />
              <h3 className="font-semibold">
                {seasonalFeaturedItems[currentFeaturedIndex].name}
              </h3>
              <p className="text-gray-500">
                {seasonalFeaturedItems[currentFeaturedIndex].calories} Calories
              </p>
              <p className="text-sm">
                Additional Price: $
                {seasonalFeaturedItems[currentFeaturedIndex].additionalPrice}
              </p>
            </Card>
          </div>
        )}

        {/* Sellable Meals Section */}
        <div className="grid grid-cols-2 gap-2 w-full">
          {sellableMeals.map((sellable) => (
            <Card
              key={sellable.name}
              isHoverable
              isPressable
              className="flex flex-col items-center justify-center text-center"
            >
              <Image
                alt={sellable.name}
                height={80}
                src={
                  sellablesImages.find((img) => img.name === sellable.name)
                    ?.image || "/images/appetizers.png"
                }
                width={100}
              />
              <div>
                <h3 className="font-semibold">{sellable.name}</h3>
                <p>Price: ${sellable.price}</p>
                <p className="text-gray-500">
                  Items Included:{" "}
                  {sellable.SellableComponents.map((component, index) => {
                    const amount = component.amount ?? 1;
                    const itemFeature = component.ItemFeature as {
                      name: string;
                    };

                    return (
                      <span key={index}>
                        {amount} {itemFeature.name}
                        {index < sellable.SellableComponents.length - 1
                          ? ", "
                          : ""}
                      </span>
                    );
                  })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Section: Appetizers & Drinks ----------------------- use drink as testing, change to appetizer later */}

      <div className="col-span-1 flex flex-col space-y-8">
        {/* Appetizers Section */}
        {appetizersLoading ? (
          <Spinner />
        ) : (
          <div>
            <h2 className="text-xl font-bold text-center">Appetizers</h2>
            <div className="flex flex-col space-y-2">
              {appetizersItems
                .slice(currentAppetizersIndex, currentAppetizersIndex + 2)
                .map((app) => (
                  <Card
                    key={app.name}
                    isHoverable
                    isPressable
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <Image
                      alt={app.name}
                      height={100}
                      src={
                        itemsImages.find((img) => img.name === app.name)
                          ?.image || "/images/appetizers.png"
                      }
                      width={100}
                    />
                    <div>
                      <h3 className="font-semibold">{app.name}</h3>
                      <p className="text-gray-500">{app.calories} Calories</p>
                      <p>Additional Price: ${app.additionalPrice}</p>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Drinks Section */}
        {drinksLoading ? (
          <Spinner />
        ) : (
          <div>
            <h2 className="text-xl font-bold text-center">Drinks</h2>
            <div className="flex flex-col space-y-2">
              {drinksItems
                .slice(currentDrinksIndex, currentDrinksIndex + 2)
                .map((drink) => (
                  <Card
                    key={drink.name}
                    isHoverable
                    isPressable
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <Image
                      alt={drink.name}
                      height={100}
                      src={
                        itemsImages.find((img) => img.name === drink.name)
                          ?.image || "/images/appetizers.png"
                      }
                      width={100}
                    />
                    <div>
                      <h3 className="font-semibold">{drink.name}</h3>
                      <p className="text-gray-500">{drink.calories} Calories</p>
                      <p>Additional Price: ${drink.additionalPrice}</p>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuBoard;
