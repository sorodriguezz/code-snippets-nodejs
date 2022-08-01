const express = require("express");
const router = express.Router();

const { createLanguage, listlanguages, changeStateLanguage, read, update, remove } = require("../controllers/language");

router.post("/language", createLanguage);
router.get("/languages", listlanguages);
router.patch("/language/:slug", changeStateLanguage);
router.get("/language/:slug", read);
router.put("/language/:slug", update);
router.delete("/language/:slug", remove);

module.exports = router;