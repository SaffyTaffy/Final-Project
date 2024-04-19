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
        showWinner(data.winner);
        break;
      case "turn":
        alert("It's your turn to play as " + data.symbol);
        break;
      default:
        alert(data.message);
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
      const id = parseInt(this.id.replace('cell-', ''), 10);
      const row = Math.floor(id / 3);
      const col = id % 3;
      ws.send(JSON.stringify({action: "move", symbol: "X", id: id}));
    });
  });
});

function updateBoard(board) {
  m = 0
  for (let i = 0; i < 3; i++) {
    for (let j = 0; i < 3; j++) {

      document.getElementsByClassName("grid-item")[m].textContent = board[i][j];

      m++;
    }
  }

}

function showWinner(winner) {
  alert("Winner is " + winner);
}
