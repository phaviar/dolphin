var token = localStorage.getItem("token");
if (!token) window.location.replace("/login");

var id = atob(token).split(".")[0];
var username;
var cache = [];
var messages;

var socket = io.connect('http://localhost:8083/chat', {
    transportOptions: {
        polling: {
            extraHeaders: {
                "authentication": token
            }
        }
    }
});


async function getUsername (id) {
    return new Promise((resolve, reject) => {
        fetch('/api/fetchuser', { // Load vals
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id })
            }).then(function (response) { return response.json(); })
            .then((parsed) => {
                if (parsed.username) {
                    resolve(parsed.username);
                } else { reject() }
            }).catch(console.log);
    });
}
async function fetchMessages () {
    return new Promise((resolve, reject) => {
        fetch('/api/fetchmessages', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: token })
            }).then(function (response) { return response.json(); })
            .then((parsed) => {
                if (parsed.messages) {
                    resolve(parsed.messages);
                } else { reject() }
            }).catch(console.log);
    });
}
async function mapUsernames (message) {
    if (!cache.includes(message.author)) {
        let name = await getUsername(message.author);
        cache.push({ id: message.author, username: name });
    }
    return message.ausername = cache.find(user => user.id === message.author).username;
}
// Creates event listeners for all dropdowns
function update () {
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

socket.on('disconnect', () => {
    window.location.replace("/login");
});

function init () {
    return new Promise((resolve, reject) => {
        getUsername(id).then(usernameReturned => {
            username = usernameReturned;
        }).catch(console.log);
        fetchMessages().then(messagesReturned => {
            messagesReturned.map(mapUsernames); // Cache usernames & use them
            messages = messagesReturned.sort((a, b) => {
                return a.timestamp - b.timestamp; // Sort messages by timestamp.
            });

            resolve(messagesReturned)
        }).catch(console.log);
    })
}
(async () => {
    messages = await init(); // This initalizes the message history & the logged in user's info.

    // CREATE VUE INSTANCE
    let app = new Vue({
        el: '#app',
        data: {
            messages: messages,
            username: username,
            id: id
        }
    });

    // SOCKET IO LISTENERS
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
    socket.on('message_delete', data => {
        app.messages.splice(app.messages.indexOf(app.messages.find(message => message.id === data.id)), 1);
    });
    socket.on('disconnect', () => {
        window.location.replace("/login");
    });

    // DOM 
    var global = document.querySelector('html'); // Global DOM, used for click & keyboard events
    var messagebody = document.getElementById('messages'); // This is used to control the scroll of the messages.
    var chatbody = document.getElementById('chatbody');
    var input_message = document.getElementById('input_message');

    setTimeout(() => {
        messages.push(); // Very important, updates usernames
        messagebody.scrollTop = messagebody.scrollHeight; // Scroll to bottom of messages

        document.getElementById('loading_modal').classList.remove('is-active');
    }, 10);

    update(); // This initalizes the onlickevents of the dropdown.

    // This is for typing sending messages
    input_message.addEventListener('keypress', (event) => {
        // Check if the user doesn't mean new line and send.
        if (event.keyCode == 13 && !event.shiftKey && input_message.value.trim().length > 0) {
            socket.emit('message_create', { token: token, content: input_message.value });
            input_message.value = '';
            // Un focus the message send textbox, don't worry we auto refocus it when they start typing again
            input_message.blur();
        }
    });

    // This closes all dropdowns when anything except a dropdown is clicked.
    global.addEventListener('click', (event) => {
        document.querySelectorAll('.dropdown').forEach(drop => {
            drop.classList.remove('is-active');
        });
    });

    // This focuses the textbox when the user starts to type. This is a really nice thing to have.
    global.addEventListener('keypress', (event) => {
        if (event.target.id === chatbody.id) {
            input_message.focus();
        }
    });

})();