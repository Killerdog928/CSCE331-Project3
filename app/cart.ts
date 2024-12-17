// // cart.ts

import { Cart, Sellable } from "./types";

/**
 * Utility class for managing a shopping cart.
 *
 * @class CartUtility
 * @private {Cart} cart - The current cart object.
 * @private {number} nextId - The next unique ID to be assigned to a sellable.
 *
 * @constructor
 * Initializes a new instance of the CartUtility class.
 * Loads the cart from local storage if available.
 *
 * @method addSellable
 * Adds a new sellable item to the cart.
 * @param {string} type - The type of the sellable item.
 * @param {string[]} items - The list of item names to be added.
 *
 * @method editSellable
 * Edits an existing sellable item in the cart by its ID.
 * @param {number} id - The ID of the sellable item to be edited.
 * @param {string} type - The new type of the sellable item.
 * @param {string[]} items - The new list of item names.
 *
 * @method removeSellableById
 * Removes a sellable item from the cart by its ID.
 * @param {number} id - The ID of the sellable item to be removed.
 *
 * @method getCart
 * Retrieves the current cart object.
 * @returns {Cart} The current cart object.
 *
 * @method clearCart
 * Clears all items from the cart.
 *
 * @method saveCartToLocalStorage
 * Saves the current cart object to local storage.
 *
 * @method loadCartFromLocalStorage
 * Loads the cart object from local storage if available.
 * Restores the next unique ID based on the existing sellables.
 */
class CartUtility {
  private cart: Cart;
  private nextId: number; // For generating unique IDs

  constructor() {
    this.cart = { sellables: [] };
    this.nextId = 1; // Initialize nextId
    this.loadCartFromLocalStorage();
  }

  // Add a sellable with items to the cart
  addSellable(type: string, items: string[]) {
    const newSellable: Sellable = {
      id: this.nextId++, // Assign a unique ID
      type,
      items: items.map((itemName) => ({ name: itemName })),
    };

    this.cart.sellables.push(newSellable);
    this.saveCartToLocalStorage();
  }

  // Edit an existing sellable by ID
  editSellable(id: number, type: string, items: string[]) {
    const sellableIndex = this.cart.sellables.findIndex(
      (sellable) => sellable.id === id,
    );

    if (sellableIndex !== -1) {
      this.cart.sellables[sellableIndex] = {
        id,
        type,
        items: items.map((itemName) => ({ name: itemName })),
      };
      this.saveCartToLocalStorage();
    } else {
      console.warn(`Sellable with ID ${id} not found.`);
    }
  }

  // Remove a sellable by ID
  removeSellableById(id: number) {
    this.cart.sellables = this.cart.sellables.filter(
      (sellable) => sellable.id !== id,
    );
    this.saveCartToLocalStorage();
  }

  // Get the current cart
  getCart(): Cart {
    return this.cart;
  }

  // Clear the cart
  clearCart() {
    this.cart.sellables = [];
    this.saveCartToLocalStorage();
  }

  // Save the cart to local storage
  private saveCartToLocalStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    }
  }

  // Load the cart from local storage
  private loadCartFromLocalStorage() {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");

      if (storedCart) {
        this.cart = JSON.parse(storedCart);
        // Restore the next ID based on the existing sellables
        this.nextId = this.cart.sellables.length
          ? Math.max(...this.cart.sellables.map((s) => s.id)) + 1
          : 1;
      }
    }
  }
}

const cartUtility = new CartUtility();

export default cartUtility;
