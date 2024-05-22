const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

let leaderboard = [];

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/submit-quiz', (req, res) => {
    const { username, correctAnswers, totalTime } = req.body;
    //const username = `User${leaderboard.length + 1}`; // Assign a simple name
    leaderboard.push({ username, correctAnswers, totalTime });
    leaderboard.sort((a, b) => {
        if (b.correctAnswers === a.correctAnswers) {
            return a.totalTime - b.totalTime;
        }
        return b.correctAnswers - a.correctAnswers;
    });
    res.json({ leaderboard });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
