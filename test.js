const { List } = require("./app/models/");

async function test() {
  const lists = await List.findAll({});
  console.log(JSON.stringify(lists, null, 2));
}

test();