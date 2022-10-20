const express = require('express');
const router = express.Router();
const User = require("../models/User.model.js")

const{isLoggedIn} = require("../middlewares/auth.middlewares.js")

// rutas de perfil

router.get("/", isLoggedIn, (req,res, next) => {
    User.findById(req.session.activeUser._id)
    .then((response) => {
        res.render("profile/my-profile.hbs",{
            userDetails: response
        })
    })
    .catch ((error) => {
        next(error)
    })
})


module.exports = router;