class RockPaperScissors {
   // DOM Elements
   #elements = {
      gameBtns: document.querySelectorAll(".game-btns"),
      rulesBtn: document.querySelector("#rulesBtn"),
      closeRulesBtn: document.querySelector("#closeRulesModalBtn"),
      playAgainBtn: document.querySelector("#playAgainBtn"),
      scoreValue: document.querySelector("#scoreValue"),
      resultText: document.querySelector("#resultText"),
      state1: document.querySelector("#gameState"),
      state2: document.querySelector("#selectedState"),
      resultModal: document.querySelector("#resultModal"),
      rulesModal: document.querySelector("#rulesModal"),
      playerPickedImg: document.querySelector("#playerPickedImg"),
      housePickedImg: document.querySelector("#housePickedImg"),
      houseSpotEmpty: document.querySelector("#houseSpotEmpty"),
      houseSpotPicked: document.querySelector("#houseSpotPicked"),
      playerSpotPicked: document.querySelector("#playerSpotPicked"),
      overlay: document.querySelector("#overlay")
   };
   
   // Game state and config
   #houseChoices = ["Rock", "Paper", "Scissors"];
   #gameState = {
      score: Number.parseInt(localStorage.getItem("score")) || 0,
      playerChoice: "",
      houseChoice: "",
   };
   
   #images = {
      Rock: "/images/icon-rock.svg",
      Paper: "/images/icon-paper.svg",
      Scissors: "/images/icon-scissors.svg",
   };
   
   #winCombo = {
      Rock: { Rock: 0, Paper: -1, Scissors: 1 },
      Paper: { Paper: 0, Scissors: -1, Rock: 1 },
      Scissors: { Scissors: 0, Rock: -1, Paper: 1 }
   };
   
   #sounds = {
      win: new Audio("/sound/win-sound.wav"),
      loose: new Audio("/sound/loose-sound.wav"),
      clicked: new Audio("/sound/button-clicked-sound.wav"),
      tie: new Audio("/sound/tie-sound.wav")
   }
   
   constructor() {
      this.#initGame();
   }
   
   // Init Game
   #initGame() {
      this.#elements.scoreValue.textContent = this.#gameState.score
      this.#playRound();
      this.#bindRulesModal();
      this.#initPlayAgainBtn()
      
   }
   
   //Play Round
   #playRound() {
      this.#elements.gameBtns.forEach((btn) => {
         btn.addEventListener("click", () => {
            this.#sounds.clicked.play()
            this.#gameState.playerChoice = btn.dataset.choice;
            this.#getHouseChoice()
            this.#updateGameState();
         });
      });
   }
   
   // Check Winner
   #checkWin() {
      let message;
      let point = this.#winCombo[this.#gameState.playerChoice][this.#gameState.houseChoice]
      message = point === 1 ? "YOU WIN" : point === -1 ? "YOU LOOSE" : "IT'S A TIE"
      return { message, point }
   }
   
   //Play Again Button
   #initPlayAgainBtn() {
      const { playAgainBtn } = this.#elements
      playAgainBtn.addEventListener("click", () => {
         this.#sounds.clicked.play()
         this.#resetGameState()
      })
   }
   
   // Update Game States
   #updateGameState() {
      const { state1, state2, playerPickedImg, housePickedImg, houseSpotEmpty, houseSpotPicked, playerSpotPicked, resultModal } = this.#elements
      const { playerChoice, houseChoice } = this.#gameState
      
      state1.classList.add("hidden")
      state2.classList.remove("hidden")
      playerPickedImg.src = this.#images[playerChoice]
      playerSpotPicked.classList.add(`${playerChoice}-bd-color`)
      
      setTimeout(() => {
         const { message, point } = this.#checkWin()
         this.#gameState.score = Math.max(0, this.#gameState.score + point)
         localStorage.setItem("score", this.#gameState.score)
         this.#elements.resultText.textContent = message
         this.#elements.scoreValue.textContent = this.#gameState.score
         this.#updateHousePickedSpot(houseChoice, housePickedImg, houseSpotEmpty, houseSpotPicked)
         
         resultModal.classList.remove("hidden")
         
         // config sound
         point === 1 ? this.#sounds.win.play() : point === -1 ? this.#sounds.loose.play() : this.#sounds.tie.play()
      }, 1000)
   }
   
   // Update House Picked
   #updateHousePickedSpot(houseChoice, housePickedImg, houseSpotEmpty, houseSpotPicked) {
      houseSpotPicked.classList.remove("hidden")
      houseSpotPicked.classList.add(`${houseChoice}-bd-color`)
      houseSpotEmpty.classList.add("hidden")
      housePickedImg.src = this.#images[houseChoice]
   }
   
   // Reset Game State
   #resetGameState() {
      const { state1, state2, playerPickedImg, housePickedImg, houseSpotEmpty, houseSpotPicked, playerSpotPicked, resultModal } = this.#elements
      const { playerChoice, houseChoice } = this.#gameState
      
      state1.classList.remove("hidden")
      state2.classList.add("hidden")
      resultModal.classList.add("hidden")
      
      playerSpotPicked.classList.remove(`${playerChoice}-bd-color`)
      
      houseSpotPicked.classList.add("hidden")
      houseSpotPicked.classList.remove(`${houseChoice}-bd-color`)
      houseSpotEmpty.classList.remove("hidden")
   }
   
   
   // Get House Choice
   #getHouseChoice() {
      this.#gameState.houseChoice =
         this.#houseChoices[Math.floor(Math.random() * this.#houseChoices.length)];
   }
   
   // Bind Rules Modal Events
   #bindRulesModal() {
      this.#elements.rulesBtn.addEventListener("click", () => {
         this.#sounds.clicked.play()
         this.#elements.rulesModal.classList.remove("hidden");
         this.#elements.overlay.classList.remove("hidden")
         this.#elements.closeRulesBtn.addEventListener("click", () => {
            this.#elements.rulesModal.classList.add("hidden");
            this.#elements.overlay.classList.add("hidden")
         });
      });
   }
}

// Instantiate the game
const rps = new RockPaperScissors();
