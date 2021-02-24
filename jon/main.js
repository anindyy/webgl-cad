const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const triangleVertex = [
    0, 1,
    1, -1,
    -1, -1,
];

const triangleColor = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
];

const squareVertex = [
    1, 1,
    1, -1,
    -1, 1,
    -1, -1,
]

const squareColor = [
    1, 0, 0,
    1, 0, 0,
    0, 1, 0,
    0, 1, 0,
]

const lineVertex = [
    0, 0.7,
    0, -0.7,
]

const lineColor = [
    0.5, 0.5, 0,
    0.5, 0.5, 0.5,
]

// menerima nilai vertex dan nilai warna untuk merender menjadi sebuah bentuk
function draw(vertexData, colorData, mode){
    // fungsi ini bikin ngehang
    // convertToClipspace(vertexData);

    if (!gl) {
        throw new Error('WebGL not supported');
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    const vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex_shader, `
    precision mediump float;

    attribute vec2 position;
    attribute vec3 color;
    varying vec3 vColor;

    void main() {
        vColor = color;
        gl_Position = vec4(position, 0, 1);
    }
    `);
    gl.compileShader(vertex_shader);

    const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment_shader, `
    precision mediump float;

    varying vec3 vColor;

    void main() {
        gl_FragColor = vec4(vColor, 1);
    }
    `);
    gl.compileShader(fragment_shader);
    console.log(gl.getShaderInfoLog(fragment_shader));

    const program = gl.createProgram();
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);

    gl.linkProgram(program);

    const positionLocation = gl.getAttribLocation(program, `position`);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const colorLocation = gl.getAttribLocation(program, `color`);
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);
    gl.drawArrays(mode, 0, vertexData.length/2);
}

// draw(triangleVertex, triangleColor, gl.TRIANGLE_FAN);
// draw(squareVertex, squareColor, gl.TRIANGLE_STRIP);
// draw(lineVertex, lineColor, gl.LINES);

// ref: https://stackoverflow.com/a/42315942
function convertToClipspace(vertexData) {
    for (var i = 0; i < vertexData.length; i+2) {
        vertexData[i  ] = vertexData[i  ] / gl.canvas.width  *  2 - 1;
        vertexData[i+1] = vertexData[i+1] / gl.canvas.height * -2 + 1;
    }
}