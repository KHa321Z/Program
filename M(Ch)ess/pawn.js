import Piece from "./piece.js";
import Queen from "./queen.js";
import Bishop from "./bishop.js";
import Knight from "./knight.js";
import Rook from "./rook.js";

class Pawn extends Piece {

  _img;
  _yOffSet;

  constructor(position, color) {

    super(position, color);
    this._img = (this._color == "white") ? "&#9817;" : "&#9823;";
    this._yOffSet = (this._player == 1) ? 1 : -1;

    $("#" + this._position).html(this._img);

  };

  _simplePawnMovement(gamePieces, element) {

    let piecePos = {};
    let coordinate = {};
    let yOffsetForDoubleMove = this._yOffSet * 2;
    
    [coordinate.x, coordinate.y] = element.split("_").map( value => { return (parseInt(value)) });
    [piecePos.x, piecePos.y] = this._position.split("_").map( value => { return (parseInt(value)) });


    if (gamePieces[element] == null) {

      // first double move
      if (!this._isMoved && (coordinate.y == (piecePos.y + yOffsetForDoubleMove))) {

        // if there is not a piece in front of the pawn
        if (gamePieces[piecePos.x + "_" + (piecePos.y + this._yOffSet)] == null) return (true);

        // if there is a piece in front of the pawn
        return (false);
        
      };
      
      // simple one piece forward move if x coordinates are equal meaning straight line
      if (coordinate.x == piecePos.x) return (true);

      // diagonal capturing move
    } else return ((coordinate.x != piecePos.x) && (gamePieces[element].getPlayer() != this._player));

  };

  _blockedPawnMovement(gamePieces, element) {

    let piecePos = {};
    let coordinate = {};
    let yOffsetForDoubleMove = this._yOffSet * 2;
    
    [coordinate.x, coordinate.y] = element.split("_").map( value => { return (parseInt(value)) });
    [piecePos.x, piecePos.y] = this._position.split("_").map( value => { return (parseInt(value)) });


    if (gamePieces[element] == null) {

      if (this._blockingFrom._position.split("_")[0] == this._position.split("_")[0]) {

        // first double move
        if (!this._isMoved && (coordinate.y == (piecePos.y + yOffsetForDoubleMove))) {

          // if there is not a piece in front of the pawn
          if (gamePieces[piecePos.x + "_" + (piecePos.y + this._yOffSet)] == null) return (true);

          // if there is a piece in front of the pawn
          return (false);
          
        };
        
        // simple one piece forward move if x coordinates are equal meaning straight line
        if (coordinate.x == piecePos.x) return (true);

    };

      // diagonal capturing move
    } else return ((coordinate.x != piecePos.x) && (gamePieces[element].getPlayer() != this._player) && (this._blockingFrom == gamePieces[element]));

  };

  _pawnMovementWhenKingIsChecked(gamePieces, element, playersKing) {

    let piecePos = {};
    let coordinate = {};
    let yOffsetForDoubleMove = this._yOffSet * 2;
    
    [coordinate.x, coordinate.y] = element.split("_").map( value => { return (parseInt(value)) });
    [piecePos.x, piecePos.y] = this._position.split("_").map( value => { return (parseInt(value)) });

    let pieceCheckingKingCoordinates;
    let pieceCheckingKing = playersKing._checkingPieces[0];
    let forKingCheckingCoordinates = true;
    let elligibleBlockingPieceType = ["Queen", "Bishop", "Rook"].filter( element => element == pieceCheckingKing._type )

    // if the checking piece is a multiple moving piece then either block it form checking or capture it
    if (elligibleBlockingPieceType.length == 1) {

      pieceCheckingKingCoordinates = pieceCheckingKing.getValidMoves(gamePieces, false, forKingCheckingCoordinates);
      //pieceCheckingKingCoordinates.unshift(pieceCheckingKing._position);

      if (gamePieces[element] == null) {

        // first double move
        if (!this._isMoved && (coordinate.y == (piecePos.y + yOffsetForDoubleMove))) {

          // if there is not a piece in front of the pawn and return true if the coordinate is in the path of the checking piece
          if (gamePieces[piecePos.x + "_" + (piecePos.y + this._yOffSet)] == null) return (pieceCheckingKingCoordinates.includes(element));

          // if there is a piece in front of the pawn
          return (false);
          
        };
        
        // simple one piece forward move if x coordinates are equal meaning straight line and return true if the coordinate is in the path of the checking piece
        if (coordinate.x == piecePos.x) return (pieceCheckingKingCoordinates.includes(element));

        // diagonal capturing move if the checking piece is at the coordinate
      } else return ((coordinate.x != piecePos.x) && (element == pieceCheckingKing._position));


    // if it is not a multiple moving piece then only capturing coordinate will be returned
    } else return ((coordinate.x != piecePos.x) && (element == pieceCheckingKing._position));

  };

  _moveOptions(gamePieces) {

    this._validMoves = [];
    
    let coordinates = [];

    if (!this._isMoved) coordinates = coordinates.concat([{x: 0, y: (2 * this._yOffSet)}]);

    coordinates = coordinates.concat([{x: 0, y: (1 * this._yOffSet)}, {x: 1, y: (1 * this._yOffSet)}, {x: -1, y: (1 * this._yOffSet)}]);

    this._validMoves = coordinates.map(this._addingCoordinates).filter(this._outOfBoundsCheck).filter( element => {

      // to filter coordinates according to the condition of the king
      let playersKing = Object.values(Object.filter(gamePieces, ([location, piece]) => (piece && (piece._player == this._player) && (piece._type == "King"))))[0];
      

      // if no piece is checking the king and it is not blocking any other piece from checking the king
      if (!this._blockingFrom && (playersKing._checkingPieces.length == 0)) {

        return (this._simplePawnMovement(gamePieces, element));


      // if no piece is checking the king and it is blocking another piece from checking the king
      } else if (this._blockingFrom && (playersKing._checkingPieces.length == 0)) {

        return (this._blockedPawnMovement(gamePieces, element));

      // if this piece is not blocking another piece from checking king and some other piece checked the king
      } else if (!this._blockingFrom && (playersKing._checkingPieces.length == 1)) {

        return (this._pawnMovementWhenKingIsChecked(gamePieces, element, playersKing));

        // if the selected piece is already blocking a piece from checking the king and the king is also in check from another piece or king is checked by 2 pieces
      } else return (!(((!!this._blockingFrom) && (playersKing._checkingPieces.length == 1)) || (playersKing._checkingPieces.length > 1)))

    });

  };

  _pawnMovesForOpponentKing() {

    return ([{x: 1, y: (1 * this._yOffSet)}, {x: -1, y: (1 * this._yOffSet)}].map(this._addingCoordinates).filter(this._outOfBoundsCheck));

  };

  _promotingPawn(event, gamePieces) {

    if (event.originalEvent instanceof PointerEvent) {

      switch (event.target.id) {
        case "queen":
          gamePieces[this._position] = new Queen(this._position, this._color, this._player);
          break;

        case "bisop":
          gamePieces[this._position] = new Bishop(this._position, this._color, this._player);
          break;

        case "knight":
          gamePieces[this._position] = new Knight(this._position, this._color, this._player);
          break;

        case "rook":
          gamePieces[this._position] = new Rook(this._position, this._color, this._player);
          break;
      };

    };

  };

  changePawn(event, gamePieces) {
    this._promotingPawn(event, gamePieces);
  };

};

export {Pawn as default};