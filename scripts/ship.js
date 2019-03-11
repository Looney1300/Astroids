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

    that.position = {
        x: spec.position.x,
        y: spec.position.y
    };
    that.imageSrc = spec.src;
    that.rotation = spec.rotation;
    that.center = {x: that.position.x, y: that.position.y};
    that.width = spec.width;
    that.height = spec.width;
    that.speed = spec.speed;
    //------------------------------------------------------------------
    //
    // Update the position of the missle.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime) {
        let vectorX = Math.cos(spec.direction);
        let vectorY = Math.sin(spec.direction);

        that.position.x += (vectorX * elapsedTime * spec.speed);
        that.position.y += (vectorY * elapsedTime * spec.speed);

        while (that.position.x < 0){
            that.position.x += spec.canvas.width;
        }
        while (that.position.x > spec.canvas.width){
            that.position.x -= spec.canvas.width;
        }
        while (that.position.y < 0){
            that.position.y += spec.canvas.height;
        }
        while (that.position.y > spec.canvas.height){
            that.position.y -= spec.canvas.height;
        }
    };

    that.rotateRight = function(elapsedTime) {
        that.rotation += .01 * elapsedTime;
    };
    
    that.rotateLeft = function(elapsedTime) {
        that.rotation -= .01 * elapsedTime;
    };

    return that;
};
