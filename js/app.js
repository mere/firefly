define(["d3", 
  "./firefly"

  ], function(d3, f){
  return function(){
    var animFrame = window.requestAnimationFrame 
      || window.mozRequestAnimationFrame 
      || window.webkitRequestAnimationFrame 
      || window.msRequestAnimationFrame;

    var stage = d3.select(".stage")
      .attr("width", f.stageWidth)
      .attr("height", f.stageHeight)

    
    d3.select(".show-direction")
      .on("click", function(){
        stage.classed("show-direction", !stage.classed("show-direction"))
      })  

    for (var i=0;i<50;i++) add(i)

    setInterval(function(){
      tick()
      tick()
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
        firefly.dom.node
          .attr("transform", "translate(" + firefly.x + "," + firefly.y + ")");
        firefly.dom.direction
          .attr("x2", firefly.aimX*100)
          .attr("y2", firefly.aimY*100)
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

      firefly.dom.node = stage.append("g")
        

      firefly.dom.node
        .append("circle")
        .attr("r", firefly.w/2 )
        //.style("fill", firefly.color)
        .classed("firefly", true)

      firefly.dom.direction = 
        firefly.dom.node
        .append("line")
        .attr("class", "direction")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 100)
        .attr("y2", 0)

      firefly.dom.text = 
        firefly.dom.node
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 5)
        .attr("w", 10)
        .text(firefly.type)
    }

  }
})