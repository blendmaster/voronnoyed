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
    vertex: "precision mediump float;\n\nvoid main() {\n  gl_Position = vec4(0, 0, 0, 0);\n}",
    fragment: "precision mediump float;\n\nvoid main() {\n  gl_FragColor = vec4(0, 0, 0, 0);\n}"
  });
}).call(this);
