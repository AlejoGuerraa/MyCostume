import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Category = sequelize.define(
  'Category',
  {
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'category_id',
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'categories',
    underscored: true,
  },
)

export const Item = sequelize.define(
  'Item',
  {
    itemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'item_id',
    },
    name: {
      type: DataTypes.STRING(160),
      allowNull: false,
    },
    urlPhoto: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      defaultValue: null,
      field: 'url_photo',
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id',
    },
  },
  {
    tableName: 'items',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['name', 'category_id'],
      },
    ],
  },
)

export const Costume = sequelize.define(
  'Costume',
  {
    costumeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'costume_id',
    },
    name: {
      type: DataTypes.STRING(160),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    urlPhoto: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      defaultValue: null,
      field: 'url_photo',
    },
    source: {
      type: DataTypes.STRING(160),
      allowNull: true,
    },
  },
  {
    tableName: 'costumes',
    underscored: true,
  },
)

export const CostumeItem = sequelize.define(
  'CostumeItem',
  {
    costumeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'costume_id',
    },
    itemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'item_id',
    },
  },
  {
    tableName: 'costume_items',
    timestamps: false,
    underscored: true,
  },
)

Category.hasMany(Item, { as: 'items', foreignKey: 'categoryId' })
Item.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' })
Costume.belongsToMany(Item, {
  as: 'items',
  through: CostumeItem,
  foreignKey: 'costumeId',
  otherKey: 'itemId',
})
Item.belongsToMany(Costume, {
  as: 'costumes',
  through: CostumeItem,
  foreignKey: 'itemId',
  otherKey: 'costumeId',
})
