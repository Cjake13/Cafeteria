// ===== SISTEMA DE VIDEOJUEGOS MEJORADO =====
console.log('games.js cargado correctamente');

const GAME_SCORES_KEY = 'gameScores';
let currentGame = null;
let currentListeners = [];

function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

function addListener(type, fn) {
    document.addEventListener(type, fn);
    currentListeners.push({ type, fn });
}
function removeAllListeners() {
    currentListeners.forEach(({ type, fn }) => document.removeEventListener(type, fn));
    currentListeners = [];
}

class Game {
    constructor(canvas, playerName) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.playerName = playerName;
        this.score = 0;
        this.gameLoop = null;
        this.isRunning = false;
    }
    start() {
        this.isRunning = true;
        this.init();
        this.gameLoop = setInterval(() => this.update(), this.speed);
    }
    stop() {
        this.isRunning = false;
        if (this.gameLoop) clearInterval(this.gameLoop);
        removeAllListeners();
    }
    init() {}
    update() {}
    draw() {}
    gameOver() {
        this.stop();
        saveGameScore(this.gameName, this.playerName, this.score);
        Swal.fire({
            title: '¡Juego Terminado!',
            text: `Puntuación: ${this.score}`,
            icon: 'info',
            confirmButtonText: 'Jugar de nuevo',
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) this.restart();
        });
    }
    restart() {
        this.score = 0;
        this.start();
    }
}

// ===== SNAKE GAME =====
class SnakeGame extends Game {
    constructor(canvas, playerName) {
        super(canvas, playerName);
        this.gameName = 'snake';
        this.speed = 150;
        this.gridSize = 20;
        this.snake = [];
        this.food = {};
        this.direction = 'right';
        this.nextDirection = 'right';
        this.keyHandler = this.keyHandler.bind(this);
    }
    init() {
        this.snake = [ {x: 5, y: 5}, {x: 4, y: 5}, {x: 3, y: 5} ];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.generateFood();
        removeAllListeners();
        addListener('keydown', this.keyHandler);
        this.updateScore();
    }
    keyHandler(e) {
        switch(e.key.toLowerCase()) {
            case 'w': if (this.direction !== 'down') this.nextDirection = 'up'; break;
            case 's': if (this.direction !== 'up') this.nextDirection = 'down'; break;
            case 'a': if (this.direction !== 'right') this.nextDirection = 'left'; break;
            case 'd': if (this.direction !== 'left') this.nextDirection = 'right'; break;
        }
    }
    update() {
        this.direction = this.nextDirection;
        const head = {...this.snake[0]};
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        const maxPos = this.canvas.width / this.gridSize;
        if (head.x < 0 || head.x >= maxPos || head.y < 0 || head.y >= maxPos) return this.gameOver();
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) return this.gameOver();
        this.snake.unshift(head);
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.generateFood();
        } else {
            this.snake.pop();
        }
        this.draw();
    }
    generateFood() {
        const maxPos = this.canvas.width / this.gridSize;
        do {
            this.food = { x: Math.floor(Math.random() * maxPos), y: Math.floor(Math.random() * maxPos) };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }
    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.snake.forEach((segment, i) => {
            this.ctx.fillStyle = i === 0 ? '#ffff00' : '#00ff00';
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 1, this.gridSize - 1);
        });
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 1, this.gridSize - 1);
    }
    updateScore() {
        const scoreElement = document.getElementById('snakeScore');
        if (scoreElement) scoreElement.textContent = this.score;
    }
}

