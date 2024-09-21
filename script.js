const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resetBtn = document.getElementById('resetBtn');

// Canvas dimensions
canvas.width = 600;
canvas.height = 400;

// Variables
let dots = [];
let lines = [];
let isDrawing = false;
let currentDot = null;

// Create random dots
function createDots() {
    for (let i = 0; i < 10; i++) {
        dots.push({
            x: Math.random() * (canvas.width - 50) + 25,
            y: Math.random() * (canvas.height - 50) + 25,
            radius: 8
        });
    }
}

// Draw dots on canvas
function drawDots() {
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = '#8e2de2';
        ctx.fill();
        ctx.closePath();
    });
}

// Draw lines between dots
function drawLines() {
    lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.start.x, line.start.y);
        ctx.lineTo(line.end.x, line.end.y);
        ctx.strokeStyle = '#4a00e0';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
    });
}

// Redraw canvas content
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDots();
    drawLines();
}

// Check if user clicked on a dot
function getDotAtPosition(x, y) {
    return dots.find(dot => {
        const dx = dot.x - x;
        const dy = dot.y - y;
        return Math.sqrt(dx * dx + dy * dy) < dot.radius;
    });
}

// Mouse down event
canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedDot = getDotAtPosition(mouseX, mouseY);
    if (clickedDot) {
        isDrawing = true;
        currentDot = clickedDot;
    }
});

// Mouse move event (optional if you want to visualize connecting line while dragging)
canvas.addEventListener('mousemove', (event) => {
    if (isDrawing && currentDot) {
        redraw();
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Draw the line while dragging the mouse
        ctx.beginPath();
        ctx.moveTo(currentDot.x, currentDot.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = 'rgba(74, 0, 224, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }
});

// Mouse up event to finalize connection
canvas.addEventListener('mouseup', (event) => {
    if (isDrawing && currentDot) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const releasedDot = getDotAtPosition(mouseX, mouseY);
        if (releasedDot && releasedDot !== currentDot) {
            lines.push({ start: currentDot, end: releasedDot });
        }

        currentDot = null;
        isDrawing = false;
        redraw();
    }
});

// Reset the game
resetBtn.addEventListener('click', () => {
    dots = [];
    lines = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createDots();
    drawDots();
});

// Initialize game
createDots();
drawDots();
