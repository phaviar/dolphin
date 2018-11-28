const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

const fail = {ok: false};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function post (req, res) {
    if (req.body.user && req.body.pass) {
        // Password authentication
        // Return a token to be set in local storage, then redirect to chat with that token
        // If token fails they return here
        let { user, pass } = req.body;
        pass = Buffer.from(pass, "base64").toString();
        if (!validate.username(user) || !validate.password(pass)) return res.send(fail);
        const userData = await req.app.database.getUser(user);
        if (!userData) return res.redirect("/signup");

        if (!(await auth.comparePass(pass, userData.password))) return res.send(fail);

        res.setHeader("authorization", userData.token);

        res.send({ok: true});

    } else if (req.header("authorization")) {
        // Token authentication
        // Immediatelly redirect to chat if valid

    } else return res.send(fail);

}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function get (req, res) {
    res.sendFile(process.cwd() + "/views/login.html");
}

module.exports = { post, get };