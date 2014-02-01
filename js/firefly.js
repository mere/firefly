define([
  "three",
  "./fireflyObj",
  "./behaviours/walls",
  "./behaviours/mouse",
  "./environment"

  ], function(
    THREE,
    obj,
    wallBehaviour,
    mouseBehaviour,
    env
    ){
  return function(){

  var i, instance = i = {}
    , vector = new THREE.Vector3()
    , walls = wallBehaviour(i)
    , goal
    , _maxSpeed = 2
    , _maxSteerForce = 0.5
    , avoidWalls = false
    , flatteningRate = .95 //0..1:flatten instantly to flatten slowly
    , flattened = false
    
  i.type = Math.random()
  var mouse = mouseBehaviour(i)
  i.fieldOfVision = 100
  i.position = new THREE.Vector3();
  i.velocity = new THREE.Vector3();
  i.acceleration = new THREE.Vector3();
  var specular = new THREE.Color("#ffff00")
  var color = new THREE.Color("#ffff00").offsetHSL(0,0,-.1)
  var emissive = new THREE.Color("#ffff00").offsetHSL(0,0,-.5)
  i.mesh = new THREE.Mesh( 
        //new obj()
        //new THREE.SphereGeometry(10, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
        new THREE.SphereGeometry(5, 5, 5)
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

  

  i.avoidWalls = function ( value ) {
    if (!arguments.length) return avoidWalls
    avoidWalls = value
    return this
  }

  i.flattened = function(value){
    if (!arguments.length) return flattened
    flattened = value
    return this
  }

  i.goal = function(value){
    if (!arguments.length) return goal
    goal = value
    return this
  }

  i.tick = function ( swarm ) {

    if ( avoidWalls ) walls.avoid(5)
    //else i.checkBounds()
  
    goal && i.acceleration.add( i.reach( goal, 0.005 ) );

    //i.acceleration.add( i.alignment( swarm ) );
    i.acceleration.add( i.cohesion( swarm ) );
    i.acceleration.add( i.separation( swarm ) );
    
    
    mouse.attract(-.01)

    i.move();

  }

  i.move = function () {
    i.velocity.add( i.acceleration );
    var l = i.velocity.length();
    if ( l > _maxSpeed ) {
      i.velocity.divideScalar( l / _maxSpeed );
    }
    if (flattened) i.velocity.setZ(0)     
    i.position.add( i.velocity );
    avoidWalls && walls.bounce()
    if (flattened) i.position.setZ(i.position.z * flatteningRate)
    
    i.acceleration.set( 0, 0, 0 );
  }

  i.loopAround = function () {
    if ( i.position.x >   width ) i.position.x = - width;
    if ( i.position.x < - width ) i.position.x =   width;
    if ( i.position.y >   height ) i.position.y = - height;
    if ( i.position.y < - height ) i.position.y =  height;
    if ( i.position.z >  depth ) i.position.z = - depth;
    if ( i.position.z < - depth ) i.position.z =  depth;
  }

  

  i.avoid = function ( target ) {

    var steer = new THREE.Vector3();
    steer.subVectors( i.position, target );
    steer.multiplyScalar( 1 / i.position.distanceToSquared( target ) );

    return steer;

  }

  i.convergeTo = function ( target, weight ) {
    distance = i.position.distanceTo( target );
    if (distance < i.fieldOfVision) {
      i.acceleration.add(i.reach(target, weight ))
    }
  }

  i.reach = function ( target, weight ) {
    var steer = new THREE.Vector3();
    steer.subVectors( target, i.position );
    steer.multiplyScalar( weight );
    return steer;
  }

  i.alignment = function ( swarm ) {

    var boid, velSum = new THREE.Vector3(),
    count = 0;

    swarm.forEach(function(f){
      distance = f.position.distanceTo( i.position );
      if ( distance >0 && distance <= i.fieldOfVision ) {
        velSum.add( f.velocity );
        count++;
      }
    })
    
    if ( count > 0 ) {

      velSum.divideScalar( count );

      var l = velSum.length();

      if ( l > _maxSteerForce ) {

        velSum.divideScalar( l / _maxSteerForce );

      }

    }

    return velSum;

  }

  i.cohesion = function ( swarm ) {

    var boid, distance,
    posSum = new THREE.Vector3(),
    steer = new THREE.Vector3(),
    count = 0;

    swarm.forEach(function(f){
      distance = f.position.distanceTo( i.position );

      if ( distance >0 && distance <= i.fieldOfVision ) {

        posSum.add( f.position );
        count++;

      }

    })

    if ( count > 0 ) {

      posSum.divideScalar( count );

    }

    steer.subVectors( posSum, i.position );

    var l = steer.length();

    if ( l > _maxSteerForce ) {

      steer.divideScalar( l / _maxSteerForce );

    }

    return steer;

  }

  i.separation = function ( swarm ) {

    var distance,
    posSum = new THREE.Vector3(),
    repulse = new THREE.Vector3();

    swarm.forEach(function(f){

      distance = f.position.distanceTo( i.position );

      if ( distance >0 && distance <= i.fieldOfVision ) {

        repulse.subVectors( i.position, f.position );
        repulse.normalize();
        repulse.divideScalar( distance );
        posSum.add( repulse );
      }

    })

    return posSum;

  }

    return instance
  }
})
