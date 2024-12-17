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
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
} from "sequelize";

import { Employee, RecentOrder, Sellable, SoldSellable } from "@/db";

/**
 * Represents an order in the system.
 *
 * @extends Model
 *
 * @property {CreationOptional<number>} id - The unique identifier for the order.
 * @property {string} customerName - The name of the customer who placed the order.
 * @property {number} totalPrice - The total price of the order.
 * @property {CreationOptional<Date>} orderDate - The date when the order was placed.
 * @property {ForeignKey<Employee["id"]>} EmployeeId - The foreign key referencing the employee associated with the order.
 *
 * @method static associate - Defines associations between models.
 * @method static initialize - Initializes the model with its attributes and options.
 *
 * @method getEmployee - Gets the associated employee.
 * @method setEmployee - Sets the associated employee.
 * @method createEmployee - Creates a new associated employee.
 *
 * @method getSellables - Gets the associated sellables.
 * @method countSellables - Counts the associated sellables.
 * @method hasSellable - Checks if a specific sellable is associated.
 * @method hasSellables - Checks if multiple sellables are associated.
 * @method setSellables - Sets the associated sellables.
 * @method addSellable - Adds a specific sellable to the association.
 * @method addSellables - Adds multiple sellables to the association.
 * @method removeSellable - Removes a specific sellable from the association.
 * @method removeSellables - Removes multiple sellables from the association.
 * @method createSellable - Creates a new associated sellable.
 *
 * @method getSoldSellables - Gets the associated sold sellables.
 * @method countSoldSellables - Counts the associated sold sellables.
 * @method hasSoldSellable - Checks if a specific sold sellable is associated.
 * @method hasSoldSellables - Checks if multiple sold sellables are associated.
 * @method setSoldSellables - Sets the associated sold sellables.
 * @method addSoldSellable - Adds a specific sold sellable to the association.
 * @method addSoldSellables - Adds multiple sold sellables to the association.
 * @method removeSoldSellable - Removes a specific sold sellable from the association.
 * @method removeSoldSellables - Removes multiple sold sellables from the association.
 * @method createSoldSellable - Creates a new associated sold sellable.
 *
 * @method getRecentOrder - Gets the associated recent order.
 * @method setRecentOrder - Sets the associated recent order.
 * @method createRecentOrder - Creates a new associated recent order.
 */
export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<number>;

  declare customerName: string;
  declare totalPrice: number;

  declare orderDate: CreationOptional<Date>;

  declare EmployeeId: ForeignKey<Employee["id"]>;

  static associate() {
    Order.belongsTo(Employee, { onDelete: "SET NULL" });

    Order.hasOne(RecentOrder);
    Order.hasMany(SoldSellable);

    Order.belongsToMany(Sellable, { through: SoldSellable });
  }

  static initialize(sequelize: Sequelize) {
    Order.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        customerName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: { notEmpty: true },
        },
        totalPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },

        orderDate: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: "Order",
        timestamps: true,

        createdAt: "orderDate",
        updatedAt: false,
      },
    );
  }

  declare getEmployee: BelongsToGetAssociationMixin<Employee>;
  declare setEmployee: BelongsToSetAssociationMixin<Employee, number>;
  declare createEmployee: BelongsToCreateAssociationMixin<Employee>;

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

  declare getRecentOrder: HasOneGetAssociationMixin<RecentOrder>;
  declare setRecentOrder: HasOneSetAssociationMixin<RecentOrder, number>;
  declare createRecentOrder: HasOneCreateAssociationMixin<RecentOrder>;
}
