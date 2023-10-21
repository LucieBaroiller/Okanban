const { Router } = require("express");
const { listController } = require("../controllers");

const router = Router();

router.get("/lists", listController.getLists);
router.get("/lists/:id", listController.getOneList);
router.post("/lists", listController.createList);
router.delete("/lists/:id", listController.deleteList);
router.patch("/lists/:id", listController.updateList);


module.exports = router;