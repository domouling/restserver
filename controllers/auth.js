const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el Email Existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctas - correo'
            })
        }

        //Si el usuario esta Activo
        if(!usuario.status){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctas - status: false'
            })
        }

        // Verificar Password
        const validPass = bcryptjs.compareSync(password, usuario.password);
        if(!validPass){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctas - password'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })

    } catch(err) {
        console.log(err);
        res.status(500).json({
            msg: 'Algo Salio mal - Contacte al Administrador'
        })
    }
}


module.exports = {
    login
}