const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


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


const googleSignin = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //Crear Usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si usuario BD status
        if(!usuario.status){
            return res.status(401).json({
                msg: 'Algo a Ocurrido.. Hable con el Administrador - Usuario Bloqueado'
            });
        }

        // Generar su JWT
        const token = await generarJWT(usuario.id);
        
        res.json({
            usuario,
            token
        });

    } catch(err) {

        res.status(400).json({
            msg: 'Token Google no es Reconocido'
        })

    }

    

}


module.exports = {
    login,
    googleSignin
}