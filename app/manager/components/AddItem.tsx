import React, { useState, useEffect } from "react";

import { ItemCreationAttributes } from "@/server/db";
import { createItem } from "@/server/db/Item/create.ts";
interface ItemFeature {
  id: number;
  name: string;
}
interface NewItem {
  name: string;
  description?: string;
  InventoryItem?: {
    name: string;
    stock: number;
    price: number;
    servingsPerStock?: number;
    currentStock?: number;
    minStock?: number;
    maxStock?: number;
  };
  ItemFeatures?: number[];
  calories?: number; // Include calories
  Thumbnail?: File;
}

/**
 * NewItemForm component allows users to create a new item by filling out a form.
 * It manages the form state, handles form submission, and provides feedback on the submission status.
 *
 * @component
 * @example
 * return (
 *   <NewItemForm />
 * )
 *
 * @returns {React.FC} A form component for creating a new item.
 *
 * @typedef {Object} NewItem
 * @property {string} name - The name of the new item.
 * @property {Object} InventoryItem - The inventory details of the new item.
 * @property {number} InventoryItem.stock - The stock quantity of the new item.
 * @property {number} InventoryItem.price - The price of the new item.
 * @property {string} InventoryItem.name - The name of the inventory item.
 * @property {number} [InventoryItem.servingsPerStock] - The number of servings per stock.
 * @property {number} [InventoryItem.minStock] - The minimum stock quantity.
 * @property {number} [InventoryItem.maxStock] - The maximum stock quantity.
 * @property {number} [calories] - The calorie count of the new item.
 * @property {number[]} [ItemFeatures] - The list of selected feature IDs for the new item.
 * @property {File} [Thumbnail] - The thumbnail image file for the new item.
 *
 * @typedef {Object} ItemFeature
 * @property {number} id - The unique identifier of the feature.
 * @property {string} name - The name of the feature.
 *
 * @typedef {Object} ItemCreationAttributes
 * @property {string} name - The name of the new item.
 * @property {Object} InventoryItem - The inventory details of the new item.
 * @property {number} InventoryItem.stock - The stock quantity of the new item.
 * @property {number} InventoryItem.price - The price of the new item.
 * @property {number} InventoryItem.servingsPerStock - The number of servings per stock.
 * @property {number} InventoryItem.currentStock - The current stock quantity.
 * @property {number} InventoryItem.minStock - The minimum stock quantity.
 * @property {number} InventoryItem.maxStock - The maximum stock quantity.
 * @property {number[]} ItemFeatureIds - The list of selected feature IDs for the new item.
 * @property {number} additionalPrice - The additional price for the new item.
 * @property {number} calories - The calorie count of the new item.
 *
 * @function fetchItemFeatures
 * Fetches the available item features from the API and updates the state.
 *
 * @function handleChange
 * Handles changes to the form fields and updates the form state.
 *
 * @function handleInventoryChange
 * Handles changes to the inventory item fields and updates the form state.
 *
 * @function toggleFeature
 * Toggles the selection of an item feature.
 *
 * @function handleSubmit
 * Handles the form submission, creates a new item, and provides feedback on the submission status.
 *
 * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The change event from the form fields.
 * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the inventory item fields.
 * @param {number} featureId - The ID of the feature to toggle.
 * @param {React.FormEvent} e - The form submission event.
 */
