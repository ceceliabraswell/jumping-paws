// canvas & context
let board;
let context;

// board size (responsive)
let boardWidth;
let boardHeight;

// cat variables
let catWidth = 118;
let catHeight = 114;
let catX = 50;
let catY;
let catImg;

let cat = {
    x: catX,
    y: 0,
    width: catWidth,
    height: catHeight
};

// yarn variables
let yarnArray = [];

let yarn1Width = 68;
let yarn2Width = 99;
let yarn3Width = 132;
let yarnHeight = 70;
let yarnY;

let yarn1Img;
let yarn2Img;
let yarn3Img;

// physics
let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

// speed increase
let speedIncreaseInterval = 5000;
let speedMultiplier = 1;
let speedTimer = setInterval(increaseSpeed, speedIncreaseInterval);

// score timing
let lastScoreTime = Date.now();

// prevent multiple restarts
let restartPressed = false;

window.onload = function () {
    board = document.getElementById("board");
    context = board.getContext("2d");

    setBoardSize();
    window.addEventListener("resize", setBoardSize);

    catImg = new Image();
    catImg.src = "./img/cat-running.png";
    catImg.onload = () => {
        context.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);
    };

    yarn1Img = new Image();
    yarn1Img.src = "./img/yarnBall1.png";

    yarn2Img = new Image();
    yarn2Img.src = "./img/yarnBall2.png";

    yarn3Img = new Image();
    yarn3Img.src = "./img/yarnBall3.png";

    requestAnimationFrame(update);
    setInterval(placeYarn, 1500);
    document.addEventListener("keydown", moveCat);

    document.addEventListener("keyup", function (e) {
        if (e.code === "Enter" && gameOver && !restartPressed) {
            restartPressed = true;
            window.location.reload();
        }
    });
};

function setBoardSize() {
    boardWidth = window.innerWidth;
    boardHeight = window.innerHeight * 0.8;
    board.width = boardWidth;
    board.height = boardHeight;

    catY = boardHeight - catHeight;
    cat.y = Math.min(cat.y || catY, catY);
    yarnY = boardHeight - yarnHeight;
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) return;

    context.clearRect(0, 0, boardWidth, boardHeight);

    // gravity
    velocityY += gravity;
    catY = boardHeight - cat.height;
    cat.y = Math.min(cat.y + velocityY, catY);
    context.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);

    // move and draw yarn
    for (let i = 0; i < yarnArray.length; i++) {
        let yarnBall = yarnArray[i];
        yarnBall.x += velocityX;
        yarnBall.y = boardHeight - yarnBall.height;

        context.drawImage(yarnBall.img, yarnBall.x, yarnBall.y, yarnBall.width, yarnBall.height);

        if (detectCollision(cat, yarnBall)) {
            gameOver = true;

            // stop background animation
            document.querySelectorAll(".scrolling-image").forEach(el => {
                el.style.animation = "none";
            });

            clearInterval(speedTimer); // stop speed ramp

            context.fillStyle = "black";
            context.font = "40px Courier";
            context.fillText("Game Over: 'Enter' to Restart", boardWidth / 6, boardHeight * 0.6);
        }
    }

    // increment score every 200ms
    if (Date.now() - lastScoreTime > 200) {
        score++;
        lastScoreTime = Date.now();
    }

    // score display
    context.fillStyle = "black";
    context.font = "30px Courier";
    context.fillText(score, 10, 30);

    // speed indicator display
    context.font = "24px Courier";
    context.fillText("Speed: x" + speedMultiplier.toFixed(2), boardWidth - 180, 30);
}

function moveCat(e) {
    if (gameOver) return;
    if ((e.code === "Space" || e.code === "ArrowUp") && cat.y === catY) {
        velocityY = -11;
    }
}

function placeYarn() {
    let yarnBall = {
        img: null,
        x: boardWidth,
        y: yarnY,
        width: null,
        height: yarnHeight
    };

    let chance = Math.random();
    if (chance > 0.9) {
        yarnBall.img = yarn3Img;
        yarnBall.width = yarn3Width;
    } else if (chance > 0.7) {
        yarnBall.img = yarn2Img;
        yarnBall.width = yarn2Width;
    } else if (chance > 0.5) {
        yarnBall.img = yarn1Img;
        yarnBall.width = yarn1Width;
    }

    if (yarnBall.img) {
        yarnArray.push(yarnBall);
    }

    if (yarnArray.length > 5) {
        yarnArray.shift();
    }
}

function increaseSpeed() {
    if (gameOver) {
        clearInterval(speedTimer);
        return;
    }

    speedMultiplier += 0.05;
    velocityX = -8 * speedMultiplier;
}

function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}