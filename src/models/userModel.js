const mongoose = require('mongoose');
const validator = require("validator");
const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcrypt');




//mongodb debug mode
// if (process.env.NODE_ENV !== "production") {
//     mongoose.set("debug", true);
// }



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name']
    },
    email: {
        type: String,
        required: [true, "Please provide tour email address"],
        unqiue: [true, "This email address already exist"],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email address"],
    },
    picture: {
        type: String,
        default:
            "https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png",
    },
    status: {
        type: String,
        default: "Hey! I am using Soul",
    },
    password: {
        type: String,
        required: [true, "Please provide your password"],
        minLength: [
            6,
            "Plase make sure your password is atleast 6 characters long",
        ],
        maxLength: [
            128,
            "Plase make sure your password is less than 128 characters long",
        ],
    }
},
    {
        collection: "users",
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            this.password = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
            return next();
        }
        next();
    } catch (error) {
        next({
            log: 'Express error handler caught userSchema.pre middleware error',
            message: { err: 'userSchema.pre: ERROR: Check server logs for details' },
        });
    }
});

const UserModel =
    mongoose.models.UserModel || mongoose.model("UserModel", userSchema);

module.exports = UserModel;