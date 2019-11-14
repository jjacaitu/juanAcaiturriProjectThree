const myApp = {};

myApp.masterCode = [];
myApp.userInput = [];

myApp.guessNumber = 1;

myApp.init = function () {
    // this.randomCodeGenerator();
    // this.inputClickEvent;
    // this.deleteClickEvent;
    
    // myApp.startEvent;
    $(".rightPannel button").attr("disabled", "true");
    $(".enter").attr("disabled","true")
}

myApp.startEvent = $(".start").on("click", function () {
    console.log("yep");
    $(".introduction").fadeOut();
    $("h1").fadeIn();
    myApp.startComputer("Beginning launching nuke sequence..............<br>Launching will take place in 20:00 minutes.....<br>Enter the correct code and press the red button in order to stop the launching...... <br>Starting 20:00 minute sequence in....<br>");
    myApp.randomCodeGenerator();
});

myApp.randomCodeGenerator = function () {
    for (let i = 0; i < 4; i++){
        const randomNumber = Math.ceil(Math.random() * 6);
        this.masterCode.push(randomNumber);
    }
    console.log(this.masterCode);
}

myApp.inputClickEvent = $(".userInputOptions").on("click", ".input", function () {
    
    if (myApp.userInput.length < 4) {
        const inputGenerated = parseInt($(this).val());
        myApp.userInput.push(inputGenerated);
        
        let html = ""

        myApp.userInput.forEach((input) => {
            html += `<span class="input${input}">${input}</span>`
        })

        $(`.userGuess${myApp.guessNumber}`).html(`${html}<span aria-hidden="true" class="blinking">|</span>`);
        
        if (myApp.userInput.length === 4) {
            $(".enter").removeAttr("disabled");
            $(".input").attr("disabled", "true");
        }
    
    }
    console.log(myApp.userInput);
});

myApp.enterClickEvent = $(".enter").on("click", function () {
    const correctGuesses = myApp.getCorrectGuessesAndPosition();
    $(`.blinking`).remove();
    $(".input").removeAttr("disabled");
    if (correctGuesses === 4) {
        myApp.generateFeedbackSquares(correctGuesses, 0);
        $(".stopButtonDoor").addClass("open");
        $(".enter").attr("disabled", "true");
    } else {
        const correctGuessesMisplaced = myApp.getCorrectGuessesMisplaced() - correctGuesses;
        myApp.time.minutes -= 2;
        if (myApp.time.minutes < 0) {
            myApp.time.minutes = 0;
            myApp.time.seconds = 0;
            myApp.time.miliseconds = 0;
        }
        $(".time").addClass("timeDown");
        $(".time").bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
            $(this).removeClass("timeDown");
        }).addClass("timeDown");
        myApp.generateFeedbackSquares(correctGuesses, correctGuessesMisplaced);

        myApp.userInput = [];
        $(".enter").attr("disabled", "true");
        myApp.guessNumber++;
        $(".guessesAndFeedback>p").text(`Attemps remaining:${11 - myApp.guessNumber}`);
        if (myApp.guessNumber > 10) {
            myApp.loseAlert;
        } else {
            myApp.displayStart();
        }
    }
});

myApp.deleteClickEvent = $(".delete").on("click", function () {
    $(".input").removeAttr("disabled");
    myApp.userInput.pop();
    let html = ""

    myApp.userInput.forEach((input) => {
        html += `<span class="input${input}">${input}</span>`
    })

    $(`.userGuess${myApp.guessNumber}`).html(`${html}<span aria-hidden="true" class="blinking">|</span>`);
    $(".enter").attr("disabled","true");
    console.log(myApp.userInput);
});

myApp.getCorrectGuessesAndPosition = function () {
    let correctGuesses = 0;
    for (let i = 0; i < this.userInput.length; i++){
        if (myApp.userInput[i] === myApp.masterCode[i]) {
            correctGuesses++;
        }
    }
    console.log(correctGuesses);
    return correctGuesses;
}

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

myApp.displayStart = function () {
    $(`.guessNumber${myApp.guessNumber}`).text(myApp.guessNumber);
    $(`.userGuess${myApp.guessNumber}`).html(`<span aria-hidden="true" class="blinking">|</span>`);
    
}

