const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('update-leaderboard', (data) => {
    updateLeaderboard(data);
});

socket.on('answer-result', (result) => {
    handleAnswerResult(result);
});

let username;
const questions = [
    { question: "What is the fourth term of an arithmetic sequence whose first three terms are 2, 5, and 8?", options: ["11", "12", "13", "14"]},
    { question: "If a circle has a radius r, what is the area of the circle?", options: ["πr", "2πr", "πr²", "r²"]},
    { question: "Newton's second law states that F=ma, where F stands for force, m stands for mass, and a stands for what?", options: ["Acceleration", "Velocity", "Kinetic", "EnergyGravity"]},
    { question: "What is the acceleration of an object when it is in free fall?", options: ["0 m/s²", "9.8 m/s²", "10 m/s²", "19.6 m/s²"]},
    { question: "According to the periodic table, which element is essential for life?", options: ["Hydrogen", "Carbon", "Gold", "Lead"]},
    { question: "What does a pH value of 7 indicate about the acidity or basicity of a solution?", options: ["Acidic", "Basic", "Neutral", "Inconclusive"]},
    { question: "Which gas is a liquid at room temperature and pressure?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Ammonia"]},
    { question: "What is the role of a catalyst in a chemical reaction?", options: ["It increases the mass of the reactants", "It alters the direction of the reaction", "It provides additional energy", "It speeds up the reaction rate without being consumed"]},
    { question: "Which substance is solid under standard conditions?", options: ["Oxygen", "Water", "Nitrogen", "Methane"]},
    { question: "What compound does the molecular formula H2O represent?", options: ["Water", "Hydrogen gas", "Oxygen gas", "Carbon dioxide"]},
    // Add more questions here
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalTime = 0;
let timer;
const timeLimit = 15;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-button").addEventListener("click", startQuiz);
    document.getElementById("next-btn").addEventListener("click", nextQuestion);
});

function startQuiz() {
    username = document.getElementById("username").value;
    if (username.trim() === "") {
        alert("Please enter your name.");
        return;
    }
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "block";
    showQuestion();
}

function showQuestion() {
    const questionContainer = document.getElementById("question-container");
    const questionData = questions[currentQuestionIndex];

    questionContainer.innerHTML = `
        <div>${questionData.question}</div>
        ${questionData.options.map((option, index) => `
            <button class="option" onclick="submitAnswer(${index})">${option}</button>
        `).join('')}
    `;
    startTimer();
}

function startTimer() {
    let timeLeft = timeLimit;
    document.getElementById("time-left").textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time-left").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    document.querySelectorAll(".option").forEach(button => button.disabled = true);
    socket.emit('submit-answer', { username, questionIndex: currentQuestionIndex, selectedAnswer: -1 });
}

function submitAnswer(selectedIndex) {
    clearInterval(timer);
    document.querySelectorAll(".option").forEach(button => button.disabled = true);
    socket.emit('submit-answer', { username, questionIndex: currentQuestionIndex, selectedAnswer: selectedIndex });
}

function handleAnswerResult(result) {
    if (result.correct) {
        correctAnswers++;
        document.getElementById("result").textContent = "Correct!";
    } else {
        document.getElementById("result").textContent = "Incorrect.";
    }
    document.getElementById("next-btn").style.display = "block";
    totalTime += timeLimit - parseInt(document.getElementById("time-left").textContent);
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
        document.getElementById("result").textContent = "";
        document.getElementById("next-btn").style.display = "none";
    } else {
        endQuiz();
    }
}

function endQuiz() {
    document.getElementById("quiz-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "block";
    document.getElementById("result-screen").innerHTML = `
        <h3>Quiz Completed</h3>
        <p>Correct answers: ${correctAnswers}</p>
        <p>Total time: ${totalTime} seconds</p>
    `;
    sendResultsToServer();
}

function sendResultsToServer() {
    socket.emit('submit-quiz', { username, correctAnswers, totalTime });
}

function updateLeaderboard(data) {
    document.getElementById("result-screen").innerHTML += `
        <h3>Leaderboard</h3>
        <ul>${data.leaderboard.map(entry => `<li>${entry.username}: ${entry.correctAnswers} correct, ${entry.totalTime} seconds</li>`).join('')}</ul>
    `;
}