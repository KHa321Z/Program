import Piece from "./piece.js";

class Bishop extends Piece {

  constructor(position, color, player=null) {

    super(position, color, player);
    this.img = (this.color == "white") ? "&#9815;" : "&#9821;";

    $("#" + this.position).html(this.img);

  };

  moveOptions(gamePieces, calledForCheck=false, forKingCheckingCoordinates=false) {

    this.validMoves = [];
    
    let plane, positions;
    let tempArray;
    let coordinates, checkCoordinates;
    let changingPlane = [{x: 1, y: 1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 1, y: -1}];

    coordinates = checkCoordinates = [];

    for (var i = 0; i < changingPlane.length; i++) {

      tempArray = [];
      plane = changingPlane[i];

      for (var point = 1; point <= 7; point++) {

        // this multiplies both coordinates with the increasing and decreasing var and stores the diagonal coordinates
        positions = {
          x: plane.x * point, 
          y: plane.y * point
        };

        tempArray = tempArray.concat([positions]);

      };

      coordinates = tempArray.map(this.addingCoordinates).filter(this.outOfBoundsCheck);
      this.validMoves = this.validMoves.concat(this.filterMultipleMoveOptions(gamePieces, coordinates, forKingCheckingCoordinates));
  
      if (calledForCheck) checkCoordinates = checkCoordinates.concat([coordinates]);

    };
    
    if (calledForCheck) return (checkCoordinates);

  };

};

export {Bishop as default};