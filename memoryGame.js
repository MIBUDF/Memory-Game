//Global variables for location:
let STARTING_X_LOCATION = 25;
let STARTING_Y_LOCATION = 150;

//Menu UI items:
var startButton;
var startButtonX;
var startButtonY;
var startButtonWidth = 180;
var startButtonHeight = 60;
var gameText;
var startText;

//Retry UI Items
var retryMenu;
var completedText;
var bestTimeText;
var currentRunTime;
var retryButton;
var retryText;
var mainMenuButton;
var mainMenuText;

//Card related icons:
var deck = ["diamond", "diamond", "circle", "circle", "square", "square", "triangle", "triangle"]; //set deck.
var cards = [];
var cardCount = 0; //Uses to check for a later function.
var cardsFlipped = [] //Empty array to compare values later on.
var shapesFlipped = [] //Empty array to delete flipped shapes later on.
var matchedPairs = 0;

//Time related Icons:
var bestTime = 0;
var count = 0;
var timeText;
var firstTimeBeaten = true; //this is to check if it is the first time beating the game
var timerRunning = false; //Used to test if many timers are going at the same time.

//------------------------------------------------------------------------------------------------
//Starts the program up:

function start(){
    shuffleOrder(deck);
    menuUI();
}

//------------------------------------------------------------------------------------------------
//UI background and clickable boxes:

function menuUI(){ //Function used to draw the background and the game screen up.
    drawBackground();
    startButtonX = (getWidth() - startButtonWidth) / 2;
    startButtonY = (getHeight() - startButtonHeight) / 2;
    startButton = drawRect(startButtonX, startButtonY, startButtonWidth, startButtonHeight, "GRAY"); //Creates the start button.
    gameText = drawText((getWidth() - 260) / 2, 90, "Memory Game", "28pt Arial", "BLACK"); //Creates the game name.
    startText = drawText(startButtonX + 35, startButtonY + 40, "START", "25pt Arial", "BLACK"); //Creates the start text.
    mouseClickMethod(removeMainMenu);
}

function removeMainMenu(e){ //Function used to remove the main menu.
    if((e.getX() >= startButtonX && e.getX() <= startButtonX + startButtonWidth) &&
       (e.getY() >= startButtonY && e.getY() <= startButtonY + startButtonHeight)){
        mouseClickMethod(null); //Makes it so it doesn't take any more mouse inputs.
        remove(startButton);
        remove(gameText);
        remove(startText);
        game();
    }
}

function retryScreen(){ //Function used to load the retry screen and send the player to the main menu or back into the game.

    if(firstTimeBeaten === true){ //This is to check if this is the first time beating the game. If it wasn't implemented bestTime would always be zero.
        bestTime = count;
        firstTimeBeaten = false;
    }else if(count < bestTime){
        bestTime = count; //This is to check if the player beat the game faster than their best PB.
    }
    
    var retryWidth = getWidth() / 1.5;
    var retryX = (getWidth() - retryWidth) / 2;
    var buttonX = (getWidth() - 200) / 2;
    var centerX = retryX + retryWidth / 2;
    
    retryMenu = drawRect(retryX, 0, retryWidth, getHeight(), "#C4A484");
    completedText = drawText(centerX - 80, 50, "Good Job!", "25pt Arial", "BLACK");
    bestTimeText = drawText(centerX - 95, 90, "Best time: " + bestTime, "25pt Arial", "BLACK");
    currentRunTime = drawText(centerX - 120, 130, "This attempt time: " + count, "20pt Arial", "BLACK");
    retryButton = drawRect(buttonX, 175, 200, 100, "GRAY");
    retryText = drawText(buttonX + 40, 235, "Try Again", "25pt Arial", "BLACK");
    mainMenuButton = drawRect(buttonX, 300, 200, 100, "GRAY");
    mainMenuText = drawText(buttonX + 30, 360, "Main Menu", "25pt Arial", "BLACK");
    mouseClickMethod(removeRetryMenu);
}

function removeRetryMenu(e){ //This is to remove the retry menu and send the player to the main menu or back into the game.
    var buttonX = (getWidth() - 200) / 2;
    if((e.getX() >= buttonX && e.getX() <= buttonX + 200) && (e.getY() >= 300 && e.getY() <= 400)){ //Checks for main menu button.
        removeRetryMenuItems(); //Removes the retry menu.
        resetGameState(); //Starts everything fresh.
        shuffleOrder(deck); //shuffles the card order.
        menuUI(); //Goes back to main menu.
    }else if((e.getX() >= buttonX && e.getX() <= buttonX + 200) && (e.getY() >= 175 && e.getY() <= 275)){//checks for retry button.
        removeRetryMenuItems(); //Removes the retry menu.
        resetGameState(); //Starts everything fresh.
        shuffleOrder(deck);// shuffles the card order.
        game(); // Starts a new game without going to main menu.
    }
}

