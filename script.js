document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('nt_generateNumber');
    const repeatButton = document.getElementById('nt_repeatNumber');
    const revealButton = document.getElementById('nt_revealSolution');
    const numbersArea = document.getElementById('nt_numbersArea');
    let currentNumber = 0;
    let audioElements = {};
    let wrongAnswerAudio = ['wrong1.mp3', 'wrong2.mp3', 'wrong3.mp3']; // Array of wrong answer audio clips
    let correctAnswerAudio = ['correct1.mp3', 'correct2.mp3', 'correct3.mp3', 'correct4.mp3']; // Array of correct answer audio clips
    let maxRange = 6; // Default range

    // Initialize slider and displayed range
    document.getElementById('rangeSlider').value = maxRange;
    document.getElementById('sliderValue').innerText = maxRange;

    // Set initial active state for range button
    document.getElementById('range06').classList.add('nt_active');

    // Function to initialize audio elements
    function initializeAudio() {
        for (let i = 0; i <= 20; i++) {
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

    function setMaxRange(range) {
        maxRange = range;
        document.getElementById('sliderValue').innerText = range; // Update slider value display
        document.getElementById('rangeSlider').value = range; // Update slider to match the range

        // Update active button state
        ['range06', 'range012', 'range020'].forEach(id => {
            document.getElementById(id).classList.remove('nt_active');
        });
        if (range <= 6) {
            document.getElementById('range06').classList.add('nt_active');
        } else if (range > 6 && range <= 12) {
            document.getElementById('range012').classList.add('nt_active');
        } else if (range > 12 && range <= 20) {
            document.getElementById('range020').classList.add('nt_active');
        }
    }

    // Event listeners for range buttons
    document.getElementById('range06').addEventListener('click', () => setMaxRange(6));
    document.getElementById('range012').addEventListener('click', () => setMaxRange(12));
    document.getElementById('range020').addEventListener('click', () => setMaxRange(20));

    // Event listener for slider
    document.getElementById('rangeSlider').addEventListener('input', (e) => {
        setMaxRange(parseInt(e.target.value));
        document.getElementById('sliderValue').innerText = e.target.value; // Update slider value display
    });


    function playRandomNumber() {
        currentNumber = Math.floor(Math.random() * (maxRange + 1));
        audioElements[currentNumber]?.play();
        generateNumbers();
        document.getElementById('nt_revealSolution').classList.remove('nt_hidden');
    }


    // Function to generate number buttons
    function generateNumbers() {
        numbersArea.innerHTML = '';
        let numbers = shuffleArray([...Array(maxRange + 1).keys()]);
        numbers.forEach(num => {
            let numberButton = document.createElement('button');
            numberButton.textContent = num.toString();
            numberButton.className = 'nt_number';
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
            selectedButton.className = 'nt_number nt_correct';
            playRandomCorrectAudio();
        } else {
            selectedButton.className = 'nt_number nt_incorrect';
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
        let allButtons = numbersArea.getElementsByClassName('nt_number');
        Array.from(allButtons).forEach(button => {
            if (parseInt(button.textContent) === currentNumber) {
                button.className = 'nt_number nt_correct';
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
