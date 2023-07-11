const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://liuhaoyu:Cc123456@cluster0.r2j32ya.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
    // options for the connect method to parse the URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: 'users'
})
    .then(() => console.log('Connected to Mongo DB.'))
    .catch(err => console.log('Mongdb connection error: ', err));


//mongodb debug mode
if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
}

// const Schema = mongoose.Schema;

// // sets a schema for the 'species' collection
// const speciesSchema = new Schema({
//     name: String,
//     classification: String,
//     average_height: String,
//     average_lifespan: String,
//     hair_colors: String,
//     skin_colors: String,
//     eye_colors: String,
//     language: String,
//     homeworld: String,
//     homeworld_id: {
//         // type of ObjectId makes this behave like a foreign key referencing the 'planet' collection
//         type: Schema.Types.ObjectId,
//         ref: 'planet'
//     }
// });

// // creats a model for the 'species' collection that will be part of the export
// const Species = mongoose.model('species', speciesSchema);

// module.exports = {

// };