define([], function(){
  
  var mob = []
  function factory(){
    var i, instance = i = {}
    mob.push(instance)

    instance.x = 0
    instance.y = 0
    instance.w = 10
    instance.h = 10

    // read only
    instance.desiredX = 0;
    instance.desiredY = 0;
    instance.aimX = 0;
    instance.aimY = 0;

    instance.direction = 0 //0..360 degrees
    instance.desiredDirection = 0 //0..360degrees
    instance.velocity = 0
    instance.desiredVelocity = 0

    instance.turningSpeed = .05 // 0..1 slow turn to turn instantly
    instance.acceleration = .0005 // 0..1 how fast can the desired speed be achieved
    
    instance.mood = 0 // -1..1: unhappy to happy
    instance.sight = 100 //px: how far can they see?
    instance.attractionWeight = .05 //0..1
    instance.repellenceWeight = 1 //0..1
    instance.maxSpeed = 1 //px
    instance.comfortZone = 30 //px: move away from other fireflies that are too close
    instance.id = mob.length
    instance.dom = {}
    instance.bounce = 1 //px
    instance.dampening = 0.99 //0..1: instant stop to slow speed decrease
    // soduku specific:
    instance.type = 0
    
    /**
     *  calculate the next move
     */
    instance.tick = function(){
      i.velocity *= i.dampening
      
      i.desiredX = i.x;
      i.desiredY = i.y;
      var desiredPoint = interact()

      if (desiredPoint) {
        i.desiredX = desiredPoint.x;
        i.desiredY = desiredPoint.y;

        i.desiredDirection = point2Direction(desiredPoint)
        i.desiredVelocity = i.distanceTo(desiredPoint.x, desiredPoint.y)
        //console.log("i.desiredVelocity",i.desiredVelocity)
        //calculate new direction and velocity
        var theta = (i.desiredDirection-i.direction)
        if (theta>180) theta -= 360
        if (theta<-180) theta += 360
        i.direction = i.direction + theta*i.turningSpeed  

        var acceleration = i.acceleration* (1-(theta/180))

        i.velocity = Math.min(i.maxSpeed, i.velocity + (i.desiredVelocity-i.velocity)*acceleration)
      }

      
      //console.log("dir", i.direction, i.desiredDirection, desiredPoint)
      
      // bounce off walls
      if (i.x<0) { i.x=0; i.direction = 180-i.direction}
      if (i.y<0) { i.y=0; i.direction = 360-i.direction}
      if (i.x>factory.stageWidth-i.w) { 
        i.x=factory.stageWidth-i.w; 
        i.direction = 180-i.direction
      }
      if (i.y>factory.stageHeight-i.h) { 
        i.y=factory.stageHeight-i.h; 
        i.direction = 360-i.direction}

      if (i.direction<0) i.direction+=360

      // calculate new point
      var r = degree2radian(i.direction)
      i.aimX = i.velocity * Math.cos(r)
      i.aimY = i.velocity * Math.sin(r)
      i.x += i.aimX;
      i.y += i.aimY;
      
    }

    function radian2degree(r) {return r * 57.295779513082}
    function degree2radian(d) {return d * 0.017453292519}

    function point2Direction(point){
      return radian2degree(Math.atan2(point.y-i.y,point.x-i.x))
    }
    // calculate interaction with other fireflies
    function interact(){
      var attractX=0, attractY=0, attractionWeights=0, num
      var repelX=0, repelY=0, repellenceWeights=0

      mob.forEach(function(f){
        if (f==i) return

        
        var d = i.distanceTo(f.x, f.y)
        var weight
        if (d<i.sight) {
          if (d<i.comfortZone || f.type==i.type){
            weight = (d/i.comfortZone)
            repelX += f.x*weight
            repelY += f.y*weight
            repellenceWeights += weight
          }
          else {
            attractX += f.x
            attractY += f.y
            attractionWeights += 1
          }
        }
      })

      repelX /= repellenceWeights
      repelY /= repellenceWeights
      var repelTargetX = i.x+(i.x-repelX)*i.repellenceWeight
      var repelTargetY = i.y+(i.y-repelY)*i.repellenceWeight

      attractX /= attractionWeights
      attractY /= attractionWeights
      var attractTargetX = i.x+(attractX-i.x)*i.attractionWeight
      var attractTargetY = i.y+(attractY-i.y)*i.attractionWeight

      if (repellenceWeights && attractionWeights) {
        return { x:(repelTargetX +attractTargetX)/2, y:(repelTargetY +attractTargetY)/2 }
      }
      else if (repellenceWeights) return { x:repelTargetX, y:repelTargetY  }
      else if (attractionWeights) return { x:attractTargetX, y:attractTargetY  }
      return null
      
    }

    /**
     *  move closer to, or move away from a given point
     */
    function convergeTo(x,y, strength){
      var dx = x-i.x
      var dy = y-i.y
      var absX = Math.abs(dx)
      var absY = Math.abs(dy)
      var dx0, dy0
      var steep = (absX > absY)
      var ratio = steep? absY/(absX||0.0001) :absX/(absY||0.0001)

      dx0 = (steep?1:ratio) * ((dx>0)?1:-1)
      dy0 = (!steep?1:ratio) * ((dy>0)?1:-1)
      instance.dx += dx0 * strength
      instance.dy += dy0 * strength
    }


    instance.distanceTo = function(x, y){
      return  Math.sqrt(Math.pow(i.x-x,2)+Math.pow(i.y-y,2))
    }
    return instance;
  }

  factory.mob = mob
  factory.stageWidth = 600
  factory.stageHeight = 600
  
  return factory
})