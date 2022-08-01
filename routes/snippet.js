const express = require("express");
const router = express.Router();

const { createSnippet, listSnippets, listSnippetsInactive, remove } = require("../controllers/snippet");

router.post("/snippet", createSnippet);
router.get("/snippets", listSnippets);
router.get("/snippets-inactive", listSnippetsInactive);
router.delete("/snippet/:slug", remove);

module.exports = router;