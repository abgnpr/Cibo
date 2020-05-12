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

// declaration and initialization
const header = document.getElementById('header');
const banner = document.getElementById('banner');
const scrollBtnLeft = document.getElementById('left');
const scrollBtnRight = document.getElementById('right');
const fillCards = document.getElementsByClassName('fill-card');
const cardsContainer = document.getElementById('cardCont');

const cards = document.getElementsByClassName('card');
let clientHeight, clientWidth;
let cardInView = 0;

// orientation
window.onresize = orientate;
function orientate() {
  clientHeight = document.querySelector('html').clientHeight;
  clientWidth = document.querySelector('html').clientWidth;
  let cardsContainer = document.getElementById('cardCont');
  let fillCard1 = document.getElementById('fillCard1');
  let fillCard2 = document.getElementById('fillCard2');
  if (!fillCard1 || !fillCard2) return;
  if (isHorizontallyOverflown(cardsContainer, cards)) {
    cardsContainer.style.justifyContent = 'start';
    fillCard1.style.display = 'inline';
    fillCard2.style.display = 'inline';
    if (clientWidth > clientHeight) {
      fillCard1.style.maxWidth = `12vh`;
      fillCard1.style.minWidth = `12vh`;
    } else {
      fillCard1.style.maxWidth = `50vh`;
      fillCard1.style.minWidth = `50vh`;
    }
    cards[cardInView].scrollIntoView({ inline: "center" });
  } else {
    cardsContainer.style.justifyContent = 'center';
    fillCard1.style.display = 'none';
    fillCard1.style.display = 'none';
  }
}

Drawer = new class {
  constructor() {
    this.selectedItems = [];
  }

  render() {

    if (this.selectedItems.length === 0) {
      hideDrawerHandle();
      return;
    } else {
      const selectedItemsCont = document.getElementById('selected-items');

      let totalAmt = 0;
      for (let item of this.selectedItems) {
        if (!item.selected) {
          item.selected = document.createElement('div');
          item.selected.className = 'item';
          item.selected.qty = 1; // default
          item.selected.name = menu[item.cardNo].items[item.itemNo].name;
          item.selected.price = menu[item.cardNo].items[item.itemNo].price;
          item.selected.innerHTML = `
          <div class="name">${item.selected.name}</div>
          <button class="inc">+</button>
          <div class="qty">${item.selected.qty}</div>
          <button class="dec">-</button>
          <div class="price">${item.selected.price}/-</div>
          `;
          selectedItemsCont.appendChild(item.selected);

          // increase qty button
          item.selected.children[1].onclick = (event) => {
            let selected = event.target.parentNode;
            console.log(event);
            console.log(selected);

            if (selected.qty < 5) {
              selected.qty += 1;
              selected.children[2].innerText = `${selected.qty}`;
              selected.children[4].innerText = `${selected.price * selected.qty}/-`;
              Drawer.render();
            }
          };

          // decrease qty button
          item.selected.children[3].onclick = (event) => {
            let selected = event.target.parentNode;
            if (selected.qty > 1) {
              selected.qty -= 1;
              selected.children[2].innerText = `${selected.qty}`;
              selected.children[4].innerText = `${selected.price * selected.qty}/-`;
              Drawer.render();
            }
          };
        }

        totalAmt += item.selected.price * item.selected.qty;

      }

      // update the total amount
      document.getElementById('total').innerHTML = `Total&nbsp;:&nbsp;&#8377;${totalAmt}/-`;
      showDrawerHandle();
    }
  }

  add(item) {
    this.selectedItems.push(item);
    this.render();
  }

  remove(item) {
    let removedItem = this.selectedItems.splice(this.selectedItems.indexOf(item), 1)[0]; // returns an array with the removed element
    removedItem.selected.parentNode.removeChild(removedItem.selected);
    removedItem.selected = undefined;
    this.render();
  }

  clearAll() {
    let removedItem;
    while (this.selectedItems.length > 0) {
      removedItem = this.selectedItems.pop();
      removedItem.selected.parentNode.removeChild(removedItem.selected);
      removedItem.checked = false;
      removedItem.selected = undefined;
    }
    this.render();
  }
}

let menu;
const foodDataUrl = `./fooddata.json`;
let settings = { method: "Get" };
fetch(foodDataUrl, settings)
  .then(res => res.json())
  .then((json) => {
    menu = json;

    // fill card 1
    let fillCard1 = document.createElement('div');
    fillCard1.setAttribute('class', 'fill-card');
    fillCard1.setAttribute('id', 'fillCard1');
    cardsContainer.appendChild(fillCard1);

    let cardNo = 0;
    for (let card of menu) {
      // card
      let newCard = document.createElement('div');
      newCard.setAttribute("class", "card");
      let cardId = 'card' + cardNo;
      newCard.setAttribute("id", cardId);
      newCard.innerHTML = `
      <div class="card-title">${card.title}</div>
      <div class="items-container"></div>
      `;
      cardsContainer.appendChild(newCard);

      // card items
      let itemNo = 0;
      let itemsContainer = document.querySelector(`#${cardId} .items-container`);
      for (let item of card.items) {
        let newItem = document.createElement('div');
        newItem.setAttribute('class', 'card-item');
        let itemId = cardId + 'item' + itemNo;
        newItem.innerHTML = `
        <div class="checkbox">
          <div class="check"><input id="${itemId}" type="checkbox" />
            <label for="${itemId}"><div class="box"><i class="fa fa-check">&#x2714;</i></div></label>
          </div>
        </div>
        <div class="name">${item.name}</div>
        <div class="price">${item.price}/-</div>
        `;
        itemsContainer.appendChild(newItem);

        // actually the checkbox
        let currentItem = document.getElementById(itemId);
        currentItem.cardNo = cardNo;
        currentItem.itemNo = itemNo;
        currentItem.onchange = (event) => {
          if (event.target.checked)
            Drawer.add(event.target);
          else
            Drawer.remove(event.target);
        }
        itemNo += 1;
      }
      cardNo += 1;
    }

    // fill card 2
    let fillCard2 = document.createElement('div');
    fillCard2.setAttribute('class', 'fill-card');
    fillCard2.setAttribute('id', 'fillCard2');
    cardsContainer.appendChild(fillCard2);

    orientate();
  });

