const User = require("../models/user");
const Role = require("../models/role");

const slugify = require("slugify");

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const slug = slugify(req.body.username);

    const existUsername = await User.findOne({ username });
    const existEmail = await User.findOne({ email });

    if (existEmail || existUsername) {
      return res
        .status(400)
        .json({ message: "Usuario o correo ya existen" });
    }

    const newUser = new User({
      username,
      slug,
      email,
      password,
    });

    newUser.password = await User.encryptPassword(password);

    if (newUser.roles.length === 0) {
      newUser.roles = await Role.find({ name: "user" });
    }

    await newUser.save();
    res.status(200).json({
      message: "Usuario creado correctamente",
      data: {
        username,
        email,
      },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.userFindBySlug = async (req, res) => {
  try {
    const slug = req.params;
    const user = await User.findOne(slug).populate("roles");

    if(user.status === 'inactive') return res.status(200).json({ message: "User inactive" });

    res.status(200).json({ user });
  
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.listUsers = async (_req, res) => {
  try {
    const users = await User.find().populate("roles");
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error });
  }
};
