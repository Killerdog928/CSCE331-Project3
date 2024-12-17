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

import { JobPosition, Order, Thumbnail } from "@/db";

/**
 * Represents an Employee model.
 *
 * @extends Model
 *
 * @property {number} id - The unique identifier for the employee. This is an optional field during creation.
 * @property {string} name - The name of the employee. This field is required and cannot be empty.
 * @property {Date} startDate - The start date of the employee. This is an optional field during creation.
 * @property {Date} endDate - The end date of the employee. This is an optional field during creation.
 * @property {number} JobPositionId - The foreign key referencing the JobPosition model.
 * @property {number} ThumbnailId - The foreign key referencing the Thumbnail model.
 * @property {string} email - The email of the employee. This is an optional field.
 *
 * @method static associate - Defines associations for the Employee model.
 * @method static initialize - Initializes the Employee model with its attributes and options.
 *
 * @method getJobPosition - Gets the associated JobPosition.
 * @method setJobPosition - Sets the associated JobPosition.
 * @method createJobPosition - Creates a new associated JobPosition.
 *
 * @method getOrders - Gets the associated Orders.
 * @method countOrders - Counts the associated Orders.
 * @method hasOrder - Checks if a specific Order is associated.
 * @method hasOrders - Checks if multiple Orders are associated.
 * @method setOrders - Sets the associated Orders.
 * @method addOrder - Adds a specific Order to the association.
 * @method addOrders - Adds multiple Orders to the association.
 * @method removeOrder - Removes a specific Order from the association.
 * @method removeOrders - Removes multiple Orders from the association.
 * @method createOrder - Creates a new associated Order.
 *
 * @method getThumbnail - Gets the associated Thumbnail.
 * @method setThumbnail - Sets the associated Thumbnail.
 * @method createThumbnail - Creates a new associated Thumbnail.
 */
export class Employee extends Model<
  InferAttributes<Employee>,
  InferCreationAttributes<Employee>
> {
  declare id: CreationOptional<number>;

  declare name: string;

  declare startDate: CreationOptional<Date>;
  declare endDate: CreationOptional<Date>;

  declare JobPositionId: ForeignKey<JobPosition["id"]>;
  declare ThumbnailId: ForeignKey<Thumbnail["id"]>;

  declare email: CreationOptional<string>;

  static associate() {
    Employee.belongsTo(JobPosition, { onDelete: "RESTRICT" });
    Employee.belongsTo(Thumbnail, { onDelete: "SET NULL" });

    Employee.hasMany(Order);
  }

  static initialize(sequelize: Sequelize) {
    Employee.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: { notEmpty: true },
        },

        email: DataTypes.STRING,

        startDate: DataTypes.DATE,
        endDate: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: "Employee",
        paranoid: true,
        timestamps: true,

        createdAt: "startDate",
        updatedAt: false,
        deletedAt: "endDate",
      },
    );
  }

  declare getJobPosition: BelongsToGetAssociationMixin<JobPosition>;
  declare setJobPosition: BelongsToSetAssociationMixin<JobPosition, number>;
  declare createJobPosition: BelongsToCreateAssociationMixin<JobPosition>;

  declare getOrders: HasManyGetAssociationsMixin<Order>;
  declare countOrders: HasManyCountAssociationsMixin;
  declare hasOrder: HasManyHasAssociationMixin<Order, number>;
  declare hasOrders: HasManyHasAssociationsMixin<Order, number>;
  declare setOrders: HasManySetAssociationsMixin<Order, number>;
  declare addOrder: HasManyAddAssociationMixin<Order, number>;
  declare addOrders: HasManyAddAssociationsMixin<Order, number>;
  declare removeOrder: HasManyRemoveAssociationMixin<Order, number>;
  declare removeOrders: HasManyRemoveAssociationsMixin<Order, number>;
  declare createOrder: HasManyCreateAssociationMixin<Order>;

  declare getThumbnail: BelongsToGetAssociationMixin<Thumbnail>;
  declare setThumbnail: BelongsToSetAssociationMixin<Thumbnail, number>;
  declare createThumbnail: BelongsToCreateAssociationMixin<Thumbnail>;
}
