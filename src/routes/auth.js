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