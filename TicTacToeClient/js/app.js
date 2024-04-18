let playerX = document.querySelector(".playerX-info");
let playerO = document.querySelector(".playerO-info");
let board = document.querySelectorAll(".board .grid-item");
let announceWinner = document.querySelector(".winner-screen");

let currentPLayer = "";

window.onload = () => {
  document.querySelector(".game-screen").style.visibility = "hidden";
  document.querySelector(".choose-player").style.visibility = "hidden";
  document.querySelector(".winner-screen").style.visibility = "hidden"

  for (let i = 0; i < 9; i++) {
    board[i].setAttribute("onclick", "selectedBox(this)");
  }
}

function playGame() {
  document.querySelector(".play-game").style.visibility = "hidden";
  document.querySelector(".choose-player").style.visibility = "visible";
}

function startAsX() {
  document.querySelector(".choose-player").style.visibility = "hidden";
  document.querySelector(".game-screen").style.visibility = "visible";
  currentPLayer = "X";
}

function startAsO() {
  document.querySelector(".choose-player").style.visibility = "hidden";
  document.querySelector(".game-screen").style.visibility = "visible";
  currentPLayer = "O";
}

function selectedBox(element) {
  while ("" === element.innerHTML) {
    if (currentPLayer === "X") {
      element.innerHTML += "X";
      currentPLayer = "O";
    } else {
      if (currentPLayer ==="O") {
        element.innerHTML += "O";
        currentPLayer = "X";
      }
    }
  }
  winner(element);
}

function checkBox(element) {
  return board.item(element).innerHTML;
}

function checkGrid(box1, box2, box3, player) {
  if (checkBox(box1) === player && checkBox(box2) === player && checkBox(box3) === player) {
    return true;
  }
}

function winner(element) {
  if (checkGrid(0,1,2,element.innerHTML) || checkGrid(3,4,5,element.innerHTML) ||
    checkGrid(6,7,8,element.innerHTML) || checkGrid(0,3,6,element.innerHTML) ||
    checkGrid(1,4,7,element.innerHTML) || checkGrid(2,5,8,element.innerHTML) ||
    checkGrid(0,4,8,element.innerHTML) || checkGrid(2,4,6,element.innerHTML)) {

    let announcement =document.createTextNode("Congratulations Player " + element.innerHTML + ", you have won the game!");
    document.querySelector(".announcement").appendChild(announcement);

    document.querySelector(".game-screen").style.visibility = "hidden";
    document.querySelector(".winner-screen").style.visibility = "visible";


  }
}

function replay() {
  window.location.reload();
}
