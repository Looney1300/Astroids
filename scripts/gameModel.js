MyGame.gameModel = function(gameSpecs){
    let that = {};
    //Unpacking gameSpecs
    let ship = gameSpecs.ship;
    let ball = gameSpecs.ball;
    let colorList = gameSpecs.colorList;
    let background = gameSpecs.background;
    let menuBackground = gameSpecs.menuBackground;

    let CANVASWIDTH = 1600;
    let CANVASHEIGHT = 1000;

    let graphics = MyGame.graphics;
    let particleSystem = MyGame.particleSystem;

    let countDownMode = true;
    
    let score = 0;
    let lives = 0;
    let levelCount = 1;
    
    let top5 = MyGame.persistence.retrieveHighScores();
    
    //Menu Screen
     //button list for menu screen: same components as a rectangle.
    let menuButton = {
        x: 1/5 * CANVASWIDTH,
        width: 3/5 * CANVASWIDTH,
        height: CANVASHEIGHT/6,
        fillStyle: 'rgba(0, 0, 255, .6)',
        strokeStyle: 'rgba(0, 0, 175, .6)'
    };

    let textList = [{text: '- N E W  G A M E -', font: '4.5em Courier', fillStyle: colorList[0].stroke, fill: true, stroke: true, strokeStyle: 'rgba(220,220,220,1)', align: 'center', baseline: 'middle'},
    {text: '- H I G H  S C O R E S -', font: '3.6em Courier', fillStyle: colorList[0].stroke, fill: true, stroke: true, strokeStyle: 'rgba(220,220,220,1)', align: 'center', baseline: 'middle'},
    {text: '- C R E D I T S -', font: '3.5em Courier', fillStyle: colorList[0].stroke, fill: true, stroke: true, strokeStyle: 'rgba(220,220,220,1)', align: 'center', baseline: 'middle'}
    ];

    let creditText = {
        text: '- Created By Landon Henrie -',
        font: '4em Courier', 
        fillStyle: colorList[2].fill, 
        fill: true, 
        align: 'center', 
        baseline: 'middle',
        x: CANVASWIDTH/2,
        y: CANVASHEIGHT/2
    };

    let highScoreText = {
        text: '- High Scores -',
        font: '7em Courier', 
        fill: true, 
        fillStyle: colorList[2].stroke, 
        stroke: true,
        strokeStyle: colorList[2].fill, 
        align: 'center', 
        baseline: 'top',
        x: CANVASWIDTH/2,
        y: 30
    };

    let clearHighScoresMessage = {
        text: 'Press \'c\' to clear the high scores.',
        font: '2em Courier', 
        fill: true, 
        fillStyle: colorList[1].stroke, 
        align: 'center', 
        baseline: 'bottom',
        x: CANVASWIDTH/2,
        y: CANVASHEIGHT - 30
    };

    let top5Graphics = [];
    
    let menu = {
        background: menuBackground,
        button: menuButton,
        rows: 3,
        gap: CANVASHEIGHT/8,
        textList: textList,
    };
    
    let levelTrack = {
        text: 'Level '+ levelCount, 
        font: '2em New-Courier', 
        fillStyle: 'rgba(220, 220, 220, .2)', 
        fill: true, 
        stroke: true, 
        strokeStyle: 'rgba(255, 255, 255, 1)', 
        align: 'left', 
        baseline: 'bottom',
        x: 30,
        y: CANVASHEIGHT - 5
    };

    let gameScore = {
        text: 'Score: '+ score, 
        font: '2em New-Courier', 
        fillStyle: 'rgba(220, 220, 220, .2)', 
        fill: true, 
        stroke: true, 
        strokeStyle: 'rgba(255, 255, 255, 1)', 
        align: 'right', 
        baseline: 'bottom',
        x: 300,
        y: CANVASHEIGHT - 5
    };

    let countDown = {
        time: 0,
        text: '0',
        font: '30em New-Courier', 
        fillStyle: 'rgba(230, 230, 230, .8)', 
        fill: true, 
        align: 'center', 
        baseline: 'middle',
        x: CANVASWIDTH/2,
        y: CANVASHEIGHT/2
    }
    
    let astroids = [];
    let ballGraphicsList = [];
    
    //Game graphics members
    let menuGraphic = graphics.Menu(menu);
    let credits = graphics.Letters(creditText);
    let highScores = graphics.Letters(highScoreText);
    let menuBack = graphics.Background(menuBackground);
    let clearScoresGraphic = graphics.Letters(clearHighScoresMessage);
    
    let back = graphics.Background(background);
    let levelTracker = graphics.Letters(levelTrack);
    let gameScoreDisplay = graphics.Letters(gameScore);
    let countDownGraphic = graphics.Letters(countDown);
    let livesGraphicsList = [];

    let restartLives = function(){
        lives = 3;        
        livesGraphicsList.length = 0;
        for (let i=0; i<lives-1; ++i){
            livesGraphicsList.push(graphics.Rectangle({
                rotation: 0,
                x: CANVASWIDTH - (i+1)*100, 
                y: CANVASHEIGHT - 30,
                width: CANVASWIDTH/20,
                height: CANVASHEIGHT/80,
                fillStyle: paddle.fillStyle,
                strokeStyle: paddle.strokeStyle
            }));
        }
    }

    let updateTop5Graphics = function(){
        top5Graphics.length = 0;
        for (let i=0; i<top5.length; ++i){
            top5Graphics.push(graphics.Letters({
                text: '' + (i + 1) + '. ' + top5[i],
                font: '5em Courier', 
                fill: true, 
                fillStyle: colorList[2].fill, 
                align: 'left', 
                baseline: 'top',
                x: CANVASWIDTH/2 - 180,
                y: 200 + 150*i 
            }));
        }
    }

    updateTop5Graphics();

    let drawGame = function(){
        graphics.clear();
        back.draw();
        levelTracker.draw();
        gameScoreDisplay.draw();
        particleSystem.render();
        for (let i=0; i<livesGraphicsList.length; ++i){
            livesGraphicsList[i].draw();
        }
        for (let i=0; i<ballGraphicsList.length; ++i){
            ballGraphicsList[i].draw();
        }
        countDownGraphic.draw();
        //TODO
        //border.draw
    }
    
    let drawMenu = function(){
        graphics.clear();
        menuGraphic.draw();
    }

    let drawCredits = function(){
        graphics.clear();
        menuBack.draw();
        credits.draw();
    }

    let drawHighScores = function(){
        graphics.clear();
        menuBack.draw();
        highScores.draw();
        for (let i=0; i<top5Graphics.length; ++i){
            top5Graphics[i].draw();
        }
        clearScoresGraphic.draw();
    }

    //START - beginning draw
    that.drawGame = drawMenu;

    let countDownUpdate = function(elapsedTime){
        countDown.time += elapsedTime;
        if (countDown.time < 1000){
            countDown.text = '3';
        }
        else if (countDown.time < 2000){
            countDown.text = '2';
        }
        else if (countDown.time < 3000){
            countDown.text = '1';
        }else{
            countDown.text = '';
            countDown.time = 0;
            that.updateGame = gameModelUpdate;
            countDownMode = false;
        }
    }
    
    let menuUpdate = function(elapsedTime){ }
    
    let gameModelUpdate = function(elapsedTime){
        updateCollisions();
        particleSystem.update();
    }
    
    //START - beginning update
    that.updateGame = menuUpdate;
    
    function detectCollisions(){

    }

    function detectCollisionWithShip(ship){
        paddleCenterX = paddle.x + 1/2 * paddle.width;
        paddleX1 = paddle.x;
        paddleY1 = paddle.y;
        paddleX2 = paddle.x + paddle.width;
        paddleY2 = paddle.y + paddle.height;
        ballX1 = ship.centerX - ship.radius;
        ballY1 = ship.centerY - ship.radius;
        ballX2 = ship.centerX + ship.radius;
        ballY2 = ship.centerY + ship.radius;

        if (paddleX1 < ballX2 && paddleX2 > ballX1 && ship.yRate > 0){
            if (paddleY1 < ballY2 && paddleY2 > ballY1){
                let weight = 2 * (paddleCenterX - ship.centerX)/(paddle.width);
                ship.xRate += paddle.reflectance * weight * ship.rate * -1;
                ship.yRate *= -1;
            }
        }
    }

    function detectCollisionWithMissiles(ship){
        if (ship.centerX - ship.radius <= 0 && ship.xRate < 0){
            ship.xRate *= -1;
        }
        if (ship.centerY - ship.radius <= 0 && ship.yRate < 0){
            ship.yRate *= -1;
        }
        return true;
    }

    function restartShip(){
        ship.x = ship.x0;
        ship.width = ship.width0;
        ship.height = ship.height0;
    }

    function newGame(){
        restartShip();
        level = breakerMaker.generateLevel(gameWidthInBricks0, gameHeightInBricks0, colorList);
        level.gapAbove = gapAbove;
        brickLevel = graphics.BrickLevel(level);
        restartLives();
        levelCount = 1;
        score = 0;
        gameScore.text = "Score: " + score;
        that.drawGame = drawGame;
        that.updateGame = countDownUpdate;
        countDownMode = true;
        console.log('New Game Starting');
    }

    function nextLevel(){
        gameWidthInBricks += 3;
        gameHeightInBricks += 1;
        brickUnit = CANVASWIDTH/gameWidthInBricks;
        level = breakerMaker.generateLevel(gameWidthInBricks, gameHeightInBricks, colorList);
        level.gapAbove = gapAbove;
        brickLevel = graphics.BrickLevel(level);
        that.updateGame = countDownUpdate;
        countDownMode = true;

        particleEffectGraphics.length = 0;
        particleEffects.length = 0;
        score += 37*lives;
        score += 100;
        gameScore.text = "Score: " + score;
        ++levelCount;
        levelTrack.text = "Level " + levelCount;
        restartLives();
        restartShip();
        ballList.length = 1;
        ballGraphicsList.length = 0;
        restartBall();
        console.log('Level ' + levelCount );
    }

    function updateCollisions(){
        for (let i=0; i<ballList.length; ++i){
            if (ballList[i].centerY < gapAbove + 2/5 * brickUnit * (gameHeightInBricks + 1) + ballList[i].radius){
                if (detectCollisionWith(ballList[i])){ 
                    if (level.brickList.length === 0){
                        nextLevel();
                        return;
                    }
                }
            }else if (ballList[i].centerY > CANVASWIDTH - paddle.gapBelowPaddle - paddle.width*brickUnit){
                detectCollisionWithShip(ballList[i]);
            }
            if (!detectCollisionWithMissiles(ballList[i])){
                if (ballList.length === 1){
                    --lives;
                    livesGraphicsList.pop();
                    restartBall(ball, paddle);
                    that.updateGame = countDownUpdate;
                    countDownMode = true;
                    if (lives <= 0){
                        top5.push(score);
                        top5.sort(function(a,b){return b-a;})
                        top5.splice(5, 1);
                        for (let x=0; x<top5.length; ++x){
                            MyGame.persistence.remove(x);
                            MyGame.persistence.add(x, top5[x]);
                        }
                        top5 = MyGame.persistence.retrieveHighScores();
                        updateTop5Graphics();
                        that.updateGame = menuUpdate;
                        that.drawGame = drawMenu;
                    }
                }else{
                    ballList.splice(i,1);
                    ballGraphicsList.splice(i,1);
                }
            }
        }
    }
    
    function updateBalls(elapsedTime){
        for (let i=0; i<ballList.length; ++i){
            ballList[i].centerX += ballList[i].xRate * elapsedTime/1000;
            ballList[i].centerY += ballList[i].yRate * elapsedTime/1000;
        }
    }

    function isInRightBound(object){
        return (object.x + object.width) < CANVASWIDTH;
    }

    function isInLeftBound(object){
        return object.x > 0;
    }

    that.movePaddleRight = function(elapsedTime){
        if (isInRightBound(paddle)){
            paddle.x += elapsedTime/1000 * paddle.rate;
            if (countDownMode){
                ballList[0].centerX += elapsedTime/1000 * paddle.rate;
            }
        }
    }
    
    that.movePaddleLeft = function(elapsedTime){
        if (isInLeftBound(paddle)){
            paddle.x -= elapsedTime/1000 * paddle.rate;
            if (countDownMode){
                ballList[0].centerX -= elapsedTime/1000 * paddle.rate;
            }
        }
    }

    that.menuSelection = function(e){
        if (lives === 0){
            let x = 0;
            let y = 0;
            //The following if/else statement from 
            // https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
            if (e.x || e.y) { 
                x = e.x;
                y = e.y;
            } else { 
                x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
                y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
            } 

            let buttonId = menuGraphic.isCoordinateOnButton({x: x, y: y});
            if (buttonId === 1){
                newGame();
            }else if (buttonId === 2){
                that.drawGame = drawHighScores;
                lives = -1;
            }else if (buttonId === 3){
                that.drawGame = drawCredits;
                lives = -1;
            }
        }
        else if (lives === -1){
            that.drawGame = drawMenu;
            lives = 0;
        }
    }

    that.escape = function(){
        lives = 0;
        that.gameUpdate = menuUpdate;
        that.drawGame = drawMenu;
        for (let i=0; i<ballList.length; ++i){
            ballList[i].xRate = 0;
            ballList[i].yRate = 0;
        }
    }

    that.clearHighScores = function(){
        for (let x=0; x<top5.length; ++x){
            MyGame.persistence.remove(x);
        }
        top5.length = 0;
        updateTop5Graphics();
    }

    return that;
};