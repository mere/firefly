define([], function(){
  
  var mob = []
  function factory(node){
    var i, instance = i = {}
    mob.push(instance)

    instance.x = 0
    instance.y = 0
    instance.w = 10
    instance.h = 10
    instance.dx = 0
    instance.dy = 0
    instance.mood = 0 // -1..1: unhappy to happy
    instance.sight = 100 //px: how far can they see?
    instance.attraction = .01 //px
    instance.repellence = 1 //px
    instance.maxSpeed = 1 //px
    instance.comfortZone = 30 //px: move away from other fireflies that are too close
    instance.id = mob.length
    instance.node = node
    instance.bounce = 1 //px
    instance.dampening = 0.92 //0..1: instant stop to slow speed decrease
    // soduku specific:
    instance.num = 0
    
    /**
     *  calculate the next move
     */
    instance.tick = function(){
      i.dx *= i.dampening
      i.dy *= i.dampening
      // calculate interaction with other fireflies
      mob.forEach(function(f){
        if (f==i) return
        
        var d = i.distanceTo(f.x, f.y)
        if (d<i.comfortZone) convergeTo(f.x, f.y, -i.repellence)
        else if (d<i.sight) convergeTo(f.x, f.y, (f.num==i.num)? -i.repellence : i.attraction)
      })

      var speedRatio = i.maxSpeed/Math.sqrt(i.dx*i.dx+i.dy*i.dy)
      
      if (speedRatio<1) {
        i.dx *= speedRatio
        i.dy *= speedRatio
        //console.log(speedRatio, i.dx, i.dy)
      } 
      i.x += i.dx
      i.y += i.dy

      if (i.x<0) { i.x=0; i.dx = i.bounce}
      if (i.y<0) { i.y=0; i.dy = i.bounce}
      if (i.x>factory.stageWidth-i.w) { i.x=factory.stageWidth-i.w; i.dx = -i.bounce}
      if (i.y>factory.stageHeight-i.h) { i.y=factory.stageHeight-i.h; i.dy = -i.bounce}
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