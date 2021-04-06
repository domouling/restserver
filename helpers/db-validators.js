const Role = require('../models/role');
const { Categoria, Usuario, Producto} = require('../models');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no existe...`)
    }
}

const emailExiste = async(email = '') => {
    const existeEmail = await Usuario.findOne({email});
    if(existeEmail){
        throw new Error(`El Correo ${email} ya esta Registrado...`)
    }
}

const usuarioExisteId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El Id ${id} No Existe...`)
    }
}


/** Categorias */
const existeCategoriaId = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){
        throw new Error(`El Id ${id} No Existe...`)
    }
}


/** Productos */
const existeProductoId = async(id) => {
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error(`El Id ${id} No Existe...`)
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    usuarioExisteId,
    existeCategoriaId,
    existeProductoId
}