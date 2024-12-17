import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyCreateAssociationMixin,
} from "sequelize";

import {
  Employee,
  InventoryItem,
  Item,
  ItemFeature,
  Sellable,
  SellableCategory,
} from "@/db";

/**
 * Represents a Thumbnail model in the database.
 *
 * @extends {Model<InferAttributes<Thumbnail>, InferCreationAttributes<Thumbnail>>}
 *
 * @property {CreationOptional<number>} id - The unique identifier for the thumbnail.
 * @property {string} src - The source URL of the thumbnail image.
 * @property {string} alt - The alternative text for the thumbnail image.
 *
 * @method static associate - Defines associations between models.
 * @method static initialize - Initializes the model with its attributes and options.
 *
 * @method getEmployees - Gets associated employees.
 * @method countEmployees - Counts associated employees.
 * @method hasEmployee - Checks if a specific employee is associated.
 * @method hasEmployees - Checks if multiple specific employees are associated.
 * @method setEmployees - Sets associated employees.
 * @method addEmployee - Adds an associated employee.
 * @method addEmployees - Adds multiple associated employees.
 * @method removeEmployee - Removes an associated employee.
 * @method removeEmployees - Removes multiple associated employees.
 * @method createEmployee - Creates and associates a new employee.
 *
 * @method getItems - Gets associated items.
 * @method countItems - Counts associated items.
 * @method hasItem - Checks if a specific item is associated.
 * @method hasItems - Checks if multiple specific items are associated.
 * @method setItems - Sets associated items.
 * @method addItem - Adds an associated item.
 * @method addItems - Adds multiple associated items.
 * @method removeItem - Removes an associated item.
 * @method removeItems - Removes multiple associated items.
 * @method createItem - Creates and associates a new item.
 *
 * @method getItemCategories - Gets associated item categories.
 * @method countItemCategories - Counts associated item categories.
 * @method hasItemCategory - Checks if a specific item category is associated.
 * @method hasItemCategories - Checks if multiple specific item categories are associated.
 * @method setItemCategories - Sets associated item categories.
 * @method addItemCategory - Adds an associated item category.
 * @method addItemCategories - Adds multiple associated item categories.
 * @method removeItemCategory - Removes an associated item category.
 * @method removeItemCategories - Removes multiple associated item categories.
 * @method createItemCategory - Creates and associates a new item category.
 *
 * @method getSellables - Gets associated sellables.
 * @method countSellables - Counts associated sellables.
 * @method hasSellable - Checks if a specific sellable is associated.
 * @method hasSellables - Checks if multiple specific sellables are associated.
 * @method setSellables - Sets associated sellables.
 * @method addSellable - Adds an associated sellable.
 * @method addSellables - Adds multiple associated sellables.
 * @method removeSellable - Removes an associated sellable.
 * @method removeSellables - Removes multiple associated sellables.
 * @method createSellable - Creates and associates a new sellable.
 *
 * @method getSellableCategories - Gets associated sellable categories.
 * @method countSellableCategories - Counts associated sellable categories.
 * @method hasSellableCategory - Checks if a specific sellable category is associated.
 * @method hasSellableCategories - Checks if multiple specific sellable categories are associated.
 * @method setSellableCategories - Sets associated sellable categories.
 * @method addSellableCategory - Adds an associated sellable category.
 * @method addSellableCategories - Adds multiple associated sellable categories.
 * @method removeSellableCategory - Removes an associated sellable category.
 * @method removeSellableCategories - Removes multiple associated sellable categories.
 * @method createSellableCategory - Creates and associates a new sellable category.
 */
export class Thumbnail extends Model<
  InferAttributes<Thumbnail>,
  InferCreationAttributes<Thumbnail>
