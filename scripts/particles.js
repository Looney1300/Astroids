/*
EXAMPLE spec object:
 let particleSpec3 = {
     drawUsing: MyGame.graphics.Rectangle,
     x: 625,
     y: 100,
     // xMax: 850,
     // yMax: 550,
     particlesPerSec: 20,
     fill: Color.green,
     lineWidth: 1,
     stroke: Color.green,
     imageSrc: 'bubble1b.png',
     rotationMax: 1,
     lifetime: {mean: 500, std: 100},
     speed: {mean: 200, std: 10},
     size: {mean: 50, std: 1},
     specifyDirection: {angle: Math.PI/3, std: .1},
     gravity: 1,
     onTop: true,
     disappear: true,
     duration: 10000,
 }
*/
MyGame.particleSystem = (function(){

    let particles = [];
    let activeParticleEffects = [];
    let particleGraphics = [];

    /*
    Particles makes a list of particle graphics.
    */
    function Particle(particle){
        if (particle.hasOwnProperty('fill')){
            particle.fillStyle = particle.fill;
        }
        if (particle.hasOwnProperty('stroke')){
            particle.strokeStyle = particle.stroke;
        }
        particle.x = particle.position.x;
        particle.y = particle.position.y;
        particle.width = Math.abs(particle.size);
        particle.height = particle.width;
        particle.radius = particle.width/2;
        return particle.graphicsFunction(particle);
    }

    /*
    ParticleEffect creates a particle effect based on spec passed to it, which has...
      drawUsing - a reference to the graphics function to use when drawing this particle effect.
      x - position of particle
      y
      xMax (optional) - for effect over a range.
      yMax (optional) -  "    "     "     "
      limitY (optional) - expects 1, 0, or -1 : limits y direction of particles to either only up or only down, or no change in y.
      limitX (optional) - expects 1, 0, or -1 : limits x directoin of particles to either only right or only left, or no change in x.
      particlesPerSec
      lifetime.mean
      lifetime.std
      size.mean
      size.std
      speed.mean
      speed.std
      gravity
      stroke/fill/imageSrc
      disappear (optional)
      rotationMax (optional)
      duration (optional) - how long the effect will last, if left blank, will continue endlessly.
    Returns true if still active, and false if effect duration is finished.
    */
    function ParticleEffect(spec){
        activeParticleEffects.push(MakeParticleEffect(spec));
    }

    function MakeParticleEffect(spec){
        let that = {};
        let time = 1001/spec.particlesPerSec;
        let effectDuration = 0.0;
        let hasDuration = spec.hasOwnProperty('duration');
        let hasLimitDirection = spec.hasOwnProperty('specifyDirection');
        let hasDissappear = spec.hasOwnProperty('disappear');
        let hasRotationMax = spec.hasOwnProperty('rotationMax');
        let hasGravity = spec.hasOwnProperty('gravity');
        let hasFill = spec.hasOwnProperty('fill');
        let hasLineWidth = spec.hasOwnProperty('lineWidth');
        let hasStroke = spec.hasOwnProperty('stroke');
        let hasImageSrc = spec.hasOwnProperty('imageSrc');
        let hasXMax = spec.hasOwnProperty('xMax');
        let hasYMax = spec.hasOwnProperty('yMax');
        let hasOnTop = spec.hasOwnProperty('onTop');

        that.update = function(elapsedTime){
            time += elapsedTime;
            effectDuration += elapsedTime;
            //Makes a certain number of particles per second.
            // make one particle every 1000/spec.particlesPerSec
            if (hasDuration && effectDuration > spec.duration){
                return false;
            }
            for (time; time > (1000/spec.particlesPerSec); time -= (1000/spec.particlesPerSec) ){
                let p = {
                    graphicsFunction: spec.drawUsing,
                    speed: Math.abs(Random.nextGaussian(spec.speed.mean/1000, spec.speed.std/1000)),	// pixels per millisecond
                    rotation: 0,
                    lifetime: Math.abs(Random.nextGaussian(spec.lifetime.mean, spec.lifetime.std)),	// milliseconds
                    alive: 0,
                    size: Random.nextGaussian(spec.size.mean, spec.size.std),
                    o: 1,
                };
                if (hasLimitDirection){
                    p.direction = Random.nextCircleVectorAround(1, spec.specifyDirection.angle, spec.specifyDirection.std);
                }else{
                    p.direction = Random.nextCircleVector(1);
                }
                if (hasDissappear){
                    p.disappear = spec.disappear;
                }
                if (hasRotationMax){
                    p.rotationRate = Random.nextGaussian(0, spec.rotationMax);
                }
                if (hasGravity){
                    p.gravity = spec.gravity;
                }
                if (hasFill){
                    p.fill = spec.fill;
                }
                if (hasLineWidth){
                    p.lineWidth = spec.lineWidth;
                }
                if (hasStroke){
                    p.stroke = spec.stroke;
                }
                if (hasImageSrc){
                    p.imageSrc = spec.imageSrc;
                }
                if (hasXMax && hasYMax){
                    p.position = { x: Random.nextRangeFloat(spec.x, spec.xMax), y: Random.nextRangeFloat(spec.y, spec.yMax)};
                }else{
                    p.position = {x: spec.x, y: spec.y};
                }
                let index = Math.random()*100000 % particles.length;
                if (hasOnTop){
                    index = particles.length - 1;
                }
                particles.splice(index, 0, p);
                particleGraphics.splice(index, 0, Particle(p));
            }

            return true;
        }

        return that;
    }

    // UpdateParticles updates the particles and removes them when dead, and their corresponding graphics.
    function updateParticles(elapsedTime){
        //Loop through particles backwards to find ones to remove.
        for (let particle = (particles.length-1); particle >= 0; --particle) {
            particles[particle].alive += elapsedTime;
            //Check if they are still alive before updating them.
            if (particles[particle].alive > particles[particle].lifetime) {
                particles.splice(particle, 1);
                particleGraphics.splice(particle, 1);
            }
        }
        //Update updated particles list with only living particles.
        for (let particle = 0; particle < particles.length; ++particle) {
            particles[particle].direction.y += (elapsedTime * particles[particle].gravity/1000);
            particles[particle].x += (elapsedTime * particles[particle].speed * particles[particle].direction.x);
            particles[particle].y += (elapsedTime * particles[particle].speed * particles[particle].direction.y);
            
            if (particles[particle].disappear){
                let transparency = 1-(particles[particle].alive/particles[particle].lifetime);
                if (particles[particle].hasOwnProperty('stroke')){
                    particles[particle].strokeStyle = Color.addAlpha(particles[particle].stroke, transparency);
                }
                if (particles[particle].hasOwnProperty('fill')){
                    particles[particle].fillStyle = Color.addAlpha(particles[particle].fill, transparency);
                }
                if (particles[particle].hasOwnProperty('imageSrc')){
                    particles[particle].o = transparency;
                }
            }
            if (particles[particle].hasOwnProperty('rotationRate')){
                particles[particle].rotation += (elapsedTime * particles[particle].rotationRate/1000);
            }
        }
        //Add any new particles from ActiveParticleEffects and remove finished effects
        for (let i = (activeParticleEffects.length-1); i >= 0; --i){
            if (!activeParticleEffects[i].update(elapsedTime)){
                activeParticleEffects.splice(i, 1);
            }
        }
    }

    function renderParticleSystem(){
        for (let i=0; i<particleGraphics.length; ++i){
            particleGraphics[i].draw();
        }
    }

    // This only clears the Active particle Effects, meaning all particles still alive will continue
    //  but any effects that are generating new particles will cease to produce new particles.
    function clearParticleEffects(){
        activeParticleEffects.length = 0;
    }

    // Clears all particles, associated graphics, and effects.
    function clearAll(){
        activeParticleEffects.length = 0;
        particleGraphics.length = 0;
        particles.length = 0;
    }

    return {
        ParticleEffect: ParticleEffect,
        update: updateParticles,
        render: renderParticleSystem,
        clearEffects: clearParticleEffects,
        clearAll: clearAll
    };

}());

