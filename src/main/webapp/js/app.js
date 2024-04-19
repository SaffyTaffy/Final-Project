document.addEventListener('DOMContentLoaded', function() {
  const ws = new WebSocket('ws://localhost:8080/TicTacToe-1.0-SNAPSHOT/game');

  ws.onopen = function() {
    console.log("Connected to the server.");
  };

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

  document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', function() {
      const id = this.id

      ws.send(JSON.stringify({action: "move", symbol: "X", id: id}));
      this.document.getElementsByClassName("obscuraoff")[0].className = "obscura"
    });
  });
});

function updateBoard(board) {
  m = 0
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {

      document.getElementsByClassName("grid-item")[m].textContent = board[i][j];

      m++;
    }
  }

}
function infoUpdate(info){
  document.querySelector(".info").innerHTML = info
}
