const gameboard = (function() {
    const board = new Array(9);
    board.fill(0)
    return { board }
})()

let currentPlayer = 0;

const newPlayer = function(marker) {
    currentPlayer++;
    const number = currentPlayer
        
    const placeMarker = function(index) {
        if (gameboard.board[index] === 0) {
            gameboard.board[index] = marker;
            console.log(gameboard.board)
            return true;
        }
        console.log(gameboard.board)
        return false
    }
    
    return { number, marker, placeMarker }
}

const checkWinner = function(player1) {
    const b = gameboard.board;

    const winCombos = [
        [0, 1, 2], // top row
        [3, 4, 5], // middle row
        [6, 7, 8], // bottom row
        [0, 3, 6], // left column
        [1, 4, 7], // middle column
        [2, 5, 8], // right column
        [0, 4, 8], // diagonal top-left to bottom-right
        [2, 4, 6]  // diagonal top-right to bottom-left
    ]

    for (let combo of winCombos) {
        const [a, b1, c] = combo;
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
            return b[a] === player1.marker ? `Player 1 Wins!` : `Player 2 Wins!`
        }
    }

    return null // No winner
}

function playRound() {
    let marker;
    do {
        marker = prompt(`Enter your marker (x or o): (Player 1)`)
        if (marker === null) return null
        marker = marker.trim().toLowerCase()
    } while (!["x", "o"].includes(marker))

    const player1 = newPlayer(marker)
    let player2
    if (marker === "x") {
        player2 = newPlayer("o")
    } else {
        player2 = newPlayer("x")
    }
    
    let winner;

    // Plays one round
    for (let i = 1; i <= 9; i++) {
        let currentPlayer = (i % 2 !== 0) ? player1 : player2

        let position
        let notOccupied
        do {
            position = Number(prompt(`Enter your move Player ${currentPlayer.number} (0-8)`))
            notOccupied = currentPlayer.placeMarker(position)
        } while ((position < 0 || position > 8) || notOccupied === false)

        if (i > 3) {
            winner = checkWinner(player1)
            if (winner !== null) {
                console.log(winner)
                return winner
            }
        }
    }
    console.log("It's a tie!")
    return winner
}

