const Role = require("../models/role");
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.verifyToken = async (req, res, next) => {
    const token = req.headers["authorization"];
    try {
        if (!token) return res.status(403).json({error: "No se proporcionó token"});
        
        const { username } = jwt.verify(token, process.env.SECRET, (err, decode) => {
            if(err){
                return res.status(401).json({
                    expiredAt: err.expiredAt,
                    message: err.message,
                });
            }
            return decode;
        });
        
        req.username = username;

        const user = await User.findOne({ username: req.username });

        if(!user) return res.status(404).json({error: "Usuario no encontrado"});

        next();
    } catch (err) {
        return res.status(500).json({err});
    }
};

exports.isAdmin = async (req, res, next) => {
    const user = await User.findOne({ username: req.username });

    const roles = await Role.find({_id: {$in: user.roles}})

    for (const rol of roles) {
        if(rol.name === "admin") {
            next();
            return;
        }
    }

    return res.status(403).json({error: "No tienes permisos de administrador"});
};