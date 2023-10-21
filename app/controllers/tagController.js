const { Tag, Card } = require("../models");
const { isValidHexadecimalColor } = require("./utils");

async function getAllTags(_, res) {
  const tags = await Tag.findAll();
  res.json(tags);
}

async function getOneTag(req, res) {
  const tagId = req.params.id;
  const tag = await Tag.findByPk(tagId);
  if (! tag) {
    return res.json({ error: "Tag not found. Please verify the provided id." });
  }
  res.json(tag);
}

async function createTag(req, res) {
  const { name, color } = req.body;

  if (! name) {
    return res.status(400).json({ error: "Missing (or empty) body parameter: 'name'." });
  }

  if (color && ! isValidHexadecimalColor(color)) {
    return res.status(400).json({ error: "Invalid type: 'color' should be a valid hexadecimal code." });
  }

  const alreadyExistingTagWithSameName = await Tag.findOne({ where: { name }});
  if (alreadyExistingTagWithSameName) { // S'il existe un tag avec le même nom, on bloque.
    return res.status(409).json({ error: "Already existing tag with the same name." });
  }

  const tag = await Tag.create({ name, color });

  res.status(201).json(tag);
}

async function updateTag(req, res) {
  const tagId = req.params.id;
  const { name, color } = req.body;

  if (! name && ! color) {
    return res.status(400).json({ error: "Invalid body. Should provide at least a 'name' or 'color' property" });
  }

  if (color && ! isValidHexadecimalColor(color)) {
    return res.status(400).json({ error: "Invalid type: color should be a hexadecimal code (string)." });
  }

  const tag = await Tag.findByPk(tagId);
  if (! tag) {
    return res.status(404).json({ error: "Tag not found. Please verify the provided id." });
  }

  if (name) { 
    const alreadyExistingTagWithSameName = await Tag.findOne({ where: { name }});
    if (alreadyExistingTagWithSameName && alreadyExistingTagWithSameName.id !== tag.id) { // S'il existe un tag avec le même nom, on bloque.
      return res.status(409).json({ error: "Already existing tag with the same name." });
    }
  }

  tag.name = name || tag.name;
  tag.color = color || tag.color;
  await tag.save();

  res.status(200).json(tag);
}

async function deleteTag(req, res) {
  const tagId = req.params.id;

  const tag = await Tag.findByPk(tagId);
  if (! tag) {
    return res.status(404).send({ error: "Tag not found. Please verify the provided id." });
  }

  await tag.destroy();

  res.status(204).end();
}


async function addTagToCard(req, res) {
  const { cardId, tagId } = req.params;

  const card = await Card.findByPk(parseInt(cardId));
  if (! card) { 
    return res.json({ error: "Card not found. Please verify the provided id." });
  }

  const tag = await Tag.findByPk(tagId);
  if (! tag) { 
    return res.json({ error: "Tag not found. Please verify the provided id." });
  }

  
  await card.addTag(tag);

  const updatedCard = await Card.findByPk(cardId, { include: ["tags"] }); 
  res.status(201).json(updatedCard);
}


async function removeTagFromCard(req, res) {
  const { cardId, tagId } = req.params;

  const card = await Card.findByPk(cardId);
  if (! card) {
    return res.json({ error: "Card not found. Please verify the provided id." });
  }

  const tag = await Tag.findByPk(tagId);
  if (! tag) {
    return res.json({ error: "Tag not found. Please verify the provided id." });
  }

  await card.removeTag(tag);

  const updatedCard = await Card.findByPk(cardId, { include: ["tags"] });
  res.json(updatedCard);
}


module.exports = {
  getAllTags,
  getOneTag,
  createTag,
  updateTag,
  deleteTag,
  addTagToCard,
  removeTagFromCard
};