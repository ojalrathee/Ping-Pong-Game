// Canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 12;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const AI_SPEED = 5;
const BALL_SPEED = 6;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
    vy: BALL_SPEED * (Math.random() * 2 - 1),
};

// Mouse control
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    // Mouse Y relative to canvas
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;

    // Prevent paddle from going out of bounds
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw paddles, ball, net
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Net
    ctx.strokeStyle = '#0ff6';
    ctx.beginPath();
    for (let y = 0; y < canvas.height; y += 32) {
        ctx.moveTo(canvas.width / 2, y);
        ctx.lineTo(canvas.width / 2, y + 16);
    }
    ctx.stroke();

    // Player paddle
    ctx.fillStyle = '#0ff';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // AI paddle
    ctx.fillStyle = '#ff0';
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
}

// Ball and paddle collision
function checkCollision() {
    // Top and bottom
    if (ball.y - BALL_RADIUS < 0) {
        ball.y = BALL_RADIUS;
        ball.vy *= -1;
    }
    if (ball.y + BALL_RADIUS > canvas.height) {
        ball.y = canvas.height - BALL_RADIUS;
        ball.vy *= -1;
    }

    // Left paddle (player)
    if (
        ball.x - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ball.y > playerY &&
        ball.y < playerY + PADDLE_HEIGHT
    ) {
        ball.x = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
        ball.vx *= -1;
        // Add a bit of "spin"
        ball.vy += (ball.y - (playerY + PADDLE_HEIGHT / 2)) * 0.15;
    }

    // Right paddle (AI)
    if (
        ball.x + BALL_RADIUS > AI_X &&
        ball.y > aiY &&
        ball.y < aiY + PADDLE_HEIGHT
    ) {
        ball.x = AI_X - BALL_RADIUS;
        ball.vx *= -1;
        ball.vy += (ball.y - (aiY + PADDLE_HEIGHT / 2)) * 0.15;
    }
}

// AI logic
function moveAI() {
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (ball.y < aiCenter - 16) {
        aiY -= AI_SPEED;
    } else if (ball.y > aiCenter + 16) {
        aiY += AI_SPEED;
    }
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    let angle = Math.random() * Math.PI / 4 - Math.PI / 8; // -22.5deg ~ 22.5deg
    let direction = Math.random() < 0.5 ? 1 : -1;
    ball.vx = BALL_SPEED * direction;
    ball.vy = BALL_SPEED * Math.tan(angle);
}

// Game update
function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    checkCollision();
    moveAI();

    // Check for scoring
    if (ball.x < 0 || ball.x > canvas.width) {
        resetBall();
    }
}

// Animation loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start
resetBall();
gameLoop();