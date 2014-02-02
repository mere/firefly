define([
  "d3",
  "three",
  "environment"
  ], function(d3,THREE, environment){

  d3.select('html')
    .on('mousemove', function()
      {
        var mouse = d3.mouse(this);
        mouseBehaviour.x = (mouse[0] - environment.width/2)*2
        mouseBehaviour.y = (-mouse[1] + environment.height/2)*2
        if (mouseBehaviour.light) mouseBehaviour.light.position.set(
          mouseBehaviour.x,
          mouseBehaviour.y,
          environment.depth/2 
        )
      }
    )

  function mouseBehaviour(f){
    var instance = {}
      , vector = new THREE.Vector3()
      instance.id = Math.random()

    instance.attract = function(weight){
      if (!mouseBehaviour.x) return
      vector.set(
        mouseBehaviour.x,
        mouseBehaviour.y,
        f.position.z );

      distance = f.position.distanceTo( vector );
      if (distance< environment.mouseFieldOfVision) {
        f.convergeTo( vector 
          , weight*(1-(distance/environment.mouseFieldOfVision)) );
      }
      
    }


    return instance
  } 

  
  return mouseBehaviour

})