const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await decontructToken(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function decontructToken (req, res) {
    if (!req.body.token);

    let token = req.body.token;
    if (!validate.token(token));

    const result = auth.destructToken(token);
    res.send(result);

}

module.exports = post;
