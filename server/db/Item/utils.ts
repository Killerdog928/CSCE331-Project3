import { ItemJson } from "./types";

/**
 * Filters items based on included and excluded features.
 * @param items - Array of items to filter.
 * @param includedFeatures - Features that must be included in the items.
 * @param excludedFeatures - Features that must not be included in the items.
 * @returns Filtered array of items.
 */
export function filterItems(
  items: ItemJson[],
  includedFeatures: (number | { name: string })[],
  excludedFeatures: (number | { name: string })[],
): ItemJson[] {
  // Check if the item has all the included features
  const hasAllIncludeFeatures = (item: ItemJson) =>
    includedFeatures.every((feature) =>
      typeof feature === "number"
        ? item.ItemFeatures!.some((f) => f.id === feature)
        : item.ItemFeatures!.some((f) => f.name === feature.name),
    );
  // Check if the item has any of the excluded features
  const hasAnyExcludeFeatures = (item: ItemJson) =>
    excludedFeatures.some((feature) =>
      typeof feature === "number"
        ? item.ItemFeatures!.some((f) => f.id === feature)
        : item.ItemFeatures!.some((f) => f.name === feature.name),
    );

  // Filter items based on the included and excluded features
  return items.filter(
    (item) => hasAllIncludeFeatures(item) && !hasAnyExcludeFeatures(item),
  );
}
