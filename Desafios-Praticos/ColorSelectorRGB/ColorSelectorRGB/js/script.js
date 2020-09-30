window.addEventListener('load', start);

var globalInputRed = null;
var globalInputGreen = null;
var globalInputBlue = null;

var globalValueRed = null;
var globalValueGreen = null;
var globalValueBlue = null;

var globalResultColor = null;

function start() {
  var a = { id: 2 };
  var b = a;
  a.id = 4;

  console.log(b);

  globalInputRed = document.querySelector('#redRange');
  globalInputGreen = document.querySelector('#greenRange');
  globalInputBlue = document.querySelector('#blueRange');

  globalValueRed = document.querySelector('#redValue');
  globalValueGreen = document.querySelector('#greenValue');
  globalValueBlue = document.querySelector('#blueValue');

  globalResultColor = document.querySelector('#boxColor');

  globalValueRed.value = globalInputRed.value;
  globalValueGreen.value = globalInputGreen.value;
  globalValueBlue.value = globalInputBlue.value;

  globalInputRed.addEventListener('input', changeValueRed);
  globalInputGreen.addEventListener('input', changeValueGreen);
  globalInputBlue.addEventListener('input', changeValueBlue);
}

function changeValueRed() {
  globalValueRed.value = globalInputRed.value;
  globalValueRed.innerHTML = this.value;
  changeColor();
}
function changeValueGreen() {
  globalValueGreen.value = globalInputGreen.value;
  globalValueGreen.innerHTML = this.value;
  changeColor();
}
function changeValueBlue() {
  globalValueBlue.value = globalInputBlue.value;
  globalValueBlue.innerHTML = this.value;
  changeColor();
}

function changeColor() {
  globalResultColor.style.backgroundColor = `rgb(${globalValueRed.value},${globalValueGreen.value},${globalValueBlue.value})`;
  writeRGB = document.querySelector('#valueRGB');
  writeRGB.innerHTML = globalResultColor.style.backgroundColor;
}
