var token = localStorage.getItem("token");
var id = atob(token).split(".")[0];
var username;
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
async function run () {
    let username = await getUsername(id);
    let app = new Vue({
        el: '#app',
        data: {
            messages: [{
                content: 'Doggos',
                author: '',
                ausername: 'HexiaLabs'
            }],
            username: username
        }
    });
    setTimeout(() => {
        document.getElementById('loading_modal').classList.remove('is-active');
    }, 250);
    var dropdown = document.querySelector('.dropdown');
    var global = document.querySelector('html');
    var deletemsg = document.getElementById('deletemsg');
    var profile = document.getElementById('profile');
    var chatbody = document.getElementById('chatbody');
    var profile_modal = document.getElementById('profile_modal');
    var profile_modal_close = document.getElementById('profile_modal_close');
    var input_message = document.getElementById('input_message');
    var socket = io.connect('http://localhost:8083/chat')
    dropdown.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdown.classList.toggle('is-active');
    });
    // Closes the dropdown if anything else is clicked. ^ Takes priority if dropdown is clicked.
    global.addEventListener('click', (event) => {
        // event.stopPropagation(); disabled for now, might need to use this in other things
        dropdown.classList.remove('is-active');
    });
    deletemsg.addEventListener('click', (event) => {

        // Check if id/snowflake matchs with msg author id/snowflake in database
    });
    profile.addEventListener('click', (event) => {
        profile_modal.classList.add('is-active');
    });
    profile_modal_close.addEventListener('click', (event) => {
        profile_modal.classList.remove('is-active');
    });
    input_message.addEventListener('keypress', (event) => {
        if (event.keyCode == 13 && !event.shiftKey) { // Check if the user doesn't mean new line and send.
            socket.emit('message_create', { token: token, content: input_message.value });

            app.messages.push({ ausername: username, author: id, content: input_message.value });
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
