class Bishop extends Piece {

  _img;

  constructor(position, color, player=null) {

    super(position, color, player);
    this._img = (this._color == "white") ? "&#9815;" : "&#9821;";

    $("#" + this._position).html(this._img);

  };

  _moveOptions(gamePieces, calledForCheck=false, forKingCheckingCoordinates=false) {

    this._validMoves = [];
    
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

      coordinates = tempArray.map(this._addingCoordinates).filter(this._outOfBoundsCheck);
      this._validMoves = this._validMoves.concat(this._filterMultipleMoveOptions(gamePieces, coordinates, forKingCheckingCoordinates));
  
      if (calledForCheck) checkCoordinates = checkCoordinates.concat([coordinates]);

    };
    
    if (calledForCheck) return (checkCoordinates);

  };

};
