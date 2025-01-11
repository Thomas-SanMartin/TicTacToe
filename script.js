const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('reset');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // Human player is X
let gameOver = false;

resetButton.addEventListener('click', resetGame);

// Two-player mode
const twoPlayerButton = document.getElementById('twoPlayer');
let twoPlayerMode = false;

twoPlayerButton.addEventListener('click', () => {

  if (!twoPlayerMode && !gameStarted) {  
  twoPlayerMode = !twoPlayerMode;
  twoPlayerButton.classList.toggle('active', twoPlayerMode);
  }

});

let gameStarted = false;


function renderBoard() {
  boardElement.innerHTML = '';
  board.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.className = `cell ${cell ? 'taken' : ''}`; // If cell is taken, add taken class
    cellElement.textContent = cell;
    cellElement.addEventListener('click', () => makeMove(index));
    boardElement.appendChild(cellElement);
  });
}

function makeMove(index) {
  if (board[index] || gameOver) return;

  board[index] = currentPlayer;
  gameStarted = true;
  renderBoard();

  if (checkWinner()) {
    messageElement.textContent = `${currentPlayer} wins!`;
    gameOver = true;
    return;
  }

  if (board.every(cell => cell)) {
    messageElement.textContent = "It's a draw!";
    gameOver = true;
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  if (!twoPlayerMode && currentPlayer === 'O') {
    const bestMove = findBestMove();
    board[bestMove] = 'O';
    renderBoard();

    if (checkWinner()) {
      messageElement.textContent = `O wins!`;
      gameOver = true;
    } else if (board.every(cell => cell)) {
      messageElement.textContent = "It's a draw!";
      gameOver = true;
    } else {
      currentPlayer = 'X';
    }
  }
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], //Rows 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], //Columns
    [0, 4, 8], [2, 4, 6] //Diagonals
  ];

  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function findBestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    // Check if the spot is available
    if (!board[i]) {
      board[i] = 'O'; // AI makes a move
      let score = minimax(board, 0, false); // Calculate score for this move
      board[i] = ''; // Undo the move
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner()) {
    return isMaximizing ? -10 + depth : 10 - depth;
  }
  if (board.every(cell => cell)) {
    return 0; // It's a draw
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}


function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameOver = false;
  messageElement.textContent = '';
  renderBoard();
  twoPlayerButton.classList.remove('active'); // Reset the two-player button state
  twoPlayerMode = false; // Reset the two-player mode
  gameStarted = false; // Reset the gameStarted state
}

renderBoard();
