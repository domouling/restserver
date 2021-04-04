const Role = require('../models/role');
const Usuario = require('../models/usuario');

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

module.exports = {
    esRoleValido,
    emailExiste,
    usuarioExisteId
}