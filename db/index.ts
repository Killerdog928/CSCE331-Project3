import pg from "pg";
import { Sequelize } from "sequelize";

import * as m from "./models";

const db = new Sequelize({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  dialect: "postgres",
  dialectModule: pg,
});

const models = [
  m.Employee,
  m.InventoryHistory,
  m.InventoryItem,
  m.Item,
  m.ItemFeature,
  m.JobPosition,
  m.Order,
  m.RecentOrder,
  m.Sellable,
  m.SellableCategory,
  m.SellableComponent,
  m.SoldItem,
  m.SoldSellable,
  m.Thumbnail,
];

models.forEach((model) => model.initialize(db));
models.forEach((model) => model.associate());

export { db };
export * from "./models";
