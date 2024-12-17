"use server";

import { bulkCreateEmployees } from "../backend/Employee";
import { bulkCreateItems } from "../backend/Item";
import { bulkCreateSellables } from "../backend/Sellable";

import { employees } from "./entries/employees";
import { itemFeatures } from "./entries/itemFeatures";
import { items } from "./entries/items";
import { items2 } from "./entries/items2";
import { jobPositions } from "./entries/jobPositions";
import { generateOrders } from "./entries/orders";
import { sellableCategories } from "./entries/sellableCategories";
import { sellables } from "./entries/sellables";

import { db, ItemFeature, JobPosition, SellableCategory } from "@/db";

/**
 * Populates the database with initial data.
 * This function performs a series of bulk create operations within a transaction.
 * It ensures that the database is populated with job positions, employees, item features, items, sellable categories, and sellables.
 * It also generates orders after the initial data is populated.
 */
export async function populateDatabase() {
  await db.transaction(async (transaction) => {
    // Synchronize the database schema
    await db.sync({ force: true });

    // Bulk create job positions
    const pJobPositions = JobPosition.bulkCreate(jobPositions, { transaction });

    // Bulk create employees after job positions are created
    const pEmployees = pJobPositions.then(() =>
      bulkCreateEmployees(employees, { transaction }),
    );

    // Bulk create item features
    const pItemFeatures = ItemFeature.bulkCreate(itemFeatures, { transaction });

    // Bulk create items after item features are created
    const pItems = pItemFeatures.then(() =>
      bulkCreateItems([...items, ...items2], { transaction }),
    );

    // Bulk create sellable categories
    const pSellableCategories = SellableCategory.bulkCreate(
      sellableCategories,
      { transaction },
    );

    // Bulk create sellables after item features and sellable categories are created
    const pSellables = Promise.all([pItemFeatures, pSellableCategories]).then(
      () => bulkCreateSellables(sellables, { transaction }),
    );

    // Generate orders after employees, items, and sellables are created
    const pOrders = Promise.all([pEmployees, pItems, pSellables]).then(() =>
      generateOrders(transaction),
    );

    // Wait for all promises to resolve
    await Promise.all([
      pJobPositions,
      pEmployees,
      pItemFeatures,
      pItems,
      pSellableCategories,
      pSellables,
      pOrders,
    ]);
  });
}
