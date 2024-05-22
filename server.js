const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// 假设我们在内存中维护一个排行榜
let leaderboard = [];

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('submit-quiz', (data) => {
        // 处理提交的测验数据
        const { username, correctAnswers, totalTime } = data;

        // 更新排行榜逻辑
        leaderboard.push({ username, correctAnswers, totalTime });

        // 按照正确答案数量和时间排序
        leaderboard.sort((a, b) => {
            if (b.correctAnswers === a.correctAnswers) {
                return a.totalTime - b.totalTime;
            }
            return b.correctAnswers - a.correctAnswers;
        });

        // 保留前10名
        leaderboard = leaderboard.slice(0, 10);

        // 将更新后的排行榜广播给所有客户端
        io.emit('update-leaderboard', { leaderboard });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));