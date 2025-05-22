// Game variables
const fruits = []
let targetFruit = ""
let score = 0
let gameTime = 0
let level = 1
let gameInterval
let fruitInterval
const gameSpeed = 2000 // Initial spawn rate in ms
let isGameOver = false

// DOM Elements
const setupScreen = document.getElementById("setup-screen")
const gameScreen = document.getElementById("game-screen")
const fruitInput = document.getElementById("fruit-input")
const addFruitBtn = document.getElementById("add-fruit-btn")
const fruitList = document.getElementById("fruit-list")
const startGameBtn = document.getElementById("start-game-btn")
const validationMessage = document.getElementById("validation-message")
const listInfo = document.getElementById("list-info")
const gameArea = document.getElementById("game-area")
const crate = document.getElementById("crate")
const scoreDisplay = document.getElementById("score")
const timerDisplay = document.getElementById("timer")
const levelDisplay = document.getElementById("level")
const targetFruitDisplay = document.getElementById("target-fruit-name")
const gameOverScreen = document.getElementById("game-over")
const finalScoreDisplay = document.getElementById("final-score")
const playAgainBtn = document.getElementById("play-again-btn")

// Fruit icons mapping (we'll use a subset of the CSS classes)
const fruitIcons = {
  apple: 'apple',
  pear: 'pear',
  banana: 'banana',
  orange: 'orange',
  lemon: 'lemon',
  watermelon: 'watermelon',
  grape: 'grape',
  strawberry: 'strawberry',
  kiwi: 'kiwi',
  cherry: 'cherry',
  pineapple: 'pineapple',
  mango: 'mango',
  peach: 'peach',
  melon: 'melon',
  blueberry: 'blueberry',
  lime: 'lime',
  fig: 'fig',
  mandarin: 'mandarin',
  nectarine: 'nectarine',
  pomelo: 'pomelo',
  avocado: 'avocado',
  coconut: 'coconut',
  pomegranate: 'pomegranate',
  plum: 'plum',
  apricot: 'apricot',
  feijoa: 'feijoa',
  dogwood: 'dogwood',
  quince: 'quince'
};

// Event Listeners
addFruitBtn.addEventListener("click", addFruit)
fruitInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addFruit()
})
startGameBtn.addEventListener("click", startGame)
playAgainBtn.addEventListener("click", resetGame)

// Initialize crate position
crate.style.left = gameArea.clientWidth / 2 - crate.clientWidth / 2 + "px"

// Mouse movement
document.addEventListener("mousemove", (e) => {
  if (isGameOver) return

  const gameAreaRect = gameArea.getBoundingClientRect()
  const crateRect = crate.getBoundingClientRect()
  const crateWidth = crateRect.width

  // Calculate mouse position relative to the game area
  const mouseX = e.clientX - gameAreaRect.left

  // Set position directly, keeping the basket within boundaries
  if (mouseX >= 0 && mouseX <= gameAreaRect.width - crateWidth) {
    crate.style.left = mouseX + "px"
  } else if (mouseX < 0) {
    crate.style.left = "0px"
  } else if (mouseX > gameAreaRect.width - crateWidth) {
    crate.style.left = gameAreaRect.width - crateWidth + "px"
  }
})

// Simple touch movement for mobile
gameArea.addEventListener(
  "touchmove",
  (e) => {
    if (isGameOver) return
    e.preventDefault()

    const gameAreaRect = gameArea.getBoundingClientRect()
    const crateRect = crate.getBoundingClientRect()
    const crateWidth = crateRect.width

    // Calculate touch position relative to the game area
    const touchX = e.touches[0].clientX - gameAreaRect.left

    // Set position directly, keeping the basket within boundaries
    if (touchX >= 0 && touchX <= gameAreaRect.width - crateWidth) {
      crate.style.left = touchX + "px"
    } else if (touchX < 0) {
      crate.style.left = "0px"
    } else if (touchX > gameAreaRect.width - crateWidth) {
      crate.style.left = gameAreaRect.width - crateWidth + "px"
    }
  },
  { passive: false },
)

// Functions
function addFruit() {
  const fruitName = fruitInput.value.trim().toLowerCase()

  // Validation
  if (fruitName === "") {
    showValidationError("Please enter a fruit name")
    return
  }

  if (fruitName.length < 3) {
    showValidationError("Fruit name must be at least 3 characters")
    return
  }

  if (!/^[a-zA-Z]+$/.test(fruitName)) {
    showValidationError("Fruit name must contain only letters")
    return
  }

  if (fruits.includes(fruitName)) {
    showValidationError("This fruit is already in your list")
    return
  }

  if (fruits.length >= 10) {
    showValidationError("Maximum 10 fruits allowed")
    return
  }
  
  if (!fruitIcons[fruitName]) {
    showValidationError("That fruit is not available in our store")
    return
  }

  // Add fruit to list
  fruits.push(fruitName)
  updateFruitList()

  // Clear input and validation message
  fruitInput.value = ""
  validationMessage.textContent = ""

  // Update UI
  updateFruitListInfo()
}

