/*
 * Name: Rahel Worku
 * Date: 10/19/2022
 * Section: AC, Allison Ho
 *
 * This is the JS to implement the game for the user to play on. The game responds to
 * the user's actions such as choosing their game mode, and the choosing of certain cards.
 */

'use strict';

(function() {
  let timerId = null;
  let remainingSeconds = 0;
  const STYLE = ['solid', 'outline', 'striped'];
  const SHAPE = ['diamond', 'oval', 'squiggle'];
  const COLOR = ['green', 'purple', 'red'];
  const COUNT = [1, 2, 3];

  window.addEventListener("load", init);

  /** Adds the responsivness of the game's menu when buttons are clicked */
  function init() {
    id("start-btn").addEventListener("click", toggleViews);
    id("back-btn").addEventListener("click", toggleViews);
    id("start-btn").addEventListener("click", startTimer);
    id("start-btn").addEventListener("click", board);
    id("back-btn").addEventListener("click", endGame);
    id("refresh-btn").addEventListener("click", refreshBoard);
  }

  /** Switches the view of the page between the menu screen and the game screen */
  function toggleViews() {
    id("menu-view").classList.toggle("hidden");
    id("game-view").classList.toggle("hidden");
  }

  /** Creates a randomized set of attributes that define how a card will look
   * @param {boolean} isEasy - checks if the user chose the easy game mode
   * @returns {Array} attributes - returns the randomly generated attributes for one card
   */
  function generateRandomAttributes(isEasy) {
    let shape = SHAPE[randNum()];
    let color = COLOR[randNum()];
    let count = COUNT[randNum()];
    let style = STYLE[randNum()];
    if (isEasy) {
      style = STYLE[0];
    }
    let attributes = [style, shape, color, count];
    return attributes;
  }

  /**
   * Generates a random number
   * @returns {number} rand - returns a random number
   */
  function randNum() {
    let rand = Math.floor(Math.random() * 3);
    return rand;
  }

  /**
   * Checks if the user chose the play on easy mode
   * @returns {boolean} Boolean - returns whether or not the user picked easy mode
   */
  function gameMode() {
    return Boolean(qs("input").checked);
  }

  /**
   * Creates a number of images to be in each card
   * @param {boolean} isEasy - checks if the user chose to play on easy mode
   * @returns {Array} card - returns the individual card filled with images
   */
  function generateUniqueCard(isEasy) {
    let card = gen("div");
    let cardStyle = generateRandomAttributes(isEasy);
    if (isEasy) {
      cardStyle[0] = "solid";
    }
    let pic = cardStyle[0] + "-" + cardStyle[1] + "-" + cardStyle[2];
    card.id = pic + "-" + cardStyle[3];
    while (id(card.id)) {
      cardStyle = generateRandomAttributes(isEasy);
      pic = cardStyle[0] + "-" + cardStyle[1] + "-" + cardStyle[2];
      card.id = pic + "-" + cardStyle[3];
    }
    for (let i = 0; i < cardStyle[3]; i++) {
      let photo = gen("img");
      photo.src = "img/" + pic + ".png";
      console.log(photo.scr);
      photo.alt = pic + "-" + cardStyle[3];
      card.appendChild(photo);
    }
    card.classList.add("card");
    card.addEventListener("click", cardSelected);
    return card;
  }

  /**
   * Starts a timer for the game based on the time limit the user chose
   */
  function startTimer() {
    let gameLength = qs("select");
    let time = gameLength.value;
    remainingSeconds = parseInt(time);
    id("time").textContent = "0" + remainingSeconds / 60 + ":00";
    timerId = setInterval(advanceTimer, 1000);
  }

  /**
   * Updates the time remaining in the game with a timer shown on screen
   */
  function advanceTimer() {
    remainingSeconds--;
    let minutes = Math.floor((remainingSeconds) / 60);
    let seconds = Math.floor((remainingSeconds) % 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    id("time").textContent = "0" + minutes + ":" + seconds;
    if (remainingSeconds === 0) {
      clearInterval(timerId);
      timerId = null;
      id("refresh-btn").disabled = true;
      let selectedCards = qsa(".card");
      for (let i = 0; i < selectedCards.length; i++) {
        selectedCards[i].classList.remove("selected");
        selectedCards[i].removeEventListener("click", cardSelected);
      }
    }
  }

  /**
   * Creates a certain number of cards on the game board depending on what mode the user chose
   */
  function board() {
    if (gameMode()) {
      for (let i = 0; i < 9; i++) {
        id("board").appendChild(generateUniqueCard(gameMode()));
      }
    } else {
      for (let i = 0; i < 12; i++) {
        id("board").appendChild(generateUniqueCard(gameMode()));
      }
    }
  }

  /**
   * Clears the game board of all cards
   */
  function clearBoard() {
    let clear = id("board");
    let child = clear.lastElementChild;
    while (child) {
      clear.removeChild(child);
      child = clear.lastElementChild;
    }
  }

  /**
   * Ends the game when the player used up all their alotted time
   */
  function endGame() {
    clearBoard();
    clearInterval(timerId);
    timerId = null;
    let setCount = id("set-count").textContent;
    setCount = "0";
    id("refresh-btn").disabled = false;
  }

  /**
   * Refreshes the game board by clearing past cards and replaces the board with a new
   *  one with new cards
   */
  function refreshBoard() {
    clearBoard();
    board();
  }

  /**
   * Shows whether or not a set was made when three cards are selected
   */
  function cardSelected() {
    let setCount = id("set-count");
    this.classList.toggle("selected");
    let pickedCards = qsa(".selected");
    if (pickedCards.length === 3) {
      if (isASet(pickedCards)) {
        let count = parseInt(setCount.textContent) + 1;
        setCount.textContent = count;
        for (let i = 0; i < pickedCards.length; i++) {
          let replacingCard = generateUniqueCard(gameMode());
          replacingCard.classList.add("hide-imgs");
          let message = gen("p");
          message.textContent = "SET!";
          replacingCard.appendChild(message);
          id("board").replaceChild(replacingCard, pickedCards[i]);
          setTimeout(function() {
            replacingCard.classList.remove("hide-imgs");
            replacingCard.removeChild(message);
          }, 1000);
        }
      } else {
        for (let i = 0; i < pickedCards.length; i++) {
          pickedCards[i].classList.toggle("selected");
          pickedCards[i].classList.add("hide-imgs");
          let message = gen("p");
          message.textContent = "Not a Set";
          pickedCards[i].appendChild(message);
          setTimeout(function() {
            pickedCards[i].classList.remove("hide-imgs");
            let text = pickedCards[i].lastElementChild;
            pickedCards[i].removeChild(text);
          }, 1000);
        }
      }
    }
  }

  /**
   * Checks to see if the three selected cards make up a valid set. This is done by comparing each
   * of the type of attribute against the other two cards. If each four attributes for each card are
   * either all the same or all different, then the cards make a set. If not, they do not make a set
   * @param {DOMList} selected - list of all selected cards to check if a set.
   * @return {boolean} true if valid set false otherwise.
   */
  function isASet(selected) {
    let attributes = [];
    for (let i = 0; i < selected.length; i++) {
      attributes.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attributes[0].length; i++) {
      let diff = attributes[0][i] !== attributes[1][i] &&
                attributes[1][i] !== attributes[2][i] &&
                attributes[0][i] !== attributes[2][i];
      let same = attributes[0][i] === attributes[1][i] &&
                    attributes[1][i] === attributes[2][i];
      if (!(same || diff)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns a new created element with the given name.
   * @param {string} tagName - element ID.
   * @returns {object} - DOM object associated with element.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

})();