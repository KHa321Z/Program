function Piece(type, position, img, captured = false, moved = false) {
  this.type = type;
  this.position = position;
  this.img = img;
  this.captured = captured;
  this.moved = moved;
  this.player = this.type.split("_")[0]
  this.opponent = (this.player == "w") ? "b" : "w"
};

function gameSetup() {
  pieces["w_king1"].check = false;
  pieces["b_king1"].check = false;

  $("td:not(td.notations)").attr("data-chess", "null");

  for (var gamePiece in pieces) {
    $("#" + pieces[gamePiece].position).html(pieces[gamePiece].img);
    $("#" + pieces[gamePiece].position).attr("data-chess", gamePiece);
  };
};

function endTurn(didItOrDidItNot) {
  if (didItOrDidItNot) {
     
    selectedPiece = null;
    toggleHighlight();
    possibleMoves = possibleCaptures = [];
    turn = opponent;
    opponent = (turn == "w") ? "b" : "w";
    $("#turn").html((turn == "b") ? "Its Black's Turn" : "Its White's Turn")
    turnEnd = false;

  }
}

function outOfBoundsCheck(val) {
  var pos = {};
  [pos.x, pos.y] = val.split("_").map(val => { return parseInt(val) });

  return (!(pos.x < 1) && !(pos.x > 8) && !(pos.y < 1) && !(pos.y > 8));
}

function moveOptions(selectedPiece) {
  var options;
  var coordinates = [];
  var piecePosition = pieces[selectedPiece].position;
  var pieceType = pieces[selectedPiece].type;

  function addingCoordinates(val) {
    var pos = {};
    [pos.x, pos.y] = piecePosition.split("_").map(val => { return (parseInt(val)) });

    return ((pos.x + val.x) + "_" + (pos.y + val.y));
  };

  switch (pieceType) {
    case "w_pawn": case "b_pawn":
      
      var yOffset = (pieces[selectedPiece].player == "w") ? 1 : -1;

      if (!pieces[selectedPiece].moved) coordinates = coordinates.concat([{x: 0, y: (2 * yOffset)}]);

      coordinates = coordinates.concat([{x: 0, y: (1 * yOffset)}, {x: 1, y: (1 * yOffset)}, {x: -1, y: (1 * yOffset)}]);
      coordinates = coordinates.map(addingCoordinates);
      
      options = pieceOptions(selectedPiece, pieceType, piecePosition, coordinates);
      break;


    case "w_knight": case "b_knight":
      coordinates = [{x: 1, y: 2}, {x: -1, y: 2}, {x: 1, y: -2}, {x: -1, y: -2}, {x: 2, y: 1}, {x: -2, y: 1}, {x: 2, y: -1}, {x: -2, y: -1}].map(addingCoordinates);
      options = pieceOptions(selectedPiece, pieceType, piecePosition, coordinates);
      break;


    case "w_rook": case "b_rook":
      options = [];
      coordinates = [];
      var changingPos = ["x", "y", "x", "y"];
      var coordinate = 1;
      var positions, plane;

      for (var i = 0; i < changingPos.length; i++) {
        var posInPlane = changingPos[i]
        // possible move position set
        positions = {x: 0, y: 0};
        // temporary possible moves array
        coordinates = [];
        // positive or negative quadrant
        plane = (coordinate <= 2) ? 1 : -1;

        for (var point = 1; point <= 7; point++) {
          // this multiplies one coordinate with the increasing or decreasing var and stores the straight coordinates
          positions[posInPlane] = point * plane;
          
          coordinates = coordinates.concat([positions]);

          positions = {x: 0, y: 0};
        }
        
        coordinate++;
        options = options.concat(multiplePieceOptions(piecePosition, coordinates));
      }

      break;


    case "w_bishop": case "b_bishop":
      options = [];
      var changingPlane = [{x: 1, y: 1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 1, y: -1}];
      var pos;

      for (var i = 0; i < changingPlane.length; i++) {
        plane = changingPlane[i];
        coordinates = [];

        for (var point = 1; point <= 7; point++) {
          // this multiplies both coordinates with the increasing and decreasing var and stores the diagonal coordinates
          pos = {x: plane.x * point, y: plane.y * point};

          coordinates = coordinates.concat([pos]);
        }

        options = options.concat(multiplePieceOptions(piecePosition, coordinates));
      };

      break;

    case "w_queen": case "b_queen":
      options = [];
      var changingPos = ["x", "y", "x", "y"];
      var coordinate = 1;
      var changingPlane = [{x: 1, y: 1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 1, y: -1}];
      var positions, plane;

      for (var i = 0; i < changingPos.length; i++) {
        var posInPlane = changingPos[i]
        // possible move position set
        positions = {x: 0, y: 0};
        // temporary possible moves array
        coordinates = [];
        // positive or negative quadrant
        plane = (coordinate <= 2) ? 1 : -1;

        for (var point = 1; point <= 7; point++) {
          // this multiplies one coordinate with the increasing or decreasing var and stores the straight coordinates
          positions[posInPlane] = point * plane;

          coordinates = coordinates.concat([positions]);

          positions = {x: 0, y: 0};
        }

        coordinate++;
        options = options.concat(multiplePieceOptions(piecePosition, coordinates));
      }

      for (var i = 0; i < changingPlane.length; i++) {
        plane = changingPlane[i];
        coordinates = [];

        for (var point = 1; point <= 7; point++) {
          // this multiplies both coordinates with the increasing and decreasing var and stores the diagonal coordinates
          pos = {x: plane.x * point, y: plane.y * point};

          coordinates = coordinates.concat([pos]);
        }

        options = options.concat(multiplePieceOptions(piecePosition, coordinates));
      };

      break;


    case "w_king": case "b_king":

      coordinates = [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: -1}, {x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: 1}];

      if (!pieces[selectedPiece].moved && !pieces[selectedPiece].check) {
        
        if (((selectedPiece == "w_king") && ($("#6_1").attr("data-chess") == "null") && ($("#7_1").attr("data-chess") == "null") && (!pieces["w_rook2"].moved)) || ((selectedPiece == "b_king") && ($("#6_8").attr("data-chess") == "null") && ($("#7_8").attr("data-chess") == "null") && (!pieces["b_rook2"].moved))) coordinates = coordinates.concat([{x: 2, y: 0}]);
        else if (((selectedPiece == "w_king") && ($("#4_1").attr("data-chess") == "null") && ($("#3_1").attr("data-chess") == "null") && ($("#2_1").attr("data-chess") == "null")  && (!pieces["w_rook1"].moved)) || ((selectedPiece == "b_king") && ($("#4_8").attr("data-chess") == "null") && ($("#3_8").attr("data-chess") == "null") && ($("#2_8").attr("data-chess") == "null")  && (!pieces["b_rook1"].moved))) coordinates = coordinates.concat([{x: -2, y: 0}]);

      };
      
      options = pieceOptions(selectedPiece, pieceType, piecePosition, coordinates.map(addingCoordinates));
      break;    
  };

  return (options);
};

