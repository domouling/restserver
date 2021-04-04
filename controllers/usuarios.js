const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => {

    // const { q, nombre = 'Sin Nombre', apikey, page = 1, limit } = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = {status: true};

    /* const usuarios = await Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite));

    const total = await Usuario.countDocuments(query); */

    // Simplificamos para no tener dos await o dos ciclos donde uno debe esperar a que se cumple el otro

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async(req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;

    const usuario = new Usuario({nombre, correo, password, rol});

    // Verificar si el correo existe => se creo regla custom 
    /* const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        return res.status(400).json({
            msg: 'El correo ya esta registrado'
        });
    } */

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en BD
    await usuario.save();

    res.json({
        msg: 'Es una post API - Controlador',
        usuario
    })
}

const usuariosPut = async(req = request, res = response) => {
    
    const { id } = req.params;

    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validar id en BD
    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'Es una patch API - Controlador'
    })
}

const usuariosDelete = async(req = request, res = response) => {

    const { id } = req.params;

    //Borrado Fisico
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {status: false});

    res.json(usuario)
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}