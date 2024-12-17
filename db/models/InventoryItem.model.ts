import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToCreateAssociationMixin,
  BelongsToSetAssociationMixin,
} from "sequelize";

import { InventoryHistory, Item, Thumbnail } from "@/db";

/**
 * Represents an inventory item in the database.
 *
 * @extends {Model<InferAttributes<InventoryItem>, InferCreationAttributes<InventoryItem>>}
 *
 * @property {CreationOptional<number>} id - The unique identifier for the inventory item.
 * @property {string} name - The name of the inventory item.
 * @property {number} servingsPerStock - The number of servings per stock unit.
 * @property {number} currentStock - The current stock level of the inventory item.
 * @property {number} minStock - The minimum stock level for the inventory item.
 * @property {number} maxStock - The maximum stock level for the inventory item.
 * @property {CreationOptional<Date>} deletedAt - The date when the inventory item was deleted.
 * @property {ForeignKey<Thumbnail["id"]>} ThumbnailId - The foreign key referencing the Thumbnail model.
 *
 * @method static associate - Defines associations between models.
 * @method static initialize - Initializes the model with its attributes and options.
 *
 * @method getInventoryHistories - Gets associated inventory histories.
 * @method countInventoryHistories - Counts associated inventory histories.
 * @method hasInventoryHistory - Checks if a specific inventory history is associated.
 * @method hasInventoryHistories - Checks if multiple inventory histories are associated.
 * @method setInventoryHistories - Sets associated inventory histories.
 * @method addInventoryHistory - Adds an associated inventory history.
 * @method removeInventoryHistory - Removes an associated inventory history.
 * @method removeInventoryHistories - Removes multiple associated inventory histories.
 * @method createInventoryHistory - Creates and associates a new inventory history.
 *
 * @method getItem - Gets the associated item.
 * @method setItem - Sets the associated item.
 * @method createItem - Creates and associates a new item.
 *
 * @method getThumbnail - Gets the associated thumbnail.
 * @method setThumbnail - Sets the associated thumbnail.
 * @method createThumbnail - Creates and associates a new thumbnail.
 */
export class InventoryItem extends Model<
  InferAttributes<InventoryItem>,
  InferCreationAttributes<InventoryItem>
> {
  declare id: CreationOptional<number>;

  declare name: string;
  declare servingsPerStock: number;

  declare currentStock: number;

  declare minStock: number;
  declare maxStock: number;

  declare deletedAt: CreationOptional<Date>;

  declare ThumbnailId: ForeignKey<Thumbnail["id"]>;

  static associate() {
    InventoryItem.hasMany(InventoryHistory);
    InventoryItem.hasOne(Item);

    InventoryItem.belongsTo(Thumbnail);
  }

  static initialize(sequelize: Sequelize) {
    InventoryItem.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: { notEmpty: true },
        },
        servingsPerStock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: { min: 0 },
        },

        currentStock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: { min: 0 },
        },

        minStock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: { min: 0 },
        },
        maxStock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: { min: 0 },
        },

        deletedAt: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: "InventoryItem",
        paranoid: true,
        timestamps: false,

        validate: {
          minMaxStock() {
            const self = this as unknown as InventoryItem;

            if (self.minStock > self.maxStock) {
              throw new Error("Min stock must be less than max stock");
            }
          },
        },
      },
    );
  }

  declare getInventoryHistories: HasManyGetAssociationsMixin<InventoryHistory>;
  declare countInventoryHistories: HasManyCountAssociationsMixin;
  declare hasInventoryHistory: HasManyHasAssociationMixin<
    InventoryHistory,
    number
  >;
  declare hasInventoryHistories: HasManyHasAssociationsMixin<
    InventoryHistory,
    number
  >;
  declare setInventoryHistories: HasManySetAssociationsMixin<
    InventoryHistory,
    number
  >;
  declare addInventoryHistory: HasManyAddAssociationMixin<
    InventoryHistory,
    number
  >;
  declare removeInventoryHistory: HasManyRemoveAssociationMixin<
    InventoryHistory,
    number
  >;
  declare removeInventoryHistories: HasManyRemoveAssociationsMixin<
    InventoryHistory,
    number
  >;
  declare createInventoryHistory: HasManyCreateAssociationMixin<InventoryHistory>;

  declare getItem: HasOneGetAssociationMixin<Item>;
  declare setItem: HasOneSetAssociationMixin<Item, number>;
  declare createItem: HasOneCreateAssociationMixin<Item>;

  declare getThumbnail: BelongsToGetAssociationMixin<Thumbnail>;
  declare setThumbnail: BelongsToSetAssociationMixin<Thumbnail, number>;
  declare createThumbnail: BelongsToCreateAssociationMixin<Thumbnail>;
}
