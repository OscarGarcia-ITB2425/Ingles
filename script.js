let words = [];
let currentWord;
let score = 0;
let isEnglishToSpanish = true;

// Función para eliminar acentos
const normalize = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

fetch('Data/palabras_igles.json')
    .then(response => {
        if (!response.ok) throw new Error('No se pudo cargar el archivo de palabras');
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

    const displayWord = isEnglishToSpanish ?
        currentWord.english :
        currentWord.spanish.split('/')[0];
    document.getElementById('word-container').textContent = displayWord;

    document.getElementById('answer-input').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('answer-input').focus();
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer-input').value.trim().toLowerCase();
    let correctAnswers;

    if(isEnglishToSpanish) {
        correctAnswers = currentWord.spanish.toLowerCase().split('/')
            .map(word => normalize(word));
    } else {
        correctAnswers = currentWord.english.toLowerCase().split('/')
            .map(word => normalize(word));
    }

    const normalizedUserAnswer = normalize(userAnswer);

    if (correctAnswers.includes(normalizedUserAnswer)) {
        showResult('¡Correcto!', 'correct');
        score++;
        document.getElementById('score').textContent = `Aciertos: ${score}`;
        setTimeout(initGame, 1000);
    } else {
        const correctTranslation = isEnglishToSpanish ?
            currentWord.spanish : currentWord.english;
        showResult(`Incorrecto. La respuesta correcta es: <strong>${correctTranslation}</strong>`, 'incorrect');
        setTimeout(initGame, 2000);
    }
}

// Resto del código se mantiene igual...
function showResult(message, className) {
    const resultElement = document.getElementById('result');
    resultElement.className = className;
    resultElement.innerHTML = message;
}

function toggleLanguage() {
    isEnglishToSpanish = !isEnglishToSpanish;
    const button = document.getElementById('toggle-language');
    const title = document.querySelector('header p');
    const input = document.getElementById('answer-input');

    if(isEnglishToSpanish) {
        button.textContent = 'Traducir Español → Inglés';
        title.textContent = 'Mejora tu vocabulario de inglés a español';
        input.placeholder = 'Escribe la traducción';
    } else {
        button.textContent = 'Traducir Inglés → Español';
        title.textContent = 'Mejora tu vocabulario de español a inglés';
        input.placeholder = 'Write the translation';
    }

    score = 0;
    document.getElementById('score').textContent = `Aciertos: ${score}`;
    initGame();
}

document.getElementById('answer-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkAnswer();
});