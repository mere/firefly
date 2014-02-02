define([
  "three",
  "environment"
  ], function(THREE, env){
  return function(i){
    var instance = {}
      , vector = new THREE.Vector3()

    instance.avoid = function (weight){
        
        avoid(- env.width, i.position.y, i.position.z)
        avoid( env.width, i.position.y, i.position.z );
        avoid( i.position.x, - env.height, i.position.z );
        avoid( i.position.x, env.height, i.position.z );
        avoid( i.position.x, i.position.y, - env.depth );
        avoid( i.position.x, i.position.y, env.depth);
        
        function avoid(x,y,z){
          vector.set( x,y,z );
          vector = i.avoid( vector );
          vector.multiplyScalar( weight );
          i.acceleration.add( vector );
        }
    }

    instance.bounce = function() {
      var w = env.width// - env.wallThickness
      var h = env.height// - env.wallThickness
      var d = env.depth// - env.wallThickness
      var padding = 2
      //console.log(i.position)
      if      ( i.position.x >   w ) i.position.x = w-padding;
      else if ( i.position.x <  -w ) i.position.x =  - w+padding;
      if      ( i.position.y >   h ) i.position.y = h-padding;
      else if ( i.position.y < - h ) i.position.y = - h+padding;
      if      ( i.position.z >   d ) i.position.z = d-padding;
      else if ( i.position.z < - d ) i.position.z = - d+padding;
      //console.log(w,h,d,i.position)
    }
    return instance
  } 

})