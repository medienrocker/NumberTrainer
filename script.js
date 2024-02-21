document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generateNumber');
    const repeatButton = document.getElementById('repeatNumber');
    const revealButton = document.getElementById('revealSolution');
    const numbersArea = document.getElementById('numbersArea');
    let currentNumber = 0;
    let audioElements = {};
    let wrongAnswerAudio = ['wrong1.mp3', 'wrong2.mp3', 'wrong3.mp3']; // Array of wrong answer audio clips
    let correctAnswerAudio = ['correct1.mp3', 'correct2.mp3', 'correct3.mp3']; // Array of correct answer audio clips

    // Function to initialize audio elements
    function initializeAudio() {
        for (let i = 0; i <= 10; i++) {
            let audio = new Audio('audio/number' + (i < 10 ? '0' + i : i) + '.mp3');
            audioElements[i] = audio;
        }
        correctAnswerAudio.forEach((file, index) => {
            audioElements['correct' + index] = new Audio('audio/' + file);
        });
        wrongAnswerAudio.forEach((file, index) => {
            audioElements['wrong' + index] = new Audio('audio/' + file);
        });
    }

    // Function to play a random number sound
    function playRandomNumber() {
        currentNumber = Math.floor(Math.random() * 11);
        audioElements[currentNumber].play();
        generateNumbers();
        document.getElementById('revealSolution').classList.remove('nt_hidden');
    }


    // Function to generate number buttons
    function generateNumbers() {
        numbersArea.innerHTML = '';
        let numbers = shuffleArray([...Array(11).keys()]);
        numbers.forEach(num => {
            let numberButton = document.createElement('button');
            numberButton.textContent = num.toString();
            numberButton.className = 'number';
            numberButton.type = 'button';
            numberButton.onclick = function () { checkNumber(num); };
            numbersArea.appendChild(numberButton);
        });
    }

    // Function to shuffle array (Fisher-Yates Shuffle)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to check if the selected number is correct
    function checkNumber(num) {
        let selectedButton = event.target;
        if (num === currentNumber) {
            selectedButton.className = 'number correct';
            playRandomCorrectAudio();
        } else {
            selectedButton.className = 'number incorrect';
            playRandomWrongAudio();
        }
    }

    // Function to play a random audio clip for a wrong answer
    function playRandomWrongAudio() {
        let randomIndex = Math.floor(Math.random() * wrongAnswerAudio.length);
        audioElements['wrong' + randomIndex].play();
    }

    // Function to play a random audio clip for a correct answer
    function playRandomCorrectAudio() {
        let randomIndex = Math.floor(Math.random() * correctAnswerAudio.length);
        audioElements['correct' + randomIndex].play();
    }

    // Function to reveal the solution
    function revealSolution() {
        let allButtons = numbersArea.getElementsByClassName('number');
        Array.from(allButtons).forEach(button => {
            if (parseInt(button.textContent) === currentNumber) {
                button.className = 'number correct';
            }
        });
    }

    // Event listeners for buttons
    generateButton.addEventListener('click', playRandomNumber);
    repeatButton.addEventListener('click', function () {
        audioElements[currentNumber].play();
    });
    revealButton.addEventListener('click', revealSolution);

    initializeAudio();
});
