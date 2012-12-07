/* This file (voronnoyed.js) is compiled from voronnoyed.co. Please view the
original commented source there. */
(function(){
  "use strict";
  var canvas, width, height, k, ref$, v, x$, hat, hatBuffer, points, overlay, ctx, draw, out$ = typeof exports != 'undefined' && exports || this;
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
    detail = Math.max(4, parseInt($('detail').value, 10) || 200);
    console.log("detail: " + detail);
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
        velocity: rand(0, 1)
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
      gl.drawArrays(TRIANGLE_FAN, 0, hat.length / 3);
      if ($('show').checked) {
        ctx.beginPath();
        ctx.arc(width / 2 * x$.pos[0] + width / 2, height / 2 * -x$.pos[1] + height / 2, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };
  addPoints(32);
  reading('image', 'AsText', function(){});
  $('overlay').addEventListener('click', function(arg$){
    var clientX, clientY, ref$, left, top;
    clientX = arg$.clientX, clientY = arg$.clientY;
    ref$ = this.getBoundingClientRect(), left = ref$.left, top = ref$.top;
    points.push({
      pos: [(clientX - left) / width * 2 - 1, -((clientY - top) / height * 2 - 1)],
      color: [rand(0, 1), rand(0, 1), rand(0, 1)],
      velocity: rand(0, 1)
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
}).call(this);
