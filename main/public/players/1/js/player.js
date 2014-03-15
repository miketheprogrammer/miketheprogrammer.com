(function () {

  var
    //AUDIO_FILE        = '../songs/zircon_devils_spirit',
    AUDIO_FILE        = '/assets/music/distortedsoul+distortedsouldirty',
    PARTICLE_COUNT    = 4000,
    MAX_PARTICLE_SIZE = 50,
    MIN_PARTICLE_SIZE = .01,
    GROWTH_RATE       = 1.2,
    DECAY_RATE        = 0.5,

    BEAM_RATE         = 0.5,
    BEAM_COUNT        = 25,

    GROWTH_VECTOR = new THREE.Vector3( GROWTH_RATE, GROWTH_RATE, GROWTH_RATE ),
    DECAY_VECTOR  = new THREE.Vector3( DECAY_RATE, DECAY_RATE, DECAY_RATE ),
    beamGroup     = new THREE.Object3D(),
    particles     = group.children,
    colors        = [ 0xaaee22, 0x04dbe5, 0xff0077, 0xffb412, 0xf6c83d ],
    t, dancer, kick;

  /*
   * Dancer.js magic
   */

  Dancer.setOptions({
    flashSWF : '/assets/lib/soundmanager2.swf',
    flashJS  : '/assets/lib/soundmanager2.js'
  });

  dancer = new Dancer();

  var range_1 = range(0, 1200, 10);
  kick = dancer.createKick({
    onKick: function (mag) {
      var i;
      if ( particles[ 0 ].scale.x > MAX_PARTICLE_SIZE ) {
        decay(mag);
      } else {
        var r = range_1(mag);
        for ( i = PARTICLE_COUNT; i--; ) {
          particles[i].position.x = clamp1k(particles[i].position.x * randomVelocity()) * Math.sin(Math.random() * 100);
          particles[i].position.y = clamp(-1200,r+1,particles[i].position.y * randomVelocity());
          particles[i].position.z = clamp1k(particles[i].position.z * randomVelocity()) * Math.atan(Math.random() * 100);
          particles[ i ].scale.addSelf( GROWTH_VECTOR );
          particles[i].position.normalize();
          particles[i].position.multiplyScalar( Math.random() * 10 + 600 );
        }
      }
      if ( !beamGroup.children[ 0 ].visible ) {
        for ( i = BEAM_COUNT; i--; ) {
          beamGroup.children[ i ].visible = true;
        }
      }
    },
    offKick: decay
  });
  function range(start, end, inc) {
    var current = start;
    return function (magnifier) {
    var modifier = Math.floor(Math.random() * 100000);
    var direction = modifier & 1 === 1 ? -1 : 1;
      if (magnifier)
        current += (inc * (magnifier * 10) * direction);
      else current += inc;
      //console.log(current);
      if (current > end) {
        current = start;
      }
      return current;
    }
  }

  dancer.onceAt( 0, function () {
    kick.on();
  }).onceAt( 8.2, function () {
    scene.add( beamGroup );
  }).after( 8.2, function () {
    beamGroup.rotation.x += BEAM_RATE;
    beamGroup.rotation.y += BEAM_RATE;
  }).onceAt( 50, function () {
    changeParticleMat( 'white' );
  }).onceAt( 66.5, function () {
    changeParticleMat( 'pink' );
  }).onceAt( 75, function () {
    changeParticleMat();
  }).fft( document.getElementById( 'fft' ) )
    .load({ src: AUDIO_FILE, codecs: [  'mp3' ]})

  Dancer.isSupported() || loaded();
  !dancer.isLoaded() ? dancer.bind( 'loaded', loaded ) : loaded();

  /*
   * Three.js Setup
   */

  function on () {
    for ( var i = PARTICLE_COUNT; i--; ) {
      particle = new THREE.Particle( newParticleMat() );
      particle.position.x = Math.random() * 2000 - 1000;
      particle.position.y = Math.random() * 2000 - 1000;
      particle.position.z = Math.random() * 2000 - 1000;
      particle.scale.x = particle.scale.y = Math.random() * 10 + 5;
      particle.position.normalize();
      particle.position.multiplyScalar( Math.random() * 10 + 600 );
      group.add( particle );
    }
    scene.add( group );

    // Beam idea from http://www.airtightinteractive.com/demos/js/nebula/
    var
      beamGeometry = new THREE.PlaneGeometry( 5000, 50, 1, 1 ),
      beamMaterial, beam;

    for ( i = BEAM_COUNT; i--; ) {
      beamMaterial = new THREE.MeshBasicMaterial({
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        color: colors[ ~~( Math.random() * 5 )]
      });
      beam = new THREE.Mesh( beamGeometry, beamMaterial );
      beam.doubleSided = true;
      beam.rotation.x = Math.random() * Math.PI;
      beam.rotation.y = Math.random() * Math.PI;
      beam.rotation.z = Math.random() * Math.PI;
      beamGroup.add( beam );
    }
  }

  function decay (mag) {
    if ( beamGroup.children[ 0 ].visible ) {
      for ( i = BEAM_COUNT; i--; ) {
        beamGroup.children[ i ].visible = false;
      }
    }
    var r = range_1(mag);
    for ( var i = PARTICLE_COUNT; i--; ) {
          particles[i].position.x = clamp1k(particles[i].position.x * randomVelocity()) * Math.sin(Math.random() * 100);
          particles[i].position.y = clamp(-1200, r+1 ,particles[i].position.y * randomVelocity());
          particles[i].position.z = clamp1k(particles[i].position.z * randomVelocity()) * Math.atan(Math.random() * 100);
      if ( particles[i].scale.x - DECAY_RATE > MIN_PARTICLE_SIZE ) {
        particles[ i ].scale.subSelf( DECAY_VECTOR );
      }
          particles[i].position.normalize();
          particles[i].position.multiplyScalar( Math.random() * 10 + 600 );
    }
  }

  function changeParticleMat ( color ) {
    var mat = newParticleMat( color );
    for ( var i = PARTICLE_COUNT; i--; ) {
      if ( !color ) {
        mat = newParticleMat();
      }
      particles[ i ].material = mat;
    }
  }

  function newParticleMat( color ) {
    var
      sprites = [ 'pink', 'orange', 'yellow', 'blue', 'green' ],
      sprite = color || sprites[ ~~( Math.random() * 5 )];

    return new THREE.ParticleBasicMaterial({
      blending: THREE.AdditiveBlending,
      size: MIN_PARTICLE_SIZE,
      map: THREE.ImageUtils.loadTexture('images/particle_' + sprite + '.png'),
      vertexColor: 0xFFFFFF
    });
  }
  function randomVelocity() {
    var modifier = Math.floor(Math.random() * 100000);
    var direction = modifier & 1 === 1 ? -1 : 1;
    return (Math.random() * 10) * direction;
  }
  function clamp(min, max, value) {
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  }
  clamp1k = clamp.bind(null, -500, 500);
  function loaded () {
    var
      loading = document.getElementById( 'loading' ),
      anchor  = document.createElement('A'),
      supported = Dancer.isSupported(),
      p;

    anchor.appendChild( document.createTextNode( supported ? 'Play!' : 'Close' ) );
    anchor.setAttribute( 'href', '#' );
    loading.innerHTML = '';
    loading.appendChild( anchor );

    if ( !supported ) {
      p = document.createElement('P');
      p.appendChild( document.createTextNode( 'Your browser does not currently support either Web Audio API or Audio Data API. The audio may play, but the visualizers will not move to the music; check out the latest Chrome or Firefox browsers!' ) );
      loading.appendChild( p );
    }

    anchor.addEventListener( 'click', function () {
      dancer.play();
      document.getElementById('loading').style.display = 'none';
    }, false );

  }

  on();

  // For debugging
  window.dancer = dancer;

})();
