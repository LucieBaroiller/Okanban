const sequelize = require("./database");
const { Model, DataTypes } = require("sequelize");

class Tag extends Model {}

Tag.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  color: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  tableName: "tag"
});

module.exports = Tag;