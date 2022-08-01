const Tag = require("../models/tag");
const slugify = require("slugify");

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res
      .status(400)
      .json({ message: "Error en los parámetros de entrada" });
    }
    
    const slug = slugify(name, { lower: true });
    const locateTag = await Tag.findOne({name});
    
    if (locateTag) {
      return res.status(400).json({ message: "El tag ya existe" });
    }

    const newTag = await new Tag({
      name,
      description,
      slug,
    }).save();

    return res.status(200).json(newTag);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.listTags = async (_req, res) => {
  try {
    const tags = await Tag.find({ status: "active" });
    return res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.changeStateTag = async (req, res) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });

    if (tag === null) {
      return res.status(400).json({ message: "Tag no encontrado" });
    }

    if (tag.status === "inactive") {
      const active = await Tag.findOneAndUpdate(
        { slug: req.params.slug },
        { status: "active" },
        { new: true }
      );
      return res.json(active);
    }

    const inactive = await Tag.findOneAndUpdate(
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
    let tag = await Tag.findOne({
      slug: req.params.slug,
      status: "active",
    }).exec();

    if (tag === null) {
      return res.status(400).json({ message: "Tag no encontrado" });
    }

    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updated = await Tag.findOneAndUpdate(
      { slug: req.params.slug },
      { name, description },
      { new: true }
    ).exec();

    if (updated === null) {
      return res.status(400).json({ message: "Tag no encontrado" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.remove = async (req, res) => {
    try {
      const deleted = await Tag.findOneAndRemove({ slug: req.params.slug });
  
      if(deleted === null) {
        return res.status(400).json({message: "Tag no encontrado"});
      }
  
      res.json(deleted);
    } catch (err) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
};