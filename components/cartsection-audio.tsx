import { Button, Card } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import { OrderCreationAttributes } from "@/server/db/types";

interface Item {
  id?: number;
  name?: string;
}

interface Sellable {
  id?: number;
  name: string;
}

interface SoldSellable {
  Items: Item[];
  Sellable: Sellable;
}

interface CartItem {
  customerName: string;
  totalPrice: number;
  Employee: { id: number } | { name: string };
  SoldSellables: SoldSellable[];
}

interface CartSectionProps {
  cartItems: OrderCreationAttributes[];
  currentCartIndex: number;
  setCurrentCartIndex: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * CartSection component displays the cart items and allows navigation between them.
 *
 * @param {CartSectionProps} props - The properties for the CartSection component.
 * @param {CartItem[]} props.cartItems - The list of cart items to display.
 * @param {number} props.currentCartIndex - The index of the currently displayed cart item.
 * @param {React.Dispatch<React.SetStateAction<number>>} props.setCurrentCartIndex - Function to set the current cart index.
 *
 * @returns {JSX.Element} The rendered CartSection component.
 *
 * @component
 *
 * @example
 * const cartItems = [
 *   {
 *     customerName: "John Doe",
 *     totalPrice: 100.0,
 *     SoldSellables: [
 *       {
 *         Sellable: { name: "Product A" },
 *         Items: [{ id: 1, name: "Item 1" }, { id: 2, name: "Item 2" }]
 *       }
 *     ]
 *   }
 * ];
 * const [currentCartIndex, setCurrentCartIndex] = useState(0);
 *
 * <CartSection
 *   cartItems={cartItems}
 *   currentCartIndex={currentCartIndex}
 *   setCurrentCartIndex={setCurrentCartIndex}
 * />
 */
const CartSection: React.FC<CartSectionProps> = ({
  cartItems,
  currentCartIndex,
  setCurrentCartIndex,
}) => {
  const [resolvedCartItems, setResolvedCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const resolveNames = async () => {
      try {
        const updatedCartItems = await Promise.all(
          cartItems.map(async (cartItem) => {
            const resolvedSoldSellables = await Promise.all(
              cartItem.SoldSellables.map(async (sellable: any) => {
                const resolvedItems = await Promise.all(
                  sellable.Items.map(async (item: any) => {
                    if (!item.name && item.id) {
                      try {
                        const response = await fetch(`/api/items/${item.id}`);

                        if (response.ok) {
                          const fetchedItem = await response.json();

                          return { ...item, name: fetchedItem.name };
                        }
                      } catch (error) {
                        console.error(
                          `Error fetching item with ID ${item.id}:`,
                          error,
                        );
                      }
                    }

                    return item;
                  }),
                );

                return { ...sellable, Items: resolvedItems };
              }),
            );

            return { ...cartItem, SoldSellables: resolvedSoldSellables };
          }),
        );

        setResolvedCartItems(updatedCartItems as CartItem[]);
      } catch (error) {
        console.error("Error resolving item names:", error);
      }
    };

    resolveNames();
  }, [cartItems]);

  const currentCartItem = resolvedCartItems[currentCartIndex] || null;

  return (
    <div className="text-left mt-10">
      <div className="border border-gray-300 rounded-lg bg-white shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Cart</h2>
        {currentCartItem ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <Button
                disabled={currentCartIndex === 0}
                size="sm"
                onClick={() => setCurrentCartIndex(currentCartIndex - 1)}
              >
                Previous
              </Button>
              <span>
                Item {currentCartIndex + 1} of {resolvedCartItems.length}
              </span>
              <Button
                disabled={currentCartIndex === resolvedCartItems.length - 1}
                size="sm"
                onClick={() => setCurrentCartIndex(currentCartIndex + 1)}
              >
                Next
              </Button>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Customer: {currentCartItem.customerName}
              </h3>
              <p className="text-lg mb-4">
                Total Price: ${currentCartItem.totalPrice.toFixed(2)}
              </p>
              <div className="grid grid-cols-1 gap-4">
                {currentCartItem.SoldSellables.map(
                  (sellable, sellableIndex) => (
                    <div key={sellableIndex} className="border p-4 rounded-lg">
                      <h4 className="text-lg font-semibold">
                        Sellable: {sellable.Sellable.name || "Unknown"}
                      </h4>
                      <div className="mt-2">
                        <h5 className="font-semibold mb-2">Items:</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {sellable.Items.map((item, itemIndex) => (
                            <Card
                              key={itemIndex}
                              className="p-4 flex flex-col items-center text-center"
                            >
                              <h6 className="text-md font-semibold">
                                {item.name || "Unknown"}
                              </h6>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>No items in the cart.</p>
        )}
      </div>
    </div>
  );
};

export default CartSection;
