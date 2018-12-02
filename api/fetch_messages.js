const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await fetchMessage(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function fetchMessage (req, res) {
    if (!req.body.token) return res.send({ ok: false });

    let token = req.body.token;
    if (!validate.token(token)) return res.send({ ok: false });
    // Need to use their token to find messages that they can see, not all
    const messages = await req.app.database.fetchMessages();
    if (!messages) return res.send({ ok: false });
    res.send({ ok: true, messages: messages });
}

module.exports = post;
