var usernameRegex = /^[A-Za-z0-9_]{2,32}$/;
var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,100}$/;

// If they have a token in their local storage then skip login and use that
window.onload = function () {
    var token = localStorage.getItem("token");
    if (token) {
        redirect("/login");
    }
};

function onFormSubmit () {
    var username = document.getElementById("username_input");
    var password = document.getElementById("password_input");
    var re_password = document.getElementById("retype_password_input");
    var user = username.value,
        pass = password.value,
        re_pass = re_password.value;

    if (!validateInput(username, usernameRegex.test(user))) 
        return;
    if (!validateInput(password, passwordRegex.test(pass)))
        return;
    if (!validateInput(re_pass, pass === re_pass))
        return;

    // Send as base64 because its the safest encryption
    pass = btoa(pass);
    sendForm({ user: user, pass: pass }, false);
}

function sendForm (data) {
    fetch("/new_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(function (response) { return response.json(); })
        .then(passResponse)
        .catch(alert);
}

function validateInput (elem, test) {
    if (test) {
        elem.classList.remove("is-danger");
        elem.classList.add("is_success");
        return true;
    }
    elem.classList.remove("is-success");
    elem.classList.add("is_danger");
    return false;
}

function passResponse (res) {
    if (res.ok) {
        // valid password
        localStorage.setItem("token", res.token);
        redirect("/chat");
    } else {
        document.getElementById("error").setAttribute("disabled");
    }
}

function redirect (path) {
    window.location.replace(window.location.hostname + path);
}