const userModel = require('../models/userModel');
//const Session = require('../models/sessionModel');
//const bcrypt = require('bcryptjs');
const createHttpError = require("http-errors");
const validator = require("validator");

const userController = {};

userController.register = async (req, res, next) => {
    try {
        const { name, email, picture, status, password } = req.body;
        console.log(req.body)
        const newUser = await createUser({
            name,
            email,
            picture,
            status,
            password,
        })
        next();
        // const access_token = await generateToken(
        //     { userId: newUser._id },
        //     "1d",
        //     process.env.ACCESS_TOKEN_SECRET
        // );
        // const refresh_token = await generateToken(
        //     { userId: newUser._id },
        //     "30d",
        //     process.env.REFRESH_TOKEN_SECRET
        // );

        // res.cookie("refreshtoken", refresh_token, {
        //     httpOnly: true,
        //     path: "/api/v1/auth/refreshtoken",
        //     maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
        // });

        // res.json({
        //     message: "register success.",
        //     user: {
        //         _id: newUser._id,
        //         name: newUser.name,
        //         email: newUser.email,
        //         picture: newUser.picture,
        //         status: newUser.status,
        //         token: access_token,
        //     },
        // });
    } catch (err) {
        next(err);
    }
}




// helper functions
const createUser = async (userData) => {
    const { name, email, picture, status, password } = userData;
    // console.log(name)

    //check if fields are empty
    if (!name || !email || !password) {
        //console.log("hi")
        throw createHttpError(statusCode = 400, "Please fill all fields.");
    }

    //check name length
    if (
        !validator.isLength(name, {
            min: 1,
            max: 20,
        })
    ) {
        throw createHttpError.BadRequest(
            "Plase make sure your name is between 1 and 20 characters."
        );
    }

    //Check status length
    if (status && status.length > 64) {
        throw createHttpError.BadRequest(
            "Please make sure your status is less than 64 characters."
        );
    }

    //check if email address is valid
    if (!validator.isEmail(email)) {
        throw createHttpError.BadRequest(
            "Please make sure to provide a valid email address."
        );
    }

    //check if user already exist
    const checkDb = await userModel.findOne({ email });
    if (checkDb) {
        throw createHttpError.Conflict(
            "Please try again with a different email address, this email already exist."
        );
    }

    //check password length
    if (
        !validator.isLength(password, {
            min: 6,
            max: 128,
        })
    ) {
        throw createHttpError.BadRequest(
            "Please make sure your password is between 6 and 128 characters."
        );
    }

    const user = await new userModel({
        name,
        email,
        picture,
        status,
        password,
    }).save()

    return user;
}

module.exports = userController;