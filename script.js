const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('reset');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // Human player is X
let gameOver = false;

resetButton.addEventListener('click', resetGame);

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

  if (currentPlayer === 'O') {
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
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  // Check if O can win in the next move
  for (let i = 0; i < winPatterns.length; i++) {
    const [a, b, c] = winPatterns[i];
    if (board[a] === 'O' && board[b] === 'O' && !board[c]) return c;
    if (board[a] === 'O' && !board[b] && board[c] === 'O') return b;
    if (!board[a] && board[b] === 'O' && board[c] === 'O') return a;
  }

  // Check if X can win in the next move
  for (let i = 0; i < winPatterns.length; i++) {
    const [a, b, c] = winPatterns[i];
    if (board[a] === 'X' && board[b] === 'X' && !board[c]) return c;
    if (board[a] === 'X' && !board[b] && board[c] === 'X') return b;
    if (!board[a] && board[b] === 'X' && board[c] === 'X') return a;
  }

  // Check if center is available
  if (!board[4]) return 4;

  // Check if a corner is available
  const corners = [0, 2, 6, 8];
  for (let i = 0; i < corners.length; i++) {
    if (!board[corners[i]]) return corners[i];
  }

  // Check if an edge is available
  const edges = [1, 3, 5, 7];
  for (let i = 0; i < edges.length; i++) {
    if (!board[edges[i]]) return edges[i];
  }
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameOver = false;
  messageElement.textContent = '';
  renderBoard();
}

renderBoard();
