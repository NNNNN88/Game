const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// กำหนดขนาด Canvas
canvas.width = 360;
canvas.height = 640;

// ตำแหน่งและขนาดของลูกบอล
let ballX, ballY, ballSpeedX, ballSpeedY, score, isGameOver;
const ballRadius = 10;

// ตำแหน่งและขนาดของ Paddle
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX;

// ฟังก์ชันเริ่มต้นเกม
function resetGame() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 2;
  ballSpeedY = 3;
  paddleX = (canvas.width - paddleWidth) / 2;
  score = 0;
  isGameOver = false;
}

// ฟังก์ชันวาด Paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// ฟังก์ชันวาดลูกบอล
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ff0000";
  ctx.fill();
  ctx.closePath();
}

// ฟังก์ชันวาดคะแนน
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Score: " + score, 8, 20);
}

// ฟังก์ชันวาดข้อความ "Game Over"
function drawGameOver() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = "16px Arial";
  ctx.fillText("Tap to Restart", canvas.width / 2, canvas.height / 2 + 20);
}

// ฟังก์ชันอัปเดตตำแหน่งลูกบอล
function updateBallPosition() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // เด้งเมื่อชนขอบ
  if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY - ballRadius < 0) {
    ballSpeedY = -ballSpeedY;
  } else if (ballY + ballRadius > canvas.height) {
    // ตรวจสอบการชน Paddle
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballSpeedY = -ballSpeedY;
      score += 1; // เพิ่มคะแนนเมื่อชน Paddle
    } else {
      isGameOver = true; // เกมจบเมื่อบอลหลุด Paddle
    }
  }
}

// ฟังก์ชันเพิ่มความเร็วลูกบอลทุกๆ 10 คะแนน
let lastScore = 0;  // ตัวแปรติดตามคะแนนล่าสุดที่เพิ่มความเร็ว

function increaseDifficulty() {
  if (score >= 10 && Math.floor(score / 10) > Math.floor(lastScore / 10)) {
    ballSpeedY -= 0.2; // เพิ่มความเร็วลูกบอลในแนวตั้ง (dy) ทุกๆ 10 คะแนน
    lastScore = score; // อัปเดตคะแนนที่เพิ่มความเร็วแล้ว
  }
}

// ฟังก์ชันจับการสัมผัสหน้าจอ
canvas.addEventListener("touchstart", (e) => {
  if (isGameOver) {
    resetGame(); // เริ่มใหม่ถ้าเกมจบ
  } else {
    movePaddleOnTouch(e);
  }
});
canvas.addEventListener("touchmove", movePaddleOnTouch);

// ฟังก์ชันควบคุม Paddle ด้วยการสัมผัส
function movePaddleOnTouch(e) {
  const touch = e.touches[0]; // ดึงตำแหน่งการสัมผัส
  const touchX = touch.clientX - canvas.offsetLeft;

  if (touchX > 0 && touchX < canvas.width) {
    paddleX = touchX - paddleWidth / 2; // ปรับตำแหน่ง Paddle ตามสัมผัส
  }
}

// ฟังก์ชันอัปเดตเกมทุกเฟรม
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // ล้างหน้าจอ

  if (isGameOver) {
    drawGameOver(); // แสดงข้อความ Game Over
  } else {
    drawBall(); // วาดลูกบอล
    drawPaddle(); // วาด Paddle
    drawScore(); // วาดคะแนน
    updateBallPosition(); // อัปเดตตำแหน่งลูกบอล
    increaseDifficulty(); // เพิ่มความเร็วลูกบอลเมื่อคะแนนถึง 10, 20, 30 ฯลฯ
  }

  requestAnimationFrame(updateGame); // รันเฟรมต่อไป
}

// เริ่มเกม
resetGame();
updateGame();