const { Router } = require("express");
const { cardController } = require("../controllers");

const router = Router();

router.get("/cards", cardController.getAllCards);
router.get("/cards/:id", cardController.getOneCard);
router.post("/cards", cardController.createCard);
router.patch("/cards/:id", cardController.updateCard);
router.delete("/cards/:id", cardController.deleteCard);

router.get("/lists/:list_id/cards", cardController.getAllCardsOfList);

module.exports = router;