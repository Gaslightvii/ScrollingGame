/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/
// Declare all variables
var gameChar_x;
var gameChar_y;

var floorPos_y;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var collectables;
var canyons;
var trees_x;
var treePos_y;
var cloud_x;
var cloud_y;
var cloud_minX;
var cloud_maxX;
var cloud_xPosChange;
var mountain_x;
var mountain_y;

var game_score;
var flagpole;
var lives;
var playing;
var randomValue;
var startTimer;
var timer;
var invincible;
var invincibleTimer;
var invincibleDuration;

var red;
var green;
var blue;
var colour;

var cameraPosX;

var jumpSound;
var endSound;
var coinSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    endSound = loadSound('assets/end.mp3');
    endSound.setVolume(0.2);
    
    coinSound = loadSound('assets/coin.wav');
    coinSound.setVolume(0.2);
}

function Enemy(x, speed)
{
    this.x = x;
    this.y = floorPos_y - 25;
    this.speed = speed || 2;
    
    this.drawEnemy = function()
    {
        fill(255);
        ellipse(this.x, this.y, 30);
    };
    
    this.move = function()
    {
        this.x += this.speed;
        if (this.x > 2500 || this.x < -1850)
        {
            this.speed *= -1;
        }
    };
}

var enemies = [];
var invincible = false;
var invincibleTimer = 0;
var invincibleDuration = 2000; // 2 seconds of invincibility

function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    playing = false; 
    startGame();
    
    for(var i = 0; i < 5; i++)
    {
        enemies.push(new Enemy(random(-1800, 0), random(1, 3)));
    }

}

