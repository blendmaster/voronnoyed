/* This file (voronnoyed.js) is compiled from voronnoyed.co. Please view the
original commented source there. */
(function(){
  "use strict";
  var canvas, width, height, k, ref$, v, x$, draw, out$ = typeof exports != 'undefined' && exports || this;
  canvas = document.getElementById('canvas');
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
  out$.draw = draw = function(){
    gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
  };
  reading('image', 'AsText', function(){});
}).call(this);
