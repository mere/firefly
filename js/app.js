define([
  "d3",
  "stage", 
  "./firefly"

  ], function(d3, stage, f){
  return function(){
    var animFrame = window.requestAnimationFrame 
      || window.mozRequestAnimationFrame 
      || window.webkitRequestAnimationFrame 
      || window.msRequestAnimationFrame;

    
    d3.select(".show-direction")
      .on("click", function(){
        stage.classed("show-direction", !stage.classed("show-direction"))
      })  

    for (var i=0;i<5;i++) add(i)

    setInterval(function(){
      tick()
      tick()
    }, 1)
    animFrame(render)

    function tick(){
      f.mob.forEach(function(firefly){
        firefly.tick()
      })
    }

    function render(){
      f.mob.forEach(function(firefly){
        
        // firefly.dom.node
        //   .attr("transform", "translate(" + firefly.x + "," + firefly.y + ")");
        // firefly.dom.direction
        //   .attr("x2", firefly.aimX*100)
        //   .attr("y2", firefly.aimY*100)
      })
      animFrame(render)

    }

    function add(i){
      var firefly = f()
      
      firefly.type = i
      firefly.x = Math.random()*f.stageWidth
      firefly.y = Math.random()*f.stageHeight
      firefly.direction = Math.random()*360
      firefly.velocity = .1
      firefly.color = "green" 

      stage.add(firefly)
    }

  }
})