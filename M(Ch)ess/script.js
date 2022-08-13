import Pawn from "./pieces/pawn.js";
import Rook from "./pieces/rook.js";
import Knight from "./pieces/knight.js";
import Bishop from "./pieces/bishop.js";
import Queen from "./pieces/queen.js";
import King from "./pieces/king.js";

class Game {

  #playerTurn;
  #turn

  #selectedPiece;
  #gamePieces;
  #possibleMoves;
  #possibleCaptures;

  #player1Color;
  #player2Color;
  #player1;
  #player2;

  constructor() {

    this.#playerTurn = 1;
    this.#turn = {end: false};

    this.#selectedPiece = null;
    this.#possibleMoves = this.#possibleCaptures = [];

    this.#player1Color = null;
    this.#player2Color = null;

    $("div#black, div#white").on("click", this.#colorChooser);

  };

  #highlightMoves(coordinates) {

    this.#possibleMoves = coordinates.filter(val => (this.#gamePieces[val] == null));
    this.#possibleCaptures = coordinates.filter(val => (this.#gamePieces[val] != null && this.#gamePieces[val].type != "King"));

  };
  
  #toggleHighlight() {
    
    this.#possibleMoves.forEach(element => $("#" + element).toggleClass("move-highlight"));
    this.#possibleCaptures.forEach(element => $("#" + element).toggleClass("capture-highlight"));
  
  };

  #colorChooser = event => {

    this.#player1Color = event.target.id;
    this.#player2Color = (this.#player1Color == "white") ? "black" : "white";

    $("div#black, div#white").off("click");
    $("div#container").toggle();
    $("#gameTable").toggle();
    $("div#black, div#white").off("click");

    this.#initializingGamePieces();

  };

  #pawnChangeWindow = event => {

    $("#pawn-change-window").toggle();
    $("td:not(td.notations)").on("click", this.#movePiece);
    
    this.#selectedPiece.changePawn(event, this.#gamePieces);

    this.#turn.end = true;
    this.#endTurn(this.#turn.end);

  };


  #initializingGamePieces() {

    Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate));

    this.#gamePieces = {
      "1_1": new Rook("1_1", this.#player1Color), 
      "2_1": new Knight("2_1", this.#player1Color), 
      "3_1": new Bishop("3_1", this.#player1Color), 
      "4_1": new Queen("4_1", this.#player1Color), 
      "5_1": new King("5_1", this.#player1Color), 
      "6_1": new Bishop("6_1", this.#player1Color), 
      "7_1": new Knight("7_1", this.#player1Color), 
      "8_1": new Rook("8_1", this.#player1Color), 
      "1_2": new Pawn("1_2", this.#player1Color), 
      "2_2": new Pawn("2_2", this.#player1Color), 
      "3_2": new Pawn("3_2", this.#player1Color), 
      "4_2": new Pawn("4_2", this.#player1Color), 
      "5_2": new Pawn("5_2", this.#player1Color), 
      "6_2": new Pawn("6_2", this.#player1Color), 
      "7_2": new Pawn("7_2", this.#player1Color), 
      "8_2": new Pawn("8_2", this.#player1Color), 
      "1_8": new Rook("1_8", this.#player2Color), 
      "2_8": new Knight("2_8", this.#player2Color), 
      "3_8": new Bishop("3_8", this.#player2Color), 
      "4_8": new Queen("4_8", this.#player2Color), 
      "5_8": new King("5_8", this.#player2Color), 
      "6_8": new Bishop("6_8", this.#player2Color), 
      "7_8": new Knight("7_8", this.#player2Color), 
      "8_8": new Rook("8_8", this.#player2Color), 
      "1_7": new Pawn("1_7", this.#player2Color), 
      "2_7": new Pawn("2_7", this.#player2Color), 
      "3_7": new Pawn("3_7", this.#player2Color), 
      "4_7": new Pawn("4_7", this.#player2Color), 
      "5_7": new Pawn("5_7", this.#player2Color), 
      "6_7": new Pawn("6_7", this.#player2Color), 
      "7_7": new Pawn("7_7", this.#player2Color), 
      "8_7": new Pawn("8_7", this.#player2Color)
    };

    // for initializing rooks in king class
    Object.values(Object.filter(this.#gamePieces, ([location, piece]) => piece.type == "King")).forEach( element => element.initializeRooks(this.#gamePieces) );

    this.#player1 = {
      color: this.#player1Color, 
      pieces: Object.filter(this.#gamePieces, ([location, piece]) => piece.player == 1), 
      king: this.#gamePieces["5_1"], 
      check: false, 
      blockingFromCheckPieces: [], 
      checkingPieces: []
    };

    this.#player2 = {
      color: this.#player2Color, 
      pieces: Object.filter(this.#gamePieces, ([location, piece]) => piece.player == 2), 
      king: this.#gamePieces["5_8"], 
      check: false, 
      blockingFromCheckPieces: [], 
      checkingPieces: []
    };

    this.#gameSetup();

  };

  #gameSetup() {

    let gameCells = $("td:not(td.notations)");
    gameCells = gameCells.filter( element => (!(gameCells[element].id in this.#gamePieces)) );
    
    for (var cell of gameCells) {
      this.#gamePieces[cell.id] = null;
    };

    $("td:not(td.notations)").on("click", this.#movePiece);
    $(".options").on("click", this.#pawnChangeWindow)

  };

  #movePiece = event => {

    event.stopPropagation();

    let selectedPieceOptions;
    let targetCell = event.target;
    let targetCellPosition = targetCell.id;
    let targetCellPiece = this.#gamePieces[targetCellPosition];
    
    if (this.#selectedPiece) selectedPieceOptions = this.#selectedPiece.getValidMoves(this.#gamePieces);
    
    if ((this.#selectedPiece != targetCellPiece) && (targetCellPiece != null) && (targetCellPiece.player == this.#playerTurn)) {
      
      // if some new piece is clicked
      if (this.#selectedPiece != targetCellPiece) {
        
        $("#" + targetCellPiece.position).toggleClass("select-highlight");
        this.#toggleHighlight();
  
      }
  
      if (this.#selectedPiece) $("#" + this.#selectedPiece.position).toggleClass("select-highlight");

      this.#selectedPiece = targetCellPiece;
  
      this.#highlightMoves(this.#selectedPiece.getValidMoves(this.#gamePieces));
      this.#toggleHighlight();

      // if the same piece is clicked again
    } else if ((this.#selectedPiece) && (this.#selectedPiece == targetCellPiece)) {
      
      $("#" + this.#selectedPiece.position).toggleClass("select-highlight");
      this.#selectedPiece = null;
  
      this.#toggleHighlight();
      this.#possibleMoves = this.#possibleCaptures = [];
  
      // piece move conditions
    } else if (this.#selectedPiece && ((targetCellPiece == null) || (targetCellPiece.player != this.#playerTurn)) && selectedPieceOptions.includes(targetCellPosition)) {
      
      this.#selectedPiece.move(event, this.#gamePieces, targetCellPiece, targetCellPosition, this.#turn);
  
      this.#pawnChangeWindowOpeningCondition();    
      
    };
  
    this.#endTurn(this.#turn.end);

  };

  #pawnChangeWindowOpeningCondition() {

    if ((this.#selectedPiece.type == "Pawn") && ((this.#selectedPiece.position.split("_")[1] == "1") || (this.#selectedPiece.position.split("_")[1] == "8"))) {
        
      this.#turn = {end: false, start: false};

      $("#pawn-change-window").toggle();              // executes this.#pawnChangeWindow as click event
      $("td:not(td.notations)").off("click");
      
    };

  };

  #endTurn(didItEndOrDidItNot) {

    if (didItEndOrDidItNot) {

      this.#selectedPiece = null;
      this.#toggleHighlight();
      this.#possibleMoves = this.#possibleCaptures = [];

      // one at the end of the turn
      this.#checkKingCheck()

      this.#playerTurn = (this.#playerTurn == 1) ? 2 : 1;
      this.#turn = {end: false, start: true};

      $("#turn").html((this.#turn == 1) ? "Its Player 1's Turn" : "Its Player 2's Turn");

      // one at the start of the turn
      this.#checkKingCheck();
  
    };

  };

  #checkKingCheck() {

    if (this.#playerTurn == 1) {

      this.#player1.king.checkFunction(this.#gamePieces);

      if (this.#player1.king._isCheck && (this.#player1.king.getValidMoves(this.#gamePieces).length == 0)) this.#gameEnd();

    } else {

      this.#player2.king.checkFunction(this.#gamePieces);

      if (this.#player2.king._isCheck && (this.#player2.king.getValidMoves(this.#gamePieces).length == 0)) this.#gameEnd();

    };

  };

  #gameEnd() {

    alert("Player 1 has Won!")
    $("td:not(td.notations)").off("click");

  };

};

const game = new Game();