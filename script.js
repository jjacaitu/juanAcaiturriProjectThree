
// Creating the app object.

const myApp = {};

// Create an empty list to store the random generated code

myApp.masterCode = [];

// Create an empty list to store the player's input

myApp.userInput = [];

// Create an empty object that will store the remaining time after the game begins

myApp.time = {};

// Create an property that will store the attempt number of the player, this is to know how many more guesses can the player make

myApp.guessNumber = 1;

// Defining the init method which will make sure that the input buttons on the right panel start disabled

myApp.init = function () {
    $(".rightPannel button").attr("disabled", "true");
}

// Bind the event of starting the game to the start button

myApp.startEvent = $(".start").on("click", function () {
    // Make introduction div desappear
    $(".introduction").fadeOut();
    // Make the h2 on the header appear
    $("header h2").fadeIn();
    // call the method that makes the game introduction simulation the computer starting the nuke.
    myApp.startComputer("Beginning launching nuke sequence..............<br>Launching will take place in 20:00 minutes.....<br>Enter the correct code and press the red button in order to stop the launching...... <br>Starting 20:00 minute sequence in....<br>");
    // Call the method that generates the random code
    myApp.randomCodeGenerator();
});

// Create the methos that generates the random code in the game.

myApp.randomCodeGenerator = function () {

    // Make sure the list that contains the random generated code is empty before creating a new one.

    myApp.masterCode = [];

    // A for loop that gets one random number and pushes it to the list 4 times to generate the 4 digit random code.
    for (let i = 0; i < 4; i++){
        const randomNumber = Math.ceil(Math.random() * 6);
        this.masterCode.push(randomNumber);
    }
}

// Bind the click event on each one fo the inputs options for the player

myApp.inputClickEvent = $(".userInputOptions").on("click", ".input", function () {
    

    const inputGenerated = parseInt($(this).val());
    myApp.userInput.push(inputGenerated);
    
    myApp.updateInputsOnScreen();
    
    // Use of conditional to disable the buttons in case the user has already created a 4 digit code.
    
    if (myApp.userInput.length === 4) {
        $(".enter").removeAttr("disabled");
        $(".input").attr("disabled", "true");
    }
    
    
});

//Method to update inputs in the screen by looping through each number on the players input list and using a variable outside that loop concatenate each number in order to create the html to insert on the guess each time the player makes an input.

myApp.updateInputsOnScreen = function () {
    
    let html = "";

    myApp.userInput.forEach((input) => {
        html += `<span class="input${input}">${input}</span>`
    });

    $(`.guess${myApp.guessNumber}`).html(
        `<p class="guessNumber${myApp.guessNumber}">${myApp.guessNumber}</p>
        <p class="userGuess userGuess${myApp.guessNumber}">${html}<span aria-hidden="true" class="blinking">|</span></p><div class="feedback feedback${myApp.guessNumber}"></div>`);

}

// Bind the click event to the enter button

myApp.enterClickEvent = $(".enter").on("click", function () {

    // Each time the player enters a guess, call the method that evaluates how many of the digits are on the correct position and number.

    const correctGuesses = myApp.getCorrectGuessesAndPosition();

    $(`.blinking`).remove();
    $(".input").removeAttr("disabled");

    // If all 4 digits are correct in both position and number(or color) then generate the feedback visually to the page and open the door to reveal the stop button. Also disable all the input buttons.
    if (correctGuesses === 4) {
        myApp.generateFeedbackSquares(correctGuesses, 0);
        $(".stopButtonDoor").addClass("open");
        $(".input").attr("disabled", "true");
        $(".enter").attr("disabled", "true");
        $(".delete").attr("disabled", "true");

        // This is to make sure the player goes to the stop button In case the game is being played on mobile

        window.location = '#stopButton';
        
    } else {

        // If not all the digits are on the correct place then call the method that checks how many of the digits exists on the random generated code and substract the number of guesses that were found earlier that were the correct number and in the correct position.

        const correctGuessesMisplaced = myApp.getCorrectGuessesMisplaced() - correctGuesses;

        // Make the timer go down by two minutes because the complete input of the player wasn't correct.

        if (myApp.time.minutes < 2) {
            myApp.time.minutes = 0;
            myApp.time.seconds = 0;
        } else {
            myApp.time.minutes -= 2;
        }
            
        // Update the timer.

        $(".time").text(`Time: 00:${myApp.time.minutes < 10 ? "0" + myApp.time.minutes : myApp.time.minutes}:${myApp.time.seconds < 10 ? "0" + myApp.time.seconds : myApp.time.seconds}`)
        
        // Apply the animation of the time going down and removing the class after the animation has ended
        $(".time").bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
            $(this).removeClass("timeDown");
        }).addClass("timeDown");

        // Dispplay the feedback on the screen by callig the method created to do this.

        myApp.generateFeedbackSquares(correctGuesses, correctGuessesMisplaced);

        // Reset the player input for the nex guess.

        myApp.userInput = [];

        // Disable the enter button until next 4 digit input has been entered by the player to make sure the player doesn't enter a code with fewer digits.

        $(".enter").attr("disabled", "true");

        // Add one to what guess number the player is currently playing.
        myApp.guessNumber++;

        // Update how many attempts the player has left

        $(".guessesAndFeedback>p").text(`Attempts remaining:${11 - myApp.guessNumber}`);

        // Evaluate if the player has guesses left, if not end the game by getting the timer to zero.
        if (myApp.guessNumber > 10) {
            myApp.time.minutes = 0;
            myApp.time.seconds = 0;
        } else {
            myApp.displayStart();
        }
    }
});

