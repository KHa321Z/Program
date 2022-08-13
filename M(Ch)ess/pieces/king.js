import Piece from "./piece.js";

class King extends Piece {

  constructor(position, color) {

    super(position, color);
    this.img = (this.color == "white") ? "&#9812;" : "&#9818;";
    this.isCheck = false;
    this.kingSideCastling = ["6_", "7_"].map( element => element + this.position.split("_")[1] );
    this.queenSideCastling = ["4_", "3_", "2_"].map( element => element + this.position.split("_")[1] );
    this.checkingPieces = [];
    this.blockingCheck = [];

    $("#" + this.position).html(this.img);

  };

  initializingRooksForCastling(gamePieces) {

    this.leftRook = Object.values(Object.filter( gamePieces, ([location, piece]) => ((piece != null) && (piece.player == this.player) && (piece.type == "Rook") && (piece.position.split("_")[0] == "1")) ))[0];
    this.rightRook = Object.values(Object.filter( gamePieces, ([location, piece]) => ((piece != null) && (piece.player == this.player) && (piece.type == "Rook") && (piece.position.split("_")[0] == "8")) ))[0];

  };

  moveOptions(gamePieces, calledForCheck=false) {

    this.validMoves = [];
    this.validMoves = [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: -1}, {x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: 1}];

    if (!this.isMoved && !this.isCheck) {

      if ((this.kingSideCastling.every( element => !gamePieces[element] )) && (!this.rightRook.isMoved)) this.validMoves = this.validMoves.concat([{x: 2, y: 0}]);
      else if ((this.queenSideCastling.every( element => !gamePieces[element] )) && (!this.leftRook.isMoved)) this.validMoves = this.validMoves.concat([{x: -2, y: 0}]);
      
    };
    
    this.validMoves = this.validMoves.map(this.addingCoordinates).filter(this.outOfBoundsCheck).filter(this.filterMoveOptions(gamePieces));