// --------------------------------------------------------
//
//          Game specific particle effects
//
// Just call these functions with the correct location in world coords when
// one of these effects is needed, graphics functions take care of conversion.
//
// --------------------------------------------------------


MyGame.particleSystem.AstroidBlowUp = function(location, size){
    let particleSpec = {
        drawUsing: MyGame.graphics.Rectangle,
        x: location.x,
        y: location.y,
        particlesPerSec: 300,
        fill: Color.grey,
        rotationMax: 4,
        lifetime: {mean: 1200, std: 600},
        speed: {mean: 80, std: 30},
        size: {mean: 8*(4-size), std: 2*(4-size)},
        onTop: true,
        gravity: 0,
        disappear: true,
        duration: 30,
    }
    
    MyGame.particleSystem.ParticleEffect(particleSpec);
};

MyGame.particleSystem.Exhaust = function(location){
    let particleSpec = {
        drawUsing: MyGame.graphics.Circle,
        x: location.x,
        y: location.y,
        particlesPerSec: 500,
        fill: Color.addAlpha(Color.grey, .3),
        rotationMax: 4,
        lifetime: {mean: 300, std: 60},
        speed: {mean: 80, std: 30},
        size: {mean: 5, std: 1},
        onTop: true,
        gravity: 0,
        disappear: true,
        duration: 20,
    }
    
    MyGame.particleSystem.ParticleEffect(particleSpec);
};

