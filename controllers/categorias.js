const { response } = require("express");
const { Categoria } = require('../models');



//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {
    const { limite = 5, desde = 0} = req.query;
    const query = {status: true};

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
}


//ObtenerCategoria - populate {objeto}
const obtenerCategoria = async (req, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json({
        categoria
    });
}


const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg: `La Categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    //Generar Data a Grabar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);


    //Grabar en BD
    await categoria.save();

    res.status(201).json(categoria);

}


//actualizarCategoria
const actualizarCategoria = async (req, res = response) => {
    const { id } = req.params;
    const { status, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.status(201).json({
        categoria
    });
}

//borrarCategoria - status: false
const borrarCategoria = async (req, res = response) => {
    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {status: false}, {new: true});

    res.status(201).json({
        categoria
    })
}


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}