// Fruits CRUD
function updateFruitList() {
  // Clear the current list
  fruitList.innerHTML = ""

  // Add each fruit with icon and delete button
  fruits.forEach((fruit, index) => {
    const option = document.createElement("div")
    option.className = "fruit-option"
    option.dataset.value = fruit

    // Create fruit icon
    const iconSpan = document.createElement("span")
    iconSpan.className = `fruit-icon ${fruitIcons[fruit]}`

    // Create fruit name
    const nameSpan = document.createElement("span")
    nameSpan.textContent = capitalizeFirstLetter(fruit)

    // Create delete button
    const deleteBtn = document.createElement("span")
    deleteBtn.className = "delete-btn"
    deleteBtn.textContent = "🗑"
    deleteBtn.onclick = (e) => {
      e.stopPropagation()
      fruits.splice(index, 1)
      updateFruitList()
      updateFruitListInfo()
    }

    // Append all elements
    option.appendChild(iconSpan)
    option.appendChild(nameSpan)
    option.appendChild(deleteBtn)

    // Add click event to select this fruit
    option.addEventListener("click", () => {
      document.querySelectorAll(".fruit-option").forEach((opt) => {
        opt.classList.remove("selected")
      })
      option.classList.add("selected")
    })

    fruitList.appendChild(option)
  })

  // Select the first fruit by default if available
  if (fruits.length > 0) {
    fruitList.firstChild.classList.add("selected")
  }
}

function showValidationError(message) {
  validationMessage.textContent = message
  fruitInput.focus()
}

function updateFruitListInfo() {
  const remainingFruits = 5 - fruits.length

  if (remainingFruits > 0) {
    listInfo.textContent = `Add ${remainingFruits} more fruit${remainingFruits === 1 ? "" : "s"} to start`
    startGameBtn.disabled = true
  } else {
    listInfo.textContent = `You have ${fruits.length}/10 fruits`
    startGameBtn.disabled = false
  }
}

function startGame() {
  // Get selected fruit
  const selectedElement = document.querySelector(".fruit-option.selected")
  targetFruit = selectedElement ? selectedElement.dataset.value : fruits[0]

  // Update UI
  setupScreen.classList.remove("active")
  gameScreen.classList.add("active")
  targetFruitDisplay.textContent = capitalizeFirstLetter(targetFruit)

  // Start game timers
  gameInterval = setInterval(updateGameTime, 1000)
  fruitInterval = setInterval(spawnFruit, gameSpeed)

  // Reset game state
  score = 0
  gameTime = 0
  level = 1
  isGameOver = false
  scoreDisplay.textContent = score
  timerDisplay.textContent = gameTime
  levelDisplay.textContent = level

  gameOverScreen.classList.add("hidden")
}

function updateGameTime() {
  gameTime++
  timerDisplay.textContent = gameTime

  // Increase level every 60 seconds
  if (gameTime % 60 === 0) {
    level++
    levelDisplay.textContent = level

    // Update fruit spawn rate
    clearInterval(fruitInterval)
    fruitInterval = setInterval(spawnFruit, gameSpeed)
  }
}

function spawnFruit() {
  if (isGameOver) return

  const fruit = document.createElement("div")
  fruit.className = "fruit"

  // Randomly select a fruit from the user's list
  const randomFruit = fruits[Math.floor(Math.random() * fruits.length)]

  // Assign a fruit icon (use a default if not in our mapping)
  const iconClass =
    fruitIcons[randomFruit] || Object.values(fruitIcons)[Math.floor(Math.random() * Object.keys(fruitIcons).length)]
  fruit.classList.add(iconClass)

  // Set data attribute to identify the fruit
  fruit.dataset.fruitName = randomFruit

  // Random position
  const gameAreaWidth = gameArea.clientWidth
  const fruitWidth = 40 // Width of fruit icon
  const randomX = Math.floor(Math.random() * (gameAreaWidth - fruitWidth))

  fruit.style.left = randomX + "px"
  fruit.style.top = "-50px" // Start above the visible area

  gameArea.appendChild(fruit)

  // Animate the fruit falling
  let posY = -50
  const fallSpeed = level + 1 // Speed increases with level

  const fallInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(fallInterval)
      return
    }

    posY += fallSpeed
    fruit.style.top = posY + "px"

    // Check for collision with crate
    if (checkCollision(fruit, crate)) {
      clearInterval(fallInterval)
      gameArea.removeChild(fruit)

      // Check if it's the target fruit
      if (randomFruit === targetFruit) {
        score++
        scoreDisplay.textContent = score
      } else {
        endGame(`You caught the wrong fruit: ${capitalizeFirstLetter(randomFruit)}`)
      }
    }

    // Check if fruit is out of bounds
    if (posY > gameArea.clientHeight) {
      clearInterval(fallInterval)
      gameArea.removeChild(fruit)

      // Check if it was the target fruit that was missed
      if (randomFruit === targetFruit) {
        endGame(`You missed the target fruit: ${capitalizeFirstLetter(targetFruit)}`)
      }
    }
  }, 16) 
}

function checkCollision(fruit, crate) {
  const fruitRect = fruit.getBoundingClientRect()
  const crateRect = crate.getBoundingClientRect()

  return !(
    fruitRect.bottom < crateRect.top ||
    fruitRect.top > crateRect.bottom ||
    fruitRect.right < crateRect.left ||
    fruitRect.left > crateRect.right
  )
}

function endGame(reason) {
  isGameOver = true
  clearInterval(gameInterval)
  clearInterval(fruitInterval)

  // Show game over screen
  gameOverScreen.classList.remove("hidden")
  finalScoreDisplay.textContent = score

  // Remove all fruits
  const fallingFruits = document.querySelectorAll(".fruit")
  fallingFruits.forEach((fruit) => {
    fruit.remove()
  })
}

function resetGame() {
  // Go back to setup screen
  gameScreen.classList.remove("active")
  setupScreen.classList.add("active")
  gameOverScreen.classList.add("hidden")

  // Clear game area
  const fallingFruits = document.querySelectorAll(".fruit")
  fallingFruits.forEach((fruit) => {
    fruit.remove()
  })
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