// Bind the delete event to the delete button

myApp.deleteClickEvent = $(".delete").on("click", function () {

    // Remove disabled attribute to the input buttons to make sure that they are enabled in case the player decides to delete one of the digits of their code.

    $(".input").removeAttr("disabled");

    // Remove the last number on the user Input list.
    myApp.userInput.pop();

    myApp.updateInputsOnScreen();
    
});

// Method that returns the amount of digits on the user guess that are on both the correct position and the correct number

myApp.getCorrectGuessesAndPosition = function () {
    let correctGuesses = 0;
    for (let i = 0; i < this.userInput.length; i++){
        if (myApp.userInput[i] === myApp.masterCode[i]) {
            correctGuesses++;
        }
    }
    return correctGuesses;
}

// Method that returns the amount of digits on the user guess that exist on the random generated code but are not on the correct position

myApp.getCorrectGuessesMisplaced = function () {
    let guessesMisplaced = 0;
    const masterCodeCopy = myApp.masterCode.slice();
    for (let i = 0; i < this.userInput.length; i++) {
        if (masterCodeCopy.includes(myApp.userInput[i])) {
            guessesMisplaced++;
            const indexToDelete = masterCodeCopy.indexOf(myApp.userInput[i]);
            masterCodeCopy.splice(indexToDelete, 1);
        }
    }

    return guessesMisplaced;
}

// Method that creates the new line for the next turn.

myApp.displayStart = function () {
    $(`.guessNumber${myApp.guessNumber}`).text(myApp.guessNumber);
    $(`.userGuess${myApp.guessNumber}`).html(`<span aria-hidden="true" class="blinking">|</span>`);
    
}

// Method that displays the feedback squares on the screen

myApp.generateFeedbackSquares = function (exact, misplaced) {
    // create a variable that keeps track of how many squares are left to display
    let squareCount = 4;
    const $feedbackDiv = $(`.feedback${myApp.guessNumber}`);
    
    for (let i = 0; i < exact; i++){
        $feedbackDiv.append(`<div class="feedbackSquares exact"><span class="sr-only">One fo the digits is correct and in the exact position</span></div>`);
        squareCount--;
    }


    for (let i = 0; i < misplaced; i++) {
        $feedbackDiv.append(`<div class="feedbackSquares misplaced"><span class="sr-only">One fo the digits is correct but not on the correct position</span></div>`);
        squareCount--;
    }

    for (let i = 0; i < squareCount; i++) {
        $feedbackDiv.append(`<div class="feedbackSquares"><span class="sr-only">One fo the digits is incorrect and doesn't exist in the code</span></div>`);
    }
}

// Method that creates the basic structure of the div that will contain the player guesses and feedback. 

myApp.createGuessesDiv = function () {
    const html = `<p>Attempts remaining: 10</p>
                    <div class="guess">
                        <p>#</p>
                        <p class="userGuess">Code:</p>
                        <p class="feedback">Result:</p>
                    </div>`;
    const $guessesAndFeedbackDiv = $(".guessesAndFeedback");
    $guessesAndFeedbackDiv.html(html);
    for (let i = 1; i <= 10; i++){
        const div = `<div class="guess guess${i}"></div>`
        $guessesAndFeedbackDiv.append(div)
    }
}

// Method that starts the timer

