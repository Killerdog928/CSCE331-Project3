import { ItemCreationAttributes } from "@/server/db/types";

/**
 * An array of items to populate the database.
 * Each item includes details such as name, additional price, calories, features, and inventory information.
 *
 * @type {ItemCreationAttributes[]}
 *
 * @property {string} name - The name of the item.
 * @property {number} additionalPrice - The additional price for the item.
 * @property {number} calories - The number of calories in the item.
 * @property {Array<{ name: string }>} ItemFeatures - An array of features associated with the item.
 * @property {Object} InventoryItem - Inventory details for the item.
 * @property {number} InventoryItem.servingsPerStock - The number of servings per stock unit.
 * @property {number} InventoryItem.currentStock - The current stock level.
 * @property {number} InventoryItem.minStock - The minimum stock level.
 * @property {number} InventoryItem.maxStock - The maximum stock level.
 * @property {Date} [deletedAt] - The date when the item was deleted, if applicable.
 */
export const items2: ItemCreationAttributes[] = [
  {
    name: "SweetFire Chicken Breast",
    additionalPrice: 0,
    calories: 360,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Spicy" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Beijing Beef",
    additionalPrice: 0,
    calories: 480,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Spicy" },
      { name: "Entree" },
      { name: "Beef" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 40,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Beijing Beef Kids",
    additionalPrice: 0,
    calories: 360,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Spicy" },
      { name: "Kids" },
      { name: "Entree" },
      { name: "Beef" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 20,
      minStock: 5,
      maxStock: 50,
    },
  },
  {
    name: "Black Pepper Sirloin Steak",
    additionalPrice: 1.5,
    calories: 210,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Entree" },
      { name: "Beef" },
    ],
    InventoryItem: {
      servingsPerStock: 8,
      currentStock: 30,
      minStock: 8,
      maxStock: 80,
    },
  },
  {
    name: "Black Pepper Sirloin Steak Kids",
    additionalPrice: 1,
    calories: 160,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Kids" },
      { name: "Entree" },
      { name: "Beef" },
    ],
    InventoryItem: {
      servingsPerStock: 4,
      currentStock: 15,
      minStock: 4,
      maxStock: 40,
    },
  },
  {
    name: "Broccoli Beef",
    additionalPrice: 0,
    calories: 290,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Healthy" },
      { name: "Entree" },
      { name: "Beef" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Broccoli Beef Kids",
    additionalPrice: 0,
    calories: 220,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Healthy" },
      { name: "Kids" },
      { name: "Entree" },
      { name: "Beef" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 20,
      minStock: 5,
      maxStock: 50,
    },
  },
  {
    name: "Honey Walnut Shrimp",
    additionalPrice: 0,
    calories: 410,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Tree Nuts" },
      { name: "Dairy" },
      { name: "Egg" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 40,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Honey Walnut Shrimp Kids",
    additionalPrice: 0,
    calories: 310,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Tree Nuts" },
      { name: "Dairy" },
      { name: "Egg" },
      { name: "Kids" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 20,
      minStock: 5,
      maxStock: 50,
    },
  },
  {
    name: "Chicken Egg Roll",
    additionalPrice: 0,
    calories: 200,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Dairy" },
      { name: "Egg" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Cream Cheese Rangoon",
    additionalPrice: 0,
    calories: 330,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Dairy" },
      { name: "Vegetarian" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Vegetable Spring Roll",
    additionalPrice: 0,
    calories: 250,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Vegetarian" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Apple Pie Roll",
    additionalPrice: 0,
    calories: 330,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Dairy" },
      { name: "Egg" },
      { name: "Vegetarian" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Bottled Water",
    additionalPrice: 0,
    calories: 0,
    ItemFeatures: [{ name: "Drink" }],
    InventoryItem: {
      servingsPerStock: 20,
      currentStock: 100,
      minStock: 20,
      maxStock: 200,
    },
  },
  {
    name: "Small Drink",
    additionalPrice: 0,
    calories: 0,
    ItemFeatures: [{ name: "Drink" }],
    InventoryItem: {
      servingsPerStock: 20,
      currentStock: 100,
      minStock: 20,
      maxStock: 200,
    },
  },
  {
    name: "Medium Drink",
    additionalPrice: 0,
    calories: 0,
    ItemFeatures: [{ name: "Drink" }],
    InventoryItem: {
      servingsPerStock: 20,
      currentStock: 100,
      minStock: 20,
      maxStock: 200,
    },
  },
  {
    name: "Large Drink",
    additionalPrice: 0,
    calories: 0,
    ItemFeatures: [{ name: "Drink" }],
    InventoryItem: {
      servingsPerStock: 20,
      currentStock: 100,
      minStock: 20,
      maxStock: 200,
    },
  },
  {
    name: "Kids Drink",
    additionalPrice: 0,
    calories: 0,
    ItemFeatures: [{ name: "Drink" }],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Kids Water",
    additionalPrice: 0,
    calories: 0,
    ItemFeatures: [{ name: "Drink" }],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Chow Fun",
    additionalPrice: 0,
    calories: 205,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Dairy" },
      { name: "Side" },
      { name: "Vegetarian" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 0,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Chow Fun Kids",
    additionalPrice: 0,
    calories: 150,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Dairy" },
      { name: "Kids" },
      { name: "Side" },
      { name: "Vegetarian" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 0,
      minStock: 5,
      maxStock: 50,
    },
  },
  {
    name: "Teriyaki Chicken",
    additionalPrice: 0,
    calories: 340,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 0,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Teriyaki Chicken Kids",
    additionalPrice: 0,
    calories: 250,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Kids" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 0,
      minStock: 5,
      maxStock: 50,
    },
  },
  {
    name: "Potato Chicken",
    additionalPrice: 0,
    calories: 190,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Healthy" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 0,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Potato Chicken Kids",
    additionalPrice: 0,
    calories: 140,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Healthy" },
      { name: "Kids" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 0,
      minStock: 5,
      maxStock: 50,
    },
  },
  {
    name: "Sweet & Sour Chicken Breast",
    additionalPrice: 0,
    calories: 300,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Healthy" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 0,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Sweet & Sour Chicken Breast Kids",
    additionalPrice: 0,
    calories: 220,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Healthy" },
      { name: "Kids" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 0,
      minStock: 5,
      maxStock: 50,
    },
  },
  {
    name: "Chili Crisp Shrimp",
    additionalPrice: 0,
    calories: 220,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Fish/Shellfish" },
      { name: "Healthy" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 0,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Chili Crisp Shrimp Kids",
    additionalPrice: 0,
    calories: 180,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Fish/Shellfish" },
      { name: "Healthy" },
      { name: "Kids" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 0,
      minStock: 5,
      maxStock: 50,
    },
  },
  {
    name: "Wok-Fired Shrimp",
    additionalPrice: 0,
    calories: 210,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Fish/Shellfish" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 0,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Wok-Fired Shrimp Kids",
    additionalPrice: 0,
    calories: 160,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Fish/Shellfish" },
      { name: "Kids" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 0,
      minStock: 5,
      maxStock: 50,
    },
  },
  {
    name: "Golden Treasure Shrimp",
    additionalPrice: 0,
    calories: 220,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Fish/Shellfish" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 0,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Golden Treasure Shrimp Kids",
    additionalPrice: 0,
    calories: 180,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Fish/Shellfish" },
      { name: "Kids" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 0,
      minStock: 5,
      maxStock: 50,
    },
  },
  {
    name: "Steamed Ginger Fish",
    additionalPrice: 0,
    calories: 190,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Fish/Shellfish" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 0,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Steamed Ginger Fish Kids",
    additionalPrice: 0,
    calories: 140,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Fish/Shellfish" },
      { name: "Kids" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 0,
      minStock: 5,
      maxStock: 50,
    },
  },
  {
    name: "Chicken Potstickers",
    additionalPrice: 0,
    calories: 200,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 0,
      minStock: 10,
      maxStock: 100,
    },
  },
  {
    name: "Apple Slices",
    additionalPrice: 0,
    calories: 50,
    deletedAt: new Date(), // assuming current datetime
    ItemFeatures: [{ name: "Vegetarian" }, { name: "Side" }],
  },
];
