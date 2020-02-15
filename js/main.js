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

Game.prototype.endGame = function (playerInputElement, submitScoreElement, scoreBoardElement) {
  // 'submitScoreElement' must be a button.
  const finalScore = (this.time / this.moves * 1000).toFixed(0)
  playerInputElement.style.visibility = 'visible' // Player can enter a name and submit score only after the game is finished.

  submitScoreElement.onclick = () => {
    const playerName = playerInputElement.playerName.value // The playerInputElement must contain text input field for entering a player's name with name="playerName".
    const newPlayer = new Player(playerName, this.time, this.moves, finalScore)
    this.players.push(newPlayer)
    this.generateScoreBoard(scoreBoardElement, newPlayer)
    playerInputElement.style.visibility = 'hidden'
    console.log(newPlayer)
  }
}

Game.prototype.generateTable = function (gameTableElement) {
  // 'gameTableElement' will contain table of cards for the game.
  gameTableElement.innerHTML = ''
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

Game.prototype.manageMoves = function (gameTableElement, playerInputElement, submitScoreElement, scoreBoardElement) {
  // 'gameTableElement' needed for accessing playing cards.
  const playingCards = gameTableElement.children
  let firstCard = null
  let secondCard = null
  let comparison = 'same'

  for (let i = 0; i < playingCards.length; i++) {
    playingCards[i].onclick = () => {
      // If in a last move player didn't found the same cards.
      if (comparison === 'not same') {
        firstCard.classList.remove('flipped')
        secondCard.classList.remove('flipped')
      }

      comparison = 'same'
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      const flippedCards = this.countFlipped(playingCards)
      playingCards[i].classList.add('flipped')

      if (flippedCards.length % 2 === 0) {
        firstCard = playingCards[i]
      } else {
        secondCard = playingCards[i]
        this.moves++

        if (firstCard.isEqualNode(secondCard) && this.countFlipped(playingCards).length === playingCards.length) { // Count flipped again.
          this.gameState = 'finished'
          this.endGame(playerInputElement, submitScoreElement, scoreBoardElement)
        } else if (!firstCard.isEqualNode(secondCard)) {
          comparison = 'not same'
        }
      }
    }
  }
}

Game.prototype.countFlipped = function (playingCards) {
  // 'playingCards' is an array of card elements.
  const playingCardsArray = [...playingCards]
  const flippedCards = playingCardsArray.filter(member => {
    return member.classList.contains('flipped')
  })

  return flippedCards
}

Game.prototype.generateScoreBoard = function (scoreBoardElement, newPlayer) {
  // 'scoreBoardElement' is for dicplaying scores from all the player.
  // 'newPlayer' is active player.
  const scoreData = `
    <tr>
      <td>${newPlayer.playerName}</td>
      <td>${newPlayer.timePlayed}</td>
      <td>${newPlayer.movesPlayed}</td>
      <td>${newPlayer.playerScore}</td>
    </tr>
  `
  scoreBoardElement.innerHTML += scoreData
}

window.onload = () => {
  document.getElementById('startGame').onclick = () => {
    const gameTableElement = document.getElementById('gameTable')
    const timerElement = document.getElementById('timer')
    const playerInputElement = document.getElementById('playerInput')
    const submitScoreElement = document.getElementById('submitScore')
    const scoreBoardElement = document.getElementById('scoreBoard')

    const newGame = new Game()
    newGame.startGame(gameTableElement, timerElement, playerInputElement)
    newGame.manageMoves(gameTableElement, playerInputElement, submitScoreElement, scoreBoardElement)
  }
}
