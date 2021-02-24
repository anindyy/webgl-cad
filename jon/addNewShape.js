/* Global variables */
var r, g, b;   // colors
var creating = false;  // create mode
var nVertices = 1; // what shape are we creating
var vertices = [];  // list of vertices
var colors = [];
var shapeType = "line";
var currShapeType;
var currVertices;
var currColors;

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
    colors.push(getColorsRed());
    colors.push(getColorsGreen());
    colors.push(getColorsBlue());

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
                draw(createHexagonVertex(parseFloat(inputR.value)), shiftcolor(createcolormatrix(8), colors[0], colors[1], colors[2]), gl.TRIANGLE_STRIP);
                // draw(createHexagonVertex(0.5),createcolormatrix(8),gl.TRIANGLE_FAN);
                break;
            
            default:
                break;
        }
        currShapeType = shapeType;
        currVertices = vertices;
        currColors = colors;
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
    var r = parseInt(colorValue.substr(1,2), 16) / 255;
    return r;
}

function getColorsBlue() {
    var colorInput = document.getElementById("color");
    var colorValue = colorInput.value;
    var b = parseInt(colorValue.substr(5,2), 16) / 255;

    return b;
}

function getColorsGreen() {
    var colorInput = document.getElementById("color");
    var colorValue = colorInput.value;
    var g = parseInt(colorValue.substr(3,2), 16) / 255;

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

/* Stretch and scale */
var stretch = document.getElementById("stretch");
stretch.addEventListener("change", function() {
    currVertices = scale(currVertices, stretch.value);
    switch (currShapeType) {
        case "line":
            draw(currVertices, shiftcolor(createcolormatrix(2), currColors[0], currColors[1], currColors[2]), gl.LINES);
            break;
        case "triangle":
            draw(currVertices, shiftcolor(createcolormatrix(3), currColors[0], currColors[1], currColors[2]), gl.TRIANGLE_FAN);
            break;
        case "square":
            draw(currVertices, shiftcolor(createcolormatrix(4), currColors[0], currColors[1], currColors[2]), gl.TRIANGLE_STRIP);
            break;
        case "hexagon":
            console.log(inputR.value);
            draw(createHexagonVertex(parseFloat(inputR.value)), shiftcolor(createcolormatrix(8), currColors[0], currColors[1], currColors[2]), gl.TRIANGLE_FAN);
            break;
        default:
            break;
    }
})

/* Move */
var moveX = document.getElementById("move-x");
moveX.addEventListener("change", function() {
    var x_delta = parseFloat(moveX.value);
    console.log(translate(currVertices, x_delta, 0));
    switch (currShapeType) {
        case "line":
            draw(currVertices, shiftcolor(createcolormatrix(2), currColors[0], currColors[1], currColors[2]), gl.LINES);
            break;
        case "triangle":
            draw(currVertices, shiftcolor(createcolormatrix(3), currColors[0], currColors[1], currColors[2]), gl.TRIANGLE_FAN);
            break;
        case "square":
            draw(currVertices, shiftcolor(createcolormatrix(4), currColors[0], currColors[1], currColors[2]), gl.TRIANGLE_STRIP);
            break;
        case "hexagon":
            console.log(inputR.value);
            draw(createHexagonVertex(parseFloat(inputR.value)), shiftcolor(createcolormatrix(8), currColors[0], currColors[1], currColors[2]), gl.TRIANGLE_FAN);
            break;
        default:
            break;
    }
});

var moveY = document.getElementById("move-y");
moveY.addEventListener("change", function() {
    var y_delta = parseFloat(moveY.value);
    console.log(translate(currVertices, 0, y_delta));
    switch (currShapeType) {
        case "line":
            draw(currVertices, shiftcolor(createcolormatrix(2), currColors[0], currColors[1], currColors[2]), gl.LINES);
            break;
        case "triangle":
            draw(currVertices, shiftcolor(createcolormatrix(3), currColors[0], currColors[1], currColors[2]), gl.TRIANGLE_FAN);
            break;
        case "square":
            draw(currVertices, shiftcolor(createcolormatrix(4), currColors[0], currColors[1], currColors[2]), gl.TRIANGLE_STRIP);
            break;
        case "hexagon":
            console.log(inputR.value);
            draw(createHexagonVertex(parseFloat(inputR.value)), shiftcolor(createcolormatrix(8), currColors[0], currColors[1], currColors[2]), gl.TRIANGLE_FAN);
            break;
        default:
            break;
    }
});

/* Change color */
var changeColor = document.getElementById("change-color");
changeColor.addEventListener("click", function() {
    currColors = shiftcolor(currColors, currColors[0]-getColorsRed(), currColors[1]-getColorsGreen(), currColors[1]-getColorsBlue());
    switch (currShapeType) {
        case "line":
            draw(currVertices, shiftcolor(createcolormatrix(2), currColors[0], currColors[1], currColors[2]), gl.LINES);
            break;
        case "triangle":
            draw(currVertices, shiftcolor(createcolormatrix(3), currColors[0], currColors[1], currColors[2]), gl.TRIANGLE_FAN);
            break;
        case "square":
            draw(currVertices, shiftcolor(createcolormatrix(4), currColors[0], currColors[1], currColors[2]), gl.TRIANGLE_STRIP);
            break;
        case "hexagon":
            console.log(inputR.value);
            draw(createHexagonVertex(parseFloat(inputR.value)), shiftcolor(createcolormatrix(8), currColors[0], currColors[1], currColors[2]), gl.TRIANGLE_FAN);
            break;
        default:
            break;
    }
})
