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

let placeHolder = "_";
let randomNumber = Math.floor(Math.random() * words.length);
let word = words[randomNumber];
console.log(`The mystery word is ${word}.`);
let characters = word.split("");
console.log(characters);
let guesses = [];
let numGuesses = 8;
let errorMessage = "";

// define a home page
app.get("/", function(request, response) {
  // let maskedWord = use `characters` and `guesses` to generate maskedWord
  let maskedWord = characters.map(letter => (guesses.includes(letter) ? letter : placeHolder));
  response.render("main", {
    maskedWord: maskedWord,
    numGuesses: numGuesses,
    guesses: guesses,
    errorMessage: errorMessage
  });
});

// Collect a guess from the form
app.post("/guess", function(request, response) {
  let maskedWord = characters.map(letter => (guesses.includes(letter) ? letter : placeHolder));
  let guess = request.body.guess;
  if (!characters.includes(guess) && !guesses.includes(guess)) {
    numGuesses -= 1;
  }

  if (guesses.includes(guess)) {
    // display message letting them know that they've already guessed that letter
    errorMessage = `You've already guessed the letter ${guess}.  Please guess again.`;
  } else {
    errorMessage = "";
    guesses.push(guess);
  }
  if (characters.join("") === maskedWord.join("")) {
    response.render("youWin", { word: word });
    return;
  }
  if (numGuesses === 0) {
    response.render("youLose", { word: word });
    return;
  }
  response.redirect("/");
});

// listen on port 3000
app.listen(3000, function() {
  console.log("Successfully accessed Mystery Word on port 3000!");
});
