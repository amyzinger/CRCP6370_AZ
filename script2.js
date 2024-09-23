// Initialize with an empty role description
let systemRoleDescription = '';

// Enable the input and send button once a role is selected
document.getElementById('role-selector').addEventListener('change', function() {
    systemRoleDescription = this.options[this.selectedIndex].value; // Use value, not text, to pass the persona description
    console.log("Selected Role Description:", systemRoleDescription); // Debug: log the selected role description

    // Enable input and send button once a role is selected
    document.getElementById('user-input').disabled = false;
    document.getElementById('send-button').disabled = false;
});

document.getElementById('send-button').addEventListener('click', sendMessage);

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    // Append user message with role title
    appendMessage('user', userInput, document.getElementById('role-selector').options[document.getElementById('role-selector').selectedIndex].text);

    // Construct the system message with the selected role/persona description
    const systemMessage = `You are a ${systemRoleDescription}`; // Use description to set the behavior
    console.log("System Message:", systemMessage); // Debug: log the system message

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
'Authorization': #OPENAI_API_KEY},
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemMessage },  // Send the role/persona to the API
                { role: 'user', content: userInput }          // Send the user's message
            ],
            max_tokens: 150
        })
    });

    if (response.ok) {
        const data = await response.json();
        const botReply = data.choices[0].message.content.trim();
        appendMessage('bot', botReply);
    } else {
        appendMessage('bot', 'Error: Unable to fetch response from the server.');
    }

    // Clear the input field after sending the message
    document.getElementById('user-input').value = '';
}

function appendMessage(sender, message, role = '') {
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) {
        console.error('Chat box not found');
        return;
    }

    // Create a new div to display the message
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    // Format the role with the message
    if (role && sender === 'user') {
        messageDiv.innerHTML = `<span class="role-label">To: ${role}</span><br>${message}`;
    } else {
        messageDiv.textContent = message;
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom for new messages
}
