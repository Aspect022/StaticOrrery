const spaceship = document.getElementById("spaceship");
const gameContainer = document.getElementById("gameContainer");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const highscoreDisplay = document.getElementById("highscore"); // Reference to the high score element

let score = 0;
let highscore = parseInt(localStorage.getItem("highscore")) || 0; // Retrieve high score from localStorage
highscoreDisplay.innerText = `High Score: ${highscore}`;
let gameOver = false;
let alienInterval;
let countdownInterval;
let timeLeft = 60; // Starting time in seconds

// Optional: Implement rate limiting (e.g., one shot per 300ms)
let canShoot = true;
const shootCooldown = 300; // milliseconds

// Initialize spaceship position
resetSpaceshipPosition();

// Move spaceship with mouse
gameContainer.addEventListener("mousemove", (event) => {
    const containerRect = gameContainer.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;

    const spaceshipWidth = spaceship.offsetWidth;
    if (mouseX >= 0 && mouseX <= containerRect.width - spaceshipWidth) {
        spaceship.style.left = `${mouseX - spaceshipWidth / 2}px`;
    }
});

// Shoot bullets with mouse click
gameContainer.addEventListener("click", (event) => {
    if (!gameOver) {
        // Prevent shooting when clicking on UI elements
        if (event.target === gameContainer || event.target === spaceship) {
            if (canShoot) {
                shoot();
                canShoot = false;
                setTimeout(() => {
                    canShoot = true;
                }, shootCooldown);
            }
        }
    } else {
        resetGame();
    }
});

function shoot() {
    // Calculate spaceship position
    const spaceshipLeft = parseInt(getComputedStyle(spaceship).left);
    const spaceshipWidth = spaceship.offsetWidth;
    const spaceshipHeight = spaceship.offsetHeight;

    // Create left bullet with left direction
    createBullet(spaceshipLeft + 10, spaceshipHeight + 10, "left");
    // Create right bullet with right direction
    createBullet(spaceshipLeft + spaceshipWidth - 20, spaceshipHeight + 10, "right");
}

function createBullet(xPosition, yPosition, direction = "straight") {
    const bullet = document.createElement("img");
    bullet.src = "images/bullet.png"; // Your bullet image source
    bullet.classList.add("bullet");
    bullet.style.position = "absolute";
    bullet.style.left = `${xPosition}px`;
    bullet.style.bottom = `${yPosition}px`;

    // Set the size directly here
    bullet.style.width = "10px";  // Adjust width
    bullet.style.height = "20px";  // Adjust height

    gameContainer.appendChild(bullet);
    moveBullet(bullet, direction);
}

function moveBullet(bullet, direction = "straight") {
    let bulletSpeedY = 8; // Vertical speed
    let bulletSpeedX = 0; // Horizontal speed

    if (direction === "left") {
        bulletSpeedX = -1; // Move slightly to the left
    } else if (direction === "right") {
        bulletSpeedX = 1; // Move slightly to the right
    }

    const interval = setInterval(() => {
        let bulletBottom = parseInt(getComputedStyle(bullet).bottom);
        let bulletLeft = parseInt(getComputedStyle(bullet).left);

        if (bulletBottom < gameContainer.offsetHeight) {
            bullet.style.bottom = `${bulletBottom + bulletSpeedY}px`;
            bullet.style.left = `${bulletLeft + bulletSpeedX}px`;
            checkCollision(bullet, interval);
        } else {
            clearInterval(interval);
            bullet.remove();
        }
    }, 20);
}

function spawnAliens() {
    if (!gameOver) {
        const alien = document.createElement("div");
        alien.classList.add("alien");
        const alienWidth = 50; // Adjust alien width as needed
        const randomPosition = Math.floor(Math.random() * (gameContainer.offsetWidth - alienWidth));
        alien.style.left = `${randomPosition}px`;
        alien.style.top = "0px";
        gameContainer.appendChild(alien);
        moveAlien(alien);
    }
}