// ===== TETRIS GAME =====
class TetrisGame extends Game {
    constructor(canvas, playerName) {
        super(canvas, playerName);
        this.gameName = 'tetris';
        this.speed = 500;
        this.gridSize = 30;
        this.cols = 10;
        this.rows = 20;
        this.grid = [];
        this.currentPiece = null;
        this.pieces = [ [[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]], [[0,1,1],[1,1,0]], [[1,1,0],[0,1,1]], [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]] ];
        this.colors = ['#00f0f0','#f0f000','#a000f0','#00f000','#f00000','#0000f0','#f0a000'];
        this.keyHandler = this.keyHandler.bind(this);
    }
    init() {
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.spawnPiece();
        removeAllListeners();
        addListener('keydown', this.keyHandler);
        this.updateScore();
    }
    keyHandler(e) {
        if (!this.currentPiece) return;
        switch(e.key.toLowerCase()) {
            case 'a': this.movePiece(-1, 0); break;
            case 'd': this.movePiece(1, 0); break;
            case 's': this.movePiece(0, 1); break;
            case 'w': this.rotatePiece(); break;
        }
    }
    spawnPiece() {
        const pieceIndex = Math.floor(Math.random() * this.pieces.length);
        this.currentPiece = {
            shape: this.pieces[pieceIndex],
            color: this.colors[pieceIndex],
            x: Math.floor(this.cols / 2) - Math.floor(this.pieces[pieceIndex][0].length / 2),
            y: 0
        };
        if (this.checkCollision()) this.gameOver();
    }
    movePiece(dx, dy) {
        this.currentPiece.x += dx;
        this.currentPiece.y += dy;
        if (this.checkCollision()) {
            this.currentPiece.x -= dx;
            this.currentPiece.y -= dy;
            if (dy > 0) { this.placePiece(); this.clearLines(); this.spawnPiece(); }
        }
    }
    rotatePiece() {
        const rotated = this.currentPiece.shape[0].map((_, i) => this.currentPiece.shape.map(row => row[i]).reverse());
        const originalShape = this.currentPiece.shape;
        this.currentPiece.shape = rotated;
        if (this.checkCollision()) this.currentPiece.shape = originalShape;
    }
    checkCollision() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const newX = this.currentPiece.x + x;
                    const newY = this.currentPiece.y + y;
                    if (newX < 0 || newX >= this.cols || newY >= this.rows) return true;
                    if (newY >= 0 && this.grid[newY][newX]) return true;
                }
            }
        }
        return false;
    }
    placePiece() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const gridY = this.currentPiece.y + y;
                    const gridX = this.currentPiece.x + x;
                    if (gridY >= 0) this.grid[gridY][gridX] = this.currentPiece.color;
                }
            }
        }
    }
    clearLines() {
        let linesCleared = 0;
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== 0)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(this.cols).fill(0));
                linesCleared++;
                y++;
            }
        }
        if (linesCleared > 0) {
            this.score += linesCleared * 100;
            this.updateScore();
        }
    }
    update() { this.movePiece(0, 1); }
    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.grid[y][x]) {
                    this.ctx.fillStyle = this.grid[y][x];
                    this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize - 1, this.gridSize - 1);
                }
            }
        }
        if (this.currentPiece) {
            this.ctx.fillStyle = this.currentPiece.color;
            for (let y = 0; y < this.currentPiece.shape.length; y++) {
                for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                    if (this.currentPiece.shape[y][x]) {
                        this.ctx.fillRect((this.currentPiece.x + x) * this.gridSize, (this.currentPiece.y + y) * this.gridSize, this.gridSize - 1, this.gridSize - 1);
                    }
                }
            }
        }
    }
    updateScore() {
        const scoreElement = document.getElementById('tetrisScore');
        if (scoreElement) scoreElement.textContent = this.score;
    }
}

