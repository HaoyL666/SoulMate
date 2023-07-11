const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const createHttpError = require("http-errors");
const routes = require("./routes/index.js");

const mongoose = require('mongoose');

// IMPORT CONTROLLERS
const userController = require('./controllers/userController');
const cookieController = require('./controllers/cookieController');
const sessionController = require('./controllers/sessionController');

// CONNECT TO PORT
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});


// CONNECT TO DATABASE
const mongoURI = process.env.NODE_ENV === 'test' ? 'mongodb://localhost/unit11test' : 'mongodb://localhost/unit11dev';
mongoose.connect(mongoURI);


/**
* Automatically parse urlencoded body content and form data from incoming requests and place it
* in req.body
*/
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

//morgan
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

//helmet
app.use(helmet());

//sanitize request data
app.use(mongoSanitize());

//gzip compression
app.use(compression());

//file upload
app.use(
    fileUpload({
        useTempFiles: true,
    })
);

//cors
app.use(cors());

app.use('/client', express.static(path.resolve(__dirname, '../client')));