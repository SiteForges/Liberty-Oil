const API_BASE = "http://localhost:3001";
const LAUNCH_ITEMS = ["Google", "YouTube", "Gmail", "ChatGPT", "Gemini", "Claude", "Roblox", "Minecraft", "Steam", "Discord", "Spotify", "Notes"];
const IDEA_PROMPTS = [
  { title: "Website ideas", description: "Modern small-business landing pages with clear conversion hooks.", difficulty: "Easy", cost: "$0-200", start: "Pick one niche and a single CTA." },
  { title: "Business ideas", description: "Lean service ideas you can launch locally with a narrow offer.", difficulty: "Medium", cost: "$100-1k", start: "Validate demand with one nearby audience." },
  { title: "YouTube ideas", description: "Series concepts with repeatable formats and fast hooks.", difficulty: "Easy", cost: "$0-500", start: "Choose a format you can repeat weekly." },
  { title: "App ideas", description: "Useful micro-tools with one strong job-to-be-done.", difficulty: "Medium", cost: "$500-5k", start: "Define the smallest useful version first." },
  { title: "School projects", description: "Presentable concepts with simple demo logic and polish.", difficulty: "Easy", cost: "$0-100", start: "Pick a topic with enough visual proof." },
  { title: "Marketing ideas", description: "Campaign concepts with one channel and one conversion path.", difficulty: "Medium", cost: "$50-2k", start: "Write the audience, the hook, and the payoff." }
];

const state = {
  route: "all",
  speakEnabled: true,
  listening: false,
  chat: loadJSON("jarvis-chat", []),
  notes: loadJSON("jarvis-notes", [{ id: crypto.randomUUID(), text: "Capture a business idea here." }]),
  log: loadJSON("jarvis-log", []),
  keys: loadJSON("jarvis-keys", {}),
  currentPrompt: ""
};

const el = {};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

