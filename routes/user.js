const express = require("express");
const router = express.Router();

const authJwt = require("../middlewares/authJwt");
const { createUser, listUsers, changeStateUser, userFindBySlug } = require("../controllers/user");

router.post("/user/", [authJwt.verifyToken, authJwt.isAdmin], createUser);
router.get("/user/:slug", [authJwt.verifyToken, authJwt.isAdmin], userFindBySlug);
router.patch("/user/:slug", [authJwt.verifyToken, authJwt.isAdmin], changeStateUser);
router.get("/users/", [authJwt.verifyToken, authJwt.isAdmin], listUsers);

module.exports = router;
