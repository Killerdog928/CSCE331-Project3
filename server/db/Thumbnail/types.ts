import { InferAttributes } from "sequelize";

import { Thumbnail } from "@/db";

/**
 * Type representing the JSON structure of a Thumbnail.
 */
export type ThumbnailJson = InferAttributes<Thumbnail>;

/**
 * Type representing the attributes required to update a Thumbnail.
 * Includes a mandatory `id` field.
 */
export type ThumbnailUpdateAttributes = Partial<InferAttributes<Thumbnail>> & {
  id: number;
};
