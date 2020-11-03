let weight = new Float64Array(784 * 300);
let bias = new Float64Array(300);
let weight2 = new Float64Array(300 * 10);
let bias2 = new Float64Array(10);
let input = new Array(784);
input.fill(0, 0, 784);

isDrawing = false;

const clearButton = document.getElementById("clear").addEventListener("click", clear);
const resultButton = document.getElementById("result").addEventListener("click",feed);
const canvas = document.getElementById("input");
ctx = canvas.getContext("2d");
clear();

let req = new XMLHttpRequest();
req.open('GET', "./settings.bin");
req.responseType = "arraybuffer";
req.onload = function () {
    if (req.status !== 200) {
        alert("Unexpected status code " + req.status);
        return false
    }
    let buffer = req.response;
    let dataview = new DataView(buffer);
    let off = 12;
    for (let i = 0; i < weight.length; i++, off += 8) {
        weight[i] = dataview.getFloat64(off);
    }
    for (let i = 0; i < bias.length; i++, off += 8) {
        bias[i] = dataview.getFloat64(off);
    }
    off += 8
    for (let i = 0; i < weight2.length; i++, off += 8) {
        weight2[i] = dataview.getFloat64(off);
    }
    for (let i = 0; i < bias2.length; i++, off += 8) {
        bias2[i] = dataview.getFloat64(off);
    }
}
req.send();

canvas.addEventListener("mousemove", onMouseMove);
document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mouseup", onMouseUp);

function onMouseDown(event) {
    isDrawing = true;
}

function onMouseUp(event) {
    isDrawing = false;
}

function feed() {
    let pixel = ctx.getImageData(0, 0, 560, 560);
    input.fill(0, 0, 784);
    for (let i = 0; i < 560; i++) {
        for (let j = 0; j < 560 * 4; j += 4) {
            input[Math.floor(i / 20) * 28 + Math.floor(j / 80)] += Math.floor(pixel.data[i * 560 * 4 + j] / 255);
        }
    }
    console.log(input);
}

function clear() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 560, 560);
}

function onMouseMove(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    if (isDrawing) {
        ctx.beginPath();
        ctx.arc(x - 20, y - 20, 40, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    }
}