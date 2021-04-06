const { response, request } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or:  [{nombre: regex}, {correo: regex}],
        $and: [{status: true}]
    });

    const cuenta = await Usuario.countDocuments({
        $or:  [{nombre: regex}, {correo: regex}],
        $and: [{status: true}]
    });

    res.json({
        results: {
            cuenta,
            usuarios
        }
    });
}

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const categoria = await Categoria.findById(termino).populate('usuario', 'nombre');;
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({nombre: regex, status: true}).populate('usuario', 'nombre');;

    const cuenta = await Categoria.countDocuments({nombre: regex});

    res.json({
        results: {
            cuenta,
            categorias
        }
    });
}

const buscarProductos = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({
        $or:  [{nombre: regex}, {correo: regex}, {descripcion: regex}],
        $and: [{status: true}]
    })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre');

    const cuenta = await Producto.countDocuments({
        $or:  [{nombre: regex}, {correo: regex}, {descripcion: regex}],
        $and: [{status: true}]
    });

    res.json({
        results: {
            cuenta,
            productos
        }
    });
}


const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las Colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        case 'categorias':
            buscarCategorias(termino, res)
        break;

        case 'productos':
            buscarProductos(termino, res)
        break;

        default:
            res.status(500).json({
                msg: 'Olvide hacer esta busqueda'
            });
        break;

    }


}


module.exports = {
    buscar
}