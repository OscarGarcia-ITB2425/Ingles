let words = [];
let currentWord;
let score = 0;
let isEnglishToSpanish = true;
let isDifficultMode = false;
let difficultWords = JSON.parse(localStorage.getItem('difficultWords')) || [];

// Función para eliminar acentos
const normalize = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Cargar el JSON
fetch('Data/palabras_igles.json')
    .then(response => {
        if (!response.ok) throw new Error('No se pudo cargar el archivo de palabras');
        return response.json();
    })
    .then(data => {
        words = data.words;
        difficultWords = data.difficultWords || [];
        updateDifficultCounter();

        document.getElementById('loading').style.display = 'none';
        document.getElementById('word-container').style.display = 'block';
        document.getElementById('answer-input').style.display = 'block';
        document.querySelector('button').style.display = 'block';
        document.getElementById('mark-difficult').style.display = 'inline-block';
        initGame();
    })
    .catch(error => {
        document.getElementById('loading').textContent = 'Error cargando el archivo: ' + error.message;
    });

function initGame() {
    let wordList = isDifficultMode ? difficultWords : words;

    if(wordList.length === 0) {
        showResult(isDifficultMode
            ? '¡No hay palabras difíciles guardadas!'
            : '¡No se encontraron palabras!', 'incorrect');
        return;
    }

    const randomIndex = Math.floor(Math.random() * wordList.length);
    currentWord = wordList[randomIndex];

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

// Funcionalidad de palabras difíciles
function markAsDifficult() {
    if(!difficultWords.some(word => word.english === currentWord.english)) {
        difficultWords.push(currentWord);
        localStorage.setItem('difficultWords', JSON.stringify(difficultWords));
        updateDifficultCounter();
        showResult('⭐ Palabra marcada como difícil', 'correct');
    } else {
        showResult('ℹ️ Esta palabra ya está en difíciles', 'correct');
    }
}

function toggleDifficultMode() {
    isDifficultMode = !isDifficultMode;
    const btn = document.getElementById('difficult-mode-btn');
    const wordContainer = document.getElementById('word-container');

    if(isDifficultMode) {
        btn.textContent = 'Modo Dificultades';
        wordContainer.classList.add('difficult-mode-active');
    } else {
        btn.textContent = 'Modo Normal';
        wordContainer.classList.remove('difficult-mode-active');
    }

    score = 0;
    document.getElementById('score').textContent = `Aciertos: ${score}`;
    initGame();
}

function updateDifficultCounter() {
    const counter = document.getElementById('difficult-counter') || createDifficultCounter();
    counter.textContent = `Palabras difíciles: ${difficultWords.length}`;
    localStorage.setItem('difficultWords', JSON.stringify(difficultWords));
}

function createDifficultCounter() {
    const counter = document.createElement('div');
    counter.id = 'difficult-counter';
    counter.className = 'difficult-counter';
    document.body.appendChild(counter);
    return counter;
}

// Event listeners
document.getElementById('answer-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkAnswer();
});

// Funciones de gestión avanzada (opcionales)
function removeDifficultWord(wordToRemove) {
    difficultWords = difficultWords.filter(word => word.english !== wordToRemove.english);
    localStorage.setItem('difficultWords', JSON.stringify(difficultWords));
    updateDifficultCounter();
    if(isDifficultMode) initGame();
}

window.manageDifficultWords = {
    list: () => difficultWords,
    add: (word) => difficultWords.push(word),
    clear: () => {
        difficultWords = [];
        localStorage.removeItem('difficultWords');
        updateDifficultCounter();
    },
    remove: (englishWord) => {
        difficultWords = difficultWords.filter(word => word.english !== englishWord);
        localStorage.setItem('difficultWords', JSON.stringify(difficultWords));
        updateDifficultCounter();
    }
};