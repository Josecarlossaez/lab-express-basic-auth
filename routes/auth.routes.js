const express = require("express")
const router = express.Router();
const User = require("../models/User.model.js")
const bcrypt = require("bcryptjs")

// RUTAS DE AUTENTICACIÓN ( SIGNUP Y LOGIN)
// GET "/auth/singup"
router.get("/signup", async(req, res, next) => {
    res.render("auth/signup.hbs")
})

//POST "/auth/signup"
router.post("/signup", async(req, res, next) =>{
    const{username, password} = req.body;

    // encriptación de contraseña
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    if(passwordRegex.test(password) === false){
        res.render("auth/signup.hbs", {
            errorMessage : "La contraseña debe incluir mínimo 8 caracteres, 1 mayúscula y 1 número"
        });
        return
    }
// Usuario único
  try{
    const foundUser = await User.findOne({username: username})
    if(foundUser !== null){
        res.render("auth/signup.hbs",{
            errorMessage : "Usuario ya creado con ese nombre"
        });
        return;
    }
    // generar seguridad de contraseña
   const salt = await bcrypt.genSalt(12);
   // cifrado
   const hashPassword = await bcrypt.hash(password, salt)
   // generar perfil de usuario
   const newUser = {
    username: username,
    password: hashPassword,
   };
   await User.create(newUser);

  } catch (error){
    next(error)
  }

})



module.exports = router;