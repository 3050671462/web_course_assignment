const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Questions array with correct answers
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

let leaderboard = [];

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('submit-answer', ({ username, questionIndex, selectedAnswer }) => {
        const questionData = questions[questionIndex];
        const correct = selectedAnswer === questionData.correct;
        socket.emit('answer-result', { correct });
    });

    socket.on('submit-quiz', ({ username, correctAnswers, totalTime }) => {
        leaderboard.push({ username, correctAnswers, totalTime });
        leaderboard = leaderboard.sort((a, b) => b.correctAnswers - a.correctAnswers || a.totalTime - b.totalTime).slice(0, 10);
        io.emit('update-leaderboard', { leaderboard });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));