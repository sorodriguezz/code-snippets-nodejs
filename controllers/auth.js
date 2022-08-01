const User = require("../models/user");
const Role = require("../models/role");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "")
    return res.status(400).json({ message: "Todos los campos son requeridos" });

  const userFound = await User.findOne({ email }).populate("roles");

  if (!userFound) return res.status(400).json({ message: "User not found" });

  const matchPassword = await User.comparePassword(
    password,
    userFound.password
  );

  if (!matchPassword)
    return res
      .status(401)
      .json({ token: null, message: "Contraseña o correo incorrectos" });

  const token = jwt.sign(
    { id: userFound._id, roles: userFound.roles },
    process.env.SECRET,
    {
      expiresIn: 900,
    }
  );

  return res.json({ token });
};

exports.decodeToken = async (req, res, _next) => {
  try {
    const token = req.headers["authorization"];

    const profiles = ["user", "admin", "moderator"];

    const decoded = jwt.verify(token, process.env.SECRET, { complete: true });

    let listRoles = [];

    decoded.payload.roles.map((resp) => listRoles.push(resp.name));

    let havePermission = listRoles.map((rol) => {
      return profiles.includes(rol);
    });

    if (havePermission.includes(true)) {
      return res.status(200).json({ permitido: true });
    } else {
      return res.status(200).json({ permitido: false });
    }
  } catch (err) {
    return res.status(500).json({ err });
  }
};
