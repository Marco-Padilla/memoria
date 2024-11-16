const board = document.getElementById("gameBoard");
const timerElement = document.getElementById("time");
const moveCountElement = document.getElementById("moveCount");
const flipSound = document.getElementById("flip-sound");
const matchSound = document.getElementById("match-sound");
const winSound = document.getElementById("win-sound");
const looseSound = document.getElementById("loose-sound");
const startStopBtn = document.getElementById("startStopBtn");
const resetBtn = document.getElementById("resetBtn");

const cards = [
  "img/A2.png",
  "img/A2.png",
  "img/B2.png",
  "img/B2.png",
  "img/C1.png",
  "img/C1.png",
  "img/D2.png",
  "img/D2.png",
  "img/E1.png",
  "img/E1.png",
  "img/F2.png",
  "img/F2.png",
];

// Números únicos del 1 al 12 para la parte frontal (visible) de cada carta
const visibleNumbers = Array.from({ length: 12 }, (_, i) => i + 1);

let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let timeLeft = 60;
let countdown;
let isGameStarted = false;

// Baraja las cartas
function shuffle(array) {
  array.sort(() => 0.5 - Math.random());
}

// Crea las cartas en el tablero
function createBoard() {
  shuffle(cards);
  shuffle(visibleNumbers); // Mezclar los números visibles para que el orden en la parte frontal sea aleatorio
  board.innerHTML = ""; // Limpiar tablero al crear uno nuevo
  cards.forEach((imagePath, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
          <div class="card-front">${visibleNumbers[index % 12]}</div>
          <div class="card-back"><img src="${imagePath}" alt="Card image"></div>
      </div>
    `;
    card.dataset.symbol = imagePath;
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

// Inicia o detiene el temporizador
function startStopTimer() {
  if (!isGameStarted) {
    isGameStarted = true;
    startStopBtn.textContent = "Detener";
    startTimer();
  } else {
    isGameStarted = false;
    startStopBtn.textContent = "Iniciar";
    clearInterval(countdown);
  }
}

// Inicia el temporizador
function startTimer() {
  countdown = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      gameOver();
    }
  }, 1000);
}

// Voltea la carta
function flipCard() {
  if (!isGameStarted || lockBoard) return;
  if (this === firstCard) return;

  flipSound.play();
  this.classList.add("flipped");
  if (!firstCard) {
    firstCard = this;
    return;
  }
  secondCard = this;
  incrementMoves();
  checkForMatch();
}

// Verifica si las cartas coinciden
function checkForMatch() {
  let isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
  isMatch ? disableCards() : unflipCards();
}

// Desactiva las cartas emparejadas
function disableCards() {
  matchSound.play();
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  resetBoard();
  checkWin();
}

// Desvoltea las cartas si no coinciden
function unflipCards() {
  lockBoard = true;
  firstCard.classList.add("shake");
  secondCard.classList.add("shake");

  setTimeout(() => {
    firstCard.classList.remove("flipped", "shake");
    secondCard.classList.remove("flipped", "shake");
    resetBoard();
  }, 1000);
}

// Reinicia las variables del tablero
function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Incrementa el contador de movimientos
function incrementMoves() {
  moves++;
  moveCountElement.textContent = moves;
}

// Verifica si el jugador ha ganado
function checkWin() {
  const flippedCards = document.querySelectorAll(".card.matched");
  const img1 = document.getElementById("logo1");
  const img2 = document.getElementById("logo2");
  if (flippedCards.length === cards.length) {
    clearInterval(countdown);
    winSound.play();
    img1.style.display = "none";
    img2.style.display = "block";
  }
}

// Termina el juego cuando el tiempo se acaba
function gameOver() {
  const img1 = document.getElementById("logo1");
  const img3 = document.getElementById("logo3");
  looseSound.play();
  img1.style.display = "none";
  img3.style.display = "block";
}

// Reinicia el juego
function resetGame() {
  const img1 = document.getElementById("logo1");
  const img2 = document.getElementById("logo2");
  const img3 = document.getElementById("logo3");

  img1.style.display = "block";
  img2.style.display = "none";
  img3.style.display = "none";

  clearInterval(countdown);
  isGameStarted = false;
  startStopBtn.textContent = "Iniciar";
  moves = 0;
  moveCountElement.textContent = moves;
  timeLeft = 60;
  timerElement.textContent = timeLeft;
  createBoard();
}

// Event listeners para los botones
startStopBtn.addEventListener("click", startStopTimer);
resetBtn.addEventListener("click", resetGame);

// Inicia el juego al cargar
createBoard();
