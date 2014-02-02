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
      environment.width = window.innerWidth
      environment.height = window.innerHeight
      environment.depth = 200
    }

    function init() {
      swarm = []

      camera = new THREE.PerspectiveCamera( 75, environment.width / environment.height, 1, 10000 )
      camera.position.z = environment.depth*3 * environment.width / environment.height
      
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
  
      window.addEventListener( 'resize', onWindowResize, false );
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
        //f.position.copy(mouse.light.position)
        //f.mesh.rotation.y = Math.atan2( - f.velocity.z, f.velocity.x );
        //f.mesh.rotation.z = Math.asin( f.velocity.y / f.velocity.length() );

        if (!environment.flat) {
          var color = f.mesh.material.color;
          var hsl = color.getHSL()
          var s = ( environment.width/2 + f.position.z ) / environment.width
          color.setHSL(hsl.h, s, s)
        }
      })
      
      renderer.render( scene, camera );
    }

    var instance = {}
      , onCreate
      , interact

    instance.add = function(num){
      for ( var n = 0; n < num; n ++ ) {
        var firefly = create(n)
        swarm[n] = firefly
        scene.add( firefly.mesh );
      }
      return instance
    }

    function create(n){
      var i = firefly();
      i.position.x = Math.random() * environment.width - environment.width/2;
      i.position.y = Math.random() * environment.width - environment.width/2;
      i.position.z = (environment.flat)?0: (Math.random() * environment.width - environment.width/2)
      i.velocity.x = Math.random() * 2 - 1;
      i.velocity.y = Math.random() * 2 - 1;
      i.velocity.z = Math.random() * 2 - 1;
      
      i.mesh.position = i.position;
      onCreate && onCreate(i,n)
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

