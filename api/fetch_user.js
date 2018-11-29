const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await fetchUser(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function fetchUser (req, res) {
    if (!req.body.id) return;

    let id = req.body.id.toString();
    if (!validate.id(id)) return;

    const user = await req.app.database.getUser(id);
    res.send({ username: user.username });

}

module.exports = post;
