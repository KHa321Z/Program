class King extends Piece {

  _img;
  _isCheck;
  _kingSideCastling;
  _queenSideCastling;
  _blockingCheck;

  constructor(position, color) {

    super(position, color);
    this._img = (this._color == "white") ? "&#9812;" : "&#9818;";
    this._isCheck = false;
    this._kingSideCastling = ["6_", "7_"].map( element => element + this._position.split("_")[1] );
    this._queenSideCastling = ["4_", "3_", "2_"].map( element => element + this._position.split("_")[1] );
    this._checkingPieces = [];
    this._blockingCheck = [];

    $("#" + this._position).html(this._img);

  };

  _initializingRooksForCastling(gamePieces) {

    this._leftRook = Object.values(Object.filter( gamePieces, ([location, piece]) => ((piece != null) && (piece.getPlayer() == this._player) && (piece.getType() == "Rook") && (piece.getPosition().split("_")[0] == "1")) ))[0];
    this._rightRook = Object.values(Object.filter( gamePieces, ([location, piece]) => ((piece != null) && (piece.getPlayer() == this._player) && (piece.getType() == "Rook") && (piece.getPosition().split("_")[0] == "8")) ))[0];

  };

  _moveOptions(gamePieces, calledForCheck=false) {

    this._validMoves = [];
    this._validMoves = [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: -1}, {x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: 1}];

    if (!this._isMoved && !this._isCheck) {

      if ((this._kingSideCastling.every( element => !gamePieces[element] )) && (!this._rightRook.getIsMoved())) this._validMoves = this._validMoves.concat([{x: 2, y: 0}]);
      else if ((this._queenSideCastling.every( element => !gamePieces[element] )) && (!this._leftRook.getIsMoved())) this._validMoves = this._validMoves.concat([{x: -2, y: 0}]);
      
    };
    
    this._validMoves = this._validMoves.map(this._addingCoordinates).filter(this._outOfBoundsCheck).filter(this._filterMoveOptions(gamePieces));

    if (calledForCheck) return (this._validMoves);
    else this._restrictKingMoves(gamePieces);

  };

  _restrictKingMoves(gamePieces) {
    
    let movesForPieces;
    let opponentPiecesOfPieceType;
    let recursiveMeasureForKing;
    let opponentPieces = Object.filter(gamePieces, ([location, piece]) => ((piece) && (piece.getPlayer() != this._player)));
    let opponentPiecesTypes = ["Pawn", "Rook", "Knight", "Bishop", "Queen", "King"];

    for (let pieceType of opponentPiecesTypes) {
      
      opponentPiecesOfPieceType = Object.filter(opponentPieces, ([location, piece]) => piece.getType() == pieceType);
      
      // only when calling validmoves
      for (let piece of Object.values(opponentPiecesOfPieceType)) {

        // this ternary operator is a measure so that getValidMove function does not turn into a recursive function as when a king checks the other teams moves it does not check the king again
        recursiveMeasureForKing = (piece.getType() == "King") ? true : false;

        // ternary operator is to check if it is a pawn then call pawns specific validMove set
        movesForPieces = (piece.getType() == "Pawn") ? piece._pawnMovesForOpponentKing() : piece.getValidMoves(gamePieces, recursiveMeasureForKing);
        this._validMoves = this._validMoves.filter( element => !movesForPieces.includes(element) );

      };

    };

  };

  _movePiece(event, gamePieces, targetCellPiece, targetCellPosition, turn) {

    if (!this._isMoved && !this._isCheck) {
      
      if (targetCellPosition.split("_")[0] == "3") this._leftRook.methodToCallInKingMove(event, gamePieces);
      else if (targetCellPosition.split("_")[0] == "7") this._rightRook.methodToCallInKingMove(event, gamePieces);

    };

    this._pieceMovement(event, gamePieces, targetCellPiece, targetCellPosition, turn);

  };

  _filterToSeeIfChecksOrBlocks(gamePieces) {

    // to remove blocking pieces from each piece and reselecting them according to this function
    this._blockingCheck.forEach( element => element._blockingFrom = null )

    this._checkingPieces = [];
    this._blockingCheck = [];
    
    let calledForCheck = true;
    let opponentPieces = Object.filter(gamePieces, ([location, piece]) => (piece && piece.getPlayer() != this._player))

    let kingPosition = {};
    [kingPosition.x, kingPosition.y] = this._position.split("_");
    
    let offSetForPawn = (this._player == 1) ? 1 : -1;

    // first two are standard map and filter functions and the third filters to see if there is an opponent piece in the corresponding coordinates and if the piece on the coordinate is one that checks the king
    let pawnCoordinatesToValidateThatCheck = [{x: 1, y: offSetForPawn}, {x: -1, y: offSetForPawn}].map(this._addingCoordinates).filter(this._outOfBoundsCheck).filter( element => (Object.keys(opponentPieces).includes(element) && (opponentPieces[element].getType() == "Pawn")) );
    pawnCoordinatesToValidateThatCheck.forEach( element => this._checkingPieces.push(gamePieces[element]) );

    let knightCoordinatesToValidateThatCheck = [{x: 1, y: 2}, {x: -1, y: 2}, {x: 2, y: 1}, {x: 2, y: -1}, {x: 1, y: -2}, {x: -1, y: -2}, {x: -2, y: -1}, {x: -2, y: 1}].map(this._addingCoordinates).filter(this._outOfBoundsCheck).filter( element => (Object.keys(opponentPieces).includes(element) && (opponentPieces[element].getType() == "Knight")) );
    knightCoordinatesToValidateThatCheck.forEach( element => this._checkingPieces.push(gamePieces[element]) );

    // to filter pawn, knight and king so that only multiple moving pieces remain
    opponentPieces = Object.filter(opponentPieces, ([location, piece]) => (piece.getType() != "Pawn") && (piece.getType() != "Knight") && (piece.getType() != "King"));

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
            if (gamePieces[currentMove].getPlayer() == piece.getPlayer()) break;
            // else here is that the piece belongs to the opponent team or the same team as the king which is executing this method
            else {

              // this condition here means that the looped piece is directly checking the king or if there is a piece in between them
              if (gamePieces[currentMove].getType() == "King") {

                if (!firstPieceInPath) {

                  this._checkingPieces.push(piece);

                } else {

                  this._blockingCheck.push(firstPieceInPath);
                  firstPieceInPath._blockingFrom = piece;

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
    
    if (this._checkingPieces.length > 0) {
      
      $("#" + this._position).toggleClass("capture-highlight");

      this._isCheck = true;

    } else {
      
      if (this._isCheck) this._checkingPieces = [];

      this._isCheck = false;

    };

  };

  initializeRooks(gamePieces) {
    this._initializingRooksForCastling(gamePieces);
  };

  checkFunction(gamePieces, opponentPieces) {
    this._filterToSeeIfChecksOrBlocks(gamePieces, opponentPieces);
  };

};
