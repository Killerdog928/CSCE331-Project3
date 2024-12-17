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

import { ItemFeature, Sellable } from "@/db";

/**
 * Represents a component that can be sold.
 *
 * @extends Model
 *
 * @property {CreationOptional<number>} id - The unique identifier for the sellable component.
 * @property {CreationOptional<number>} amount - The amount of the sellable component, defaults to 1.
 * @property {ForeignKey<ItemFeature["id"]>} ItemFeatureId - The foreign key referencing the ItemFeature model.
 * @property {ForeignKey<Sellable["id"]>} SellableId - The foreign key referencing the Sellable model.
 *
 * @method static associate - Defines associations to other models.
 * @method static initialize - Initializes the model with its attributes and options.
 *
 * @method getItemFeature - Gets the associated ItemFeature.
 * @method setItemFeature - Sets the associated ItemFeature.
 * @method createItemFeature - Creates a new associated ItemFeature.
 *
 * @method getSellable - Gets the associated Sellable.
 * @method setSellable - Sets the associated Sellable.
 * @method createSellable - Creates a new associated Sellable.
 */
export class SellableComponent extends Model<
  InferAttributes<SellableComponent>,
  InferCreationAttributes<SellableComponent>
> {
  declare id: CreationOptional<number>;

  declare amount: CreationOptional<number>;

  declare ItemFeatureId: ForeignKey<ItemFeature["id"]>;
  declare SellableId: ForeignKey<Sellable["id"]>;

  static associate() {
    SellableComponent.belongsTo(ItemFeature, { onDelete: "RESTRICT" });
    SellableComponent.belongsTo(Sellable);
  }

  static initialize(sequelize: Sequelize) {
    SellableComponent.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        modelName: "SellableComponent",
        timestamps: false,
      },
    );
  }

  declare getItemFeature: BelongsToGetAssociationMixin<ItemFeature>;
  declare setItemFeature: BelongsToSetAssociationMixin<ItemFeature, number>;
  declare createItemFeature: BelongsToCreateAssociationMixin<ItemFeature>;

  declare getSellable: BelongsToGetAssociationMixin<Sellable>;
  declare setSellable: BelongsToSetAssociationMixin<Sellable, number>;
  declare createSellable: BelongsToCreateAssociationMixin<Sellable>;
}
