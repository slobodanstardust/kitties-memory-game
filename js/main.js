// Player 'class'

function Player (name, time, moves, score) {
  this.playerName = name
  this.timePlayed = time
  this.movesPlayed = moves
  this.playerScore = score
}

// Game 'class'

function Game () {
  this.time = 0
  this.moves = 0
  this.gameState = 'running' // Can be 'running' or 'finished'.
  this.players = []
}

Game.prototype.startGame = function (gameTableElement, timerElement, playerInputElement) {
  // 'gameTableElement' is for generating the game table.
  // 'timerElement' is for starting the timer.
  // 'playerInputElement' is for setting 'hidden' on player input field.
  playerInputElement.style.visibility = 'hidden'
  this.generateTable(gameTableElement)
  this.setTimer(timerElement)
}

Game.prototype.endGame = function (playerInputElement, submitScoreElement) {
  // 'submitScoreElement' must be a button.
  this.endMovesCounter()
  const finalScore = this.time / this.moves * 1000
  playerInputElement.style.visibility = 'visible' // Player can enter a name and submit score only after the game is finished.

  submitScoreElement.onclick = () => {
    const playerName = playerInputElement.playerName.value // The playerInputElement must contain text input field for entering a player's name with name="playerName".
    const newPlayer = new Player(playerName, this.time, this.moves, finalScore)
    this.players.push(newPlayer)
    this.generateScoreBoard()
    playerInputElement.style.visibility = 'hidden'
  }
}

Game.prototype.generateTable = function (gameTableElement) {
  // 'gameTableElement' will contain table of cards for the game.
  let gameCard = ''
  let gameDeck = ['redCard', 'redCard', 'greenCard', 'greenCard', 'blueCard', 'blueCard']
  gameDeck = this.shuffleDeck(gameDeck)

  gameDeck.forEach(member => {
    gameCard = `<div class="gameCard ${member}">${member}</div>`
    gameTableElement.innerHTML += gameCard
  })
}

Game.prototype.shuffleDeck = function (gameDeck) {
  // 'gameDeck' contains an array with classes for playing cards.
  const min = Math.ceil(0)
  const max = Math.floor(gameDeck.length - 1)
  let newPosition = 0
  let temp = 0

  for (let i = 0; i < gameDeck.length; i++) {
    newPosition = Math.floor(Math.random() * (max - min + 1)) + min
    temp = gameDeck[i]
    gameDeck[i] = gameDeck[newPosition]
    gameDeck[newPosition] = temp
  }

  return gameDeck // Returns shuffled array.
}

Game.prototype.setTimer = function (timerElement) {
  // 'timerElement' is for displaying time.
  let seconds = 0
  let minutes = 0

  const timer = setInterval(() => {
    if (this.gameState === 'running') {
      this.time++

      if (seconds === 60) {
        minutes++
        seconds = 1
      } else {
        seconds++
      }

      timerElement.innerHTML = `${minutes}:${seconds}`
    } else if (this.gameState === 'finished') {
      clearInterval(timer)

      timerElement.innerHTML = `Finished in ${minutes} minutes and ${seconds} seconds.`
    }
  }, 1000)
}

Game.prototype.manageMoves = function (gameTableElement) {
  // 'gameTableElement' needed for accessing playing cards.

}

Game.prototype.generateScoreBoard = function () {}

window.onload = () => {
  const gameTableElement = document.getElementById('gameTable')
  const timerElement = document.getElementById('timer')
  const playerInputElement = document.getElementById('playerInput')
  const submitScoreElement = document.getElementById('submitScore')

  const newGame = new Game()
  newGame.startGame(gameTableElement, timerElement, playerInputElement)

  setTimeout(() => {
    newGame.gameState = 'finished'
    console.log(newGame.time)
  }, 5000)
}
