var token = localStorage.getItem("token");
var id = atob(token).split(".")[0];
var username;
var cache = [];
var socket = io.connect('http://localhost:8083/chat');
if (!token) window.location.replace("/login");
async function getUsername (id) {
    return await fetch('/api/fetchuser', { // Load vals
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id })
        }).then(function (response) { return response.json(); })
        .then((parsed) => { return parsed.username; }).catch(alert);
}
async function fetchMessages () {
    return await fetch('/api/fetchmessages', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: token })
        }).then(function (response) { return response.json(); })
        .then((parsed) => { return parsed.messages; }).catch(alert);
}
async function mapUsernames (message) {
    if (!cache.includes(message.author)) {
        let name = await getUsername(message.author);
        cache.push({ id: message.author, username: name });
    }
    return message.ausername = cache.find(user => user.id === message.author).username;
}
async function update () {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', (event) => {
            event.stopPropagation();
            document.querySelectorAll('.dropdown').forEach(drop => {
                drop.classList.remove('is-active');
            });
            dropdown.classList.toggle('is-active');
        });
    });
    document.querySelectorAll('#deletemsg').forEach(deletemsg => {
        deletemsg.addEventListener('click', (event) => {
            event.stopPropagation();
            document.querySelectorAll('.dropdown').forEach(drop => {
                drop.classList.remove('is-active');
            });
            let messageid = deletemsg.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('div')[0].innerHTML;
            socket.emit('message_delete', { token: token, id: messageid });
            // Check if id/snowflake matchs with msg author id/snowflake in database serverside
        });
    });
}
async function run () {
    let username = await getUsername(id);
    let messages = await fetchMessages();
    messages.map(mapUsernames); // Cache usernames & use them
    messages.sort((a, b) => {
        return a.timestamp - b.timestamp; // Sort messages by timestamp, yes this is needed.
    });

    let app = new Vue({
        el: '#app',
        data: {
            messages: messages,
            username: username,
            id: id
        }
    });
    var global = document.querySelector('html');
    var profile = document.getElementById('profile');
    var messagebody = document.getElementById('messages');
    var chatbody = document.getElementById('chatbody');
    var profile_modal = document.getElementById('profile_modal');
    var profile_modal_close = document.getElementById('profile_modal_close');
    var input_message = document.getElementById('input_message');
    setTimeout(() => {
        messages.push(); // Very important, updates usernames
        document.getElementById('loading_modal').classList.remove('is-active');
        messagebody.scrollTop = messagebody.scrollHeight; // Scroll to bottom of messages
    }, 250);
    socket.on('message_create', async data => {
        if (!cache.includes(data.author)) {
            let name = await getUsername(data.author);
            cache.push({ id: data.author, username: name });
        }
        app.messages.push({ id: data.id, timestamp: data.timestamp, ausername: cache.find(user => user.id === data.author).username, author: data.author, content: data.content });
        setTimeout(() => {
            messagebody.scrollTop = messagebody.scrollHeight; // Scroll to bottom of messages
            update();
        }, 50); // Delay is needed for vue to render
    });
    socket.on('message_delete', async data => {
        app.messages.splice(app.messages.indexOf(app.messages.find(message => message.id === data.id)), 1);
    });
    update();
    // Closes the dropdown if anything else is clicked. ^ Takes priority if dropdown is clicked.
    global.addEventListener('click', (event) => {
        // event.stopPropagation(); disabled for now, might need to use this in other things
        document.querySelectorAll('.dropdown').forEach(drop => {
            drop.classList.remove('is-active');
        });
    });
    profile.addEventListener('click', (event) => {
        profile_modal.classList.add('is-active');
    });
    profile_modal_close.addEventListener('click', (event) => {
        profile_modal.classList.remove('is-active');
    });
    input_message.addEventListener('keypress', (event) => {
        if (event.keyCode == 13 && !event.shiftKey && input_message.value.trim().length > 0) { // Check if the user doesn't mean new line and send.
            socket.emit('message_create', { token: token, content: input_message.value });
            input_message.value = '';
            input_message.blur(); // Un focus
        }
    });
    global.addEventListener('keypress', (event) => {
        if (event.target.id === chatbody.id) {
            input_message.focus(); // This is a really nice thing to have.
        }
    });
}
run();