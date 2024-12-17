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
  BelongsToManyGetAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
} from "sequelize";

import {
  InventoryItem,
  ItemFeature,
  SoldSellable,
  Thumbnail,
  SoldItem,
} from "@/db";

/**
 * Represents an item in the database.
 *
 * @extends {Model<InferAttributes<Item>, InferCreationAttributes<Item>>}
 *
 * @property {CreationOptional<number>} id - The unique identifier for the item.
 * @property {string} name - The name of the item.
 * @property {number} additionalPrice - The additional price of the item.
 * @property {number} calories - The calorie count of the item.
 * @property {Date | null} seasonalStart - The start date of the item's seasonal availability.
 * @property {Date | null} seasonalEnd - The end date of the item's seasonal availability.
 * @property {CreationOptional<Date>} deletedAt - The date when the item was deleted.
 * @property {ForeignKey<InventoryItem["id"]>} InventoryItemId - The foreign key to the InventoryItem.
 * @property {ForeignKey<Thumbnail["id"]>} ThumbnailId - The foreign key to the Thumbnail.
 *
 * @method static associate - Defines associations between models.
 * @method static initialize - Initializes the model with its attributes and options.
 *
 * @method getInventoryItem - Gets the associated InventoryItem.
 * @method setInventoryItem - Sets the associated InventoryItem.
 * @method createInventoryItem - Creates a new associated InventoryItem.
 *
 * @method getItemFeatures - Gets the associated ItemFeatures.
 * @method countItemFeatures - Counts the associated ItemFeatures.
 * @method hasItemFeature - Checks if a specific ItemFeature is associated.
 * @method hasItemFeatures - Checks if multiple ItemFeatures are associated.
 * @method setItemFeatures - Sets the associated ItemFeatures.
 * @method addItemFeature - Adds a specific ItemFeature to the associations.
 * @method addItemFeatures - Adds multiple ItemFeatures to the associations.
 * @method removeItemFeature - Removes a specific ItemFeature from the associations.
 * @method removeItemFeatures - Removes multiple ItemFeatures from the associations.
 * @method createItemFeature - Creates a new associated ItemFeature.
 *
 * @method getSoldSellables - Gets the associated SoldSellables.
 * @method countSoldSellables - Counts the associated SoldSellables.
 * @method hasSoldSellable - Checks if a specific SoldSellable is associated.
 * @method hasSoldSellables - Checks if multiple SoldSellables are associated.
 * @method setSoldSellables - Sets the associated SoldSellables.
 * @method addSoldSellable - Adds a specific SoldSellable to the associations.
 * @method addSoldSellables - Adds multiple SoldSellables to the associations.
 * @method removeSoldSellable - Removes a specific SoldSellable from the associations.
 * @method removeSoldSellables - Removes multiple SoldSellables from the associations.
 * @method createSoldSellable - Creates a new associated SoldSellable.
 *
 * @method getThumbnail - Gets the associated Thumbnail.
 * @method setThumbnail - Sets the associated Thumbnail.
 * @method createThumbnail - Creates a new associated Thumbnail.
 */
export class Item extends Model<
  InferAttributes<Item>,
  InferCreationAttributes<Item>
> {
  declare id: CreationOptional<number>;

  declare name: string;
  declare additionalPrice: number;
  declare calories: number;

  declare seasonalStart: Date | null;
  declare seasonalEnd: Date | null;

  declare deletedAt: CreationOptional<Date>;

  declare InventoryItemId: ForeignKey<InventoryItem["id"]>;
  declare ThumbnailId: ForeignKey<Thumbnail["id"]>;

  static associate() {
    Item.belongsTo(InventoryItem, {
      onDelete: "RESTRICT",
    });

    Item.belongsToMany(ItemFeature, { through: "ItemFeatureLink" });
    Item.belongsToMany(SoldSellable, { through: SoldItem });

    Item.belongsTo(Thumbnail, {
      onDelete: "SET NULL",
    });
  }

  static initialize(sequelize: Sequelize) {
    Item.init(
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
        additionalPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        calories: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: { min: 0 },
        },

        seasonalStart: DataTypes.DATEONLY,
        seasonalEnd: DataTypes.DATEONLY,

        deletedAt: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: "Item",
        paranoid: true,
        timestamps: false,

        validate: {
          seasonalDatesFullyFormed() {
            const self = this as unknown as Item; // TypeScript magic

            if (
              !((self.seasonalStart === null) === (self.seasonalEnd === null))
            ) {
              throw new Error(
                "Seasonal start and end must be both null or both not null",
              );
            }
          },

          seasonalDatesValidRange() {
            const self = this as unknown as Item; // TypeScript magic

            if (self.seasonalStart && self.seasonalEnd) {
              if (self.seasonalStart > self.seasonalEnd) {
                throw new Error("Seasonal start must be before seasonal end");
              }
            }
          },
        },
      },
    );
  }

  declare getInventoryItem: BelongsToGetAssociationMixin<InventoryItem>;
  declare setInventoryItem: BelongsToSetAssociationMixin<InventoryItem, number>;
  declare createInventoryItem: BelongsToCreateAssociationMixin<InventoryItem>;

  declare getItemFeatures: BelongsToManyGetAssociationsMixin<ItemFeature>;
  declare countItemFeatures: BelongsToManyCountAssociationsMixin;
  declare hasItemFeature: BelongsToManyHasAssociationMixin<ItemFeature, number>;
  declare hasItemFeatures: BelongsToManyHasAssociationsMixin<
    ItemFeature,
    number
  >;
  declare setItemFeatures: BelongsToManySetAssociationsMixin<
    ItemFeature,
    number
  >;
  declare addItemFeature: BelongsToManyAddAssociationMixin<ItemFeature, number>;
  declare addItemFeatures: BelongsToManyAddAssociationsMixin<
    ItemFeature,
    number
  >;
  declare removeItemFeature: BelongsToManyRemoveAssociationMixin<
    ItemFeature,
    number
  >;
  declare removeItemFeatures: BelongsToManyRemoveAssociationsMixin<
    ItemFeature,
    number
  >;
  declare createItemFeature: BelongsToManyCreateAssociationMixin<ItemFeature>;

  declare getSoldSellables: BelongsToManyGetAssociationsMixin<SoldSellable>;
  declare countSoldSellables: BelongsToManyCountAssociationsMixin;
  declare hasSoldSellable: BelongsToManyHasAssociationMixin<
    SoldSellable,
    number
  >;
  declare hasSoldSellables: BelongsToManyHasAssociationsMixin<
    SoldSellable,
    number
  >;
  declare setSoldSellables: BelongsToManySetAssociationsMixin<
    SoldSellable,
    number
  >;
  declare addSoldSellable: BelongsToManyAddAssociationMixin<
    SoldSellable,
    number
  >;
  declare addSoldSellables: BelongsToManyAddAssociationsMixin<
    SoldSellable,
    number
  >;
  declare removeSoldSellable: BelongsToManyRemoveAssociationMixin<
    SoldSellable,
    number
  >;
  declare removeSoldSellables: BelongsToManyRemoveAssociationsMixin<
    SoldSellable,
    number
  >;
  declare createSoldSellable: BelongsToManyCreateAssociationMixin<SoldSellable>;

  declare getThumbnail: BelongsToGetAssociationMixin<Thumbnail>;
  declare setThumbnail: BelongsToSetAssociationMixin<Thumbnail, number>;
  declare createThumbnail: BelongsToCreateAssociationMixin<Thumbnail>;
}
