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

    that.center = {
        x: spec.position.x,
        y: spec.position.y
    };
    that.imageSrc = spec.src;
    that.rotation = spec.rotation;
    that.width = spec.width;
    that.height = spec.width;
    that.xVector = 0;
    that.yVector = 0;

    that.missile = spec.missile;

    //------------------------------------------------------------------
    //
    // Update the center of the ship.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime) {
        that.center.x += (that.xVector * elapsedTime * .01);
        that.center.y += (that.yVector * elapsedTime * .01);

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
    };

    that.rotateRight = function(elapsedTime) {
        that.rotation += .01 * elapsedTime * spec.rotateSpeedScale;
    };
    
    that.rotateLeft = function(elapsedTime) {
        that.rotation -= .01 * elapsedTime * spec.rotateSpeedScale;
    };

    that.thrust = function(elapsedTime){
        let yVal = -Math.cos(that.rotation);
        let xVal = Math.sin(that.rotation);
        that.xVector += .1 * elapsedTime * xVal;
        that.yVector += .1 * elapsedTime * yVal;
    };

    that.reset = function(){
        that.rotation = 0;
        that.xVector = 0;
        that.yVector = 0;
        that.center.x = spec.canvas.width/2;
        that.center.y = spec.canvas.height/2;
    };

    that.didHitMe = function(astroid){
        let d = Math.sqrt(Math.pow(that.center.x - astroid.center.x, 2) + Math.pow(that.center.y - astroid.center.y, 2));
        return d < (that.width-20 + astroid.width)/2;
    };

    that.blowUp = function(){
        MyGame.particleSystem.hitBuilding({x: that.center.x, y: that.center.y});
    };

    that.shoot = function(missilesList, graphicsList){
        spec.missile.position = {x: that.center.x, y: that.center.y};
        spec.missile.rotation = that.rotation;
        missilesList.push(MyGame.components.Missile(spec.missile));
        graphicsList.push(MyGame.graphics.Circle(missilesList[missilesList.length-1]));
    };

    return that;
};
