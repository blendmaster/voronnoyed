/* This file (utils.js) is compiled from utils.co. Please view the
original commented source there. */
(function(){
  "use strict";
  var log, degrees, radians, $, readPpm, shaderProgram, defer, reading, uniform, bindBuffer, rand, i$, x$, ref$, len$, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice;
  mat4.translation = function(translation){
    return mat4.translate(mat4.identity(), translation);
  };
  out$.log = log = function(it){
    console.log(it);
    return it;
  };
  out$.degrees = degrees = function(it){
    return it * 180 / Math.PI;
  };
  out$.radians = radians = function(it){
    return it * Math.PI / 180;
  };
  out$.$ = $ = function(it){
    return document.getElementById(it);
  };
  out$.readPpm = readPpm = function(gl, it){
    var ref$, width, height, pixels, data, i, to$, tex;
    ref$ = it.match(/P6\n(\d+) (\d+)\n255\n([\s\S]+)/), width = ref$[1], height = ref$[2], pixels = ref$[3];
    width = parseInt(width, 10);
    height = parseInt(height, 10);
    data = new Uint8Array(width * height * 3);
    for (i = 0, to$ = pixels.length; i < to$; ++i) {
      data[i] = pixels.charCodeAt(i);
    }
    tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    return tex;
  };
  out$.shaderProgram = shaderProgram = function(arg$){
    var vertex, fragment, uniforms, ref$;
    vertex = arg$.vertex, fragment = arg$.fragment, uniforms = (ref$ = arg$.uniforms) != null
      ? ref$
      : {};
    return function(gl){
      var x$, vertexShader, y$, fragmentShader, z$, program, name, ref$, ref1$, type, value;
      x$ = vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(x$, vertex);
      gl.compileShader(x$);
      if (!gl.getShaderParameter(x$, COMPILE_STATUS)) {
        throw new Error("couldn't compile vertex shader!\n" + gl.getShaderInfoLog(x$));
      }
      y$ = fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(y$, fragment);
      gl.compileShader(y$);
      if (!gl.getShaderParameter(y$, COMPILE_STATUS)) {
        throw new Error("couldn't compile fragment shader!\n" + gl.getShaderInfoLog(y$));
      }
      z$ = program = gl.createProgram();
      gl.attachShader(z$, vertexShader);
      gl.attachShader(z$, fragmentShader);
      gl.linkProgram(z$);
      if (!gl.getProgramParameter(z$, LINK_STATUS)) {
        throw new Error("couldn't intialize shader program!");
      }
      gl.program = program;
      gl.useProgram(program);
      for (name in ref$ = uniforms) {
        ref1$ = ref$[name], type = ref1$[0], value = slice$.call(ref1$, 1);
        gl["uniform" + type].apply(gl, [gl.getUniformLocation(program, name)].concat(value));
      }
    };
  };
  out$.defer = defer = function(t, fn){
    return setTimeout(fn, t);
  };
  out$.reading = reading = function(id, readerFn, fn){
    var onchange, x$;
    onchange = function(){
      var that, x$;
      if (that = this.files[0]) {
        x$ = new FileReader;
        x$.onload = function(){
          fn(this.result);
        };
        x$["read" + readerFn](that);
      }
    };
    x$ = $(id);
    x$.addEventListener('change', onchange);
    onchange.call(x$);
    return x$;
  };
  out$.uniform = uniform = function(gl, name, type, value){
    return gl["uniform" + type](gl.getUniformLocation(gl.program, name), false, value);
  };
  out$.bindBuffer = bindBuffer = function(gl, name, value, elementLength){
    var x$, buf, y$;
    x$ = buf = gl.createBuffer();
    gl.bindBuffer(ARRAY_BUFFER, x$);
    gl.bufferData(ARRAY_BUFFER, value, STATIC_DRAW);
    y$ = gl.getAttribLocation(gl.program, name);
    gl.enableVertexAttribArray(y$);
    gl.vertexAttribPointer(y$, elementLength, gl.FLOAT, false, 0, 0);
    return buf;
  };
  out$.rand = rand = function(a, b){
    return Math.random() * (b - a) + a;
  };
  if (typeof requestAnimationFrame == 'undefined' || requestAnimationFrame === null) {
    for (i$ = 0, len$ = (ref$ = ['ms', 'moz', 'webkit', 'o']).length; i$ < len$; ++i$) {
      x$ = ref$[i$];
      if (window[x$ + "requestAnimationFrame"]) {
        window.requestAnimationFrame = window[x$ + "requestAnimationFrame"];
        window.cancelAnimationFrame = window[x$ + "cancelAnimationFrame"];
      }
    }
  }
  if (typeof requestAnimationFrame == 'undefined' || requestAnimationFrame === null) {
    window.requestAnimationFrame = function(it){
      return setTimeout(it, 1000 / 60);
    };
    window.cancelAnimationFrame = clearTimeout;
  }
}).call(this);
