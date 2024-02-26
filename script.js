document.addEventListener('DOMContentLoaded', function () {
    initGame();
    document.getElementById('guessButton').addEventListener('click', submitGuess);
    document.getElementById('dontKnowButton').addEventListener('click', showAnswerAndNext);
    document.getElementById('guessInput').addEventListener('keypress', function (event) {
        // Verificar si la tecla presionada es Enter
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevenir la acción predeterminada
            submitGuess(); // Llamar a la función que maneja la lógica de envío
        }
    });
});

let currentVerbId = null;
let strikes = 0; // Initialize strikes counter


function initGame() {
    fetchRandomWord();
    strikes = 0; // Reset strikes with each new verb
    updateStrikes(); // Update the strikes display
}

function updateStrikes() {
    document.getElementById('strikes').textContent = `Strikes: ${strikes}`;
}


function fetchRandomWord() {
    fetch(`${window.apiURL}/random-word`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('frenchVerb').textContent = data.word;
            currentVerbId = data.id;
            document.getElementById('guessInput').value = '';
        })
        .catch(error => {
            console.error('Error:', error);
            M.toast({html: 'Error fetching verb. Please try again.', classes: 'rounded'});
        });
}

function submitGuess() {
    const guess = document.getElementById('guessInput').value.trim();
    if (!guess) {
        M.toast({html: 'Please enter a guess.', classes: 'rounded'});
        return;
    }

    fetch(`${window.apiURL}/word/translation/${currentVerbId}`)
        .then(response => response.json())
        .then(data => {
            const correctTranslation = data.english;
            if (guess.toLowerCase() === correctTranslation.toLowerCase()) {
                M.toast({html: 'Correct! Great job!', classes: 'rounded green'});
                fetchRandomWord(); // Automatically fetch the next verb
                strikes = 0;
            } else {
                strikes++; // Increment strikes
                updateStrikes(); // Update the strikes display
                if (strikes >= 3) { // For example, after 3 strikes
                    M.toast({html: `You have reached 3 strikes. ${correctTranslation}`, classes: 'rounded'});
                    M.toast({html: 'Moving to the next verb.', classes: 'rounded'});
                    strikes = 0;
                    fetchRandomWord(); // Move to the next verb
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            M.toast({html: 'Error submitting guess. Please try again.', classes: 'rounded'});
        });

}

function showAnswerAndNext() {
    if (currentVerbId !== null) {
        fetch(`${window.apiURL}/word/translation/${currentVerbId}`)
            .then(response => response.json())
            .then(data => {
                const correctTranslation = data.english; // Adjust based on your API response
                M.toast({html: `The correct translation was: ${correctTranslation}`, classes: 'rounded blue'});
                // Fetch the next verb without changing the score or attempts
                fetchRandomWord();
            })
            .catch(error => {
                console.error('Error:', error);
                M.toast({html: 'Error fetching translation. Please try again.', classes: 'rounded'});
            });
    } else {
        M.toast({html: 'No verb is currently selected.', classes: 'rounded'});
    }
}