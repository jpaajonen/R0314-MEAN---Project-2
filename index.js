//Necessary dependencies and frameworks are imported and passed into variables
const express = require("express");
const app = express();
//the .env file containing environmental variables is imported
require("dotenv").config();
// the mongoose module is imported
const mongoose = require("mongoose");
//the Movie model is imported from the movie-model.js file and passed into a variable
const Movie = require("./modules/movie-model");
//the connection string uri with the necessary login information included is fetched from the .env file
const uri = process.env.DB_URI;
//the port is defined either dynamically or locally
const PORT = process.env.PORT || 8001;
//the body-parser middleware for reading form data is loaded
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true}));
//the connection to the mongodb database is established using the connection string contained in the uri variable
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//the root route is defined
app.get('/', function (req, res) {
	res.send('Project 2 - REST API project');
  });
//this get route fetches all of the documents of the database using the find({}) method
app.get('/api/getall', function (req, res) {
	async function connect() {
		//try/catch structure to support debugging
		try {
			//the results are passed into a variable. the .limit option limits the queried results to five in this case
			const movies = await Movie.find({}).limit(5);
			console.log("Query results found!");
			//if the connecetion status is ok (200) the movies variable is parsed into json form
			res.status(200).json(movies);
		} catch (error) {
			res.status(500).json("Connection error")
			console.log(`Connection error: ${error.stack} on Worker process: ${process.pid}`)
		} finally {
			console.log("Query completed");
		}
	}
	connect();
});
//this get route fetches a single document by its individual database ID using the findById() method
app.get('/api/:id', function (req, res) {
	var id = req.params.id;
	async function connect() {
		try {
			const movieById = await Movie.findById(id);
			console.log("Query result found!");
			res.status(200).json(movieById);
		} catch (error) {
			res.status(500).json("Connection error")
			console.log(`Connection error: ${error.stack} on Worker process: ${process.pid}`)
		} finally {
			console.log("Query completed");
		}
	}
	connect();
});
//this post route adds a new document into the database using the save() method
app.post('/api/add', function (req, res) {
	async function connect() {
		try {
			const newMovie = new Movie({
				title: req.body.title,
				year: req.body.year
			});
			const result = await newMovie.save();
			res.status(200).json(result);
		}
		catch(error){
			res.status(500).json({error: error.message});
		}
	}
	connect();
});
//this put route updates the values of a document using the findByIdAndUpdate() method
app.put('/api/update/:id', function (req, res) {
	async function connect() {
		try {
			const id = req.params.id;
			const data = req.body;
			const options = {new: true};
			const result = await Movie.findByIdAndUpdate(id, data, options);
			res.status(200).json(result);
		}
		catch(error){
			res.status(500).json({error: error.message});
		}
	}
	connect();
});
//this delete route deletes a document by its ID using the findByIdAndDelete() method
app.delete('/api/delete/:id', function (req, res) {
	async function connect() {
		try {
			const toBeDeleted = req.params.id;
			await Movie.findByIdAndDelete(toBeDeleted);
			res.status(200).json({Message: "Deleted successfully"});
		} catch (error) {
			res.status(500).json("Connection error")
			console.log(`Connection error: ${error.stack} on Worker process: ${process.pid}`)
		} finally {
			console.log("The document was deleted");
		}
	}
	connect();
});
//the web server is created and the active port is indicated in a console message
app.listen(PORT, function () {
    console.log("Listening to port " + PORT);
})