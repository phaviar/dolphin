const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

let error = false;

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function post (req, res) {
    if (req.body.user && req.body.pass) { 
        error = passwordAuth(req, res);
    } else if (req.body.token) {
        error = tokenAuth(req, res);
    }
    // else
    res.send({ error });
}

async function passwordAuth (req, res) {
    // Password authentication
    // Return a token to be set in local storage, then redirect to chat with that token
    // If token fails they return here
    let { user, pass } = req.body;
    pass = Buffer.from(pass, "base64").toString();

    if (!validate.username(user) || !validate.password(pass))
        return "invalid";

    const userData = await req.app.database.getUser(user);
    if (!userData) return "unknown";

    if (!(await auth.comparePass(pass, userData.password)))
        return "incorrect";

    res.setHeader("authorization", userData.token);
    return false;
}

async function tokenAuth (req, res) {
    // Token authentication
    // Immediatelly redirect to chat if valid
    const { token } = req.body;
    
    if (!validate.token(token)) return "invalid";

    const tokenData = auth.destructToken(token);
    const user = req.app.database.getUser(tokenData.id);
    if (!user) return "unknown";

    if (user.token != token) return "incorrect";

    return false;
}

module.exports = post;