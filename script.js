// =================================
// CHRISTMAS AND NEW YEAR COUNTDOWN
// =================================

// Get the next upcoming holiday date
function getNextHoliday(month, day) {
    const now = new Date();
    let year = now.getFullYear();

    let target = new Date(year, month, day, 0, 0, 0);

    if (now >= target) {
        target = new Date(year + 1, month, day, 0, 0, 0);
    }

    return target;
}

// Set the target dates once
// const christmasTarget = getNextHoliday(11, 25);
// const newYearTarget = getNextHoliday(0, 1);
const christmasTarget = new Date(2026, 11, 25, 0, 0, 0);
const newYearTarget = new Date(2027, 0, 1, 0, 0, 0);



let christmasCelebrated = false;
let newYearCelebrated = false;


// =================================
// COUNTDOWN FUNCTION
// =================================

function updateCountdown(target, prefix, holidayName) {
    const now = new Date();
    const difference = target.getTime() - now.getTime();

    const daysElement = document.getElementById(prefix + "-days");
    const hoursElement = document.getElementById(prefix + "-hours");
    const minutesElement = document.getElementById(prefix + "-minutes");
    const secondsElement = document.getElementById(prefix + "-seconds");
    const messageElement = document.getElementById(prefix + "-message");

    // Check if countdown is finished
    if (difference <= 0) {
        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        messageElement.textContent =
            holidayName === "Christmas"
                ? "🎄 Merry Christmas!"
                : "🎆 Happy New Year!";

        return true;
    }

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    daysElement.textContent = String(days).padStart(2, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");

    messageElement.textContent = "";

    return false;
}

// =================================
// UPDATE BOTH COUNTDOWNS
// =================================

function updateAllCountdowns() {
    const christmasFinished = updateCountdown(
        christmasTarget,
        "christmas",
        "Christmas"
    );

    const newYearFinished = updateCountdown(
        newYearTarget,
        "newyear",
        "New Year"
    );

    // Start Christmas fireworks only once
    if (christmasFinished && !christmasCelebrated) {
        christmasCelebrated = true;
        startFireworks("🎄 Merry Christmas! 🎆");
    }

    // Start New Year fireworks only once
    if (newYearFinished && !newYearCelebrated) {
        newYearCelebrated = true;
        startFireworks("🎆 Happy New Year! 🥳");
    }
}

updateAllCountdowns();

setInterval(updateAllCountdowns, 1000);


// =================================
// FALLING SNOW ANIMATION
// =================================

const snowContainer = document.getElementById("snow-container");

function createSnowflake() {
    const snow = document.createElement("div");

    snow.classList.add("snowflake");
    snow.textContent = "❄";

    snow.style.left = Math.random() * 100 + "vw";
    snow.style.fontSize = Math.random() * 15 + 10 + "px";
    snow.style.animationDuration = Math.random() * 5 + 5 + "s";
    snow.style.opacity = Math.random();

    snowContainer.appendChild(snow);

    setTimeout(() => {
        snow.remove();
    }, 10000);
}

setInterval(createSnowflake, 300);


// =================================
// FIREWORKS DISPLAY
// =================================

const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let fireworksActive = false;
let fireworksEndTime = 0;
let animationFrame = null;

// Canvas size
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


// Create one firework burst
function createFirework() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight * 0.65);

    const colors = [
        "#FFD700",
        "#FF4D6D",
        "#4DD9FF",
        "#FFFFFF",
        "#1CA568",
        "#FF8C42",
        "#DDA0DD"
    ];

    const color = colors[
        Math.floor(Math.random() * colors.length)
    ];

    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {
        const angle =
            (Math.PI * 2 * i) / particleCount;

        const speed = Math.random() * 4 + 1.5;

        particles.push({
            x: x,
            y: y,

            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,

            alpha: 1,
            radius: Math.random() * 2.5 + 1,

            color: color,
            gravity: 0.035,
            friction: 0.985
        });
    }
}


// Animate fireworks
function animateFireworks() {
    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    // Create random bursts while celebration is active
    if (
        fireworksActive &&
        Date.now() < fireworksEndTime &&
        Math.random() < 0.08
    ) {
        createFirework();
    }

    particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.vx *= particle.friction;
        particle.vy *= particle.friction;

        particle.vy += particle.gravity;

        particle.alpha -= 0.012;

        ctx.globalAlpha = Math.max(particle.alpha, 0);
        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
        ctx.fill();

        // Remove faded particles
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Stop after the celebration and particles finish
    if (
        !fireworksActive &&
        particles.length === 0
    ) {
        animationFrame = null;
        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );
        return;
    }

    // End the main fireworks display after 10 seconds
    if (Date.now() >= fireworksEndTime) {
        fireworksActive = false;
    }

    animationFrame = requestAnimationFrame(animateFireworks);
}


// Start the fireworks celebration
function startFireworks(message) {
    fireworksActive = true;
    fireworksEndTime = Date.now() + 10000;

    // Add celebration message
    const celebration = document.createElement("div");

    celebration.className = "fireworks-message";
    celebration.textContent = message;

    document.body.appendChild(celebration);

    setTimeout(() => {
        celebration.remove();
    }, 5000);

    // Create immediate bursts
    for (let i = 0; i < 5; i++) {
        createFirework();
    }

    // Start animation if it is not already running
    if (animationFrame === null) {
        animateFireworks();
    }
}


// =================================
// CHRISTMAS GIFT SURPRISES
// =================================

const giftMessages = [
    "❤️ Merry Christmas! May your heart always be filled with love and happiness!",

    "🎄 Wishing you endless blessings, beautiful memories, and magical moments!",

    "✨ A new year means new beginnings. May all your dreams come true!"
];

function openGift(index) {
    const gifts = document.querySelectorAll(".gift");
    const message = document.getElementById("gift-message");

    // Prevent opening the same gift again
    if (
        !gifts[index] ||
        gifts[index].classList.contains("opened")
    ) {
        return;
    }

    // Open gift
    gifts[index].classList.add("opened");

    // Display surprise message
    message.textContent = giftMessages[index];

    message.classList.remove("show");

    setTimeout(() => {
        message.classList.add("show");
    }, 100);
}


// =================================
// BACK TO TOP BUTTON
// =================================

const backToTop = document.getElementById("backToTop");

// Show button when scrolling down
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

// Scroll smoothly to the top
backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// =================================
// CHRISTMAS BACKGROUND MUSIC
// =================================

const christmasMusic = document.getElementById("christmasMusic");
const musicToggle = document.getElementById("musicToggle");
const musicStatus = document.getElementById("musicStatus");

// Set default volume
christmasMusic.volume = 0.3;

// Play and pause music
musicToggle.addEventListener("click", async () => {

    if (christmasMusic.paused) {

        try {
            await christmasMusic.play();

            musicToggle.textContent = "❚❚";
            musicStatus.textContent = "Christmas Music Playing 🎶";

        } catch (error) {
            musicStatus.textContent = "Unable to play music";
            console.error("Music playback error:", error);
        }

    } else {

        christmasMusic.pause();

        musicToggle.textContent = "▶";
        musicStatus.textContent = "Music Paused 🎵";
    }

});