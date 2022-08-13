import Piece from "./piece.js";

class Rook extends Piece {

  constructor(position, color, player=null) {

    super(position, color, player);
    this.img = (this.color == "white") ? "&#9814;" : "&#9820;";
    this.castledPosition = (this.position.split("_")[0] == "1") ? "4_" + this.position.split("_")[1] : "6_" + this.position.split("_")[1];

    $("#" + this.position).html(this.img);

  };

  moveOptions(gamePieces, calledForCheck=false, forKingCheckingCoordinates=false) {

    this.validMoves = [];

    let tempArray;
    let coordinates, checkCoordinates;
    let changingPos = ["x", "y", "x", "y"];
    let coordinate = 1;
    let positions, plane;

    coordinates = checkCoordinates = [];

    for (var i = 0; i < changingPos.length; i++) {

      let posInPlane = changingPos[i];
      // possible move position set
      positions = {x: 0, y: 0};
      // temporary possible moves array
      tempArray = [];
      // positive or negative quadrant
      plane = (coordinate <= 2) ? 1 : -1;

      for (var point = 1; point <= 7; point++) {

        // this multiplies one coordinate with the increasing or decreasing var and stores the straight coordinates
        positions[posInPlane] = point * plane;
        
        tempArray = tempArray.concat([positions]);

        positions = {x: 0, y: 0};

      };
      
      coordinate++;

      coordinates = tempArray.map(this.addingCoordinates).filter(this.outOfBoundsCheck);
      this.validMoves = this.validMoves.concat(this.filterMultipleMoveOptions(gamePieces, coordinates, forKingCheckingCoordinates));
      
      if (calledForCheck) checkCoordinates = checkCoordinates.concat([coordinates]);

    };
    
    if (calledForCheck) return (checkCoordinates);

  };

  changingRooksPositionForCastling(event, gamePieces) {

    // to check if it is not executed externally
    if (event.originalEvent instanceof PointerEvent) {
      
      $("#" + this.castledPosition).html(this.img);

      $("#" + this.position).html("");

      gamePieces[this.position] = null;
      gamePieces[this.castledPosition] = this;
      this.position = this.castledPosition;
      this.isMoved = true;

    };

  };

  methodToCallInKingMove(event, gamePieces) {
    this.changingRooksPositionForCastling(event, gamePieces);
  };

};

export {Rook as default};