// ===== PONG GAME =====
class PongGame extends Game {
    constructor(canvas, playerName) {
        super(canvas, playerName);
        this.gameName = 'pong';
        this.speed = 16;
        this.paddleHeight = 80;
        this.paddleWidth = 10;
        this.ballSize = 8;
        this.paddleSpeed = 5;
        this.ballSpeed = 3;
        this.playerPaddle = { y: 0 };
        this.aiPaddle = { y: 0 };
        this.ball = { x: 0, y: 0, dx: 0, dy: 0 };
        this.keyHandler = this.keyHandler.bind(this);
    }
    init() {
        this.playerPaddle.y = (this.canvas.height - this.paddleHeight) / 2;
        this.aiPaddle.y = (this.canvas.height - this.paddleHeight) / 2;
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.dx = this.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
        this.ball.dy = this.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
        this.score = 0;
        removeAllListeners();
        addListener('keydown', this.keyHandler);
        this.updateScore();
    }
    keyHandler(e) {
        switch(e.key.toLowerCase()) {
            case 'w': this.playerPaddle.y = Math.max(0, this.playerPaddle.y - this.paddleSpeed); break;
            case 's': this.playerPaddle.y = Math.min(this.canvas.height - this.paddleHeight, this.playerPaddle.y + this.paddleSpeed); break;
        }
    }
    update() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        if (this.ball.y <= 0 || this.ball.y >= this.canvas.height - this.ballSize) this.ball.dy *= -1;
        if (this.ball.x <= this.paddleWidth && this.ball.y >= this.playerPaddle.y && this.ball.y <= this.playerPaddle.y + this.paddleHeight) {
            this.ball.dx *= -1; this.score += 1; this.updateScore();
        }
        if (this.ball.x >= this.canvas.width - this.paddleWidth - this.ballSize && this.ball.y >= this.aiPaddle.y && this.ball.y <= this.aiPaddle.y + this.paddleHeight) {
            this.ball.dx *= -1;
        }
        if (this.aiPaddle.y + this.paddleHeight / 2 < this.ball.y) this.aiPaddle.y += this.paddleSpeed * 0.8;
        else this.aiPaddle.y -= this.paddleSpeed * 0.8;
        if (this.ball.x <= 0) return this.gameOver();
        if (this.ball.x >= this.canvas.width) this.ball.dx *= -1;
        this.draw();
    }
    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, this.playerPaddle.y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.aiPaddle.y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillRect(this.ball.x, this.ball.y, this.ballSize, this.ballSize);
        this.ctx.setLineDash([5, 15]);
        this.ctx.strokeStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    updateScore() {
        const scoreElement = document.getElementById('pongScore');
        if (scoreElement) scoreElement.textContent = this.score;
    }
}

// ===== BREAKOUT GAME =====
class BreakoutGame extends Game {
    constructor(canvas, playerName) {
        super(canvas, playerName);
        this.gameName = 'breakout';
        this.speed = 16;
        this.paddleWidth = 80;
        this.paddleHeight = 10;
        this.ballSize = 8;
        this.brickRows = 5;
        this.brickCols = 8;
        this.brickWidth = 0;
        this.brickHeight = 20;
        this.paddle = { x: 0 };
        this.ball = { x: 0, y: 0, dx: 0, dy: 0 };
        this.bricks = [];
        this.colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff'];
    }
    init() {
        this.brickWidth = this.canvas.width / this.brickCols;
        this.paddle.x = (this.canvas.width - this.paddleWidth) / 2;
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height - 50;
        this.ball.dx = 3;
        this.ball.dy = -3;
        this.createBricks();
        this.score = 0;
        removeAllListeners();
        addListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddleWidth, mouseX - this.paddleWidth / 2));
        });
        this.updateScore();
    }
    createBricks() {
        this.bricks = [];
        for (let row = 0; row < this.brickRows; row++) {
            for (let col = 0; col < this.brickCols; col++) {
                this.bricks.push({
                    x: col * this.brickWidth,
                    y: row * this.brickHeight + 50,
                    width: this.brickWidth - 2,
                    height: this.brickHeight - 2,
                    color: this.colors[row],
                    visible: true
                });
            }
        }
    }
    update() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        if (this.ball.x <= 0 || this.ball.x >= this.canvas.width - this.ballSize) this.ball.dx *= -1;
        if (this.ball.y <= 0) this.ball.dy *= -1;
        if (this.ball.y >= this.canvas.height - this.paddleHeight - this.ballSize && this.ball.x >= this.paddle.x && this.ball.x <= this.paddle.x + this.paddleWidth) {
            this.ball.dy *= -1;
            const hitPos = (this.ball.x - this.paddle.x) / this.paddleWidth;
            this.ball.dx = (hitPos - 0.5) * 6;
        }
        this.bricks.forEach(brick => {
            if (brick.visible && this.ball.x < brick.x + brick.width && this.ball.x + this.ballSize > brick.x && this.ball.y < brick.y + brick.height && this.ball.y + this.ballSize > brick.y) {
                brick.visible = false;
                this.ball.dy *= -1;
                this.score += 10;
                this.updateScore();
            }
        });
        if (this.ball.y >= this.canvas.height) return this.gameOver();
        if (this.bricks.every(brick => !brick.visible)) { this.score += 100; this.updateScore(); this.createBricks(); }
        this.draw();
    }
    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.paddle.x, this.canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
        this.ctx.fillRect(this.ball.x, this.ball.y, this.ballSize, this.ballSize);
        this.bricks.forEach(brick => {
            if (brick.visible) {
                this.ctx.fillStyle = brick.color;
                this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        });
    }
    updateScore() {
        const scoreElement = document.getElementById('breakoutScore');
        if (scoreElement) scoreElement.textContent = this.score;
    }
}