myApp.generateFeedbackSquares = function (exact, misplaced) {
    let squareCount = 4;
    const $feedbackDiv = $(`.feedback${myApp.guessNumber}`);
    for (let i = 0; i < exact; i++){
        $feedbackDiv.append(`<div class="feedbackSquares exact"></div>`);
        squareCount--;
    }


    for (let i = 0; i < misplaced; i++) {
        $feedbackDiv.append(`<div class="feedbackSquares misplaced"></div>`);
        squareCount--;
    }

    for (let i = 0; i < squareCount; i++) {
        $feedbackDiv.append(`<div class="feedbackSquares"></div>`);
    }
}

myApp.time = {
    minutes: 20,
    seconds: 0,
    miliseconds: 0

}

myApp.createGuessesDiv = function () {
    const html = `<p>Attempts remaining: 10</p>
                    <div class="guess">
                        <p>Attempt #</p>
                        <p class="userGuess">Code:</p>
                        <p class="feedback">Result:</p>
                    </div>`;
    const $guessesAndFeedbackDiv = $(".guessesAndFeedback");
    $guessesAndFeedbackDiv.append(html);
    for (let i = 1; i <= 10; i++){
        const div = `<div class="guess">
                        <p class="guessNumber${i}">${i===1?1:""}</p>
                        <p class="userGuess userGuess${i}"></p>
                        <div class="feedback feedback${i}"></div>
                    </div>`
        $guessesAndFeedbackDiv.append(div)
    }
}

myApp.startTimer = function () {
    myApp.timer = setInterval(() => {
        const minutes = myApp.time.minutes;
        const seconds = myApp.time.seconds;
        const miliseconds = myApp.time.miliseconds;

        if (minutes === 0 && seconds === 0 && miliseconds === 0) {
            clearInterval(myApp.timer);
            $(".time").text(`Time: ${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}:${miliseconds < 10 ? "0" + miliseconds : miliseconds}`)
            myApp.loseAlert;
        
        } else {
            if (miliseconds !== 0) {
                myApp.time.miliseconds--;

            }
            if (miliseconds === 0) {
                if (seconds === 0) {
                    myApp.time.minutes--;
                    myApp.time.seconds = 59;
                    myApp.time.miliseconds = 99
                } else {
                    myApp.time.seconds--;
                    myApp.time.miliseconds = 99
                }
            }
        }

        $(".time").text(`Time: ${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}:${miliseconds < 10 ? "0" + miliseconds : miliseconds}`)
    
    }, 10)
}

myApp.stopButtonClick = $(".stopButton").on("click", function () {
    clearInterval(myApp.timer);
    myApp.winAlert;
});

myApp.winAlert = Swal.fire({
    title: '<h2>CONGRATULATIONS!</h2>',
    html: `<span>You made it! You cracked the code and stopped the lockdown!</span>`,
    // icon: 'success',
    confirmButtonText: '<span class="input">Play again</span>',
    confirmButtonColor: "crimson",
    allowOutsideClick: false,
    background: "black"
})

myApp.loseAlert = Swal.fire({
    title: `<h2>You didn't stopped it!</h2>`,
    html: `<span>You didn't made it! The nuke has launched and you couldn't stop it!</span>`,
    // icon: 'success',
    confirmButtonText: '<span class="input">Play again</span>',
    confirmButtonColor: "crimson",
    allowOutsideClick: false,
    background: "black"
})

myApp.startComputer = function (string) {
    let index = 0;
    let text = "";
    const array = string.split("");
    console.log(array)
    array.forEach(function (letter,index) {
        setTimeout(() => {
            text += letter;
            $(".comp").html(text + `<span aria-hidden="true" class="blinking">|</span>`);
        }, 25 * index);
    })

    for (let i = 5; i >= 0; i--){
        setTimeout(() => {
            if (i !== 0) {
                text += i + "<br>";
                $(".comp").html(text + `<span aria-hidden="true" class="blinking">|</span>`);
            } else {
                $(".comp").remove();
                myApp.createGuessesDiv();
                myApp.startTimer();
                $(".rightPannel button").removeAttr("disabled");
                $(".enter").attr("disabled", "true");
                myApp.displayStart();
            }
            
        }, (25 * array.length) + (150 * (50 - i * 7)));
    }
}

$(document).ready(function () {
    myApp.init();   
    
})