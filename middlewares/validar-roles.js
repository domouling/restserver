const { response, request } = require("express");



const esAdminRole = (req = request, res = response, next) => {

    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se quiere validar el Rol sin validar antes el token'
        });
    }

    const { rol, nombre } = req.usuario;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `El Usuario ${nombre} no es administrador...`
        });  
    }

    next();
}


const tieneRole = (...roles) => {
    return (req = request, res = response, next) => {

        if(!req.usuario){
            return res.status(500).json({
                msg: 'Se quiere validar el Rol sin validar antes el token'
            });
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `Para ejecutar esta acción, debe tener los Roles siguientes: ${roles}`
            });  
        }

        next();
    }
}


module.exports = {
    esAdminRole,
    tieneRole
}