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

let animating = false;
function moveToCard(cardNo, cards, animationName) {
  animating = true;
  for (let card of cards) card.classList.add('animated', animationName);
  cards[cardNo].scrollIntoView({ inline: "center" });
  setTimeout(() => {
    for (let card of cards) card.classList.remove('animated', animationName);
    animating = false;
  }, 0);
};

// cards container justification 

let cardsContainer = document.getElementById('cardCont');
let cards = document.getElementsByClassName('card');
let fillCards = document.getElementsByClassName('fill-card');
let scrollLeftBtn = document.getElementById('left');
let scrollRightBtn = document.getElementById('right');
let bottom = document.getElementById('displayPlate');

let cardInView = 0;
const animationName = 'swing';
// const animationName = 'jello';

window.onload = window.onresize = () => {
  // solve this issue
  if (isHorizontallyOverflown(cardsContainer, cards)) {
    cardsContainer.style.justifyContent = 'start';
    fillCards[0].style.display = 'inline';
    fillCards[1].style.display = 'inline';
    moveToCard(cardInView, cards, animationName);
  } else {
    cardsContainer.style.justifyContent = 'center';
    fillCards[0].style.display = 'none';
    fillCards[1].style.display = 'none';
  }
  if (is_touch_device()) {
    scrollLeftBtn.style.display = 'none';
    scrollRightBtn.style.display = 'none';
  } else {
    scrollLeftBtn.style.display = 'inline';
    scrollRightBtn.style.display = 'inline';
  }
};

// navigation

function scrollCardsLeft() {
  if (cardInView > 0 && !animating) {
    cardInView--;
    moveToCard(cardInView, cards, animationName);
  }
}

function scrollCardsRight() {
  if (cardInView < cards.length - 1 && !animating) {
    cardInView++;
    moveToCard(cardInView, cards, animationName);
  }
}

scrollLeftBtn.onclick = scrollCardsLeft;
scrollRightBtn.onclick = scrollCardsRight;

openPlate = () => document.getElementById("myPlate").style.height = "100%";
closePlate = () => document.getElementById("myPlate").style.height = "0%";
let myPlate = document.getElementById('displayPlate');
myPlate.onclick = openPlate;

// navigation using keys
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


// touch navigation

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

let d = document.getElementById('myPlate');
let begPos;

function getTouches(evt) {
  return evt.touches ||        // browser API
    evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
  console.log(evt.type);
  begPos = evt.touches[0].screenY;
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
  console.log(evt.type);

  if (!xDown || !yDown) {
    return;
  }

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