> {
  declare id: CreationOptional<number>;

  declare src: string;
  declare alt: string;

  static associate() {
    Thumbnail.hasMany(Employee);
    Thumbnail.hasMany(InventoryItem);
    Thumbnail.hasMany(Item);
    Thumbnail.hasMany(ItemFeature);
    Thumbnail.hasMany(Sellable);
    Thumbnail.hasMany(SellableCategory);
  }

  static initialize(sequelize: Sequelize) {
    Thumbnail.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        src: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: { notEmpty: true },
        },
        alt: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: { notEmpty: true },
        },
      },
      {
        sequelize,
        modelName: "Thumbnail",
        timestamps: false,
      },
    );
  }

  declare getEmployees: HasManyGetAssociationsMixin<Employee>;
  declare countEmployees: HasManyCountAssociationsMixin;
  declare hasEmployee: HasManyHasAssociationMixin<Employee, number>;
  declare hasEmployees: HasManyHasAssociationsMixin<Employee, number>;
  declare setEmployees: HasManySetAssociationsMixin<Employee, number>;
  declare addEmployee: HasManyAddAssociationMixin<Employee, number>;
  declare addEmployees: HasManyAddAssociationsMixin<Employee, number>;
  declare removeEmployee: HasManyRemoveAssociationMixin<Employee, number>;
  declare removeEmployees: HasManyRemoveAssociationsMixin<Employee, number>;
  declare createEmployee: HasManyCreateAssociationMixin<Employee>;

  declare getItems: HasManyGetAssociationsMixin<Item>;
  declare countItems: HasManyCountAssociationsMixin;
  declare hasItem: HasManyHasAssociationMixin<Item, number>;
  declare hasItems: HasManyHasAssociationsMixin<Item, number>;
  declare setItems: HasManySetAssociationsMixin<Item, number>;
  declare addItem: HasManyAddAssociationMixin<Item, number>;
  declare addItems: HasManyAddAssociationsMixin<Item, number>;
  declare removeItem: HasManyRemoveAssociationMixin<Item, number>;
  declare removeItems: HasManyRemoveAssociationsMixin<Item, number>;
  declare createItem: HasManyCreateAssociationMixin<Item>;

  declare getItemCategories: HasManyGetAssociationsMixin<ItemFeature>;
  declare countItemCategories: HasManyCountAssociationsMixin;
  declare hasItemCategory: HasManyHasAssociationMixin<ItemFeature, number>;
  declare hasItemCategories: HasManyHasAssociationsMixin<ItemFeature, number>;
  declare setItemCategories: HasManySetAssociationsMixin<ItemFeature, number>;
  declare addItemCategory: HasManyAddAssociationMixin<ItemFeature, number>;
  declare addItemCategories: HasManyAddAssociationsMixin<ItemFeature, number>;
  declare removeItemCategory: HasManyRemoveAssociationMixin<
    ItemFeature,
    number
  >;
  declare removeItemCategories: HasManyRemoveAssociationsMixin<
    ItemFeature,
    number
  >;
  declare createItemCategory: HasManyCreateAssociationMixin<ItemFeature>;

  declare getSellables: HasManyGetAssociationsMixin<Sellable>;
  declare countSellables: HasManyCountAssociationsMixin;
  declare hasSellable: HasManyHasAssociationMixin<Sellable, number>;
  declare hasSellables: HasManyHasAssociationsMixin<Sellable, number>;
  declare setSellables: HasManySetAssociationsMixin<Sellable, number>;
  declare addSellable: HasManyAddAssociationMixin<Sellable, number>;
  declare addSellables: HasManyAddAssociationsMixin<Sellable, number>;
  declare removeSellable: HasManyRemoveAssociationMixin<Sellable, number>;
  declare removeSellables: HasManyRemoveAssociationsMixin<Sellable, number>;
  declare createSellable: HasManyCreateAssociationMixin<Sellable>;

  declare getSellableCategories: HasManyGetAssociationsMixin<SellableCategory>;
  declare countSellableCategories: HasManyCountAssociationsMixin;
  declare hasSellableCategory: HasManyHasAssociationMixin<
    SellableCategory,
    number
  >;
  declare hasSellableCategories: HasManyHasAssociationsMixin<
    SellableCategory,
    number
  >;
  declare setSellableCategories: HasManySetAssociationsMixin<
    SellableCategory,
    number
  >;
  declare addSellableCategory: HasManyAddAssociationMixin<
    SellableCategory,
    number
  >;
  declare addSellableCategories: HasManyAddAssociationsMixin<
    SellableCategory,
    number
  >;
  declare removeSellableCategory: HasManyRemoveAssociationMixin<
    SellableCategory,
    number
  >;
  declare removeSellableCategories: HasManyRemoveAssociationsMixin<
    SellableCategory,
    number
  >;
  declare createSellableCategory: HasManyCreateAssociationMixin<SellableCategory>;
}
