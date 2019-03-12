//-----------------------------------------------------------
//
// Astroid object returned from the astroid function.
//
// Expects a spec object like the following:
// spec = {
// };
//
//-----------------------------------------------------------


MyGame.components.Astroid = function(spec){
    'use strict';
    let that = {};

    let rG = Random.nextGaussian(1, .5);
    that.rate = Random.nextCircleVector();
    that.rate.x *= spec.speed_factor * rG;
    that.rate.y *= spec.speed_factor * rG;
    that.size = spec.size;
    that.whereConstraints = {
        x0: spec.whereConstraints.x0,
        x1: spec.whereConstraints.x1,
        y0: spec.whereConstraints.y0,
        y1: spec.whereConstraints.y1
    };

    that.center = {
        x: Random.nextRange(that.whereConstraints.x0, that.whereConstraints.x1),
        y: Random.nextRange(that.whereConstraints.y0, that.whereConstraints.y1)
    };

    that.insideStayOutSphere = function(){
        let d = Math.sqrt(Math.pow(that.center.x - spec.canvas.width/2, 2) + Math.pow(that.center.y - spec.canvas.height/2, 2));
        let stayOutRadius = spec.width * 2.4;
        return d < stayOutRadius;
    }

    if (that.size == 1){
        while (that.insideStayOutSphere()){
            that.center = {
                x: Random.nextRange(0, spec.canvas.width),
                y: Random.nextRange(0, spec.canvas.height)
            };
        }
    }

    that.size = spec.size; // 1 is the biggest, 1 is next biggest, ... n is the smallest

    that.imageSrc = spec.srcList[spec.size-1];
    that.rotation = Random.nextRange(0, 360);
    that.width = spec.width - (spec.size-1) * 20;
    that.height = spec.width - (spec.size-1) * 20;

    that.update = function(elapsedTime) {
        that.center.x += (that.rate.x * elapsedTime * .01);
        that.center.y += (that.rate.y * elapsedTime * .01);

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
    }

    that.blowUp = function(){
        MyGame.particleSystem.hitBuilding({x: that.center.x, y: that.center.y});
    }

    that.didHitMe = function(missile){
        let d = Math.sqrt(Math.pow(that.center.x - missile.center.x, 2) + Math.pow(that.center.y - missile.center.y, 2));
        return d < (that.width/2 + missile.radius);
    };

    return that;
};