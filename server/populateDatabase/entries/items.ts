import { ItemCreationAttributes } from "@/server/db/types";

/**
 * An array of items to populate the database with initial data.
 * Each item represents a menu item with its attributes and inventory details.
 *
 * @type {ItemCreationAttributes[]}
 *
 * @property {string} name - The name of the item.
 * @property {number} additionalPrice - The additional price for the item.
 * @property {number} calories - The calorie count of the item.
 * @property {Array<{ name: string }>} ItemFeatures - An array of features associated with the item.
 * @property {Object} InventoryItem - The inventory details of the item.
 * @property {number} InventoryItem.servingsPerStock - The number of servings per stock unit.
 * @property {number} InventoryItem.currentStock - The current stock level.
 * @property {number} InventoryItem.minStock - The minimum stock level.
 * @property {number} InventoryItem.maxStock - The maximum stock level.
 */
export const items: ItemCreationAttributes[] = [
  {
    name: "Chow Mein",
    additionalPrice: 0,
    calories: 300,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Side" },
      { name: "Vegetarian" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
    },
  },
  {
    name: "Fried Rice",
    additionalPrice: 0,
    calories: 310,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Egg" },
      { name: "Side" },
      { name: "Vegetarian" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
    },
  },
  {
    name: "White Steamed Rice",
    additionalPrice: 0,
    calories: 260,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Side" },
      { name: "Vegetarian" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
    },
  },
  {
    name: "Super Greens",
    additionalPrice: 0,
    calories: 65,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Vegetarian" },
      { name: "Side" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
    },
  },
  {
    name: "Chow Mein Kids",
    additionalPrice: 0,
    calories: 220,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Kids" },
      { name: "Side" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
    },
  },
  {
    name: "Fried Rice Kids",
    additionalPrice: 0,
    calories: 233,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Egg" },
      { name: "Kids" },
      { name: "Side" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
    },
  },
  {
    name: "White Steamed Rice Kids",
    additionalPrice: 0,
    calories: 195,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Kids" },
      { name: "Side" },
      { name: "Vegetarian" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
    },
  },
  {
    name: "Super Greens Kids",
    additionalPrice: 0,
    calories: 45,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Vegetarian" },
      { name: "Kids" },
      { name: "Side" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
    },
  },
  {
    name: "Super Greens Entree",
    additionalPrice: 0,
    calories: 90,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Vegetarian" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
    },
  },
  {
    name: "Super Greens Kids Entree",
    additionalPrice: 0,
    calories: 60,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Vegetarian" },
      { name: "Kids" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
    },
  },
  {
    name: "Eggplant Tofu",
    additionalPrice: 0,
    calories: 340,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Vegetarian" },
      { name: "Spicy" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
    },
  },
  {
    name: "Eggplant Tofu Kids",
    additionalPrice: 0,
    calories: 250,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Vegetarian" },
      { name: "Spicy" },
      { name: "Kids" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
    },
  },
  {
    name: "Beyond Orange Chicken",
    additionalPrice: 1.5,
    calories: 440,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Vegetarian" },
      { name: "Spicy" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
    },
  },
  {
    name: "Beyond Orange Chicken Kids",
    additionalPrice: 1,
    calories: 330,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Vegetarian" },
      { name: "Spicy" },
      { name: "Kids" },
      { name: "Entree" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
    },
  },
  {
    name: "Black Pepper Chicken",
    additionalPrice: 0,
    calories: 280,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Healthy" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
    },
  },
  {
    name: "Black Pepper Chicken Kids",
    additionalPrice: 0,
    calories: 200,
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
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
    },
  },
  {
    name: "Kung Pao Chicken",
    additionalPrice: 0,
    calories: 320,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Peanuts" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
    },
  },
  {
    name: "Kung Pao Chicken Kids",
    additionalPrice: 0,
    calories: 220,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Peanuts" },
      { name: "Kids" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
    },
  },
  {
    name: "Grilled Teriyaki Chicken",
    additionalPrice: 0,
    calories: 275,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Healthy" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
    },
  },
  {
    name: "Grilled Teriyaki Chicken Kids",
    additionalPrice: 0,
    calories: 210,
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
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
    },
  },
  {
    name: "Mushroom Chicken",
    additionalPrice: 0,
    calories: 220,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Healthy" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
    },
  },
  {
    name: "Mushroom Chicken Kids",
    additionalPrice: 0,
    calories: 170,
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
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
    },
  },
  {
    name: "Orange Chicken",
    additionalPrice: 0,
    calories: 510,
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
      minStock: 20,
      maxStock: 100,
    },
  },
  {
    name: "Orange Chicken Kids",
    additionalPrice: 0,
    calories: 380,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Dairy" },
      { name: "Egg" },
      { name: "Kids" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
    },
  },
  {
    name: "Honey Sesame Chicken Breast",
    additionalPrice: 0,
    calories: 340,
    ItemFeatures: [{ name: "Gluten" }, { name: "Entree" }, { name: "Chicken" }],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
    },
  },
  {
    name: "Honey Sesame Chicken Breast Kids",
    additionalPrice: 0,
    calories: 250,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Kids" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 5,
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
    },
  },
  {
    name: "String Bean Chicken Breast",
    additionalPrice: 0,
    calories: 210,
    ItemFeatures: [
      { name: "Gluten" },
      { name: "Soy" },
      { name: "Healthy" },
      { name: "Entree" },
      { name: "Chicken" },
    ],
    InventoryItem: {
      servingsPerStock: 10,
      currentStock: 50,
      minStock: 20,
      maxStock: 100,
    },
  },
  {
    name: "String Bean Chicken Breast Kids",
    additionalPrice: 0,
    calories: 160,
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
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
    },
  },
];