const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerCategorias, crearCategoria, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const { existeCategoriaId } = require('../helpers/db-validators');

const router = Router();


/** {{url}}/api/categorias */

//Obtener todas las cartegorias - publico
router.get('/', obtenerCategorias);


/* NOTA: CREAR UN MIDDLEWARE PERSONALIZADO PARA VALIDAR RUTA*/

//Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un Id de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
], obtenerCategoria);

//Crear una nueva categoria - privado  - cualquier persona con un token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
 ], crearCategoria);

//Actualizar categoria por id - privado  - cualquier persona con un token valido 
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaId),
    validarCampos
], actualizarCategoria);

//Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
], borrarCategoria);


module.exports = router;