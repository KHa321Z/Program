class Piece {

  _type;
  _position;
  _player;
  _color;
  _isCaptured;
  _isMoved;
  _blockingFrom;
  _validMoves;

  constructor(position, color, player) {
    
    this._type = this.constructor.name;
    this._position = position;
    this._player = (player) ? player : ((this._position.split("_")[1] == "1" || this._position.split("_")[1] == "2") ? 1 : 2);
    this._color = color;
    this._isCaptured = false;
    this._isMoved = false;
    this._blockingFrom = null;
    this._validMoves = [];

  };

  _outOfBoundsCheck = element => {

    let pos = {};
    [pos.x, pos.y] = element.split("_").map( value => { return parseInt(value) });

    return (!(pos.x < 1) && !(pos.x > 8) && !(pos.y < 1) && !(pos.y > 8));

  };

  _addingCoordinates = element => {

    let pos = {};
    [pos.x, pos.y] = this._position.split("_").map( value => { return parseInt(value) });

    return ((element.x + pos.x) + "_" + (element.y + pos.y));

  };

  _filterMoveOptions(gamePieces) {

    return (element => {

      return ((gamePieces[element] == null) || (gamePieces[element]._player != this._player));

    });

  };

  _filterMultipleMoveOptions(gamePieces, coordinates, forKingCheckingCoordinates) {
    
    let flag = false;

    coordinates = coordinates.filter( element => {

      if (!flag) {

        if (gamePieces[element] == null) { return (true) } else {

          flag = true;
          if ((gamePieces[element]._player != this._player) || (gamePieces[element]._type == "King")) return (true);

        };

      };

    });

    // to return only the coordinates that check the king so that blocking coordinates can be returned for the checked teams pieces
    let opponentsKing = Object.values(Object.filter(gamePieces, ([location, piece]) => (piece && (piece._player != this._player) && (piece._type == "King"))))[0];
    if (forKingCheckingCoordinates) return ((coordinates.includes(opponentsKing._position)) ? coordinates : []);


    // to filter coordinates according to the condition of the king
    let playersKing = Object.values(Object.filter(gamePieces, ([location, piece]) => (piece && (piece._player == this._player) && (piece._type == "King"))))[0];

    // if no piece is checking the king
    if (playersKing._checkingPieces.length == 0) {
      
      let validatingPiece = gamePieces[coordinates[coordinates.length - 1]];

      // restricting piece movements if the piece is blocking the king from check
      return (((!!this._blockingFrom) && !((validatingPiece == this._blockingFrom) || (validatingPiece == playersKing))) ? [] : coordinates);


    // if this piece is not blocking another piece from checking king and some other piece checked the king
    } else if (!this._blockingFrom && (playersKing._checkingPieces.length == 1)) {

      let pieceCheckingKingCoordinates;
      let pieceCheckingKing = playersKing._checkingPieces[0];
      let forKingCheckingCoordinates = true;
      let elligibleBlockingPieceType = ["Queen", "Bishop", "Rook"].filter( element => element == pieceCheckingKing._type )

      // if the checking piece is a multiple moving piece then either block it form checking or capture it
      if (elligibleBlockingPieceType.length == 1) {

        pieceCheckingKingCoordinates = pieceCheckingKing.getValidMoves(gamePieces, false, forKingCheckingCoordinates);
        pieceCheckingKingCoordinates.unshift(pieceCheckingKing._position);

        coordinates = coordinates.filter( element => pieceCheckingKingCoordinates.includes(element) );

        return (coordinates);

        // if it is not a multiple moving piece then only capturing coordinate will be returned
      } else {

        coordinates = coordinates.filter( element => element == pieceCheckingKing._position );
        
        return (coordinates);

      };


      // if the selected piece is already blocking a piece from checking the king and the king is also in check from another piece or king is checked by 2 pieces
    } else if (!(((!!this._blockingFrom) && (playersKing._checkingPieces.length == 1)) || (playersKing._checkingPieces.length > 1))) return [];

  };

  _pieceMovement(event, gamePieces, targetCellPiece, targetCellPosition, turn) {

    let selectedPiecePosition = this.getPosition();
    
    // capture move
    if (targetCellPiece && targetCellPiece.getPlayer() != this.getPlayer()) {
        
      targetCellPiece.setIsCaptured();
      $("#" + targetCellPosition).html("");

    };

    if ((this._type == "King") && (this._isCheck)) $("#" + this._position).toggleClass("capture-highlight");
    
    // simple move
    $("#" + selectedPiecePosition).toggleClass("select-highlight");
    $("#" + targetCellPosition).html(this.getImage());

    $("#" + selectedPiecePosition).html("");

    gamePieces[selectedPiecePosition] = null;
    gamePieces[targetCellPosition] = this;

    this._position = targetCellPosition;
    this._isMoved = true;

    turn.end = true;

  };

  getPlayer() { 
    return (this._player);
  };
  
  getType() {
    return (this._type);
  };

  getImage() {
    return (this._img);
  };

  getPosition() {
    return (this._position);
  };

  getIsMoved() {
    return (this._isMoved);
  };

  getValidMoves(gamePieces, calledForCheck=false, forKingCheckingCoordinates=false) {
    
    let coordinates = this._moveOptions(gamePieces, calledForCheck, forKingCheckingCoordinates);

    if (!calledForCheck) return (this._validMoves);
    else return (coordinates);
    
  };

  setIsMoved() {
    this._isMoved = true;
  };

  setIsCaptured() {
    this._isCaptured = true;
  };

  setIsBlocking(condition) {
    this._isBlockingFromCheck = condition;
  };

  _movePiece(event, gamePieces, targetCellPiece, targetCellPosition, turn) {

    this._pieceMovement(event, gamePieces, targetCellPiece, targetCellPosition, turn);

  };

  move(event, gamePieces, targetCellPiece, targetCellPosition, turn) {

    if (event.originalEvent instanceof PointerEvent) this._movePiece(event, gamePieces, targetCellPiece, targetCellPosition, turn); 
    
  };

};

export {Piece as default};