function drawBackground(){ //Function used to draw the cyan background and call it multiple times.
    drawRect(0, 0, getWidth(), getHeight(), "CYAN"); //Draws the cyan background.
}

function removeRetryMenuItems(){ //Function used for the player to click once and remove the retry menu items.
    mouseClickMethod(null);//disables further clicking.
    remove(retryMenu);
    remove(completedText);
    remove(bestTimeText);
    remove(currentRunTime);
    remove(retryButton);
    remove(retryText);
    remove(mainMenuButton);
    remove(mainMenuText);
}

//--------------------------------------------------------------------------------------- 
//Game itself: 

function game(){ //This function creates the cards and calls the card function that scores the
//card info into the array cards.
    
    var xPosition = (getWidth() - (4 * 75 + 3 * 15)) / 2; // center cards horizontally
    var yPosition = STARTING_Y_LOCATION;
    
    drawBackground();
    drawText(25, 50, "Time: ", "25pt Arial", "BLACK");
    timer();
    
    for(var row = 0; row < 2; row++){
        xPosition = (getWidth() - (4 * 75 + 3 * 15)) / 2;
        for(var column = 0; column < 4; column++){
            var index = row * 4 + column;
            card(xPosition, yPosition, deck[index], index);
            xPosition += 90;
        }
        yPosition += 100;
    }
    mouseClickMethod(cardFlip);
}

function card(x, y, symbol, index){ //This function takes in many parameters to
//to push the value of the cards into the array cards.

    var card = drawRect(x, y, 75, 75, "WHITE");
    var questionMark = drawText(x + 27, y + 47, "?", "25pt Arial", "BLACK");
    
    cards.push({
        rect: card, 
        text: questionMark,
        symbol: symbol, // make it so when flipped it shows the symbol from order array.
        index: index,
        flipped: false,
        matched: false
    });
}

function cardFlip(e){ //This function is used to check if the player clicks on any card and then later calls 
//the function check value to determine if they should match.

    for(var i = 0; i < cards.length; i++){
        if((e.getX() >= cards[i].rect.getX() && e.getX() <= cards[i].rect.getX() + 75) && (e.getY() >= cards[i].rect.getY() && e.getY() <= cards[i].rect.getY() + 75) && (cards[i].matched == false)){
            
            cardsFlipped.push(i); //gets the index value to check if they're the same.
            
            if(cardsFlipped[0] == cardsFlipped[1]){
                
                //used to make sure clicking on the same square doesn't remove it.
                cardsFlipped.pop();
                cardCount = 1
                shapesFlipped[1] = shapesFlipped[0];
                shapesFlipped.pop();
                
            }else{
                
                var shape = icon(i);
                shapesFlipped.push(shape); //Pushes the shape to delete if they're the same.
                cards[i].flipped = true;
                cardCount += 1;
                if(cardCount === 2){ //will reset every value to make sure that it doesn't keep adding other junk.
                    checkValues(cardsFlipped, shapesFlipped);
                    cardCount = 0;
                    shapesFlipped = [];
                    cardsFlipped = [];
                    
                }
            }
        }
    }
}

function icon(index){ //This function takes in the index of the card that the user clicked and if it hasn't already been flipped
//to determine what shape should be added to give the illusion of the card being flipped
    
    if(cards[index].symbol == "circle"){
        if(cards[index].flipped == false){
            return drawCircle(cards[index].rect.getX() + 37, cards[index].rect.getY() + 37, 20, "RED"); //Draws a red circle in the middle of the card.
        }
    }
    
    if(cards[index].symbol == "square"){
        if(cards[index].flipped == false){
            return drawRect(cards[index].rect.getX() + 17, cards[index].rect.getY() + 17, 40, 40, "BLUE"); //Draws a blue square in the middle of the card.
        }
    }
    
    if(cards[index].symbol == "triangle"){
        if(cards[index].flipped == false){
            return drawTriangle(cards[index].rect.getX() + 15, cards[index].rect.getY() + 20, cards[index].rect.getX() + 55, cards[index].rect.getY() + 20, cards[index].rect.getX() + 37, cards[index].rect.getY() + 60, "GREEN");// Draws a green triangle in the middle of the card.
        }
    }
    
    if(cards[index].symbol == "diamond"){
        if(cards[index].flipped == false){
        return drawDiamond(cards[index].rect.getX() + 15, cards[index].rect.getY() + 35, cards[index].rect.getX() + 37, cards[index].rect.getY() + 60, cards[index].rect.getX() + 55, cards[index].rect.getY() + 35, cards[index].rect.getX() + 35, cards[index].rect.getY() + 10, "YELLOW");// Draws a yellow triangle in the middle of the card.
        }
    }
}

