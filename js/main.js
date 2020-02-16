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

Game.prototype.startGame = function () {
  const startElement = document.getElementById('startGame')
  const gameTableElement = document.getElementById('gameTable')
  const timerElement = document.getElementById('timer')
  const playerInputElement = document.getElementById('playerInput')
  const movesElement = document.getElementById('moves')
  startElement.style.visibility = 'hidden'
  playerInputElement.style.visibility = 'hidden'
  movesElement.style.visibility = 'visible'
  timerElement.innerHTML = 'Time: 0:0'
  movesElement.innerHTML = `Moves: ${this.moves}`
  this.gameState = 'running'
  this.generateTable(gameTableElement)
  this.setTimer(timerElement)
}

Game.prototype.endGame = function () {
  const startElement = document.getElementById('startGame')
  const playerInputElement = document.getElementById('playerInput')
  const submitScoreElement = document.getElementById('submitScore')
  const gameTableElement = document.getElementById('gameTable')
  const tableElement = document.querySelector('table')
  const finalScore = ((60 / this.time) * (6 / this.moves) * 10000).toFixed(0)
  playerInputElement.style.visibility = 'visible' // Player can enter a name and submit score only after the game is finished.
  this.gameState = 'finished'

  submitScoreElement.onclick = () => {
    gameTableElement.style.visibility = 'hidden'
    const playerName = playerInputElement.playerName.value // The playerInputElement must contain text input field for entering a player's name with name="playerName".
    if (playerName === '' || playerName.length > 10) {
      window.alert('Enter your name (maximum 10 characters)!')
    } else {
      const newPlayer = new Player(playerName, this.time, this.moves, finalScore)
      this.players.push(newPlayer)
      this.generateScoreBoard(newPlayer)
      playerInputElement.playerName.value = ''
      playerInputElement.style.visibility = 'hidden'
      startElement.style.visibility = 'visible'
      tableElement.style.visibility = 'visible'
      this.time = 0
      this.moves = 0
    }
  }
}

Game.prototype.generateTable = function () {
  const gameTableElement = document.getElementById('gameTable')
  gameTableElement.innerHTML = ''
  gameTableElement.style.visibility = 'visible'
  let gameCard = ''
  let gameDeck = ['cat1', 'cat1', 'cat2', 'cat2', 'cat3', 'cat3', 'cat4', 'cat4', 'cat5', 'cat5', 'cat6', 'cat6']
  gameDeck = this.shuffleDeck(gameDeck)

  gameDeck.forEach(member => {
    gameCard = `
      <div class="gameCard">
        <div class="front ${member}"></div>
        <div class="back"></div>
      </div>
    `
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

Game.prototype.setTimer = function () {
  const timerElement = document.getElementById('timer')
  timerElement.style.visibility = 'visible'
  let seconds = 0
  let minutes = 0

  const timer = setInterval(() => {
    if (this.gameState === 'running') {
      this.time++

      if (seconds === 59) {
        minutes++
        seconds = 0
      } else {
        seconds++
      }

      timerElement.innerHTML = `Time: ${minutes}:${seconds}`
    } else if (this.gameState === 'finished') {
      clearInterval(timer)

      timerElement.innerHTML = `Finished in ${minutes} minutes and ${seconds} seconds.`
    }
  }, 1000)
}

Game.prototype.manageMoves = function () {
  const gameTableElement = document.getElementById('gameTable')
  const movesElement = document.getElementById('moves')
  const playingCards = gameTableElement.children
  let firstCard = null
  let secondCard = null
  let lastClilcked = null
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
      } else if (!lastClilcked.isSameNode(playingCards[i])) {
        secondCard = playingCards[i]
        this.moves++
        movesElement.innerHTML = `Moves: ${this.moves}`

        if (firstCard.isEqualNode(secondCard) && this.countFlipped(playingCards).length === playingCards.length) { // Count flipped again.
          this.endGame()
        } else if (!firstCard.isEqualNode(secondCard)) {
          comparison = 'not same'
        }
      }

      lastClilcked = playingCards[i]
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

Game.prototype.generateScoreBoard = function (newPlayer) {
  // 'newPlayer' is active player.
  const scoreBoardElement = document.getElementById('scoreBoard')
  scoreBoardElement.innerHTML = ''

  this.orderScores(this.players).forEach(member => {
    scoreBoardElement.innerHTML += `
    <tr>
      <td>${member.playerName}</td>
      <td>${this.formatTime(member.timePlayed)}</td>
      <td>${member.movesPlayed}</td>
      <td>${member.playerScore}</td>
    </tr>
  `
  })
}

Game.prototype.orderScores = function (players) {
  return players.sort((a, b) => b.playerScore - a.playerScore)
}

Game.prototype.formatTime = function (timePlayed) {
  let minutes = ''
  let seconds = ''

  if (timePlayed / 60 < 10) {
    minutes = `0${(timePlayed / 60).toFixed(0)}`
  } else minutes = `${(timePlayed / 60).toFixed(0)}`

  if (timePlayed % 60 < 10) {
    seconds = `0${timePlayed % 60}`
  } else seconds = `${timePlayed % 60}`

  return `${minutes}:${seconds}`
}

// Game body

window.onload = () => {
  const newGame = new Game()

  document.getElementById('startGame').onclick = () => {
    newGame.startGame()
    newGame.manageMoves()
  }
}
