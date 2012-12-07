/* This file (programs.js) is compiled from programs.co. Please view the
original commented source there. */
(function(){
  "use strict";
  var programs, load, out$ = typeof exports != 'undefined' && exports || this;
  programs = {};
  out$.load = load = function(it, gl){
    return programs[it](gl);
  };
  programs.voronoi = shaderProgram({
    vertex: "attribute vec3 coord;\n\nuniform mat4 transform;\n\nvoid main() {\n  gl_Position = transform * vec4(coord, 1);\n}",
    fragment: "precision mediump float;\n\nuniform vec3 color;\n\nvoid main() {\n  gl_FragColor = vec4(color, 1);\n}"
  });
}).call(this);
