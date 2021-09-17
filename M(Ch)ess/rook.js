import Piece from "./piece.js";

class Rook extends Piece {

  _img;
  _castledPosition;

  constructor(position, color, player=null) {

    super(position, color, player);
    this._img = (this._color == "white") ? "&#9814;" : "&#9820;";
    this._castledPosition = (this._position.split("_")[0] == "1") ? "4_" + this._position.split("_")[1] : "6_" + this._position.split("_")[1];

    $("#" + this._position).html(this._img);

  };

  _moveOptions(gamePieces, calledForCheck=false, forKingCheckingCoordinates=false) {

    this._validMoves = [];

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

      coordinates = tempArray.map(this._addingCoordinates).filter(this._outOfBoundsCheck);
      this._validMoves = this._validMoves.concat(this._filterMultipleMoveOptions(gamePieces, coordinates, forKingCheckingCoordinates));
      
      if (calledForCheck) checkCoordinates = checkCoordinates.concat([coordinates]);

    };
    
    if (calledForCheck) return (checkCoordinates);

  };

  _changingRooksPositionForCastling(event, gamePieces) {

    // to check if it is not executed externally
    if (event.originalEvent instanceof PointerEvent) {
      
      $("#" + this._castledPosition).html(this._img);

      $("#" + this._position).html("");

      gamePieces[this._position] = null;
      gamePieces[this._castledPosition] = this;
      this._position = this._castledPosition;
      this._isMoved = true;

    };

  };

  methodToCallInKingMove(event, gamePieces) {
    this._changingRooksPositionForCastling(event, gamePieces);
  };

};

export {Rook as default};