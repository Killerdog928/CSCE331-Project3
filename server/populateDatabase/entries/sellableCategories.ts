// Adjust the path as necessary
import { SellableCategoryCreationAttributes } from "@/server/db/types";

/**
 * An array of objects representing sellable categories.
 * Each category has a name, an importance level, and optionally a thumbnail.
 *
 * @constant
 * @type {SellableCategoryCreationAttributes[]}
 *
 * @property {string} name - The name of the sellable category.
 * @property {number} importance - The importance level of the category.
 * @property {Object} [Thumbnail] - Optional thumbnail object for the category.
 * @property {string} Thumbnail.src - The source path of the thumbnail image.
 * @property {string} Thumbnail.alt - The alt text for the thumbnail image.
 */
export const sellableCategories: SellableCategoryCreationAttributes[] = [
  { name: "Featured", importance: 0 },
  { name: "Seasonal", importance: 1 },
  {
    name: "Meal",
    importance: 2,
    Thumbnail: { src: "images/plate.png", alt: "image of a plate meal" },
  },
  {
    name: "A la Carte",
    importance: 2,
    Thumbnail: {
      src: "images/ala_carte.png",
      alt: "image of an a la carte entree",
    },
  },
  {
    name: "Drink",
    importance: 2,
    Thumbnail: { src: "images/drinks.png", alt: "image of a drink" },
  },
  {
    name: "Appetizer",
    importance: 2,
    Thumbnail: { src: "images/appetizers.png", alt: "image of an appetizer" },
  },
  {
    name: "Combo",
    importance: 2,
    Thumbnail: { src: "images/bundles_family.png", alt: "image of a combo" },
  },
  {
    name: "Kids Meal",
    importance: 2,
    Thumbnail: { src: "images/cub_meal.png", alt: "image of a cub meal" },
  },

  { name: "Entree", importance: 3 },
  { name: "Side", importance: 3 },
];
