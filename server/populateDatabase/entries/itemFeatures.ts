import { CreationAttributes } from "sequelize";

import { ItemFeature } from "@/db";

/**
 * An array of item features used to populate the database.
 * Each feature has a name, an importance level, and a flag indicating if it is a primary feature.
 *
 * @constant
 * @type {CreationAttributes<ItemFeature>[]}
 *
 * @property {string} name - The name of the item feature.
 * @property {number} importance - The importance level of the item feature.
 * @property {boolean} is_primary - Indicates if the item feature is primary.
 */
export const itemFeatures: CreationAttributes<ItemFeature>[] = [
  { name: "Featured", importance: 0, is_primary: true },

  { name: "Seasonal", importance: 1, is_primary: true },

  { name: "Kids", importance: 2, is_primary: true },

  { name: "Entree", importance: 3, is_primary: true },
  { name: "Side", importance: 3, is_primary: true },
  { name: "Appetizer", importance: 3, is_primary: true },
  { name: "Drink", importance: 3, is_primary: true },

  { name: "Vegetarian", importance: 4, is_primary: false },
  { name: "Healthy", importance: 4, is_primary: false },
  { name: "Spicy", importance: 4, is_primary: false },

  { name: "Chicken", importance: 4, is_primary: false },
  { name: "Beef", importance: 4, is_primary: false },
  { name: "Egg", importance: 4, is_primary: false },
  { name: "Pork", importance: 4, is_primary: false },
  { name: "Fish/Shellfish", importance: 4, is_primary: false },
  { name: "Dairy", importance: 4, is_primary: false },
  { name: "Gluten", importance: 4, is_primary: false },
  { name: "Soy", importance: 4, is_primary: false },
  { name: "Peanuts", importance: 4, is_primary: false },
  { name: "Tree Nuts", importance: 4, is_primary: false },
];
