function Play(file, viz_id) {
  if (!window.dancers) {
    window.dancers = {};
  }
  if (window.dancer) {
    window.dancer.pause();
    delete window.dancer;
  }

  var
    AUDIO_FILE = '/assets/music/distortedsoul+distortedsoul'+file,
    //AUDIO_FILE = '/assets/dancer/examples/songs/zircon_devils_spirit',
    fft = document.getElementById( viz_id ),
    ctx = fft.getContext( '2d' ),
    dancer, kick;

    console.log(fft);
  /*
   * Dancer.js magic
   */
  Dancer.setOptions({
    flashSWF : '/assets/lib/soundmanager2.swf',
    flashJS  : '/assets/lib/soundmanager2.js'
  });

  dancer = new Dancer();
  kick = dancer.createKick({
    onKick: function () {
      ctx.fillStyle = '#ff0077';
    },
    offKick: function () {
      ctx.fillStyle = '#666';
    }
  }).on();

  dancer
    .fft( fft, { fillStyle: '#666' })
    .load({ src: AUDIO_FILE, codecs: [ 'mp3' ]});

  Dancer.isSupported() || loaded();
  !dancer.isLoaded() ? dancer.bind( 'loaded', loaded ) : loaded();

  /*
   * Loading
   */

  function loaded () {
    dancer.play();
    //window.dancers[file] = dancer;
  }

  // For debugging
  window.dancer = dancer;

};
