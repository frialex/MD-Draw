console.log("client/main.js: Loaded");

var config = {
    timestep: 1000.0 / 160,
    maxIPF: 16,
    integrator: 'verlet'
};




Meteor.startup(function clientMain(){
//ClientId?

Physics(config, function(world){
    var viewportWidth = 800;
    var viewportHeight = 600;

    phyworld = world;
  //Meteor.setTimeout(function(){

    Physics.util.ticker.subscribe(function(time, dt){
        world.step(time); //for physics
        world.render();   //for objects
        //console.log("time step");
        });

      var renderer = Physics.renderer('canvas', {
          el: 'viewport',
          width: viewportWidth,
          height: viewportHeight,
          meta: true
      });



    var viewBounds = Physics.aabb(0,0, viewportWidth, viewportHeight);
    world.add(Physics.behavior('edge-collision-detection', {
        aabb: viewBounds,
        restitution: 0.56,
        cof: 0.90
    }));
    world.add(Physics.behavior('body-impulse-response'));

    var ball = Physics.body('circle', { x: 60, y: 40, vx: 0.2, vy: 0.01, radius: 30})

    var gravity = Physics.behavior('constant-acceleration');

    world.add(renderer);
    world.add(ball);
    world.add(gravity);

    //debugger;

    Physics.util.ticker.start();

    testx = 20;

    worldConfig = {
        gx: 0,
        gy: 0.0004,
        submit: function(data){Session.set("configChange", this);}
    };

    Deps.autorun(function(){
        console.log("Config Changed!");
        var cfg = Session.get("configChange");
        if(cfg) gravity.setAcceleration({x: cfg.gx, y: cfg.gy});

    });

    gui = new dat.GUI();
    gui.add(worldConfig, "gx").min(-1/100).max(1/100).step(1/1000);
    gui.add(worldConfig, "gy").min(-1/100).max(1/100).step(1/1000);
    gui.add(worldConfig, "submit");




});

});