function draw()
{
    // Sky
    red = 100;
    green = 155;
    blue = 255;
    background(red, green, blue); 

    // Ground
    noStroke();
    fill(0,155,0);
    rect(0, floorPos_y, width, height - floorPos_y); 
    
    // Scrolling
    push();
    translate(-cameraPosX, 0);
    
    // Clouds
    drawClouds();
    
    // Mountains
    drawMountains();

    // Trees
    drawTrees();
    
    // Enemies
    for(var m = 0; m < enemies.length; m ++)
    {
        enemies[m].drawEnemy();
        enemies[m].move();
    }
    
    
    // Collectable
    for (var j = 0; j < collectables.length; j++)
    {
        drawCollectable(collectables[j]);
    }
    
    // Canyon
    for (var k = 0; k < canyons.length; k++)
    {
        drawCanyon(canyons[k]);
    }
    if(playing)
    {
        timer = int((millis() - startTimer) / 1000);
        fill(255);
        strokeWeight(2);
        stroke(0);
        
        textSize(15);
        text("Score: " + game_score, cameraPosX + 20, 20);
        text("Lives: " + lives, cameraPosX + 20, 40);
        text("Time: " + timer, cameraPosX + 20, 60);
        noStroke();
    }
    // Game character
    // Jumping left
    if (isLeft && isFalling)
    {
        cameraPosX -= 3;
        // Head 
        noStroke();
        fill(255,192,203);
        ellipse(gameChar_x, gameChar_y - 60, 15, 30);
        // Eyes
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 60, 2, 2);

        // Body
        fill(255, 0, 0);
        rect(gameChar_x - 6.5, gameChar_y - 45, 13, 30);
        // Arms
        fill(0, 0, 255);
        rect(gameChar_x - 10, gameChar_y - 42, 10, 15);

        // Feet
        fill(0);
        rect(gameChar_x - 2, gameChar_y - 15, 10, 8);
        rect(gameChar_x - 14, gameChar_y - 20, 10, 8);
        
        gameChar_x -= 3;
    }
    
    // Jumping right
    else if (isRight && isFalling)
    {
        cameraPosX += 3;
        // Head 
        fill(255,192,203);
        ellipse(gameChar_x, gameChar_y - 60, 15, 30);
        // Eyes
        fill(0);
        ellipse(gameChar_x + 5, gameChar_y - 60, 2, 2);

        // Body
        fill(255, 0, 0);
        rect(gameChar_x - 6.5, gameChar_y - 45, 13, 30);
        // Arms
        fill(0, 0, 255);
        rect(gameChar_x, gameChar_y - 42, 10, 15);

        // Feet
        fill(0);
        rect(gameChar_x + 5, gameChar_y - 20, 10, 8);
        rect(gameChar_x - 8, gameChar_y - 15, 10, 8);
        
        gameChar_x += 3;
    }
    
    // Walking left
    else if (isLeft)
    {
        cameraPosX -= 3;
        // Head 
        fill(255,192,203);
        ellipse(gameChar_x, gameChar_y - 50, 15, 30);
        // Eyes
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 50, 2, 2);

        // Body
        fill(255, 0, 0);
        rect(gameChar_x - 6.5, gameChar_y - 35, 13, 30);
        // Arms
        fill(0, 0, 255);
        rect(gameChar_x - 10, gameChar_y - 32, 10, 15);

        // Feet
        fill(0);
        rect(gameChar_x - 2, gameChar_y - 5, 10, 8);
        rect(gameChar_x - 14, gameChar_y - 10, 10, 8);
        
        gameChar_x -= 3;
    }
    
    // Walking right
    else if (isRight)
    {
        cameraPosX += 3;
        // Head 
        fill(255,192,203);
        ellipse(gameChar_x, gameChar_y - 50, 15, 30);
        // Eyes
        fill(0);
        ellipse(gameChar_x + 5, gameChar_y - 50, 2, 2);

        // Body
        fill(255, 0, 0);
        rect(gameChar_x - 6.5, gameChar_y - 35, 13, 30);
        // Arms
        fill(0, 0, 255);
        rect(gameChar_x, gameChar_y - 32, 10, 15);

        // Feet
        fill(0);
        rect(gameChar_x + 5, gameChar_y - 10, 10, 8);
        rect(gameChar_x - 8, gameChar_y - 5, 10, 8);
        
        gameChar_x += 3;
    }
    
    // Jumping forward
    else if (isFalling || isPlummeting)
    {
        // Head 
        fill(255,192,203);
        ellipse(gameChar_x, gameChar_y - 60, 30, 30);
        // Eyes
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 60, 2, 2);
        ellipse(gameChar_x + 5, gameChar_y - 60, 2, 2);

        // Body
        fill(255, 0, 0);
        rect(gameChar_x - 13, gameChar_y - 45, 26, 30);
        // Arms
        fill(0, 0, 255);
        rect(gameChar_x - 20, gameChar_y - 42, 10, 15);
        rect(gameChar_x + 10, gameChar_y - 42, 10, 15);

        // Feet
        fill(0);
        rect(gameChar_x + 2, gameChar_y - 15, 10, 8);
        rect(gameChar_x - 12, gameChar_y - 15, 10, 8);
    }
    
    // Standing
    else
    {
        // Head 
        fill(255,192,203);
        ellipse(gameChar_x, gameChar_y - 50, 30, 30);
        // Eyes
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 50, 2, 2);
        ellipse(gameChar_x + 5, gameChar_y - 50, 2, 2);

        // Body
        fill(255, 0, 0);
        rect(gameChar_x - 13, gameChar_y - 35, 26, 30);
        // Arms
        fill(0, 0, 255);
        rect(gameChar_x - 20, gameChar_y - 32, 10, 15);
        rect(gameChar_x + 10, gameChar_y - 32, 10, 15);

        // Feet
        fill(0);
        rect(gameChar_x + 2, gameChar_y - 5, 10, 8);
        rect(gameChar_x - 12, gameChar_y - 5, 10, 8);
    }
    
    renderFlagpole();
    checkPlayerDie();
    pop();

    // Interaction Code
    // Plummeting
    for (var i = 0; i < canyons.length; i++)
    {
        if (gameChar_x >= canyons[i].x_pos && gameChar_x < canyons[i].x_pos + canyons[i].width && gameChar_y >= floorPos_y)
        {
            isPlummeting = true;
            playing = false;
        }
    }
    
    if (isPlummeting)
    {
        gameChar_y += 3;
        
    }
    
    // Falling
    if (gameChar_y < floorPos_y)
    {
        isFalling = true;
        gameChar_y += 2;
    }
    
    if (gameChar_y == floorPos_y)
    {
        gameChar_y = floorPos_y;
        isFalling = false;
    }
    
    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }
    
    for (var l = 0; l < collectables.length; l++)
    {
        if (!collectables[l].isFound && dist(gameChar_x, gameChar_y, collectables[l].x_pos, collectables[l].y_pos) < 15)
        {
            collectables[l].isFound = true;
            game_score += 1;
            coinSound.play();
        }
    }
    
    
    for (var n = 0; n < enemies.length; n++)
    {
        if(!invincible)
        {
            // Define player bounding box
            const playerX = gameChar_x;
            const playerY = gameChar_y;
            const playerWidth = 30; 
            const playerHeight = 30; 

            // Define enemy bounding box
            const enemyX = enemies[n].x;
            const enemyY = enemies[n].y;
            const enemyWidth = 30; 
            const enemyHeight = 30; 

            // Check for collision
            if (collideRectRect(playerX, playerY, playerWidth, playerHeight, enemyX, enemyY, enemyWidth, enemyHeight)) 
            {
                lives -= 1;
                invincible = true;
                invincibleTimer = millis();
            }
            
        }
        
    }
    
    if(invincible)
    {
        if (millis() - invincibleTimer > invincibleDuration)
        {
            invincible = false;
        }
    }
    
    
    if(flagpole.isReached == true)
    {
        noStroke();
        textSize(32);
        textAlign(CENTER);
        
        fill(0, 255, 0); 
        text("Level complete!", width / 2, 100);
        
        fill(255, 0, 255); 
        text("Score: " + game_score, width / 2, 150);
        
        fill(0, 255, 255); 
        text("Time: " + timer + " seconds", width / 2, 200);
        
        fill(255, 0, 0);
        text("Press space to start again.", width / 2, 250);
        
        if (keyCode == 32)
        {
            startGame();
        }
    }
    
    if (lives <= 0)
    {
        endGame();
    }
    
    
    
        
}

    