    if (calledForCheck) return (this.validMoves);
    else this.restrictKingMoves(gamePieces);

  };

  restrictKingMoves(gamePieces) {
    
    let movesForPieces;
    let opponentPiecesOfPieceType;
    let recursiveMeasureForKing;
    let opponentPieces = Object.filter(gamePieces, ([location, piece]) => ((piece) && (piece.player != this.player)));
    let opponentPiecesTypes = ["Pawn", "Rook", "Knight", "Bishop", "Queen", "King"];

    for (let pieceType of opponentPiecesTypes) {
      
      opponentPiecesOfPieceType = Object.filter(opponentPieces, ([location, piece]) => piece.type == pieceType);
      
      // only when calling validmoves
      for (let piece of Object.values(opponentPiecesOfPieceType)) {

        // this ternary operator is a measure so that getValidMove function does not turn into a recursive function as when a king checks the other teams moves it does not check the king again
        recursiveMeasureForKing = (piece.type == "King") ? true : false;

        // ternary operator is to check if it is a pawn then call pawns specific validMove set
        movesForPieces = (piece.type == "Pawn") ? piece.pawnMovesForOpponentKing() : piece.getValidMoves(gamePieces, recursiveMeasureForKing);
        this.validMoves = this.validMoves.filter( element => !movesForPieces.includes(element) );

      };

    };

  };

  movePiece(event, gamePieces, targetCellPiece, targetCellPosition, turn) {

    if (!this.isMoved && !this.isCheck) {
      
      if (targetCellPosition.split("_")[0] == "3") this.leftRook.methodToCallInKingMove(event, gamePieces);
      else if (targetCellPosition.split("_")[0] == "7") this.rightRook.methodToCallInKingMove(event, gamePieces);

    };

    this.pieceMovement(event, gamePieces, targetCellPiece, targetCellPosition, turn);

  };

  filterToSeeIfChecksOrBlocks(gamePieces) {

    // to remove blocking pieces from each piece and reselecting them according to this function
    this.blockingCheck.forEach( element => element.blockingFrom = null )

    this.checkingPieces = [];
    this.blockingCheck = [];
    
    let calledForCheck = true;
    let opponentPieces = Object.filter(gamePieces, ([location, piece]) => (piece && piece.player != this.player))

    let kingPosition = {};
    [kingPosition.x, kingPosition.y] = this.position.split("_");
    
    let offSetForPawn = (this.player == 1) ? 1 : -1;

    // first two are standard map and filter functions and the third filters to see if there is an opponent piece in the corresponding coordinates and if the piece on the coordinate is one that checks the king
    let pawnCoordinatesToValidateThatCheck = [{x: 1, y: offSetForPawn}, {x: -1, y: offSetForPawn}].map(this.addingCoordinates).filter(this.outOfBoundsCheck).filter( element => (Object.keys(opponentPieces).includes(element) && (opponentPieces[element].type == "Pawn")) );
    pawnCoordinatesToValidateThatCheck.forEach( element => this.checkingPieces.push(gamePieces[element]) );

    let knightCoordinatesToValidateThatCheck = [{x: 1, y: 2}, {x: -1, y: 2}, {x: 2, y: 1}, {x: 2, y: -1}, {x: 1, y: -2}, {x: -1, y: -2}, {x: -2, y: -1}, {x: -2, y: 1}].map(this.addingCoordinates).filter(this.outOfBoundsCheck).filter( element => (Object.keys(opponentPieces).includes(element) && (opponentPieces[element].type == "Knight")) );
    knightCoordinatesToValidateThatCheck.forEach( element => this.checkingPieces.push(gamePieces[element]) );

    // to filter pawn, knight and king so that only multiple moving pieces remain
    opponentPieces = Object.filter(opponentPieces, ([location, piece]) => (piece.type != "Pawn") && (piece.type != "Knight") && (piece.type != "King"));

    for (let piece of Object.values(opponentPieces)) {

      // looped piece:
      // opponentPieces[piece]

      let isChecking = false;
      let firstPieceInPath;
      let pieceValidMoves = piece.getValidMoves(gamePieces, calledForCheck);

      for (let row of pieceValidMoves) {
        
        for (let cell of row) {

          let currentMove = cell;

          if (gamePieces[currentMove] != null) {

            // == here means that the looping piece belongs to the same team as the piece situated in the looping coordinates meaning the looped piece and the coordinate piece belong to the same team
            if (gamePieces[currentMove].player == piece.player) break;
            // else here is that the piece belongs to the opponent team or the same team as the king which is executing this method
            else {

              // this condition here means that the looped piece is directly checking the king or if there is a piece in between them
              if (gamePieces[currentMove].type == "King") {

                if (!firstPieceInPath) {

                  this.checkingPieces.push(piece);

                } else {

                  this.blockingCheck.push(firstPieceInPath);
                  firstPieceInPath.blockingFrom = piece;

                };
                
                isChecking = true;
                break;

                // if there is a piece in path then store the piece in the variable
              } else if (!firstPieceInPath) {

                firstPieceInPath = gamePieces[currentMove];

                // else here is that the first piece is already stored and it was not the king and there appears another piece which is not king as well
              } else break;

            };

          };

        };

        firstPieceInPath = null;

        if (isChecking) break;

      };

    };
    
    if (this.checkingPieces.length > 0) {
      
      $("#" + this.position).toggleClass("capture-highlight");

      this.isCheck = true;

    } else {
      
      if (this.isCheck) {

        this.checkingPieces = [];

        $("#" + this.position).toggleClass("capture-highlight");
      
      };

      this.isCheck = false;

    };

  };

  initializeRooks(gamePieces) {
    this.initializingRooksForCastling(gamePieces);
  };

  checkFunction(gamePieces, opponentPieces) {
    this.filterToSeeIfChecksOrBlocks(gamePieces, opponentPieces);
  };

};

export {King as default};