const express = require("express");
const router = express.Router();

const { createTag, listTags, changeStateTag, read, update, remove } = require("../controllers/tag");

router.post("/tag", createTag);
router.get("/tags", listTags);
router.patch("/tag/:slug", changeStateTag);
router.get("/tag/:slug", read);
router.put("/tag/:slug", update);
router.delete("/tag/:slug", remove);

module.exports = router;