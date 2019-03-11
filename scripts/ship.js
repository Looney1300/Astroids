//------------------------------------------------------------------
//
// Model for each missile in the game.
//
// The following object and associated properties are valid:
// spec = {
//     position: {x: 10, y: 10},
//     width: 15,
//     canvas: {width: 200, height: 200},
//     speed: 2,
//     direction: 0, // TODO: is this radians or degrees?
//     src: 'images/ship.png',
//     renderFunction: Texture,
//     rotation: 0, // TODO: is this radians or degrees?
// };
//
//------------------------------------------------------------------
MyGame.components.Ship = function(spec) {
    'use strict';
    let that = {};

    let position = {
        x: spec.position.x,
        y: spec.position.y
    };

    //------------------------------------------------------------------
    //
    // Update the position of the missle.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime) {
        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);

        position.x += (vectorX * elapsedTime * speed);
        position.y += (vectorY * elapsedTime * speed);

        timeRemaining -= elapsedTime;

        while (position.x < 0){
            position.x += canvas.width;
        }
        while (position.x > canvas.width){
            position.x -= canvas.width;
        }
        while (position.y < 0){
            position.y += canvas.height;
        }
        while (position.y > canvas.height){
            position.y -= canvas.height;
        }

    };

    that.render = function(){
        spec.renderFunction({
            imageSrc: spec.src,
            rotation: 0,
            center: {x: 0, y: 0},
            width: spec.canvas.width,
            height: spec.canvas.width,
        }).draw();
    };

    return that;
};
