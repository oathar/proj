// Element references
const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Hugging Face API Configuration
const API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';
const API_KEY = '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';

// Function to create a message element
function addMessage(content, sender) {
    const messageElement = document.createElement('div');
    messageElement.textContent = content;
    messageElement.classList.add('message', sender); 
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Send message to Hugging Face API and get response
async function sendMessageToAI(userMessage) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputs: userMessage
        }),
    });

    const data = await response.json();
    console.log("Hugging Face Response:", data);

    // Handle API error
    if (data.error) {
        throw new Error(`Error from Hugging Face API: ${data.error}`);
    }

    return data[0].generated_text; // Assuming the model returns the text under generated_text
}

// Event listener for sending messages
sendBtn.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Display user message
    addMessage(userMessage, 'user');
    userInput.value = '';

    // Get AI response from Hugging Face API
    try {
        const botMessage = await sendMessageToAI(userMessage);
        addMessage(botMessage, 'bot'); // Display the bot's response
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, something went wrong. Please try again.', 'bot');
    }
});

// Mood Tracker Elements
const moodInput = document.getElementById('mood-rating');
const moodText = document.getElementById('mood-rating-text');
const moodSubmitBtn = document.getElementById('mood-submit');
const moodList = document.getElementById('mood-list');

// Mood Text Map
const moodMap = {
    1: 'Very Sad',
    2: 'Sad',
    3: 'Neutral',
    4: 'Happy',
    5: 'Very Happy',
}

// Update Mood Text
function updateMoodText() {
    moodText.textContent = moodMap[moodInput.value];
}
moodInput.addEventListener('input', updateMoodText);

// Mood Tracker Functionality
moodSubmitBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    const moodRating = moodInput.value;
    const timestamp = new Date();
    saveMood(moodRating, timestamp);
    loadMoods();
});

// Save Mood to localStorage
function saveMood(moodRating, timestamp) {
    const moodData = {
        mood: moodRating,
        timestamp: timestamp
    };
    const storedMoods = localStorage.getItem("moods");
    if (storedMoods) {
        const moods = JSON.parse(storedMoods);
        moods.push(moodData);
        localStorage.setItem("moods", JSON.stringify(moods));
    } else {
        localStorage.setItem("moods", JSON.stringify([moodData]));
    }
}

// Load Moods from localStorage
function loadMoods() {
    moodList.innerHTML = '';
    const storedMoods = localStorage.getItem("moods");
    if (storedMoods) {
        const moods = JSON.parse(storedMoods);
        moods.forEach(moodData => {
            const formattedDate = new Date(moodData.timestamp).toLocaleString();
            const listItem = document.createElement('li');
            listItem.textContent = `Mood: ${moodMap[moodData.mood]} on ${formattedDate}`;
            moodList.appendChild(listItem);
        });
    } else {
        console.log("No mood data found.");
    }
}

loadMoods();