function pieceOptions(selectedPiece, pieceType, piecePosition, coordinates) {
  coordinates = coordinates.filter(outOfBoundsCheck);

  switch (pieceType) {
    case "w_king": case "b_king": case "w_knight": case "b_knight":
      coordinates = coordinates.filter(val => { return (($("#" + val).attr("data-chess") == "null") || ($("#" + val).attr("data-chess")).slice(0, 1) == pieces[selectedPiece].opponent) });
      break;

    case "w_pawn": case "b_pawn":
      coordinates = coordinates.filter(val => {
        let piecePos = {};
        let coordinate = {};
        let yOffsetForSingleMove = (pieceType.slice(0, 1) == "w") ? 1 : -1;
        let yOffset = yOffsetForSingleMove * 2;

        [coordinate.x, coordinate.y] = val.split("_").map(val => { return (parseInt(val)) });
        [piecePos.x, piecePos.y] = piecePosition.split("_").map(val => { return (parseInt(val)) });

        // diagonal capturing move
        if (coordinate.x != piecePos.x) {

          return ($("#" + val).attr("data-chess").slice(0, 1) == pieces[selectedPiece].opponent)

        } else if ($("#" + val).attr("data-chess") == "null") {
          // first double move
          if (!pieces[selectedPiece].moved && (coordinate.y == (piecePos.y + yOffset))) {
            // if there is not a piece in front of the pawn
            if ($("#" + piecePos.x + "_" + (piecePos.y + yOffsetForSingleMove)).attr("data-chess") == "null") return (true)

            // if there is a piece in front of the pawn
            return (false)
          }
          
          // simple one piece forward move
          return (true)
        };
      });
      break;
  };

  return (coordinates);
}

