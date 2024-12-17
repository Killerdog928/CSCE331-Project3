import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from "sequelize";

import { Item, SoldSellable } from "@/db";

/**
 * Represents a sold item in the database.
 *
 * @extends Model
 *
 * @property {CreationOptional<number>} id - The unique identifier for the sold item.
 * @property {CreationOptional<number>} amount - The amount of the sold item, defaults to 1.
 * @property {ForeignKey<number>} ItemId - The foreign key referencing the associated item.
 * @property {ForeignKey<number>} SoldSellableId - The foreign key referencing the associated sold sellable entity.
 *
 * @method static associate - Defines associations between models.
 * @method static initialize - Initializes the model with its attributes and options.
 *
 * @method getItem - Gets the associated item.
 * @method setItem - Sets the associated item.
 * @method createItem - Creates a new associated item.
 *
 * @method getSoldSellable - Gets the associated sold sellable entity.
 * @method setSoldSellable - Sets the associated sold sellable entity.
 * @method createSoldSellable - Creates a new associated sold sellable entity.
 */
export class SoldItem extends Model<
  InferAttributes<SoldItem>,
  InferCreationAttributes<SoldItem>
> {
  declare id: CreationOptional<number>;

  declare amount: CreationOptional<number>;

  declare ItemId: ForeignKey<number>;
  declare SoldSellableId: ForeignKey<number>;

  static associate() {
    SoldItem.belongsTo(Item, { onDelete: "RESTRICT" });
    SoldItem.belongsTo(SoldSellable);
  }

  static initialize(sequelize: Sequelize) {
    SoldItem.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        modelName: "SoldItem",
        timestamps: false,
      },
    );
  }

  declare getItem: BelongsToGetAssociationMixin<Item>;
  declare setItem: BelongsToSetAssociationMixin<Item, number>;
  declare createItem: BelongsToCreateAssociationMixin<Item>;

  declare getSoldSellable: BelongsToGetAssociationMixin<SoldSellable>;
  declare setSoldSellable: BelongsToSetAssociationMixin<SoldSellable, number>;
  declare createSoldSellable: BelongsToCreateAssociationMixin<SoldSellable>;
}
