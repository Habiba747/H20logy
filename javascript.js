// Login Feature
function openLoginModal() {
    document.getElementById("loginModal").style.display = "block";
}

function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginMessage = document.getElementById("loginMessage");

    if (email.trim() !== "" && password.trim() !== "") {
        loginMessage.textContent = "Login successful!";
        loginMessage.style.color = "green";

        // Simulate a small delay before closing the modal
        setTimeout(() => {
            closeLoginModal();
            loginMessage.textContent = ""; // Clear message for next login
            document.getElementById("email").value = ""; // Clear input fields
            document.getElementById("password").value = "";
        }, 1000);
    } else {
        loginMessage.textContent = "Please enter both email and password!";
        loginMessage.style.color = "red";
    }
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById("loginModal");
    if (event.target === modal) {
        closeLoginModal();
    }
};

let gameGoal = 0;
let isGameRunning = false;
let dropInterval;
let gameTimer;
const gameDuration = 30000; // 30 seconds

const gameGoalDisplay = document.getElementById('game-goal');
const bucket = document.getElementById('bucket');
const gameContainer = document.querySelector('.game-container');

function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        gameGoal = 0;
        gameGoalDisplay.textContent = gameGoal.toFixed(1);
        
        // Start the drop generation
        dropInterval = setInterval(createWaterDrop, 1000);
        
        // Start the timer for 30 seconds
        gameTimer = setTimeout(endGame, gameDuration);
        
        document.getElementById('game').classList.add('active');
    }
}

function createWaterDrop() {
    // Create a new water drop element
    const newDrop = document.createElement('div');
    newDrop.classList.add('water-drop');
    newDrop.style.left = `${Math.random() * 100}%`; // Corrected string interpolation
    gameContainer.appendChild(newDrop);

    // Add a timer to remove the drop if it reaches the bottom without being caught
    let dropCaught = false;

    // Function to check if the drop is inside the bucket area
    function checkCatch() {
        const dropRect = newDrop.getBoundingClientRect();
        const bucketRect = bucket.getBoundingClientRect();

        // If the drop has reached the bottom and is inside the bucket's area
        if (
            dropRect.bottom >= bucketRect.top &&
            dropRect.bottom <= bucketRect.bottom &&
            dropRect.left >= bucketRect.left &&
            dropRect.right <= bucketRect.right
        ) {
            // Drop is caught, increase the game goal
            if (!dropCaught) {
                dropCaught = true;
                catchWaterDrop(newDrop);
            }
        }
    }

    // Continuously check if the drop is inside the bucket
    const dropFallInterval = setInterval(() => {
        checkCatch();

        // Move the drop down
        newDrop.style.top = (parseFloat(newDrop.style.top || 0) + 2) + 'px'; // Adjust fall speed here

        // If the drop goes out of bounds, remove it
        if (parseFloat(newDrop.style.top) > gameContainer.offsetHeight) {
            clearInterval(dropFallInterval);
            newDrop.remove();
        }
    }, 20); // Check every 20 milliseconds

    // Add a listener to catch the drop if it's clicked (additional interaction)
    newDrop.addEventListener('click', () => catchWaterDrop(newDrop));
}

function catchWaterDrop(dropElement) {
    // Increase the goal by 0.5L when a drop is caught
    gameGoal += 0.5;
    gameGoalDisplay.textContent = gameGoal.toFixed(1);

    // Remove the caught drop from the screen
    dropElement.remove();
}

function endGame() {
    // Stop the game and display the final score
    clearInterval(dropInterval);
    isGameRunning = false;

    // Show the final score in a droplet
    const scoreDisplay = document.createElement('div');
    scoreDisplay.classList.add('score-display');
    scoreDisplay.innerHTML = `Score: <span>${gameGoal.toFixed(1)} Liters</span>`;
    gameContainer.appendChild(scoreDisplay);
    scoreDisplay.style.top = '50%'; // Position it in the middle of the game container
}

document.addEventListener('mousemove', (e) => {
    // Move the bucket with mouse movement
    if (isGameRunning) {
        const container = gameContainer;
        const bucketWidth = bucket.offsetWidth;
        let bucketLeft = e.pageX - container.offsetLeft - bucketWidth / 2;
        bucketLeft = Math.max(0, Math.min(container.offsetWidth - bucketWidth, bucketLeft));
        bucket.style.left = bucketLeft + 'px';
    }
});

// Start the game automatically when the page loads
startGame();


const smallCupsContainer = document.getElementById('cupsContainer');
const liters = document.getElementById('liters');
const percentage = document.getElementById('percentage');
const remained = document.getElementById('remained');
const goalInput = document.getElementById('goal');
const goalDisplay = document.getElementById('goalDisplay');

let totalLiters = 2; // Default goal
let currentWater = 0;

// Initial call to render small cups and update water tracking display
updateWaterTracking();

function setGoal() {
    totalLiters = parseFloat(goalInput.value);
    goalDisplay.textContent = totalLiters;
    currentWater = 0; // Reset current water when setting a new goal
    updateWaterTracking();
}

function updateWaterTracking() {
    const totalCups = Math.floor(totalLiters * 2); // Each cup represents 0.5 liters
    const fullCups = Math.floor(currentWater * 2);

    // Update the water tracking cups
    smallCupsContainer.innerHTML = '';
    for (let i = 0; i < totalCups; i++) {
        const cup = document.createElement('div');
        cup.classList.add('cup-small');
        if (i < fullCups) {
            cup.classList.add('full');
        }
        smallCupsContainer.appendChild(cup);
    }

    liters.textContent = `${currentWater}/${totalLiters}L`;  // Corrected string interpolation
    percentage.style.height = `${(currentWater / totalLiters) * 100}%`;

    // Update the remainder
    const remainder = totalLiters - currentWater;
    remained.innerHTML = `${remainder.toFixed(1)}L Remaining`; // Corrected string interpolation
}

function addWater() {
    if (currentWater < totalLiters) {
        currentWater += 0.5;
        updateWaterTracking();
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cup-small')) {
        addWater();
    }
});
