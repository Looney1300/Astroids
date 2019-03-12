//------------------------------------------------------------------
//
// Model for each missile in the game.
//
// The following object and associated properties are valid:
// spec = {
//     center: {x: 10, y: 10},
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

    that.center = {
        x: spec.position.x,
        y: spec.position.y
    };
    
    that.rotation = spec.rotation;
    that.speed = spec.speed;
    that.radius = spec.radius;
    that.fillColor = spec.color;
    that.strokeColor = spec.color;

    that.timeRemaining = spec.lifespan;

    that.update = function(elapsedTime) {
        let yVal = -Math.cos(that.rotation);
        let xVal = Math.sin(that.rotation);
        that.center.x += (that.speed * xVal * elapsedTime * .01);
        that.center.y += (that.speed * yVal * elapsedTime * .01);

        that.timeRemaining -= elapsedTime;

        while (that.center.x < 0){
            that.center.x += spec.canvas.width;
        }
        while (that.center.x > spec.canvas.width){
            that.center.x -= spec.canvas.width;
        }
        while (that.center.y < 0){
            that.center.y += spec.canvas.height;
        }
        while (that.center.y > spec.canvas.height){
            that.center.y -= spec.canvas.height;
        }

        if (that.timeRemaining < 0) {
            return false;
        }
        return true;
    }

    return that;
};