// ===== FUNCIONES GLOBALES Y MODAL =====
function getGameScores() {
    const scores = localStorage.getItem(GAME_SCORES_KEY);
    return scores ? JSON.parse(scores) : {};
}
function saveGameScore(gameName, playerName, score) {
    const scores = getGameScores();
    if (!scores[gameName]) scores[gameName] = [];
    scores[gameName].push({ player: playerName, score: score, date: new Date().toISOString() });
    scores[gameName].sort((a, b) => b.score - a.score);
    scores[gameName] = scores[gameName].slice(0, 10);
    localStorage.setItem(GAME_SCORES_KEY, JSON.stringify(scores));
}
function getTopScore(gameName) {
    const scores = getGameScores();
    if (scores[gameName] && scores[gameName].length > 0) return scores[gameName][0].score;
    return 0;
}
function loadScoresData() {
    const scores = getGameScores();
    const container = document.getElementById('scoresContainer');
    if (!container) return;
    container.innerHTML = '';
    Object.keys(scores).forEach(gameName => {
        const gameScores = scores[gameName];
        if (gameScores.length > 0) {
            const gameTitle = gameName.charAt(0).toUpperCase() + gameName.slice(1);
            let scoresHtml = `<h6>${gameTitle}</h6>`;
            gameScores.slice(0, 5).forEach((score, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
                scoresHtml += `
                    <div class="score-item">
                        <div class="score-player">${medal} ${score.player}</div>
                        <div class="score-value">${score.score}</div>
                        <small>${new Date(score.date).toLocaleDateString()}</small>
                    </div>
                `;
            });
            container.innerHTML += scoresHtml;
        }
    });
}

function startGame(gameName, container) {
    const currentUser = getCurrentUser();
    const playerName = currentUser ? currentUser.nombre : 'Jugador';
    if (!container) {
        Swal.fire('Error', 'No se encontró el contenedor para el juego', 'error');
        return;
    }
    // Limpiar contenedor
    container.innerHTML = '';
    // Canvas por juego
    let width = 400, height = 400;
    if (gameName === 'tetris') { width = 300; height = 600; }
    if (gameName === 'pong') { width = 400; height = 300; }
    if (gameName === 'breakout') { width = 400; height = 350; }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'game-canvas';
    canvas.style.border = '2px solid #dee2e6';
    canvas.style.borderRadius = '10px';
    canvas.style.background = '#000';
    container.appendChild(canvas);
    if (currentGame) currentGame.stop();
    switch(gameName) {
        case 'snake': currentGame = new SnakeGame(canvas, playerName); break;
        case 'tetris': currentGame = new TetrisGame(canvas, playerName); break;
        case 'pong': currentGame = new PongGame(canvas, playerName); break;
        case 'breakout': currentGame = new BreakoutGame(canvas, playerName); break;
    }
    if (currentGame) currentGame.start();
}
function stopGame() {
    if (currentGame) {
        currentGame.stop();
        currentGame = null;
    }
}
function getGameControls(gameName) {
    switch(gameName) {
        case 'snake':
            return '<span class="control-key">W</span> <span class="control-key">S</span> <span class="control-key">A</span> <span class="control-key">D</span><br><small>Usa W/A/S/D para mover la serpiente</small>';
        case 'tetris':
            return '<span class="control-key">A</span> <span class="control-key">D</span> <span class="control-key">S</span> <span class="control-key">W</span><br><small>A/D: mover, S: bajar, W: rotar</small>';
        case 'pong':
            return '<span class="control-key">W</span> <span class="control-key">S</span><br><small>W/S para mover la paleta</small>';
        case 'breakout':
            return '<span class="control-key">Mouse</span><br><small>Mueve el mouse para controlar la paleta</small>';
        default:
            return '';
    }
}

// Hacer las funciones accesibles globalmente
window.loadScoresData = loadScoresData;
window.getTopScore = getTopScore;
window.startGame = startGame;
window.stopGame = stopGame;
window.saveGameScore = saveGameScore; 