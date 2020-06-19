document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        "black",
    ]

    let randomAudio = Math.ceil(Math.random() * 4)
    let audio = document.getElementsByClassName(`ad${randomAudio}`)[0]

    function playAudio() {
        audio.play();
        audio.style.display = "block"
    }

    function pauseAudio() {
        audio.pause();
        audio.style.display = "block"
    }




    const lTetromino = [
        [1, 10 + 1, 10 * 2 + 1, 2],
        [10, 10 + 1, 10 + 2, 10 * 2 + 2],
        [1, 10 + 1, 10 * 2 + 1, 10 * 2],
        [10, 10 * 2, 10 * 2 + 1, 10 * 2 + 2]
    ]

    const zTetromino = [
        [0, 10, 10 + 1, 10 * 2 + 1],
        [10 + 1, 10 + 2, 10 * 2, 10 * 2 + 1],
        [0, 10, 10 + 1, 10 * 2 + 1],
        [10 + 1, 10 + 2, 10 * 2, 10 * 2 + 1]
    ]

    const tTetromino = [
        [1, 10, 10 + 1, 10 + 2],
        [1, 10 + 1, 10 + 2, 10 * 2 + 1],
        [10, 10 + 1, 10 + 2, 10 * 2 + 1],
        [1, 10, 10 + 1, 10 * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, 10, 10 + 1],
        [0, 1, 10, 10 + 1],
        [0, 1, 10, 10 + 1],
        [0, 1, 10, 10 + 1]
    ]

    const iTetromino = [
        [1, 10 + 1, 10 * 2 + 1, 10 * 3 + 1],
        [10, 10 + 1, 10 + 2, 10 + 3],
        [1, 10 + 1, 10 * 2 + 1, 10 * 3 + 1],
        [10, 10 + 1, 10 + 2, 10 + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0




    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]


    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }


    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''

        })
    }


    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        }
    }


    document.addEventListener('keydown', control)

    document.addEventListener('keydown', down)

    function down(e) {
        if (e.keyCode === 40) {
            moveDown()
        }
    }


    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }


    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }


    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if (!isAtLeftEdge) currentPosition -= 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }


    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        if (!isAtRightEdge) currentPosition += 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }



    function isAtRight() {
        return current.some(index => (currentPosition + index + 1) % width === 0)
    }

    function isAtLeft() {
        return current.some(index => (currentPosition + index) % width === 0)
    }

    function checkRotatedPosition(P) {
        P = P || currentPosition
        if ((P + 1) % width < 4) {
            if (isAtRight()) {
                currentPosition += 1
                checkRotatedPosition(P)
            }
        } else if (P % width > 5) {
            if (isAtLeft()) {
                currentPosition -= 1
                checkRotatedPosition(P)
            }
        }
    }


    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }





    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0



    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
    ]


    function displayShape() {

        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }


    startBtn.addEventListener('click', () => {
        pauseAudio()
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            playAudio()
            draw()
            timerId = setInterval(moveDown, 600)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })



    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = `Score: ${score}`
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }


    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {

            scoreDisplay.innerHTML = `Your score is ${score}.    
            Please refresh to start a new game.`
            clearInterval(timerId)
            let catDiv = document.createElement("div")
            catDiv.classList.add("catDiv")
            let catDivWrap = document.createElement("div")
            catDivWrap.classList.add("catDivWrap")

            let el = document.getElementsByClassName("body")[0]
            el.appendChild(catDiv)
            let elem = document.getElementsByClassName("catDiv")[0]
            elem.appendChild(catDivWrap)

            catDivWrap.style.backgroundImage = `url(cat.jpg)`

            let container = document.getElementsByClassName("container")[0]
            container.style.display = "none"
            let st = document.getElementsByClassName("start-button")[0]
            st.style.display = "none"
            document.removeEventListener('keydown', down)
            pauseAudio()
        }
    }

})