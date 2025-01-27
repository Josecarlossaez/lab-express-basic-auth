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
    }else{
        res.render("auth/login.hbs")
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
  };
});

//GET ("/auth/login")
router.get("/login", (req,res,next) => {
    res.render("auth/login.hbs")
})

// POST ("/auth/login")
router.post("/login", async (req,res,next) => {
    const {username, password} = req.body

    try{
        const foundUser = await User.findOne({username: username});
        // verificar usuario
        if (foundUser === null) {
            // si no existe
            res.render("auth/login.hbs", {
              errorMessage: "Credenciales incorrectas",
            });
            return;
          }

        // verificar contraseña de usuario
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if(isPasswordValid === false){
            res.render("auth/login.hbs", {
                errorMessage : "Credenciales incorrectas"
            });
            return;
        }
        // mantener la sesión activa
        req.session.activeUser = foundUser;
        // asegurar que la sesión se ha creado
        req.session.save(() => {
            res.redirect("/profile")
        })

    } catch(error){
        next(error)
    }
});

// GET ("/auth/logout")
router.get("/logout", (req,res,next) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
})

module.exports = router;