function moveAlien(alien) {
    const alienSpeed = 4.5; // Adjust speed as needed
    const interval = setInterval(() => {
        const alienTop = parseInt(getComputedStyle(alien).top);
        if (alienTop < gameContainer.offsetHeight) {
            alien.style.top = `${alienTop + alienSpeed}px`;
            // Optional: Check if alien reaches the bottom
            if (alienTop + alien.offsetHeight >= gameContainer.offsetHeight) {
                // Optionally, end the game or decrement lives
                clearInterval(interval);
                alien.remove();
                // Example: endGame(); // Uncomment if reaching bottom ends the game
            }
        } else {
            clearInterval(interval);
            alien.remove();
        }
    }, 100);
}

function checkCollision(bullet, bulletInterval) {
    const bulletRect = bullet.getBoundingClientRect();
    const aliens = document.querySelectorAll(".alien");
    aliens.forEach((alien) => {
        const alienRect = alien.getBoundingClientRect();
        if (isColliding(bulletRect, alienRect)) {
            clearInterval(bulletInterval);
            bullet.remove();
            removeAlien(alien);
            incrementScore();
        }
    });
}

function isColliding(rect1, rect2) {
    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.right < rect2.left ||
        rect1.left > rect2.right
    );
}

function removeAlien(alien) {
    // Clear the interval associated with the alien's movement
    clearInterval(alien.movementInterval);
    alien.remove();
}

function incrementScore() {
    score++;
    scoreDisplay.innerText = `Score: ${score}`;
    updateHighScore();
}

function updateHighScore() {
    if (score > highscore) {
        highscore = score;
        highscoreDisplay.innerText = `High Score: ${highscore}`;
        localStorage.setItem("highscore", highscore); // Save high score to localStorage
    }
}

// Countdown timer function
function startTimer() {
    timerDisplay.innerText = `Time Left: ${timeLeft}`;
    countdownInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time Left: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            endGame();
        }
    }, 1000); // Update the timer every second
}

function endGame() {
    gameOver = true;

    // Stop spawning aliens
    clearInterval(alienInterval);
    clearInterval(countdownInterval);

    // Remove all active bullets
    document.querySelectorAll(".bullet").forEach((bullet) => bullet.remove());

    // Remove all remaining aliens and their intervals
    document.querySelectorAll(".alien").forEach((alien) => {
        clearInterval(alien.movementInterval);
        alien.remove();
    });

    // Display Game Over message
    const gameOverMessage = document.createElement("div");
    gameOverMessage.id = "game-over-message"; // Assign unique ID
    gameOverMessage.innerText = "Game Over!\nClick to Restart";
    gameOverMessage.style.position = "absolute";
    gameOverMessage.style.top = "50%";
    gameOverMessage.style.left = "50%";
    gameOverMessage.style.transform = "translate(-50%, -50%)";
    gameOverMessage.style.fontSize = "24px"; // Adjusted for better responsiveness
    gameOverMessage.style.color = "red";
    gameOverMessage.style.textAlign = "center";
    gameOverMessage.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    gameOverMessage.style.padding = "20px";
    gameOverMessage.style.borderRadius = "10px";
    gameContainer.appendChild(gameOverMessage);
}

function resetGame() {
    // Reset game state
    score = 0;
    timeLeft = 60;
    scoreDisplay.innerText = `Score: ${score}`;
    timerDisplay.innerText = `Time Left: ${timeLeft}`;
    gameOver = false;

    // Remove existing game over message if any
    const gameOverMessage = document.getElementById("game-over-message");
    if (gameOverMessage) {
        gameOverMessage.remove();
    }

    // Reset spaceship position
    resetSpaceshipPosition();

    // Start spawning aliens again
    alienInterval = setInterval(spawnAliens, 1500);

    // Restart the countdown timer
    startTimer();
}

function resetSpaceshipPosition() {
    // Position the spaceship at the center bottom of the game container
    const spaceshipWidth = spaceship.offsetWidth;
    const initialLeft = (gameContainer.offsetWidth - spaceshipWidth) / 2;
    spaceship.style.left = `${initialLeft}px`;
    spaceship.style.bottom = "10px"; // Adjust as per your layout
}

// Start the game
alienInterval = setInterval(spawnAliens, 1500);
startTimer(); // Start the countdown when the game starts
