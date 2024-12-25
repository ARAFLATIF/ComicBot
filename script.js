const responses = {
    jokes: [
        "Why don't scientists trust atoms? Because they make up everything!",
        "I told my computer I needed a break, and now it's frozen.",
        "Why don't skeletons fight each other? They don't have the guts!",
        "Parallel lines have so much in common. It's a shame they'll never meet.",
        "Why was the math book sad? It had too many problems.",
        "I'm reading a book on anti-gravity. It's impossible to put down!",
        "Did you hear about the claustrophobic astronaut? He just needed a little space.",
        "Why don't eggs tell jokes? They'd crack each other up.",
        "I used to be addicted to soap, but I'm clean now.",
        "What do you call a fake noodle? An impasta!"
    ],
    motivational: [
        "The best way to predict the future is to create it. – Peter Drucker",
        "You are braver than you believe, stronger than you seem, and smarter than you think.",
        "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
        "Happiness is not something ready-made. It comes from your own actions. – Dalai Lama",
        "Act as if what you do makes a difference. It does. – William James",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. – Winston Churchill",
        "The only way to do great work is to love what you do. – Steve Jobs",
        "Believe you can and you're halfway there. – Theodore Roosevelt",
        "Your time is limited, don't waste it living someone else's life. – Steve Jobs",
        "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt"
    ],
    meditation: [
        "Close your eyes. Breathe in deeply. Imagine you're in a peaceful meadow... and a llama in a bowtie approaches to tell you a joke.",
        "Relax your shoulders. Let your mind float... like a balloon in the breeze—filled with helium and bad puns.",
        "Breathe deeply. Picture yourself by a calm ocean. Each wave whispers a terrible dad joke. Let the laughter wash over you.",
        "Visualize a serene forest. The trees are wise... and they're all competing in a stand-up comedy contest.",
        "Focus on your breath. In... out... in... out... Now imagine your breath smells like cotton candy. Giggle softly.",
        "Picture a peaceful mountain. At the top, there's a wise guru... telling knock-knock jokes to passing clouds.",
        "Imagine a tranquil garden. The flowers are gossiping about the bees' dance moves. Smile at their silliness.",
        "Envision a calm lake. The fish beneath the surface are practicing their underwater comedy routines.",
        "See yourself floating on a cloud. It's soft, fluffy, and occasionally tells you cheesy one-liners.",
        "Visualize a quiet room. The furniture is secretly practicing for a stand-up comedy night when you're not looking."
    ],
    advice: [
        "Remember, if plan A doesn't work, the alphabet has 25 more letters.",
        "Always trust a glue salesman. They tend to stick to their word.",
        "If at first you don't succeed, skydiving is not for you.",
        "The early bird might get the worm, but the second mouse gets the cheese.",
        "Never test the depth of the water with both feet.",
        "If you think nobody cares if you're alive, try missing a couple of payments.",
        "Always borrow money from a pessimist. They don't expect it back.",
        "Do not argue with an idiot. They will drag you down to their level and beat you with experience.",
        "Knowledge is knowing a tomato is a fruit; wisdom is not putting it in a fruit salad.",
        "The last thing I want to do is hurt you. But it's still on my list."
    ],
    greetings: [
        "Hello there! How can I brighten your day?",
        "Hi! Ready for some comic relief?",
        "Greetings! I'm here to make you smile.",
        "Hey! Feeling good or need a laugh?"
    ],
    notFeeling: [
        "I'm sorry you're not feeling great. Would you like a joke to cheer you up?",
        "Tough day, huh? How about a motivational quote to lift your spirits?",
        "Feeling down? Would you like a silly meditation prompt to help you relax?",
        "Sometimes life can be challenging. Would you like a joke, a motivational quote, or some advice?"
    ],
    affirmative: [
        "Great! Here's what you asked for: ",
        "Excellent choice! Here you go: ",
        "Coming right up! ",
        "Alright, here's something for you: "
    ],
    negative: [
        "No problem! Is there something else I can help you with?",
        "Okay, no worries. What would you like instead?",
        "Sure thing. What else can I do for you?",
        "Alright. How else can I brighten your day?"
    ]
};

let voiceMode = false;
const synth = window.speechSynthesis;
let recognition;
let lastResponseType = '';

function getResponse(type) {
    const list = responses[type];
    return list[Math.floor(Math.random() * list.length)];
}

function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim().toLowerCase();
    if (!userInput) return;

    displayMessage(userInput, 'user');
    
    let botResponse;
    if (userInput === "yes" || userInput === "sure" || userInput === "okay") {
        if (lastResponseType) {
            botResponse = getResponse('affirmative') + getResponse(lastResponseType);
            lastResponseType = '';
        } else {
            botResponse = "Great! What would you like? A joke, some motivation, a meditation prompt, or advice?";
        }
    } else if (userInput === "no" || userInput === "nope") {
        botResponse = getResponse('negative');
        lastResponseType = '';
    } else if (userInput.includes("hello") || userInput.includes("hi") || userInput.includes("hey")) {
        botResponse = getResponse('greetings');
    } else if (userInput.includes("not feeling") || userInput.includes("feeling bad") || userInput.includes("sad")) {
        botResponse = getResponse('notFeeling');
        lastResponseType = 'jokes';
    } else if (userInput.includes("joke")) {
        botResponse = getResponse('jokes');
    } else if (userInput.includes("motivat") || userInput.includes("inspir")) {
        botResponse = getResponse('motivational');
    } else if (userInput.includes("meditat") || userInput.includes("relax")) {
        botResponse = getResponse('meditation');
    } else if (userInput.includes("advice") || userInput.includes("help")) {
        botResponse = getResponse('advice');
    } else {
        botResponse = "I'm not sure how to respond to that. Try asking for a joke, motivation, meditation, or advice!";
    }

    setTimeout(() => displayMessage(botResponse, 'bot'), 500);
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
    const voiceButton = document.querySelector('.features button:first-child i');
    voiceButton.className = voiceMode ? 'fas fa-volume-up' : 'fas fa-volume-mute';
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const themeButton = document.querySelector('.features button:nth-child(2) i');
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

document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function showHelp() {
    const modal = document.getElementById("help-modal");
    modal.style.display = "block";
}

document.getElementsByClassName("close")[0].onclick = function() {
    document.getElementById("help-modal").style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("help-modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
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

window.onload = () => {
    displayMessage("Welcome to your Comic Relief Counselor! How can I brighten your day? Ask for a joke, some motivation, a meditation prompt, or a bit of advice!", 'bot');
};
