//-----------------------------------------------------------
//
// Astroid object returned from the astroid function.
//
// Expects a spec object like the following:
// spec = {
//    render: drawRectangle, // A refernece to a function with appropriate parameters to be drawn.
// };
//
//-----------------------------------------------------------


MyGame.components.Astroid = function(spec){
    'use strict';
    let that = {};
    let SPEED_FACTOR = 3;

    that.rate = Random.nextCircleVector();
    that.rate.x *= SPEED_FACTOR;
    that.rate.y *= SPEED_FACTOR;

    function render(){
        spec.render();
    };


    return {
        render: render,
    };
};