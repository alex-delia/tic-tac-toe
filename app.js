const gameboard = (function () {
    let board = new Array(9);

    const getBoard = () => board;

    const printBoard = () => {
        console.log(getBoard());
    }

    const resetBoard = () => {
        board = new Array(9);
    }

    const placeSquare = (cell, playerPiece) => {
        if (board[cell] === undefined) {
            board[cell] = playerPiece;
            return true;
        } else {
            return false;
        }
    }

    return { getBoard, printBoard, placeSquare, resetBoard };
})();

function Player(name) {
    let piece;
    return { name, piece };
}

function Game() {
    var winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]];

    const p1Name = document.querySelector('#player1Name').value;
    const p2Name = document.querySelector('#player2Name').value;

    let Player1;
    let Player2;

    if (p1Name) {
        Player1 = Player(p1Name);
    } else {
        Player1 = Player('Player 1');
    }
    Player1.piece = 'X';

    if (p2Name) {
        Player2 = Player(p2Name);
    } else {
        Player2 = Player('Player 2');
    }
    Player2.piece = 'O';

    let activePlayer = Player1;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === Player1 ? Player2 : Player1;
    }

    const getActivePlayer = () => activePlayer;

    const printRound = () => {
        gameboard.printBoard();
        console.log(`${activePlayer.name}'s Turn:`);
    }

    const playRound = (cell) => {
        gameboard.placeSquare(cell, getActivePlayer().piece);
        printRound();
    }

    const checkWin = () => {
        for (let condition of winConditions) {
            let gameWon = true;
            for (let cell of condition) {
                if (gameboard.getBoard()[cell] !== getActivePlayer().piece) {
                    gameWon = false;
                }
            }
            if (gameWon) {
                console.log(`${getActivePlayer().name} WINS`);
                return condition;
            }
        }
        if (!gameboard.getBoard().includes(undefined)) {
            console.log("IT'S A TIE!");
            return 'TIE';
        }
        switchActivePlayer();
    }

    printRound();

    return { getActivePlayer, playRound, checkWin }
}

const DisplayController = (function () {
    const container = document.querySelector('.container');
    const cells = document.querySelectorAll('.cell');
    const start = document.querySelector('.start');
    const formContainer = document.querySelector('.formContainer');
    const board = document.querySelector('.board');
    const reset = document.querySelector('.reset');
    const activePlayer = document.createElement('h2');
    const result = document.createElement('h1');

    reset.addEventListener('click', () => {
        location.reload();
    })

    function startGame() {
        board.style.display = 'grid';
        formContainer.style.display = 'none';
        reset.style.display = 'block';

        const game = Game();
        activePlayer.textContent = `${game.getActivePlayer().name}'s Turn`;
        container.prepend(activePlayer);

        function displayMove(e) {
            this.innerText = game.getActivePlayer().piece;
            this.removeEventListener('click', displayMove);
            game.playRound(this.dataset.index);
            const gameResult = game.checkWin()
            if (gameResult !== undefined) {
                for (let cell of cells) {
                    cell.classList.remove('hover');
                    activePlayer.remove();
                }
            } else {
                this.classList.remove('hover');
            }
            if (Array.isArray(gameResult)) {
                for (let cell of cells) {
                    for (let index of gameResult) {
                        if (parseInt(cell.dataset.index) === index) {
                            cell.style.backgroundColor = 'rgb(0, 222, 0)';
                        }
                    }
                    cell.removeEventListener('click', displayMove);
                }
                result.textContent = `${game.getActivePlayer().name} WINS`
                container.prepend(result);
            } else if (gameResult === 'TIE') {
                result.textContent = `Tie Game`
                container.prepend(result);
            }
            activePlayer.textContent = `${game.getActivePlayer().name}'s Turn`;
        }

        for (let cell of cells) {
            cell.addEventListener('click', displayMove);
        }
    }

    start.addEventListener('click', startGame);

})();



