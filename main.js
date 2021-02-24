// import { initShaderProgram } from './shader';

main();


function main() {
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        alert("Unable to initialize WebGL.");
        return;
    }

    const vertexCode = `
        attribute vec3 coordinates;

        void main(void) {
            gl_Position = vec4(coordinates, 1.0);
            gl_PointSize = 10.0;
        }
    `;

    const fragmentCode = `
        void main(void) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);
        }
    `;

    const shaderProgram = initShaderProgram(gl, vertexCode, fragmentCode);
    const buffers = initBuffers(gl);
    const programInfo = {
        canvas: canvas,
        program: shaderProgram,
        coord: gl.getAttribLocation(shaderProgram, "coordinates")
    }
    // drawPoints(gl, programInfo, buffers, 3);
    drawTriangles(gl, programInfo, buffers, 3);
}

function initShaderProgram(gl, vsSource, fsSource) {
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
 
function loadShader(gl, type, source) {
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

function initBuffers(gl) {
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const vertices = [
       -0.5, 0.5, 0.0,
        0.0, 0.5, 0.0,
       -0.25,0.25,0.0, 
    ];

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );

    return {
        position: vertexBuffer
    };
}

function drawPoints(gl, programInfo, buffers, size) {
    // bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    // point an attribute to currently bound VBO
    gl.vertexAttribPointer(programInfo.coord, 3, gl.FLOAT, false, 0, 0);
    // enable attribute
    gl.enableVertexAttribArray(programInfo.coord);

    gl.useProgram(programInfo.program);

    // drawing on the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, programInfo.canvas.width, programInfo.canvas.height);
    gl.drawArrays(gl.POINTS, 0, size);
}

function drawTriangles(gl, programInfo, buffers, size) {
    // bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    // point an attribute to currently bound VBO
    gl.vertexAttribPointer(programInfo.coord, 3, gl.FLOAT, false, 0, 0);
    // enable attribute
    gl.enableVertexAttribArray(programInfo.coord);

    gl.useProgram(programInfo.program);

    // drawing on the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, programInfo.canvas.width, programInfo.canvas.height);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, size);
}