const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const { existeCategoriaId, existeProductoId } = require('../helpers/db-validators');


const router = Router();


/** {{url}}/api/prodictos */

//Obtener todas las productos - publico
router.get('/', obtenerProductos);


/* NOTA: CREAR UN MIDDLEWARE PERSONALIZADO PARA VALIDAR RUTA*/

//Obtener una producto por id - publico
router.get('/:id', [
    check('id', 'No es un Id de Mongo valido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], obtenerProducto);

//Crear una nueva producto - privado  - cualquier persona con un token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un Id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaId),
    validarCampos
 ], crearProducto);

//Actualizar producto por id - privado  - cualquier persona con un token valido 
router.put('/:id', [
    validarJWT,
    // check('categoria', 'No es un Id de Mongo').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], actualizarProducto);

//Borrar producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id de Mongo valido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], borrarProducto);


module.exports = router;