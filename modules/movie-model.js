//the mongoose module is imported
const mongoose = require("mongoose");

//a simple schema for a new database entry is created
const MovieSchema = new mongoose.Schema(
    {
		title: {
            type: String,
            required: false,
        },
        year: {
            type: Number,
            required: false,
        }

}, {
    //the MongoDB movies collection is specified to be used
    //if not specified, a default test collection is created
	collection: 'movies'
});
//the MovieSchema is compiled into a Movie model and exported
module.exports = mongoose.model("Movie", MovieSchema);
