const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    let error = newUser(req, res);
    res.send({error});
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function newUser(req, res) {
    if (!req.body.user || !req.body.pass) return "invalid";

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

module.exports = post;