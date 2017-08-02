const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const fs = require("fs");

const app = express();
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

app.use(express.static("public"));

// this will attach the bodyParser to the pipeline and attach
// the data to the req as JSON
app.use(bodyParser.json());
// this will take the url encoded data and
//only accept the primitive types of data (strings, numbers, NOT arrays, NOT objects)
app.use(bodyParser.urlencoded({ extended: false }));
// This is registered after the bodyParser so that
// there is something to validate
app.use(expressValidator());

// these three lines are necessary for mustache-express to work
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

// define a home page
app.get("/", function(request, response) {
  response.render("main");
});

// listen on port 3000
app.listen(3000, function() {
  console.log("Successfully accessed Mystery Word on port 3000!");
});
