const express = require("express");
const router = express.Router();

const authJwt = require("../middlewares/authJwt");
const { createSnippet, listSnippets, listSnippetsInactive, listAllSnippets, removeSoft, remove } = require("../controllers/snippet");

router.post("/snippet", [authJwt.verifyToken], createSnippet);
router.get("/snippets-actives", listSnippets);
router.get("/snippets-inactives", listSnippetsInactive);
router.get("/snippets", [authJwt.verifyToken], listAllSnippets);
router.patch("/:slug", removeSoft);
router.delete("/:slug", remove);

module.exports = router;