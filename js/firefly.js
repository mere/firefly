define([], function(){
  
  var mob = []
  function factory(node){
    var i, instance = i = {}
    mob.push(instance)

    instance.x = 0
    instance.y = 0
    instance.w = 10
    instance.h = 10
    instance.direction = 0 //0..2PI radian angle
    instance.desiredDirection = 0 //0..2PI radian angle
    instance.velocity = 0
    instance.desiredVelocity = 0

    instance.turningSpeed = .5 // 0..1 slow turn to turn instantly
    instance.acceleration = .5 // 0..1 how fast can the desired speed be achieved
    
    instance.mood = 0 // -1..1: unhappy to happy
    instance.sight = 100 //px: how far can they see?
    instance.attractionWeight = 1 //0..1
    instance.repellenceWeight = 1 //0..1
    instance.maxSpeed = 1 //px
    instance.comfortZone = 30 //px: move away from other fireflies that are too close
    instance.id = mob.length
    instance.node = node
    instance.bounce = 1 //px
    instance.dampening = 0.92 //0..1: instant stop to slow speed decrease
    // soduku specific:
    instance.type = 0
    
    /**
     *  calculate the next move
     */
    instance.tick = function(){
      i.velocity *= i.dampening
      
      var desiredPoint = interact()
      i.desiredDirection = point2Direction(desiredPoint)
      i.desiredVelocity = Math.min(i.maxSpeed, i.distanceTo(desiredPoint.x, desiredPoint.y))

      //calculate new direction and velocity
      i.velocity = (i.desiredVelocity-i.velocity)

      if (i.x<0) { i.x=0; i.dx = i.bounce}
      if (i.y<0) { i.y=0; i.dy = i.bounce}
      if (i.x>factory.stageWidth-i.w) { i.x=factory.stageWidth-i.w; i.dx = -i.bounce}
      if (i.y>factory.stageHeight-i.h) { i.y=factory.stageHeight-i.h; i.dy = -i.bounce}
    }

    function point2Direction(point){
      return Math.atan2(point.y,point.x)
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
            w = i.repellenceWeight * (d/i.comfortZone)
            repelX += f.x*weight
            repelY += f.y*weight
            repellenceWeights += weight
          }
          else {
            attractX += f.x*i.attractionWeight
            attractY += f.y*i.attractionWeight
            attractionWeights += i.attractionWeight 
          }
        }
      })
      repelX /= repellenceWeights
      repelY /= repellenceWeights
      var repelTargetX = (i.x*2-repelX)
      var repelTargetY = (i.y*2-repelY)

      attractX /= attractionWeights
      attractY /= attractionWeights

      var targetX = (repelTargetX +attractX)/2
      var targetY = (repelTargetY +attractY)/2
      return { x:targetX, y:targetY }
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