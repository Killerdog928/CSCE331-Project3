// types.ts

export type Item = {
  name: string; // Store only the item name
};

/**
 * Represents a sellable item.
 *
 * @property {number} id - The unique identifier for the sellable item.
 * @property {string} type - The type of sellable item (e.g., "bowl", "plate").
 * @property {Item[]} items - An array of items within the sellable.
 */
export type Sellable = {
  id: number;
  type: string; // Type of sellable (e.g., "bowl", "plate")
  items: Item[]; // Array of items within the sellable
};

export type Cart = {
  sellables: Sellable[]; // Array of sellables
};
