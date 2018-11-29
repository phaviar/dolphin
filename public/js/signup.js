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
    var name = username.value,
        pass = password.value,
        re_pass = re_password.value;

    // Validate Form
    if (!usernameRegex.test(name)) {
        username.classList.remove("is-success");
        return username.classList.add("is-danger");
    }
    username.classList.remove("is-danger");
    username.classList.add("is-success");


    if (!passwordRegex.test(pass)) {
        password.classList.remove("is-success");
        return password.classList.add("is-danger");
    }
    password.classList.remove("is-danger");
    password.classList.add("is-success");


    if (pass !== re_pass) {
        re_password.classList.remove("is-success");
        return re_password.classList.add("is-danger");
    }
    re_password.classList.add("is-danger");
    re_password.classList.add("is-success");


    // Send as base64 because its the safest encryption
    pass = btoa(password.value);
    sendForm({ user: name, pass: pass }, false);
}

function sendForm (data, tokenAuth) {
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