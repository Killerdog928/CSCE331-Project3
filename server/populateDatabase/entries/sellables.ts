import { SellableCreationAttributes } from "@/server/db/types";

/**
 * An array of sellable items with their attributes.
 * Each sellable item includes its name, price, categories, and components.
 * Some items may also include a deletion date.
 *
 * @constant
 * @type {SellableCreationAttributes[]}
 *
 * @property {string} name - The name of the sellable item.
 * @property {number} price - The price of the sellable item.
 * @property {Array<{ name: string }>} SellableCategories - The categories to which the sellable item belongs.
 * @property {Array<{ ItemFeature: { name: string }, amount?: number }>} SellableComponents - The components of the sellable item, each with a feature name and an optional amount.
 * @property {Date} [deletedAt] - The date when the sellable item was deleted, if applicable.
 */
export const sellables: SellableCreationAttributes[] = [
  {
    name: "Bowl",
    price: 8.3,
    SellableCategories: [{ name: "Meal" }],
    SellableComponents: [
      { ItemFeature: { name: "Side" }, amount: 2 },
      { ItemFeature: { name: "Entree" } },
    ],
  },
  {
    name: "Plate",
    price: 9.8,
    SellableCategories: [{ name: "Meal" }],
    SellableComponents: [
      { ItemFeature: { name: "Side" }, amount: 2 },
      { ItemFeature: { name: "Entree" }, amount: 2 },
    ],
  },
  {
    name: "Bigger Plate",
    price: 11.3,

    SellableCategories: [{ name: "Meal" }],
    SellableComponents: [
      { ItemFeature: { name: "Side" }, amount: 2 },
      { ItemFeature: { name: "Entree" }, amount: 3 },
    ],
  },
  {
    name: "Kids Meal",
    price: 6.6,

    SellableCategories: [{ name: "Kids Meal" }],
    SellableComponents: [
      { ItemFeature: { name: "Side" }, amount: 2 },
      { ItemFeature: { name: "Entree" } },
      { ItemFeature: { name: "Appetizer" } },
      { ItemFeature: { name: "Drink" } },
    ],
  },
  {
    name: "Bowl Bundle",
    price: 10.4,
    deletedAt: new Date(), // assuming current datetime

    SellableCategories: [{ name: "Meal" }],
    SellableComponents: [
      { ItemFeature: { name: "Side" }, amount: 2 },
      { ItemFeature: { name: "Entree" } },
      { ItemFeature: { name: "Drink" } },
    ],
  },
  {
    name: "Plate Bundle",
    price: 11.9,
    deletedAt: new Date(), // assuming current datetime

    SellableCategories: [{ name: "Meal" }],
    SellableComponents: [
      { ItemFeature: { name: "Side" }, amount: 2 },
      { ItemFeature: { name: "Entree" }, amount: 2 },
      { ItemFeature: { name: "Drink" } },
    ],
  },
  {
    name: "Bigger Plate Bundle",
    price: 13.4,
    deletedAt: new Date(), // assuming current datetime

    SellableCategories: [{ name: "Meal" }],
    SellableComponents: [
      { ItemFeature: { name: "Side" }, amount: 2 },
      { ItemFeature: { name: "Entree" }, amount: 3 },
      { ItemFeature: { name: "Drink" } },
    ],
  },
  {
    name: "Family Meal",
    price: 43,

    SellableCategories: [{ name: "Meal" }],
    SellableComponents: [
      { ItemFeature: { name: "Side" }, amount: 6 },
      { ItemFeature: { name: "Entree" }, amount: 9 },
    ],
  },
  {
    name: "Appetizer",
    price: 0,

    SellableCategories: [{ name: "Appetizer" }],
    SellableComponents: [{ ItemFeature: { name: "Appetizer" } }],
  },
  {
    name: "Drink",
    price: 0,

    SellableCategories: [{ name: "Drink" }],
    SellableComponents: [{ ItemFeature: { name: "Drink" } }],
  },
  {
    name: "Small A La Carte Entree",
    price: 5.2,

    SellableCategories: [{ name: "A la Carte" }, { name: "Entree" }],
    SellableComponents: [{ ItemFeature: { name: "Entree" } }],
  },
  {
    name: "Medium A La Carte Entree",
    price: 8.5,

    SellableCategories: [{ name: "A la Carte" }, { name: "Entree" }],
    SellableComponents: [{ ItemFeature: { name: "Entree" }, amount: 2 }],
  },
  {
    name: "Large A La Carte Entree",
    price: 11.2,

    SellableCategories: [{ name: "A la Carte" }, { name: "Entree" }],
    SellableComponents: [{ ItemFeature: { name: "Entree" }, amount: 3 }],
  },
  {
    name: "Small A La Carte Side",
    price: 4.4,

    SellableCategories: [{ name: "A la Carte" }, { name: "Side" }],
    SellableComponents: [{ ItemFeature: { name: "Side" }, amount: 2 }],
  },
  {
    name: "Medium A La Carte Side",
    price: 5.4,

    SellableCategories: [{ name: "A la Carte" }, { name: "Side" }],
    SellableComponents: [{ ItemFeature: { name: "Side" }, amount: 4 }],
  },
];
