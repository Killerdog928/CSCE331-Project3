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
  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
} from "sequelize";

import { Item, Sellable, SellableComponent, Thumbnail } from "@/db";

/**
 * Represents an ItemFeature model in the database.
 *
 * @extends {Model<InferAttributes<ItemFeature>, InferCreationAttributes<ItemFeature>>}
 *
 * @property {CreationOptional<number>} id - The unique identifier for the item feature.
 * @property {string} name - The name of the item feature.
 * @property {number} importance - The importance level of the item feature.
 * @property {boolean} is_primary - Indicates if the item feature is primary.
 * @property {ForeignKey<Thumbnail["id"]>} ThumbnailId - The foreign key to the Thumbnail model.
 *
 * @method static associate - Defines the associations for the ItemFeature model.
 * @method static initialize - Initializes the ItemFeature model with the given Sequelize instance.
 *
 * @method getItems - Gets the associated items.
 * @method countItems - Counts the associated items.
 * @method hasItem - Checks if a specific item is associated.
 * @method hasItems - Checks if multiple items are associated.
 * @method setItems - Sets the associated items.
 * @method addItem - Adds an item association.
 * @method addItems - Adds multiple item associations.
 * @method removeItem - Removes an item association.
 * @method removeItems - Removes multiple item associations.
 * @method createItem - Creates and associates a new item.
 *
 * @method getSellables - Gets the associated sellables.
 * @method countSellables - Counts the associated sellables.
 * @method hasSellable - Checks if a specific sellable is associated.
 * @method hasSellables - Checks if multiple sellables are associated.
 * @method setSellables - Sets the associated sellables.
 * @method addSellable - Adds a sellable association.
 * @method addSellables - Adds multiple sellable associations.
 * @method removeSellable - Removes a sellable association.
 * @method removeSellables - Removes multiple sellable associations.
 * @method createSellable - Creates and associates a new sellable.
 *
 * @method getSellableComponents - Gets the associated sellable components.
 * @method countSellableComponents - Counts the associated sellable components.
 * @method hasSellableComponent - Checks if a specific sellable component is associated.
 * @method hasSellableComponents - Checks if multiple sellable components are associated.
 * @method setSellableComponents - Sets the associated sellable components.
 * @method addSellableComponent - Adds a sellable component association.
 * @method addSellableComponents - Adds multiple sellable component associations.
 * @method removeSellableComponent - Removes a sellable component association.
 * @method removeSellableComponents - Removes multiple sellable component associations.
 * @method createSellableComponent - Creates and associates a new sellable component.
 *
 * @method getThumbnail - Gets the associated thumbnail.
 * @method setThumbnail - Sets the associated thumbnail.
 * @method createThumbnail - Creates and associates a new thumbnail.
 */
export class ItemFeature extends Model<
  InferAttributes<ItemFeature>,
  InferCreationAttributes<ItemFeature>
> {
  declare id: CreationOptional<number>;

  declare name: string;
  declare importance: number;
  declare is_primary: boolean;

  declare ThumbnailId: ForeignKey<Thumbnail["id"]>;

  static associate() {
    ItemFeature.hasMany(SellableComponent);

    ItemFeature.belongsToMany(Item, { through: "ItemFeatureLink" });
    ItemFeature.belongsToMany(Sellable, { through: SellableComponent });

    ItemFeature.belongsTo(Thumbnail, { onDelete: "SET NULL" });
  }

  /**
   * Initializes the ItemFeature model.
   * @param {Sequelize} sequelize - The Sequelize instance.
   */
  static initialize(sequelize: Sequelize) {
    ItemFeature.init(
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
        importance: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        is_primary: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: "ItemFeature",
        paranoid: true,
        timestamps: false,
      },
    );
  }

  declare getItems: BelongsToManyGetAssociationsMixin<Item>;
  declare countItems: BelongsToManyCountAssociationsMixin;
  declare hasItem: BelongsToManyHasAssociationMixin<Item, number>;
  declare hasItems: BelongsToManyHasAssociationsMixin<Item, number>;
  declare setItems: BelongsToManySetAssociationsMixin<Item, number>;
  declare addItem: BelongsToManyAddAssociationMixin<Item, number>;
  declare addItems: BelongsToManyAddAssociationsMixin<Item, number>;
  declare removeItem: BelongsToManyRemoveAssociationMixin<Item, number>;
  declare removeItems: BelongsToManyRemoveAssociationsMixin<Item, number>;
  declare createItem: BelongsToManyCreateAssociationMixin<Item>;

  declare getSellables: BelongsToManyGetAssociationsMixin<Sellable>;
  declare countSellables: BelongsToManyCountAssociationsMixin;
  declare hasSellable: BelongsToManyHasAssociationMixin<Sellable, number>;
  declare hasSellables: BelongsToManyHasAssociationsMixin<Sellable, number>;
  declare setSellables: BelongsToManySetAssociationsMixin<Sellable, number>;
  declare addSellable: BelongsToManyAddAssociationMixin<Sellable, number>;
  declare addSellables: BelongsToManyAddAssociationsMixin<Sellable, number>;
  declare removeSellable: BelongsToManyRemoveAssociationMixin<Sellable, number>;
  declare removeSellables: BelongsToManyRemoveAssociationsMixin<
    Sellable,
    number
  >;
  declare createSellable: BelongsToManyCreateAssociationMixin<Sellable>;

  declare getSellableComponents: HasManyGetAssociationsMixin<SellableComponent>;
  declare countSellableComponents: HasManyCountAssociationsMixin;
  declare hasSellableComponent: HasManyHasAssociationMixin<
    SellableComponent,
    number
  >;
  declare hasSellableComponents: HasManyHasAssociationsMixin<
    SellableComponent,
    number
  >;
  declare setSellableComponents: HasManySetAssociationsMixin<
    SellableComponent,
    number
  >;
  declare addSellableComponent: HasManyAddAssociationMixin<
    SellableComponent,
    number
  >;
  declare addSellableComponents: HasManyAddAssociationsMixin<
    SellableComponent,
    number
  >;
  declare removeSellableComponent: HasManyRemoveAssociationMixin<
    SellableComponent,
    number
  >;
  declare removeSellableComponents: HasManyRemoveAssociationsMixin<
    SellableComponent,
    number
  >;
  declare createSellableComponent: HasManyCreateAssociationMixin<SellableComponent>;

  declare getThumbnail: BelongsToGetAssociationMixin<Thumbnail>;
  declare setThumbnail: BelongsToSetAssociationMixin<Thumbnail, number>;
  declare createThumbnail: BelongsToCreateAssociationMixin<Thumbnail>;
}
