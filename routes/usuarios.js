const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, usuarioExisteId } = require('../helpers/db-validators');


const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    check('correo', 'El Correo no es Valido').isEmail(),
    check('correo').custom(emailExiste),
    check('password', 'El Password debe tener mas de 6 caracteres').isLength({min: 6}),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
],usuariosPost);

router.put('/:id',[
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(usuarioExisteId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id', [
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(usuarioExisteId),
    validarCampos
], usuariosDelete);


module.exports = router;