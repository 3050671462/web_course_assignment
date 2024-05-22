const questions = [
    { question: "What is the fourth term of an arithmetic sequence whose first three terms are 2, 5, and 8?", options: ["11", "12", "13", "14"], correct: 0 },
    { question: "If a circle has a radius r, what is the area of the circle?", options: ["πr", "2πr", "πr²", "r²"], correct: 2 },
    { question: "Newton's second law states that F=ma, where F stands for force, m stands for mass, and a stands for what?", options: ["Acceleration", "Velocity", "Kinetic", "EnergyGravity"], correct: 0 },
    { question: "What is the acceleration of an object when it is in free fall?", options: ["0 m/s²", "9.8 m/s²", "10 m/s²", "19.6 m/s²"], correct: 1 },
    { question: "According to the periodic table, which element is essential for life?", options: ["Hydrogen", "Carbon", "Gold", "Lead"], correct: 1 },
    { question: "What does a pH value of 7 indicate about the acidity or basicity of a solution?", options: ["Acidic", "Basic", "Neutral", "Inconclusive"], correct: 2 },
    { question: "Which gas is a liquid at room temperature and pressure?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Ammonia"], correct: 3 },
    { question: "What is the role of a catalyst in a chemical reaction?", options: ["It increases the mass of the reactants", "It alters the direction of the reaction", "It provides additional energy", "It speeds up the reaction rate without being consumed"], correct: 3 },
    { question: "Which substance is solid under standard conditions?", options: ["Oxygen", "Water", "Nitrogen", "Methane"], correct: 1 },
    { question: "What compound does the molecular formula H2O represent?", options: ["Water", "Hydrogen gas", "Oxygen gas", "Carbon dioxide"], correct: 0 },
    // Add more questions here
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalTime = 0;
let timer;
const timeLimit = 15;
let username = "";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-button").addEventListener("click", startQuiz);
    document.getElementById("next-btn").addEventListener("click", nextQuestion);
});

function startQuiz() {
    username = document.getElementById("username").value.trim();
    if (username === "") {
        alert("Please enter your name!");
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
        <div class="options-container">
            ${questionData.options.map((option, index) => `
                <button class="option" onclick="submitAnswer(${index})">${option}</button>
            `).join('')}
        </div>
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
    document.getElementById("result").textContent = "Time's up! Incorrect.";
    document.getElementById("next-btn").style.display = "block";
    totalTime += timeLimit;
}

function submitAnswer(selectedIndex) {
    clearInterval(timer);
    disableOptions();
    const questionData = questions[currentQuestionIndex];
    if (selectedIndex === questionData.correct) {
        correctAnswers++;
        document.getElementById("result").textContent = "Correct!";
    } else {
        document.getElementById("result").textContent = "Incorrect.";
    }
    document.getElementById("next-btn").style.display = "block";
    totalTime += timeLimit - parseInt(document.getElementById("time-left").textContent);
}

function disableOptions() {
    const optionButtons = document.querySelectorAll(".option");
    optionButtons.forEach(button => {
        button.disabled = true;
    });
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
    fetch('/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, correctAnswers, totalTime })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("result-screen").innerHTML += `
            <h3>Leaderboard</h3>
            <ul>${data.leaderboard.map(entry => `<li>${entry.username}: ${entry.correctAnswers} correct, ${entry.totalTime} seconds</li>`).join('')}</ul>
        `;
    });
}
