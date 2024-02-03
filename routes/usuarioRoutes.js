import express from "express";
const router = express.Router();

import { 
    registrar, 
    autenticar, 
    confirmar, 
    olvidePassword, 
    comprobarToken, 
    nuevoPassword,
    perfil,
} from '../controllers/usuarioController.js';


//importamos middleware

import checkAuth  from "../middleware/checkAuth.js";
//Autentiacion, registro y confirmacion de usuarios. Routing.
//endpoints

router.post('/', registrar);//crea un nuevo usuario
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password/', olvidePassword);

//nueva forma para reutilizar un route

router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

/*El checkauth valida que el JWT sea valido, si todo esta bien, ejecuta perfil  */
router.get('/perfil/', checkAuth, perfil);

export default router;