const NewItemForm: React.FC = () => {
  const [itemFeatures, setItemFeatures] = useState<ItemFeature[]>([]);
  const [formData, setFormData] = useState<NewItem>({
    name: "",
    InventoryItem: { stock: 0, price: 0, name: "" },
    ItemFeatures: [],
    Thumbnail: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  // Fetch available item features
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

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle inventory item changes
  const handleInventoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      InventoryItem: {
        ...prev.InventoryItem,
        [name]: parseFloat(value),
      },
    }));
  };

  // Handle feature selection
  const toggleFeature = (featureId: number) => {
    setFormData((prev) => ({
      ...prev,
      ItemFeatures: prev.ItemFeatures?.includes(featureId)
        ? prev.ItemFeatures.filter((id) => id !== featureId)
        : [...(prev.ItemFeatures || []), featureId],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const attributes: ItemCreationAttributes = {
      name: formData.name,
      InventoryItem: {
        ...formData.InventoryItem,
        servingsPerStock: 1, // Default value or collect from form
        currentStock: formData.InventoryItem?.stock || 0,
        minStock: 0, // Default value or collect from form
        maxStock: 100, // Default value or collect from form
      },
      ItemFeatureIds: formData.ItemFeatures || [],
      additionalPrice: formData.InventoryItem?.price || 0, // Use price as additionalPrice
      calories: formData.calories || 0, // Pass calories
    };

    try {
      const result = await createItem(attributes);

      console.log("Item created:", result);
      setSubmissionStatus("Item successfully created!");
      setFormData({
        name: "",
        InventoryItem: { stock: 0, price: 0, name: "" },
        calories: 0, // Reset calories
        ItemFeatures: [],
        Thumbnail: undefined,
      });
    } catch (error) {
      console.error("Error creating item:", error);
      setSubmissionStatus("Failed to create item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label>
          Name:
          <input
            required
            className="border rounded p-2 w-full"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Calories:
          <input
            required
            className="border rounded p-2 w-full"
            name="calories"
            type="number"
            value={formData.calories || 0}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                calories: parseFloat(e.target.value),
              }))
            }
          />
        </label>
      </div>
      <div>
        <label>
          Stock:
          <input
            required
            className="border rounded p-2 w-full"
            name="stock"
            type="number"
            value={formData.InventoryItem?.stock || 0}
            onChange={handleInventoryChange}
          />
        </label>
      </div>
      <div>
        <label>
          Price:
          <input
            required
            className="border rounded p-2 w-full"
            name="price"
            type="number"
            value={formData.InventoryItem?.price || 0}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                InventoryItem: {
                  ...prev.InventoryItem,
                  price: parseFloat(e.target.value),
                },
              }))
            }
          />
        </label>
      </div>
      <div>
        <label>
          Servings Per Stock:
          <input
            className="border rounded p-2 w-full"
            name="servingsPerStock"
            type="number"
            value={formData.InventoryItem?.servingsPerStock || 1}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                InventoryItem: {
                  ...prev.InventoryItem,
                  servingsPerStock: parseFloat(e.target.value),
                },
              }))
            }
          />
        </label>
      </div>
      <div>
        <label>
          Min Stock:
          <input
            className="border rounded p-2 w-full"
            name="minStock"
            type="number"
            value={formData.InventoryItem?.minStock || 0}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                InventoryItem: {
                  ...prev.InventoryItem,
                  minStock: parseFloat(e.target.value),
                },
              }))
            }
          />
        </label>
      </div>
      <div>
        <label>
          Max Stock:
          <input
            className="border rounded p-2 w-full"
            name="maxStock"
            type="number"
            value={formData.InventoryItem?.maxStock || 100}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                InventoryItem: {
                  ...prev.InventoryItem,
                  maxStock: parseFloat(e.target.value),
                },
              }))
            }
          />
        </label>
      </div>

      <div>
        <p>Features:</p>
        <div className="flex flex-wrap gap-2">
          {itemFeatures.map((feature) => (
            <button
              key={feature.id}
              className={`p-2 border rounded ${
                formData.ItemFeatures?.includes(feature.id)
                  ? "bg-green-500 text-white"
                  : "bg-gray-300"
              }`}
              type="button"
              onClick={() => toggleFeature(feature.id)}
            >
              {feature.name}
            </button>
          ))}
        </div>
      </div>
      <button
        className="bg-blue-500 text-white p-2 rounded"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Submitting..." : "Create Item"}
      </button>
      {submissionStatus && <p>{submissionStatus}</p>}
    </form>
  );
};

export default NewItemForm;
