const userModel = require('../models/userModel');
//const Session = require('../models/sessionModel');
//const bcrypt = require('bcryptjs');
const createHttpError = require("http-errors");
const validator = require("validator");

const userController = {};
DEFAULT_PICTURE = "https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png";
DEFAULT_STATUS = "Hey! I am using Soul";
ACCESS_TOKEN_SECRET = "oZMEqpgAuLrZJqKUK967";
REFRESH_TOKEN_SECRET = "G4TtjUB1PJk08ucd14Xu";


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
        console.log(newUser)

        const access_token = await generateToken(
            { userId: newUser._id },
            "1d",
            ACCESS_TOKEN_SECRET
        );
        const refresh_token = await generateToken(
            { userId: newUser._id },
            "30d",
            REFRESH_TOKEN_SECRET
        );

        res.cookie("refreshtoken", refresh_token, {
            httpOnly: true,
            path: "/register/refreshtoken",
            maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
        });

        console.table({ access_token, refresh_token });

        res.locals.newUser = {
            message: "register success",
            access_token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                picture: newUser.picture,
                status: newUser.status,
                token: access_token,
            }
        };
        next();
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

    //adding user to databse
    const user = await new userModel({
        name,
        email,
        picture: picture || DEFAULT_PICTURE,
        status: status || DEFAULT_STATUS,
        password,
    }).save();

    return user;
}


const generateToken = async (payload, expiresIn, secret) => {
    let token = await sign(payload, expiresIn, secret);
    return token;
};

const verifyToken = async (token, secret) => {
    let check = await verify(token, secret);
    return check;
};


const jwt = require("jsonwebtoken");

const sign = async (payload, expiresIn, secret) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            secret,
            {
                expiresIn: expiresIn,
            },
            (error, token) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    resolve(token);
                }
            }
        );
    });
};

const verify = async (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error, payload) => {
            if (error) {
                logger.error(error);
                resolve(null);
            } else {
                resolve(payload);
            }
        });
    });
};

module.exports = userController;