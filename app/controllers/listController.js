const sanitizeHtml = require('sanitize-html');
const { List } = require("../models");

async function getLists(req, res) {
  const lists = await List.findAll({
    order: [["position", "ASC"], ["cards", "position", "ASC"]],
    include: {
      association: "cards",
      include: "tags"
    }
  });
  res.status(200).json(lists);
}

async function getOneList(req, res) {
  // Getting params and parsing it
  const listId = parseInt(req.params.id);

  // Validating input
  if (isNaN(listId)) { 
    res.status(404).json({ error: "List not found. Please verify the provided id." })
    return;
  }

  // Getting teh targeted list
  const list = await List.findByPk(listId);

  // If no list found : throwing error
  if (! list) {
    res.status(404).json({ error: "List not found. Please verify the provided id." });
    return;
  }

  // Sending data
  res.status(200).json(list);
}

async function createList(req, res) {
  // Get and parse inputs
  const { name, position } = req.body; 

  // Checking "name" type
  if (! name || typeof name !== "string") {
    return res.status(400).json({ error: "Missing body parameter: name" });
  }

  // Checking if position was sent to backend and checking its type
  if (position && !Number.isInteger(position)) {
    return res.status(400).json({ error: "Invalid type: position should be a positive number" });
  }

  // Creating the list
  const list = await List.create({
    name: sanitizeHtml(name),
    position: (position ? parseInt(position) : 0)
  });

   // Response
  res.status(201).json(list);
}

async function deleteList(req, res) {
  // Parsing params
  const listId = parseInt(req.params.id);

  if (!Number.isInteger(listId)) {
    return res.status(404).json({ error: "List not found. Please verify the provided id." });
  }

  // Getting the targeted list infos to make sure there's something to delete
  const list = await List.findByPk(listId);

  if (!list) { 
    return res.status(404).json({ error: "List not found. Please verify the provided id." });
  }

  await list.destroy(); // Deleting the targeted list

  // Sendin response without a body
  res.status(204).end(); 
}

async function updateList(req, res) {
  // Parsing inputs
  const { name: newName, position: newPosition } = req.body;
  const listId = parseInt(req.params.id);

  if (isNaN(listId)) {
    return res.status(404).json({ error: "List not found. Please verify the provided id." })
  }

  // If no input was filled : throwing error
  if (newName === undefined && newPosition === undefined) {
    return res.status(400).json({ "error": "Invalid body. Should provide at least a 'name' or 'position' property" });
  }

  // if wrong type sent : throwing error
  if (newName && typeof newName !== "string") {
    return res.status(400).json({ "error": "Invalid body parameter 'name'. Should provide a string." });
  }
  if (newPosition && !Number.isInteger(newPosition)) {
    return res.status(400).json({ "error": "Invalid body parameter 'position'. Should provide a positive number." });
  }

  // Getting targeted list previous infos
  const list = await List.findByPk(listId);

  if (!list) {
    return res.status(404).json({ error: "List not found. Please verify the provided id." })
  }

  // Reassignating values
  if (newName) {
    list.name = newName;
  }

  if (newPosition) {
    list.position = parseInt(newPosition);
  }
  // Updating list
  await list.save();

  res.status(200).json(list);
}

const listController = {
  getLists,
  getOneList,
  createList,
  deleteList,
  updateList
};

module.exports = listController;