const Piece = require("./piece.js");

class Queen extends Piece {

  constructor(jsonObjectOrposition, color, player=null) {

    if ((jsonObjectOrposition instanceof Object) && (color == undefined)) { 

      super();
      this.constructorForjsonPieceObject(jsonObjectOrposition);

    } else {

      super(jsonObjectOrposition, color, player);
      this.img = (this.color == "WHITE") ? "&#9813;" : "&#9819;";

    };

  };

  moveOptions(gamePieces, calledForCheck=false, forKingCheckingCoordinates=false) {

    this.validMoves = [];

    let positions, plane;
    let tempArray;
    let coordinates;
    let coordinate = 1;
    let changingPos = ["x", "y", "x", "y"];
    let changingPlane = [{x: 1, y: 1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 1, y: -1}];
    
    coordinates = [];

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
  
      // if calledForCheck then apply the filter function else concat as is
      this.validMoves = (!calledForCheck) ? this.validMoves.concat(this.filterMultipleMoveOptions(gamePieces, coordinates, forKingCheckingCoordinates)) : this.validMoves.concat([coordinates]);

    };

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

module.exports = Queen;