let words = [];
let currentWord;
let score = 0;

// Cargar el JSON desde la carpeta Data
fetch('Data/palabras_igles.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo de palabras');
        }
        return response.json();
    })
    .then(data => {
        words = data.words;
        document.getElementById('loading').style.display = 'none';
        document.getElementById('word-container').style.display = 'block';
        document.getElementById('answer-input').style.display = 'block';
        document.querySelector('button').style.display = 'block';
        initGame();
    })
    .catch(error => {
        document.getElementById('loading').textContent = 'Error cargando el archivo: ' + error.message;
    });

function initGame() {
    if (words.length === 0) return;

    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];

    document.getElementById('word-container').textContent = currentWord.english;
    document.getElementById('answer-input').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('answer-input').focus();
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer-input').value.trim().toLowerCase();
    const correctAnswers = currentWord.spanish.toLowerCase().split('/');

    if (correctAnswers.includes(userAnswer)) {
        showResult('¡Correcto!', 'correct');
        score++;
        document.getElementById('score').textContent = `Aciertos: ${score}`;
        setTimeout(initGame, 1000);
    } else {
        showResult(`Incorrecto. La respuesta correcta es: <strong>${currentWord.spanish}</strong>`, 'incorrect');
        setTimeout(initGame, 2000);
    }
}

function showResult(message, className) {
    const resultElement = document.getElementById('result');
    resultElement.className = className;
    resultElement.innerHTML = message;
}

// Manejar la tecla Enter
document.getElementById('answer-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});