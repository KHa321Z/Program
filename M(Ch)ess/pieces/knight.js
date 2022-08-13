import Piece from "./piece.js";

class Knight extends Piece {

  constructor(position, color, player=null) {

    super(position, color, player);
    this.img = (this.color == "white") ? "&#9816;" : "&#9822;";

    $("#" + this.position).html(this.img);

  };

  moveOptions(gamePieces) {

    this.validMoves = [];

    let coordinates = [];
    coordinates = [{x: 1, y: 2}, {x: -1, y: 2}, {x: 1, y: -2}, {x: -1, y: -2}, {x: 2, y: 1}, {x: -2, y: 1}, {x: 2, y: -1}, {x: -2, y: -1}];

    // if the king is not in check and this piece is either blocking or not blocking then it can move according to the coordinates returned from these filter functions
    this.validMoves = coordinates.map(this.addingCoordinates).filter(this.outOfBoundsCheck).filter(this.filterMoveOptions(gamePieces)).filter( element => !this.blockingFrom );

    
    // else it will move according to the given conditions
    // to filter coordinates according to the condition of the king
    let playersKing = Object.values(Object.filter(gamePieces, ([location, piece]) => (piece && (piece.player == this.player) && (piece.type == "King"))))[0];
    
    // if this piece is not blocking another piece from checking king and some other piece checked the king
    if (!this.blockingFrom && (playersKing.checkingPieces.length == 1)) {
      
      let pieceCheckingKingCoordinates;
      let pieceCheckingKing = playersKing.checkingPieces[0];
      let forKingCheckingCoordinates = true;
      let elligibleBlockingPieceType = ["Queen", "Bishop", "Rook"].filter( element => element == pieceCheckingKing.type )

      // if the checking piece is a multiple moving piece then either block it form checking or capture it
      if (elligibleBlockingPieceType.length == 1) {
        
        pieceCheckingKingCoordinates = pieceCheckingKing.getValidMoves(gamePieces, false, forKingCheckingCoordinates);
        pieceCheckingKingCoordinates.unshift(pieceCheckingKing.position);

        this.validMoves = this.validMoves.filter( element => pieceCheckingKingCoordinates.includes(element) );

        // if it is not a multiple moving piece then only capturing coordinate will be returned
      } else this.validMoves = this.validMoves.filter( element => element == pieceCheckingKing.position );
      

      // if the selected piece is already blocking a piece from checking the king and the king is also in check from another piece or king is checked by 2 pieces
    } else if (((!!this.blockingFrom) && (playersKing.checkingPieces.length == 1)) || (playersKing.checkingPieces.length > 1)) this.validMoves = [];

  };

};

export {Knight as default};