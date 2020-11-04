let weight1 = new Float64Array(784 * 300);
let bias1 = new Float64Array(300);
let weight2 = new Float64Array(300 * 10);
let bias2 = new Float64Array(10);
let input = new Array(784);
let temp1 = new Array(300);
let temp2 = new Array(10);

let isDrawing = false;

let isSlowMode = false;

document.getElementById("clear").addEventListener("click", clear);
const resultButton = document.getElementById("result");
resultButton.addEventListener("click",feed);
const slowModeCheckBox = document.getElementById("slowMode");
slowModeCheckBox.addEventListener("click", slowMode);
const expect = document.getElementById("expect");
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
    for (let i = 0; i < weight1.length; i++, off += 8) {
        weight1[i] = dataview.getFloat64(off);
    }
    for (let i = 0; i < bias1.length; i++, off += 8) {
        bias1[i] = dataview.getFloat64(off);
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

function onMouseDown() {
    isDrawing = true;
}

function onMouseUp() {
    isDrawing = false;
}

function slowMode(){
    if(slowModeCheckBox.checked){
        isSlowMode = true;
        resultButton.disabled = false;
    }else{
        isSlowMode = false;
        resultButton.disabled = true;
    }
}

function feed() {
    let pixel = ctx.getImageData(0, 0, 560, 560);
    input.fill(0, 0, 784);
    for (let i = 0; i < 560; i++) {
        for (let j = 0; j < 560 * 4; j += 4) {
            input[Math.floor(i / 20) * 28 + Math.floor(j / 80)] += Math.floor(pixel.data[i * 560 * 4 + j] / 255);
        }
    }
    for (let i = 0; i <784; i++){
        input[i] /=400
    }
    temp1.fill(0, 0, 300);
    for (let i = 0 ; i < 300; i++){
        for(let j = 0 ; j < 784; j++){
            temp1[i]+= weight1[j * 300 + i] * input [j];
        }
        temp1[i] += bias1[i];
    }
    for (let i = 0; i <300; i++){
        if(temp1[i]<0){
            temp1[i] = 0;
        }
    }
    temp2.fill(0,0,10);
    for (let i = 0 ; i < 10; i++){
        for(let j = 0 ; j < 300; j++){
            temp2[i]+= weight2[j * 10 + i] * temp1 [j];
        }
        temp2[i] += bias2[i];
    }
    let maxLabel = 0;
    let max = temp2[0];
    for (let i = 1; i <10; i++){
        if (max < temp2[i]){
            maxLabel = i;
            max = temp2[i];
        }
    }
    expect.innerText = String(maxLabel);
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
        if (!isSlowMode){
            feed();
        }
    }
}