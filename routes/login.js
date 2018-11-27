const express = require("express");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function post (req, res) {
    if (!req.body) return res.send({ok: false});
    const { user, pass } = req.body; 
    if (!user || !pass) return res.send({ok: false});

    console.log(req.ip).replace(/::/g, '');

    res.send(`{"ok": false}`);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function get (req, res) {
    res.sendFile(process.cwd() + "/views/login.html");
}

module.exports = { post, get };