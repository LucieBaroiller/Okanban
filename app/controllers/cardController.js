const { Card, List } = require("../models");
const { isValidHexadecimalColor } = require("./utils");

// Getting cards with their associated tags
async function getAllCards(_, res) {
  const cards = await Card.findAll({
    order: [
      ["position", "ASC"],
      ["created_at", "DESC"]
    ],
    include: {
      association: "tags"
    }
  });

  res.status(200).json(cards);
}

// Getting the targeted card infos
async function getOneCard(req, res) {
  const cardId = parseInt(req.params.id);

  const card = await Card.findByPk(cardId, {
    include: "tags"
  });
  if (!card) {
    return res.status(404).json({ error: "Card not found. Please verify the provided id." });
  }
  res.status(200).json(card);
}

// Creating a new card
async function createCard(req, res) {
  const { content, color, position, list_id } = req.body;

  if (! content) { 
    return res.status(400).json({ error: "Missing body (or empty) parameter: 'content'." });
  }
  if (! list_id) { 
    return res.status(400).json({ error: "Missing body parameter: 'list_id'."});
  }
  if (color && ! isValidHexadecimalColor(color)) { 
    return res.status(400).json({ error: "Invalid type: 'color' should be a valid hexadecimal code." });
  }
  if (position && !Number.isInteger(position)) { 
    return res.status(400).json({ error: "Invalid type: 'position' should be a number." });
  }
  if (! await doesListExist(list_id)) {
    return res.status(400).json({ error: "Invalid body parameter: 'list_id' does not exist." });
  }
  const card = await Card.create({
    content,
    list_id: parseInt(list_id),
    position: position ? parseInt(position) : 0, 
    color: color || null
  });

  res.status(201).json(card);
}

// Updating the targeted card
async function updateCard(req, res) {
  const cardId = parseInt(req.params.id);
  const { content, position, color, list_id } = req.body;
  // Checks
  if (! content && ! position && ! color && ! list_id) { 
    return res.status(400).json({ error: "Invalid body. Should provide at least a 'content', 'color', 'position'  or 'list_id' property" });
  }
  if (position && isNaN(position)) { 
    return res.status(400).json({ error: "Invalid type: 'position' should be a number." });
  }
  if (color && ! isValidHexadecimalColor(color)) {
    return res.status(400).json({ error: "Invalid type: position should be a valid hexadecimal code (string)." });
  }
  if (list_id && ! await doesListExist(list_id)) { 
    return res.status(400).json({ error: "Invalid body parameter: list_id does not exist." });
  }

  const card = await Card.findByPk(cardId);
  // Reassignating values
  if (!card) {
    return res.status(404).json({ error: "Card not found. Please verify the provided id." });
  }
  if (content !== undefined) { 
    card.content = content;
  }
  if (position !== undefined) { 
    card.position = parseInt(position);
  }
  if (color !== undefined) { 
    card.color = color;
  }
  if (list_id) { 
    card.list_id = parseInt(list_id);
  }

  await card.save();

  res.status(200).json(card);
}

// Checking if list exists
async function doesListExist(listId) {
  const list = await List.findByPk(listId);
  return !! list; 
}

// Deleting card
async function deleteCard(req, res) {
  const {
      id
  } = req.params;
  const card = await Card.findByPk(parseInt(id));
  if (!card) {
      res.status(404).json({error: "List not found. Please verify the provided id."});
      return;
  }

  await card.destroy();
  res.status(204).end();
}

// Getting all cards and their associated tags from one list
async function getAllCardsOfList(req, res) {
  const listId = parseInt(req.params.list_id);

  const cards = await Card.findAll({
    where: { list_id: listId },
    include: "tags"
  });

  res.status(200).json(cards);
}

module.exports = {
  getAllCards,
  getAllCardsOfList,
  getOneCard,
  createCard,
  updateCard,
  deleteCard
};