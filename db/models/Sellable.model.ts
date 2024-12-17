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
  ItemFeature,
  SellableCategory,
  SellableComponent,
  SoldSellable,
  Thumbnail,
} from "@/db";

/**
 * Represents a sellable item in the system.
 *
 * @extends Model
 *
 * @property {number} id - The unique identifier for the sellable item.
 * @property {string} name - The name of the sellable item.
 * @property {number} price - The price of the sellable item.
 * @property {Date} [deletedAt] - The date when the sellable item was deleted.
 * @property {number} ThumbnailId - The foreign key referencing the thumbnail.
 *
 * @method static associate - Defines associations between models.
 * @method static initialize - Initializes the model with its attributes and options.
 *
 * @method getItemFeatures - Gets associated item features.
 * @method countItemFeatures - Counts associated item features.
 * @method hasItemFeature - Checks if a specific item feature is associated.
 * @method hasItemFeatures - Checks if multiple item features are associated.
 * @method setItemFeatures - Sets associated item features.
 * @method addItemFeature - Adds an item feature association.
 * @method addItemFeatures - Adds multiple item feature associations.
 * @method removeItemFeature - Removes an item feature association.
 * @method removeItemFeatures - Removes multiple item feature associations.
 * @method createItemFeature - Creates and associates a new item feature.
 *
 * @method getSellableComponents - Gets associated sellable components.
 * @method countSellableComponents - Counts associated sellable components.
 * @method hasSellableComponent - Checks if a specific sellable component is associated.
 * @method hasSellableComponents - Checks if multiple sellable components are associated.
 * @method setSellableComponents - Sets associated sellable components.
 * @method addSellableComponent - Adds a sellable component association.
 * @method addSellableComponents - Adds multiple sellable component associations.
 * @method removeSellableComponent - Removes a sellable component association.
 * @method removeSellableComponents - Removes multiple sellable component associations.
 * @method createSellableComponent - Creates and associates a new sellable component.
 *
 * @method getSellableCategories - Gets associated sellable categories.
 * @method countSellableCategories - Counts associated sellable categories.
 * @method hasSellableCategory - Checks if a specific sellable category is associated.
 * @method hasSellableCategories - Checks if multiple sellable categories are associated.
 * @method setSellableCategories - Sets associated sellable categories.
 * @method addSellableCategory - Adds a sellable category association.
 * @method addSellableCategories - Adds multiple sellable category associations.
 * @method removeSellableCategory - Removes a sellable category association.
 * @method removeSellableCategories - Removes multiple sellable category associations.
 * @method createSellableCategory - Creates and associates a new sellable category.
 *
 * @method getSoldSellables - Gets associated sold sellables.
 * @method countSoldSellables - Counts associated sold sellables.
 * @method hasSoldSellable - Checks if a specific sold sellable is associated.
 * @method hasSoldSellables - Checks if multiple sold sellables are associated.
 * @method setSoldSellables - Sets associated sold sellables.
 * @method addSoldSellable - Adds a sold sellable association.
 * @method addSoldSellables - Adds multiple sold sellable associations.
 * @method removeSoldSellable - Removes a sold sellable association.
 * @method removeSoldSellables - Removes multiple sold sellable associations.
 * @method createSoldSellable - Creates and associates a new sold sellable.
 *
 * @method getThumbnail - Gets the associated thumbnail.
 * @method setThumbnail - Sets the associated thumbnail.
 * @method createThumbnail - Creates and associates a new thumbnail.
 */
export class Sellable extends Model<
  InferAttributes<Sellable>,
  InferCreationAttributes<Sellable>
> {
  declare id: CreationOptional<number>;

  declare name: string;
  declare price: number;

  declare deletedAt: CreationOptional<Date>;

  declare ThumbnailId: ForeignKey<Thumbnail["id"]>;

  static associate() {
    Sellable.hasMany(SellableComponent);
    Sellable.hasMany(SoldSellable);

    Sellable.belongsToMany(ItemFeature, { through: SellableComponent });
    Sellable.belongsToMany(SellableCategory, {
      through: "SellableCategoryLink",
    });

    Sellable.belongsTo(Thumbnail, { onDelete: "SET NULL" });
  }

  static initialize(sequelize: Sequelize) {
    Sellable.init(
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
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },

        deletedAt: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: "Sellable",
        paranoid: true,
        timestamps: false,
      },
    );
  }

  /** mixin functions autogenerated by Sequelize **/

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

  declare getSellableComponents: BelongsToManyGetAssociationsMixin<SellableComponent>;
  declare countSellableComponents: BelongsToManyCountAssociationsMixin;
  declare hasSellableComponent: BelongsToManyHasAssociationMixin<
    SellableComponent,
    number
  >;
  declare hasSellableComponents: BelongsToManyHasAssociationsMixin<
    SellableComponent,
    number
  >;
  declare setSellableComponents: BelongsToManySetAssociationsMixin<
    SellableComponent,
    number
  >;
  declare addSellableComponent: BelongsToManyAddAssociationMixin<
    SellableComponent,
    number
  >;
  declare addSellableComponents: BelongsToManyAddAssociationsMixin<
    SellableComponent,
    number
  >;
  declare removeSellableComponent: BelongsToManyRemoveAssociationMixin<
    SellableComponent,
    number
  >;
  declare removeSellableComponents: BelongsToManyRemoveAssociationsMixin<
    SellableComponent,
    number
  >;
  declare createSellableComponent: BelongsToManyCreateAssociationMixin<SellableComponent>;

  declare getSellableCategories: BelongsToManyGetAssociationsMixin<SellableCategory>;
  declare countSellableCategories: BelongsToManyCountAssociationsMixin;
  declare hasSellableCategory: BelongsToManyHasAssociationMixin<
    SellableCategory,
    number
  >;
  declare hasSellableCategories: BelongsToManyHasAssociationsMixin<
    SellableCategory,
    number
  >;
  declare setSellableCategories: BelongsToManySetAssociationsMixin<
    SellableCategory,
    number
  >;
  declare addSellableCategory: BelongsToManyAddAssociationMixin<
    SellableCategory,
    number
  >;
  declare addSellableCategories: BelongsToManyAddAssociationsMixin<
    SellableCategory,
    number
  >;
  declare removeSellableCategory: BelongsToManyRemoveAssociationMixin<
    SellableCategory,
    number
  >;
  declare removeSellableCategories: BelongsToManyRemoveAssociationsMixin<
    SellableCategory,
    number
  >;
  declare createSellableCategory: BelongsToManyCreateAssociationMixin<SellableCategory>;

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