function multiplePieceOptions(piecePosition, coordinates) {
  let flag = false;

  function addingCoordinates(val) {
    var pos = {};
    [pos.x, pos.y] = piecePosition.split("_").map(val => { return (parseInt(val)) });

    return ((pos.x + val.x) + "_" + (pos.y + val.y));
  };

  coordinates = coordinates.map(addingCoordinates).filter(outOfBoundsCheck).filter(val => {
    if (!flag) {
      if ($("#" + val).attr("data-chess").slice(0, 1) == pieces[$("#" + piecePosition).attr("data-chess")].opponent) {

        flag = true; 
        return (true);

      } else if ($("#" + val).attr("data-chess").slice(0, 1) == pieces[$("#" + piecePosition).attr("data-chess")].player) {

        flag = true;

      } else { return ($("#" + val).attr("data-chess") == "null") };
    };
  });

  return (coordinates);
};

function highlightMoves(coordinates) {
  possibleMoves = coordinates.filter(val => {
    return ($("#" + val).attr("data-chess") == "null");
  })

  possibleCaptures = coordinates.filter(val => {
    return ($("#" + val).attr("data-chess") != "null");
  })
}

function toggleHighlight() {

  possibleMoves.forEach(element => {
    $("#" + element).toggleClass("move-highlight");
  });

  possibleCaptures.forEach(element => {
    $("#" + element).toggleClass("capture-highlight");
  });

}

function clickCell(e) {

  e.stopPropagation();
  
  var selectedPieceOptions;
  var targetCell = this;
  var targetCellPosition = targetCell.id;
  var targetCellAttr = targetCell.getAttribute("data-chess");

  if (selectedPiece) selectedPieceOptions = moveOptions(selectedPiece);

  if ((selectedPiece != targetCellAttr) && (targetCellAttr != "null") && (pieces[targetCellAttr].player == turn)) {
    
    if (selectedPiece != targetCellAttr) {

      $("#" + pieces[targetCellAttr].position).toggleClass("select-highlight");
      toggleHighlight();

    }

    if (selectedPiece) $("#" + pieces[selectedPiece].position).toggleClass("select-highlight");
    selectedPiece = targetCellAttr;

    highlightMoves(moveOptions(selectedPiece));
    toggleHighlight();

  } else if (selectedPiece == targetCellAttr) {
    
    $("#" + pieces[selectedPiece].position).toggleClass("select-highlight");
    selectedPiece = null;

    toggleHighlight();
    possibleMoves = possibleCaptures = [];

  } else if (selectedPiece && ((targetCellAttr == "null") || (pieces[targetCellAttr].player == opponent)) && selectedPieceOptions.includes(targetCellPosition)) {
      
    // castling
    if ((pieces[selectedPiece].type.slice(2) == "king") && (!pieces[selectedPiece].moved)) {

      // returns false if the castling conditions are not met
      var rookPosition = (turn == "w") ? ((targetCellPosition == "3_1") ? "4_1" : ((targetCellPosition == "7_1") ? "6_1" : false)) : ((targetCellPosition == "3_8") ? "4_8" : ((targetCellPosition == "7_8") ? "6_8" : false));

      if (rookPosition) {

        var rookOriginalPosition = (turn == "w") ? ((rookPosition == "4_1") ? "1_1" : "8_1") : ((rookPosition == "4_8") ? "1_8" : "8_8");

        $("#" + rookPosition).html(pieces[$("#" + rookOriginalPosition).attr("data-chess")].img);
        $("#" + rookPosition).attr("data-chess", [$("#" + rookOriginalPosition).attr("data-chess")]);

        $("#" + rookOriginalPosition).html("");
        $("#" + rookOriginalPosition).attr("data-chess", "null")

        pieces[$("#" + rookPosition).attr("data-chess")].position = rookPosition;
        pieces[$("#" + rookPosition).attr("data-chess")].moved = true;

      }

    };

    // capture move
    if (targetCellAttr.slice(0, 1) == opponent) {
      
      pieces[targetCellAttr].captured = true;
      pieces[targetCellAttr].position = turn + "capturedPieces";
      $("#" + targetCellPosition).html("");

    };
    
    // simple move
    $("#" + pieces[selectedPiece].position).toggleClass("select-highlight");
    $("#" + targetCellPosition).html(pieces[selectedPiece].img);
    $("#" + targetCellPosition).attr("data-chess", selectedPiece);

    $("#" + pieces[selectedPiece].position).html("");
    $("#" + pieces[selectedPiece].position).attr("data-chess", "null");

    pieces[selectedPiece].position = targetCellPosition;
    pieces[selectedPiece].moved = true;
    turnEnd = true;

    //pawn change window
    if ((pieces[selectedPiece].type.slice(2) == "pawn") && ((pieces[selectedPiece].position.split("_")[1] == "1") || (pieces[selectedPiece].position.split("_")[1] == "8"))) {
      
      turnEnd = false;

      $("#pawn-change-window").toggle();
      $("td:not(td.notations)").off("click");
      
    };
    
  };

  endTurn(turnEnd);

};

