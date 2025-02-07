class Piece {

  constructor(position, color, player) {
    
    if (!!position && !!color) {
      
      this.type = this.constructor.name;
      this.position = position;
      this.player = (player) ? player : ((this.position.split("_")[1] == "1" || this.position.split("_")[1] == "2") ? 1 : 2);
      this.color = color;
      this.isCaptured = false;
      this.isMoved = false;
      this.blockingFrom = null;
      this.validMoves = [];

    };

  };

  constructorForjsonPieceObject(jsonPieceObject) {

    for (let property in jsonPieceObject) {

      this[property] = jsonPieceObject[property];
      
    };

  };

  outOfBoundsCheck = element => {

    let pos = {};
    [pos.x, pos.y] = element.split("_").map( value => { return parseInt(value) });

    return (!(pos.x < 1) && !(pos.x > 8) && !(pos.y < 1) && !(pos.y > 8));

  };

  addingCoordinates = element => {

    let pos = {};
    [pos.x, pos.y] = this.position.split("_").map( value => { return parseInt(value) });

    return ((element.x + pos.x) + "_" + (element.y + pos.y));

  };

  filterMoveOptions(gamePieces) {

    return (element => ((gamePieces[element] == null) || (gamePieces[element].player != this.player)));

  };

  filterMultipleMoveOptions(gamePieces, coordinates, forKingCheckingCoordinates) {
    
    let flag = false;

    coordinates = coordinates.filter( element => {

      if (!flag) {

        if (gamePieces[element] == null) { return (true) } else {

          flag = true;
          if ((gamePieces[element].player != this.player) || (gamePieces[element].type == "King")) return (true);

        };

      };

    });

    // to return only the coordinates that check the king so that blocking coordinates can be returned for the checked teams pieces
    let opponentsKing = Object.values(Object.filter(gamePieces, ([location, piece]) => (!!piece && (piece.player != this.player) && (piece.type == "King"))))[0];
    if (forKingCheckingCoordinates) return ((coordinates.includes(opponentsKing.position)) ? coordinates : []);


    // to filter coordinates according to the condition of the king
    let playersKing = Object.values(Object.filter(gamePieces, ([location, piece]) => (!!piece && (piece.player == this.player) && (piece.type == "King"))))[0];

    // if no piece is checking the king
    if (playersKing.checkingPieces.length == 0) {
      
      let validatingPiece = gamePieces[coordinates[coordinates.length - 1]];

      // if the coordinates has the same players kings position then remove it from the array
      if (coordinates.includes(playersKing.position)) coordinates.pop();

      // restricting piece movements if the piece is blocking the king from check
      return (((!!this.blockingFrom) && !((validatingPiece == this.blockingFrom) || (validatingPiece == playersKing))) ? [] : coordinates);


    // if this piece is not blocking another piece from checking king and some other piece checked the king
    } else if (!this.blockingFrom && (playersKing.checkingPieces.length == 1)) {

      let pieceCheckingKingCoordinates;
      let pieceCheckingKing = playersKing.checkingPieces[0];
      let forKingCheckingCoordinates = true;
      let elligibleBlockingPieceType = ["Queen", "Bishop", "Rook"].filter( element => element == pieceCheckingKing.type )

      // if the checking piece is a multiple moving piece then either block it form checking or capture it
      if (elligibleBlockingPieceType.length == 1) {

        pieceCheckingKingCoordinates = pieceCheckingKing.moveOptions(gamePieces, false, forKingCheckingCoordinates);
        pieceCheckingKingCoordinates.unshift(pieceCheckingKing.position);

        coordinates = coordinates.filter( element => pieceCheckingKingCoordinates.includes(element) );


        // if it is not a multiple moving piece then only capturing coordinate will be returned
      } else coordinates = coordinates.filter( element => element == pieceCheckingKing.position );
      

      // if the coordinates has the same players kings position then remove it from the array
      if (coordinates.includes(playersKing.position)) coordinates.pop();

      return (coordinates);


      // if the selected piece is already blocking a piece from checking the king and the king is also in check from another piece or king is checked by 2 pieces
    } else if (!(((!!this.blockingFrom) && (playersKing.checkingPieces.length == 1)) || (playersKing.checkingPieces.length > 1))) return [];

  };

};

module.exports = Piece;