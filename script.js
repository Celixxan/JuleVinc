// Quiz questions array - 9 questions for the quiz finale
const questions = [
    {
        id: 1,
        question: "Hvilken farge har Coca-Cola's julenisse på seg?",
        answer: "Rød og hvit",
        category: "Klassiker"
    },
    {
        id: 2,
        question: "I hvilken by ligger Julenissens offisielle postkontor?",
        answer: "Rovaniemi, Finland (eller Drøbak i Norge)",
        category: "Geografi"
    },
    {
        id: 3,
        question: "Hva heter reinsdyret med den røde nesen?",
        answer: "Rudolf",
        category: "Klassiker"
    },
    {
        id: 4,
        question: "Hvilken TV-serie ser nordmenn tradisjonelt på lille julaften?",
        answer: "Grevinnen og hovmesteren (Dinner for One)",
        category: "Norsk tradisjon"
    },
    {
        id: 5,
        question: "Hvor mange gaver fikk kjæresten totalt i sangen 'The Twelve Days of Christmas'?",
        answer: "364 gaver",
        category: "Musikk"
    },
    {
        id: 6,
        question: "Hvilket land startet tradisjonen med juletrær?",
        answer: "Tyskland",
        category: "Historie"
    },
    {
        id: 7,
        question: "Hva kalles frykten for julenissen?",
        answer: "Santafobi (eller Claustofobi)",
        category: "Kuriosa"
    },
    {
        id: 8,
        question: "I filmen 'Love Actually' - hvilken sang synger Billy Mack?",
        answer: "Christmas Is All Around",
        category: "Film"
    },
    {
        id: 9,
        question: "Hva er det tradisjonelle navnet på kvelden før julaften i Norge?",
        answer: "Lille julaften (23. desember)",
        category: "Norsk tradisjon"
    },
    {
        id: 10,
        question: "Hvilken plante er det tradisjon å kysse under i julen?",
        answer: "Misteltein",
        category: "Tradisjon"
    },
    {
        id: 11,
        question: "Hva heter de tre vise menn som besøkte Jesusbarnet?",
        answer: "Kaspar, Melkior og Baltasar",
        category: "Religion"
    },
    {
        id: 12,
        question: "Hvilket dyr er hovedpersonen i den norske julekalenderen 'Jul i Blåfjell'?",
        answer: "En fjellrev (Turansen er en blånisse)",
        category: "Norsk TV"
    },
    {
        id: 13,
        question: "I 'Alene Hjemme' - hvor skal familien McCallister reise på juleferie?",
        answer: "Paris, Frankrike",
        category: "Film"
    },
    {
        id: 14,
        question: "Hva er den bestselgende julesingelen gjennom alle tider?",
        answer: "White Christmas av Bing Crosby",
        category: "Musikk"
    },
    {
        id: 15,
        question: "Hvilken dag feirer man jul i Russland?",
        answer: "7. januar",
        category: "Internasjonal"
    }
];

// State
let shuffledQuestions = [...questions];
let usedQuestions = new Set();
let currentQuestionIndex = null;
let answerRevealed = false;

// Timer state
let timerInterval = null;
let timeRemaining = 600; // 10 minutes in seconds
let timerRunning = false;

// DOM Elements
const quizContainer = document.getElementById('quiz-container');
const currentQuestionEl = document.getElementById('current-question');
const questionNumberEl = currentQuestionEl.querySelector('.question-number');
const questionTextEl = currentQuestionEl.querySelector('.question-text');
const answerDisplayEl = currentQuestionEl.querySelector('.answer-display');
const answerTextEl = currentQuestionEl.querySelector('.answer-text');
const showAnswerBtn = document.getElementById('show-answer-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const resetBtn = document.getElementById('reset-btn');
const usedCountEl = document.getElementById('used-count');
const timerEl = document.getElementById('timer');
const startTimerBtn = document.getElementById('start-timer');
const pauseTimerBtn = document.getElementById('pause-timer');
const resetTimerBtn = document.getElementById('reset-timer');

// Initialize
function init() {
    shuffleQuestions();
    renderQuestionCards();
    setupEventListeners();
    updateUsedCount();
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Shuffle questions
function shuffleQuestions() {
    shuffledQuestions = shuffleArray(questions).slice(0, 9);
}

// Render question cards
function renderQuestionCards() {
    quizContainer.innerHTML = '';

    shuffledQuestions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.dataset.index = index;
        card.textContent = `${index + 1}`;

        if (usedQuestions.has(index)) {
            card.classList.add('used');
        }

        card.addEventListener('click', () => selectQuestion(index));
        quizContainer.appendChild(card);
    });
}

