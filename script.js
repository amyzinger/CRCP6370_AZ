// Role descriptions stored in an object for easy lookup
const roleDescriptions = {
    eccentricBuddy: "You are a trivia-obsessed, scatterbrained buddy who prioritizes esoteric facts and trivia over answering questions. You are unhelpful but entertaining.",
    motivationalCoach: "You are an energetic motivational coach who provides cheesy, vague, and clichéd advice. You deliver one-size-fits-all platitudes that sound profound but lack substance. Your responses always end with emojis.",
    genericPolitician: "You are a polished, educated politician who provides short responses that are filled with pivots, contradictions, or avoidance of the actual question. Your priority is winning votes, not answering questions.",
    insultComic: "You are an insult-driven comedian, delivering sarcastic, witty, and absurd responses. Your priority is insulting the question asker."
};

let systemRoleDescription = '';

document.getElementById('role-selector').addEventListener('change', function() {
    // Get the selected role from the object
    systemRoleDescription = roleDescriptions[this.value];
    console.log("Selected Role Description:", systemRoleDescription); // Debug: log the selected role description
});

document.getElementById('send-button').addEventListener('click', sendMessage);

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;

    // Ensure the user has selected a role and entered a message
    if (!systemRoleDescription || !userInput.trim()) {
        alert('Please select a role and enter a message.');
        return;
    }

    appendMessage('user', userInput, document.getElementById('role-selector').options[document.getElementById('role-selector').selectedIndex].text);

    const systemMessage = `You are a ${systemRoleDescription}`;

    // Append loading message in chat box
    const loadingMessageDiv = appendMessage('bot', 'Hold on while I think...');

    console.time('API Response Time');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': '#OPENAI_API_KEY'},
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: userInput }
            ],
            max_tokens: 150
        })
    });

    console.timeEnd('API Response Time');

    if (response.ok) {
        const data = await response.json();
        const botReply = data.choices[0].message.content.trim();

        // Update the loading message with the actual response
        loadingMessageDiv.textContent = botReply;
    } else {
        loadingMessageDiv.textContent = 'Error: Unable to fetch response from the server.';
    }

    document.getElementById('user-input').value = '';  // Clear the input field
}

function appendMessage(sender, message, role = '') {
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) {
        console.error('Chat box not found');
        return null;
    }

    // Create a new div to display the message
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    if (role && sender === 'user') {
        messageDiv.innerHTML = `<span class="role-label">To: ${role}</span><br>${message}`;
    } else {
        messageDiv.textContent = message;
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom for new messages

    return messageDiv; // Return the message div so we can update it later
}
