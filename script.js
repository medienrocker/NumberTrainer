document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('nt_generateNumber');
    const repeatButton = document.getElementById('nt_repeatNumber');
    const revealButton = document.getElementById('nt_revealSolution');
    const numbersArea = document.getElementById('nt_numbersArea');
    const useSliderCheckbox = document.getElementById('nt_useSlider');
    const rangeSlider = document.getElementById('nt_rangeSlider');
    let currentNumber = 0;
    let audioElements = {};
    let wrongAnswerAudio = ['wrong1.mp3', 'wrong2.mp3', 'wrong3.mp3'];
    let correctAnswerAudio = ['correct1.mp3', 'correct2.mp3', 'correct3.mp3', 'correct4.mp3'];
    let currentRange = [0, 6];
    let currentSession = null;
    let isGameActive = false;
    let gameSessions = [];
    let bestTime = null;


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

    function startNewGameSession() {
        currentSession = {
        startTime: new Date(),
        endTime: null,
        totalClicks: 0,
        correctClicks: 0,
        numberAttempts: {},
        currentRange: currentRange.slice(),
        currentCorrectNumber: null, // The correct number for this session
        attempts: 0,
        sessionStatus: 'incomplete' // Default status
        };
        currentRange.forEach(number => {
            currentSession.numberAttempts[number] = 0;
        });

        gameSessions.push(currentSession);
        isGameActive = true;
    }

    function endGameSession(correctlyCompleted) {
        currentSession.endTime = new Date();
        currentSession.sessionStatus = correctlyCompleted ? 'completed' : 'quit';
        currentSession = null; // Clear the current session
    }

    // Set initial active state for the first range button
    document.getElementById('nt_range06').classList.add('nt_active');

    function setRange(range) {
        currentRange = range;
        document.getElementById('nt_sliderValue').innerText = range[1];
        document.getElementById('nt_rangeSlider').value = range[1];

        ['nt_range06', 'nt_range712', 'nt_range1320'].forEach(id => {
            document.getElementById(id).classList.remove('nt_active');
        });
        document.getElementById(`nt_range${range[0]}${range[1]}`).classList.add('nt_active');
    }

    function setRangeFromSlider() {
        if (useSliderCheckbox.checked) {
            setRange([0, parseInt(rangeSlider.value)]);
        }
    }

    function playRandomNumber() {
        startNewGameSession();
        let min = currentRange[0];
        let max = currentRange[1];
        currentNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        currentSession.currentCorrectNumber = currentNumber;
        audioElements[currentNumber]?.play();
        generateNumbers();
        document.getElementById('nt_revealSolution').classList.remove('nt_hidden');
    }

    function generateNumbers() {
        numbersArea.innerHTML = '';
        for (let i = currentRange[0]; i <= currentRange[1]; i++) {
            let numberButton = document.createElement('button');
            numberButton.textContent = i.toString();
            numberButton.className = 'nt_number';
            numberButton.type = 'button';
            numberButton.addEventListener('click', function (evt) {
                checkNumber(i, evt); // Pass the event object to the handler
            });
            numbersArea.appendChild(numberButton);
        }
    }

    function checkNumber(num, evt) {
        if (!isGameActive) return;

        currentSession.totalClicks++;
        currentSession.attempts++;

        if (num !== currentNumber) {
            currentSession.numberAttempts[num] = (currentSession.numberAttempts[num] || 0) + 1;
        }

        let selectedButton = evt.target; // 'evt' is the event object passed to the function
        if (num === currentNumber) {
            currentSession.correctClicks++;
            isGameActive = false;
            currentSession.endTime = new Date();
            
            selectedButton.className = 'nt_number nt_correct';
            playRandomCorrectAudio();
            showClickRatio();
            updateBestTime(currentSession);
            endGameSession(true);  // End the session as completed

        } else {
            selectedButton.className = 'nt_number nt_incorrect';
            playRandomWrongAudio();
            showClickRatio();
        }

        // Update game data in the textarea
        updateGameDataInTextarea();
    }

    function showClickRatio() {
        let currentSession = gameSessions[gameSessions.length - 1];
        let ratio = currentSession.correctClicks / currentSession.totalClicks;
        let accuracyPercentage = ratio > 0 ? (ratio * 100).toFixed(2) : 0;

        document.getElementById('nt_correctClicks').textContent = currentSession.correctClicks;
        document.getElementById('nt_totalClicks').textContent = currentSession.totalClicks;
        document.getElementById('nt_accuracy').textContent = accuracyPercentage + '%';
    }

    function playRandomWrongAudio() {
        let randomIndex = Math.floor(Math.random() * wrongAnswerAudio.length);
        audioElements['wrong' + randomIndex].play();
    }

    function playRandomCorrectAudio() {
        let randomIndex = Math.floor(Math.random() * correctAnswerAudio.length);
        audioElements['correct' + randomIndex].play();
    }

    function revealSolution() {
        let allButtons = numbersArea.getElementsByClassName('nt_number');
        Array.from(allButtons).forEach(button => {
            if (parseInt(button.textContent) === currentNumber) {
                button.className = 'nt_number nt_correct';
            }
        });
    }

    // Get the range buttons and the Slider value
    document.getElementById('nt_range06').addEventListener('click', () => setRange([0, 6]));
    document.getElementById('nt_range712').addEventListener('click', () => setRange([7, 12]));
    document.getElementById('nt_range1320').addEventListener('click', () => setRange([13, 20]));

    rangeSlider.addEventListener('input', function (e) {
        document.getElementById('nt_sliderValue').innerText = e.target.value;
        setRangeFromSlider();
    });

    // Slider checkbox (soll ein eigener Wert gewählt werden?)
    useSliderCheckbox.addEventListener('change', function () {
        const sliderControls = document.getElementById('nt_sliderControls');
        sliderControls.style.display = useSliderCheckbox.checked ? 'block' : 'none';
        setRangeFromSlider();
        ['nt_range06', 'nt_range712', 'nt_range1320'].forEach(id => {
            document.getElementById(id).disabled = useSliderCheckbox.checked;
        });
    });

    generateButton.addEventListener('click', playRandomNumber);
    repeatButton.addEventListener('click', function () {
        audioElements[currentNumber].play();
    });
    revealButton.addEventListener('click', revealSolution);

    function updateBestTime(currentSession) {
        let sessionDuration = currentSession.endTime - currentSession.startTime; // Duration in milliseconds
        if (bestTime === null || sessionDuration < bestTime) {
            bestTime = sessionDuration;
            displayBestTime();
        }
    }

    function displayBestTime() {
        let seconds = Math.floor(bestTime / 1000);
        let milliseconds = bestTime % 1000;
        document.getElementById('nt_bestTime').textContent = `${seconds}.${pad(milliseconds, 3)}`;
    }

    function pad(number, length) {
        let str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    // ----- SAVE and LOAD the gameSession data ----- //
    function getGameDataTextarea() {
        let textarea = document.querySelector('#nt_allData textarea');
        if (textarea) {
            //console.log("Textarea selected: ", textarea);
        } else {
            console.log("Textarea not found.");
        }
        return textarea;
    }


    function updateGameDataInTextarea() {
        let gameDataTextarea = getGameDataTextarea();
        if (gameDataTextarea) {
            gameDataTextarea.value = JSON.stringify(gameSessions);

            // Print current session data to the console for testing
            //console.log("Game Session Data:", JSON.stringify(gameSessions));
        } else {
            console.log("Textarea not found.");
        }
    }


    // ----- SPARE function for use in the future ----- //

    // Function to shuffle array (Fisher-Yates Shuffle)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    // Function to reset all counters (if needed in future)
    function resetGame() {
        isGameActive = true;
        totalClicks = 0;
        correctClicks = 0;
        attempts = 0;
        // Reset other game-related variables and UI elements as needed
    }

    initializeAudio();
});
