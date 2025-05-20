let mediaRecorder;
let audioChunks = [];
let jwtToken = null;  // Store JWT after login

// === Start Recording ===
async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
  mediaRecorder.start();

  alert("🎙️ Recording started...");
}

// === Stop Recording ===
async function stopRecording() {
  mediaRecorder.stop();

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('voice_sample', audioBlob, 'sample.wav');

    try {
      const response = await fetch('http://localhost:5000/api/voice/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        },
        body: formData
      });

      const data = await response.json();
      alert("✅ Uploaded voice sample: " + JSON.stringify(data));
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Failed to upload.");
    }
  };

  alert("⏹️ Recording stopped.");
}

// === Synthesize Speech ===
async function synthesizeSpeech() {
  const text = document.getElementById('text-input').value;

  try {
    const response = await fetch('http://localhost:5000/api/voice/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ text: text })
    });

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.play();

    alert("🔊 Synthesized and playing audio.");
  } catch (error) {
    console.error("Synthesis error:", error);
    alert("❌ Speech synthesis failed.");
  }
}

// === AUTH LOGIC ===

async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    jwtToken = data.access_token;
    hideAuthModal();
    alert("🔐 Login successful!");
  } else {
    alert("❌ Login failed: " + data.error);
  }
}

async function registerUser(event) {
  event.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  const res = await fetch('http://localhost:5000/api/auth/register', {
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
