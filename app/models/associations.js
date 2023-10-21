const Card = require("./Card");
const Tag = require("./Tag");
const List = require("./List");

// Card <-> List
// One-To-Many

List.hasMany(Card, {
  as: "cards", // Depuis une List, je pourrai demander ses "cards"
  foreignKey: "list_id"
});
Card.belongsTo(List, {
  as: "list", // Depuis une Card, je veux la "list"
  foreignKey: "list_id"
});



// Card <-> Tag
// Many-to-Many

Card.belongsToMany(Tag, {
  as: "tags",
  through: "card_has_tag",
  foreignKey: "card_id" // name of the foreign key in the target table (target table = Tag)
});

Tag.belongsToMany(Card, {
  as: "cards",
  through: "card_has_tag",
  foreignKey: "tag_id" // name of the foreign key in the target table (target table = Card)
});


module.exports = { Tag, Card, List };