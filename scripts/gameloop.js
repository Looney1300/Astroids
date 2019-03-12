// On my MyGame object, I'm making a main property that is filled
// with a function that is immediately invoked.
MyGame.main = (function(graphics, keyboard, mouse){
    
    let previousTime = performance.now();

    //-------------------------------------------
    //            Default Game Model
    //-------------------------------------------
    //Generate default level
    let astroidColorList = [
        Color.white, Color.red, Color.blue,        
    ];

    let colorList = [
        {fill: 'rgba(0, 0, 255, 1)', stroke: 'rgba(0, 0, 175, 1)'},
        {fill: 'rgba(255, 0, 0, 1)', stroke: 'rgba(175, 0, 0, 1)'},
        {fill: 'rgba(0, 255, 0, 1)', stroke: 'rgba(0, 175, 0, 1)'},
        {fill: 'rgba(255, 120, 255, 1)', stroke: 'rgba(175, 100, 175, 1)'},
        {fill: 'rgba(240, 230, 0, 1)', stroke: 'rgba(170, 165, 0, 1)'},        
        {fill: 'rgba(150, 50, 255, 1)', stroke: 'rgba(100, 35, 150, 1)'},        
    ]

    // Base spec for missile of the ship.
    let missile = {
        radius: 3,
        speed: 50,
        color: Color.white,
        lifespan: 1300, // in milliseconds
        canvas: graphics.canvas,
    };

    //Starting ship
    let ship = {
        missile: missile,
        position: {x: graphics.canvas.width/2, y: graphics.canvas.height/2},
        width: 100,
        src: 'images/ship.png',
        canvas: graphics.canvas,
        rotation: 0,
        rotateSpeedScale: .4,
    };

    // Base for astroids.
    let astroid = {
        whereConstraints: {x0: 0, x1:graphics.canvas.width, y0: 0, y1: graphics.canvas.height},
        canvas: graphics.canvas,
        width: 150,
        speed_factor: 5,
        srcList: ['images/astroid0.png','images/astroid1.png','images/astroid2.png'],
        size: 1, // This tracks what image it should be on in the srcList.
    };
    
    //background images for gameplay and menu
    // let background = 'images/space1.jpg';
    let background = 'images/space1.jpg';
    let menuBackground = 'images/space2.jpg';
    
    let gameSpecs = {
        ship: ship,
        missile: missile,
        num_astroids: 3, // number of astroids per level.
        astroid: astroid,
        background: background,
        menuBackground: menuBackground,
        canvas: graphics.canvas,
        colorList: colorList,
    };

    //generate the default gameModel
    let gameModel = MyGame.gameModel(gameSpecs);


    //----------------------------------------------
    //                  Handlers
    //----------------------------------------------

    //Default key/mouse registration to handlers
    keyboard.registerHandler(KeyEvent['DOM_VK_RIGHT'], gameModel.turnShipRight, true);
    keyboard.registerHandler(KeyEvent['DOM_VK_LEFT'], gameModel.turnShipLeft, true);
    keyboard.registerHandler(KeyEvent['DOM_VK_UP'], gameModel.shipThrust, true);
    
    keyboard.registerHandler(KeyEvent['DOM_VK_D'], gameModel.turnShipRight, true);
    keyboard.registerHandler(KeyEvent['DOM_VK_A'], gameModel.turnShipLeft, true);
    keyboard.registerHandler(KeyEvent['DOM_VK_W'], gameModel.shipThrust, true);
    
    keyboard.registerHandler(KeyEvent['DOM_VK_SPACE'], gameModel.shipMissile, true, 100);

    keyboard.registerHandler(KeyEvent['DOM_VK_ESCAPE'], gameModel.escape, false);
    keyboard.registerHandler(KeyEvent['DOM_VK_C'], gameModel.clearHighScores, false);


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
        keyboard.update(elapsedTime);      
    }

    function render(){
        //Draw the game (clearing the screen is handled by the drawGame function)
        gameModel.drawGame();
    }

    function gameLoop(time){
        let elapsedTime = time - previousTime;
        previousTime = time;

        update(elapsedTime);
        render(elapsedTime);
        requestAnimationFrame(gameLoop);
    }

    console.log('game initializing...');
    requestAnimationFrame(gameLoop);

}(MyGame.graphics, MyGame.input.Keyboard(), MyGame.input.Mouse()));