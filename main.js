const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

gl.clearColor(0.7, 0.7, 0.7, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

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

    gl.clearColor(0.7, 0.7, 0.7, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // buat buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    // buat vertex shader
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

    // buat fragment shader
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

    // buat program
    const program = gl.createProgram();

    // memasukan shader ke program
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);

    gl.linkProgram(program);

    // vertex attribute
    const positionLocation = gl.getAttribLocation(program, `position`);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const colorLocation = gl.getAttribLocation(program, `color`);
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    // gambar
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
        colorArray[i] = r_delta;
        colorArray[i+1] = g_delta;
        colorArray[i+2] = b_delta;
    }

    return colorArray;
}

function createHexagonVertex(radius){
    var x = 0; //x coordinate for the center of the hexagon
	var y = 0; //y coordinate for the center of the hexagon
	var q = Math.sqrt(Math.pow(radius,2) - Math.pow((radius/2),2)); //y coordinate of the points that are above and below center point
	var xCoord = new Array(8);
	var yCoord = new Array(8);
	xCoord[0] = x;
	yCoord[0] = y;
	xCoord[1] = x + radius;
	yCoord[1] = y;
	xCoord[2] = x + (radius/2);
	yCoord[2] = y+q;
	xCoord[3] = x-(radius/2);
	yCoord[3] = y+q;
	xCoord[4] = x - radius;
	yCoord[4] = y;
	xCoord[5] = x-(radius/2);
	yCoord[5] = y-q;
	xCoord[6] = x + (radius/2);
	yCoord[6] = y-q;
	xCoord[7] = x + radius;
	yCoord[7] = y;
	
	var vertices = [xCoord[0],yCoord[0]];// Initialize Array
	
    for ( var i = 1; i < xCoord.length; ++i ) {
		vertices.push(xCoord[i]);
        vertices.push(yCoord[i]);
		console.log("Coordinate " + i + ": " + xCoord[i] + "," + yCoord[i]);
    }

    return vertices;
}

// draw(createHexagonVertex(0.5),createcolormatrix(8),gl.TRIANGLE_FAN);

// draw(triangleVertex, triangleColor, gl.TRIANGLE_FAN);
// draw(squareVertex, squareColor, gl.TRIANGLE_STRIP);
// draw(lineVertex, lineColor, gl.LINES);
// draw(translate(squareVertex, 0.3, 0.3), squareColor, gl.TRIANGLE_STRIP);
// draw(scale(squareVertex, 1.5), squareColor, gl.TRIANGLE_STRIP);
color_x = createcolormatrix(4);
shiftcolor(color_x, 0.3, 0.3, 0);

// draw(squareVertex, color_x, gl.TRIANGLE_STRIP);

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

colorsa = [0.5, 0.5, 0.5];
// draw(createHexagonVertex(parseFloat(0.5)), shiftcolor(createcolormatrix(8), colorsa[0], colorsa[1], colorsa[2]), gl.TRIANGLE_FAN);