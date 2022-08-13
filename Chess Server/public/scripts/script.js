const Game = class {

  constructor() {

    this.turnEnd;

    this.playerTurn;

    this.gamePieces;

    this.selectedPiece;

    this.possibleMoves;
    this.possibleCaptures;

    this.playerTurn = 1;
    this.turnEnd = false;

    this.selectedPiece = null;
    this.possibleMoves = this.possibleCaptures = [];

    Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate));

    $("div#WHITE, div#BLACK").on("click", this.colorChooser)

  };

  colorChooser = event => {

    let color = { color: event.target.id };

    $.ajax({
      url: "/",
      method: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(color),
      success: gamePieces => this.initializeBoard(gamePieces),
      failure: err => console.log(err)
    });

  };

  initializeBoard(gamePieces) {

    this.gamePieces = gamePieces;

    for (let piece in this.gamePieces) {

      if (!!this.gamePieces[piece]) {

        let position = this.gamePieces[piece].position;
        let image = this.gamePieces[piece].img

        $("#" + position).html(image);

      };

    };

    $("div#black, div#white").off("click");
    $("div#container").toggle();
    $("#gameTable").toggle();

    $("td:not(td.notations)").on("click", this.movePiece);
    
    $(".options").on("click", this.pawnChangeWindow);

  };

  // click event
  movePiece = event => {

    event.stopPropagation();

    let selectedPieceOptions;
    let targetCell = event.target;
    let targetCellPosition = targetCell.id;
    // Will be null if piece is not present
    let targetCellPiece = this.gamePieces[targetCellPosition];

    if (this.selectedPiece) selectedPieceOptions = this.selectedPiece.validMoves;


    if ((this.selectedPiece != targetCellPiece) && (!!targetCellPiece) && (this.playerTurn == targetCellPiece.player)) {


      // if a new piece is clicked instead of the same piece
      if (this.selectedPiece != targetCellPiece) {

        $("#" + targetCellPiece.position).toggleClass("select-highlight");
        this.toggleHighlight();

      };

      // if a new piece is selected then the above condition will highlight the new piece 
      // and this will unhighlight the previouslt selected piece
      if (this.selectedPiece) $("#" + this.selectedPiece.position).toggleClass("select-highlight");

      // and this will then assign the new piece to the selected piece
      this.selectedPiece = targetCellPiece;
      
      this.highlightMoves(this.selectedPiece.validMoves);
      this.toggleHighlight();


      // if the same piece is clicked again
    } else if ((!!this.selectedPiece) && (this.selectedPiece == targetCellPiece)) {
      

      $("#" + this.selectedPiece.position).toggleClass("select-highlight");
      this.selectedPiece = null;
  
      this.toggleHighlight();
      this.possibleMoves = this.possibleCaptures = [];

  
      // piece move conditions
    } else if (!!this.selectedPiece && selectedPieceOptions.includes(targetCellPosition)) {

      let selectedPiecePosition = this.selectedPiece.position;

      // castling move
      if ((this.selectedPiece.type == "King") && ((targetCellPosition.split("_")[0] == "3") || (targetCellPosition.split("_")[0] == "7")) && !this.selectedPiece.isMoved && !this.selectedPiece.isCheck) {

        let rookToBeCastled = (targetCellPosition.split("_")[0] == "3") ? this.selectedPiece.leftRook : this.selectedPiece.rightRook;
      
        $("#" + rookToBeCastled.castledPosition).html(this.img);
        $("#" + rookToBeCastled.position).html("");

        gamePieces[rookToBeCastled.position] = null;
        gamePieces[rookToBeCastled.castledPosition] = rookToBeCastled;

        rookToBeCastled.position = rookToBeCastled.castledPosition;
        rookToBeCastled.isMoved = true;
  
      };
    
      // capture move
      if (!!targetCellPiece && (this.selectedPiece.player != targetCellPiece.player)) {
          
        targetCellPiece.isCaptured = true;
        targetCellPiece.position = null;

        $("#" + targetCellPosition).html("");

      };

      // this line checks if the moving piece is a king and that if was in check so as to remove the check highlight from its previous position
      if ((this.selectedPiece.type == "King") && (this.selectedPiece.isCheck)) {$("#" + this.selectedPiece.position).toggleClass("capture-highlight");}
      
      // simple move
      $("#" + selectedPiecePosition).toggleClass("select-highlight");
      $("#" + targetCellPosition).html(this.selectedPiece.img);

      $("#" + selectedPiecePosition).html("");

      this.gamePieces[selectedPiecePosition] = null;
      this.gamePieces[targetCellPosition] = this.selectedPiece;

      this.selectedPiece.position = targetCellPosition;
      this.selectedPiece.isMoved = true;

      this.turnEnd = true;
  
      this.pawnChangeWindowOpeningCondition();

      
    };

    this.changingTurn(this.turnEnd);

  };

  pawnChangeWindowOpeningCondition() {

    if ((this.selectedPiece.type == "Pawn") && ((this.selectedPiece.position.split("_")[1] == "1") || (this.selectedPiece.position.split("_")[1] == "8"))) {
        
      this.turnEnd = false;

      $("#pawn-change-window").toggle();              // executes this.#pawnChangeWindow as click event
      $("td:not(td.notations)").off("click");         // temporarily stops movement of pieces on bg
      
    };

  };

  changingTurn(didItEndOrDidItNot) {

    if (didItEndOrDidItNot) {

      this.selectedPiece = null;
      this.toggleHighlight();
      this.possibleMoves = this.possibleCaptures = [];

      this.playerTurn = (this.playerTurn == 1) ? 2 : 1;
      this.turnEnd = false;

      $("#turn").html((this.playerTurn == 1) ? "Its Player 1's Turn" : "Its Player 2's Turn");

      $.ajax({
        url: "/",
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
          pieces: this.gamePieces, 
          turn: this.playerTurn
        }),
        success: gamePieces => this.endTurn(gamePieces),
        failure: err => console.log(err)
      });
  
    };

  };

  endTurn(gamePieces) {

    this.gamePieces = gamePieces;

    let player1King = Object.values(Object.filter(this.gamePieces, ([location, piece]) => (!!piece && (piece.type == "King") && (piece.player == 1))))[0];
    let player2King = Object.values(Object.filter(this.gamePieces, ([location, piece]) => (!!piece && (piece.type == "King") && (piece.player == 2))))[0];

    if (player1King.toggleHighlightClass) {
      $("#" + player1King.position).toggleClass("capture-highlight");
      player1King.toggleHighlightClass = false;
    };

    if (player2King.toggleHighlightClass) {
      $("#" + player2King.position).toggleClass("capture-highlight");
      player2King.toggleHighlightClass = false;
    };

    if ((this.playerTurn == 1) && (player1King.isCheck) && (player1King.validMoves.length == 0)) {

      this.gameEnd();

    } else if ((this.playerTurn == 2) && (player2King.isCheck) && (player2King.validMoves.length == 0)) {

      this.gameEnd();

    };

  };

  pawnChangeWindow = event => {

    $("#pawn-change-window").toggle();
    $("td:not(td.notations)").on("click", this.movePiece);

    this.selectedPiece.promotingPawn(this.gamePieces, event.target.id);

    this.turnEnd = true;
    this.changingTurn(this.turnEnd);

  };

  gameEnd() {

    alert(`Player ${this.playerTurn} has Won!`)
    $("td:not(td.notations)").off("click");

  };

  highlightMoves(coordinates) {

    this.possibleMoves = coordinates.filter(val => this.gamePieces[val] == null);
    this.possibleCaptures = coordinates.filter(val => this.gamePieces[val] != null);

  };

  toggleHighlight() {

    this.possibleMoves.forEach(element => $("#" + element).toggleClass("move-highlight"));
    this.possibleCaptures.forEach(element => $("#" + element).toggleClass("capture-highlight"));

  };

};

const game = new Game();