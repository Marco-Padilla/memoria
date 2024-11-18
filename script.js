const board = document.getElementById("gameBoard");
const timerElement = document.getElementById("time");
const moveCountElement = document.getElementById("moveCount");
const flipSound = document.getElementById("flip-sound");
const matchSound = document.getElementById("match-sound");
const winSound = document.getElementById("win-sound");
const looseSound = document.getElementById("loose-sound");
const startStopBtn = document.getElementById("startStopBtn");
const resetBtn = document.getElementById("resetBtn");
const container2 = document.querySelector(".container2"); // Referencia al contenedor para imágenes de pares

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

// Imágenes a mostrar por cada par encontrado
const pairImages = [
  "img/pair1.png",
  "img/pair2.png",
  "img/pair3.png",
  "img/pair4.png",
  "img/pair5.png",
  "img/pair6.png",
];

// Variables globales
let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let timeLeft = 60;
let countdown;
let isGameStarted = false;
let pairsFound = 0;

// Baraja las cartas
function shuffle(array) {
  array.sort(() => 0.5 - Math.random());
}

// Crea las cartas en el tablero
function createBoard() {
  const visibleNumbers = Array.from({ length: 12 }, (_, i) => i + 1); // Números del 1 al 12
  shuffle(cards);
  shuffle(visibleNumbers); // Mezclar los números visibles
  board.innerHTML = ""; // Limpiar el tablero

  cards.forEach((imagePath, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Asignar números visibles en el lado oculto de la carta
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${visibleNumbers[index]}</div> 
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

// Desactiva las cartas emparejadas y cambia la imagen de fondo
function disableCards() {
  matchSound.play();
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  // Cambiar la imagen de fondo del contenedor
  if (pairsFound < pairImages.length) {
    const allImages = container2.querySelectorAll("img");
    allImages.forEach((img) => (img.style.display = "none")); // Ocultar todas las imágenes
    const imageToShow = container2.querySelector(
      `img[src="${pairImages[pairsFound]}"]`
    );
    if (imageToShow) {
      imageToShow.style.display = "block"; // Mostrar la imagen correspondiente al par
    }
  }

  pairsFound++; // Incrementar el contador de pares encontrados
  resetBoard();
  checkWin();
}

// Desvoltea las cartas si no coinciden
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
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
  if (pairsFound === pairImages.length) {
    clearInterval(countdown);
    winSound.play();

    // Ocultar otras imágenes y mostrar el logo de victoria
    container2
      .querySelectorAll("img")
      .forEach((img) => (img.style.display = "none"));
    document.getElementById("logo2").style.display = "block"; // Mostrar logo de victoria

    // Mostrar la imagen del último par completado
    const lastPairImage = document.createElement("img");
    lastPairImage.src = pairImages[pairsFound - 1]; // Última imagen del par encontrado
    lastPairImage.alt = `Último Pair ${pairsFound}`;
    lastPairImage.style.display = "block"; // Asegurar visibilidad
    lastPairImage.classList.add("pair-image");

    // Agregar la imagen al contenedor
    container2.appendChild(lastPairImage);
  }
}

// Termina el juego cuando el tiempo se acaba
function gameOver() {
  clearInterval(countdown);
  looseSound.play();
  container2
    .querySelectorAll("img")
    .forEach((img) => (img.style.display = "none"));
  document.getElementById("logo2").style.display = "block"; // Mostrar logo de derrota
}

// Reinicia el juego
function resetGame() {
  clearInterval(countdown);
  isGameStarted = false;
  startStopBtn.textContent = "Iniciar";
  moves = 0;
  moveCountElement.textContent = moves;
  timeLeft = 60;
  timerElement.textContent = timeLeft;
  pairsFound = 0;

  // Reiniciar imágenes
  container2
    .querySelectorAll("img")
    .forEach((img) => (img.style.display = "none"));
  document.getElementById("logo1").style.display = "block"; // Mostrar logo inicial

  createBoard();
}

// Event listeners para los botones
startStopBtn.addEventListener("click", startStopTimer);
resetBtn.addEventListener("click", resetGame);

// Inicia el juego al cargar
createBoard();