function keyPressed()
{
    
    if(playing)
    // Controls the animation of the character when keys are pressed
    // 'A'
    {
        if (keyCode == 65)
        {
            isLeft = true;
        }
    
        // 'D'
        else if (keyCode == 68)
        {
            isRight = true;
        }

        // 'W'
        else if (keyCode == 87 && !isFalling && !isPlummeting)
        {
            isFalling = true;
            gameChar_y -= 100;
            jumpSound.play();
        }
    }
}

function keyReleased()
{
    // Control the animation of the character when keys are released
    if (keyCode == 65)
    {
        isLeft = false;
    }
    
    else if (keyCode == 68)
    {
        isRight = false;
    }
}

function drawClouds()
{   
    noStroke();
    colour = 255;
    
    for (var i = 0; i < cloud_x.length; i++)
    {
        // Moves clouds left and right
        if (cloud_x[i] < cloud_minX)
        {
            cloud_xPosChange[i] *= -1;
        }
        else if (cloud_x[i] > cloud_maxX)
        {
            cloud_xPosChange[i] *= -1;
        }
        cloud_x[i] += cloud_xPosChange[i];
        
        // Draws clouds
        fill(colour);
        ellipse(cloud_x[i], cloud_y[i], 80, 80);
        ellipse(cloud_x[i] + 40, cloud_y[i], 60, 60);
        ellipse(cloud_x[i] - 40, cloud_y[i], 60, 60);
        
        // Changes colour of clouds
        colour -= 255 / cloud_x.length;
    }
}

