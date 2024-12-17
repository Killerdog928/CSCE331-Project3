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

import { Employee } from "@/db";

/**
 * Represents a job position within the organization.
 *
 * @extends Model
 *
 * @property {number} id - The unique identifier for the job position.
 * @property {string} name - The name of the job position.
 * @property {number} access - The access permissions associated with the job position, represented as bitwise flags.
 *
 * @method hasAccess - Checks if the job position has a specific access permission.
 * @param {number} flag - The access flag to check.
 * @returns {boolean} - Returns true if the job position has the specified access permission, otherwise false.
 *
 * @method static associate - Defines associations between models.
 *
 * @method static initialize - Initializes the JobPosition model with its attributes and options.
 * @param {Sequelize} sequelize - The Sequelize instance.
 *
 * @method getEmployees - Gets the associated employees.
 * @method countEmployees - Counts the associated employees.
 * @method hasEmployee - Checks if a specific employee is associated.
 * @method hasEmployees - Checks if multiple employees are associated.
 * @method setEmployees - Sets the associated employees.
 * @method addEmployee - Adds a employee association.
 * @method addEmployees - Adds multiple employee associations.
 * @method removeEmployee - Removes a employee association.
 * @method removeEmployees - Removes multiple employee associations.
 * @method createEmployee - Creates and associates a new employee.
 *
 * @static AccessFlags - A static object that defines various access permissions using bitwise flags.
 * @property {number} NONE - No access (0x00).
 * @property {number} READ_EMPLOYEES - Permission to read employee data (0x01).
 * @property {number} READ_INVENTORY - Permission to read inventory data (0x02).
 * @property {number} READ_ORDERS - Permission to read orders data (0x04).
 * @property {number} READ_MENU - Permission to read menu data (0x08).
 * @property {number} READ_ALL - Permission to read all data (0x0f).
 * @property {number} WRITE_EMPLOYEES - Permission to write employee data (0x10).
 * @property {number} WRITE_INVENTORY - Permission to write inventory data (0x20).
 * @property {number} WRITE_ORDERS - Permission to write orders data (0x40).
 * @property {number} WRITE_MENU - Permission to write menu data (0x80).
 * @property {number} WRITE_ALL - Permission to write all data (0xf0).
 * @property {number} BASIC_ORDERING - Basic ordering permissions (0x4e).
 * @property {number} ALL - All permissions (0xff).
 */
export class JobPosition extends Model<
  InferAttributes<JobPosition>,
  InferCreationAttributes<JobPosition>
> {
  /**
   * AccessFlags is a static object that defines various access permissions
   * using bitwise flags. Each flag represents a specific permission that can
   * be combined using bitwise OR operations to create a composite permission set.
   *
   * Flags:
   * - NONE: No access (0x00)
   * - READ_EMPLOYEES: Permission to read employee data (0x01)
   * - READ_INVENTORY: Permission to read inventory data (0x02)
   * - READ_ORDERS: Permission to read orders data (0x04)
   * - READ_MENU: Permission to read menu data (0x08)
   * - WRITE_EMPLOYEES: Permission to write employee data (0x10)
   * - WRITE_INVENTORY: Permission to write inventory data (0x20)
   * - WRITE_ORDERS: Permission to write orders data (0x40)
   * - WRITE_MENU: Permission to write menu data (0x80)
   */
  static AccessFlags = {
    NONE: 0x00,

    READ_EMPLOYEES: 0x01,
    READ_INVENTORY: 0x02,
    READ_ORDERS: 0x04,
    READ_MENU: 0x08,
    READ_ALL: 0x0f,

    WRITE_EMPLOYEES: 0x10,
    WRITE_INVENTORY: 0x20,
    WRITE_ORDERS: 0x40,
    WRITE_MENU: 0x80,
    WRITE_ALL: 0xf0,

    BASIC_ORDERING: 0x4e,
    ALL: 0xff,
  };

  declare id: CreationOptional<number>;

  declare name: string;
  declare access: number;

  hasAccess(flag: number): boolean {
    return (this.access & flag) !== 0;
  }

  static associate() {
    JobPosition.hasMany(Employee);
  }

  static initialize(sequelize: Sequelize) {
    JobPosition.init(
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

        access: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: JobPosition.AccessFlags.NONE,
        },
      },
      {
        sequelize,
        modelName: "JobPosition",
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
}
