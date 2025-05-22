// DOM Elements
const sidebar = document.getElementById("sidebar")
const mainContent = document.getElementById("main-content")
const toggleBtn = document.getElementById("toggle-sidebar")
const bgColorPicker = document.getElementById("bg-color")
const bgImageUrl = document.getElementById("bg-image-url")
const applyBgImageBtn = document.getElementById("apply-bg-image")
const clearBgImageBtn = document.getElementById("clear-bg-image")
const fontSelector = document.getElementById("font-selector")

// Create mobile toggle button
const mobileToggle = document.createElement("button")
mobileToggle.className = "mobile-toggle"
mobileToggle.innerHTML = "<span></span>"
mobileToggle.setAttribute("aria-label", "Toggle Sidebar")
document.body.appendChild(mobileToggle)

// Font families to load
const fontFamilies = [
  "Roboto",
  "Montserrat",
  "Oswald",
  "Playfair+Display",
  "Quicksand",
  "Lato",
  "Open+Sans",
  "Poppins",
  "Dancing+Script",
  "Pacifico",
]

// Load Google Fonts
function loadGoogleFonts() {
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies.join("&family=")}&display=swap`
  document.head.appendChild(link)

  // Pre-load fonts to avoid FOIT (Flash of Invisible Text)
  const fontFaceObservers = fontFamilies.map((font) => {
    // Convert back to CSS-friendly font family name
    const fontName = font.replace(/\+/g, " ")
    return new Promise((resolve) => {
      // Simple timeout to allow font to load
      setTimeout(() => resolve(fontName), 100)
    })
  })

  // When all fonts are loaded, apply the default font
  Promise.all(fontFaceObservers).then(() => {
    // Apply default font if one is selected in the dropdown
    const selectedFont = fontSelector.value
    if (selectedFont !== "default") {
      applyFont(selectedFont)
    }
  })
}

// Toggle sidebar
function toggleSidebar() {
  sidebar.classList.toggle("collapsed")
  mainContent.classList.toggle("expanded")

  // For mobile
  sidebar.classList.toggle("mobile-open")
}

// Apply background color
function applyBackgroundColor(color) {
  document.body.style.background = color
}

// Apply background image
function applyBackgroundImage(url) {
  if (url) {
    document.body.style.backgroundImage = `url('${url}')`
    document.body.style.backgroundSize = "cover"
    document.body.style.backgroundPosition = "center"
    document.body.style.backgroundRepeat = "no-repeat"
  }
}

// Clear background image
function clearBackgroundImage() {
  document.body.style.backgroundImage = "none"
  bgImageUrl.value = ""
  // Restore the background color
  applyBackgroundColor(bgColorPicker.value)
}

// Apply font to all elements
function applyFont(fontFamily) {
  if (fontFamily === "default") {
    document.documentElement.style.setProperty("--main-font", '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif')
  } else {
    document.documentElement.style.setProperty("--main-font", `"${fontFamily}", sans-serif`)
  }

  // Force update on all text elements to ensure the font is applied
  const textElements = document.querySelectorAll(
    "body, h1, h2, h3, h4, h5, h6, p, span, a, button, input, select, textarea, label, li",
  )
  textElements.forEach((el) => {
    el.style.fontFamily = "var(--main-font)"
  })
}

// Event Listeners
toggleBtn.addEventListener("click", toggleSidebar)
mobileToggle.addEventListener("click", toggleSidebar)

bgColorPicker.addEventListener("input", (e) => {
  applyBackgroundColor(e.target.value)
})

applyBgImageBtn.addEventListener("click", () => {
  applyBackgroundImage(bgImageUrl.value)
})

clearBgImageBtn.addEventListener("click", clearBackgroundImage)

fontSelector.addEventListener("change", (e) => {
  applyFont(e.target.value)
})

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Load Google Fonts
  loadGoogleFonts()

  // Apply initial background color
  applyBackgroundColor(bgColorPicker.value)

  // Apply initial font if one is selected
  if (fontSelector.value !== "default") {
    applyFont(fontSelector.value)
  }

  // Check for mobile view
  if (window.innerWidth <= 768) {
    sidebar.classList.add("collapsed")
    mainContent.classList.add("expanded")
  }
})

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    if (!sidebar.classList.contains("mobile-open")) {
      sidebar.classList.add("collapsed")
      mainContent.classList.add("expanded")
    }
  } else {
    // Reset mobile-specific classes
    sidebar.classList.remove("mobile-open")
  }
})
