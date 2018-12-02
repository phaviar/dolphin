// Used by login.html, signup.html

var usernameRegex = /^[A-Za-z0-9_]{2,32}$/;
var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,100}$/;

// If they have a token in their local storage then skip login and use that
window.onload = function () {
    var token = localStorage.getItem("token");
    if (token) window.location.replace("/chat");
};

function onFormSubmit () {
    var username = document.getElementById("username_input");
    var password = document.getElementById("password_input");
    var user = username.value,
        pass = password.value;

    if (!validateInput(username, usernameRegex.test(user))) return;
    if (!validateInput(password, passwordRegex.test(pass))) return;

    if (window.location.pathname === "/signup") {
        var re_password = document.getElementById("retype_password_input");
        var re_pass = re_password.value;
        if (!validateInput(re_password, pass === re_pass)) return;
        re_password.value = "";
    }
    password.value = "";
    pass = btoa(pass);
    sendForm({ user: user, pass: pass });
}

function sendForm (data) {
    var url = window.location.pathname === "/signup" ?
        "/api/new_user" : "/api/auth";
    fetch(url, {
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
        elem.classList.add("is-success");
        return true;
    }
    elem.classList.remove("is-success");
    elem.classList.add("is-danger");
    return false;
}

function passResponse (res) {
    if (res.ok) {
        // valid password
        localStorage.setItem("token", res.token);
        window.location.replace("/chat");
    } else {
        document.getElementById("error").style = "display:show;";
    }
}