import React, { useState, useEffect } from "react";

interface SoldItemCreationAttributes {
  ItemId: number;
  amount: number;
}

interface SoldSellableCreationAttributes {
  SoldItems: SoldItemCreationAttributes[];
  Sellable: {
    name: string;
  };
}

interface OrderCreationAttributes {
  customerName: string;
  totalPrice: number;
  Employee: { id: number };
  SoldSellables: SoldSellableCreationAttributes[];
}

interface CartSectionProps {
  cartItems: OrderCreationAttributes[];
  currentCartIndex: number;
  setCurrentCartIndex: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * CartSection component displays a list of cart items with navigation controls to move between different cart items.
 *
 * @component
 * @param {CartSectionProps} props - The props for the CartSection component.
 * @param {OrderCreationAttributes[]} props.cartItems - The list of cart items to display.
 * @param {number} props.currentCartIndex - The current index of the cart item being displayed.
 * @param {React.Dispatch<React.SetStateAction<number>>} props.setCurrentCartIndex - Function to set the current cart index.
 *
 * @returns {JSX.Element} The rendered CartSection component.
 *
 * @example
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
  const [resolvedCartItems, setResolvedCartItems] = useState<
    OrderCreationAttributes[]
  >([]);
  const [itemNameMap, setItemNameMap] = useState<Map<number, string>>(
    new Map(),
  );
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch item name by ItemId
  const fetchItemName = async (itemId: number) => {
    try {
      const response = await fetch(`/api/items/${itemId}`);
      const data = await response.json();

      return data.name;
    } catch (error) {
      console.error("Error fetching item name:", error);

      return `Item ${itemId}`;
    }
  };

  useEffect(() => {
    const resolveNames = async () => {
      const updatedCartItems = await Promise.all(
        cartItems.map(async (order: OrderCreationAttributes) => {
          const resolvedSoldSellables = await Promise.all(
            order.SoldSellables.map(async (soldSellable) => {
              const resolvedItems = await Promise.all(
                soldSellable.SoldItems.map(async (soldItem) => {
                  if (!itemNameMap.has(soldItem.ItemId)) {
                    const itemName = await fetchItemName(soldItem.ItemId);

                    setItemNameMap(
                      (prevMap) =>
                        new Map(prevMap.set(soldItem.ItemId, itemName)),
                    );
                  }

                  return soldItem;
                }),
              );

              return {
                ...soldSellable,
                SoldItems: resolvedItems,
              };
            }),
          );

          return {
            ...order,
            SoldSellables: resolvedSoldSellables,
          };
        }),
      );

      setResolvedCartItems(updatedCartItems);
      setLoading(false);
    };

    resolveNames();
  }, [cartItems, itemNameMap]);

  const handleNext = () => {
    if (currentCartIndex < resolvedCartItems.length - 1) {
      setCurrentCartIndex(currentCartIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCartIndex > 0) {
      setCurrentCartIndex(currentCartIndex - 1);
    }
  };

  if (loading || !resolvedCartItems[currentCartIndex])
    return <div>Loading...</div>;

  const currentCartItem = resolvedCartItems[currentCartIndex];

  return (
    <div className="text-left mt-10">
      <h2 className="text-2xl font-semibold mb-4">Cart</h2>
      {currentCartItem ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <button
              className="btn btn-sm"
              disabled={currentCartIndex === 0}
              onClick={handlePrevious}
            >
              Previous
            </button>
            <span>
              Item {currentCartIndex + 1} of {resolvedCartItems.length}
            </span>
            <button
              className="btn btn-sm"
              disabled={currentCartIndex === resolvedCartItems.length - 1}
              onClick={handleNext}
            >
              Next
            </button>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Customer: {currentCartItem.customerName}
            </h3>
            <p className="text-lg mb-4">
              Total Price: ${currentCartItem.totalPrice.toFixed(2)}
            </p>
            <div className="grid grid-cols-1 gap-4">
              {currentCartItem.SoldSellables.map((sellable, sellableIndex) => (
                <div key={sellableIndex} className="border p-4 rounded-lg">
                  <h4 className="text-lg font-semibold">
                    Sellable: {sellable.Sellable.name || "Unknown"}
                  </h4>
                  <div className="mt-2">
                    <h5 className="font-semibold mb-2">Items:</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {sellable.SoldItems.map((soldItem, itemIndex) => {
                        // Lookup the item name from the map
                        const itemName =
                          itemNameMap.get(soldItem.ItemId) ||
                          `Item ${soldItem.ItemId}`;

                        return (
                          <div
                            key={itemIndex}
                            className="card p-4 flex flex-col items-center text-center"
                          >
                            <h6 className="text-md font-semibold">
                              {itemName}
                            </h6>
                            <p>Amount: {soldItem.amount}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>No items in the cart.</p>
      )}
    </div>
  );
};

export default CartSection;
