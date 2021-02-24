/* Global variables */
var r, g, b;   // colors
var creating = false;  // create mode
var nVertices = 1; // what shape are we creating
var vertices = [];  // list of vertices
var colors = [];
var shapeType = "line";

var inputX = document.getElementById("x-input");
var inputY = document.getElementById("y-input");
var inputR = document.getElementById("r-input");

/* Add vertex */
var addButton = document.getElementById("add-vertex");
addButton.addEventListener("click", function(e) {
    // push vertices
    vertices.push(parseFloat(inputX.value));
    vertices.push(parseFloat(inputY.value));
    
    // push colors
    getColors();
    colors.push(r);
    colors.push(g);
    colors.push(b);

    // show to user
    document.getElementById("vertices").innerText = vertices;
}, false)

/* Create shape */
var createButton = document.getElementById('create-shape')
createButton.addEventListener('click', function() {
    console.log(vertices);
    console.log(colors);
    console.log(inputR.value);
    // if we are creating and we have enough vertices, create the shape
    if (vertices.length >= nVertices) {
        vertices.slice(0, nVertices*2 + 1);
        colors.slice(0, nVertices*3 + 1);

        switch (shapeType) {
            case "line":
                draw(vertices, shiftcolor(createcolormatrix(2), colors[0], colors[1], colors[2]), gl.LINES);
                break;
    
            case "triangle":
                draw(vertices, shiftcolor(createcolormatrix(3), colors[0], colors[1], colors[2]), gl.TRIANGLE_FAN);
                break;
    
            case "square":
                draw(vertices, shiftcolor(createcolormatrix(4), colors[0], colors[1], colors[2]), gl.TRIANGLE_FAN);
                break;

            case "hexagon":
                console.log(inputR.value);
                draw(createHexagonVertex(parseFloat(inputR.value)), shiftcolor(createcolormatrix(8), colors[0], colors[1], colors[2]), gl.TRIANGLE_FAN);
                // draw(createHexagonVertex(0.5),createcolormatrix(8),gl.TRIANGLE_FAN);
                break;
            
            default:
                break;
        }
         
        // reset array
        vertices = [];
        colors = [];
        document.getElementById("vertices").innerText = vertices;
    }
})

/* Limit position input */
inputX.addEventListener("input", function() {
    if (inputX.value > 1) inputX.value = 1;
    if (inputX.value < -1) inputX.value = -1;
})

inputY.addEventListener("input", function() {
    if (inputY.value > 1) inputY.value = 1;
    if (inputY.value < -1) inputY.value = -1;
})

/* Color input */
function getColorsRed() {
    var colorInput = document.getElementById("color");
    var colorValue = colorInput.value;
    r = parseInt(colorValue.substr(1,2), 16) / 255;
    return r;
}

function getColorsBlue() {
    var colorInput = document.getElementById("color");
    var colorValue = colorInput.value;
    b = parseInt(colorValue.substr(5,2), 16) / 255;

    return b;
}

function getColorsGreen() {
    var colorInput = document.getElementById("color");
    var colorValue = colorInput.value;
    g = parseInt(colorValue.substr(3,2), 16) / 255;

    return g;
}




/* Shape input */
var shapeInput = document.getElementById("shape-type");
shapeInput.addEventListener("change", function() {
    shapeType = shapeInput.value;
    switch (shapeType) {
        case "line":
            nVertices = 2;
            break;
        case "triangle":
            nVertices = 3;
            break;
        case "square":
            nVertices = 4;
            break;
        case "hexagon":
            nVertices = 1;
            break;
        default:
            break;
    }
})