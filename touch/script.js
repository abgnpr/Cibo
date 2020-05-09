let vwInPx = (width) => width * window.innerWidth / 100;
let vhInPx = (height) => height * window.innerHeight / 100;
let vminInPx = (v) => window.innerHeight < window.innerWidth ? vhInPx(v) : vwInPx(v);

function open(ele) {
  ele.style.transition = `0.5s`;
  ele.style.height = `100vh`;
  setTimeout(() => ele.style.transition = ``, 500);
}

function close(ele) {
  ele.style.transition = `0.5s`;
  ele.style.height = `10vh`;
  setTimeout(() => ele.style.transition = ``, 500);
}

function startup() {
  var handle = document.getElementById("handle");
  handle.addEventListener("touchstart", handleStart, false);
  handle.addEventListener("touchmove", handleMove, false);
  handle.addEventListener("touchend", handleEnd, false);
}

document.addEventListener("DOMContentLoaded", startup);

let initY;
var handle = document.getElementById('handle');
var div = document.getElementById("div");

handle.onclick = () => open(div);

function handleStart(evt) {
  evt.preventDefault();
  console.log("touchstart.");
  var touch = evt.changedTouches[0];
  initY = touch.clientY;
}

function handleMove(evt) {
  evt.preventDefault();
  var touch = evt.changedTouches[0];
  let newHeight = vhInPx(100) - touch.clientY;
  if (evt.target === handle && newHeight < vhInPx(100) && newHeight > vhInPx(5))
    div.style.height = `${newHeight}px`;
}

function handleEnd(evt) {
  evt.preventDefault();
  console.log('touchend');
  var touch = evt.changedTouches[0];
  if (touch.clientY - initY < vhInPx(8))
    open(div);
  else if (initY - touch.clientY < vhInPx(8))
    close(div);
}