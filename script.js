const gameboard = (function() {
    let board = new Array(9).fill(0);
    
    const getBoard = function() {
        return board
    }

    const resetBoard = function() {
        board = new Array(9).fill(0)
    }

    const placeTile = function(index, value) {
        if (board[index] !== 0) return false
        board[index] = value
        return true
    }

    return { getBoard, resetBoard, placeTile }
})()

const newPlayer = function(marker) {              
    return { marker }
}

const checkWinner = function(player) {
    const b = gameboard.getBoard()

    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    for (let combo of winCombos) {
        const [a, b1, c] = combo;
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
            return `Player ${player.marker} Wins!`;
        }
    }
    return null
}

const buttons = document.querySelectorAll("button")
const message = document.querySelector(".message")
const board = document.querySelector("table")
const tiles = board.querySelectorAll(".option")

const restartContainer = document.querySelector(".restart")
const restartButton = document.createElement("span")
restartButton.classList.add("restartButton")
restartButton.textContent = "Play Again?"

restartButton.addEventListener("click", restart)

let counter = 1
let player1 = null
let player2 = null

function startGame() {
    tiles.forEach((tile) => {
        tile.addEventListener("click", handleTileClick)
    })

    buttons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            if (player1 && player2) return;

            e.target.style.color = "red"
            e.target.classList.add("player-selected")
            disableButtons(buttons)

            const marker = e.target.textContent
            player1 = newPlayer(marker)
            player2 = newPlayer(marker === "x" ? "o" : "x");
            
            playRound()
        })
    })
    message.textContent = "Choose Your player";
}

function playRound() {
    //Enables selection of tiles
    tiles.forEach(tile => {
        tile.style.cursor = "pointer"
        tile.style.pointerEvents = "auto"
    })

    const currentPlayer = (counter % 2 !== 0) ? player1 : player2
    message.textContent = `Player ${currentPlayer.marker}'s turn`    
}

function disableButtons(elements) {
    elements.forEach(item => {
        item.style.pointerEvents = "none"
    })
} 

function tileSelected(e) {
    e.target.classList.add("tile-selected")
    e.target.style.pointerEvents = "none"
}

function handleTileClick(e) {
    if (!player1 || !player2) return

    const tile = e.target
    if (tile.classList.contains("tile-selected")) return
    
    const index = parseInt(tile.dataset.index)
    const currentPlayer = (counter % 2 !== 0 ? player1 : player2)
    
    gameboard.placeTile(index, currentPlayer.marker)
    if (counter % 2 !== 0) tile.style.color = "red"
    tile.textContent = currentPlayer.marker
    tileSelected(e)

    let winner = null

    if (counter >= 5) {
        winner = checkWinner(currentPlayer)
        if (winner !== null) {
            message.textContent = `Player ${currentPlayer.marker} Wins!`
            disableButtons(tiles)
            restartContainer.appendChild(restartButton)
            return
        }
    }

    // No winners
    if (!winner && counter === 9) {
        message.textContent = `It's a tie!`
        restartContainer.appendChild(restartButton)
        return
    }

    counter++
    const nextPlayer = (counter % 2 !== 0) ? player1 : player2
    message.textContent = `Player ${nextPlayer.marker}'s turn`
}

function restart() {
    gameboard.resetBoard()
    counter = 1
    player1 = null
    player2 = null

    message.textContent = "Choose Your player"

    buttons.forEach(btn => {
        btn.removeAttribute('class')
        btn.removeAttribute('style')
        btn.style.pointerEvents = "auto"
    })

    tiles.forEach(tile => {
        tile.textContent = ""
        tile.classList.remove("tile-selected")
        tile.removeAttribute("style")
    })

    if (restartContainer.contains(restartButton)) {
        restartContainer.removeChild(restartButton);
    }
}

startGame()