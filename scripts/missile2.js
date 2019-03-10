//------------------------------------------------------------------
//
// Model for each missile in the game.
//
// The following object and associated properties are valid:
// spec = {
//     worldCoordinates: {x: 10, y: 10},
//     radius: 15,
// };
//
//------------------------------------------------------------------
MyGame.components.Missile = function(spec) {
    'use strict';
    let that = {};

    let worldCoordinates = {
        x: spec.worldCoordinates.x,
        y: spec.worldCoordinates.y
    };

    let position = {
        x: 0,
        y: 0
    };

    Object.defineProperty(that, 'worldCoordinates', {
        get: () => worldCoordinates
    });

    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'radius', {
        get: () => spec.radius
    });


    //------------------------------------------------------------------
    //
    // Update the position of the missle.  We don't receive updates from
    // the server, because the missile moves in a straight line until it
    // explodes.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime, viewPort) {
        let vectorX = Math.cos(spec.direction);
        let vectorY = Math.sin(spec.direction);

        this.worldCoordinates.x += (vectorX * elapsedTime * spec.speed);
        this.worldCoordinates.y += (vectorY * elapsedTime * spec.speed);

        spec.timeRemaining -= elapsedTime;

        let diffX = (Math.abs(viewPort.center.x - this.worldCoordinates.x))/viewPort.width;
        let diffY = (Math.abs(viewPort.center.y - this.worldCoordinates.y))/viewPort.height;
        if (this.worldCoordinates.x < viewPort.center.x){
            this.position.x = 0.5 - diffX;
        }
        else {
            this.position.x = 0.5 + diffX;
        }
        if (this.worldCoordinates.y < viewPort.center.y) {
            this.position.y = 0.5 - diffY;
        }
        else {
            this.position.y = 0.5 + diffY;
        }

        if (spec.timeRemaining <= 0) {
            return false;
        } else {
            return true;
        }
    };

    return that;
};
