document.addEventListener('DOMContentLoaded', function() {
  const ws = new WebSocket('ws://localhost:8080/TicTacToe-1.0-SNAPSHOT/game');

  //on load
  ws.onopen = function() {
    console.log("Connected to the server.");
  };

  // differentiate websocket messages
  ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    switch(data.type) {
      case "update":
        updateBoard(data.board);
        break;
      case "gameOver":
        infoUpdate("Winner is " + data.winner);
        break;
      case "turn":
        infoUpdate("It's your turn to play as " + data.symbol);
        break;
      default:
        infoUpdate(data.message);
        break;
    }
  };

  ws.onerror = function(event) {
    console.error("WebSocket error: ", event);
  };

  ws.onclose = function(event) {
    console.log("WebSocket is closed now.");
  };

  // for each grid item make it clickable and send an update to server, occluding the player from making another move
  // until the other player makes a move
  document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', function() {
      const id = this.id

      ws.send(JSON.stringify({action: "move", symbol: "X", id: id}));
      this.document.getElementsByClassName("obscuraoff")[0].className = "obscura"
    });
  });
});


//parse WS data and render on board
function updateBoard(board) {
  m = 0
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {

      document.getElementsByClassName("grid-item")[m].textContent = board[i][j];

      m++;
    }
  }

}

//provide tooltip update
function infoUpdate(info){
  document.querySelector(".info").innerHTML = info
}
