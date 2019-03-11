// On my MyGame object, I'm making a main property that is filled
// with a function that is immediately invoked.
MyGame.main = (function(graphics, keyboard, mouse){
    
    let previousTime = performance.now();

    //-------------------------------------------
    //            Default Game Model
    //-------------------------------------------
    //Generate default level
    let colorList = [
        {fill: 'rgba(0, 0, 255, 1)', stroke: 'rgba(0, 0, 175, 1)'},
        {fill: 'rgba(255, 0, 0, 1)', stroke: 'rgba(175, 0, 0, 1)'},
        {fill: 'rgba(0, 255, 0, 1)', stroke: 'rgba(0, 175, 0, 1)'},
        {fill: 'rgba(255, 120, 255, 1)', stroke: 'rgba(175, 100, 175, 1)'},
        {fill: 'rgba(240, 230, 0, 1)', stroke: 'rgba(170, 165, 0, 1)'},        
        {fill: 'rgba(150, 50, 255, 1)', stroke: 'rgba(100, 35, 150, 1)'},        
    ]

    //Starting ship
    let ship = {
        position: {x: graphics.canvas.width/2, y: graphics.canvas.height/2},
        width: 100,
        src: 'images/ship.png',
        renderFunction: graphics.Texture,
        canvas: graphics.canvas,
        rotation: 0,
    }

    //background images for gameplay and menu
    // let background = 'images/space1.jpg';
    let background = 'images/black.png';
    let menuBackground = 'images/space2.jpg';

    let gameSpecs = {
        ship: ship,
        background: background,
        menuBackground: menuBackground,
        colorList: colorList,
        canvas: graphics.canvas,
    }

    //generate the default gameModel
    let gameModel = MyGame.gameModel(gameSpecs);


    //----------------------------------------------
    //                  Handlers
    //----------------------------------------------

    //Default key/mouse registration to handlers
    keyboard.registerKey(KeyEvent['DOM_VK_RIGHT'], gameModel.turnShipRight);
    keyboard.registerKey(KeyEvent['DOM_VK_LEFT'], gameModel.turnShipLeft);
    keyboard.registerKey(KeyEvent['DOM_VK_UP'], gameModel.shipThrust);
    
    keyboard.registerKey(KeyEvent['DOM_VK_D'], gameModel.turnShipRight);
    keyboard.registerKey(KeyEvent['DOM_VK_A'], gameModel.turnShipLeft);
    keyboard.registerKey(KeyEvent['DOM_VK_W'], gameModel.shipThrust);
    
    keyboard.registerKey(KeyEvent['DOM_VK_SPACE'], gameModel.shipMissile);

    keyboard.registerKey(KeyEvent['DOM_VK_ESCAPE'], gameModel.escape);
    keyboard.registerKey(KeyEvent['DOM_VK_C'], gameModel.clearHighScores);


    mouse.registerMouseReleasedHandler(gameModel.menuSelection);

    //----------------------------------------------
    //      Web Page Rendering scripts
    //----------------------------------------------

    let fpsList = [];
    let fpsAccumulator = 0;
    function updateFPS(elapsedTime){
        let fps = (1000/elapsedTime);
        fpsList.push(fps);
        fpsAccumulator += fps;
        document.getElementById('fps').innerHTML = 'fps: ' + (fpsAccumulator/fpsList.length).toFixed(3);
        while (fpsList.length > 10){
            fpsAccumulator -= fpsList[0];
            fpsList.splice(0,1);
        }
    }

    //-----------------------------------------------------
    //
    //                  Actual Game Loop
    //
    //-----------------------------------------------------

    function update(elapsedTime){
        updateFPS(elapsedTime);
        gameModel.updateGame(elapsedTime);        
    }

    function processInput(elapsedTime){
        keyboard.processInput(elapsedTime);
    }

    function render(){
        //Draw the game (clearing the screen is handled by the drawGame function)
        gameModel.drawGame();
    }

    function gameLoop(time){
        let elapsedTime = time - previousTime;
        previousTime = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render(elapsedTime);
        requestAnimationFrame(gameLoop);
    }

    console.log('game initializing...');
    requestAnimationFrame(gameLoop);

}(MyGame.graphics, MyGame.input.Keyboard(), MyGame.input.Mouse()));