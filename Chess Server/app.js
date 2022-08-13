const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json())

const TEMPLATEFOLDER = __dirname + "/public/templates";

const settingBoardFunction = require(__dirname + "/settingUp.js");
const moveAndCheckKingFunction = require(__dirname + "/moveAndCheckFunc.js")

app.get("/", (req, res) => {
  res.sendFile(TEMPLATEFOLDER + "/home.html");
});

app.post("/", (req, res) => {

  if (req.body.color) {

    let p1Color = req.body.color;
    let p2Color = (p1Color == "WHITE") ? "BLACK" : "WHITE";

    try {

      gamePieces = settingBoardFunction(p1Color, p2Color)
      res.status(200).send(gamePieces);

    } catch(err) {

      console.log(err);
      res.status(400).send(err);

    };

  } else if (req.body.pieces && req.body.turn) {

    let playerTurn = req.body.turn;
    let gamePieces = req.body.pieces;

    try {

      moveAndCheckKingFunction(gamePieces, playerTurn);
      res.status(200).send(gamePieces);

    } catch(err) {

      console.log(err);
      res.status(400).send(err);

    };

  };

});

app.listen(3000, () => {
  console.log("http server started")
});