async function api(path, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function pushLog(message) {
  state.log.unshift({ id: crypto.randomUUID(), time: nowTime(), message });
  state.log = state.log.slice(0, 20);
  saveJSON("jarvis-log", state.log);
  renderLogs();
}

function addMessage(role, text) {
  state.chat.push({ id: crypto.randomUUID(), role, text, time: nowTime() });
  saveJSON("jarvis-chat", state.chat);
  renderChat();
}

function renderLaunchers() {
  el.launchGrid.innerHTML = "";
  LAUNCH_ITEMS.forEach((item) => {
    const tpl = document.getElementById("launchButtonTemplate");
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.querySelector(".launch-label").textContent = item;
    node.addEventListener("click", () => routeLauncher(item));
    el.launchGrid.appendChild(node);
  });
}

function renderIdeas(items = IDEA_PROMPTS) {
  el.ideaGrid.innerHTML = "";
  items.forEach((idea) => {
    const tpl = document.getElementById("ideaTemplate");
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.querySelector("h3").textContent = idea.title;
    node.querySelector("p").textContent = idea.description;
    node.querySelector(".idea-meta").innerHTML = `<span>${idea.difficulty}</span><span>${idea.cost}</span><span>${idea.start}</span>`;
    el.ideaGrid.appendChild(node);
  });
}

function renderChat() {
  el.chatStream.innerHTML = "";
  state.chat.forEach((msg) => {
    const tpl = document.getElementById("chatMessageTemplate");
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.classList.add(msg.role);
    node.querySelector(".message-role").textContent = msg.role === "user" ? "You" : "Assistant";
    node.querySelector(".message-time").textContent = msg.time;
    node.querySelector(".message-body").textContent = msg.text;
    node.querySelector(".copy-btn").addEventListener("click", async () => {
      await navigator.clipboard.writeText(msg.text);
      pushLog("Copied assistant response.");
    });
    el.chatStream.appendChild(node);
  });
}

function renderNotes() {
  const filter = el.noteSearch.value.trim().toLowerCase();
  el.notesList.innerHTML = "";
  state.notes
    .filter((note) => note.text.toLowerCase().includes(filter))
    .forEach((note) => {
      const tpl = document.getElementById("noteTemplate");
      const node = tpl.content.firstElementChild.cloneNode(true);
      const textarea = node.querySelector("textarea");
      textarea.value = note.text;
      node.querySelector(".save-note-btn").addEventListener("click", () => {
        note.text = textarea.value.trim();
        saveJSON("jarvis-notes", state.notes);
        pushLog("Saved note.");
        renderNotes();
      });
      node.querySelector(".delete-note-btn").addEventListener("click", () => {
        state.notes = state.notes.filter((entry) => entry.id !== note.id);
        saveJSON("jarvis-notes", state.notes);
        pushLog("Deleted note.");
        renderNotes();
      });
      el.notesList.appendChild(node);
    });
}

function renderLogs() {
  el.actionLog.innerHTML = state.log.map((entry) => `<div class="log-item"><strong>${entry.time}</strong> ${entry.message}</div>`).join("");
}

function setOrbMode(mode) {
  el.assistantState.textContent = mode;
  el.voiceOrb.dataset.mode = mode;
}

function speak(text) {
  if (!state.speakEnabled || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = Number(el.voiceRate.value);
  utterance.pitch = el.voiceStyle.value === "Bright" ? 1.15 : el.voiceStyle.value === "Focused" ? 0.95 : 1;
  utterance.onstart = () => setOrbMode("Speaking");
  utterance.onend = () => setOrbMode("Listening for a command");
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function requestConfirmation(title, text, callback) {
  el.confirmTitle.textContent = title;
  el.confirmText.textContent = text;
  el.confirmDialog.showModal();
  el.confirmProceedBtn.onclick = async () => {
    try {
      await callback?.();
    } finally {
      el.confirmDialog.close();
    }
  };
}

async function routeLauncher(item) {
  const websiteMap = {
    Google: "google",
    YouTube: "youtube",
    Gmail: "gmail",
    ChatGPT: "chatgpt",
    Gemini: "gemini",
    Claude: "claude",
    Spotify: "spotify"
  };
  if (websiteMap[item]) {
    const result = await api("/api/open", { type: "website", target: websiteMap[item], confirmed: true });
    addMessage("assistant", `${item} opened.`);
    pushLog(`Opened ${item}.`);
    speak(`${item} opened.`);
    return;
  }

  if (item === "Notes") {
    document.querySelector(".notes-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    pushLog("Opened notes panel.");
    return;
  }

  requestConfirmation(`JARVIS wants to open ${item}`, `Confirm opening ${item} on this computer.`, async () => {
    const result = await api("/api/open", { type: "app", target: item.toLowerCase(), confirmed: true });
    addMessage("assistant", `${item} opened.`);
    pushLog(`${item} launch result: ${result.opened || "success"}.`);
    speak(`${item} opened.`);
  });
}

async function handleCommand(input) {
  const text = input.trim();
  if (!text) return;
  state.currentPrompt = text;
  addMessage("user", text);
  try {
    const lower = text.toLowerCase();
    if (lower.includes("clear the chat")) {
      state.chat = [];
      saveJSON("jarvis-chat", state.chat);
      renderChat();
      const reply = "Chat cleared.";
      addMessage("assistant", reply);
      speak(reply);
      pushLog(reply);
      return;
    }

    if (/open my (downloads|desktop|documents) folder/i.test(text)) {
      const target = text.match(/open my (downloads|desktop|documents) folder/i)[1].toLowerCase();
      requestConfirmation(`JARVIS wants to open ${target}`, `Confirm opening your approved ${target} folder.`, async () => {
        const result = await api("/api/open", { type: "folder", target, confirmed: true });
        const reply = `${target} folder opened.`;
        addMessage("assistant", reply);
        pushLog(reply);
        speak(reply);
        return result;
      });
      return;
    }

    if (/open (roblox|minecraft|steam|discord|spotify|notepad)/i.test(text)) {
      const target = text.match(/open (roblox|minecraft|steam|discord|spotify|notepad)/i)[1].toLowerCase();
      requestConfirmation(`JARVIS wants to open ${target}`, `Confirm opening ${target} on this computer.`, async () => {
        const result = await api("/api/open", { type: "app", target, confirmed: true });
        const reply = `${target} opened.`;
        addMessage("assistant", reply);
        pushLog(reply);
        speak(reply);
        return result;
      });
      return;
    }

    const modelMode = state.route === "all" ? "all" : state.route;
    const result = await api("/api/chat", { message: text, modelMode });
    const reply = result.reply || "No reply returned.";
    addMessage("assistant", reply);
    pushLog(`AI replied: ${reply}`);
    speak(reply);

    if (result.models) {
      el.modelCards.innerHTML = "";
      Object.entries(result.models).forEach(([name, value]) => {
        if (!value) return;
        const card = document.createElement("article");
        card.className = "model-card";
        card.innerHTML = `<h3>${name}</h3><p>${value}</p>`;
        el.modelCards.appendChild(card);
      });
      el.combinedAnswer.textContent = reply;
    } else {
      const card = document.createElement("article");
      card.className = "model-card";
      card.innerHTML = `<h3>Assistant</h3><p>${reply}</p>`;
      el.modelCards.innerHTML = "";
      el.modelCards.appendChild(card);
      el.combinedAnswer.textContent = reply;
    }

    if (/idea|search|latest|current|news/i.test(text)) renderIdeas();
  } catch (error) {
    const message = error.message || "Backend is not running.";
    addMessage("assistant", message);
    pushLog(message);
  }
}

function setupVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    el.micBtn.disabled = true;
    el.micBtn.textContent = "Mic Unavailable";
    pushLog("Speech recognition is not available in this browser.");
    return;
  }
  const recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  recognition.onstart = () => {
    state.listening = true;
    setOrbMode("Listening...");
    el.micBtn.textContent = "Stop Mic";
  };
  recognition.onresult = (event) => {
    const result = Array.from(event.results).map((r) => r[0].transcript).join(" ");
    el.liveTranscript.textContent = result;
    if (event.results[0].isFinal) handleCommand(result);
  };
  recognition.onerror = (event) => {
    const message = event.error === "not-allowed" ? "Microphone permission was denied." : "Mic error.";
    addMessage("assistant", message);
    pushLog(message);
  };
  recognition.onend = () => {
    state.listening = false;
    el.micBtn.textContent = "Start Mic";
    setOrbMode("Listening for a command");
  };
  el.micBtn.addEventListener("click", () => {
    if (state.listening) recognition.stop();
    else recognition.start();
  });
}

async function loadHealth() {
  try {
    const health = await fetch(`${API_BASE}/api/health`).then((r) => r.json());
    const missing = [];
    if (!health.env?.openai) missing.push("OpenAI");
    if (!health.env?.gemini) missing.push("Gemini");
    if (!health.env?.anthropic) missing.push("Claude");
    el.modelStatus.textContent = missing.length ? `Missing: ${missing.join(", ")}` : "All AI keys detected";
    pushLog("Backend connected.");
  } catch {
    el.modelStatus.textContent = "Backend offline";
    pushLog("Backend is not running.");
  }
}

function init() {
  el.launchGrid = document.getElementById("launchGrid");
  el.ideaGrid = document.getElementById("ideaGrid");
  el.notesList = document.getElementById("notesList");
  el.chatStream = document.getElementById("chatStream");
  el.actionLog = document.getElementById("actionLog");
  el.combinedAnswer = document.getElementById("combinedAnswer");
  el.assistantState = document.getElementById("assistantState");
  el.liveTranscript = document.getElementById("liveTranscript");
  el.voiceOrb = document.getElementById("voiceOrb");
  el.micBtn = document.getElementById("micBtn");
  el.voiceRate = document.getElementById("voiceRate");
  el.voiceStyle = document.getElementById("voiceStyle");
  el.chatForm = document.getElementById("chatForm");
  el.chatInput = document.getElementById("chatInput");
  el.noteSearch = document.getElementById("noteSearch");
  el.confirmDialog = document.getElementById("confirmDialog");
  el.confirmTitle = document.getElementById("confirmTitle");
  el.confirmText = document.getElementById("confirmText");
  el.confirmProceedBtn = document.getElementById("confirmProceedBtn");
  el.confirmActionBtn = document.getElementById("confirmActionBtn");
  el.savePromptBtn = document.getElementById("savePromptBtn");
  el.clearChatBtn = document.getElementById("clearChatBtn");
  el.toggleChatBtn = document.getElementById("toggleChatBtn");
  el.connectModelsBtn = document.getElementById("connectModelsBtn");
  el.saveKeysBtn = document.getElementById("saveKeysBtn");
  el.openaiKey = document.getElementById("openaiKey");
  el.geminiKey = document.getElementById("geminiKey");
  el.claudeKey = document.getElementById("claudeKey");
  el.closeSetupBtn = document.getElementById("closeSetupBtn");
  el.setupPanel = document.getElementById("setupPanel");
  el.modelStatus = document.getElementById("modelStatus");

  renderLaunchers();
  renderIdeas();
  renderChat();
  renderNotes();
  renderLogs();
  setupVoice();
  loadHealth();
  setOrbMode("Listening for a command");

  document.querySelectorAll(".segment").forEach((segment) => {
    segment.addEventListener("click", () => {
      document.querySelectorAll(".segment").forEach((btn) => btn.classList.remove("active"));
      segment.classList.add("active");
      state.route = segment.dataset.route;
      el.modelStatus.textContent = `Routing: ${segment.textContent}`;
      pushLog(`Model route set to ${segment.textContent}.`);
    });
  });

  el.chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = el.chatInput.value;
    el.chatInput.value = "";
    await handleCommand(value);
  });

  el.noteSearch.addEventListener("input", renderNotes);
  el.clearChatBtn.addEventListener("click", () => {
    state.chat = [];
    saveJSON("jarvis-chat", state.chat);
    renderChat();
    pushLog("Cleared chat history.");
  });
  el.toggleChatBtn.addEventListener("click", () => {
    document.querySelector(".chat-panel")?.classList.toggle("hidden-panel");
  });
  document.getElementById("newNoteBtn").addEventListener("click", () => {
    state.notes.unshift({ id: crypto.randomUUID(), text: "" });
    saveJSON("jarvis-notes", state.notes);
    renderNotes();
    pushLog("Created a new note.");
  });
  el.savePromptBtn.addEventListener("click", () => {
    if (!state.currentPrompt) return;
    state.notes.unshift({ id: crypto.randomUUID(), text: state.currentPrompt });
    saveJSON("jarvis-notes", state.notes);
    renderNotes();
    pushLog("Saved the current prompt as a note.");
  });
  el.connectModelsBtn.addEventListener("click", () => el.setupPanel.scrollIntoView({ behavior: "smooth", block: "center" }));
  el.confirmActionBtn.addEventListener("click", () => requestConfirmation("Confirm local action", "This would trigger the local helper and requires approval before it runs."));
  el.saveKeysBtn.addEventListener("click", () => {
    state.keys = {
      openai: el.openaiKey.value.trim(),
      gemini: el.geminiKey.value.trim(),
      claude: el.claudeKey.value.trim()
    };
    saveJSON("jarvis-keys", state.keys);
    pushLog("Saved API keys locally.");
    el.setupPanel.style.display = "none";
  });
  el.closeSetupBtn.addEventListener("click", () => {
    el.setupPanel.style.display = "none";
  });

  document.getElementById("speakToggleBtn").addEventListener("click", () => {
    state.speakEnabled = !state.speakEnabled;
    document.getElementById("speakToggleBtn").textContent = state.speakEnabled ? "Voice On" : "Voice Off";
    pushLog(`Voice output ${state.speakEnabled ? "enabled" : "muted"}.`);
  });

  document.querySelectorAll("[data-folder]").forEach((button) => {
    button.addEventListener("click", () => {
      const folder = button.dataset.folder;
      requestConfirmation(`JARVIS wants to open ${folder}`, `Confirm opening your approved ${folder} folder.`, async () => {
        await api("/api/open", { type: "folder", target: folder, confirmed: true });
        addMessage("assistant", `${folder} folder opened.`);
        pushLog(`${folder} folder opened.`);
      });
    });
  });

  if (!state.chat.length) {
    addMessage("assistant", "I'm online. Say or type a command, ask for ideas, or open the setup panel for API keys.");
  }
}

init();
