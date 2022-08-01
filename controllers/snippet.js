const Snippet = require("../models/snippet");
const Tag = require("../models/tag");
const Language = require("../models/language");
const slugify = require("slugify");

exports.createSnippet = async (req, res) => {
  try {
    const { title, description, code, tags, language } = req.body;

    req.body.slug = slugify(title);

    const snippet = await Snippet.findOne({ slug: title});

    if(snippet) {
      return res.status(400).json({message: "Snippet ya existe"});
    }

    req.body.language = await Language.findOne({ slug: language });

    if(req.body.language === null){
      return res.status(400).json({message: "Lenguaje no encontrado"});
    }

    req.body.tags = await Tag.find({ slug: tags });

    if(req.body.tags === null){
      return res.status(400).json({message: "Tag no encontrado"});
    }

    if (!title || !description || !code || !tags || !language) {
      return res
      .status(400)
      .json({ message: "Error en los parámetros de entrada" });
    }

    res.json(await new Snippet(req.body).save());
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.listSnippets = async (_req, res) => {
  try {
    const snippets = await Snippet.find({ status: "active" }).populate('tags').populate('language');

    return res.status(200).json(snippets);
  } catch (error) {
    console.log(error);
    res.status(500).json( error );
  }
};

exports.listSnippetsInactive = async (_req, res) => {
  try {
    const snippets = await Snippet.find({ status: "inactive" }).populate('tags').populate('language');

    return res.status(200).json(snippets);
  } catch (error) {
    console.log(error);
    res.status(500).json( error );
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Snippet.findOneAndRemove({ slug: req.params.slug });

    if (deleted === null) {
      return res.status(400).json({ message: "Snippet no encontrado" });
    }

    res.json(true);
  } catch (err) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};