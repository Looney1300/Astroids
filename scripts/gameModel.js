MyGame.gameModel = function(gameSpecs){
    let that = {};
    //Unpacking gameSpecs
    let ship = MyGame.components.Ship(gameSpecs.ship);
    let colorList = gameSpecs.colorList;
    let background = gameSpecs.background;
    let menuBackground = gameSpecs.menuBackground;
    let astroid = gameSpecs.astroid;
    let num_astroids0 = gameSpecs.num_astroids;
    function makeAstroids(){
        let astroidList = []
        for (let i=0; i<gameSpecs.num_astroids; ++i){
            astroidList.push(MyGame.components.Astroid(astroid));
        }
        return astroidList;
    }
    let astroids = makeAstroids();

    let missiles = [];

    let CANVASWIDTH = gameSpecs.canvas.width;
    let CANVASHEIGHT = gameSpecs.canvas.height;

    let graphics = MyGame.graphics;
    let particleSystem = MyGame.particleSystem;

    let countDownMode = true;
    let gameScoreIsShowing = false;
    
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
        font: '3em New-Courier', 
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
        font: '3em New-Courier', 
        fillStyle: 'rgba(220, 220, 220, .2)', 
        fill: true, 
        stroke: true, 
        strokeStyle: 'rgba(255, 255, 255, 1)', 
        align: 'left', 
        baseline: 'bottom',
        x: 250,
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
    let shipGraphic = graphics.Texture(ship);
    function makeAstroidsGList(){
        let astroidGList = []
        for (let i=0; i<astroids.length; ++i){
            astroidGList.push(graphics.Texture(astroids[i]));
        }
        return astroidGList;
    }
    let astroidGraphicsList = makeAstroidsGList();
    let missileGraphicsList = [];


    let restartLives = function(){
        lives = 3;        
        livesGraphicsList.length = 0;
        for (let i=0; i<lives-1; ++i){
            livesGraphicsList.push(graphics.Texture({
                imageSrc: gameSpecs.ship.src,
                rotation: 0,
                center: {x: CANVASWIDTH - 100*i - 50, y: CANVASHEIGHT - 50},
                width: gameSpecs.ship.width/2,
                height: gameSpecs.ship.width/2,
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

        for (let i=0; i<astroidGraphicsList.length; ++i){
            astroidGraphicsList[i].draw();
        }
        for (let i=0; i<missileGraphicsList.length; ++i) {
            missileGraphicsList[i].draw();
        }
        shipGraphic.draw();

        for (let i=0; i<livesGraphicsList.length; ++i){
            livesGraphicsList[i].draw();
        }
        levelTracker.draw();
        gameScoreDisplay.draw();
        particleSystem.render();
        countDownGraphic.draw();
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
        countDownMode = true;
        countDown.time += elapsedTime;
        if (countDown.time < 1000){
            ship.reset();
            shipGraphic = graphics.Texture(ship);
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
        particleSystem.update(elapsedTime);
    };
    
    let menuUpdate = function(elapsedTime){ };
    
    let gameModelUpdate = function(elapsedTime){
        ship.update(elapsedTime);
        for (let i=missiles.length-1; i>=0; --i){
            if (!missiles[i].update(elapsedTime)){
                missiles.splice(i, 1);
                missileGraphicsList.splice(i,1);
            }
        }
        for (let i=0; i<astroids.length; ++i){
            astroids[i].update(elapsedTime);
        }
        updateCollisions();
        if (astroids.length == 0) {
            nextLevel();
            return;
        }
        particleSystem.update(elapsedTime);
    };
    
    //START - beginning update
    that.updateGame = menuUpdate;

    let gameOverUpdate = function(elapsedTime){
        gameScoreIsShowing = true;
        gameScore.font = '8em New-Courier';
        gameScore.align = 'center';
        gameScore.x = CANVASWIDTH/2;
        gameScore.y = CANVASHEIGHT/2;
        countDown.time += elapsedTime;
        if (countDown.time > 6000){
            countDown.time = 0;
            gameScore.font = '3em New-Courier';
            gameScore.fillStyle = 'rgba(220, 220, 220, .2)';
            gameScore.x = 250;
            gameScore.y = CANVASHEIGHT - 5;
            gameScore.align = 'left';
            that.updateGame = menuUpdate;
            that.drawGame = drawMenu;
        } 
        else if (countDown.time > 5000) {
            gameScore.fillStyle = Color.green;
        }
        else if (countDown.time > 4000) {
            gameScore.fillStyle = 'rgba(220, 220, 220, .2)';
        }
        else if (countDown.time > 3000) {
            gameScore.fillStyle = Color.green;
        }
        else if (countDown.time > 2000) {
            gameScore.fillStyle = 'rgba(220, 220, 220, .2)';
        }
        else if (countDown.time > 1000) {
            gameScore.fillStyle = Color.green;
        }
        particleSystem.update(elapsedTime);
    }

    function cleanUpAstroids(){
        for (i=0; i<astroids.length; ++i){
            while (astroids[i].insideStayOutSphere()){
                astroids[i].center.x = Random.nextRange(0, graphics.canvas.width);
                astroids[i].center.y = Random.nextRange(0, graphics.canvas.height);
            }
        }
    }

    function endGameRoutine(){
        ship.blowUp();
        shipGraphic.draw = function(){};

        top5.push(score);
        top5.sort(function(a,b){return b-a;})
        top5.splice(5, 1);
        for (let x=0; x<top5.length; ++x){
            MyGame.persistence.remove(x);
            MyGame.persistence.add(x, top5[x]);
        }
        top5 = MyGame.persistence.retrieveHighScores();
        updateTop5Graphics();
    }

    function detectCollisionWithShip(){
        for (i=0; i<astroids.length; ++i){
            if (ship.didHitMe(astroids[i])){
                lives -= 1;
                livesGraphicsList.pop();
                if (lives == 0) {
                    console.log("Game Over");
                    endGameRoutine();
                    that.updateGame = gameOverUpdate;
                } else {
                    that.updateGame = countDownUpdate;
                    shipGraphic.draw = function(){};
                    cleanUpAstroids();
                    ship.blowUp();
                }
                break;
            }
        }
    }

    function detectCollisionWithMissiles(){
        let astroiddeletes = [];
        let missiledeletes = [];
        for (i=0; i<astroids.length; ++i){
            for (j=0; j<missiles.length; ++j){
                if (astroids[i].didHitMe(missiles[j])){
                    astroids[i].blowUp();
                    score += 100;
                    gameScore.text = `Score: ${score}`;
                    astroiddeletes.push(i);
                    missiledeletes.push(j);

                    // ----- Creating the sub astroids -----
                    let thisastroid = {
                        canvas: astroid.canvas,
                        width: 100,
                        speed_factor: 10,
                        srcList: astroid.srcList,
                        size: 1, // This tracks what image it should be on in the srcList.
                    };
                    thisastroid.whereConstraints = {
                        x0: astroids[i].center.x - astroids[i].width/3,
                        x1: astroids[i].center.x + astroids[i].width/3,
                        y0: astroids[i].center.y - astroids[i].width/3,
                        y1: astroids[i].center.y + astroids[i].width/3,
                    };
                    thisastroid.size = astroids[i].size + 1;
            
                    if (thisastroid.size <= astroid.srcList.length) {
                        astroids.push(MyGame.components.Astroid(thisastroid));
                        astroidGraphicsList.push(graphics.Texture(astroids[astroids.length-1]));
                        astroids.push(MyGame.components.Astroid(thisastroid));
                        astroidGraphicsList.push(graphics.Texture(astroids[astroids.length-1]));
                        astroids.push(MyGame.components.Astroid(thisastroid));
                        astroidGraphicsList.push(graphics.Texture(astroids[astroids.length-1]));
                    }
                    // ---------------------------------------
                } 
            }
        }

        for (i=0; i<astroiddeletes.length; ++i){
            // Deleting astroids that were hit
            astroids.splice(astroiddeletes[i], 1);
            astroidGraphicsList.splice(astroiddeletes[i], 1);
        }

        for (i=0; i<missiledeletes.length; ++i){
            missiles.splice(missiledeletes[i], 1);
            missileGraphicsList.splice(missiledeletes[i], 1);
        }
    }

    function updateCollisions(){
        if (!countDownMode){
            detectCollisionWithMissiles();
            if (detectCollisionWithShip()){
                ship.blowUp();
                ship = null;
            }
        }
    }

    function newGame(){
        ship.reset();
        restartLives();
        gameSpecs.num_astroids = num_astroids0;
        gameSpecs.astroid.size = 1;
        astroids = makeAstroids();
        astroidGraphicsList = makeAstroidsGList();
        missiles.length = 0;
        missileGraphicsList.length = 0;
        levelCount = 1;
        levelTrack.text = 'Level: 1';
        score = 0;
        gameScore.text = "Score: " + score;
        that.drawGame = drawGame;
        that.updateGame = countDownUpdate;
        countDownMode = true;
        gameScoreIsShowing = false;
        console.log('New Game Starting');
    }
    
    function nextLevel(){
        that.updateGame = countDownUpdate;

        gameSpecs.num_astroids += 2;
        gameSpecs.astroid.width += Math.pow(-1, levelCount) * 50;
        gameSpecs.astroid.speed_factor += 3;
        score += 50*lives;
        gameScore.text = "Score: " + score;
        ++levelCount;
        levelTrack.text = "Level " + levelCount;
        ship.reset();
        missiles.length = 0;
        missileGraphicsList.length = 0;
        astroids = makeAstroids();
        astroidGraphicsList = makeAstroidsGList();
        console.log('Level ' + levelCount );
    }

    that.shipMissile = function(elapsedTime){
        if (!countDownMode){
            ship.shoot(missiles, missileGraphicsList);
        }
    };

    that.shipThrust = function(elapsedTime){
        if (!countDownMode) {
            ship.thrust(elapsedTime);
        }
    };

    that.turnShipRight = function(elapsedTime){
        ship.rotateRight(elapsedTime);
    };
    
    that.turnShipLeft = function(elapsedTime){
        ship.rotateLeft(elapsedTime);
    };

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
    };

    that.escape = function(){
        if (!gameScoreIsShowing && !countDownMode){
            lives = 0;
            that.gameUpdate = menuUpdate;
            that.drawGame = drawMenu;
        }
    };

    that.clearHighScores = function(){
        for (let x=0; x<top5.length; ++x){
            MyGame.persistence.remove(x);
        }
        top5.length = 0;
        updateTop5Graphics();
    };

    return that;
};