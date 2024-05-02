const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost:27017/student", {
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

const studentSchema = new mongoose.Schema({
    Name: String,
    Roll_No: Number,
    WAD_Marks: Number,
    CC_Marks: Number,
    DSBDA_Marks: Number,
    CNS_Marks: Number,
    AI_marks: Number
});

const studentMarks = mongoose.model("studentMarks", studentSchema);

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const studentsData = [
    { Name: "ABC", Roll_No: 111, WAD_Marks: 25, CC_Marks: 25, DSBDA_Marks: 25, CNS_Marks: 25, AI_marks: 25 },
];

studentMarks.insertMany(studentsData).then(() => {
    console.log("inserted docs");
}).catch(() => {
    console.log("not inserted docs");
});

app.get("/", async(req, res) => {
    try {
        const totalCount = await studentMarks.countDocuments();
        const students = await studentMarks.find();
        res.render("student", { totalCount: totalCount, students: students });
    } catch {
        res.status(500).send("error ocuured");
    }
});

app.post("/add", async(req, res) => {
    try {
        const newStudent = new studentMarks(req.body);
        await newStudent.save();
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error adding new student");
    }
});

app.post("/delete/:id", async(req, res) => {
    try {
        const id = req.params.id;
        await studentMarks.findByIdAndDelete(id);
        res.redirect("/");
    } catch {
        res.status(500).send("error ocuured");
    }
});

app.get("/dsbda", async(req, res) => {

    try {
        const students = await studentMarks.find({ DSBDA_Marks: { $gt: 20 } });
        res.render("student", { students: students });
    } catch {
        res.status(500).send("error ocuured");
    }
});

app.post("/update/:id", async(req, res) => {
    try {
        const students = await studentMarks.findByIdAndUpdate(req.params.id, { $inc: { WAD_Marks: 10, CC_Marks: 10, DSBDA_Marks: 10, CNS_Marks: 10, AI_marks: 10 } });
        res.redirect("/");
    } catch {
        res.status(500).send("error ocuured");
    }
});

app.get("/allsubs", async(req, res) => {

    try {
        const students = await studentMarks.find({
            WAD_Marks: { $gt: 25 },
            CC_Marks: { $gt: 25 },
            DSBDA_Marks: { $gt: 25 },
            CNS_Marks: { $gt: 25 },
            AI_marks: { $gt: 25 }
        });
        res.render("student", { students: students });
    } catch {
        res.status(500).send("error ocuured");
    }
});

app.get("/wadcc", async(req, res) => {

    try {
        const students = await studentMarks.find({
            WAD_Marks: { $lt: 40 },
            CC_Marks: { $lt: 40 }
        });
        res.render("student", { students: students });
    } catch {
        res.status(500).send("error ocuured");
    }
});



app.listen(3000, () => {
    console.log(`http://localhost:3000`);
})