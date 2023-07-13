const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const createHttpError = require("http-errors");
const logger = require('./configs/logger.config.js');
//const routes = require("./routes/index.js");

const mongoose = require('mongoose');

// IMPORT CONTROLLERS
// const userController = require('./controllers/userController');
// const cookieController = require('./controllers/cookieController');
// const sessionController = require('./controllers/sessionController');

// CONNECT TO PORT
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});


// CONNECT TO DATABASE
// const mongoURI = process.env.NODE_ENV === 'test' ? 'mongodb://localhost/unit11test' : 'mongodb://localhost/unit11dev';
// mongoose.connect(mongoURI);
const MONGO_URI = 'mongodb+srv://liuhaoyu:Cc123456@cluster0.r2j32ya.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
    // options for the connect method to parse the URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to Mongo DB.'))
    .catch(err => console.log('Mongdb connection error: ', err));



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

// /**
//  * require routers
//  */
const authRouter = require('./routes/auth.js')
// const conversationRouter = require('./routes/conversation.js')


app.use('/auth', authRouter);
// app.use('/conversation', conversationRouter);

//app.use('/client', express.static(path.resolve(__dirname, '../client')));


/**
 * 404 handler
 */
app.use('*', (req, res) => {
    res.status(404).send('Not Found');
});

// global error handler
// app.use((err, req, res, next) => {
//     const defaultErr = {
//         log: 'Express error handler caught unknown middleware error',
//         status: 500,
//         message: { err: 'An error occurred' },
//     };
//     const errorObj = Object.assign({}, defaultErr, err);
//     console.log(errorObj.log);
//     return res.status(errorObj.status).json(errorObj.message);
// });

app.use((err, req, res, next) => {
    console.log(err);
    res.send({ error: err });
});

//handle server errors
// const exitHandler = () => {
//     if (server) {
//         logger.info("Server closed.");
//         process.exit(1);
//     } else {
//         process.exit(1);
//     }
// };

// const unexpectedErrorHandler = (error) => {
//     logger.error(error);
//     exitHandler();
// };
// process.on("uncaughtException", unexpectedErrorHandler);
// process.on("unhandledRejection", unexpectedErrorHandler);

// //SIGTERM
// process.on("SIGTERM", () => {
//     if (server) {
//         logger.info("Server closed.");
//         process.exit(1);
//     }
// });

