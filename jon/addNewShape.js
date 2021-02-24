/* Global variables */
var r, g, b;   // colors
var creating = false;  // create mode
var nVertices = 2; // what shape are we creating
var vertices = [];  // list of vertices
var shapeType = "line";

/* Changing create mode */
var createButton = document.getElementById("create-shape");
createButton.addEventListener("click", function(e) {
    if (creating) {
        creating = false;
        createButton.innerText = "Create";
    } else {
        creating = true;
        createButton.innerText = "Stop creating";
    }
}, false)

/* Position input */
const c = document.querySelector('canvas')
c.addEventListener('mousedown', function(e) {
    // if we are creating and we have enough vertices, create the shape
    if (creating) {
        var pos = getRelativeMousePosition(canvas, e);
        vertices.push(pos.x);
        vertices.push(pos.y);
        console.log(vertices);

        if (vertices.length >= nVertices*2) {
            vertices.slice(0, nVertices*2 + 1);
            switch (shapeType) {
                case "line":
                    color = [
                        r, g, b, 
                        r, g, b,
                    ];
                    draw(vertices, color, gl.LINES);
                    break;
        
                case "triangle":
                    color = [
                        r, g, b, 
                        r, g, b,
                        r, g, b,
                    ];
                    draw(vertices, color, gl.TRIANGLE_FAN);
                    break;
        
                case "square":
                    color = [
                        r, g, b, 
                        r, g, b,
                        r, g, b,
                        r, g, b,
                    ];
                    draw(vertices, color, gl.TRIANGLE_STRIP);
                    break;
                
                default:
                    break;
            }
            vertices = []; // reset array
        }
    }
})

function getRelativeMousePosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    // get relative position to canvas
    x = x * canvas.width / canvas.clientWidth;
    y = y * canvas.height / canvas.clientHeight;

    return { x, y }
}

/* Color input */
var colorInput = document.getElementById("color");
colorInput.addEventListener("input", function() {
    var colorValue = colorInput.value;
    r = parseInt(colorValue.substr(1,2), 16) / 255;
    g = parseInt(colorValue.substr(3,2), 16) / 255;
    b = parseInt(colorValue.substr(5,2), 16) / 255;
})

/* Shape input */
var shapeInput = document.getElementById("shape-type");
shapeInput.addEventListener("change", function() {
    shapeValue = shapeInput.value;
    switch (shapeValue) {
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