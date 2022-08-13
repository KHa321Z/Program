import Piece from "./piece.js";
import Queen from "./queen.js";
import Bishop from "./bishop.js";
import Knight from "./knight.js";
import Rook from "./rook.js";

class Pawn extends Piece {

  constructor(position, color) {

    super(position, color);
    this.img = (this.color == "white") ? "&#9817;" : "&#9823;";
    this.yOffSet = (this.player == 1) ? 1 : -1;

    $("#" + this.position).html(this.img);

  };

  simplePawnMovement(gamePieces, element) {

    let piecePos = {};
    let coordinate = {};
    let yOffsetForDoubleMove = this.yOffSet * 2;
    
    [coordinate.x, coordinate.y] = element.split("_").map( value => { return (parseInt(value)) });
    [piecePos.x, piecePos.y] = this.position.split("_").map( value => { return (parseInt(value)) });


    if (gamePieces[element] == null) {

      // first double move
      if (!this.isMoved && (coordinate.y == (piecePos.y + yOffsetForDoubleMove))) {

        // if there is not a piece in front of the pawn
        if (gamePieces[piecePos.x + "_" + (piecePos.y + this.yOffSet)] == null) return (true);

        // if there is a piece in front of the pawn
        return (false);
        
      };
      
      // simple one piece forward move if x coordinates are equal meaning straight line
      if (coordinate.x == piecePos.x) return (true);

      // diagonal capturing move
    } else return ((coordinate.x != piecePos.x) && (gamePieces[element].player != this.player));

  };

  blockedPawnMovement(gamePieces, element) {

    let piecePos = {};
    let coordinate = {};
    let yOffsetForDoubleMove = this.yOffSet * 2;
    
    [coordinate.x, coordinate.y] = element.split("_").map( value => { return (parseInt(value)) });
    [piecePos.x, piecePos.y] = this.position.split("_").map( value => { return (parseInt(value)) });


    if (gamePieces[element] == null) {

      if (this.blockingFrom.position.split("_")[0] == this.position.split("_")[0]) {

        // first double move
        if (!this.isMoved && (coordinate.y == (piecePos.y + yOffsetForDoubleMove))) {

          // if there is not a piece in front of the pawn
          if (gamePieces[piecePos.x + "_" + (piecePos.y + this.yOffSet)] == null) return (true);

          // if there is a piece in front of the pawn
          return (false);
          
        };
        
        // simple one piece forward move if x coordinates are equal meaning straight line
        if (coordinate.x == piecePos.x) return (true);

    };

      // diagonal capturing move
    } else return ((coordinate.x != piecePos.x) && (gamePieces[element].player != this.player) && (this.blockingFrom == gamePieces[element]));

  };

  pawnMovementWhenKingIsChecked(gamePieces, element, playersKing) {

    let piecePos = {};
    let coordinate = {};
    let yOffsetForDoubleMove = this.yOffSet * 2;
    
    [coordinate.x, coordinate.y] = element.split("_").map( value => { return (parseInt(value)) });
    [piecePos.x, piecePos.y] = this.position.split("_").map( value => { return (parseInt(value)) });

    let pieceCheckingKingCoordinates;
    let pieceCheckingKing = playersKing.checkingPieces[0];
    let forKingCheckingCoordinates = true;
    let elligibleBlockingPieceType = ["Queen", "Bishop", "Rook"].filter( element => element == pieceCheckingKing.type )

    // if the checking piece is a multiple moving piece then either block it form checking or capture it
    if (elligibleBlockingPieceType.length == 1) {

      pieceCheckingKingCoordinates = pieceCheckingKing.getValidMoves(gamePieces, false, forKingCheckingCoordinates);
      //pieceCheckingKingCoordinates.unshift(pieceCheckingKing.position);

      if (gamePieces[element] == null) {

        // first double move
        if (!this.isMoved && (coordinate.y == (piecePos.y + yOffsetForDoubleMove))) {

          // if there is not a piece in front of the pawn and return true if the coordinate is in the path of the checking piece
          if (gamePieces[piecePos.x + "_" + (piecePos.y + this.yOffSet)] == null) return (pieceCheckingKingCoordinates.includes(element));

          // if there is a piece in front of the pawn
          return (false);
          
        };
        
        // simple one piece forward move if x coordinates are equal meaning straight line and return true if the coordinate is in the path of the checking piece
        if (coordinate.x == piecePos.x) return (pieceCheckingKingCoordinates.includes(element));

        // diagonal capturing move if the checking piece is at the coordinate
      } else return ((coordinate.x != piecePos.x) && (element == pieceCheckingKing.position));


    // if it is not a multiple moving piece then only capturing coordinate will be returned
    } else return ((coordinate.x != piecePos.x) && (element == pieceCheckingKing.position));

  };

  moveOptions(gamePieces) {

    this.validMoves = [];
    
    let coordinates = [];

    if (!this.isMoved) coordinates = coordinates.concat([{x: 0, y: (2 * this.yOffSet)}]);

    coordinates = coordinates.concat([{x: 0, y: (1 * this.yOffSet)}, {x: 1, y: (1 * this.yOffSet)}, {x: -1, y: (1 * this.yOffSet)}]);

    this.validMoves = coordinates.map(this.addingCoordinates).filter(this.outOfBoundsCheck).filter( element => {

      // to filter coordinates according to the condition of the king
      let playersKing = Object.values(Object.filter(gamePieces, ([location, piece]) => (piece && (piece.player == this.player) && (piece.type == "King"))))[0];
      

      // if no piece is checking the king and it is not blocking any other piece from checking the king
      if (!this.blockingFrom && (playersKing.checkingPieces.length == 0)) {

        return (this.simplePawnMovement(gamePieces, element));


      // if no piece is checking the king and it is blocking another piece from checking the king
      } else if (this.blockingFrom && (playersKing.checkingPieces.length == 0)) {

        return (this.blockedPawnMovement(gamePieces, element));

      // if this piece is not blocking another piece from checking king and some other piece checked the king
      } else if (!this.blockingFrom && (playersKing.checkingPieces.length == 1)) {

        return (this.pawnMovementWhenKingIsChecked(gamePieces, element, playersKing));

        // if the selected piece is already blocking a piece from checking the king and the king is also in check from another piece or king is checked by 2 pieces
      } else return (!(((!!this.blockingFrom) && (playersKing.checkingPieces.length == 1)) || (playersKing.checkingPieces.length > 1)))

    });

  };

  pawnMovesForOpponentKing() {

    return ([{x: 1, y: (1 * this.yOffSet)}, {x: -1, y: (1 * this.yOffSet)}].map(this.addingCoordinates).filter(this.outOfBoundsCheck));

  };

  promotingPawn(event, gamePieces) {

    if (event.originalEvent instanceof PointerEvent) {

      switch (event.target.id) {
        case "queen":
          gamePieces[this.position] = new Queen(this.position, this.color, this.player);
          break;

        case "bisop":
          gamePieces[this.position] = new Bishop(this.position, this.color, this.player);
          break;

        case "knight":
          gamePieces[this.position] = new Knight(this.position, this.color, this.player);
          break;

        case "rook":
          gamePieces[this.position] = new Rook(this.position, this.color, this.player);
          break;
      };

    };

  };

  changePawn(event, gamePieces) {
    this.promotingPawn(event, gamePieces);
  };

};

export {Pawn as default};