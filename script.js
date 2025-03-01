const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let balloons = [];
let currentBalloon = null;

function pumpBalloon() {
    if (!currentBalloon) {
        let newX = canvas.width / 4;
        let newY = 300;
        
        currentBalloon = { 
            x: newX, 
            y: newY, 
            radius: 10, 
            popped: false, 
            floating: false, 
            dx: (Math.random() - 0.5) * 1, // Slower horizontal movement
            dy: -0.5 // Slower upward movement
        };
        balloons.push(currentBalloon);
    }
    if (currentBalloon.radius < 40) {
        currentBalloon.radius += 5;
    } else {
        currentBalloon.floating = true;
        currentBalloon = null;
    }
}

function drawBalloons() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balloons.forEach((balloon, index) => {
        if (!balloon.popped) {
            ctx.beginPath();
            ctx.arc(balloon.x, balloon.y, balloon.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${index * 60}, 100%, 50%)`;
            ctx.fill();
            ctx.closePath();
        }
    });
}

function updateBalloons() {
    balloons.forEach(balloon => {
        if (balloon.floating) {
            balloon.x += balloon.dx;
            balloon.y += balloon.dy; 
            
            // Prevent balloons from going outside the frame
            if (balloon.x - balloon.radius < 0 || balloon.x + balloon.radius > canvas.width) {
                balloon.dx *= -1;
            }
            if (balloon.y - balloon.radius < 0) {
                balloon.y = balloon.radius; // Stop at top
                balloon.dy = 0;
                balloon.dx = 0;
            }
        }
    });
}

canvas.addEventListener("click", function (event) {
    const clickX = event.offsetX;
    const clickY = event.offsetY;
    balloons.forEach(balloon => {
        const distance = Math.sqrt((balloon.x - clickX) ** 2 + (balloon.y - clickY) ** 2);
        if (distance < balloon.radius) {
            balloon.popped = true;
        }
    });
});

function gameLoop() {
    updateBalloons();
    drawBalloons();
    requestAnimationFrame(gameLoop);
}

gameLoop();
