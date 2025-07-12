document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const status = document.getElementById('status');
  const resetButton = document.getElementById('reset');
  const winnerBanner = document.getElementById('winner-banner');

  const p1ScoreEl = document.getElementById('p1-score');
  const p2ScoreEl = document.getElementById('p2-score');
  const roundsEl = document.getElementById('rounds');
  const p1Label = document.getElementById('p1-label');
  const p2Label = document.getElementById('p2-label');

  const confettiCanvas = document.getElementById('confetti-canvas');
  const myConfetti = confetti.create(confettiCanvas, {
    resize: true,
    useWorker: true
  });

  let player1 = '';
  let player2 = '';
  let currentPlayer = '';
  let player1Color = '#00e5ff';
  let player2Color = '#ff4081';
  let board = Array(9).fill('');
  let gameActive = true;

  let p1Score = 0;
  let p2Score = 0;
  let rounds = 0;

  const winningConditions = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  function getPlayerInitials() {
    player1 = prompt("Enter Player 1's initials (1-2 letters):", "A") || "A";
    player1 = player1.trim().toUpperCase().slice(0, 2);

    player2 = prompt("Enter Player 2's initials (1-2 letters):", "B") || "B";
    player2 = player2.trim().toUpperCase().slice(0, 2);

    if (!player1) player1 = "A";
    if (!player2) player2 = "B";
    if (player1 === player2) player2 = player1 === "A" ? "B" : "A";

    currentPlayer = player1;
    p1Label.textContent = player1;
    p2Label.textContent = player2;
    status.textContent = `Player ${currentPlayer}'s turn`;
  }

  function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (board[index] !== '' || !gameActive) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.style.color = currentPlayer === player1 ? player1Color : player2Color;

    if (checkWin()) return;

    if (board.every(cell => cell !== '')) {
      status.textContent = "It's a draw!";
      winnerBanner.textContent = "🤝 It's a Draw!";
      winnerBanner.style.color = "#aaaaaa";
      winnerBanner.style.display = 'block';
      gameActive = false;
      rounds++;
      roundsEl.textContent = rounds;
      return;
    }

    currentPlayer = currentPlayer === player1 ? player2 : player1;
    status.textContent = `Player ${currentPlayer}'s turn`;
  }

  function checkWin() {
    const win = winningConditions.some(condition => {
      return condition.every(index => board[index] === currentPlayer);
    });

    if (win) {
      winnerBanner.textContent = `🎉 ${currentPlayer} Wins! 🎉`;
      winnerBanner.style.color = currentPlayer === player1 ? player1Color : player2Color;
      winnerBanner.style.display = 'block';
      status.textContent = `Player ${currentPlayer} wins!`;
      gameActive = false;

      if (currentPlayer === player1) {
        p1Score++;
        p1ScoreEl.textContent = p1Score;
      } else {
        p2Score++;
        p2ScoreEl.textContent = p2Score;
      }

      rounds++;
      roundsEl.textContent = rounds;

      launchConfetti();
      return true;
    }

    return false;
  }

  function launchConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      myConfetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      myConfetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  function resetGame() {
    board.fill('');
    cells.forEach(cell => {
      cell.textContent = '';
      cell.style.color = '#e0e0e0';
    });
    winnerBanner.style.display = 'none';
    currentPlayer = player1;
    gameActive = true;
    status.textContent = `Player ${currentPlayer}'s turn`;
  }

  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetButton.addEventListener('click', resetGame);

  getPlayerInitials();
});