myApp.startTimer = function () {

    // Define the time left when the game starts

    myApp.time.minutes = 19;
    myApp.time.seconds = 59;

    // apply animation to the time to make the player aware that the time started togo down
    $(".time").bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
        $(this).removeClass("timeDown");
    }).addClass("timeDown");


    $(".time").text("Time: 00:19:59");

    // Set the interval that will continue to update the timer each second and store it in the object so it can be cleared later.
    myApp.timer = setInterval(() => {
        
        const minutes = myApp.time.minutes;
        const seconds = myApp.time.seconds;

        $(".time").text(`Time: 00:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`)

        // If there is less than one minute left change the color of the time to red by applying a class.

        if (minutes < 1) {
            $(".time").addClass("alarm");   
        }
        
        // If the timer gets to 0 then show the message that the player lost and clear the interval

        if (myApp.time.minutes === 0 && myApp.time.seconds === 0) {
            clearInterval(myApp.timer);
            $(".time").text(`Time: 00:00:00`);
            myApp.loseAlert();
        
        } else {
            if (myApp.time.seconds !== 0) {
                myApp.time.seconds-- ;

            }else{
                myApp.time.seconds = 59
                myApp.time.minutes--;
            } 
        }
    
    }, 1000)
}

// Bind the stop event to the stop button.
myApp.stopButtonClick = $(".stopButton").on("click", function () {

    // When the stop button is pressed clear the interval to stop the timer and show the "Congratulations" message by calling the win alert. Also disable the input buttons.

    clearInterval(myApp.timer);
    myApp.winAlert();
    $(".input").attr("disabled", "true");
});

// Method that calls the message in the case the player wins and lets the player play again.
myApp.winAlert = function () {
    Swal.fire({
        title: '<h2>CONGRATULATIONS!</h2>',
        html: `<span>You made it! You cracked the code and stopped the launch!</span>`,
        confirmButtonText: '<span class="input">Play again</span>',
        confirmButtonColor: "crimson",
        allowOutsideClick: false,
        background: "black",
        onClose: myApp.restart
    })
}


// Method that calls the message in the case the player loses and lets the player play again, It aslo applies the shaking(exploding) animation to the background.

myApp.loseAlert = function () {
    Swal.fire({
        title: `<h2>You didn't stop it!</h2>`,
        html: `<span>You didn't made it! The nuke has launched and you couldn't stop it!<br>The correct code was:<br> ${myApp.masterCode.join(" ")}</span>`,
        confirmButtonText: '<span class="input">Play again</span>',
        confirmButtonColor: "crimson",
        allowOutsideClick: false,
        background: "black",
        onClose: myApp.restart,
        onOpen: $("main").addClass("explode")
    })
}

// Method that generates the typed message when the game is starting

myApp.startComputer = function (string) {

    let text = "";
    const ariaLabel = `<p class="computerDisplay" aria-label="Beginning launching nuke sequence. Launching will take place in 20: 00 minutes. Enter the correct code and press the red button in order to stop the launching. Starting 20:00 minute sequence shortly" aria-hidden="true"></p>`

    // split the message that is going to be showed to the user in order to show it one letter at a time.
    const array = string.split("");

    // for each letter in the array  start a time out that will concatenate each letter in order to show the message letter by letter.
    array.forEach(function (letter,index) {
        setTimeout(() => {
            text += letter;
            $(".guessesAndFeedback").html(`${ariaLabel}${text} <span aria-hidden="true" class="blinking">|</span></p>`);
        }, 25 * index);
    })

    for (let i = 5; i >= 0; i--){
        setTimeout(() => {
            if (i !== 0) {
                text += i + "<br>";
                $(".guessesAndFeedback").html(`${ariaLabel}${text} <span aria-hidden="true" class="blinking">|</span></p>`);
            } else {
                $(".computerDisplay").remove();
                myApp.createGuessesDiv();
                myApp.startTimer();
                $(".rightPannel button").removeAttr("disabled");
                $(".enter").attr("disabled", "true");
                myApp.displayStart();
            }
            
        }, (25 * array.length - 1) + (150 * (50 - i * 7)));
    }
}

// Mathod that restarts the game but without the tying introduction.

myApp.restart = function () {
    // Restore everything to the initial state.
    $(".guessesAndFeedback").html(`<p class="computerDisplay"></p>`);
    myApp.masterCode = [];
    myApp.randomCodeGenerator();
    myApp.startTimer();
    myApp.createGuessesDiv();
    $(".stopButtonDoor").removeClass("open");
    myApp.userInput = [];
    myApp.guessNumber = 1;
    $(".time").removeClass("alarm");
    $(".delete").removeAttr("disabled");
    $("main").removeClass("explode");
    $(".input").removeAttr("disabled");
}

// Document ready

$(document).ready(function () {
    myApp.init();  
})