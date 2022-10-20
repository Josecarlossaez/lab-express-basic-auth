const isLoggedIn = (req, res, next) => {
    if(req.session.activeUser === undefined){
        // si no tienes sesión, fuera de aquí
        res.redirect("/auth/login")
    }else{
        //bienvenido, continua con la ruta
        next()
    }
}

module.exports = {
    isLoggedIn
}