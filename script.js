document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('nt_generateNumber');
    const repeatButton = document.getElementById('nt_repeatNumber');
    const revealButton = document.getElementById('nt_revealSolution');
    const numbersArea = document.getElementById('nt_numbersArea');
    const useSliderCheckbox = document.getElementById('nt_useSlider');
    const rangeSlider = document.getElementById('nt_rangeSlider');
    let currentNumber = 0;
    let audioElements = {};
    let wrongAnswerAudio = ['wrong1.mp3', 'wrong2.mp3', 'wrong3.mp3']; // Array of wrong answer audio clips
    let correctAnswerAudio = ['correct1.mp3', 'correct2.mp3', 'correct3.mp3', 'correct4.mp3']; // Array of correct answer audio clips
    let currentRange = [0, 6]; // Default range to 0-6
    let totalClicks = 0;
    let correctClicks = 0;
    let bestAccuracy = 0;
    let bestTotalClicks = 0;
    let bestCorrectClicks = 0;

    // Initialize slider and displayed range
    document.getElementById('nt_rangeSlider').value = currentRange[1];
    document.getElementById('nt_sliderValue').innerText = currentRange[1];

    // Set initial active state for range button
    document.getElementById('nt_range06').classList.add('nt_active');

    // Function to initialize audio elements
    function initializeAudio() {
        for (let i = 0; i <= 20; i++) {
            let audio = new Audio('https://www.medienrocker.com/games/numbertrainer/audio/number' + (i < 10 ? '0' + i : i) + '.mp3');
            audioElements[i] = audio;
        }
        correctAnswerAudio.forEach((file, index) => {
            audioElements['correct' + index] = new Audio('https://www.medienrocker.com/games/numbertrainer/audio/' + file);
        });
        wrongAnswerAudio.forEach((file, index) => {
            audioElements['wrong' + index] = new Audio('https://www.medienrocker.com/games/numbertrainer/audio/' + file);
        });
    }

    rangeSlider.addEventListener('input', function (e) {
        document.getElementById('nt_sliderValue').innerText = e.target.value;
        setRangeFromSlider();
    });

    useSliderCheckbox.addEventListener('change', function () {
        const sliderControls = document.getElementById('nt_sliderControls');
        sliderControls.style.display = useSliderCheckbox.checked ? 'block' : 'none';
        setRangeFromSlider();
        toggleRangeButtonsDisabled(useSliderCheckbox.checked);
    });

    function toggleRangeButtonsDisabled(isDisabled) {
        ['nt_range06', 'nt_range712', 'nt_range1320'].forEach(id => {
            document.getElementById(id).disabled = isDisabled;
        });
    }

    // Initialize the state on page load
    toggleRangeButtonsDisabled(useSliderCheckbox.checked);


    function setRange(range) {
        currentRange = range;
        document.getElementById('nt_sliderValue').innerText = range[1]; // Update slider value display
        document.getElementById('nt_rangeSlider').value = range[1]; // Update slider to match the range

        // Update active button state
        ['nt_range06', 'nt_range712', 'nt_range1320'].forEach(id => {
            document.getElementById(id).classList.remove('nt_active');
        });
        if (range[1] >= 0 && range[1] <= 6) {
            document.getElementById('nt_range06').classList.add('nt_active');
        } else if (range[1] >= 7 && range[1] <= 12) {
            document.getElementById('nt_range712').classList.add('nt_active');
        } else if (range[1] >= 13 && range[1] <= 20) {
            document.getElementById('nt_range1320').classList.add('nt_active');
        }

        // Disable range buttons if using slider
        const buttonsDisabled = useSliderCheckbox.checked;
        document.getElementById('nt_range06').disabled = buttonsDisabled;
        document.getElementById('nt_range712').disabled = buttonsDisabled;
        document.getElementById('nt_range1320').disabled = buttonsDisabled;
    }


    function setRangeFromSlider() {
        if (useSliderCheckbox.checked) {
            setRange([0, parseInt(rangeSlider.value)]);
        }
    }

    // Event listeners for range buttons
    document.getElementById('nt_range06').addEventListener('click', () => setRange([0, 6]));
    document.getElementById('nt_range712').addEventListener('click', () => setRange([7, 12]));
    document.getElementById('nt_range1320').addEventListener('click', () => setRange([13, 20]));


    function playRandomNumber() {
        totalClicks = 0; // Reset counters when a new number is generated
        correctClicks = 0;
        showClickRatio();

        let min = currentRange[0];
        let max = currentRange[1];
        currentNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        audioElements[currentNumber]?.play();
        generateNumbers();
        document.getElementById('nt_revealSolution').classList.remove('nt_hidden');
    }

    // Function to generate number buttons
    function generateNumbers() {
        numbersArea.innerHTML = '';
        for (let i = currentRange[0]; i <= currentRange[1]; i++) {
            let numberButton = document.createElement('button');
            numberButton.textContent = i.toString();
            numberButton.className = 'nt_number';
            numberButton.type = 'button';
            numberButton.onclick = function () { checkNumber(i); };
            numbersArea.appendChild(numberButton);
        }
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
        totalClicks++; // Increment total clicks for every number button click

        let selectedButton = event.target;
        if (num === currentNumber) {
            correctClicks++; // Increment correct clicks if the correct number is clicked
            selectedButton.className = 'nt_number nt_correct';
            playRandomCorrectAudio();
            showClickRatio(); // Call function to show the click ratio
        } else {
            selectedButton.className = 'nt_number nt_incorrect';
            playRandomWrongAudio();
            showClickRatio();
        }
    }

    function showClickRatio() {
        let ratio = correctClicks / totalClicks;
        let accuracyPercentage = ratio > 0 ? (ratio * 100).toFixed(2) : 0;

        // Update the HTML elements with the accuracy data
        document.getElementById('nt_totalClicks').textContent = totalClicks;
        document.getElementById('nt_correctClicks').textContent = correctClicks;
        document.getElementById('nt_accuracy').textContent = accuracyPercentage + '%';

        // Update the hidden input fields for potential database storage
        document.getElementById('nt_totalClicksInput').value = totalClicks;
        document.getElementById('nt_correctClicksInput').value = correctClicks;
        document.getElementById('nt_accuracyInput').value = accuracyPercentage;

        // Check if current accuracy is better than the best accuracy
        if (ratio > bestAccuracy) {
            bestAccuracy = ratio;
            bestTotalClicks = totalClicks;
            bestCorrectClicks = correctClicks;

            // Update the best result display
            document.getElementById('nt_bestAccuracy').textContent = accuracyPercentage + '%';
            document.getElementById('nt_bestTotalClicks').textContent = bestTotalClicks;
            document.getElementById('nt_bestCorrectClicks').textContent = bestCorrectClicks;
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
