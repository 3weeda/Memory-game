/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

const cards = ["diamond", "diamond", "paper-plane-o", "paper-plane-o", "anchor",
 "anchor", "bolt", "bolt", "cube", "cube", "leaf", "leaf", "bicycle", "bicycle",
  "bomb", "bomb"];
const deck = document.querySelector('.deck');
const moves = document.querySelector('.moves');
const restart = document.querySelector('.restart');
const restartCopy = restart.cloneNode(true);
const stars = document.querySelector('.stars');
const time = document.querySelector('.time');
const moveTracker = document.querySelector('.moveTracker');
const finish = document.querySelector('.finish');
const winMessage = document.querySelector(".finish-message");
let minutes = document.querySelector('.minutes');
let seconds = document.querySelector('.seconds');
let timer;
let restartTimer = 0;
let cardCouple = [];
let done = 0;

//Event listeners
restart.addEventListener('click', restartGame);//restart button in the game page
restartCopy.addEventListener('click', restartGame);//restart button in the finish message page
deck.addEventListener('click', start);
//Call shuffle and build functions to create a new random card sequence
shuffle(cards);
buildCards();
//restart button cascade
function restartGame(){
  deck.innerHTML = "";//remove old cards
  shuffle(cards);//shuffle all cards
  buildCards();//build with a new card sequence
  restartTimer = 0;//to start new timer
  cardCouple = [];//make sure card couple list is clear
  done = 0;//start calculating matched cards done -till reach 8 done and finish game-
  moves.innerText = 0;//bring number of moves back to zero
  minutes.innerText = 0;//bring number of minutes back to zero
  seconds.innerText = 0;//bring number of seconds back to zero
  resetRating();//bring star rating back to full
  stopTime();//stop any current timers
  removeFinishMessage();//remove finish message and show the game once more
}

function start(e){
    //serves only one timer function for every game
    if (restartTimer === 0){
      startTime();
      restartTimer = 1;
    }
    //make new cards unresponsive to clicks till current cards match or dismatch
    if (cardCouple.length > 1){
      return;
    }
    rotate(e);
    cardCouple.push(e.target);
    //prevents accepting the same card as a right couple when double clicked
    //prevents errors if the deck background is clicked instead of a card
    if (cardCouple[0] === cardCouple[1] || e.target.tagName !== 'LI'){
      cardCouple.pop();
      return;
    }
    if (cardCouple.length === 2 && e.target.tagName === 'LI'){
      checkMatching();
      rating();
    }
    else {
      return;
    }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 //function declarations

 //start stop watch -minutes and seconds-
 function startTime() {
 	timer = setInterval(function() {
 		seconds.innerText++;
 		if(seconds.innerText == 60) {
 			minutes.innerText++;
 			seconds.innerText = 0;
 		}
 	}, (1000));
 	return timer;
 }
//freeze stop watch
 function stopTime() {
 	clearInterval(timer);
 }
//flip clicked card
 function rotate(e){
   e.target.classList.add('open');
   e.target.classList.add('show');
 }
//check if the two cards chosen matched or not, and then remove them from the list
 function checkMatching(){
   if (cardCouple[0].classList.value === cardCouple[1].classList.value) {
 		setTimeout(function(){
 			rightMatch();
       cardCouple = [];
 		}, 400);
   }
   else{
     setTimeout(function(){
       wrongMatch();
       cardCouple = [];
     }, 700);
   }
 }
//if the cards do match, lock the cards in the open position
 function rightMatch(){
   cardCouple[0].classList.add('match');
   cardCouple[1].classList.add('match');
   done++;
   if (done === 8){
     stopTime();
     showFinishMessage();
   }
 }
//if the cards do not match, remove the cards from the list and hide the card's symbol
 function wrongMatch(){
   cardCouple[0].classList.remove('open', 'show');
   cardCouple[1].classList.remove('open', 'show');
 }
//star rating decrease by 1 star when moves exceed 14 and by 2 stars when moves exceed 20
function rating(){
  //// TODO: Bug has been fixed
  if (!cardCouple[0].classList.contains('match') && !cardCouple[1].classList.contains('match')){
    moves.innerText++;
  }
  if (moves.innerText > 14){
     document.querySelector('.stars li:nth-child(1)').classList.add('starDown');
  }
   else if (moves.innerText > 20){
     document.querySelector('.stars li:nth-child(2)').classList.add('starDown');
  }
}
//showing finish message after winning the game, adding time elapsed, star rating, number of moves
function showFinishMessage() {
 	finish.style.display = 'block';
  const starsCopy = stars.cloneNode(true);
  const timeCopy = time.cloneNode(true);
  const moveTrackerCopy = moveTracker.cloneNode(true);
 	winMessage.appendChild(restartCopy);
 	winMessage.appendChild(starsCopy);
 	winMessage.appendChild(timeCopy);
 	winMessage.appendChild(moveTrackerCopy);
}
//removing the finish message
function removeFinishMessage() {
 	finish.style.display = 'none';
  winMessage.appendChild(restartCopy);
 	winMessage.appendChild(starsCopy);
 	winMessage.appendChild(timeCopy);
 	winMessage.appendChild(moveTrackerCopy);
}
//build new board with the latest random cards sequence
function buildCards(){
  for (const card of cards){
    const newCards = document.createElement('li');
    newCards.setAttribute('class', 'card fa fa-' + card);
    deck.appendChild(newCards);
  }
}
//reset star rating to full
function resetRating(){
     document.querySelector('.stars li:nth-child(1)').classList.remove('starDown');
     document.querySelector('.stars li:nth-child(2)').classList.remove('starDown');
 }


/*
*QUESTION: when playing the game more than once, there are 2 star ratings
*and 2 moveTrackers present in the finishmessage box. I know it's because
*of the variables' local scope inside showFinishMessage function, but I
*can't figure another way to write the code to recover this.
*/
