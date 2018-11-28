var usernameRegex = /^[A-Za-z0-9_]{2,32}$/;
var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,100}$/;

// If they have a token in their local storage then skip login and use that
window.onload = function () {

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
  sendFormData(username.value, pass);
}

function sendFormData (user, pass) {
  fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user: user, pass: pass })
    }).then(function (response) { return response.json(); })
    .then(onRequestResponse)
    .catch(alert);
}

function onRequestResponse (res) {
  alert(res.ok);
}
