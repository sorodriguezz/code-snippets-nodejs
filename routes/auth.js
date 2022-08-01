const express = require("express");
const router = express.Router();

const { signin, decodeToken } = require("../controllers/auth");

router.post('/signin', signin);
router.post('/verify', decodeToken);

module.exports = router;
