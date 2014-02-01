define([], function(){

  // be attracted to other fireflies in your field of view
  return function(weight){
    return function(i, swarm){
    var attractX=0
      , attractY=0
      , attractionWeights=0

    swarm.forEach(function(f){
          if (f==i) return
          var d = i.distanceTo(f.x, f.y)
            , weight
          
          if (d<i.fieldOfVision && weight(i,f)!=0) {
              var weight = ((d-i.comfortZone)/(i.fieldOfVision-i.comfortZone))
              attractX += f.x*weight
              attractY += f.y*weight
              attractionWeights += weight
            }
          }
        })

        attractX /= attractionWeights
        attractY /= attractionWeights
        var attractTargetX = i.x+(attractX-i.x)*i.attractionWeight
        var attractTargetY = i.y+(attractY-i.y)*i.attractionWeight
        
        if (attractionWeights) return { 
          x:attractTargetX, 
          y:attractTargetY 
        }
      }
    }
  }
  
  
})