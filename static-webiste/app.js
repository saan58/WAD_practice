const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join("index", "public"));
});

app.listen(3000, () => {
    console.log(`http://localhost:3000`);
});