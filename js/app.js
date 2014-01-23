define(["d3", "./firefly"], function(d3, f){
  return function(){
    var animFrame = window.requestAnimationFrame 
      || window.mozRequestAnimationFrame 
      || window.webkitRequestAnimationFrame 
      || window.msRequestAnimationFrame;

    var stage = d3.select(".stage")
      

    for (var i=0;i<30;i++) add()

    tick()
    animFrame(render)

    function tick(){
      f.mob.forEach(function(firefly){
        firefly.tick()
      })
    }

    function render(){
      f.mob.forEach(function(firefly){
        firefly.node
          .style("left", firefly.x+"px")
          .style("top", firefly.y+"px")
      })
      tick()
      setTimeout(function(){animFrame(render)},3)

    }

    function add(){
      var node = stage
        .append("div")
        .classed("firefly", true)
      
      var firefly = f()
      firefly.node = node
      firefly.type = Math.random()
      firefly.x = Math.random()*f.stageWidth
      firefly.y = Math.random()*f.stageHeight
      firefly.dx = Math.random()*6-3
      firefly.dy = Math.random()*6-3
    }

  }
})