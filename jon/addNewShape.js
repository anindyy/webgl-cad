/* Global variables */
var r, g, b;   // colors
var creating = false;  // create mode
var nVertices = 2; // what shape are we creating
var vertices = [];  // list of vertices
var colors = [];
var shapeType = "line";

var inputX = document.getElementById("x-input");
var inputY = document.getElementById("y-input");

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
    document.getElementById("colors").innerText = colors;
}, false)

/* Create shape */
var createButton = document.getElementById('create-shape')
createButton.addEventListener('click', function() {
    console.log(vertices);
    console.log(colors);
    // if we are creating and we have enough vertices, create the shape
    if (vertices.length >= nVertices*2) {
        vertices.slice(0, nVertices*2 + 1);
        colors.slice(0, nVertices*3 + 1);

        switch (shapeType) {
            case "line":
                draw(vertices, colors, gl.LINES);
                break;
    
            case "triangle":
                draw(vertices, colors, gl.TRIANGLE_FAN);
                break;
    
            case "square":
                draw(vertices, colors, gl.TRIANGLE_STRIP);
                break;
            
            default:
                break;
        }
         
        // reset array
        vertices = [];
        colors = [];
        document.getElementById("vertices").innerText = vertices;
        document.getElementById("colors").innerText = colors;
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
function getColors() {
    var colorInput = document.getElementById("color");
    var colorValue = colorInput.value;
    r = parseInt(colorValue.substr(1,2), 16) / 255;
    g = parseInt(colorValue.substr(3,2), 16) / 255;
    b = parseInt(colorValue.substr(5,2), 16) / 255;
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
        default:
            break;
    }
})