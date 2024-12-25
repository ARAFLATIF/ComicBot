const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true
});

let voiceMode = false;
const synth = window.speechSynthesis;
let recognition;

async function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    displayMessage(userInput, 'user');

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "You are a Comic Relief Counselor, providing humorous and supportive responses."},
                {role: "user", content: userInput}
            ],
        });

        const botResponse = response.choices[0].message.content;
        displayMessage(botResponse, 'bot');
    } catch (error) {
        console.error("Error:", error);
        displayMessage("Oops! My joke generator short-circuited. Can you try again?", 'bot');
    }

    document.getElementById("user-input").value = "";
}

function displayMessage(message, sender) {
    const chatMessages = document.getElementById("chat-messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.innerHTML = marked.parse(message);
    chatMessages.appendChild(messageElement);
    scrollToBottom();

    if (sender === 'bot' && voiceMode) {
        speakMessage(message);
    }
}

function scrollToBottom() {
    const scrollAnchor = document.getElementById("scroll-anchor");
    scrollAnchor.scrollIntoView({ behavior: "smooth" });
}

function speakMessage(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    synth.speak(utterance);
}

function toggleVoice() {
    voiceMode = !voiceMode;
    const voiceButton = document.querySelector('#toggle-voice-btn i');
    voiceButton.className = voiceMode ? 'fas fa-volume-up' : 'fas fa-volume-mute';
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const themeButton = document.querySelector('#toggle-theme-btn i');
    themeButton.className = document.body.classList.contains('dark-theme') ? 'fas fa-sun' : 'fas fa-moon';
}

function clearChat() {
    document.getElementById("chat-messages").innerHTML = '';
}

function toggleVoiceInput() {
    if (!recognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById("user-input").value = transcript;
            sendMessage();
        };
        recognition.onend = function() {
            document.getElementById("voice-input-btn").innerHTML = '<i class="fas fa-microphone"></i>';
        };
    }
    if (recognition.start) {
        recognition.start();
        document.getElementById("voice-input-btn").innerHTML = '<i class="fas fa-stop"></i>';
    } else {
        recognition.stop();
        document.getElementById("voice-input-btn").innerHTML = '<i class="fas fa-microphone"></i>';
    }
}

function showHelp() {
    const modal = document.getElementById("help-modal");
    modal.style.display = "block";
}

function closeHelp() {
    document.getElementById("help-modal").style.display = "none";
}

let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    displayMessage("🎉 Congratulations! You've unlocked the secret laughter mode!", 'bot');
    document.body.style.animation = 'rainbow-bg 5s linear infinite';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 10000);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("send-btn").addEventListener("click", sendMessage);
    document.getElementById("user-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
    document.getElementById("voice-input-btn").addEventListener("click", toggleVoiceInput);
    document.getElementById("toggle-voice-btn").addEventListener("click", toggleVoice);
    document.getElementById("toggle-theme-btn").addEventListener("click", toggleTheme);
    document.getElementById("clear-chat-btn").addEventListener("click", clearChat);
    document.getElementById("show-help-btn").addEventListener("click", showHelp);
    document.getElementsByClassName("close")[0].addEventListener("click", closeHelp);

    displayMessage("Welcome to your Comic Relief Counselor! How can I brighten your day? Ask me anything!", 'bot');
});

window.onclick = function(event) {
    const modal = document.getElementById("help-modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
