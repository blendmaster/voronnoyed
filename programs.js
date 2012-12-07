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
    vertex: "attribute vec3 coord;\n\nuniform vec2 point;\nuniform mat4 transform;\n\nuniform bool useTexture;\nuniform vec3 color;\nuniform sampler2D texture;\n\nvarying vec3 fragColor;\n\nvoid main() {\n  gl_Position = transform * vec4(coord, 1);\n\n  fragColor = useTexture\n    ? texture2D(texture, point).rgb\n    : color;\n}",
    fragment: "precision mediump float;\n\nvarying vec3 fragColor;\n\nvoid main() {\n  gl_FragColor = vec4(fragColor, 1);\n}",
    uniforms: {
      useTexture: ['1i', 0]
    }
  });
}).call(this);
