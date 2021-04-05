const { response, request } = require('express');
const jwt = require('jsonwebtoken');


const Usuario = require('../models/usuario');



const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay Token en la Petición'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer el usuario que corresponde al uid (MODELO)
        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                mgs: 'Token no Valido - Usuario no Existe'
            })
        }

        // Verificar UID estatus
        if(!usuario.status){
            return res.status(401).json({
                mgs: 'Token no Valido - Usuario con estatus false'
            })
        }

        req.usuario = usuario;

        next();

    } catch(err) {
        console.log(err);
        res.status(401).json({
            msg: 'Token no Valido'
        })
    }   

}


module.exports = {
    validarJWT
}