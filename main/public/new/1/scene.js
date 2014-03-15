Dancer.setOptions({
    flashSWF : '/assets/lib/soundmanager2.swf',
    flashJS  : '/assets/lib/soundmanager2.js'
});
Dancer.sampleRate = 44100;
Dancer.sampleSize = 2048;
window.x = 1;
window.world = {}
world.init = function (options) {
  world.items = [];
  world.music = new Dancer();
  world.music.onceAt( 0, function () {
        world.music.kick.on();
  })
  world.music.load(options.music);
  
  function loaded () {
    world.music.mag = 0;
    world.music.kick = world.music.createKick({
      onKick: function (mag) {
        world.music.mag = mag;
      },
      offKick: function (mag) {
        world.music.mag = mag;
      }
    });
    world.music.kick.on();
    world.music.play();
  };
  world.music.bind( 'loaded', loaded );
}
var Scene = function(options){
      this.particles = new THREE.Geometry();

      this.init = function()
      {
        this.options = $.extend({
            move        : function(){}
          , populate      : function(){}
          , color       : 0xFFFFFF
          , transparent     : true
          , opacity     : 1//1
          , blending      : THREE.AdditiveBlending
        },options);
        this.move     = this.options.move;
        this.populate = this.options.populate;
        this.populate();
      };
      
      this.addToScene = function(){
        console.log('Add to scene' + this.models.length);
        var   l = this.models.length
          , i = 0
          ;
        for (i;i<l;++i)
        {
          world.scene.add(this.models[i].mesh);
        } 
      }
      
      this.init();
      return this; 
    }

fluent = {
  util: {
    /**
   * some waves :
   * @param {Object} i
   * @param {Object} freq
   * @param {Object} phase
   * @param {Object} width
   * @param {Object} center
   */
    wave: function(i, freq, phase, width, center){
      return Math.round(Math.sin(freq * i + phase) * width + center);
    }
    ,wavec: function(i, freq, phase, width, center){
      return Math.round(Math.cos(freq * i + phase) * width + center);
    }
    , wavef: function(i, freq, phase, width, center){
      return Math.sin(freq * i + phase) * width + center;
    }
    , wavefc: function(i, freq, phase, width, center){
      return Math.cos(freq * i + phase) * width + center;
    } /**
   * do a color gradiant
   */
    , gradiant: function(i, frequency, phase, center, width){
      i = i || 0;
      center = center || 128;
      width = width || 127;

      return {
        i: ++i,
        color: {
          r: this.wave(i, frequency.r, phase.r, width, center),
          g: this.wave(i, frequency.g, phase.g, width, center),
          b: this.wave(i, frequency.b, phase.b, width, center)
        }
      }
    }
    /**
     * convert RGB to hexa ex : 255,255,255 : FFFFFF
     */
    ,rgbToHex : function (r,g,b) {
      return parseInt(''+(1 << 24 | r << 16 | g << 8 | b).toString(16).substr(1),16);
    }
  }
};

danceFloor = {
        blending      : THREE.AdditiveBlending
      , vertexColors    : THREE.VertexColors
      , populate      : function(){
        var vx = 0,vz = 0;
        this.models = [];
        for (var i = -50;i<50;++i)
        {
          ++vx;
          vz = 1;
          for (var j = -4;j<4;++j)
          {
            ++vz;
            var m = {
              material : new THREE.MeshLambertMaterial( { 
                  color     : 0xffcc00
                ,  wireframe  : false
                , opacity   : .4
                , shading   : THREE.SmoothShading//THREE.SmoothShading
                , blending    : THREE.NormalBlending//THREE.AdditiveBlending//THREE.NormalBlending
                , emissive    : fluent.util.rgbToHex(0,vz*10,vx*2)
                // , map    : THREE.ImageUtils.loadTexture("img/pub.jpg")
                , transparent : true
                } )
              ,vx : vx
              ,vz : vz
            };
            m.mesh = new THREE.Mesh( new THREE.CubeGeometry( 150, 250, 40),m.material );
            m.mesh.position.z = i*40;
            m.mesh.position.x = j*150;
            m.color = {
                r : m.mesh.material.emissive.r 
              , g : m.mesh.material.emissive.g 
              , b : m.mesh.material.emissive.b 
            };
            this.models.push(m);
          }
        }
      }
      , move        : function()
      {
        // reality.camera.position.y += ( reality.mouse.y - reality.camera.position.y ) * .05;
        // this.camera.position.y += Math.floor( - this.mouse.y - this.camera.position.y ) * .05;
        var   l = this.models.length
          , i = 0
          ;
        world.music.spectrum = world.music.getSpectrum();
        for (i;i<l;++i)
        {
          this.models[i].mesh.position.y = world.music.spectrum[this.models[i].vx]*10/(this.models[i].vz/400);
          this.models[i].mesh.material.emissive.r = world.music.spectrum[this.models[i].vx]*20;
          this.models[i].mesh.material.emissive.g = this.models[i].color.g + world.music.mag;
          // this.models[i].mesh.rotation.y += reality.music.mag;
          // this.models[i].mesh.rotation.z -= reality.music.mag;
          // this.models[i].mesh.rotation.z += reality.music.mag;

          // this.models[i].mesh.material.emissive.b = this.models[i].color.b + reality.music.mag;
        } 
      }
      , opacity     : .8
      }; 

(function() {
      var container, stats;

      var camera, scene, renderer;


      world.init({music:{src:'/stream', codecs:['mp3']}})
      init();
      animate();
      function init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 20000 );
        camera.position.set( -2700, -3500, 320 );
        camera.position.x = 1200;
        camera.position.y = 1200;
        camera.position.z = 000;

        scene = new THREE.Scene();
        world.scene = scene;
        var light, object;

        scene.add( new THREE.AmbientLight( 0x404040 ) );

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0, 1, 0 );
        scene.add( light );

        var map = THREE.ImageUtils.loadTexture( 'textures/UV_Grid_Sm.jpg' );
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;

        var material = new THREE.MeshLambertMaterial( { ambient: 0xbbbbbb, color: 0xCC0000} );

        var points = [];

        for ( var i = 0; i < 50; i ++ ) {

          points.push( new THREE.Vector3( Math.cos( i * 250 ) * Math.atan( i * -3 ) * 15 + 50, 0, ( i - 5 ) * 1 ) );

        }

        object = new THREE.Mesh( new THREE.LatheGeometry( points, 20 ), material );
        object.position.set( -400, 0, -200 );
        //scene.add( object );

        //danceFloor.populate()
        //danceFloor.models[0].mesh.position.set( -400, 0, -200 );
        world.items[0] = new Scene(danceFloor);
        world.items[0].addToScene();

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );

        container.appendChild( renderer.domElement );

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild( stats.domElement );

        //

        window.addEventListener( 'resize', onWindowResize, false );

      }

      function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

      }

      //

      function animate() {

        requestAnimationFrame( animate );
        world.items[0].move();
        render();
        stats.update();

      }

      function render() {

        var timer = Date.now() * 0.0001;

        //camera.position.x = 100;
        //camera.position.z = 400;
        camera.lookAt(world.scene.position);
        if (danceFloor.models) camera.lookAt( danceFloor.models[50].mesh.position );
/*
        for ( var i = 0, l = scene.children.length; i < l; i ++ ) {

          var object = scene.children[ i ];

          //object.rotation.x = timer * 5;
          //object.rotation.y = timer * 2.5;

        }
*/
        renderer.render( scene, camera );

      }


})();