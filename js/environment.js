define([], function(){
  return {

    width:  500,
    height: 500,
    depth:  500,
    speed:  1, //relative speed of time
    flat:   true, // 2d or 3d?
    mouseForce: .1, // 
    mouseFieldOfVision: .1, // field of view for the mouse
    wallRepelForce: .1,
    wallThickness: 10,
    avoidWalls: true // boiunce back from walls

  }
})
