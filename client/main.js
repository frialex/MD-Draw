console.log("client/main.js: Loaded");
//TODO: Can this be turned in to a Facebook game?
//

var config = {
    timestep: 1000.0 / 160,
    maxIPF: 16,
    integrator: 'verlet'
};

var viewWidth = 800;
var viewHeight = 600;

var mainLoop = function(time, dt){
    phyworld.step(time); //for physics
    phyworld.render();   //for objects

};

var ballWorld = function(world){

    phyworld = world;

    Physics.util.ticker.subscribe(mainLoop);

    var renderer = Physics.renderer('canvas', {
          el: 'viewport',
          width: viewWidth,
          height: viewHeight,
          meta: true
      });

    var viewBounds = Physics.aabb(0,0, viewWidth, viewHeight);
    world.add(Physics.behavior('edge-collision-detection', {
        aabb: viewBounds,
        restitution: 0.56,
        cof: 0.90
    }));
    world.add(Physics.behavior('body-impulse-response')); //impluse + collision = bounce back @ edge
    var gravity = Physics.behavior('constant-acceleration');

    var ball = Physics.body('circle', { x: 60, y: 40, vx: 0.2, vy: 0.01, radius: 30});
    var ball2 = Physics.body('circle', { x: viewWidth - 40, y: 0, vy: 0.01, radius: 20});

    world.add(renderer);
    world.add(ball);
    world.add(ball2);
    world.add(gravity);

    //debugger;

    Physics.util.ticker.start();

    worldConfig = {  };

	Object.defineProperty(worldConfig, "gy", 
		{
		get: function(){return gy;},
		set: function(val){
			gravity.setAcceleration({y: val}); gy = val;}
		});

	Object.defineProperty(worldConfig, "gx",
		{
		get: function(){return gx;},
		set: function(newgx){
			gravity.setAcceleration({x: newgx}); gx = newgx;}
		});
//Can only set one direction at a time. gx referenced from gy's setter => gx undef error
//TODO: Can gravity be set to music?

	worldConfig.gy = 0.0004;
	worldConfig.gx = 0; 

    gui = new dat.GUI();
    gui.add(worldConfig, "gx").min(-1/100).max(1/100).step(1/10000);
    gui.add(worldConfig, "gy").min(-1/100).max(1/100).step(1/10000);




}


Meteor.startup(function clientMain(){
//User meteors facebook account? get ClientId from that
Physics(config, ballWorld );

});