function drawMountains()
{
    for (var i = 0; i < mountain_x.length; i++)
    {
        stroke(105, 105, 105);
        fill(192, 192, 192);
        triangle(
            mountain_x[i] + 110, mountain_y + 332, 
            mountain_x[i] + 210, mountain_y + 156, 
            mountain_x[i] + 310, mountain_y + 332
        );
        
        fill(255, 250, 250);
        triangle(
            mountain_x[i] + 195, mountain_y + 182, 
            mountain_x[i] + 210, mountain_y + 156, 
            mountain_x[i] + 225, mountain_y + 182
        );
    }
}

function drawTrees()
{
    for (var i = 0; i < trees_x.length; i++)
    {
        stroke(139, 69, 19);
        fill(120, 100, 40);
        rect(trees_x[i], treePos_y, 20, 50);

        // branches
        stroke(0, 100, 0);
        fill(34, 139, 34);
        triangle(
            trees_x[i] - 30, treePos_y + 25, 
            trees_x[i] + 10, treePos_y - 25, 
            trees_x[i] + 50, treePos_y + 25
        );
        
        triangle(
            trees_x[i] - 25, treePos_y, 
            trees_x[i] + 10, treePos_y - 50, 
            trees_x[i] + 45, treePos_y
        );
        
        triangle(
            trees_x[i] - 20, treePos_y - 25, 
            trees_x[i] + 10, treePos_y - 75, 
            trees_x[i] + 40, treePos_y - 25
        );
    }
}

function drawCollectable(t_collectable)
{
    checkCollectable(t_collectable);
}

function checkCollectable(t_collectable)  
{
        
    if (!t_collectable.isFound)
    {
        stroke(184, 134, 11);
        fill(255, 215, 0);
        ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size, t_collectable.size);
    }
}

function drawCanyon(t_canyon)
{
    checkCanyon(t_canyon);
}

function checkCanyon(t_canyon)
{
    noStroke();
    fill(139, 69, 19);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, 200);
}



function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(100);
    line(flagpole.x_pos, floorPos_y, 
        flagpole.x_pos, floorPos_y -150);
    noStroke();
    
    if(flagpole.isReached)
    {
        fill(50, 255, 50);
        triangle(flagpole.x_pos, floorPos_y -100,
            flagpole.x_pos + 50, floorPos_y -125,
            flagpole.x_pos, floorPos_y - 150);
        
        
    }
    
    else
    {
        fill(255, 50, 50);
        triangle(flagpole.x_pos, floorPos_y -100,
            flagpole.x_pos + 50, floorPos_y -125,
            flagpole.x_pos, floorPos_y - 150);
    }
    
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_x - flagpole.x_pos);
    if(d < 15)
    {
        flagpole.isReached = true;
        playing = false;
        endSound.play();
    }
    
}

function checkPlayerDie()
{
    var d = (floorPos_y - gameChar_y);
    if(d < -200)
    {
        if (lives > 1) 
        {
            resetGame();
            lives -= 1;
        } 
        else 
        {
            lives = 0;
            endGame();
        }
    }
}

