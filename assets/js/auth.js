let jwtToken = null;  // Store JWT after login

const API_BASE = "";

function loadAuthModal() {
  fetch("/assets/html/auth-modal.html")
    .then(res => res.text())
    .then(html => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      const template = tempDiv.querySelector("template");
      const clone = document.importNode(template.content, true);
      document.getElementById("auth-modal-container").appendChild(clone);
    })
    .catch(err => {
      console.error("❌ Failed to load auth modal:", err);
    });
}

// === AUTH LOGIC ===

async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      jwtToken = data.access_token;
      localStorage.setItem("jwt", jwtToken);
      hideAuthModal();
      updateUIAfterLogin(); // << THIS must be called
      alert("🔐 Login successful!");
    } else {
      alert("❌ Login failed: " + data.error);
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed. Check console for details.");
  }
}

async function registerUser(event) {
  event.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert("✅ Registered! Now log in.");
    switchAuthTab("login");
  } else {
    alert("❌ Registration failed: " + data.error);
  }
}


// === UI UPDATE LOGIC ===
function updateUIAfterLogin() {
  console.log("✅ Updating UI for logged-in state");
  document.getElementById("auth-nav").classList.add("hidden");
  document.getElementById("user-controls").classList.remove("hidden");
}

function updateUIAfterLogout() {
  console.log("✅ Updating UI for logged-out state");
  document.getElementById("auth-nav")?.classList.remove("hidden");
  document.getElementById("user-controls")?.classList.add("hidden");
}

// === LOGOUT LOGIC ===
function logoutUser() {
  jwtToken = null;
  localStorage.removeItem("jwt");
  document.getElementById("user-controls").classList.add("hidden");
  document.getElementById("auth-nav").classList.remove("hidden");
  updateUIAfterLogout();
  alert("👋 You’ve been logged out.");
}

// === Modal and Tab Controls ===
function showAuthModal() {
  document.getElementById("authModal").style.display = "flex";
}

function hideAuthModal() {
  document.getElementById("authModal").style.display = "none";
}

function switchAuthTab(tab) {
  const loginTab = document.getElementById("login-tab");
  const registerTab = document.getElementById("register-tab");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (tab === "login") {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  } else {
    loginTab.classList.remove("active");
    registerTab.classList.add("active");
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadAuthModal();
  console.log("✅ DOM Loaded on:", location.pathname);
  const savedToken = localStorage.getItem("jwt");
  if (savedToken) {
    jwtToken = savedToken;
    console.log("🔐 JWT found. Updating UI...");
    updateUIAfterLogin();
  } else {
    console.log("🚪 No token found. Logged out.");
    updateUIAfterLogout();
  }
});