// CARDS NAVIGATION
function scrollCardsLeft() {
  if (cardInView > 0)
    cards[--cardInView].scrollIntoView({ inline: "center" });
}

function scrollCardsRight() {
  if (cardInView < cards.length - 1)
    cards[++cardInView].scrollIntoView({ inline: "center" });
}

// using buttons
scrollBtnLeft.onclick = scrollCardsLeft;
scrollBtnRight.onclick = scrollCardsRight;
if (is_touch_device()) {
  scrollBtnLeft.style.display = 'none';
  scrollBtnRight.style.display = 'none';
}

// use a semaphore
// using arrow keys
document.onkeydown = (event) => {
  event.preventDefault();
  // event.stopPropagation();
  // console.log(event);
  if (event.key == 'ArrowRight')
    scrollCardsRight();
  else if (event.key == 'ArrowLeft')
    scrollCardsLeft();
  else if (event.key === 'ArrowUp')
    cards[cardInView].lastElementChild.scrollBy(0, -1 * vhInPx(8));
  else if (event.key === 'ArrowDown')
    cards[cardInView].lastElementChild.scrollBy(0, vhInPx(8));
  else if (event.key === 'F11' && document.fullscreenEnabled)
    document.querySelector('html').requestFullscreen();
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
  // begPos = evt.touches[0].screenY;
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
    if (xDiff > 0)
      scrollCardsRight();    /* left swipe */
    else
      scrollCardsLeft();  /* right swipe */
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
const drawer = document.getElementById('drawer');
const handle = document.getElementById('handle');
const selectedItemsCont = document.getElementById('selected-items');
const order = document.getElementById('order');
const closeBtn = document.getElementById('closebtn');

let drawerOpen = false;

function showDrawerHandle() {
  if (!drawerOpen) {
    drawer.style.transition = `0.3s`;
    drawer.style.height = `7vh`;
    setTimeout(() => drawer.style.transition = ``, 300);
  }
}

function hideDrawerHandle() {
  drawer.style.transition = `0.3s`;
  drawer.style.height = `0`;
  setTimeout(() => drawer.style.transition = ``, 300);
}

function openDrawer() {
  drawerOpen = true;

  banner.style.transition = `0.5s`;
  drawer.style.transition = `0.5s`;
  handle.style.transition = `0.5s`;
  selectedItemsCont.style.transition = `0.5s`;
  order.style.transition = `0.05s`;

  drawer.style.borderRadius = `0 0 0 0`;
  drawer.style.height = `${clientHeight - banner.clientHeight + 1/* hiding 1  */}px`;
  handle.style.opacity = `0`;
  handle.style.height = `2%`;
  banner.style.backgroundColor = `#212121`;
  closeBtn.style.display = `block`;
  selectedItemsCont.style.opacity = `1`;
  order.style.opacity = `1`;

  setTimeout(() => {
    drawer.style.transition = ``;
    handle.style.transition = ``;
    banner.style.transition = ``;
    selectedItemsCont.style.transition = ``;
    order.style.transition = ``;
  }, 500);
}

function closeDrawer() {
  drawerOpen = false;

  drawer.style.transition = `0.5s`;
  handle.style.transition = `0.5s`;
  banner.style.transition = `0.5s`;
  selectedItemsCont.style.transition = `0.5s`;
  order.style.transition = `0.5s`;

  banner.style.backgroundColor = ``;
  drawer.style.borderRadius = `20px 20px 0 0`;
  drawer.style.height = `7vh`;
  handle.style.height = `7vh`;
  handle.style.opacity = `1`;
  closeBtn.style.display = `none`;
  selectedItemsCont.style.opacity = `0`;
  order.style.opacity = `0`;

  setTimeout(() => {
    drawer.style.transition = ``;
    handle.style.transition = ``;
    banner.style.transition = ``;
    selectedItemsCont.style.transition = ``;
    order.style.transition = ``;
  }, 500);
}

handle.onclick = () => openDrawer();
closeBtn.onclick = () => closeDrawer();
clearAll.onclick = () => {
  closeDrawer();
  Drawer.clearAll();
}

handle.addEventListener("touchstart", handleStart, false);
handle.addEventListener("touchmove", handleMove, false);
handle.addEventListener("touchend", handleEnd, false);

let initY;

function handleStart(evt) {
  evt.preventDefault();
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
  let touch = evt.changedTouches[0];
  if (touch.clientY - initY < vhInPx(8))
    openDrawer();
  else if (initY - touch.clientY < vhInPx(8))
    closeDrawer();
}
