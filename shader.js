export function initShaderProgram(gl, vsSource, fsSource) {
   const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
   const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
   
   // link shader to a program object to store
   // combined shader program
   const shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram, vertexShader);
   gl.attachShader(shaderProgram, fragmentShader);
   gl.linkProgram(shaderProgram);

   // check for errors
   if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
       alert("Unable to init shader program" + gl.getProgramInfoLog(shaderProgram));
       return null;
   }
   // error-free
   return shaderProgram;
}

export function loadShader(gl, type, source) {
    // create shader
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // check for errors
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Error during compile: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    // error-free
    return shader;
}

