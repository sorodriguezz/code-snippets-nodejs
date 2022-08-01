const Language = require("../models/language");
const slugify = require("slugify");

exports.createLanguage = async (req, res) => {
  try {
    const { name, description, extension } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Error en los parámetros de entrada" });
    }

    const slug = slugify(name, { lower: true });
    const locateLanguage = await Language.findOne({ name });

    if (locateLanguage) {
      return res.status(400).json({ message: "El tag ya existe" });
    }

    const newLanguage = await new Language({
      name,
      description,
      extension,
      slug,
    }).save();

    return res.status(200).json(newLanguage);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.listlanguages = async (_req, res) => {
  try {
    const languages = await Language.find({ status: "active" });
    return res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.changeStateLanguage = async (req, res) => {
  try {
    const language = await Language.findOne({ slug: req.params.slug });

    if (!language) {
      return res.status(400).json({ message: "Language no encontrado" });
    }

    if (language.status === "inactive") {
      const active = await Language.findOneAndUpdate(
        { slug: req.params.slug },
        { status: "active" },
        { new: true }
      );
      return res.json(active);
    }

    const inactive = await Language.findOneAndUpdate(
      { slug: req.params.slug },
      { status: "inactive" },
      { new: true }
    );

    return res.json(inactive);
  } catch (err) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.read = async (req, res) => {
  try {
    let language = await Language.findOne({
      slug: req.params.slug,
      status: "active",
    }).exec();

    if (language === null) {
      return res.status(400).json({ message: "Language no encontrado" });
    }

    res.json(language);
  } catch (err) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, extension } = req.body;

    if (!name || !description || !extension) {
        return res
          .status(400)
          .json({ message: "Error en los parámetros de entrada" });
    }

    const updated = await Language.findOneAndUpdate(
      { slug: req.params.slug },
      { name, description, extension },
      { new: true }
    ).exec();

    if (updated === null) {
      return res.status(400).json({ message: "Language no encontrado" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Language.findOneAndRemove({ slug: req.params.slug });

    if (deleted === null) {
      return res.status(400).json({ message: "Language no encontrado" });
    }

    res.json(deleted);
  } catch (err) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
