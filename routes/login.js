const express = require("express");
const auth = require("../app/auth.js");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function post (req, res) {
    if (req.body.user && req.body.pass) {
        // Password authentication
        
    } else if (req.header("authorization")) {
        // Token authentication

    }

}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function get (req, res) {
    res.sendFile(process.cwd() + "/views/login.html");
}

module.exports = { post, get };