const { Router } = require("express");
const { tagController } = require("../controllers");

const router = Router();

router.get("/tags", tagController.getAllTags);
router.get("/tags/:id", tagController.getOneTag);
router.post("/tags", tagController.createTag);
router.patch("/tags/:id", tagController.updateTag);
router.delete("/tags/:id", tagController.deleteTag);

router.put("/cards/:cardId/tags/:tagId", tagController.addTagToCard);
router.delete("/cards/:cardId/tags/:tagId", tagController.removeTagFromCard);

module.exports = router;