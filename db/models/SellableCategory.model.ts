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

import { Sellable, Thumbnail } from "@/db";

/**
 * Represents a category of sellable items.
 *
 * @extends {Model<InferAttributes<SellableCategory>, InferCreationAttributes<SellableCategory>>}
 *
 * @property {CreationOptional<number>} id - The unique identifier for the category.
 * @property {string} name - The name of the category.
 * @property {number} importance - The importance level of the category.
 * @property {ForeignKey<Thumbnail["id"]>} ThumbnailId - The foreign key referencing the Thumbnail model.
 *
 * @method static associate - Defines associations between models.
 * @method static initialize - Initializes the model with its attributes and options.
 *
 * @method getSellables - Gets associated sellable items.
 * @method countSellables - Counts associated sellable items.
 * @method hasSellable - Checks if a specific sellable item is associated.
 * @method hasSellables - Checks if multiple sellable items are associated.
 * @method setSellables - Sets associated sellable items.
 * @method addSellable - Adds a sellable item to the association.
 * @method addSellables - Adds multiple sellable items to the association.
 * @method removeSellable - Removes a sellable item from the association.
 * @method removeSellables - Removes multiple sellable items from the association.
 * @method createSellable - Creates and associates a new sellable item.
 *
 * @method getThumbnail - Gets the associated thumbnail.
 * @method setThumbnail - Sets the associated thumbnail.
 * @method createThumbnail - Creates and associates a new thumbnail.
 */
export class SellableCategory extends Model<
  InferAttributes<SellableCategory>,
  InferCreationAttributes<SellableCategory>
> {
  declare id: CreationOptional<number>;

  declare name: string;
  declare importance: number;

  declare ThumbnailId: ForeignKey<Thumbnail["id"]>;

  static associate() {
    SellableCategory.belongsToMany(Sellable, {
      through: "SellableCategoryLink",
    });

    SellableCategory.belongsTo(Thumbnail, { onDelete: "SET NULL" });
  }

  static initialize(sequelize: Sequelize) {
    SellableCategory.init(
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
      },
      {
        sequelize,
        modelName: "SellableCategory",
        timestamps: false,
      },
    );
  }

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

  declare getThumbnail: BelongsToGetAssociationMixin<Thumbnail>;
  declare setThumbnail: BelongsToSetAssociationMixin<Thumbnail, number>;
  declare createThumbnail: BelongsToCreateAssociationMixin<Thumbnail>;
}
