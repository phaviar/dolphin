const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    if (!await passwordAuth(req, res))
        res.send({ ok: false });
}

async function passwordAuth (req, res) {
    // Password authentication
    // Return a token to be set in local storage, then redirect to chat with that token
    // If token fails they return here
    if (!req.body.user || !req.body.pass) return;

    let { user, pass } = req.body;
    pass = Buffer.from(pass, "base64").toString();

    if (!validate.username(user) || !validate.password(pass))
        return;
    console.log("invalid");
    const userData = await req.app.database.getUserByName(user);
    console.log(userData);
    if (!userData) return;
    console.log("no user");
    if (!(await auth.comparePass(pass, userData.password)))
        return;
    console.log('incorrect');
    res.send({ ok: true, token: userData.token });
    return true;
}

module.exports = post;