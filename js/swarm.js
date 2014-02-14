define(
  [
    "three",
    "firefly",
    "environment",
    "./behaviours/mouse"
  ], function(
    THREE,
    firefly,
    environment,
    mouse
  ){
    
    var camera, scene, renderer
    var swarm
    var stats

    updateScreenSize()
    
      init();

    animate();

    function updateScreenSize(){
      environment.width = 600//window.innerWidth
      environment.height = 600//window.innerHeight
      environment.depth = 500
    }

    function init() {
      swarm = []

      camera = new THREE.PerspectiveCamera( 75, environment.width / environment.height, 1, 10000 )
      camera.position.z = 800
      
      var controls = new THREE.OrbitControls( camera );

      scene = new THREE.Scene()

      var ambientLight = new THREE.AmbientLight(0x333333);
      scene.add(ambientLight);

      var light = new THREE.PointLight( 0x999999, 1, 400 );
      light.position.set( 0, 0, 0 );
      scene.add( light );
      mouse.light = light

      var light2 = new THREE.PointLight( 0x999999, 1, 400 );
      light2.position.set( 0, 0, 0 );
      scene.add( light2 );
      

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize( environment.width, environment.height );

      document.body.appendChild( renderer.domElement );

      if (window.Stats){
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.getElementById( 'container' ).appendChild(stats.domElement);
      }
  
      //window.addEventListener( 'resize', onWindowResize, false );
    }

    function onWindowResize() {
      updateScreenSize()
      camera.aspect = environment.width / environment.height;
      camera.updateProjectionMatrix();

      renderer.setSize( environment.width, environment.height );

    }

    function animate() {
      requestAnimationFrame( animate );
      render();
      stats && stats.update();
    }

    function render() {

      swarm.forEach(function(f){
        f.tick( swarm , interact);
        
        if (!environment.flat) {
          var color = f.color;
          var hsl = color.getHSL()
          var s = ( environment.width/2 + f.position.z ) / environment.width
          f.renderedColor.setHSL(hsl.h, hsl.s, hsl.l)
        }
        else f.renderedColor.copy(f.color)
      })
      
      renderer.render( scene, camera );
    }

    var instance = {}
      , onCreate
      , interact
    var particles = new THREE.Geometry;
    var particleSystem
    var material = new THREE.ParticleBasicMaterial({
      color: 0xFFFFFF,
      size: 10,
      vertexColors: true,
      //map: THREE.ImageUtils.loadTexture(
      //       "../images/particle.png"
      //)
      //blending: THREE.AdditiveBlending,
      //transparent: true
    })
    instance.add = function(num){
      for ( var n = 0; n < num; n ++ ) {
        var firefly = create(n)
        swarm[n] = firefly
      }
      particles.colors = swarm.map(function(f){ return f.renderedColor})
      particleSystem = new THREE.ParticleSystem(particles, material);
      particleSystem.sortParticles = true;
      scene.add( particleSystem);
      return instance
    }

    

    function create(n){
      try{
      var i = firefly();
      i.position.x = Math.random() * environment.width - environment.width/2;
      i.position.y = Math.random() * environment.width - environment.width/2;
      i.position.z = (environment.flat)?0: (Math.random() * environment.width - environment.width/2)
      i.velocity.x = Math.random() * 2 - 1;
      i.velocity.y = Math.random() * 2 - 1;
      i.velocity.z = Math.random() * 2 - 1;
      
      onCreate && onCreate(i,n)
      particles.vertices.push(i.position);
      }
    catch(e){console.error(e)}
      return i
    }

    instance.onCreate = function(value){
      if (!arguments.length) return onCreate
      onCreate = value
      return instance
    }

    instance.interact = function(value){
      if (!arguments.length) return interact
      interact = value
      return instance
    }

    return instance

})

