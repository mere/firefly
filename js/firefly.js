define([
  "three",
  "./behaviours/walls",
  "./behaviours/mouse",
  "./environment"

  ], function(
    THREE,
    wallBehaviour,
    mouseBehaviour,
    env
    ){
  return function(){

  var i, instance = i = {}
    , vector = new THREE.Vector3()
    , walls = wallBehaviour(i)
    , goal
    , flatteningRate = .95 //0..1:flatten instantly to flatten slowly
    
  i.maxSpeed = .8
  i.type = Math.random()
  i.maxSteerForce = 0.1
  var mouse = mouseBehaviour(i)
  i.fieldOfVision = 300
  i.position = new THREE.Vector3();
  i.velocity = new THREE.Vector3();
  i.acceleration = new THREE.Vector3();
  var specular = new THREE.Color("#ffff00")
  var color = new THREE.Color("#ffff00").offsetHSL(0,0,-.1)
  var emissive = new THREE.Color("#ffff00").offsetHSL(0,0,-.5)
  i.mesh = new THREE.Mesh( 
        //new obj()
        //new THREE.SphereGeometry(10, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
        new THREE.SphereGeometry(20, 5, 5)
      // , new THREE.MeshBasicMaterial( 
      //   { 
      //     color: Math.random() * 0xffffff, 
      //     side: THREE.DoubleSide 
      //   }) 
      ,new THREE.MeshPhongMaterial({
        // light
        specular: specular,
        // intermediate
        color: color,
        // dark
        emissive: emissive,
        shininess: 10 
      })
      )

  i.goal = function(value){
    if (!arguments.length) return goal
    goal = value
    return this
  }

  i.tick = function ( swarm , interact) {
    i.acceleration.set( 0, 0, 0 );
    if ( env.avoidWalls ) walls.avoid(env.wallRepelForce)
    i.interact(swarm, interact)
    mouse.attract(env.mouseForce)
    i.move();

  }

  i.move = function () {
    i.velocity.add( i.acceleration );
    var l = i.velocity.length();
    if ( l > i.maxSpeed ) {
      i.velocity.divideScalar( l / i.maxSpeed );
    }
    if (env.flat) i.velocity.setZ(0)     
    i.position.add( i.velocity );
    env.avoidWalls && walls.bounce()
    if (env.flat) i.position.setZ(i.position.z * flatteningRate)
    //console.log(i.position)
  }


  i.avoid = function ( target ) {
    var steer = new THREE.Vector3();
    steer.subVectors( i.position, target );
    steer.multiplyScalar( 1 / i.position.distanceToSquared( target ) );
    return steer;

  }

  i.convergeTo = function ( target, weight ) {
    i.acceleration.add(i.reach(target, weight ))
  }

  i.reach = function ( target, weight ) {
    var steer = new THREE.Vector3();
    steer.subVectors( target, i.position );
    steer.multiplyScalar( weight );
    return steer;
  }

  i.interact = function ( swarm , interact) {

    var distance, weight
    posSum = new THREE.Vector3(),
    steer = new THREE.Vector3(),
    count = 0;

    swarm.forEach(function(f){
      distance = f.position.distanceTo( i.position );
      if (distance>i.fieldOfVision) return
      weight = interact(i,f,distance)
      if ( weight ) {
        posSum.add( i.reach(f.position, weight ));
        count++;
      }
    })

    if ( count > 0 ) {
      posSum.divideScalar( count );

      steer.subVectors( posSum, i.position );
      var l = steer.length();

      if ( l > i.maxSteerForce ) {
        steer.divideScalar( l / i.maxSteerForce );
      }


      i.acceleration.add(posSum)
    }
    return steer;
  }

    return instance
  }
})
