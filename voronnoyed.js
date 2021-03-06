/* This file (voronnoyed.js) is compiled from voronnoyed.co. Please view the
original commented source there. */
(function(){
  "use strict";
  var canvas, width, height, k, ref$, v, x$, hat, hatBuffer, points, overlay, ctx, draw, animation, out$ = typeof exports != 'undefined' && exports || this;
  canvas = $('canvas');
  width = canvas.width, height = canvas.height;
  try {
    window.gl = WebGLDebugUtils.makeDebugContext(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch (e$) {}
  if (typeof gl == 'undefined' || gl === null) {
    alert("Sorry, it looks like your browser doesn't support WebGL, or webGL is disabled!");
    throw new Error("no webgl ;_;");
  }
  for (k in ref$ = gl) {
    v = ref$[k];
    if (/^[A-Z_]+$/.test(k)) {
      window[k] = v;
    }
  }
  x$ = gl;
  x$.viewport(0, 0, width, height);
  x$.enable(DEPTH_TEST);
  x$.enable(CULL_FACE);
  x$.clearColor(0, 0, 0, 1);
  x$.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
  load('voronoi', gl);
  function makeHat(){
    var detail, x$, i, t, step$, to$;
    detail = Math.max(3, parseInt($('detail').value, 10) || 200);
    x$ = hat = new Float32Array((2 + detail) * 3);
    x$[0] = 0;
    x$[1] = 0;
    x$[2] = 0;
    i = 2;
    for (t = 0, to$ = Math.PI * 2 + 0.01, step$ = Math.PI * 2 / detail; step$ < 0 ? t >= to$ : t <= to$; t += step$) {
      x$[++i] = 2 * Math.cos(t);
      x$[++i] = 2 * Math.sin(t);
      x$[++i] = 1;
    }
    hatBuffer = bindBuffer(gl, 'coord', hat, 3);
  }
  makeHat();
  out$.points = points = [];
  function addPoints(it){
    var i;
    for (i = 0; i < it; ++i) {
      points.push({
        pos: [rand(-1, 1), rand(-1, 1)],
        color: [rand(0, 1), rand(0, 1), rand(0, 1)],
        velocity: rand(-1, 1)
      });
    }
    draw();
  }
  overlay = $('overlay');
  ctx = overlay.getContext('2d');
  ctx.fillStyle = 'black';
  out$.draw = draw = function(){
    var i$, x$, ref$, len$;
    gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
    overlay.width = width;
    gl.bindBuffer(ARRAY_BUFFER, hatBuffer);
    for (i$ = 0, len$ = (ref$ = points).length; i$ < len$; ++i$) {
      x$ = ref$[i$];
      uniform(gl, 'transform', 'Matrix4fv', mat4.translate(mat4.identity(), [x$.pos[0], x$.pos[1], 0]));
      gl.uniform3f(gl.getUniformLocation(gl.program, 'color'), x$.color[0], x$.color[1], x$.color[2]);
      gl.uniform2f(gl.getUniformLocation(gl.program, 'point'), (x$.pos[0] + 1) / 2, (x$.pos[1] + 1) / 2);
      gl.drawArrays(TRIANGLE_FAN, 0, hat.length / 3);
      if ($('show').checked) {
        ctx.beginPath();
        ctx.arc(width / 2 * x$.pos[0] + width / 2, height / 2 * -x$.pos[1] + height / 2, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };
  addPoints(32);
  reading('image', function(it){
    var x$, blob, y$, img;
    switch (it.type) {
    case 'image/x-portable-pixmap':
      x$ = new FileReader;
      x$.onload = function(){
        var tex, x$;
        tex = readPpm(gl, this.result);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        uniform(gl, 'texture', '1i', 0);
        gl.uniform1i(gl.getUniformLocation(gl.program, 'useTexture'), 1);
        x$ = $('img');
        x$.disabled = false;
        x$.checked = true;
        draw();
      };
      x$.readAsBinaryString(it);
      break;
    case 'image/png':
    case 'image/jpeg':
    case 'image/gif':
      blob = (window.URL || window.webkitURL).createObjectURL(it);
      y$ = img = new Image;
      y$.onload = function(){
        var square, ctx, tex, x$;
        square = document.createElement('canvas');
        square.width = square.height = 512;
        ctx = square.getContext('2d');
        ctx.drawImage(this, 0, 0, 512, 512);
        tex = gl.createTexture();
        gl.pixelStorei(UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, RGBA, RGBA, UNSIGNED_BYTE, square);
        gl.texParameteri(gl.TEXTURE_2D, TEXTURE_MAG_FILTER, NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, TEXTURE_MIN_FILTER, NEAREST);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        uniform(gl, 'texture', '1i', 0);
        gl.uniform1i(gl.getUniformLocation(gl.program, 'useTexture'), 1);
        x$ = $('img');
        x$.disabled = false;
        x$.checked = true;
        draw();
      };
      y$.src = blob;
    }
  });
  $('img').addEventListener('click', function(){
    gl.uniform1i(gl.getUniformLocation(gl.program, 'useTexture'), 1);
    draw();
  });
  $('random').addEventListener('click', function(){
    gl.uniform1i(gl.getUniformLocation(gl.program, 'useTexture'), 0);
    draw();
  });
  $('overlay').addEventListener('click', function(arg$){
    var clientX, clientY, ref$, left, top;
    clientX = arg$.clientX, clientY = arg$.clientY;
    ref$ = this.getBoundingClientRect(), left = ref$.left, top = ref$.top;
    points.push({
      pos: [(clientX - left) / width * 2 - 1, -((clientY - top) / height * 2 - 1)],
      color: [rand(0, 1), rand(0, 1), rand(0, 1)],
      velocity: rand(-1, 1)
    });
    draw();
  });
  $('reset').addEventListener('click', function(){
    points = [];
    addPoints(32);
  });
  $('add').addEventListener('click', function(){
    addPoints(points.length);
  });
  $('show').addEventListener('click', draw);
  $('hide').addEventListener('click', draw);
  function move(){
    var i$, x$, ref$, len$, radius, angle;
    for (i$ = 0, len$ = (ref$ = points).length; i$ < len$; ++i$) {
      x$ = ref$[i$];
      radius = Math.sqrt(Math.pow(x$.pos[0], 2) + Math.pow(x$.pos[1], 2));
      angle = radians(x$.velocity * (2 - radius)) + Math.atan2(x$.pos[1], x$.pos[0]);
      x$.pos = [radius * Math.cos(angle), radius * Math.sin(angle)];
    }
    draw();
    if ($('animate').checked) {
      animation = requestAnimationFrame(move);
    }
  }
  $('animate').addEventListener('click', move);
  $('static').addEventListener('click', function(){
    clearTimeout(animation);
  });
  if ($('animate').checked) {
    animation = requestAnimationFrame(move);
  }
  $('detail').addEventListener('input', function(){
    makeHat();
    draw();
  });
}).call(this);
