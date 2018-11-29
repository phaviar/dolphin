const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

function post (req, res) {
    let ok = !!newUser(req, res);
    res.send({ ok });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function newUser (req, res) {
    if (!req.body.user || !req.body.pass) return;

    let { user, pass } = req.body;
    pass = Buffer.from(pass, "base64").toString();

    if (!validate.username(user) || !validate.password(pass))
        return;

    if (await req.app.database.hasUsername(user)) return;

    const id = req.app.snowflake.nextId();
    const token = auth.createToken(id);
    const passHash = auth.createHash(pass);

    await req.app.database
        .newUser({ id, username: user, password: passHash, token });

    res.setHeader("authorization", token);
    return true;
}

module.exports = post;