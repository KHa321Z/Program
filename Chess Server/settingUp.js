function settingBoard(player1Color, player2Color) {
  
  const chessPiecesDir = __dirname + "/chess_pieces/";
  const King = require(chessPiecesDir + "king.js")
  const Queen = require(chessPiecesDir + "queen.js")
  const Bishop = require(chessPiecesDir + "bishop.js")
  const Knight = require(chessPiecesDir + "knight.js")
  const Rook = require(chessPiecesDir + "rook.js")
  const Pawn = require(chessPiecesDir + "pawn.js")

  let gamePieces = {
    "1_1": new Rook("1_1", player1Color), 
    "2_1": new Knight("2_1", player1Color), 
    "3_1": new Bishop("3_1", player1Color), 
    "4_1": new Queen("4_1", player1Color), 
    "5_1": new King("5_1", player1Color), 
    "6_1": new Bishop("6_1", player1Color), 
    "7_1": new Knight("7_1", player1Color), 
    "8_1": new Rook("8_1", player1Color), 
    "1_2": new Pawn("1_2", player1Color), 
    "2_2": new Pawn("2_2", player1Color), 
    "3_2": new Pawn("3_2", player1Color), 
    "4_2": new Pawn("4_2", player1Color), 
    "5_2": new Pawn("5_2", player1Color), 
    "6_2": new Pawn("6_2", player1Color), 
    "7_2": new Pawn("7_2", player1Color), 
    "8_2": new Pawn("8_2", player1Color), 
    "1_8": new Rook("1_8", player2Color), 
    "2_8": new Knight("2_8", player2Color), 
    "3_8": new Bishop("3_8", player2Color), 
    "4_8": new Queen("4_8", player2Color), 
    "5_8": new King("5_8", player2Color), 
    "6_8": new Bishop("6_8", player2Color), 
    "7_8": new Knight("7_8", player2Color), 
    "8_8": new Rook("8_8", player2Color), 
    "1_7": new Pawn("1_7", player2Color), 
    "2_7": new Pawn("2_7", player2Color), 
    "3_7": new Pawn("3_7", player2Color), 
    "4_7": new Pawn("4_7", player2Color), 
    "5_7": new Pawn("5_7", player2Color), 
    "6_7": new Pawn("6_7", player2Color), 
    "7_7": new Pawn("7_7", player2Color), 
    "8_7": new Pawn("8_7", player2Color)
  };

  Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate));
  // for initializing rooks in king class
  Object.values(Object.filter(gamePieces, ([location, piece]) => piece.type == "King")).forEach( element => element.initializingRooksForCastling(gamePieces) );

  for (let piece in gamePieces) { gamePieces[piece].moveOptions(gamePieces) };

  // for setting up all cells in the gamePieces object
  for (let i = 1; i <= 8; i++) {

    for (let j = 1; j <= 8; j++) {

      let emptyCoordinate = i + "_" + j;
      
      if (!(emptyCoordinate in gamePieces)) gamePieces[emptyCoordinate] = null;

    };

  };

  return (gamePieces)

};

module.exports = settingBoard;