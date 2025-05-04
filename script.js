// DOM Elements
const matchCount = document.querySelector('.match-count');
const matchCircle = document.querySelector('.match-circle');
const timerElement = document.querySelector('.timer');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const winMessage = document.getElementById('win-message');
const timeUpMessage = document.getElementById('time-up-message');

// Dropdown elements
const timerDropdownToggle = document.getElementById('timer-dropdown');
const timerDropdownMenu = document.getElementById('timer-menu');
const itemDropdownToggle = document.getElementById('item-dropdown');
const itemDropdownMenu = document.getElementById('item-menu');

// Game state
let currentCount = 0;
let targetCount = 5; // Default
let timeLeft = 30; // Default
let timerInterval;
let gameActive = false;

// Handle dropdown toggles
function setupDropdowns() {
    // Timer dropdown
    timerDropdownToggle.addEventListener('click', () => {
        if (gameActive) return;
        timerDropdownMenu.classList.toggle('show');
    });
    
    // Item count dropdown
    itemDropdownToggle.addEventListener('click', () => {
        if (gameActive) return;
        itemDropdownMenu.classList.toggle('show');
    });
    
    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', (event) => {
        if (!timerDropdownToggle.contains(event.target) && !timerDropdownMenu.contains(event.target)) {
            timerDropdownMenu.classList.remove('show');
        }
        
        if (!itemDropdownToggle.contains(event.target) && !itemDropdownMenu.contains(event.target)) {
            itemDropdownMenu.classList.remove('show');
        }
    });
    
    // Timer dropdown items
    timerDropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const value = parseInt(item.getAttribute('data-value'));
            timeLeft = value;
            timerElement.textContent = value;
            timerDropdownToggle.textContent = `${value}s`;
            timerDropdownMenu.classList.remove('show');
        });
    });
    
    // Item count dropdown items
    itemDropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const value = parseInt(item.getAttribute('data-value'));
            targetCount = value;
            itemDropdownToggle.textContent = value;
            itemDropdownMenu.classList.remove('show');
        });
    });
}

// Start the game
function startGame() {
    if (gameActive) return;
    
    // Reset UI
    resetUI();
    
    // Activate game
    gameActive = true;
    startBtn.disabled = true;
    resetBtn.style.display = 'inline-block';
    
    // Start countdown
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
    
    // Enable keyboard input
    document.addEventListener('keydown', handleKeypress);
}

// Handle keypress for number input
function handleKeypress(event) {
    if (!gameActive) return;
    
    const key = event.key;
    if (/^[0-9]$/.test(key)) {
        currentCount = parseInt(key);
        matchCount.textContent = currentCount;
        
        // Check for win condition
        checkWinCondition();
    }
}

// Check if player has won
function checkWinCondition() {
    if (currentCount === targetCount) {
        winMessage.classList.add('show');
        matchCircle.classList.add('win');
        endGame(true);
    }
}

// End the game
function endGame(isWin) {
    gameActive = false;
    clearInterval(timerInterval);
    document.removeEventListener('keydown', handleKeypress);
    startBtn.disabled = false;
    
    if (!isWin && timeLeft <= 0) {
        timeUpMessage.classList.add('show');
    }
}

// Reset UI
function resetUI() {
    currentCount = 0;
    matchCount.textContent = '0';
    matchCircle.classList.remove('win');
    winMessage.classList.remove('show');
    timeUpMessage.classList.remove('show');
}

// Reset game
function resetGame() {
    endGame(false);
    resetUI();
    timerElement.textContent = timeLeft;
    resetBtn.style.display = 'none';
}

// Initialize
function init() {
    setupDropdowns();
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    
    // Set default values
    itemDropdownToggle.textContent = targetCount;
    timerDropdownToggle.textContent = `${timeLeft}s`;
}

// Start app
init();