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
    var user = username.value,
        pass = password.value;

    if (!validateInput(username, usernameRegex.test(user))) return;
    if (!validateInput(password, passwordRegex.test(pass))) return;

    pass = btoa(pass);
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

function validateInput (elem, test) {
    if (test) {
        elem.classList.remove("is-danger");
        elem.classList.add("is-success");
        return true;
    }
    elem.classList.remove("is-success");
    elem.classList.add("is-danger");
    return false;
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
