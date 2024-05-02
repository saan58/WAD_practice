const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/music", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch((err) => {
        console.log("Could not connect to database", err);
        process.exit();
    });

// Define schema for song details
const songSchema = new mongoose.Schema({
    Songname: String,
    Film: String,
    Music_director: String,
    Singer: String,
    Actor: String,
    Actress: String
});

// Create model from schema
const Song = mongoose.model("Song", songSchema);

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Insert array of 5 song documents
const songsData = [{
        Songname: "Song1",
        Film: "Film1",
        Music_director: "Director1",
        Singer: "Singer1"
    },
    {
        Songname: "Song2",
        Film: "Film2",
        Music_director: "Director2",
        Singer: "Singer2"
    },
    // Add more songs here
];

Song.insertMany(songsData)
    .then(() => {
        console.log("Inserted songs successfully");
    })
    .catch((err) => {
        console.log("Error inserting songs", err);
    });


// Add new song route
app.post("/add", async(req, res) => {
    try {
        const newSong = new Song(req.body);
        await newSong.save();
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error adding new song");
    }
});

// Display total count of documents and List all the documents
app.get("/", async(req, res) => {
    try {
        const totalCount = await Song.countDocuments();
        const songs = await Song.find();
        res.render("songs", { totalCount: totalCount, songs: songs });
    } catch (err) {
        res.status(500).send("Error retrieving songs");
    }
});

// List songs by specified Music Director
app.get("/musicDirector/:director", async(req, res) => {
    try {
        const director = req.params.director;
        const songs = await Song.find({ Music_director: director });
        res.render("songs", { songs: songs });
    } catch (err) {
        res.status(500).send("Error retrieving songs by specified Music Director");
    }
});

// List songs by specified Music Director sung by specified Singer
app.get("/musicDirector/:director/singer/:singer", async(req, res) => {
    try {
        const director = req.params.director;
        const singer = req.params.singer;
        const songs = await Song.find({ Music_director: director, Singer: singer });
        res.render("songs", { songs: songs });
    } catch (err) {
        res.status(500).send("Error retrieving songs by specified Music Director and Singer");
    }
});

// Delete a song
app.post("/delete/:id", async(req, res) => {
    try {
        const id = req.params.id;
        await Song.findByIdAndDelete(id);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error deleting song");
    }
});

songSchema.add({
    Actor: String,
    Actress: String
});

app.get("/edit/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const song = await Song.findById(id);
        res.render("edit_song", { song: song });
    } catch (err) {
        res.status(500).send("Error editing song");
    }
});

// Update a song
app.post("/update/:id", async(req, res) => {
    try {
        const id = req.params.id;
        await Song.findByIdAndUpdate(id, req.body);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error updating song");
    }
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});