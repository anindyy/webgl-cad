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
    var jsonObject = {};
    
    jsonObject.vertices = (new_vertices);
    jsonObject.colors = (currColors);
    jsonObject.shapetype = currShapeType;
    console.log(JSON.stringify(jsonObject,null,2));
    var stringifyObj = JSON.stringify(jsonObject,null,2)
    var saveCanvas = document.createElement('a');
    var file = new Blob([stringifyObj], {type: "text/plain"})
    saveCanvas.setAttribute("href",     URL.createObjectURL(file));
    saveCanvas.setAttribute("download", "canvass.json");
    document.body.appendChild(saveCanvas);
    saveCanvas.click();
    saveCanvas.remove();
  }

document.getElementById('import').onclick = function() {

    var files = document.getElementById('selectFiles').files;
  console.log(files);
  if (files.length <= 0) {
    return false;
  }

  var fr = new FileReader();

  fr.onload = function(e) { 
  console.log(e);
    var result = JSON.parse(e.target.result);
    console.log(result.shapetype)
    var inputR = document.getElementById("r-input");

    switch (result.shapetype) {
        case "line":
            draw(result.vertices, shiftcolor(createcolormatrix(2), result.colors[0], result.colors[1], result.colors[2]), gl.LINES);
            break;

        case "triangle":
            draw(result.vertices, shiftcolor(createcolormatrix(3), result.colors[0], result.colors[1], result.colors[2]), gl.TRIANGLE_FAN);
            break;

        case "square":
            draw(result.vertices, shiftcolor(createcolormatrix(4),result.colors[0], result.colors[1], result.colors[2]), gl.TRIANGLE_FAN);
            break;

        case "hexagon":
            console.log(inputR.value);
            draw(createHexagonVertex(parseFloat(inputR.value)), shiftcolor(createcolormatrix(8), result.colors[0], result.colors[1], result.colors[2]), gl.TRIANGLE_FAN);
            // draw(createHexagonVertex(0.5),createcolormatrix(8),gl.TRIANGLE_FAN);
            break;
        
        default:
            break;
    }
    var formatted = JSON.stringify(result, null, 2);
        document.getElementById('result').value = formatted;
  }

  fr.readAsText(files.item(0));
};

colorsa = [0.5, 0.5, 0.5];
// draw(createHexagonVertex(parseFloat(0.5)), shiftcolor(createcolormatrix(8), colorsa[0], colorsa[1], colorsa[2]), gl.TRIANGLE_FAN);

function alertHelp() {
    var newLine = "\r\n"
    var msg = "Welcome to your personal drawing canvas!"
    msg += newLine;
    msg += newLine;
    msg += "Untuk memulai, pilih shape yang akan digambar terlebih dahulu. Terdapat 3 pilihan yaitu:";
    msg += newLine;
    msg += newLine;
    msg += "Line";
    msg += newLine;
    msg += "Triangle";
    msg += newLine;
    msg += "Square";
    msg+= newLine;
    msg += "Hexagon";
    msg+= newLine;
    msg += newLine;
    msg += "Setelah memilih shape yang akan digambar, masukan vertex sesuai yang anda inginkan.";
    msg += newLine;
    msg += "Anda juga dapat mengganti warna terlebih dahulu pada tombol 'Change Color'";
    msg += newLine;
    msg += newLine;
    msg += "Setelah memasukan vertex, misalkan (0,0),(0,0.4), tekan tombol 'Create Shape'";
    msg += newLine;
    msg += "Pada contoh diatas,canvas akan menggambar sebuah garis lurus sesuai vertex yang tadi sudah diinput";
    msg+= newLine;
    msg += newLine;
    msg += "Terdapat juga fitur 'Change Position', yang dapat menggeser garis/shape yang dibuat sesuai dengan input dari slider";
    msg+= newLine;
    msg += "Fitur ini dapat menggeser melalui sumbu x, maupun sumbu y.";
    msg+= newLine;
    msg += newLine;
    msg += "Fitur lain yang tersedia adalah scaling.Fitur ini berfungsi untuk meningkatkan ukuran dari shape/garis.";
    msg+= newLine;
    msg += "Misalkan, input scaling adalah 0.5, maka canvas akan menurunkan size dari object setengah dari ukuran semula.";
    msg+= newLine;
    msg += newLine;
    msg += "Terakhir, ada fitur save and load yang dapat menyimpan canvas yang telah anda buat.";
    msg+= newLine;
    msg += "Fitur ini sangat membantu apabila anda ingin menyimpan hasil pekerjaan dan ingin melakukan load di kemudian hari";
    msg+= newLine;
    msg += "Caranya cukup gampang, setelah anda selesai menggambar di canvas, pencet tombol Save untuk menyimpan canvas";
    msg+= newLine;
    msg += "Dikemudian hari, apabila anda ingin membuka kembali, tekan tombol Choose File untuk memilih file yang ingin di Load.";
    msg+= newLine;
    msg += "Setelah itu, tekan tombol 'Import' untuk otomatis canvas menggambar dari file yang telah diload.";
    msg+= newLine;
    msg += newLine;
    msg += "Selamat bereksperimen!";
    msg+= newLine;
    alert(msg);
}