const Piece = require("./piece.js");

class Bishop extends Piece {

  constructor(jsonObjectOrposition, color, player=null) {

    if ((jsonObjectOrposition instanceof Object) && (color == undefined)) { 

      super();
      this.constructorForjsonPieceObject(jsonObjectOrposition);

    } else {
      
      super(jsonObjectOrposition, color, player);
      this.img = (this.color == "WHITE") ? "&#9815;" : "&#9821;";

    };

  };

  moveOptions(gamePieces, calledForCheck=false, forKingCheckingCoordinates=false) {

    this.validMoves = [];
    
    let plane, positions;
    let tempArray;
    let coordinates;
    let changingPlane = [{x: 1, y: 1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 1, y: -1}];

    coordinates = [];

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
  
      // if calledForCheck then apply the filter function else concat as is
      this.validMoves = (!calledForCheck) ? this.validMoves.concat(this.filterMultipleMoveOptions(gamePieces, coordinates, forKingCheckingCoordinates)) : this.validMoves.concat([coordinates]);

    };
    
    return (this.validMoves);

  };

};

module.exports = Bishop;