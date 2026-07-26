
// Gravity Flip runner



const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const finalScore = document.getElementById("finalScore");
const gameOverBox = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");

let score = 0;

let highScore =
Number(localStorage.getItem("gravityHighScore")) || 0;

highScoreText.textContent = highScore;


const FLOOR = 430;
const CEILING = 30;

let gameOver = false;

let backgroundX = 0;

let obstacleSpeed = 8;


const player = {

    x:120,

    y:FLOOR,

    width:40,

    height:40,

    velocityY:0,

    gravity:0.8,

    flipped:false,

    color:"gold"

};



let obstacles = [];

let topObstacle = false;

function createObstacle(){

    obstacles.push({

        x:canvas.width,

        y:topObstacle ? CEILING : FLOOR,

        width:45,

        height:45,

        top:topObstacle

    });

    topObstacle = !topObstacle;

}



let coins = [];

function createCoin(){

    const top = Math.random() > 0.8;

    coins.push({

        x:canvas.width,

        y:top ? 120 : 340,

        radius:10,

        collected:false

    });}

document.addEventListener("keydown",e=>{

    if(e.code==="Space" && !gameOver){

        player.flipped=!player.flipped;

        player.velocityY=0;

    }

    if(e.key==="r" || e.key==="R"){

        restartGame();

    }});

function updatePlayer(){

    if(player.flipped){

        player.velocityY -= player.gravity;

        player.y += player.velocityY;

        if(player.y<=CEILING){

            player.y=CEILING;

            player.velocityY=0;

        }

    }else{

        player.velocityY += player.gravity;

        player.y += player.velocityY;

        if(player.y>=FLOOR){

            player.y=FLOOR;

            player.velocityY=0;

        }

    }

}

function hit(a,b){

    return(

        a.x < b.x + b.width &&

        a.x + a.width > b.x &&

        a.y < b.y + b.height &&

        a.y + a.height > b.y

    );

}

function updateObstacles(){

    obstacles.forEach(obstacle=>{

        obstacle.x -= obstacleSpeed;

        if(hit(player,obstacle)){

            endGame();

        }

    });

    obstacles = obstacles.filter(

        obstacle=>obstacle.x+obstacle.width>0

    );

}

function updateCoins(){

    coins.forEach(coin=>{

        coin.x -= obstacleSpeed;

        if(

            !coin.collected &&

            player.x < coin.x + coin.radius &&

            player.x + player.width > coin.x - coin.radius &&

            player.y < coin.y + coin.radius &&

            player.y + player.height > coin.y - coin.radius

        ){

            coin.collected=true;

            score += 20;

        }

    });

    coins = coins.filter(

        coin=>coin.x+coin.radius>0 &&

        !coin.collected

    );

}

function updateScore(){

    score++;

    scoreText.textContent=score;

    obstacleSpeed=8+Math.floor(score/400);

    if(score>highScore){

        highScore=score;

        highScoreText.textContent=highScore;

        localStorage.setItem(

            "gravityHighScore",

            highScore

        );

    }

}

function drawBackground(){

    backgroundX -= obstacleSpeed * 0.3;

    if(backgroundX <= -canvas.width){

        backgroundX = 0;

    }

  
    ctx.fillStyle="#87CEEB";
    ctx.fillRect(0,0,canvas.width,canvas.height);

  
    ctx.fillStyle="white";

    for(let i=0;i<9;i++){

        let x=(i*220+backgroundX)%(canvas.width+220);

        ctx.beginPath();
        ctx.arc(x,70,25,0,Math.PI*2);
        ctx.arc(x+25,60,20,0,Math.PI*2);
        ctx.arc(x+50,70,25,0,Math.PI*2);
        ctx.fill();

    }

   
    ctx.fillStyle="#444";
    ctx.fillRect(0,0,canvas.width,20);


    ctx.fillStyle="#228B22";
    ctx.fillRect(0,470,canvas.width,30);

}

function drawPlayer(){

    ctx.fillStyle=player.color;

    ctx.fillRect(

        player.x,

        player.y,

        player.width,

        player.height

    );

}

function drawObstacles(){

    ctx.fillStyle="red";

    obstacles.forEach(obstacle=>{

        ctx.fillRect(

            obstacle.x,

            obstacle.y,

            obstacle.width,

            obstacle.height

        );

    });

}

function drawCoins(){

    ctx.fillStyle="gold";

    coins.forEach(coin=>{

        ctx.beginPath();

        ctx.arc(

            coin.x,

            coin.y,

            coin.radius,

            0,

            Math.PI*2

        );

        ctx.fill();

    });

}

function endGame(){

    if(gameOver) return;

    gameOver=true;

    finalScore.textContent=score;

    gameOverBox.style.display="block";

}

function restartGame(){

    score=0;

    obstacleSpeed=8;

    scoreText.textContent=0;

    player.y=FLOOR;

    player.velocityY=0;

    player.flipped=false;

    obstacles=[];

    coins=[];

    gameOver=false;

    gameOverBox.style.display="none";

    animate();

}

function animate(){

    if(gameOver){

        return;

    }

    requestAnimationFrame(animate);

    drawBackground();

    updatePlayer();

    updateObstacles();

    updateCoins();

    updateScore();

    drawCoins();

    drawObstacles();

    drawPlayer();

}

setInterval(()=>{

    if(!gameOver){

        createObstacle();

    }

},1000);

setInterval(()=>{

    if(!gameOver){

        createCoin();

        if(Math.random()>0.8){

            createCoin();

        }

    }

},700);

restartBtn.onclick=restartGame;

animate();