// Select a question
function selectQuestion(index) {
    if (usedQuestions.has(index)) return;

    // Remove active state from all cards
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('active');
    });

    // Add active state to selected card
    const selectedCard = document.querySelector(`[data-index="${index}"]`);
    selectedCard.classList.add('active');

    // Show question
    currentQuestionIndex = index;
    answerRevealed = false;
    const question = shuffledQuestions[index];

    questionNumberEl.textContent = `Spørsmål ${index + 1} - ${question.category}`;
    questionTextEl.textContent = question.question;
    answerTextEl.textContent = question.answer;

    // Show question panel, hide answer
    currentQuestionEl.classList.remove('hidden');
    answerDisplayEl.classList.add('hidden');
    showAnswerBtn.style.display = 'inline-block';
}

// Reveal answer
function revealAnswer() {
    if (currentQuestionIndex === null) return;

    answerRevealed = true;
    answerDisplayEl.classList.remove('hidden');
    showAnswerBtn.style.display = 'none';
}

// Mark question as used and go to next
function nextQuestion() {
    if (currentQuestionIndex === null) return;

    // Mark as used
    usedQuestions.add(currentQuestionIndex);
    updateUsedCount();

    // Update card visual
    const usedCard = document.querySelector(`[data-index="${currentQuestionIndex}"]`);
    usedCard.classList.add('used');
    usedCard.classList.remove('active');

    // Reset current question display
    currentQuestionEl.classList.add('hidden');
    currentQuestionIndex = null;
    answerRevealed = false;

    // Check if all questions are used
    if (usedQuestions.size >= 9) {
        showCompletionMessage();
    }
}

// Update used count display
function updateUsedCount() {
    usedCountEl.textContent = usedQuestions.size;
}

// Show completion message
function showCompletionMessage() {
    currentQuestionEl.classList.remove('hidden');
    questionNumberEl.textContent = '🎉 Ferdig!';
    questionTextEl.textContent = 'Alle 9 spørsmål er besvart! Nå kan pakkene åpnes - Julens forbannelse er brutt!';
    answerDisplayEl.classList.add('hidden');
    showAnswerBtn.style.display = 'none';
    nextQuestionBtn.style.display = 'none';
}

// Reset quiz
function resetQuiz() {
    usedQuestions.clear();
    currentQuestionIndex = null;
    answerRevealed = false;
    currentQuestionEl.classList.add('hidden');
    nextQuestionBtn.style.display = 'inline-block';
    renderQuestionCards();
    updateUsedCount();
}

// Shuffle and reset
function shuffleAndReset() {
    shuffleQuestions();
    resetQuiz();
}

// Timer functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    timerEl.textContent = formatTime(timeRemaining);

    const timerDisplay = document.querySelector('.timer-display');
    timerDisplay.classList.remove('warning', 'danger');

    if (timeRemaining <= 60 && timeRemaining > 30) {
        timerDisplay.classList.add('warning');
    } else if (timeRemaining <= 30) {
        timerDisplay.classList.add('danger');
    }

    if (timerRunning) {
        timerDisplay.classList.add('running');
    } else {
        timerDisplay.classList.remove('running');
    }
}

function startTimer() {
    if (timerRunning) return;

    timerRunning = true;
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            stopTimer();
            playAlarm();
        }
    }, 1000);

    updateTimerDisplay();
}

function stopTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    updateTimerDisplay();
}

function resetTimer() {
    stopTimer();
    timeRemaining = 600;
    updateTimerDisplay();
}

function playAlarm() {
    // Create a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    } catch (e) {
        console.log('Audio not supported');
    }

    // Visual alert
    alert('⏰ Tiden er ute! Del 2 er over!');
}

// Setup event listeners
function setupEventListeners() {
    showAnswerBtn.addEventListener('click', revealAnswer);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    shuffleBtn.addEventListener('click', shuffleAndReset);
    resetBtn.addEventListener('click', resetQuiz);
    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', stopTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