var pieces = {
  w_king1: new Piece("w_king", "5_1", "&#9812;"),
  w_queen1: new Piece("w_queen", "4_1", "&#9813;"),
  w_bishop1: new Piece("w_bishop", "3_1", "&#9815;"),
  w_bishop2: new Piece("w_bishop", "6_1", "&#9815;"),
  w_knight1: new Piece("w_knight", "2_1", "&#9816;"),
  w_knight2: new Piece("w_knight", "7_1", "&#9816;"),
  w_rook1: new Piece("w_rook", "1_1", "&#9814;"),
  w_rook2: new Piece("w_rook", "8_1", "&#9814;"),
  w_pawn1: new Piece("w_pawn", "1_2", "&#9817;"),
  w_pawn2: new Piece("w_pawn", "2_2", "&#9817;"),
  w_pawn3: new Piece("w_pawn", "3_2", "&#9817;"),
  w_pawn4: new Piece("w_pawn", "4_2", "&#9817;"),
  w_pawn5: new Piece("w_pawn", "5_2", "&#9817;"),
  w_pawn6: new Piece("w_pawn", "6_2", "&#9817;"),
  w_pawn7: new Piece("w_pawn", "7_2", "&#9817;"),
  w_pawn8: new Piece("w_pawn", "8_2", "&#9817;"),
  b_king1: new Piece("b_king", "5_8", "&#9818;"),
  b_queen1: new Piece("b_queen", "4_8", "&#9819;"),
  b_bishop1: new Piece("b_bishop", "3_8", "&#9821;"),
  b_bishop2: new Piece("b_bishop", "6_8", "&#9821;"),
  b_knight1: new Piece("b_knight", "2_8", "&#9822;"),
  b_knight2: new Piece("b_knight", "7_8", "&#9822;"),
  b_rook1: new Piece("b_rook", "1_8", "&#9820;"),
  b_rook2: new Piece("b_rook", "8_8", "&#9820;"),
  b_pawn1: new Piece("b_pawn", "1_7", "&#9823;"),
  b_pawn2: new Piece("b_pawn", "2_7", "&#9823;"),
  b_pawn3: new Piece("b_pawn", "3_7", "&#9823;"),
  b_pawn4: new Piece("b_pawn", "4_7", "&#9823;"),
  b_pawn5: new Piece("b_pawn", "5_7", "&#9823;"),
  b_pawn6: new Piece("b_pawn", "6_7", "&#9823;"),
  b_pawn7: new Piece("b_pawn", "7_7", "&#9823;"),
  b_pawn8: new Piece("b_pawn", "8_7", "&#9823;")
}

var turn = "w";
var turnEnd = false;
var opponent = (turn == "w") ? "b" : "w";
var selectedPiece = null;
var possibleMoves = [];
var possibleCaptures = [];
var playerColor;

$(document).ready(() => {
  gameSetup()

  $("div#black, div#white").on("click", e => {

    playerColor = e.target.id;
    $("div#container").toggle();
    $("#gameTable").toggle();

  });

  $(".options").click(e => {

    $("#pawn-change-window").toggle();
    
    pieces[selectedPiece].type = pieces[selectedPiece].player + "_" + e.target.id;
    pieces[selectedPiece].img = pieces[pieces[selectedPiece].player + "_" + e.target.id + "1"].img;
    $("#" + pieces[selectedPiece].position).html(pieces[selectedPiece].img);
    
    $("td:not(td.notations)").on("click", clickCell);

    endTurn(true);

  });

  $("td:not(td.notations)").on("click", clickCell);

  $("body").contextmenu(e => {
    e.preventDefault();
  });
})