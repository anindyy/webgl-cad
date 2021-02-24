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
    0.1, 0.3,
    0.1, -0.3,
    -0.3, 0.3,
    -0.3, -0.3,
]

const squareColor = [
    1, 0, 0,
    1, 0, 0,
    0, 0, 0,
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

function translate(array, x_delta, y_delta){
    for (let i = 0; i < array.length; i=i+2) {
        array[i] = array[i] + x_delta;
        array[i+1] = array[i+1] + y_delta;
    }
    return array;
}

function scale(array, s){
    for (let i = 0; i < array.length; i++) {
        array[i] = s*array[i];
    }
    return array;
}

function createcolormatrix(n_vertices){
    return new Array(n_vertices*3).fill(0);
}

function shiftcolor(colorArray, r_delta, g_delta, b_delta){
    for(let i = 0; i < colorArray.length; i=i+3){
        colorArray[i] = colorArray[i] + r_delta;
        colorArray[i+1] = colorArray[i+1] + g_delta;
        colorArray[i+2] = colorArray[i+2] + b_delta;
    }

    return colorArray;
}

// draw(triangleVertex, triangleColor, gl.TRIANGLE_FAN);
// draw(squareVertex, squareColor, gl.TRIANGLE_STRIP);
// draw(lineVertex, lineColor, gl.LINES);


// draw(translate(squareVertex, 0.3, 0.3), squareColor, gl.TRIANGLE_STRIP);

// draw(scale(squareVertex, 1.5), squareColor, gl.TRIANGLE_STRIP);
color_x = createcolormatrix(4);
shiftcolor(color_x, 0.3, 0.3, 0);

draw(squareVertex, color_x, gl.TRIANGLE_STRIP);

function saveCanvasAsJson(){
    var convertToString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(all));
    var saveCanvas = document.createElement('a');
    saveCanvas.setAttribute("href",     convertToString);
    saveCanvas.setAttribute("download", "canvass.json");
    document.body.appendChild(saveCanvas);
    saveCanvas.click();
    saveCanvas.remove();
  }

  function uploadFile(event) {
      
    var target_file = event.target.files[0];
  
    if (target_file) {
        var read_file = new FileReader();
        read_file.onload = function (e) {
            var shapes = e.target.result;
            all = JSON.parse(shapes);
            renderAll();
        }
        read_file.readAsText(target_file);
    } else {
        alert("Failed to load. Try again");
    }
  }