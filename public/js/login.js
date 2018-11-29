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

function tokenResponse (res) {
    if (res.ok) {
        // valid token
        redirect("/chat");
    } else {
        localStorage.removeItem("token");
    }
}

function passResponse (res) {
    if (res.ok) {
        // valid password
        localStorage.setItem("token", res.token);
        redirect("/chat");
    } else {
        document.getElementById("error").setAttribute("disabled", false);
    }
}

function redirect (path) {
    window.location.replace(window.location.hostname + path);
}