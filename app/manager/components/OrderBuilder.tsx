"use client";
import { Card, Button, Image } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import CartSection from "@/components/cartsection.tsx";
import WeatherDisplay from "@/components/weatherDisplay.tsx";
import {
  createOrder,
  OrderCreationAttributes,
  SoldItemCreationAttributes,
} from "@/server/db";

interface Item {
  id: number;
  name: string;
  calories?: number;
}

interface ItemFeature {
  id: number;
  name: string;
}

interface OrderBuilderProps {
  initialOrder?: OrderCreationAttributes;
  onClose: () => void; // Callback function to handle closing the modal
}

const OrderBuilder: React.FC<OrderBuilderProps> = ({
  initialOrder,
  onClose,
}) => {
  // State variables
  const [itemFeatures, setItemFeatures] = useState<ItemFeature[]>([]);
  const [includeFeatures, setIncludeFeatures] = useState<string[]>([]);
  const [excludedFeatures, setExcludedFeatures] = useState<string[]>([]);
  const [showAllMealOptions, setShowAllMealOptions] = useState(false);
  const [showFeatureFilters, setShowFeatureFilters] = useState(false);

  const [sides, setSides] = useState<Item[]>([]);
  const [entrees, setEntrees] = useState<Item[]>([]);
  const [appetizers, setAppetizers] = useState<Item[]>([]);
  const [drinks, setDrinks] = useState<Item[]>([]);

  const [loading, setLoading] = useState(true);

  // Use number keys
  const [selectedSides, setSelectedSides] = useState<Record<number, number>>(
    {},
  );
  const [selectedEntrees, setSelectedEntrees] = useState<
    Record<number, number>
  >({});
  const [selectedAppetizers, setSelectedAppetizers] = useState<
    Record<number, number>
  >({});
  const [selectedDrinks, setSelectedDrinks] = useState<Record<number, number>>(
    {},
  );
  const [selectedEntreeType, setSelectedEntreeType] = useState<string | null>(
    null,
  );
  const [cartItems, setCartItems] = useState<OrderCreationAttributes[]>(
    initialOrder ? [initialOrder] : [],
  );
  const [currentCartIndex, setCurrentCartIndex] = useState(0);

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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const isKidsMeal = selectedEntreeType === "Kids Meal";

        // Prepare a utility function to deduplicate arrays
        const deduplicate = (arr: string[]) => Array.from(new Set(arr));

        // Automatically exclude "Kids" unless it is a Kids Meal
        const defaultExcludeFeatures = isKidsMeal ? [] : ["Kids"]; // Exclude "Kids" for non-kids meals

        const mergedExcludeFeatures = deduplicate([
          ...defaultExcludeFeatures,
          ...excludedFeatures,
        ]);

        // Fetch Sides
        const sidesIncludeFeatures = deduplicate(["Side", ...includeFeatures]);
        const sidesQuery = getQueryParams(
          sidesIncludeFeatures,
          mergedExcludeFeatures,
        );
        const sidesResponse = await fetch(`/api/items?${sidesQuery}`);
        const sidesData = await sidesResponse.json();

        setSides(sidesData);

        // Fetch Entrees
        const entreesIncludeFeatures = deduplicate([
          "Entree",
          ...includeFeatures,
        ]);
        const entreesQuery = getQueryParams(
          entreesIncludeFeatures,
          mergedExcludeFeatures,
        );
        const entreesResponse = await fetch(`/api/items?${entreesQuery}`);
        const entreesData = await entreesResponse.json();

        setEntrees(entreesData);

        // Fetch Appetizers
        const appetizersIncludeFeatures = deduplicate([
          "Appetizer",
          ...includeFeatures,
        ]);
        const appetizersQuery = getQueryParams(
          appetizersIncludeFeatures,
          mergedExcludeFeatures,
        );
        const appetizersResponse = await fetch(`/api/items?${appetizersQuery}`);
        const appetizersData = await appetizersResponse.json();

        setAppetizers(appetizersData);

        // Fetch Drinks
        const drinksIncludeFeatures = deduplicate([
          "Drink",
          ...includeFeatures,
        ]);
        const drinksQuery = getQueryParams(
          drinksIncludeFeatures,
          mergedExcludeFeatures,
        );
        const drinksResponse = await fetch(`/api/items?${drinksQuery}`);
        const drinksData = await drinksResponse.json();

        setDrinks(drinksData);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedEntreeType, includeFeatures, excludedFeatures]);

  // Make sure getQueryParams is defined before fetchData
  const getQueryParams = (
    includeFeatures: string[],
    excludeFeatures: string[],
  ) => {
    const include = includeFeatures.join(",");
    const exclude = excludeFeatures.join(",");
    let params = "";

    if (include) {
      params += `includeFeatures=${encodeURIComponent(include)}`;
    }
    if (exclude) {
      params += `${params ? "&" : ""}excludeFeatures=${encodeURIComponent(exclude)}`;
    }

    return params;
  };

  // Meal options
  const mealOptions = [
    {
      id: "Bowl",
      name: "Bowl",
      description: "2 Sides & 1 Entree",
      image: "/images/bowl.png",
      components: [
        { feature: "Side", amount: 2 },
        { feature: "Entree", amount: 1 },
      ],
      isDefaultVisible: true,
    },
    {
      id: "Plate",
      name: "Plate",
      description: "2 Sides & 2 Entrees",
      image: "/images/plate.png",
      components: [
        { feature: "Side", amount: 2 },
        { feature: "Entree", amount: 2 },
      ],
      isDefaultVisible: true,
    },
    {
      id: "Bigger Plate",
      name: "Bigger Plate",
      description: "2 Sides & 3 Entrees",
      image: "/images/bigger_plate.png",
      components: [
        { feature: "Side", amount: 2 },
        { feature: "Entree", amount: 3 },
      ],
      isDefaultVisible: true,
    },
    {
      id: "Kids Meal",
      name: "Kids Meal",
      description: "2 Sides, 1 Entree, 1 Appetizer & 1 Drink",
      image: "/images/cub_meal.png",
      components: [
        { feature: "Side", amount: 2 },
        { feature: "Entree", amount: 1 },
        { feature: "Appetizer", amount: 1 },
        { feature: "Drink", amount: 1 },
      ],
      isDefaultVisible: false,
    },
    {
      id: "Family Meal",
      name: "Family Meal",
      description: "6 Sides & 9 Entrees",
      image: "/images/bundles_family.png",
      components: [
        { feature: "Side", amount: 6 },
        { feature: "Entree", amount: 9 },
      ],
      isDefaultVisible: false,
    },
    {
      id: "Small A La Carte Entree",
      name: "Small A La Carte Entree",
      description: "1 Entree",
      image: "/images/ala_carte.png",
      components: [{ feature: "Entree", amount: 1 }],
      isDefaultVisible: false,
    },
    {
      id: "Medium A La Carte Entree",
      name: "Medium A La Carte Entree",
      description: "2 Entrees",
      image: "/images/ala_carte.png",
      components: [{ feature: "Entree", amount: 2 }],
      isDefaultVisible: false,
    },
    {
      id: "Large A La Carte Entree",
      name: "Large A La Carte Entree",
      description: "3 Entrees",
      image: "/images/ala_carte.png",
      components: [{ feature: "Entree", amount: 3 }],
      isDefaultVisible: false,
    },
    {
      id: "Small A La Carte Side",
      name: "Small A La Carte Side",
      description: "2 Sides",
      image: "/images/ala_carte.png",
      components: [{ feature: "Side", amount: 2 }],
      isDefaultVisible: false,
    },
    {
      id: "Medium A La Carte Side",
      name: "Medium A La Carte Side",
      description: "4 Sides",
      image: "/images/ala_carte.png",
      components: [{ feature: "Side", amount: 4 }],
      isDefaultVisible: false,
    },
    {
      id: "Drink",
      name: "Drink",
      description: "1 Drink",
      image: "/images/drinks.png",
      components: [{ feature: "Drink", amount: 1 }],
      isDefaultVisible: true,
    },
    {
      id: "Appetizer",
      name: "Appetizer",
      description: "1 Appetizer",
      image: "/images/appetizers.png",
      components: [{ feature: "Appetizer", amount: 1 }],
      isDefaultVisible: true,
    },
    // Bowl, Plate, and Bigger Plate Bundles
    {
      id: "Bowl Bundle",
      name: "Bowl Bundle",
      description: "2 Sides, 1 Entree, 1 Drink",
      image: "/images/bowl.png",
      components: [
        { feature: "Side", amount: 2 },
        { feature: "Entree", amount: 1 },
        { feature: "Drink", amount: 1 },
      ],
      isDefaultVisible: false,
    },
    {
      id: "Plate Bundle",
      name: "Plate Bundle",
      description: "2 Sides, 2 Entrees, 1 Drink",
      image: "/images/plate.png",
      components: [
        { feature: "Side", amount: 2 },
        { feature: "Entree", amount: 2 },
        { feature: "Drink", amount: 1 },
      ],
      isDefaultVisible: false,
    },
    {
      id: "Bigger Plate Bundle",
      name: "Bigger Plate Bundle",
      description: "2 Sides, 3 Entrees, 1 Drink",
      image: "/images/bigger_plate.png",
      components: [
        { feature: "Side", amount: 2 },
        { feature: "Entree", amount: 3 },
        { feature: "Drink", amount: 1 },
      ],
      isDefaultVisible: false,
    },
  ];

  const selectedMealOption = mealOptions.find(
    (option) => option.id === selectedEntreeType,
  );
  const selectedMealComponents = selectedMealOption
    ? selectedMealOption.components.map((comp) => comp.feature)
    : [];

  // Handlers
  const getMaxQuantity = (feature: string) => {
    const component = selectedMealOption?.components.find(
      (comp) => comp.feature === feature,
    );

    return component ? component.amount : 0;
  };

  // Increment and decrement handlers for sides, entrees, appetizers, and drinks
  const handleSideIncrement = (id: number) => {
    const maxSides = getMaxQuantity("Side");
    const totalSelectedSides = Object.values(selectedSides).reduce(
      (sum, count) => sum + count,
      0,
    );

    if (totalSelectedSides < maxSides) {
      setSelectedSides((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
    }
  };

  const handleSideDecrement = (id: number) => {
    setSelectedSides((prev) => {
      if (prev[id] > 0) {
        return { ...prev, [id]: prev[id] - 1 };
      }

      return prev;
    });
  };

  const handleEntreeIncrement = (id: number) => {
    const maxEntrees = getMaxQuantity("Entree");
    const totalSelectedEntrees = Object.values(selectedEntrees).reduce(
      (sum, count) => sum + count,
      0,
    );

    if (totalSelectedEntrees < maxEntrees) {
      setSelectedEntrees((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
    }
  };

  const handleEntreeDecrement = (id: number) => {
    setSelectedEntrees((prev) => {
      if (prev[id] > 0) {
        return { ...prev, [id]: prev[id] - 1 };
      }

      return prev;
    });
  };

  const handleAppetizerIncrement = (id: number) => {
    const maxAppetizers = getMaxQuantity("Appetizer");
    const totalSelectedAppetizers = Object.values(selectedAppetizers).reduce(
      (sum, count) => sum + count,
      0,
    );

    if (totalSelectedAppetizers < maxAppetizers) {
      setSelectedAppetizers((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
    }
  };

  const handleAppetizerDecrement = (id: number) => {
    setSelectedAppetizers((prev) => {
      if (prev[id] > 0) {
        return { ...prev, [id]: prev[id] - 1 };
      }

      return prev;
    });
  };

  const handleDrinkIncrement = (id: number) => {
    const maxDrinks = getMaxQuantity("Drink");
    const totalSelectedDrinks = Object.values(selectedDrinks).reduce(
      (sum, count) => sum + count,
      0,
    );

    if (totalSelectedDrinks < maxDrinks) {
      setSelectedDrinks((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
    }
  };

  const handleDrinkDecrement = (id: number) => {
    setSelectedDrinks((prev) => {
      if (prev[id] > 0) {
        return { ...prev, [id]: prev[id] - 1 };
      }

      return prev;
    });
  };

  const handleEntreeTypeSelect = (id: string) => {
    setSelectedEntreeType(id);
    setSelectedSides({});
    setSelectedEntrees({});
    setSelectedAppetizers({});
    setSelectedDrinks({});
  };

  const handleAddToCart = async () => {
    if (selectedEntreeType) {
      try {
        const selectedSideItems = Object.keys(selectedSides).flatMap((key) => {
          const keyNumber = Number(key);
          const count = selectedSides[keyNumber];
          const item = sides.find((side) => side.id === keyNumber);

          if (!item) {
            console.error(`Side item with id ${keyNumber} not found.`);

            return [];
          }

          return Array(count).fill(item);
        });

        const selectedEntreeItems = Object.keys(selectedEntrees).flatMap(
          (key) => {
            const keyNumber = Number(key);
            const count = selectedEntrees[keyNumber];
            const item = entrees.find((entree) => entree.id === keyNumber);

            if (!item) {
              console.error(`Entree item with id ${keyNumber} not found.`);

              return [];
            }

            return Array(count).fill(item);
          },
        );

        const selectedAppetizerItems = Object.keys(selectedAppetizers).flatMap(
          (key) => {
            const keyNumber = Number(key);
            const count = selectedAppetizers[keyNumber];
            const item = appetizers.find(
              (appetizer) => appetizer.id === keyNumber,
            );

            if (!item) {
              console.error(`Appetizer item with id ${keyNumber} not found.`);

              return [];
            }

            return Array(count).fill(item);
          },
        );

        const selectedDrinkItems = Object.keys(selectedDrinks).flatMap(
          (key) => {
            const keyNumber = Number(key);
            const count = selectedDrinks[keyNumber];
            const item = drinks.find((drink) => drink.id === keyNumber);

            if (!item) {
              console.error(`Drink item with id ${keyNumber} not found.`);

              return [];
            }

            return Array(count).fill(item);
          },
        );

        const allItems = [
          ...selectedSideItems,
          ...selectedEntreeItems,
          ...selectedAppetizerItems,
          ...selectedDrinkItems,
        ];

        // Filter out any undefined items
        const validItems = allItems.filter((item) => item !== undefined);
        // Prepare order structure
        const orderStructure: OrderCreationAttributes = {
          customerName: "Customer Name", // Replace with dynamic customer input
          totalPrice: 10, // Replace with calculated total price
          Employee: { id: 1 }, // Ensure this matches WhereOptions<Employee>
          SoldSellables: [
            {
              SoldItems: validItems.reduce((acc, item) => {
                const existingItem = acc.find(
                  (i: SoldItemCreationAttributes) => i.ItemId === item.id,
                );

                if (existingItem) {
                  existingItem.amount += 1;
                } else {
                  acc.push({
                    ItemId: item.id,
                    amount: 1,
                  } as SoldItemCreationAttributes);
                }

                return acc;
              }, [] as SoldItemCreationAttributes),
              Sellable: { name: selectedEntreeType }, // Replace with resolved Sellable
            },
          ],
        };

        // Update cartItems state
        setCartItems((prev) => [...prev, orderStructure]);
        setCurrentCartIndex(cartItems.length);
        alert("Items added to cart successfully!");
      } catch (error) {
        console.error("Error assembling order structure:", error);
        alert("Failed to add items to cart. Please try again.");
      }
    } else {
      alert("Please select a meal type before adding to cart.");
    }
  };

  const handleSubmitOrder = async () => {
    try {
      const orderJson = await createOrder(cartItems[currentCartIndex]);

      console.log("Order submitted successfully:", orderJson);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  // Render
  const [customerName, setCustomerName] = useState<string>(""); // Stores the customer name
  const [employeeId, setEmployeeId] = useState<string>(""); // Stores the employee ID as a string
  const [totalPrice, setTotalPrice] = useState<number>(0); // Stores the total price, editable by the user

  return (
    <div>
      <div className="text-left mb-4">
        {/* Checkbox to Show/Hide Feature Filters */}
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
            {itemFeatures.map((feature) => {
              const isIncluded = includeFeatures.includes(feature.name);
              const isExcluded = excludedFeatures.includes(feature.name);

              const handleClick = (action: "include" | "exclude") => {
                if (action === "include") {
                  if (isIncluded) {
                    setIncludeFeatures(
                      includeFeatures.filter((f) => f !== feature.name),
                    );
                  } else {
                    setIncludeFeatures([...includeFeatures, feature.name]);
                    setExcludedFeatures(
                      excludedFeatures.filter((f) => f !== feature.name),
                    );
                  }
                } else if (action === "exclude") {
                  if (isExcluded) {
                    setExcludedFeatures(
                      excludedFeatures.filter((f) => f !== feature.name),
                    );
                  } else {
                    setExcludedFeatures([...excludedFeatures, feature.name]);
                    setIncludeFeatures(
                      includeFeatures.filter((f) => f !== feature.name),
                    );
                  }
                }
              };

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
                      onClick={() => handleClick("exclude")}
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
                      onClick={() => handleClick("include")}
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
      {/* Meal Type Selection */}
      <div className="text-left mb-12">
        <h2 className="text-2xl font-semibold mb-4">Select Your Meal Type</h2>

        {/* Toggle to show/hide additional meal options */}
        <div className="flex items-center mb-4">
          <input
            checked={showAllMealOptions}
            id="toggleMealOptions"
            type="checkbox"
            onChange={(e) => setShowAllMealOptions(e.target.checked)}
          />
          <label className="ml-2" htmlFor="toggleMealOptions">
            Show all meal options
          </label>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {mealOptions
            .filter((option) => option.isDefaultVisible || showAllMealOptions)
            .map((option) => (
              <Card
                key={option.id}
                isHoverable
                isPressable
                className={`p-4 flex flex-col items-center text-center cursor-pointer border ${
                  selectedEntreeType === option.id
                    ? "border-[#D62300]"
                    : "border-gray-300"
                }`}
                onClick={() => handleEntreeTypeSelect(option.id)}
              >
                <Image
                  alt={option.name}
                  height={100}
                  src={option.image}
                  width={100}
                />
                <h3 className="text-xl font-semibold mt-2">{option.name}</h3>
                <p className="text-gray-600">{option.description}</p>
              </Card>
            ))}
        </div>
      </div>

      {/* Sides Section */}
      {selectedMealComponents.includes("Side") && (
        <div className="text-left mb-12">
          <h2 className="text-2xl font-semibold mb-2">Sides</h2>
          {loading ? (
            <p>Loading...</p>
          ) : sides.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {sides.map((side) => {
                const count = selectedSides[side.id] || 0;

                return (
                  <Card
                    key={side.id}
                    className="p-4 flex flex-col items-center text-center"
                  >
                    <h3 className="text-xl font-semibold">{side.name}</h3>
                    <p className="text-gray-600">{side.calories} Cal</p>
                    <div className="flex items-center mt-2">
                      <Button
                        disabled={count === 0}
                        size="sm"
                        onClick={() => handleSideDecrement(side.id)}
                      >
                        -
                      </Button>
                      <span className="mx-2">{count}</span>
                      <Button
                        size="sm"
                        onClick={() => handleSideIncrement(side.id)}
                      >
                        +
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p>No sides available.</p>
          )}
        </div>
      )}

      {/* Entrees Section */}
      {selectedMealComponents.includes("Entree") && (
        <div className="text-left mb-12">
          <h2 className="text-2xl font-semibold mb-2">Entrees</h2>
          {loading ? (
            <p>Loading...</p>
          ) : entrees.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {entrees.map((entree) => {
                const count = selectedEntrees[entree.id] || 0;

                return (
                  <Card
                    key={entree.id}
                    className="p-4 flex flex-col items-center text-center"
                  >
                    <h3 className="text-xl font-semibold">{entree.name}</h3>
                    <p className="text-gray-600">{entree.calories} Cal</p>
                    <div className="flex items-center mt-2">
                      <Button
                        disabled={count === 0}
                        size="sm"
                        onClick={() => handleEntreeDecrement(entree.id)}
                      >
                        -
                      </Button>
                      <span className="mx-2">{count}</span>
                      <Button
                        size="sm"
                        onClick={() => handleEntreeIncrement(entree.id)}
                      >
                        +
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p>No entrees available.</p>
          )}
        </div>
      )}

      {/* Appetizers Section */}
      {selectedMealComponents.includes("Appetizer") && (
        <div className="text-left mb-12">
          <h2 className="text-2xl font-semibold mb-2">Appetizers</h2>
          {loading ? (
            <p>Loading...</p>
          ) : appetizers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {appetizers.map((appetizer) => {
                const count = selectedAppetizers[appetizer.id] || 0;

                return (
                  <Card
                    key={appetizer.id}
                    className="p-4 flex flex-col items-center text-center"
                  >
                    <h3 className="text-xl font-semibold">{appetizer.name}</h3>
                    <p className="text-gray-600">{appetizer.calories} Cal</p>
                    <div className="flex items-center mt-2">
                      <Button
                        disabled={count === 0}
                        size="sm"
                        onClick={() => handleAppetizerDecrement(appetizer.id)}
                      >
                        -
                      </Button>
                      <span className="mx-2">{count}</span>
                      <Button
                        size="sm"
                        onClick={() => handleAppetizerIncrement(appetizer.id)}
                      >
                        +
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p>No appetizers available.</p>
          )}
        </div>
      )}

      {/* Drinks Section */}
      {selectedMealComponents.includes("Drink") && (
        <div className="text-left mb-12">
          <h2 className="text-2xl font-semibold mb-2">Drinks</h2>
          {loading ? (
            <p>Loading...</p>
          ) : drinks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {drinks.map((drink) => {
                const count = selectedDrinks[drink.id] || 0;

                return (
                  <Card
                    key={drink.id}
                    className="p-4 flex flex-col items-center text-center"
                  >
                    <h3 className="text-xl font-semibold">{drink.name}</h3>
                    <p className="text-gray-600">{drink.calories} Cal</p>
                    <div className="flex items-center mt-2">
                      <Button
                        disabled={count === 0}
                        size="sm"
                        onClick={() => handleDrinkDecrement(drink.id)}
                      >
                        -
                      </Button>
                      <span className="mx-2">{count}</span>
                      <Button
                        size="sm"
                        onClick={() => handleDrinkIncrement(drink.id)}
                      >
                        +
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p>No drinks available.</p>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="flex justify-center mb-10">
        <Button
          className="bg-[#D62300] text-white w-48 shadow-lg"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>

      {/* Cart Section */}
      <CartSection
        // @ts-ignore
        cartItems={cartItems}
        currentCartIndex={currentCartIndex}
        setCurrentCartIndex={setCurrentCartIndex}
      />

      {/* Submit Order Button */}
      <Button className="my-5" onClick={handleSubmitOrder}>
        Submit Order (BROKEN, STILL WIP)
      </Button>
      <div className="mb-4">
        <label className="block text-sm font-medium" htmlFor="customerName">
          Customer Name
        </label>
        <input
          className="w-full p-2 border rounded"
          id="customerName"
          placeholder="Enter customer name"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium" htmlFor="employeeId">
          Employee ID
        </label>
        <input
          className="w-full p-2 border rounded"
          id="employeeId"
          placeholder="Enter employee ID"
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium" htmlFor="totalPrice">
          Total Price
        </label>
        <input
          className="w-full p-2 border rounded"
          id="totalPrice"
          placeholder="Enter total price"
          type="number"
          value={totalPrice}
          onChange={(e) => setTotalPrice(parseFloat(e.target.value) || 0)}
        />
      </div>

      {/* Weather Display at the Top-Left Corner */}
      <div>
        <WeatherDisplay />
      </div>
      <Button onClick={onClose}>Close</Button>
    </div>
  );
};

export default OrderBuilder;
