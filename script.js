// for more animations : 
// https://github.com/daneden/animate.css




// helpers

let vwInPx = (width) => width * window.innerWidth / 100;
let vhInPx = (height) => height * window.innerHeight / 100;

function is_touch_device() {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  var mq = function (query) {
    return window.matchMedia(query).matches;
  }
  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}

function isOverflown(element) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function isHorizontallyOverflown(cont, items) {
  let C = cont.getBoundingClientRect();
  let firstItem = items[0].getBoundingClientRect();
  let lastItem = items[items.length - 1].getBoundingClientRect();
  return lastItem.right - firstItem.left > C.right - C.left;
}

// CARDS NAVIGATION

// declaration and initialization
let header = document.getElementById('header');
let banner = document.getElementById('banner');
let cardsContainer = document.getElementById('cardCont');
let cards = document.getElementsByClassName('card');
let fillCards = document.getElementsByClassName('fill-card');
let scrollLeftBtn = document.getElementById('left');
let scrollRightBtn = document.getElementById('right');
let clientHeight, clientWidth;
let cardInView = 0;

// orientation
window.onload = window.onresize = () => {
  clientHeight = document.querySelector('html').clientHeight;
  clientWidth = document.querySelector('html').clientWidth;
  if (isHorizontallyOverflown(cardsContainer, cards)) {
    cardsContainer.style.justifyContent = 'start';
    fillCards[0].style.display = 'inline';
    fillCards[1].style.display = 'inline';
    if (clientWidth > clientHeight) {
      fillCards[0].style.maxWidth = `12vh`;
      fillCards[0].style.minWidth = `12vh`;
    } else {
      fillCards[0].style.maxWidth = `50vh`;
      fillCards[0].style.minWidth = `50vh`;
    }
    cards[cardInView].scrollIntoView({ inline: "center" });
  } else {
    cardsContainer.style.justifyContent = 'center';
    fillCards[0].style.display = 'none';
    fillCards[1].style.display = 'none';
  }
};

function scrollCardsLeft() {
  if (cardInView > 0)
    cards[--cardInView].scrollIntoView({ inline: "center" });
}

function scrollCardsRight() {
  if (cardInView < cards.length - 1)
    cards[++cardInView].scrollIntoView({ inline: "center" });
}

// using buttons
scrollLeftBtn.onclick = scrollCardsLeft;
scrollRightBtn.onclick = scrollCardsRight;
if (is_touch_device()) {
  scrollLeftBtn.style.display = 'none';
  scrollRightBtn.style.display = 'none';
}

// using arrow keys
document.onkeydown = (event) => {
  event.preventDefault();
  console.log(event);
  if (event.key == 'ArrowRight')
    scrollCardsRight();
  else if (event.key == 'ArrowLeft')
    scrollCardsLeft();
  else if (event.key === 'ArrowUp')
    openPlate();
  else if (event.key === 'ArrowDown')
    closePlate();
};


// using touch 
cardsContainer.addEventListener('touchstart', handleTouchStart, false);
cardsContainer.addEventListener('touchmove', handleTouchMove, false);
var xDown = null;
var yDown = null;

function getTouches(evt) {
  return evt.touches ||
    evt.originalEvent.touches;
}

function handleTouchStart(evt) {
  if (evt.target === cardsContainer) return;
  console.log(evt.type);
  begPos = evt.touches[0].screenY;
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
  if (!xDown || !yDown) return;
  if (evt.target === cardsContainer) return;

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
    if (xDiff > 0) {
      /* left swipe */
      scrollCardsRight();

    } else {
      /* right swipe */
      scrollCardsLeft();
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */
    } else {
      /* down swipe */
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
};

// Drawer
let vegRoll = document.getElementById('veg-roll');
let drawer = document.getElementById('drawer');
let closeBtn = document.getElementById('closebtn');
var handle = document.getElementById('handle');

function showDrawerHandle() {
  drawer.style.transition = `0.3s`;
  drawer.style.height = `7vh`;
  setTimeout(() => drawer.style.transition = ``, 300);
}
function hideDrawerHandle() {
  drawer.style.transition = `0.3s`;
  drawer.style.height = `0`;
  setTimeout(() => drawer.style.transition = ``, 300);
}

function openDrawer() {
  drawer.style.transition = `0.5s`;
  handle.style.transition = `0.5s`;
  banner.style.transition = `0.5s`;
  drawer.style.borderRadius = `0 0 0 0`;
  drawer.style.height = `${clientHeight - banner.clientHeight + 1/* hiding 1  */}px`;
  handle.style.opacity = `0`;
  banner.style.color = `#f1f1f1`;
  banner.style.backgroundColor = `#212121`;
  closeBtn.style.display = `block`;
  setTimeout(() => {
    drawer.style.transition = ``;
    handle.style.transition = ``;
    banner.style.transition = ``;
  }, 500);
}
function closeDrawer() {
  drawer.style.transition = `0.5s`;
  handle.style.transition = `0.5s`;
  banner.style.transition = `0.5s`;
  drawer.style.borderRadius = `20px 20px 0 0`;
  drawer.style.height = `7vh`;
  handle.style.opacity = `1`;
  banner.style.color = `#FF9800`;
  banner.style.backgroundColor = `#673AB7`;
  closeBtn.style.display = `none`;
  setTimeout(() => {
    drawer.style.transition = ``;
    handle.style.transition = ``;
    banner.style.transition = ``;
  }, 500);
}

vegRoll.onchange = () => vegRoll.checked ? showDrawerHandle() : hideDrawerHandle();
handle.onclick = () => { if (!is_touch_device()) openDrawer(); }
closeBtn.onclick = () => closeDrawer();

handle.addEventListener("touchstart", handleStart, false);
handle.addEventListener("touchmove", handleMove, false);
handle.addEventListener("touchend", handleEnd, false);

let initY;

function handleStart(evt) {
  evt.preventDefault();
  console.log("touchstart.");
  let touch = evt.changedTouches[0];
  initY = touch.clientY;
}

function handleMove(evt) {
  evt.preventDefault();
  let touch = evt.changedTouches[0];
  let newHeight = clientHeight - touch.clientY;
  if (evt.target === handle && newHeight < clientHeight && newHeight > vhInPx(7)) {
    drawer.style.height = `${newHeight}px`;
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  console.log('touchend');
  let touch = evt.changedTouches[0];
  if (touch.clientY - initY < vhInPx(8))
    openDrawer();
  else if (initY - touch.clientY < vhInPx(8))
    closeDrawer();
}

// https://flaviocopes.com/netlify-functions/