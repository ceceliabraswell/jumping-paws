// board variables
let board;
let boardWidth = 1500;
let boardHeight = 515;
let context;

// cat variables
let catWidth = 400;  // 88
let catHeight = 376; //94
let catX = 50;
let catY = 295;
let catImg;

let cat = {
    x: catX,
    y: catY,
    width: catWidth,
    height: catHeight
}

// physics variables
let velocityY = -8; //  yarn ball moving speed
let velocityX = 0;
let gravity = 0.4;


window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");   // draw board on screen

    // draw initial cat
    catImg = new Image();
    catImg.src = "./img/cat-running.png";
    catImg.onload = function () {
        context.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);
    }

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveCat);
}

function update() {
    requestAnimationFrame(update);

    // clear board
    context.clearRect(0, 0, boardWidth, boardHeight);

    // cat
    velocityY += gravity;
    cat.y = Math.min(cat.y + velocityY, catY); //  apply gravity to cat.y so it doesn't exceed the ground
    context.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);
}

function moveCat(e) {
    if ((e.code == "Space" || e.code == "ArrowUp") && cat.y == cat.y) {
        // jump
        velocityY = -10;
    }
}