function checkValues(cardIndexes, shapes){ //This function takes in the two indexes the user clicked
//to check if they should be matched. If the symbols of the cards are the same and both are flipped
//they are matched and the values of the box in each index is deleted along with it's text.
    
    var valueOne = cardIndexes[0];
    var valueTwo = cardIndexes[1];
    
    var shape1 = shapes[0];
    var shape2 = shapes[1];
    
    var cardOne = cards[valueOne];
    var cardTwo = cards[valueTwo];
    
    if((cards[valueOne].symbol == cards[valueTwo].symbol) && (cards[valueOne].flipped == true && cards[valueTwo].flipped == true)){
        cards[valueOne].matched = true;
        cards[valueTwo].matched = true;
        delayDelete(cards[valueOne].rect, cards[valueOne].text, 500);
        delayDelete(cards[valueTwo].rect, cards[valueTwo].text, 500);
        matchedPairs += 1;
    }else{
        cards[valueOne].flipped = false;
        cards[valueTwo].flipped = false;
    }
    
    delayDelete(shape1, shape2, 500);
    
    if(matchedPairs == 4){ //If the matched number of pairs is half of the total indexes of the array cards. The game ends.
        retryScreen();
    }
    
}

function resetGameState(){ //Function used to soft reset the game back to it's original state without altering the PB value or the game itself.
    cards = [];
    cardsFlipped = [];
    shapesFlipped = [];
    matchedPairs = 0;
    cardCount = 0;
    count = 0;
    timerRunning = false;
    stopTimer(countUp);
}

//-------------------------------------------------------------------------------------------------

//Helper functions

function drawRect(x, y, width, height, color){ //This function takes in parameters to draw a rectangle anywhere needed and returns the result.
    var rectangle = new Rectangle(width, height);
    rectangle.setPosition(x, y);
    rectangle.setColor(color);
    add(rectangle);
    return(rectangle);
}

function drawText(x, y, text, font, color){ //This function takes in parameters to draw text anywhere needed and returns the result.
    var txt = new Text(text, font);
    txt.setPosition(x, y);
    txt.setColor(color);
    add(txt);
    return(txt);
}

function drawCircle(x, y, radius, color){ //This function takes in parameters to draw a circle anywhere needed and returns the result.
    var circle = new Circle(radius);
    circle.setPosition(x, y);
    circle.setColor(color);
    add(circle);
    return(circle);
}

function drawTriangle(x1, y1, x2, y2, x3, y3, color){ //This function takes in parameters to draw a triangle anywhere needed and returns the result.
    var triangle = new Polygon();
    triangle.addPoint(x1, y1);
    triangle.addPoint(x2, y2);
    triangle.addPoint(x3, y3);
    triangle.setColor(color);
    add(triangle);
    return(triangle);
}

function drawDiamond(x1, y1, x2, y2, x3, y3, x4, y4, color){ //This function takes in parameters to draw a diamond anywhere needed and returns the result.
    var diamond = new Polygon();
    diamond.addPoint(x1, y1);
    diamond.addPoint(x2, y2);
    diamond.addPoint(x3, y3);
    diamond.addPoint(x4, y4);
    diamond.setColor(color);
    add(diamond);
    return(diamond);
}

//------------------------------------------------------------------
//Time related functions:

function shuffleOrder(array){ //This function is used to shuffle the order of indexes in the array cards and returns the result.
    for(var i = 0; i < array.length - 1; i++){
        var j = Randomizer.nextInt(0, i);
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return(array);
}

function timer(){
    
    if(timerRunning){ //this is used to make sure that multiple timers are not running at once.
        stopTimer(countUp);
    }
    
    timerRunning = true;
    timeText = drawText(112.5, 50, "0", "25pt Arial", "BLACK"); //This sets the position of the time text.
    setTimer(countUp, 1000); //This timer is used to set the speed to call the function countUp every second.
    
}

function countUp(){ //This function is used to make the variable count go up by one every second
    count += 1;
    timeText.setText(count);
}


//This function takes in the two shapes and the delay time to delete the shapes after a certain amount of time has passed.
function delayDelete(shape1, shape2, delayTime){ //delays deleting the shapes after being matched.
    setTimeout(function() {
        remove(shape1);
        remove(shape2);
    }, delayTime);
}
