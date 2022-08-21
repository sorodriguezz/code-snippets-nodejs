const express = require("express");
const router = express.Router();

const { createSnippet, listSnippets, listSnippetsInactive, listAllSnippets, removeSoft, remove } = require("../controllers/snippet");

router.post("/snippet", createSnippet);
router.get("/snippets-actives", listSnippets);
router.get("/snippets-inactives", listSnippetsInactive);
router.get("/snippets", listAllSnippets);
router.patch("/:slug", removeSoft);
router.delete("/:slug", remove);

module.exports = router;