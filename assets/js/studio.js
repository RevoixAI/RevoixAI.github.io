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
     const response = await fetch(`${API_BASE}/api/auth/login`, {
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
    const response = await fetch(`${API_BASE}/api/auth/login`, {
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
