const sequelize = require("./database");
const { Model, DataTypes } = require("sequelize");

class Card extends Model {}

Card.init({
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  color: {
    type: DataTypes.TEXT,
  }
}, {
  sequelize,
  tableName: "card"
});

module.exports = Card;