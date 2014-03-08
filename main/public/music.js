window.Setup = function() {
  var $ = function(id) {return document.getElementById(id);};
  var screenWidth = 400;
  var screenHeight = 400;

  var canvas, ctx;
  var permCanvas, permCtx;

  soundManager.flashVersion = 9;
  soundManager.flash9Options.useEQData = true;
  soundManager.flash9Options.useWaveformData = true;
  soundManager.useHighPerformance = true;
  soundManager.flashLoadTimeout = 3000;
  soundManager.waitForWindowLoad = true;
  soundManager.debugMode = false;

  var music;
  var musicLoaded = false;

  var numEqBars = 9;
  var eqBarValues;
  var eqBarValuesLast;
  var eqBarInterval = 256 / numEqBars;
  var eqBarWidth = screenWidth/numEqBars - 2;
  var eqBarSpace = (numEqBars+1) / numEqBars * 2;


  var eqValues16 = [];
  var eqData;
  var waveData;
  var waveDataLast;

  var atan2 = Math.atan2;
  var sqrt = Math.sqrt;
  var cos = Math.cos;
  var sin = Math.sin;
  var PI = Math.PI;
  var PI2 = Math.PI * 2;
  var DEG2RAD = Math.PI / 180;
  var random = Math.random;

  var whilePlaying = function() {
  boidMode = boidModes.AUTO;

  waveData = this.waveformData;
  this.waveformData = [];
  if (waveData.length == 0)
    $("buglayer").style.display = "block";



  eqBarValues = [0,0,0,0,0,0,0,0,0];
  eqValues16 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  var b1 = 0, b2 = 0, b3 = 0, b4 = 0;
  for (var i=0;i<256;i++){
    if (i < 64)
      b1 += this.eqData[i];
    else if (i < 128)
      b2 += this.eqData[i];
    else if (i < 192)
      b3 += this.eqData[i];
    else
      b4 += this.eqData[i];

    eqBarValues[(i/eqBarInterval)>>0] += this.eqData[i];

    eqValues16[(i/16)>>0] += this.eqData[i];
    }
  }
  function render(boids) {
    ctx.clearRect(0,0,screenWidth,screenHeight);
    ctx.lineWidth = 0.7;

    if (!(music && musicLoaded))
      return;

    if (settings.drawWaveform) {
      if (settings.drawWaveformEcho && waveDataLast) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        var step = 16;
        for (var i=0;i<256;i+=step) {
          var l = (i/(256-step)) * screenWidth;
          var t = (20 + waveDataLast[i] * 10);
          if (i==0) {
            ctx.moveTo(l,t);
          } else {
            ctx.lineTo(l,t);
          }
        }
        ctx.stroke();
      }
      if (waveData && waveData.length) {
        waveDataLast = waveData;

        ctx.beginPath();
        ctx.strokeStyle = "black";
        var step = 8;

        var posStep = (music.position / music.durationEstimate * 256) >> 0;

        for (var i=0;i<256;i+=step) {
          var l = (i/(256-step)) * screenWidth;
          var t = (20 + waveData[i] * 10);
          if (i==0) {
            ctx.moveTo(l,t);
          } else {
            ctx.lineTo(l,t);
          }
        }
        ctx.stroke();

        var l = (posStep/(255)) * screenWidth;
        var t = (20 + waveData[posStep] * 10);
        ctx.fillRect(l-2,t-2,4,4);


      }
    }

        
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.lineWidth = 0.5;
    
      ctx.beginPath();
      ctx.stroke();

    if (settings.drawFreqBars) {
      if (settings.drawFreqBarsEcho && eqBarValuesLast) {
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.beginPath();
        for (var i=0;i<numEqBars;i++) {
          var h = sqrt(eqBarValuesLast[i])*20;
          var left = i * eqBarWidth + i * eqBarSpace;
          ctx.rect(left+3,screenHeight-h,eqBarWidth-6,h);
        }
        ctx.fill();
      }
    
      if (eqBarValues) {
        eqBarValuesLast = eqBarValues;
    
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.beginPath();
        for (var i=0;i<numEqBars;i++) {
          var h = sqrt(eqBarValues[i])*20;
          var left = i * eqBarWidth + i * eqBarSpace;
          ctx.rect(left,screenHeight-h,eqBarWidth,h);

          if (settings.drawFreqBarsLetters && activeText) {
            ctx.drawImage(
              activeText,
              i*40,0,40,40,
              left,screenHeight-h-letterSize,40,40
            );
          }
    
        }
        ctx.fill();
      }
    }

    if (settings.drawFaceImage && music && music.position > 0) {
      var opacity = 0.4 * music.position / music.durationEstimate;
      if (opacity < thomImg.style.opacity) thomImg.style.opacity = opacity;
    }
  }
    soundManager.setup({
      url: '/assets/soundmanager2/swf',
      flashVersion: 9, // optional: shiny features (default = 8)
      // optional: ignore Flash where possible, use 100% HTML5 mode
      // preferFlash: false,
      onready: function() {
        // Ready to use; soundManager.createSound() etc. can now be called.
        soundManager.createSound({
          id: 'Distorted Soul - Dirty',
          url: '/assets/dirty.mp3',
          autoLoad: true,
          autoPlay: false,
          onload: function() {
            alert('The sound '+this.id+' loaded!');
          },
          volume: 50,
          whileplaying : whilePlaying
        });
      }
    });


  window.methods.init = function init() {

    binaryCtr = $("binarycontainer");
    lyricsCtr = $("lyricscontainer");

    canvas = $("screen");
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    canvas.style.width = screenWidth + "px";
    canvas.style.height = screenHeight + "px";
    ctx = canvas.getContext("2d");

    permCanvas = $("permscreen");
    permCanvas.width = screenWidth;
    permCanvas.height = screenHeight;
    permCanvas.style.width = screenWidth + "px";
    permCanvas.style.height = screenHeight + "px";
    permCtx = permCanvas.getContext("2d");

    thomImg = $("thom");

    if (thomData) {
      var tmpData = thomData;
      thomData = [];
      for (var i=0;i<tmpData.length;i++) {
        thomData.push(thomColors[tmpData[i]]);
      }
    }

    var textImg = $("text-radiohead");
    var textImg2 = $("text-idioteque");
    textCanvas = document.createElement("canvas");
    textCanvas2 = document.createElement("canvas");
    textCanvas.width = textCanvas2.width = 360;
    textCanvas.height = textCanvas2.height = 40;
    textCanvas.getContext("2d").drawImage(textImg,0,0);
    textCanvas2.getContext("2d").drawImage(textImg2,0,0);

    $("inputlayer").onclick = function(e) {
      if (music && music.playState) {
        var y = e.clientY - $("main").offsetTop;
        var x = e.clientX - $("main").offsetLeft;
        if (y > 15 && y < 30) {
          if (music.bytesLoaded == music.bytesTotal) {
            music.setPosition(((x / screenWidth) * music.duration)>>0);
          }
        } else {
          if (!paused) {
            paused = true;
            music.togglePause();
          } else {
            music.togglePause();
            paused = false;
          }
        }
      }
    }


    setInterval(
      function() {
        if (paused) return;
        render({});
      }, 1000 / 20
    );
  }
};


