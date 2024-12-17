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

import { Item, Order, Sellable, SoldItem } from "@/db";

/**
 * Represents a SoldSellable model which is used to manage the relationship between orders and sellable items.
 *
 * @extends {Model<InferAttributes<SoldSellable>, InferCreationAttributes<SoldSellable>>}
 *
 * @property {CreationOptional<number>} id - The unique identifier for the SoldSellable instance.
 * @property {ForeignKey<Order["id"]>} OrderId - The foreign key referencing the Order model.
 * @property {ForeignKey<Sellable["id"]>} SellableId - The foreign key referencing the Sellable model.
 *
 * @method static associate - Defines the associations for the SoldSellable model.
 * @method static initialize - Initializes the SoldSellable model with the given sequelize instance.
 *
 * @method getItems - Retrieves the associated items.
 * @method countItems - Counts the associated items.
 * @method hasItem - Checks if a specific item is associated.
 * @method hasItems - Checks if multiple items are associated.
 * @method setItems - Sets the associated items.
 * @method addItem - Adds a specific item to the association.
 * @method addItems - Adds multiple items to the association.
 * @method removeItem - Removes a specific item from the association.
 * @method removeItems - Removes multiple items from the association.
 * @method createItem - Creates and associates a new item.
 *
 * @method getOrder - Retrieves the associated order.
 * @method setOrder - Sets the associated order.
 * @method createOrder - Creates and associates a new order.
 *
 * @method getSellable - Retrieves the associated sellable.
 * @method setSellable - Sets the associated sellable.
 * @method createSellable - Creates and associates a new sellable.
 */
export class SoldSellable extends Model<
  InferAttributes<SoldSellable>,
  InferCreationAttributes<SoldSellable>
> {
  declare id: CreationOptional<number>;

  declare OrderId: ForeignKey<Order["id"]>;
  declare SellableId: ForeignKey<Sellable["id"]>;

  static associate() {
    SoldSellable.belongsTo(Order);
    SoldSellable.belongsTo(Sellable);

    SoldSellable.hasMany(SoldItem);

    SoldSellable.belongsToMany(Item, { through: SoldItem });
  }

  static initialize(sequelize: Sequelize) {
    SoldSellable.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
      },
      {
        sequelize,
        modelName: "SoldSellable",
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

  declare getOrder: BelongsToGetAssociationMixin<Order>;
  declare setOrder: BelongsToSetAssociationMixin<Order, number>;
  declare createOrder: BelongsToCreateAssociationMixin<Order>;

  declare getSellable: BelongsToGetAssociationMixin<Sellable>;
  declare setSellable: BelongsToSetAssociationMixin<Sellable, number>;
  declare createSellable: BelongsToCreateAssociationMixin<Sellable>;
}
