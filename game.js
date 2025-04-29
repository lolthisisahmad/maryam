const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player (Maryam)
const player = {
  x: 50,
  y: 300,
  width: 80,
  height: 80,
  speed: 4,
  img: new Image()
};
player.img.src = 'images/maryam.png';

// Hearts to collect
const hearts = [
  { x: 200, y: 300, collected: false },
  { x: 400, y: 300, collected: false },
  { x: 600, y: 300, collected: false }
];

// Messages to show on heart collection
const messages = [
  "You're pretty smart, and i like that abt working with you.",
  "You are one of the most amazing people i met at school, and one of the only ppl i care about",
  "You matter to me, and I do care about our project even if i dont know how to show that"
];

let msgIndex = 0;

// Cutscene intro character (You)
let showCutscene = true;
const introCharacter = {
  img: new Image(),
  x: 100,
  y: 280,
  width: 90,
  height: 90
};
introCharacter.img.src = 'images/you.png'; // You with red glasses and spiked hair

// Background image
const background = new Image();
background.src = 'images/background.png'; // lively background

// Simulated walking animation
let toggle = false;
setInterval(() => toggle = !toggle, 300);

// Display message box
function showMessage(text) {
  const msgBox = document.getElementById('messageBox');
  msgBox.textContent = text;
  msgBox.style.display = 'block';
  setTimeout(() => {
    msgBox.style.display = 'none';
  }, 5000);
}

// Display instructions at the beginning of the game
function showInstructions() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, canvas.height / 2 - 100, canvas.width, 200);
  ctx.fillStyle = "#fff";
  ctx.font = "20px sans-serif";
  ctx.fillText("Welcome to the game!", 150, canvas.height / 2 - 50);
  ctx.fillText("Use Arrow Keys on ur keyboard to Move, Maryam.", 150, canvas.height / 2);
  ctx.fillText("Collect all red dots to unlock special messages! Press enter to begin!", 150, canvas.height / 2 + 50);
}

// Drawing player with simulated animation
function drawPlayer() {
  ctx.save();
  if (toggle) {
    ctx.scale(-1, 1);
    ctx.drawImage(player.img, -player.x - player.width, player.y, player.width, player.height);
  } else {
    ctx.drawImage(player.img, player.x, player.y, player.width, player.height);
  }
  ctx.restore();
}

// Drawing hearts
function drawHearts() {
  hearts.forEach(h => {
    if (!h.collected) {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(h.x, h.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// Check if Maryam collects a heart
function checkHeartCollection() {
  hearts.forEach(h => {
    if (!h.collected &&
        player.x < h.x + 10 &&
        player.x + player.width > h.x &&
        player.y < h.y + 10 &&
        player.y + player.height > h.y) {
      h.collected = true;
      let currentMsg = messages[msgIndex % messages.length];
      msgIndex++;
      showMessage(currentMsg);

      if (hearts.every(h => h.collected)) {
        setTimeout(() => {
          // New message after collecting all hearts
          showMessage("I know I might've been a jerk, but I had never meant to hurt you in anyway. You say I dont care enough, so I created this game to prove otherwise.'");
        }, 5000);
      }
    }
  });
}

// Controls
const keys = {};
document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (showCutscene && e.key === "Enter") {
    showCutscene = false;
  }
});
document.addEventListener('keyup', e => {
  keys[e.key] = false;
});

// Cutscene drawing
function drawCutscene() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(introCharacter.img, introCharacter.x, introCharacter.y, introCharacter.width, introCharacter.height);

  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
  ctx.fillStyle = "#fff";
  ctx.font = "20px sans-serif";
  ctx.fillText("Hope you don't just neglect this (It took me an hour to make lol)", 50, canvas.height - 50);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  if (showCutscene) {
    drawCutscene();
    showInstructions();  // Show instructions before the cutscene is skipped
    requestAnimationFrame(gameLoop);
    return;
  }

  // Movement
  if (keys["ArrowRight"]) player.x += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;

  drawPlayer();
  drawHearts();
  checkHeartCollection();

  if (hearts.every(h => h.collected)) {
    // Place both characters beside each other and show a floating message
    ctx.drawImage(introCharacter.img, 150, 280, introCharacter.width, introCharacter.height);
    ctx.drawImage(player.img, 200, 300, player.width, player.height);

    // Floating text above characters after collecting all hearts
    ctx.fillStyle = "#fff";
    ctx.font = "24px sans-serif";
    ctx.fillText("I'm proud of what we have accomplished so far :)", 170, 250);
  }

  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
