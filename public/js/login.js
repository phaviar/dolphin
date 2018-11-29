var usernameRegex = /^[A-Za-z0-9_]{2,32}$/;
var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,100}$/;

// If they have a token in their local storage then skip login and use that
window.onload = function () {
    var token = localStorage.getItem("token");
    if (token) {
        sendForm({ token: token }, true);
    }
};

function onFormSubmit () {
    var username = document.getElementById("username_input");
    var password = document.getElementById("password_input");

    if (!usernameRegex.test(username.value)) {
        return username.classList.add("is-danger");
    } else {
        username.classList.add("is-success");
    }

    if (!passwordRegex.test(password.value)) {
        return password.classList.add("is-danger");
    } else {
        password.classList.add("is-success");
    }

    var pass = btoa(password.value);
    var user = username.value;
    sendForm({ user: user, pass: pass }, false);
}

function sendForm (data, tokenAuth) {
    fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(function (response) { return response.json(); })
        .then(tokenAuth ? tokenResponse : passResponse)
        .catch(alert);
}

function tokenResponse ({ error }) {
    if (!error) {
        // valid token
        redirect("/chat");
    } else if (error === "unknown") {
        // User does not exist, if token auth delete token and try with pass
    } else if (error === "incorrect") {
        // incorrect creds, if token auth delete
    }
}

function passResponse ({ error, token }) {
    if (!error) {
        // valid password
    } else if (error === "unknown") {

        // User does not exist, if token auth delete token and try with pass
    } else if (error === "incorrect") {
        document.getElementById("error").setAttribute("disabled", false);
        // incorrect creds, if token auth delete
    }
}

function redirect (path) {
    window.location.replace(window.location.hostname + path);
}