function startGame()
{
    gameChar_x = width / 2;
    gameChar_y = floorPos_y;
    lives = 3;
    playing = true;
    // Initialize variables
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    timer = 0
    startTimer = millis();
    
    
    collectables = [
        {x_pos: -1340, y_pos: floorPos_y - 100, size: 15, isFound: false}, 
        {x_pos: -800, y_pos: floorPos_y, size: 15, isFound: false}, 
        {x_pos: -640, y_pos: floorPos_y, size: 15, isFound: false}, 
        {x_pos: -340, y_pos: floorPos_y, size: 15, isFound: false}, 
        {x_pos: -170, y_pos: floorPos_y, size: 15, isFound: false}, 
        {x_pos: -50, y_pos: floorPos_y - 20, size: 15, isFound: false}, 
        {x_pos: 40, y_pos: floorPos_y, size: 15, isFound: false}, 
        {x_pos: 340, y_pos: floorPos_y, size: 15, isFound: false}, 
        {x_pos: 440, y_pos: floorPos_y, size: 15, isFound: false},
        {x_pos: 540, y_pos: floorPos_y, size: 15, isFound: false},
        {x_pos: 640, y_pos: floorPos_y, size: 15, isFound: false},
        {x_pos: 740, y_pos: floorPos_y, size: 15, isFound: false},
        {x_pos: 840, y_pos: floorPos_y - 50, size: 15, isFound: false},
        {x_pos: 1340, y_pos: floorPos_y, size: 15, isFound: false}, 
        {x_pos: 1540, y_pos: floorPos_y, size: 15, isFound: false}, 
        {x_pos: 1640, y_pos: floorPos_y - 100, size: 15, isFound: false}];
    
    canyons = [{x_pos: -1850, width: 500}, 
              {x_pos: -480, width: 100}, 
              {x_pos: -300, width: 90}, 
              {x_pos: -50, width: 80}, 
              {x_pos: 100, width: 100}, 
              {x_pos: 800, width: 50}, 
              {x_pos: 1000, width: 130},
              {x_pos: 2100, width: 500}]; 
    
    trees_x = [-1350, -1300, -1270, -1200, -1150, -1100, -750, -500, -150, 200, 250, 400, 600, 900, 1150, 1500, 1800, 1850];
    treePos_y = floorPos_y - 50;
    
    cloud_x = [-1850, -1600, -1200, -800, -450, -200, -50, 200, 400, 525, 760, 930, 1040, 1125, 1900, 2000];
    cloud_y = [];
    
    
    // Sets cloud y pos to random value in the sky
    for (var i = 0; i < cloud_x.length; i++)
    {
        cloud_y.push(Math.floor(Math.random() * (floorPos_y - 200) + 50));
    }
    
    // Sets max and min cloud x position
    cloud_minX = -2200;
    cloud_maxX = 2700;
    cloud_xPosChange = [];
    
    // Sets random speed for cloud movement
    for (var j = 0; j < cloud_x.length; j++) 
    {
        cloud_xPosChange.push(Math.random() * 2 - 1);
    }
    
    // Sets random x value for mountains
    mountain_x = [];
    for (var k = 0; k < 10; k++)
    {
        randomValue = random(-1100, 1500);
        mountain_x.push(randomValue);
    }
    mountain_y = 100;
    
    
    // Sets RGB colours 
    red = 0;
    green = 0;
    blue = 0;
    
    cameraPosX = 0;
    
    game_score = 0;
    flagpole = {isReached: false, x_pos: 1900};
}

function resetGame()
{
    if(lives < 1)
    {
        endGame();
    }
    
    else if (flagpole.isReached == false)
    {
        gameChar_x = width / 2;
        gameChar_y = floorPos_y;

        cameraPosX = 0;
        playing = true;
        // Initialize variables
        isLeft = false;
        isRight = false;
        isFalling = false;
        isPlummeting = false;
        invincible = false;
        invincibleTimer = 0;
    }
    
    
}

function endGame()
{
    if(flagpole.isReached == false)
    {
    playing = false;
    fill(255, 0, 0);
    noStroke();
    textSize(32);
    textAlign(CENTER);
    text("Game Over", cameraPosX + 500, 200);
    text("Press space to continue", cameraPosX + 500, 250);
    }
    
    
    if (keyCode == 32)
    {
        startGame();
    }
    
}


function collideRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  // Using the Separating Axis Theorem
  if (x1 + w1 < x2 || x2 + w2 < x1) return false;
  if (y1 + h1 < y2 || y2 + h2 < y1) return false;
  return true;
}
