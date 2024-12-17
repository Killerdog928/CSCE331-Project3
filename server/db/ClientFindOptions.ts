"use server";

import {
  FindAttributeOptions,
  FindOptions,
  IncludeOptions,
  Model,
  WhereOptions,
} from "sequelize";

/**
 * Interface representing the options for including related models in a query.
 */
export interface ClientIncludeOptions
  extends Omit<Omit<IncludeOptions, "model">, "include"> {
  model: string;
  include?: ClientIncludeOptions[];
}

/**
 * Type representing the options for filtering models in a query.
 * Extends Sequelize's WhereOptions with additional properties.
 */
export type ClientWhereOptions<M extends Model> = WhereOptions<M> & {
  [key: string]: any;
};

/**
 * Interface representing the options for finding models in a query.
 * Extends Sequelize's FindOptions with additional properties.
 */
export interface ClientFindOptions<M extends Model>
  extends Omit<FindOptions<M>, "include" | "where"> {
  attributes?: (string | [string, string])[] | FindAttributeOptions;
  include?: ClientIncludeOptions[];
  where?: number | number[] | ClientWhereOptions<M> | ClientWhereOptions<M>[];
}
