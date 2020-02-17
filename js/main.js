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
  this.gameState = 'running'
  this.players = []
  this.startElement = document.getElementById('startGame')
  this.gameTableElement = document.getElementById('gameTable')
  this.timerElement = document.getElementById('timer')
  this.movesElement = document.getElementById('moves')
  this.playerInputElement = document.getElementById('playerInput')
  this.submitScoreElement = document.getElementById('submitScore')
  this.scoreBoardElement = document.getElementById('scoreBoard')
  this.tableElement = document.querySelector('table')
  this.modalElement = document.querySelector('.modal')
}

Game.prototype.startGame = function () {
  this.startElement.style.visibility = 'hidden' // Hides 'Start' button when the game starts.
  this.generateTable(this.gameTableElement) // Generates the cards on the table.
  this.movesElement.style.visibility = 'visible' // Initiate moves counter indicator.
  this.movesElement.innerHTML = `Moves: ${this.moves}` // Initiate moves counter indicator.
  this.timerElement.innerHTML = 'Time: 0:0' // Initiate time indicator.
  this.gameState = 'running' // For timer to run.
  this.setTimer(this.timerElement) // Start the timer.
}

Game.prototype.endGame = function () {
  const finalScore = ((60 / this.time) * (6 / this.moves) * 10000).toFixed(0) // Calculate final score. I still need a good formula.
  this.modalElement.style.display = 'block' // Activate modal for player name input after the game is finished.
  this.gameState = 'finished' // For timer to stop.

  this.submitScoreElement.onclick = () => {
    this.gameTableElement.style.visibility = 'hidden' // Hide cards so the 'Start' button can be shown.
    this.modalElement.style.display = 'none' // Remove modal when 'submit' button is pushed.
    const playerName = this.playerInputElement.value

    if (playerName === '' || playerName.length > 10) { // Validate player's name.
      window.alert('Enter your name (maximum 10 characters)!')
    } else {
      const newPlayer = new Player(playerName, this.time, this.moves, finalScore) // All OK. Create a new player.
      this.players.push(newPlayer) // Add new player in players array for the score board.
      this.generateScoreBoard() // Generats score board with all the players from players array.
      this.playerInputElement.value = '' // Resets the player's name input area.
      this.tableElement.style.visibility = 'visible' // Displays the score board.
      this.startElement.style.visibility = 'visible' // Displays the 'Start' button.
      this.time = 0 // Reset time.
      this.moves = 0 // Reset moves count.
    }
  }
}

Game.prototype.generateTable = function () {
  this.gameTableElement.innerHTML = ''
  this.gameTableElement.style.visibility = 'visible'
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
    this.gameTableElement.innerHTML += gameCard
  })
}

Game.prototype.shuffleDeck = function (gameDeck) {
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

  return gameDeck
}

Game.prototype.setTimer = function () {
  this.timerElement.style.visibility = 'visible'
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

      this.timerElement.innerHTML = `Time: ${minutes}:${seconds}`
    } else if (this.gameState === 'finished') {
      clearInterval(timer)
      this.timerElement.innerHTML = `Finished in ${minutes} minutes and ${seconds} seconds.`
    }
  }, 1000)
}

Game.prototype.manageMoves = function () {
  const playingCards = this.gameTableElement.children
  let firstCard = null
  let secondCard = null
  let lastClilcked = null
  let comparison = 'same'

  for (let i = 0; i < playingCards.length; i++) {
    playingCards[i].onclick = () => {
      if (comparison === 'not same') {
        firstCard.classList.remove('flipped')
        secondCard.classList.remove('flipped')
      }

      comparison = 'same'
      const flippedCards = this.countFlipped(playingCards)
      playingCards[i].classList.add('flipped')

      if (flippedCards.length % 2 === 0) {
        firstCard = playingCards[i]
      } else if (!lastClilcked.isSameNode(playingCards[i])) {
        secondCard = playingCards[i]
        this.moves++
        this.movesElement.innerHTML = `Moves: ${this.moves}`

        if (firstCard.isEqualNode(secondCard) && this.countFlipped(playingCards).length === playingCards.length) {
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
  const playingCardsArray = [...playingCards]
  const flippedCards = playingCardsArray.filter(member => {
    return member.classList.contains('flipped')
  })

  return flippedCards
}

Game.prototype.generateScoreBoard = function () {
  this.scoreBoardElement.innerHTML = ''

  this.orderScores(this.players).forEach(member => {
    this.scoreBoardElement.innerHTML += `
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
