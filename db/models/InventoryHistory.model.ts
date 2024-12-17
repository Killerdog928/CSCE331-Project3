import {
  Sequelize,
  DataTypes,
  Model,
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from "sequelize";

import { InventoryItem } from "@/db";

/**
 * Represents the history of inventory changes for a specific inventory item.
 *
 * @extends Model
 *
 * @property {CreationOptional<number>} id - The unique identifier for the inventory history record.
 * @property {number} stockAmount - The amount of stock recorded in the history.
 * @property {CreationOptional<Date>} timestamp - The timestamp when the inventory change was recorded.
 * @property {ForeignKey<InventoryItem["id"]>} InventoryItemId - The foreign key referencing the associated inventory item.
 *
 * @method static associate - Defines the association between InventoryHistory and InventoryItem models.
 * @method static initialize - Initializes the InventoryHistory model with its attributes and options.
 * @method getInventoryItem - Gets the associated InventoryItem.
 * @method setInventoryItem - Sets the associated InventoryItem.
 * @method createInventoryItem - Creates a new associated InventoryItem.
 */
export class InventoryHistory extends Model<
  InferAttributes<InventoryHistory>,
  InferCreationAttributes<InventoryHistory>
> {
  declare id: CreationOptional<number>;

  declare stockAmount: number;

  declare timestamp: CreationOptional<Date>;

  declare InventoryItemId: ForeignKey<InventoryItem["id"]>;

  static associate() {
    InventoryHistory.belongsTo(InventoryItem, { onDelete: "SET NULL" });
  }

  static initialize(sequelize: Sequelize) {
    InventoryHistory.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        stockAmount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: { min: 0 },
        },

        timestamp: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: "InventoryHistory",
        freezeTableName: true,
        timestamps: true,

        createdAt: "timestamp",
        updatedAt: false,
      },
    );
  }

  declare getInventoryItem: BelongsToGetAssociationMixin<InventoryItem>;
  declare setInventoryItem: BelongsToSetAssociationMixin<InventoryItem, number>;
  declare createInventoryItem: BelongsToCreateAssociationMixin<InventoryItem>;
}
