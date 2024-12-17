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

import { Order } from "@/db";

/**
 * Represents a recent order in the system.
 *
 * @remarks
 * This class extends the Sequelize Model class and provides the structure for the RecentOrder model.
 * It includes attributes such as `id`, `orderStatus`, `updatedAt`, and `OrderId`.
 * The `Status` enum defines the possible states of an order.
 *
 * @example
 * ```typescript
 * const recentOrder = await RecentOrder.create({
 *   orderStatus: RecentOrder.Status.PENDING,
 *   OrderId: someOrderId,
 * });
 * ```
 *
 * @property {number} id - The unique identifier for the recent order.
 * @property {number} orderStatus - The status of the order, represented by the `Status` enum.
 * @property {Date} updatedAt - The timestamp of the last update to the order.
 * @property {number} OrderId - The foreign key referencing the associated order.
 *
 * @method static associate - Sets up the association between RecentOrder and Order models.
 * @method static initialize - Initializes the RecentOrder model with the given Sequelize instance.
 * @method getOrder - Retrieves the associated order.
 * @method setOrder - Sets the associated order.
 * @method createOrder - Creates a new associated order.
 */
export class RecentOrder extends Model<
  InferAttributes<RecentOrder>,
  InferCreationAttributes<RecentOrder>
> {
  /**
   * Enum representing the status of an order.
   *
   * @property {number} PENDING - The order has been submitted and is in the queue.
   * @property {number} IN_PROGRESS - An employee has begun preparing the order.
   * @property {number} COMPLETED - The order is ready for pickup.
   * @property {number} CANCELLED - The order has been cancelled and will not be prepared.
   */
  static Status = {
    PENDING: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    CANCELLED: 3,
  };

  declare id: CreationOptional<number>;

  declare orderStatus: number;

  declare updatedAt: CreationOptional<Date>;

  declare OrderId: ForeignKey<Order["id"]>;

  static associate() {
    RecentOrder.belongsTo(Order);
  }

  static initialize(sequelize: Sequelize) {
    RecentOrder.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        orderStatus: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isIn: [Object.values(RecentOrder.Status)],
          },
        },

        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: "RecentOrder",
        timestamps: true,

        createdAt: false,
      },
    );
  }

  declare getOrder: BelongsToGetAssociationMixin<Order>;
  declare setOrder: BelongsToSetAssociationMixin<Order, number>;
  declare createOrder: BelongsToCreateAssociationMixin<Order>;
}
