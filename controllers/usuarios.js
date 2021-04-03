const { response, request } = require('express');

const usuariosGet = (req = request, res = response) => {

    const { q, nombre = 'Sin Nombre', apikey, page = 1, limit } = req.query;

    res.json({
        msg: 'Es una get API - Controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    })
}

const usuariosPost = (req = request, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        msg: 'Es una post API - Controlador',
        nombre,
        edad
    })
}

const usuariosPut = (req = request, res = response) => {
    
    const { id } = req.params;

    res.json({
        msg: 'Es una put API- Controlador',
        id
    })
}

const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'Es una patch API - Controlador'
    })
}

const usuariosDelete = (req = request, res = response) => {
    res.json({
        msg: 'Es una delete API - Controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}