//------------------------------------------------------------------
//
// Model for each missile in the game.
//
// The following object and associated properties are valid:
// spec = {
//     worldCoordinates: {x: 10, y: 10},
//     radius: 15,
//     timeRemaining: 3, // In seconds
//     canvas: {width: 200, height: 200},
//     speed: 2,
//     direction: 0, // TODO: is this degrees or radians?
//     renderFunction: MyGame.graphics.Circle // What graphics function to render this object.
// };
//
//------------------------------------------------------------------
MyGame.components.Missile = function(spec) {
    'use strict';
    let that = {};
    let canvas = spec.canvas;
    let renderFunction = spec.renderFunction;

    let speed = spec.speed;
    let direction = spec.direction;
    let radius = spec.radius;

    let worldCoordinates = {
        x: spec.worldCoordinates.x,
        y: spec.worldCoordinates.y
    };

    let position = {
        x: 0,
        y: 0
    };

    let timeRemaining = spec.timeRemaining;

    Object.defineProperty(that, 'worldCoordinates', {
        get: () => worldCoordinates
    });

    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'radius', {
        get: () => radius
    });

    Object.defineProperty(that, 'speed', {
        get: () => speed
    });


    //------------------------------------------------------------------
    //
    // Update the position of the missle.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime) {
        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);

        worldCoordinates.x += (vectorX * elapsedTime * speed);
        worldCoordinates.y += (vectorY * elapsedTime * speed);

        timeRemaining -= elapsedTime;

        if (worldCoordinates.x < 0){
            position.x += canvas.width;
        }
        else if (worldCoordinates.x > canvas.width){
            position.x -= canvas.width;
        }
        if (worldCoordinates.y < 0){
            position.y += canvas.height;
        }
        else if (worldCoordinates.y > canvas.height){
            position.y -= canvas.height;
        }

        if (timeRemaining <= 0) {
            return false;
        } else {
            return true;
        }
    };

    that.render = function(){
        renderFunction({
            position: position,
            radius: radius, 
            fillColor: '#DAA520',
            strokeColor: '#DAA520',
        });
    }

    return that;
};
