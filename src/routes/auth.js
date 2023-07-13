const express = require('express');
const trimRequest = require('trim-request');

const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register',
    trimRequest.all,
    userController.register,
    (req, res) => {
        return res.status(200).json(res.locals.newUser)
    }
);

router.post("/login",
    trimRequest.all,
    userController.login,
    (req, res) => {
        return res.status(200).json(res.locals.user)
    }
);

router.post("/logout",
    trimRequest.all, userController.logout,
    (req, res) => {
        return res.status(200).json({
            message: "logged out !",
        });
    });


router.route("/refreshtoken").post(trimRequest.all, userController.refreshToken);

router.get('/hi', (req, res) => {
    return res.status(200).json({
        message: "hi",
    })
})

const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
ACCESS_TOKEN_SECRET = "oZMEqpgAuLrZJqKUK967";

async function auth(req, res, next) {
    if (!req.headers["authorization"])
        return next(createHttpError.Unauthorized());
    const bearerToken = req.headers["authorization"];
    const token = bearerToken.split(" ")[1];
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return next(createHttpError.Unauthorized());
        }
        req.user = payload;
        next();
    });
}



// router.get('/species',
//   starWarsController.getSpecies,
//   (req, res) => res.status(200).json(res.locals.speciesInfo)
// );

// router.get('/homeworld',
//   starWarsController.getHomeworld,
//   (req, res) => res.status(200).json(res.locals.planetsInfo)
// );

// router.get('/film',
//   starWarsController.getFilm,
//   (req, res) => res.status(200).json({})
// );

// router.post('/character',
//   starWarsController.addCharacter,
//   (req, res) => res.status(200).json(res.locals.character)
// );

module.exports = router;