MyGame.particleSystem.ShipBlowUp = function(location, direction){
    let particleSpec = {
        drawUsing: MyGame.graphics.Rectangle,
        x: location.x,
        y: location.y,
        particlesPerSec: 300,
        fill: Color.white,
        rotationMax: 4,
        lifetime: {mean: 600, std: 200},
        speed: {mean: 150, std: 80},
        size: {mean: 10, std: 4},
        onTop: true,
        gravity: 0,
        disappear: true,
        duration: 150,
    }
    MyGame.particleSystem.ParticleEffect(particleSpec);

    let particleSpec1 = {
        drawUsing: MyGame.graphics.Rectangle,
        x: location.x - 10,
        y: location.y,
        particlesPerSec: 300,
        fill: Color.white,
        rotationMax: 4,
        lifetime: {mean: 600, std: 200},
        speed: {mean: 150, std: 80},
        size: {mean: 10, std: 4},
        onTop: true,
        gravity: 0,
        disappear: true,
        duration: 150,
    }
    MyGame.particleSystem.ParticleEffect(particleSpec1);

    let particleSpec2 = {
        drawUsing: MyGame.graphics.Rectangle,
        x: location.x,
        y: location.y - 10,
        particlesPerSec: 300,
        fill: Color.white,
        rotationMax: 4,
        lifetime: {mean: 600, std: 200},
        speed: {mean: 150, std: 80},
        size: {mean: 10, std: 4},
        onTop: true,
        gravity: 0,
        disappear: true,
        duration: 150,
    }
    MyGame.particleSystem.ParticleEffect(particleSpec2);
    
    let particleSpec3 = {
        drawUsing: MyGame.graphics.Rectangle,
        x: location.x + 10,
        y: location.y,
        particlesPerSec: 300,
        fill: Color.white,
        rotationMax: 4,
        lifetime: {mean: 600, std: 200},
        speed: {mean: 150, std: 80},
        size: {mean: 10, std: 4},
        onTop: true,
        gravity: 0,
        disappear: true,
        duration: 150,
    }
    MyGame.particleSystem.ParticleEffect(particleSpec3);
    
    let particleSpec4 = {
        drawUsing: MyGame.graphics.Rectangle,
        x: location.x,
        y: location.y + 10,
        particlesPerSec: 300,
        fill: Color.white,
        rotationMax: 4,
        lifetime: {mean: 600, std: 200},
        speed: {mean: 150, std: 80},
        size: {mean: 10, std: 4},
        onTop: true,
        gravity: 0,
        disappear: true,
        duration: 150,
    }
    MyGame.particleSystem.ParticleEffect(particleSpec4);
};
