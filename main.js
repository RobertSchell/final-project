let grid = document.querySelector(".grid");
let flagsLeft = document.querySelector(".flags-left");
let result = document.querySelector(".result");
let resetButton = document.querySelector(".reset-button");
let darkButton = document.querySelector(".dark-button");
let h1 = document.querySelector("h1");
let newContainer = document.querySelector(".container");
let newFlagsLeft = document.querySelector("#flagsLeft");
let body = document.querySelector("body");
let width = 10;
let mineAmount = 20;
let flags = 0;
let squares = [];
let isGameOver = false;

 
//function to set up game board
function setupGameboard() {
  flagsLeft.innerHTML = mineAmount;
  let mineArray = Array(mineAmount).fill("mine");
  let safeArray = Array(width * width - mineAmount).fill("safe");
  let gameArray = safeArray.concat(mineArray);
  let randomArray = gameArray.sort(() => Math.random() -0.5);
  console.log(randomArray)
  for(let i = 0; i < width * width; i++) {
    let square = document.createElement("div");
    square.setAttribute("id", i);
    square.classList.add(randomArray[i]);
    grid.appendChild(square);
    squares.push(square);
    console.log(square);
    
    //event listener for left click
    square.addEventListener("click", function() {
      click(square);
    })

    //event listener for right click
    square.oncontextmenu = function(event) {
      event.preventDefault();
      addFlag(square);
    }
  }
  
  //for loop/nested ifs to check surrounding squares for mines...this is where we will determine what number goes in each surrounding square if square clicked is not a mine
  for (let i = 0; i < squares.length; i++) {
    let total = 0;
    let leftEdge = i % width === 0;
    let rightEdge = i % width === width - 1;
  
      if (squares[i].classList.contains("safe")) {
        if (i > 0 && leftEdge === false && squares[i - 1].classList.contains("mine"))
          total ++;
        if (i > 9 && rightEdge === false && squares[i + 1 - width].classList.contains("mine"))
          total ++;
        if (i > 9 && squares[i - width].classList.contains("mine"))
          total ++;
        if (i > 10 && leftEdge === false && squares[i - 1 - width].classList.contains("mine"))
          total ++;
        if (i < 99 && rightEdge === false && squares[i + 1].classList.contains("mine"))
          total ++;
        if (i < 90 && leftEdge === false && squares[i - 1 + width].classList.contains("mine"))
          total ++;
        if (i < 89 && rightEdge === false && squares[i + 1 + width].classList.contains("mine"))
          total ++;
        if (i < 90 && squares[i + width].classList.contains("mine"))
          total ++;
        
        squares[i].setAttribute("adjacentMines", total);
      }
  }
}
setupGameboard();
  
//function for adding/removing Flag with right click
function addFlag(square) {
  if (isGameOver === true)
    return;
  if (square.classList.contains("checked") === false && (flags <= mineAmount)) {
    if (square.classList.contains("flag") === false) {
      square.classList.add("flag");
      square.innerHTML = " 🚩";
      flags ++;
      flagsLeft.innerHTML = mineAmount - flags;
      
    } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flags --;
        flagsLeft.innerHTML = mineAmount - flags;
      }
  }
  checkForWin();
}
  
//click on square actions
function click(square) {
  let currentId = square.id;
  if (isGameOver === true)
    return;
  if (square.classList.contains("checked") || square.classList.contains("flag"))
    return;
  if (square.classList.contains("mine")) {
    gameOver(square);
  } else {
      let total = square.getAttribute("adjacentMines");
      if (total !== "0") { 
        if (total === "1") square.classList.add("one");
        if (total === "2") square.classList.add("two");
        if (total === "3") square.classList.add("three");
        if (total === "4") square.classList.add("four");
        if (total === "5") square.classList.add("five");
        if (total === "6") square.classList.add("six");
        if (total === "7") square.classList.add("seven");
        if (total === "8") square.classList.add("eight");
        square.classList.add("checked");
        square.innerHTML = total
          return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
}
    
//check neighboring squares once square is clicked (here is the recursive function)
function checkSquare(square, currentId) {
  let leftEdge = (currentId % width === 0);
  let rightEdge = (currentId % width === width - 1);
  setTimeout(() => {
    if (currentId > 0 && leftEdge === false) {
      let newId = squares[parseInt(currentId) - 1].id;
      let newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > 9 && rightEdge === false) {
      let newId = squares[parseInt(currentId) + 1 - width].id;
      let newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > 9) {
      let newId = squares[parseInt(currentId - width)].id;
      let newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > 10 && leftEdge === false) {
      let newId = squares[parseInt(currentId) - 1 - width].id;
      let newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 99 && rightEdge === false) {
      let newId = squares[parseInt(currentId) + 1].id;
      let newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 90 && leftEdge === false) {
      let newId = squares[parseInt(currentId) - 1 + width].id;
      let newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 89 && rightEdge === false) {
      let newId = squares[parseInt(currentId) + 1 + width].id;
      let newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 90) {
      let newId = squares[parseInt(currentId) + width].id;
      let newSquare = document.getElementById(newId);
      click(newSquare);
    }
  }, 5)
}
  
//game over function
function gameOver() {
  result.innerHTML = "You Clicked a Mine! Game Over!";
  isGameOver = true;
  //show all mines when gameOver condition = true
  squares.forEach(square => {
    if (square.classList.contains("mine")) {
      square.innerHTML = "💣";
      square.classList.remove("mine");
      square.classList.add("checked");
    }
  })
}
  
//check for win function
function checkForWin() {
  let matches = 0;
  
  for (let i = 0; i < squares.length; i++) {
    if (squares[i].classList.contains("flag") && squares[i].classList.contains("mine")) {
      matches ++;
    }
    if (matches === mineAmount) {
      result.innerHTML = "CONGRATULATIONS! YOU WIN!";
      isGameOver = true;
    }
  }
}
    
//eventListener for resetting board
resetButton.addEventListener("click", function(){
  formElement.reset();
})
        
//eventListener for darkMode 
darkButton.addEventListener("click", function(event){
  event.preventDefault();
  grid.style.background = "black";
  h1.style.color = "red";
  newContainer.style.background = "black";
  newFlagsLeft.style.color = "red";
  body.style.background = "black";      
})
