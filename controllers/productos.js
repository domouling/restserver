const { response } = require("express");
const { Producto } = require('../models');


//obtenerProductos - paginado - total - populate
const obtenerProductos = async (req, res = response) => {
    const { limite = 5, desde = 0} = req.query;
    const query = {status: true};

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
}


//ObtenerCategoria - populate {objeto}
const obtenerProducto = async (req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json({
        producto
    });
}


const crearProducto = async (req, res = response) => {

    const { status, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB){
        return res.status(400).json({
            msg: `El Producto ${productoDB.nombre}, ya existe`
        })
    }

    //Generar Data a Grabar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    //Grabar en BD
    await producto.save();

    res.status(201).json(producto);

}


//actualizarCategoria
const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    const { status, usuario, ...data } = req.body;

    if(data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.status(201).json({
        producto
    });
}

//borrarCategoria - status: false
const borrarProducto = async (req, res = response) => {
    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {status: false}, {new: true});

    res.status(201).json({
        producto
    })
}


module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}