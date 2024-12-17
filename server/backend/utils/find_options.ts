// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import {
  IncludeOptions,
  FindOptions,
  Model,
  Op,
  WhereOptions,
} from "sequelize";

import {
  db,
  Employee,
  InventoryHistory,
  InventoryItem,
  Item,
  ItemFeature,
  JobPosition,
  Order,
  RecentOrder,
  Sellable,
  SellableCategory,
  SellableComponent,
  SoldItem,
  SoldSellable,
  Thumbnail,
} from "@/db";
import { ClientFindOptions, ClientIncludeOptions } from "@/server/db/types";

const models = [
  { name: "Employee", model: Employee },
  { name: "InventoryHistory", model: InventoryHistory },
  { name: "InventoryItem", model: InventoryItem },
  { name: "Item", model: Item },
  { name: "ItemFeature", model: ItemFeature },
  { name: "JobPosition", model: JobPosition },
  { name: "Order", model: Order },
  { name: "RecentOrder", model: RecentOrder },
  { name: "Sellable", model: Sellable },
  { name: "SellableCategory", model: SellableCategory },
  { name: "SellableComponent", model: SellableComponent },
  { name: "SoldItem", model: SoldItem },
  { name: "SoldSellable", model: SoldSellable },
  { name: "Thumbnail", model: Thumbnail },
];

function lookupModel(modelName: string) {
  const m = models.find(({ name }) => name === modelName);

  if (m) {
    return m.model;
  } else {
    throw new Error(`Invalid model name: ${modelName}`);
  }
}

function parseIncludeOptions(options: ClientIncludeOptions): IncludeOptions {
  const model = lookupModel(options.model);

  if (options.include) {
    return {
      ...options,
      model,
      include: options.include.map(parseIncludeOptions),
    };
  } else {
    return {
      ...options,
      model,
    } as IncludeOptions;
  }
}

function parseOps(thing: any, maxDepth = 10): any {
  if (!thing || maxDepth <= 0) {
    return thing;
  } else if (typeof thing === "object") {
    for (const key of Object.keys(thing)) {
      if (thing[key] === undefined) {
        delete thing[key];
        continue;
      }

      const v = parseOps(thing[key], maxDepth - 1);

      if (key.startsWith("Op.")) {
        console.log(thing);
        delete thing[key];
        thing = {
          ...thing,
          [Op[key.replace("Op.", "") as keyof typeof Op]]: v,
        };
        console.log(thing);
      } else {
        thing[key] = v;
      }
    }
  } else if (Array.isArray(thing)) {
    thing = thing.map((x) => parseOps(x, maxDepth - 1));
  } else if (typeof thing === "string") {
    if (thing.startsWith("$$") && thing.endsWith("$$")) {
      return db.literal(thing.slice(2, -2));
    } else if (thing.startsWith("$") && thing.endsWith("$")) {
      return db.col(thing.slice(1, -1));
    }
  }

  return thing;
}

/**
 * Parses the client-provided find options and converts them into Sequelize-compatible find options.
 *
 * @template T - The type of the model.
 * @param {ClientFindOptions<T>} options - The client-provided find options.
 * @returns {FindOptions<T>} The Sequelize-compatible find options.
 *
 * The function performs the following transformations:
 * - Parses the `where` clause to handle different types of conditions.
 * - If `include` is specified, it processes the `attributes` and `include` options.
 * - Converts literal values in `attributes` to Sequelize literal objects.
 * - Recursively parses included models using `parseIncludeOptions`.
 */
export function parseFindOptions<T extends Model>(
  options: ClientFindOptions<T>,
): FindOptions<T> {
  options = parseOps(options);
  options = {
    ...options,
    where: (options.where
      ? Array.isArray(options.where)
        ? typeof options.where[0] === "number"
          ? { id: options.where }
          : { [Op.or]: options.where }
        : typeof options.where === "number"
          ? ({ id: options.where } as unknown)
          : options.where
      : undefined) as WhereOptions<T>,
  };
  if (options.include) {
    return {
      ...options,
      attributes: options.attributes
        ? Array.isArray(options.attributes)
          ? options.attributes.map((a) =>
              Array.isArray(a) ? [db.literal(a[0]), a[1]] : a,
            )
          : {
              exclude: options.attributes.exclude?.map((a) =>
                Array.isArray(a) ? [db.literal(a[0]), a[1]] : a,
              ),
              include: options.attributes.include?.map((a) =>
                Array.isArray(a) ? [db.literal(a[0]), a[1]] : a,
              ),
            }
        : undefined,
      include: options.include.map(parseIncludeOptions),
    } as FindOptions<T>;
  } else {
    return options as FindOptions<T>;
  }
}

export function parseOptionalFindOptions<T extends Model>(
  options?: ClientFindOptions<T>,
): FindOptions<T> | undefined {
  return options ? parseFindOptions(options) : undefined;
}
