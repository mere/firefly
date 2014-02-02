define([
  "three",
  "environment"
  ], function(THREE, env){
  return function(i){
    var instance = {}

    instance.loopAround = function () {
      if ( i.position.x >   env.width ) i.position.x = - env.width;
      if ( i.position.x < - env.width ) i.position.x =   env.width;
      if ( i.position.y >   env.height ) i.position.y = - env.height;
      if ( i.position.y < - env.height ) i.position.y =  env.height;
      if ( i.position.z >  env.depth ) i.position.z = - env.depth;
      if ( i.position.z < - env.depth ) i.position.z =  env.depth;
    }

    return instance
  } 

})