(function() {
  var container;
  var renderer, particle;
  var mouseX = 0, mouseY = 0;

  var stats = new Stats();
  stats.domElement.id = 'stats';
  document.getElementById('info').insertBefore( stats.domElement, document.getElementById('togglefft') );

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  
  // Expose these for the demo
  window.rotateSpeed = 1;
  window.scene = new THREE.Scene();
  window.group = new THREE.Object3D();
  window.camera;

  init();
  animate();

  function init() {
    container = document.getElementById('cvs-container');
    //document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
    camera.position.z = 1000;

    scene.add( camera );
    scene.add( group );

    renderer = new THREE.CanvasRenderer();
    var aspect = window.innerWidth / window.innerHeight;
    renderer.setSize( window.innerWidth / 2.5, window.innerHeight / 2.5);
    container.style.width = window.innerWidth / 3;
    container.style.height = window.innerHeight / 3;

    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'touchstart', onDocumentTouch, false );
    document.addEventListener( 'touchmove', onDocumentTouch, false );
  }

  function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
  }

  function onDocumentTouch( event ) {
    if ( event.touches.length == 1 ) {
      event.preventDefault();
      mouseX = event.touches[ 0 ].pageX - windowHalfX;
      mouseY = event.touches[ 0 ].pageY - windowHalfY;
    }
  }

  function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
  }

  var t = 0;
  function render() {
    camera.position.x = Math.sin(t * 0.005 * rotateSpeed) * 1000;
    camera.position.z = Math.cos(t * 0.005 * rotateSpeed) * 1000;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.01;
    camera.lookAt( scene.position );
    t++;
    renderer.render( scene, camera );
  }
})();
