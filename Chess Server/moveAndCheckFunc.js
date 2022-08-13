function moveAndCheckKing(gamePieces, turn) {

  const chessPiecesDir = __dirname + "/chess_pieces/";
  const King = require(chessPiecesDir + "king.js")
  const Queen = require(chessPiecesDir + "queen.js")
  const Bishop = require(chessPiecesDir + "bishop.js")
  const Knight = require(chessPiecesDir + "knight.js")
  const Rook = require(chessPiecesDir + "rook.js")
  const Pawn = require(chessPiecesDir + "pawn.js")

  for (let piece in gamePieces) {
    
    if (!!gamePieces[piece]) {
      
      switch (gamePieces[piece].type) {

        case "Pawn":
          gamePieces[piece] = new Pawn(gamePieces[piece]);
          break;

        case "Rook":
          gamePieces[piece] = new Rook(gamePieces[piece]);
          break;

        case "Knight":
          gamePieces[piece] = new Knight(gamePieces[piece]);
          break;

        case "Bishop":
          gamePieces[piece] = new Bishop(gamePieces[piece]);
          break;

        case "Queen":
          gamePieces[piece] = new Queen(gamePieces[piece]);
          break;

        case "King":
          gamePieces[piece] = new King(gamePieces[piece]);
          break;

      };

    };

  };

  let enemyPlayer = (turn == 1) ? 2 : 1;

  Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate));

  let enemyKing = Object.values(Object.filter(gamePieces, ([location, piece]) => (!!piece && (piece.player == enemyPlayer) && (piece.type == "King"))))[0];
  let playerKing = Object.values(Object.filter(gamePieces, ([location, piece]) => (!!piece && (piece.player == turn) && (piece.type == "King"))))[0];

  enemyKing.filterToSeeIfChecksOrBlocks(gamePieces);
  playerKing.filterToSeeIfChecksOrBlocks(gamePieces);

  Object.values(Object.filter(gamePieces, ([location, piece]) => (!!piece && (piece.player == turn)))).map( piece => { piece.moveOptions(gamePieces) } );

};

module.exports = moveAndCheckKing;