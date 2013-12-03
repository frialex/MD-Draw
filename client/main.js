console.log("client/main.js: Loaded");

var config = {
    timestep: 1000.0 / 160,
    maxIPF: 16,
    integrator: 'verlet'
};




Meteor.startup(function clientMain(){
//ClientId?

Physics(config, function(world){
    //console.log("From Physics(world)");




  //Meteor.setTimeout(function(){

    Physics.util.ticker.subscribe(function(time, dt){
        world.step(time); //for physics
        world.render();   //for objects
        //console.log("time step");
        });

      var renderer = Physics.renderer('canvas', {
          el: 'viewport',
          width: 600,
          height: 600,
          meta: true
      });

    var ball = Physics.body('circle', { x: 60, y: 40, vx: 0.2, vy: 0.01, radius: 30})

    var gravity = Physics.behavior('constant-acceleration', {acc: {x: 0.0, y: 0.0004}});

    world.add(renderer);
    world.add(ball);
    world.add(gravity);



    Physics.util.ticker.start();





});

});
