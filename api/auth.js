const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

let ok = false;

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function post (req, res) {
    if (req.body.user && req.body.pass) { 
        ok = !!passwordAuth(req, res);
    } else if (req.body.token) {
        ok = !!tokenAuth(req, res);
    }

    res.send({ ok });
}

async function passwordAuth (req, res) {
    // Password authentication
    // Return a token to be set in local storage, then redirect to chat with that token
    // If token fails they return here
    let { user, pass } = req.body;
    pass = Buffer.from(pass, "base64").toString();

    if (!validate.username(user) || !validate.password(pass))
        return;

    const userData = await req.app.database.getUser(user);
    if (!userData) return;

    if (!(await auth.comparePass(pass, userData.password)))
        return;

    res.setHeader("authorization", userData.token);
    return true;
}

async function tokenAuth (req, res) {
    // Token authentication
    // Immediatelly redirect to chat if valid
    const { token } = req.body;
    
    if (!validate.token(token)) return;

    const tokenData = auth.destructToken(token);
    const user = req.app.database.getUser(tokenData.id);
    if (!user) return;

    if (user.token != token) return;

    return true;
}

module.exports = post;