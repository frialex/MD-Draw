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

    Deps.autorun(function(){
        console.log("Config Changed!");
        var cfg = Session.get("configChange");
        if(cfg) gravity.setAcceleration({x: cfg.gx, y: cfg.gy});

    });
    worldConfig = {
        gx: 0,
        submit: function(data){Session.set("configChange", this);}
    };

	Object.defineProperty(worldConfig, "gy", {get: function(){return gy; },
						  set: function(val){gy = val;}});
	worldConfig.gy = 0.0004;

    gui = new dat.GUI();
    gui.add(worldConfig, "gx").min(-1/100).max(1/100).step(1/10000);
    gui.add(worldConfig, "gy").min(-1/100).max(1/100).step(1/10000);
    gui.add(worldConfig, "submit");




}


Meteor.startup(function clientMain(){
//User meteors facebook account? get ClientId from that
Physics(config, ballWorld );

});
