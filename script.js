// board variables
let board;
let boardWidth = 1500;
let boardHeight = 515;
let context;

// cat variables
let catWidth = 118;  // 88
let catHeight = 114; //94
let catX = 50;
let catY = boardHeight - catHeight; // 515-114=401
let catImg;

let cat = {
    x: catX,
    y: catY,
    width: catWidth,
    height: catHeight
}

// yarn balls
let yarnArray = [];

let yarn1Width = 68;
let yarn2Width = 99;
let yarn3Width = 132;

let yarnHeight = 70;
let yarnX = 1500;
let yarnY = boardHeight - yarnHeight; 

let yarn1Img;
let yarn2Img;
let yarn3Img;


// physics variables
let velocityX = -8; //  yarn ball moving speed
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;


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

    yarn1Img = new Image();
    yarn1Img.src = "./img/yarnBall1.png";

    yarn2Img = new Image();
    yarn2Img.src = "./img/yarnBall2.png";

    yarn3Img = new Image();
    yarn3Img.src = "./img/yarnBall3.png";

    requestAnimationFrame(update);
    setInterval(placeYarn, 1500);    // 1.5 second
    document.addEventListener("keydown", moveCat);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    // clear board
    context.clearRect(0, 0, boardWidth, boardHeight);

    // cat
    velocityY += gravity;
    cat.y = Math.min(cat.y + velocityY, catY); //  apply gravity to cat.y so it doesn't exceed the ground
    context.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);

    // yarn balls
    for (let i = 0; i < yarnArray.length; i++) {
        let yarnBall = yarnArray[i];
        yarnBall.x += velocityX;
        context.drawImage(yarnBall.img, yarnBall.x, yarnBall.y, yarnBall.width, yarnBall.height);

        if (detectCollision(cat, yarnBall)) {
            gameOver = true;
            document.getElementById("scrolling-image").style.animation = "none";
              context.fillText("Game Over: 'Enter' to Restart", boardWidth/7, boardHeight*5/8);
              document.addEventListener('keyup', function(e) {
                  if (e.code == 'Enter') {
                      window.location.reload();
                  }
                })
          }
    }


    // score
    context.fillStyle="black";
    context.font="30px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveCat(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && cat.y == catY) {
        // jump
        velocityY = -11;
    }
    
}

function placeYarn() {
    // place yarn
    let yarnBall = {
        img: null,
        x: yarnX,
        y: yarnY,
        width: null,
        height: yarnHeight,
    };

    let placeYarnChance = Math.random();    // number between 0 - 0.999999...

    // 50% chance of getting a yarn
  if (placeYarnChance > 0.9) {
    // 10% chance you get yarn ball 3
    yarnBall.img = yarn3Img;
    yarnBall.width = yarn3Width;
    yarnArray.push(yarnBall);
  } else if (placeYarnChance > 0.7) {
    // 30% chance you get yarn ball 2
    yarnBall.img = yarn2Img;
    yarnBall.width = yarn2Width;
    yarnArray.push(yarnBall);
  } else if (placeYarnChance > 0.5) {
    // 50% chance you get yarn ball 1
    yarnBall.img = yarn1Img;
    yarnBall.width = yarn1Width;
    yarnArray.push(yarnBall);
  } 

  if (yarnArray.length > 5) {
    yarnArray.shift();  // remove 1st element from array so it doesn't constantly grow
  }
}

function detectCollision(a, b) {
    return (
        a.x < b.x + b.width && // a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x && // a's top right corner passes b's top left corner
        a.y < b.y + b.height && // a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y
      ); // a's bottom left corner passes b's top left corner
}