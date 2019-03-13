/*
MyGame.graphics is an immediately invoked function with the following sub-functions
  clear()
  Texture(spec)
*/
MyGame.graphics = (function(){
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d');

    function clear(){
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
    }

    /*Rectangle expects a spec with
        rotation
        x
        width
        y
        height
        fillStyle
        strokeStyle
    */
    function Rectangle(spec){
        let that = {};

        that.updateRotation = function(angle){
            spec.rotation += angle;
        };

        that.draw = function(){
            //Rotating a shape
            //1. Translate (0,0) of canvas to center of shape
            context.save();
            context.translate(spec.x + spec.width/2, spec.y + spec.height/2);
            //2. Rotate canvas
            context.rotate(spec.rotation);
            context.translate(-(spec.x + spec.width/2), -(spec.y + spec.height/2));
            //3. Draw shape at original coordinates
            context.fillStyle = spec.fillStyle;
            context.fillRect(spec.x, spec.y, spec.width, spec.height);
            if (spec.hasOwnProperty('strokeStyle')){
                context.strokeStyle = spec.strokeStyle;
                context.strokeRect(spec.x, spec.y, spec.width, spec.height);
            }
            //4. Undo translations and rotations of canvas.
            context.restore();
        };

        return that;
    }

    /*
    Texture function passed spec property expects
      spec.imageSrc
      spec.rotation
      spec.center.x
      spec.center.y
      spec.width
      spec.height
     Texture function 'has' the following properties
      .draw
      .updateRotation
    */
    function Texture(spec){
        let that = {},
            ready = false,
            image = new Image();
        
        image.onload = function(){
            ready = true;
        };
        image.src = spec.imageSrc;
        that.updateRotation = function(angle){
            spec.rotation += angle;
        };

        that.draw = function(){
            if (ready){
                context.save();
                context.translate(spec.center.x, spec.center.y);
                context.rotate(spec.rotation);
                context.translate(-spec.center.x, -spec.center.y);

                context.drawImage(
                    image,
                    spec.center.x - spec.width/2,
                    spec.center.y -spec.height/2,
                    spec.width, spec.height);

                context.restore();   
            }
        };

        return that;
    }

    /*
    Background makes a texture that has width and height of the canvas.
    */
   function Background(src){
        let bck = {
            center: {x: canvas.width/2, y: canvas.height/2},
            rotation: 0,
            imageSrc: src,
            width: canvas.width,
            height: canvas.height,
        };
        return Texture(bck);
   }

    /*
    Line function is passed a lineList object that has: 
      maxX 
      maxY
      lineList list of {x,y} pairs
     Each pair represents the start and end of a line.
     max x,y are used for calculating the scale on the canvas. 
     It assumes the associated coordinate system is meant to 
     scale the entire canvas, centered on the canvas.
    */
    function Lines(lines){
        let w;
        lines.maxX > lines.maxY ? w = lines.maxX : w = lines.maxY;
        context.beginPath();
        for(let i=0; i < lines.lineList.length; i+=2){
            context.moveTo(lines.lineList[i].x*(canvas.width/w), lines.lineList[i].y*(canvas.height/w));
            context.lineTo(lines.lineList[i+1].x*(canvas.width/w), lines.lineList[i+1].y*(canvas.height/w));
        }
        context.stroke();
        context.closePath();
    }

    /*
    Rectangles is a shorthand way to generate a list of Rectangle's, and a draw function that draws all the given rectangles.
    */
    function Rectangles(rectangles){
        let that = {};
        let rects = [];
        for (let i=0; i < rectangles.length; ++i){
            rects.push(Rectangle(rectangles[i]));
        }
        that.draw = function(){
            for (let i=0; i < rectangles.length; ++i){
                rects[i].draw();
            }
        };
        return that;
    }

    /*
    Circle takes a spec and draws a circle from it
     spec = {
         center: {x: 0, y: 0}
         radius: 3
         fillColor: '',
         strokeColor: '',
     }
    */
    function Circle(spec){
        let that = {};
        that.draw = function(){
            context.beginPath();
            context.arc(spec.x, spec.y, spec.radius, 0, 2*3.14159265);
            context.closePath();
            if (spec.hasOwnProperty('strokeStyle')){
                context.strokeStyle = spec.strokeStyle;
                context.stroke();
            }
            context.fillStyle = spec.fillColor;
            context.fill();
        }
        return that;
    }

    /*
    Letters requires a spec with...
      text
      font
      fill
      fillStyle
      stroke
      strokeStyle
      x
      y
      align
      baseline
    */
    function Letters(spec){
        let that = {};

        that.draw = function(){
            context.font = spec.font;
            context.lineWidth = 3;
            if (spec.hasOwnProperty('align')){
                context.textAlign = spec.align;
            }
            if (spec.hasOwnProperty('baseline')){
                context.textBaseline = spec.baseline;
            }
            if (spec.hasOwnProperty('fillStyle')){
                context.fillStyle = spec.fillStyle;
            }
            if (spec.hasOwnProperty('fill')){
                context.fillText(spec.text, spec.x, spec.y);
            }
            if (spec.hasOwnProperty('strokeStyle')){
                context.strokeStyle = spec.strokeStyle;
            }
            if (spec.hasOwnProperty('stroke')){
                context.strokeText(spec.text, spec.x, spec.y);
            }
        }

        return that;
    }

    /*
    Menu creates a menu from a menu object with...
     background
     button
     gap
     rows
    */
    function Menu(menu){
        let that = {};
        let b = Background(menu.background);

        let buttonsXY = [];
        let bgList = [];
        let textgList = [];
        menu.button.y = (canvas.height - (2*menu.gap + 3*menu.button.height))/2;

        for (let i=0; i < menu.rows; ++i){
            bgList.push(Rectangle({
                x: menu.button.x,
                y: menu.button.y,
                rotation: 0,
                width: menu.button.width,
                height: menu.button.height,
                fillStyle: menu.button.fillStyle,
                strokeStyle: menu.button.strokeStyle
            }));
            buttonsXY.push({x: menu.button.x, y: menu.button.y});
            menu.textList[i].x = canvas.width/2;
            menu.textList[i].y = menu.button.y + menu.button.height/2;
            textgList.push(Letters(menu.textList[i]));
            menu.button.y += menu.gap + menu.button.height;
        }

        that.draw = function(){
            b.draw();
            for (let i=0; i<bgList.length; ++i){
                bgList[i].draw();
                textgList[i].draw();
            }
        };

        //This returns nothing if not on a button, and returns 1,2, or 3 depending on which button on.
        that.isCoordinateOnButton = function(screenCoordinate){
            screenCoordinate.x -= canvas.offsetLeft;
            screenCoordinate.y -= canvas.offsetTop;            
            let canvasCoordinate = {
                x: screenCoordinate.x * canvas.width/canvas.scrollWidth, 
                y: screenCoordinate.y * canvas.height/canvas.scrollHeight
            };
            if (canvasCoordinate.x > buttonsXY[0].x && canvasCoordinate.x < buttonsXY[0].x + menu.button.width ){
                for (let i=0; i < buttonsXY.length; ++i){
                    if (canvasCoordinate.y > buttonsXY[i].y && canvasCoordinate.y < buttonsXY[i].y + menu.button.height){
                        return i + 1;
                    }
                }
            }
        }

        return that;
    }
    
    return {
        clear: clear,
        Rectangle: Rectangle,
        Texture: Texture,
        Lines: Lines,
        Circle: Circle,
        Letters: Letters,
        Menu: Menu,
        Background: Background,
        canvas: {width: canvas.width, height: canvas.height}
    };

}());